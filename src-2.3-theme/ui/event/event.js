/*!
* Copyright (c) 2012 SK C&C Co., Ltd. All rights reserved.
*
* This software is the confidential and proprietary information of SK C&C.
* You shall not disclose such confidential information and shall use it
* only in accordance with the terms of the license agreement you entered into
* with SK C&C.
*
* Alopex UI Javascript Event Module.
*
* Date : 20140212
*/
(function($) {
  var useClickFallback = true;
  var eventns = '.alopexUiEventModel';
  function _dbg(msg) {
	  $('.alopex-event-debug').text(msg)
  }
  //__ALOG('loaded');
  var state = {}, currentState = {}, istouch, statecount = 0, trigger = {},
  timeoutTrigger = [], threshold = {}, event = {}, eventCancelPair = {},
  allEvent = [], movingEvent = [], processor = {},
  startevent, moveevent, endevent, name;

  function createState() {
    var obj = {};
    obj.id = statecount++;
    obj.entry = obj.doing = obj.exit = null;
    obj.transition = [];
    return obj;
  }

  function createTransition(to, trigger, guard, effect) {
    var obj = {};
    obj.to = to || null;
    obj.trigger = trigger || null;
    obj.guard = guard || null;
    obj.effect = effect || null;
    return obj;
  }

  //system base setup
  istouch = 'ontouchstart' in window;
  if(istouch) {
	  useClickFallback = false;
  }
  if(false) {
    startevent = (istouch ? 'touchstart' : 'mousedown')+eventns;
    moveevent = (istouch ? 'touchmove' : 'mousemove')+eventns;
    endevent = istouch ? 'touchend'+eventns+' touchcancel'+eventns : 'mouseup'+eventns;
  } else {
    startevent = istouch ? 'touchstart' : 'mousedown';
    startevent += eventns;
    startevent += ' keydown' + eventns;
    moveevent = istouch ? 'touchmove' : 'mousemove';
    moveevent += eventns;
    endevent = istouch ? 'touchend'+eventns+' touchcancel'+eventns : 'mouseup'+eventns;
    endevent += ' keyup' + eventns;
  }
  //define state transition trigger
  trigger.down = null;
  trigger.move = null;
  trigger.up = null;
  trigger.timeout = null;

  for (name in trigger) {
    trigger[name] = name;
  }

  //define supported event
  event.pressed = null;
  event.unpressed = null;
  event.move = null;
  //hover event
  event.hoverstart = null;
  event.hoverend = null;
  event.hovering = null;
  //tap event
  event.tap = null;
  event.singletap = null;
  event.doubletap = null;
  event.tripletap = null;
  event.longtap = null;
  //drag event(based on HTML5 drag&drop api behavior)
  event.drag = null;
  event.dragend = null;
  event.dragstart = null;
  event.dragenter = null;
  event.dragleave = null;
  event.dragover = null;
  event.drop = null;
  //swipe event
  event.swipe = null;
  event.swipemove = null;
  event.swipecancel = null;
  event.swipeleft = null;
  event.swiperight = null;
  event.swipedown = null;
  event.swipeup = null;
  //transform event
  event.pinch = null;
  event.rotate = null;
  event.transform = null;
  event.transformmove = null;
  //general gesture event
  event.gesturestart = null;
  event.gesturechange = null;
  event.gestureend = null;

  for (name in event) {
    event[name] = name;
  }

  //20121108 tap과 singletap에 대한 개발자 가이드의 문제 ->
  //tap의 이름을 singletap으로 하고, singletap을 onetimetap이름으로 정의한다.
  event.tap = 'singletap';
  event.singletap = 'onetimetap';

  for (name in event) {
    allEvent.push(event[name]);
  }
  //tap-singletap 이벤트 처리 관련 문제.
  allEvent.push('tap');

  movingEvent = [event.drag, event.dragenter, event.dragleave, event.dragover,
      event.dragstart, event.dragend, event.drop, event.swipe, event.swipemove,
      event.swipecancel, event.pinch, event.rotate, event.transform,
      event.transformmove, event.gesturestart, event.gesturechange,
      event.gestureend];

  //이벤트 비정상 종료시, 이벤트 시작-종료 처리를 위해 사용.
  eventCancelPair[event.swipe] = event.swipecancel;
  eventCancelPair[event.swipemove] = event.swipecancel;
  eventCancelPair[event.swiperight] = event.swipecancel;
  eventCancelPair[event.swipeleft] = event.swipecancel;
  eventCancelPair[event.swipedown] = event.swipecancel;
  eventCancelPair[event.swipeup] = event.swipecancel;
  eventCancelPair[event.pressed] = event.unpressed;
  eventCancelPair[event.hoverstart] = event.hoverend;
  eventCancelPair[event.hovering] = event.hoverend;

  threshold.move_d = 5; // 단위 : px
  threshold.swipe_d = 100; // 단위 : px
  threshold.swipe_v = 100; // 단위 : px/sec
  threshold.longtap_t = 750; // 단위 : ms
  threshold.ntap_t = 250; // 단위 : ms.
  threshold.hover_v = 100;// 단위 : px/sec

  /****************************************************
   * 엘리먼트에 직접 가해지는 raw 이벤트 및 해당 엘리먼트 처리에 대한 low-level함수
   ***************************************************/
  //특정 element로 부터 data-event 값을 이용하여 이벤트 핸들러를 생성한다.
  var attrEventHandler = function(elem, name) {
    if(!elem || !name) {
      return null;
    }
    if(!$(elem).attr('data-'+name)) {
      return null;
    }
    var func = new Function('event, aevent', ''+ $(elem).attr('data-'+name) + ';');
    return func;
  };
  
  var downHandler = function(e) {
    var returnValue = true;
    var actualtrigger = trigger.down;

    if (e.which && !(e.which === 1 || e.which === 13 || e.which === 32)) {
      return;
    }
    
//    if(e.type == 'keydown' && e.target.tagName == "A") {
//      $(e.target).one('click', function(ev){ev.preventDefault();});
//    }
    
    if (e.type === 'touchstart' && e.originalEvent.touches.length > 1) {
      //touch 손가락 증가에 대해서 move로 처리.
      actualtrigger = trigger.move;
    }
    advanceState(actualtrigger, e);
    return returnValue;
  };
  var lp = null; 
  var moveHandler = function(e) {
    //IE7-8에서 mousemove가 무한히 발생.
	if(!istouch) {
	    if(!lp) {
	      lp = {};
	      lp.x = e.pageX;
	      lp.y = e.pageY;
	    } else {
	      if(lp.x === e.pageX && lp.y === e.pageY) {
	        return;
	      }
	      lp.x = e.pageX;
	      lp.y = e.pageY;
	    }
	}
    advanceState(trigger.move, e);
  };

  var upHandler = function(e) {
    var actualtrigger = trigger.up;
    if (e.which && !(e.which === 1 || e.which === 13 || e.which === 32)) {
      //__ALOG(e.which);
      return;
    }
    if (e.type === 'touchend' && e.originalEvent.touches.length > 0) {
      //touch 손가락 감소에 대해서 move로 처리.
      actualtrigger = trigger.move;
    }
    advanceState(actualtrigger, e);
  };

  var isStayingStill = function(e) {
    if ($(currentState.pressedElement)[0] === $(e.target)[0]) {
      return true;
    }
    return false;
  };

  var isMovedOverElement = function(e) {
    if (!currentState.currentElement) {
      return false;
    }
    if (currentState.currentElement !== currentState.previousElement) {
      return true;
    }
    return false;
  };
  
  var _preventDefault = function (e){
    e.preventDefault();
  };

  var extendEventObject = function(eobj, origin) {
    $.each(['target','pageX','pageY','which','metakey',
            'relatedTarget', 'clientX', 'clientY','offsetX','offsetY'], 
      function(idx, val) {
        eobj[val] = origin[val];
      }
    );
    eobj.originalEvent = origin;
    eobj.isOriginalDefaultPrevented = function() {
      return !!this.originalDefaultPrevented;
    };
    eobj.preventOriginalDefault = function() {
      this.originalDefaultPrevented = true;
    };
    eobj.isOriginalPropagationStopped = function() {
      return !!this.originalPropagationStopped;
    };
    eobj.stopOriginalPropagation = function() {
      this.originalPropagationStopped = true;
    };
  };

  //마우스/키보드 외의 수단에서 인위적으로 .click()을 실행하는 경우에 대한 우회책 구현. 
  //data-tap attribute를 가진 엘리먼트에 대한 click에서 이를 처리. 
  $(function(){
    if(!useClickFallback) return;
    $(document.body)
      .off('.alopexworkaround')
      .on('click.alopexworkaround', '[data-tap]', function(e) {
        //label과 input[type="checkbox|radio"] 에 대해서는 우회책을 적용하지 않는다.
        var tagName = String(this.tagName).toUpperCase();
        if(tagName === "LABEL") return;
        if(tagName === "INPUT") {
          var type = String(this.type).toLowerCase();
          if(type === "checkbox" || type === "radio") return;
        }
        //data-tap에 의해 이벤트가 발생했을경우에는 실행할 필요가 없다.
        var $this = $(this);
        var tapped = $this.data('alopex-ui-data-tap');
        $this.data('alopex-ui-data-tap',null);
        if(tapped) { 
          return;
        }
        $this.data('alopex-ui-data-tap-keyup', true);
        var attrEvent = attrEventHandler(this, event.tap);
        if($.isFunction(attrEvent)) {
          e.type = event.tap;
          return attrEvent.call(this, e);
        }
        if(event.tap !== "tap") {
          attrEvent = attrEventHandler(this, "tap");
          if($.isFunction(attrEvent)) {
            e.type = "tap";
            return attrEvent.call(this, e);
          }
        }
      });
  });
  
  var triggerEvent = function(e, elem, eventname) {
    var arg = Array.prototype.slice.call(arguments, 3),
        el = $(elem), eobj = $.Event(eventname);
    if (arg.length && typeof arg[0] === typeof [] && arg[0].length > 0) {
      arg = arg[0];
    }
    //touchcancel이 호출된 경우 무조건 현재 이벤트의 cancelpair를 호출하도록 한다.
    if(e.type==='touchcancel') {
      triggerCancel(e);
      return;
    }
    //data attribute event handler를 생성하고, 일회용으로 bind 함.
    var attrEvent = attrEventHandler(elem, eventname);
    if(attrEvent && $ === window['jQuery']) { //20130323 attribute custom event의 이중실행 방지
      el.one(eventname, attrEvent);
      if(useClickFallback && eventname === "tap") {
        el.data('alopex-ui-data-tap', true);
        if(e.type === "keyup" && el.data('alopex-ui-data-tap-keyup')) {
          el.off(eventname, attrEvent);
          el.data('alopex-ui-data-tap-keyup', null);
          el.data('alopex-ui-data-tap', null);
        }
      }
    }
    
    //singletap-tap 구분에 대한 문제 처리 위한 임시 코드.
    //event.tap이 singletap으로 정의되어 있을 경우 tap이벤트도 같이 발생시키도록 한다.
    if(eventname === event.tap && event.tap === 'singletap') {
      var targ = $.makeArray(arguments);//Array.prototype.slice.call(arguments, 0);
      targ[2] = 'tap';
      triggerEvent.apply(null, targ);
    }
    extendEventObject(eobj, e);
    //event extension에서 우회처리하기 위한 이벤트발생시점의 original type 정보 지정
    if(eventname === "tap" || eventname === "singletap") {
      eobj.origType = e.type;
    }
    el.trigger(eobj, arg);

    if (eobj.isOriginalDefaultPrevented()) {
      try {
        e.preventDefault();
      } catch (err) {
      }
    }
    if (eobj.isDefaultPrevented()) {
      //anchor에 대해서 preventDefault가 지정된 경우,
      //click핸들러에 일회용 preventDefault핸들러를 연결한다.
      for (var i = 0; i < el.length; i++) {
        if (el[i].tagName === 'A' ||
            (el[i].tagName === 'BUTTON' && el[i].type === 'submit')) {
          $(el[i]).one('click', _preventDefault);
        }
      }
    }
    if (eobj.isOriginalPropagationStopped()) {
      try { //originalEvent가 invalidated된 경우 IE에서 Exception 발생
        e.stopPropagation();
      } catch (err) {
      }
    }

    if (eventCancelPair[eventname]) {
      var c = eventCancelPair[eventname];
      arg[0] = c;
      currentState.needCancel[c] = {
        elem: elem,
        arg: arg
      };
    }
  };

  var triggerCancel = function(e) {
    for (var prop in currentState.needCancel) {
      var c = currentState.needCancel[prop];
      var eobj = $.Event(c.arg[0]);
      extendEventObject(eobj, e);
      $(c.elem).trigger(eobj, c.arg.slice(1));
    }
    delete currentState.needCancel;
    currentState.needCancel = {};
  };

  /****************************************************
   * Timeout Trigger와 관련된 함수.
   ***************************************************/
  var registerTimeoutFromState = function(st, e) {
    for (var i = 0; i < st.transition.length; i++) {
      var item = st.transition[i];
      if (item.trigger && item.trigger.indexOf(trigger.timeout) !== -1) {
        registerTimeout(item, e);
      }
    }
  };

  var registerTimeout = function(tran, e) {
    var t = tran.trigger.split(trigger.timeout)[1], tvar = null;

    tvar = setTimeout(function() {
      advanceState(tran.trigger, e);
    }, t);
    timeoutTrigger.push(tvar);
  };

  var unregisterTimeout = function() {
    if (timeoutTrigger.length > 0) {
      for (var i = 0; i < timeoutTrigger.length; i++) {
        clearTimeout(timeoutTrigger[i]);
      }
//      delete timeoutTrigger; // commented out by jsHinit
    }
    timeoutTrigger = [];
  };

  /****************************************************
   * 좌표계와 관련된 함수
   ***************************************************/
  var isMoved = function(e) {
    var x = getPageX(e), y = getPageY(e), //XXX multitouch에 대응되지 않음
    dx = currentState.startX - x, dy = currentState.startY - y;

    if (Math.sqrt(dx * dx + dy * dy) >= threshold.move_d) {
      return true;
    }
    return false;
  };

  var getPageX = function(e, trace) {
    var eobj = e;
    trace = trace || currentState.trace;
    if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 0) {
      eobj = e.originalEvent;
    }

    if (istouch && eobj.touches && eobj.touches.length > 0) {
      return eobj.touches[0].pageX;
    } else if (eobj.pageX !== undefined && eobj.pageX !== null) {
      return eobj.pageX;
    } else {
      var idx = trace.length - 1;
      if (idx < 0) {
        return 0;
      }
      return trace[idx].x;
    }
  };

  var getPageY = function(e, trace) {
    var eobj = e;
    trace = trace || currentState.trace;
    if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 0) {
      eobj = e.originalEvent;
    }

    if (istouch && eobj.touches && eobj.touches.length > 0) {
      return eobj.touches[0].pageY;
    } else if (eobj.pageY !== undefined && eobj.pageY !== null) {
      return eobj.pageY;
    } else {
      var idx = trace.length - 1;
      if (idx < 0) {
        return 0;
      }
      return trace[idx].y;
    }
  };

  var getDistance = function(x1, y1, x2, y2) {
    var dx = x1 - x2, dy = y1 - y2;
    return Math.floor(Math.sqrt(dx * dx + dy * dy));
  };

  var getCurrentSpeed = function(e, trace) {
    trace = trace || currentState.trace;
    var obj = {
      value: 0,
      valueX: 0,
      valueY: 0
    };
    if (trace.length > 2) {
      var tr1 = trace.length - 2, tr2 = trace.length - 1, d, dt;

      //마지막과 차마지막 엘리먼트의 좌표값이 완전 동일할 경우 move후 up일 수 있으므로
      //바로 앞의 trace와 비교하도록 한다.
      if (trace[tr1].x === trace[tr2].x && trace[tr1].y === trace[tr2].y) {
        tr1 = trace.length - 3;
      }
      //500ms이내에 기록된 다른 trace가 있을 경우 기록에 사용한다.
      if (trace[tr1 - 1] && (trace[tr1].time - trace[tr1 - 1].time) < 500) {
        tr1--;
      }

      d = getDistance(trace[tr2].x, trace[tr2].y, trace[tr1].x, trace[tr1].y);
      dt = trace[tr2].time - trace[tr1].time;

      var dx = trace[tr2].x - trace[tr1].x, dy = trace[tr2].y - trace[tr1].y;

      obj.value = Math.floor((d / dt) * 1000);
      obj.valueX = Math.floor((dx / dt) * 1000);
      obj.valueY = Math.floor((dy / dt) * 1000);
    } else {

    }
    $.each(['value', 'valueX', 'valueY'], function(i, v) {
      if (obj[v] === Infinity || isNaN(obj[v])) {
        obj[v] = 0;
      }
    });

    return obj;
  };

  var getCurrentMilli = function(t) {
    return new Date().getTime();
  };

  var getCoordinate = function(e, trace) {
    var obj = {}, speed;
    trace = trace || currentState.trace;
    obj.startX = currentState.startX;
    obj.startY = currentState.startY;

    // XXX multitouch에 대응하지 못함.
    obj.pageX = getPageX(e, trace);
    obj.pageY = getPageY(e, trace);

    obj.distance = getDistance(obj.startX, obj.startY, obj.pageX, obj.pageY);
    obj.distanceX = obj.pageX - obj.startX;
    obj.distanceY = obj.pageY - obj.startY;

    speed = getCurrentSpeed(e, trace);
    obj.speed = speed.value;
    obj.speedX = speed.valueX;
    obj.speedY = speed.valueY;

    obj.alignment = '';
    obj.direction = '';

    if (obj.distance < threshold.move_d) {
      obj.alignment = 'stay';
      obj.direction = 'none';
    } else {
      var sin = obj.distanceY / obj.distance;
      if (-0.5 <= sin && sin <= 0.5) {
        //-30~30도, 150~210도
        obj.alignment = 'horizontal';
      } else if (0.866 <= sin || sin <= -0.866) {
        //60~120도, 240~300도
        obj.alignment = 'vertical';
      } else {
        obj.alignment = 'diagonal';
      }

      if (sin <= -0.5 || sin >= 0.5) { //30~150도, 210~330도. down or up
        if (obj.distanceY > 0) {
          obj.direction += 'down';
        } else {
          obj.direction += 'up';
        }
      }
      if (-0.866 <= sin && sin <= 0.866) { //-60~60, 120~240도. right or left
        if (obj.distanceX > 0) {
          obj.direction += 'right';
        } else {
          obj.direction += 'left';
        }
      }
    }

    return obj;
  };

  /****************************************************
   * 이벤트 핸들러 존재여부와 관련된 함수.
   ***************************************************/
  var hasAnyHandler = function(elem, list) {
    var result = false, arr = list || allEvent;
    $.each(arr, function(index, value) {
      if (hasHandler(elem, value)) {
        result = true;
        return false;
      }
    });
    //data-attribute
    var dataevents = ['tap', event.singletap, event.doubletap, event.tripletap,
                      event.longtap];
    $.each(dataevents, function(i,name) {
      if($(elem).attr('data-'+name)) {
        //__ALOG(name);
        result = true;
      }
    });
    return result;
  };

  var hasHandler = function(elem, eventname,toparent) {
    var handler = null;

    if (!elem) {
      return false;
    }
    var $elem = elem.jquery ? elem : $(elem);

    elem = elem.jquery ? $elem[0] : elem;

    if ($._data) {
      handler = $._data($elem[0], 'events');
    } else {
      handler = $elem.data('events');
    }
    //data attribute
    var attr = $elem.attr('data-' + eventname);
    if(attr) {
      handler = {};
      handler[eventname] = attr;
    }
    if (handler && handler[eventname]) {
      return true;
    }
    if(toparent===true) {
	    var $parent = $elem.parent();
	    if($parent.length && $elem.prop('tagName') !== 'BODY') {
	    	return hasHandler($parent, eventname,true);
	    }
    }
    return false;
  };

  var getHandlerOwner = function(e, eventname) {
    var owner = e.target, name = (typeof eventname === typeof '') ?
        [eventname] : eventname,
    hasit = hasAnyHandler(owner, name);
    while (!hasit && !!owner.parentElement) {
      owner = owner.parentElement;
      hasit = hasAnyHandler(owner, name);
    }
    if (eventname && !hasit) {
      return null;
    }
    return owner;
  };

  /****************************************************
   * 이벤트의 실제 판별 및 트리거링 로직을 담은 함수
   ***************************************************/
  processor.swipe = function(e) {
    var coor = getCoordinate(e);
    var el = getHandlerOwner(e, [event.swipe, event.swipeleft,
        event.swiperight, event.swipeup, event.swipedown, event.swipemove,
        event.swipecancel]);
    var condition = $(el).data('swipecondition');

    var currentDistance, conditionDistance;
    var currentSpeed, conditionSpeed;

    if (condition && (condition.direction || condition.alignment)) {
      if (condition.alignment &&
          condition.alignment.indexOf(coor.alignment) === -1) {
        currentDistance = -1;
        currentSpeed = -1;
      } else if (condition.alignment &&
                 condition.alignment.indexOf(coor.alignment) !== -1) {
        if (coor.alignment === 'vertical') {
          currentDistance = Math.abs(coor.distanceY);
          currentSpeed = Math.abs(coor.speedY);
        } else if (coor.alignment === 'horizontal') {
          currentDistance = Math.abs(coor.distanceX);
          currentSpeed = Math.abs(coor.speedX);
        } else {
          currentDistance = Math.abs(coor.distance);
          currentSpeed = Math.abs(coor.speed);
        }
      } else if (condition.direction &&
          condition.direction.indexOf(coor.direction) !== -1) {
        if (coor.direction === 'up') {
          currentDistance = -coor.distanceY;
          currentSpeed = -coor.speedY;
        } else if (coor.direction === 'down') {
          currentDistance = coor.distanceY;
          currentSpeed = coor.speedY;
        } else if (coor.direction === 'left') {
          currentDistance = -coor.distanceX;
          currentSpeed = -coor.speedX;
        } else if (coor.direction === 'right') {
          currentDistance = coor.distanceX;
          currentSpeed = coor.speedX;
        } else {
          currentDistance = -1;
          currentSpeed = -1;
        }
      } else {
        currentDistance = -1;
        currentSpeed = -1;
      }
    } else {
      currentDistance = coor.distance;
      currentSpeed = coor.speed;
    }

    conditionDistance = (condition && condition.distance) ?
        condition.distance : threshold.swipe_d;
    conditionSpeed = (condition && condition.speed) ?
        condition.speed : threshold.swipe_v;

    if (condition && condition.distance && !condition.speed) {
      currentSpeed = -1;
    }
    if (condition && condition.speed && !condition.distance) {
      currentDistance = -1;
    } //조건이 둘다 제시되거나 default를 하는 경우에는 or조건으로 적용하기 위함.

    //distanceX/Y조건 우선.
    if (condition && condition.distanceX) {
      currentDistance = Math.abs(coor.distanceX);
      currentSpeed = -1;
      conditionDistance = Math.abs(condition.distanceX);
      conditionSpeed = 0;
    }
    if (condition && condition.distanceY) {
      currentDistance = Math.abs(coor.distanceY);
      currentSpeed = -1;
      conditionDistance = Math.abs(condition.distanceY);
      conditionSpeed = 0;
    }

    if (currentDistance >= conditionDistance ||
        currentSpeed >= conditionSpeed) {
      $.each(['up', 'down', 'left', 'right'], function(i, v) {
        if (coor.direction === v) {
          triggerEvent(e, currentState.pressedElement,
              'swipe' + coor.direction, coor);
        }
      });
      triggerEvent(e, currentState.pressedElement, event.swipe, coor);
    } else {
      triggerEvent(e, currentState.pressedElement, event.swipecancel, coor);
    }
  };

  processor.ntap = function(e) {
    var ntapevent = [event.tap, event.singletap, event.doubletap,
        event.tripletap], tapcount = currentState.tapcount;
    if (tapcount > 3) {
      tapcount = 3;
    }
    triggerEvent(e, currentState.pressedElement, ntapevent[tapcount]);
    currentState.tapcount = 0;
  };

  //TODO Drag&Drop
  processor.dragstart = function(e) {};
  processor.dragmove = function(e) {};
  processor.dragend = function(e) {};

  /****************************************************
   * State전진을 위한 함수들
   ***************************************************/
  var initCurrentState = function() {
    for(var prop in currentState) {
      if(currentState.hasOwnProperty(prop) &&
          (prop !== 'pointer' && prop !== 'tapcount')) {
        delete currentState[prop];
      }
    }
    currentState.pressedElement = null;
    currentState.currentElement = null;
    currentState.previousElement = null;
    currentState.startX = null;
    currentState.startY = null;
    currentState.trace = [];
    //currentState.tapcount = 0;
    currentState.needCancel = {};
  };

  var enterState = function(st, e) {
    if (!st) { return false; }
    if (st.entry) { st.entry(e); }
    if (st.doing) { st.doing(e); }
  };

  var hasNullTransition = function() {
    var curr = currentState.pointer;
    for (var i = 0; i < curr.transition.length; i++) {
      if (!curr.transition[i].trigger) {
        return true;
      }
    }
    return false;
  };

  var advanceState = function(inputtrigger, e) {
    function _triggerCancel() {
      triggerCancel(e);
    }
    do {
      var curr = currentState.pointer, appliedTransition = null;

      currentState.previousElement = currentState.currentElement;
      currentState.currentElement = e.target;

      var tmptrace = {};
      tmptrace.time = getCurrentMilli();
      tmptrace.x = getPageX(e);
      tmptrace.y = getPageY(e);
      if( currentState.trace.length === 0 ||
          (tmptrace.x !== currentState.trace[currentState.trace.length-1].x ||
          tmptrace.y !== currentState.trace[currentState.trace.length-1].y) ) {
        currentState.trace.push(tmptrace);
      }
      //__ALOG(inputtrigger + ','+currentState.pointer.name+','+currentState.trace.length);
      
      for (var i = 0; i < curr.transition.length; i++) {
        var item = curr.transition[i];

        if (item.trigger !== inputtrigger && item.trigger !== null) {
          continue;
        }

        if (item.guard === null || (typeof item.guard === 'function' && item.guard(e))) {
          appliedTransition = item;
          break;
        }
      }

      if (!appliedTransition) {
        //현재 state에서 적용가능한 state transition이 없는데 down 이 일어났다면
        //state 진행의 에러로 간주하고 최초 state로 이동하도록 한다.
        if (inputtrigger === trigger.down) {
          appliedTransition = {
            to: state.pressedinitial,
            effect: _triggerCancel
          };
        } else if (inputtrigger.indexOf(trigger.timeout) !== -1) {
          //timeout이벤트에 의해서 들어오긴 했는데 가드조건을 통과하지 못할 경우.
          unregisterTimeout();
          registerTimeoutFromState(curr, e);
          return false;
        } else {
          return false;
        }
      }

      unregisterTimeout();
      if (curr.exit) {
        curr.exit(e);
      }

      if ((!!appliedTransition) && appliedTransition.effect) {
        appliedTransition.effect(e);
      }

      currentState.pointer = appliedTransition.to;
      curr = currentState.pointer;

      enterState(curr, e);
      registerTimeoutFromState(curr, e);
      inputtrigger = null;
    } while (hasNullTransition());
  };

  /*************************************************************
   * State정의
   *************************************************************/
  state.idle = createState();
  state.hover = createState();
  state.pressedinitial = createState();
  state.unpressed = createState();
  state.pressedinter = createState();
  state.moving = createState();
  state.endmove = createState();

  //iOS6에서 unpressed handler가 alert창 띄운뒤 승인 누를시 down trigger 발생.
  //이를 막기 위해 unpressed로 진입 전 약간의 딜레이를 준다.
  state.unpressedwait = createState();

  state.idle.entry = function(e) {
    initCurrentState();
    $(document).unbind(eventns);
    $(document).bind(startevent, downHandler);
    $(document).bind(moveevent, moveHandler);
    //20130617 tap과 연계한 event state machine관리 문제로 hover를 
    //기본 state machine에서 분리하여 별도 state machine으로 구성한다.
    //handleIdleHover();
  };
  var detectDisabled = function(e) {
    var el = getHandlerOwner(e);
    if ($(el).attr('disabled')) {
      return true;
    }
    return false;
  };
  state.idle.transition.push({
    to: state.pressedinitial,
    trigger: trigger.down,
    guard: function(e) {
      return !detectDisabled(e);
    },
    effect: function(e) {
    }
  });
  var handleIdleHover = function(e) {
    if(!e || !e.target) {
      return;
    }
    var hel = getHandlerOwner(e, [event.hoverstart, event.hovering,
                                  event.hoverend]);
    if(hel && !istouch) {
      addTohover(state.idle.transition);
    } else {
      removeTohover(state.idle.transition);
    }
  };
  var addTohover = function(transition) {
    removeTohover(transition);
    transition.push({
      to: state.hover,
      trigger: trigger.timeout + '25',//과도한 overhead 방지.
      guard: function(e) {
        var el = getHandlerOwner(e, [event.hoverstart, event.hovering,
            event.hoverend]);
        if (el) {
          var cond = $(el).data('hovercondition');
          if (cond && cond.delay) {
            var dt = getCurrentMilli() - currentState.lastHoverTime;
            if (dt > cond.delay) {
              return true;
            } else {
              return false;
            }
          }
          return true;
        }
        return false;
      },
      effect: function(e) {
        currentState.pressedElement = getHandlerOwner(e, [event.hoverstart,
            event.hovering, event.hoverend]);
        currentState.currentElement = getHandlerOwner(e);
        triggerEvent(e, currentState.pressedElement, event.hoverstart,
            getCoordinate(e));
      }
    });
  };
  var removeTohover = function(transition) {
    for(var i=transition.length-1; i >=0; i--) {
      if(transition[i].to === state.hover) {
        transition.splice(i,1);
      }
    }
  };
  state.idle.transition.push({
    to: state.idle,
    trigger: trigger.move,
    guard: function(e) {
      var coor = getCoordinate(e);
      currentState.lastHoverTime = getCurrentMilli();
      //state.idle.entry 항목 참조.
      //handleIdleHover(e);
      if (coor.speed > threshold.hover_v || isMovedOverElement(e)) {
        return true;
      }
      return false;
    },
    effect: function(e) {
    }
  });

  //IE 더블클릭 처리 버그로 인해 idle state에서 down 없이 up 만 발생하는 경우,
  //pressedinitial의 entry와 do를 수행하도록 한다.
  state.idle.transition.push({
    to: state.unpressed,
    trigger: trigger.up,
    guard: function(e) {
      //down없이 keyup이 일어나는 경우에 대해서는 처리하지 않음.
      return !detectDisabled(e) && !(e.which === 13 || e.which === 32);
    },
    effect: function(e) {
      state.pressedinitial.entry(e);
      state.pressedinitial.doing(e);
    }
  });

  state.hover.transition.push({
    to: state.hover,
    trigger: trigger.move,
    guard: function(e) {
      var elem = getHandlerOwner(e, [event.hoverstart, event.hovering,
          event.hoverend]);
      if (currentState.pressedElement !== elem) {
        return false;
      }
      return true;
    },
    effect: function(e) {
      triggerEvent(e, currentState.pressedElement, event.hovering,
          getCoordinate(e));
    }
  });
  state.hover.transition.push({
    to: state.idle,
    trigger: trigger.move,
    guard: function(e) {
      var elem = getHandlerOwner(e, [event.hoverstart, event.hovering,
          event.hoverend]);
      if (currentState.pressedElement !== elem) {
        return true;
      }
      return false;
    },
    effect: function(e) {
      triggerEvent(e, currentState.pressedElement, event.hoverend,
          getCoordinate(e));
    }
  });
  state.hover.transition.push({
    to: state.pressedinitial,
    trigger: trigger.down,
    guard: function(e) {
      return !detectDisabled(e);
    },
    effect: function(e) {
      triggerEvent(e, currentState.pressedElement, event.hoverend,
          getCoordinate(e));
    }
  });

  state.pressedinitial.entry = function(e) {
    //__ALOG('pressedinitial'+e.type+','+currentState.tapcount);
    initCurrentState();
    currentState.tapcount = 0;
    currentState.pressedElement = e.target;//getHandlerOwner(e);
    currentState.currentElement = getHandlerOwner(e);
    currentState.startX = getPageX(e);
    currentState.startY = getPageY(e);//XXX multitouch에 대응하지 못함.

    $(document).unbind(moveevent);
    $(document).unbind(endevent);
    $(document).bind(moveevent, moveHandler);
    $(document).bind(endevent, upHandler);
  };
  state.pressedinitial.doing = function(e) {
    triggerEvent(e, currentState.pressedElement, event.pressed,
        getCoordinate(e));
  };
  state.pressedinitial.transition.push({
    to: state.moving,
    trigger: trigger.move,
    guard: function(e) {
      var result = isMoved(e);
      return result;
    },
    effect: function(e) {

    }
  });
  state.pressedinitial.transition.push({
    //to : state.unpressed,
    to: state.unpressedwait,
    trigger: trigger.up,
    guard: function(e) {
      return !detectDisabled(e);
    },
    effect: function(e) {
    }
  });
  state.pressedinitial.transition.push({
    to: state.idle,
    trigger: trigger.timeout + threshold.longtap_t,
    guard: function(e) {
      return hasHandler(currentState.pressedElement, event.longtap,true);
    },
    effect: function(e) {
      triggerEvent(e, currentState.pressedElement, event.longtap,
          getCoordinate(e));
      triggerEvent(e, currentState.pressedElement, event.unpressed,
          getCoordinate(e));
    }
  });

  var unpressedwait_tr = {
    to: state.unpressed,
    trigger: null,
    guard: null,
    effect: null
  };
  if (istouch) {
    unpressedwait_tr.trigger = trigger.timeout + 50;
  }

  state.unpressedwait.transition.push(unpressedwait_tr);

  state.unpressed.entry = function(e) {
    triggerEvent(e, currentState.pressedElement, event.unpressed,
        getCoordinate(e));
  };
  state.unpressed.doing = function(e) {
    currentState.tapcount++;
    triggerEvent(e, currentState.pressedElement, event.tap);
  };
  state.unpressed.transition.push({
    to: state.idle,
    trigger: trigger.timeout + threshold.ntap_t,
    guard: null,
    effect: function(e) {
      processor.ntap(e);
    }
  });
  state.unpressed.transition.push({
    to: state.pressedinter,
    trigger: trigger.down,
    guard: function(e) {
      return isStayingStill(e) && !isMoved(e);
    },
    effect: null
  });
  state.unpressed.transition.push({
    to: state.pressedinitial,
    trigger: trigger.down,
    guard: function(e) {
      return !isStayingStill(e) || isMoved(e);
    },
    effect: null
  });
  //IE7~9 호환성 문제 - 더블클릭시 mousedown과 click이 생략되는 문제.
  //webbugtrack.blogspot.kr/2008/01/bug-263-beware-of-doubleclick-in-ie.html
  state.unpressed.transition.push({
    to: state.unpressed,
    trigger: trigger.up,
    guard: function(e) {
      //down 없이 keyup 발생시 처리하지 않음. 
      return !(e.which === 13 || e.which === 32);
    },
    effect: function(e) {}
  });

  state.pressedinter.entry = function(e) {
    triggerEvent(e, currentState.pressedElement, event.pressed,
        getCoordinate(e));
  };
  state.pressedinter.transition.push({
    //to : state.unpressed,
    to: state.unpressedwait,
    trigger: trigger.up,
    guard: function(e) {
      return true;
    },
    effect: null
  });
  state.pressedinter.transition.push({
    to: state.pressedinitial,
    trigger: trigger.timeout + threshold.ntap_t,
    guard: null,
    effect: function(e) {
      processor.ntap(e);
    }
  });
  state.pressedinter.transition.push({
    to: state.moving,
    trigger: trigger.move,
    guard: function(e) {
      var result = isMoved(e);
      return result;
    },
    effect: function(e) {
      processor.ntap(e);
    }
  });

  state.moving.doing = function(e) {
    var coor = getCoordinate(e);
    triggerEvent(e, currentState.pressedElement, event.move, coor);
    triggerEvent(e, currentState.pressedElement, event.swipemove, coor);
  };
  state.moving.transition.push({
    to: state.endmove,
    trigger: trigger.up,
    guard: null,
    effect: null
  });
  state.moving.transition.push({
    to: state.moving,
    trigger: trigger.move,
    guard: null,
    effect: null
  });

  state.endmove.doing = function(e) {
    triggerEvent(e, currentState.pressedElement, event.unpressed,
        getCoordinate(e));
    processor.swipe(e);
  };
  state.endmove.transition.push({
    to: state.idle,
    trigger: null,
    guard: null,
    effect: function(e) {}
  });

  for (name in state) {
    state[name].name = name;
  }

  /**************************************************
   * special event 정의 영역. event parameter등을 처리한다.
   *************************************************/

  var specialEventsRegister = function() {
    var specialswipe = ['', 'left', 'right', 'up', 'down'];
    $.each(specialswipe, function(i, v) {
      $.event.special['swipe' + v] = {
        setup: function(data, namespaces, eventHandle) {
          if (!!data) {
            $(this).data('swipecondition', data);
          }
        },
        teardown: function(namespaces) {
          $(this).removeData('swipecondition');
        }
      };
    });

    if(!istouch) {
    var specialhover = [event.hoverend, event.hovering, event.hoverstart];
    var hovertrace = [];
    var hoverhandler = function(e) {
      var ct = {};
      ct.time = getCurrentMilli();
      ct.x = getPageX(e, hovertrace);
      ct.y = getPageY(e, hovertrace);
      hovertrace.push(ct);
      if(hovertrace.length > 5) {
        hovertrace.shift();
      }
      var coor = getCoordinate(e, hovertrace);
      var el = this;
      var data = $(el).data('hovercondition');
      if(e.type === 'mousedown' || e.type === 'mouseout') {
        $(el).trigger('hoverend', coor);//__ALOG('end1');
      } else if(e.type === 'mouseup' || e.type === 'mouseover') {
        $(el).trigger('hoverstart', coor);//__ALOG('start2');
      } else if(e.type === 'mousemove' && e.which === 0) {
        $(el).trigger('hovering', coor);//__ALOG('ing');
      }
    };
    //$(document).on('mousedown mouseup mouseover mousemove mouseout', hoverhandler);
    var rawhover = ['mousedown','mouseup','mouseover','mousemove','mouseout',''];
    $.each(specialhover, function(i, v) {
      $.event.special[v] = {
        setup: function(data, namespaces, eventHandle) {
          if (!!data) {
            $(this).data('hovercondition', data);
          }
        },
        add : function(handleObj) {
          if(handleObj.data) {
            $(this).data('hovercondition', handleObj.data);
          }
          $(this).on(rawhover.join('.alopexeventhover'+v+' '), handleObj.selector || null, hoverhandler);
        },
        teardown: function(namespaces) {
          $(this).removeData('hovercondition');
          $(this).off(rawhover.join('.alopexeventhover'+v+' '), hoverhandler);
        }
      };
    });
    }
    
    //tap계열 이벤트에 대한 jQuery Plugin 구현
    var taps = ['tap', 'singletap'];
    $.each(taps, function(i,v) {
      $.fn[v] = function(handler) {
        if(handler) {
          return this.bind(v, handler);
        } else {
          //tap과 singletap은 동일. 향후 singletap은 제거한다.
          return this.trigger('tap').trigger('singletap');
        }
      };
    });
    if(useClickFallback) {
      //마우스/키보드 외의 수단에서 인위적으로 .click()을 실행하는 경우에 대한 우회책을 
      //jQuery event extension 으로 구현. 
      var f = ["tap","singletap"];
      var fpos = {x:null,y:null};
      $.each(f, function(idx,eventname) {
        $.event.special[eventname] = {
            setup : function(data, eventHandle) {
              //label과 input[type="checkbox|radio"] 에 대해서는 우회책을 적용하지 않는다.
              var tagName = String(this.tagName).toUpperCase();
              if(tagName === "LABEL") return;
              if(tagName === "INPUT") {
                var type = String(this.type).toLowerCase();
                if(type === "checkbox" || type === "radio") return;
              }
              var $this = $(this);
              $this.on('click.alopexuitapworkaround'+eventname, function(e) {
                var tapped = $this.data('alopex-ui-tap-wtapped'+eventname);
                $this.data('alopex-ui-tap-wtapped'+eventname,null);
                if(tapped) {
                  return; 
                }
                var prevd = false;
                var stopp = false;
                
                var eobj = $.Event(eventname);
                //eobj.stopPropagation();
                $this.each(function(){
                  $(this).triggerHandler(eobj,[true]);
                });
                prevd = prevd || eobj.isDefaultPrevented();
                //stopp = stopp || eobj.isPropagationStopped();
                
                $this.data('alopex-ui-tap-wtapped-keyup'+eventname,true);
              })
              .on('mousedown.alopexuitapworkaround'+eventname, function(e) {
                fpos.x = e.pageX;
                fpos.y = e.pageY;
              })
              .on('mouseup.alopexuitapworkaround'+eventname, function(e) {
                var thr = threshold.move_d;
                if(Math.abs(fpos.x - e.pageX) > thr || Math.abs(fpos.y - e.pageY) > thr) {
                	$(this).data('alopex-ui-tap-wtapped'+eventname,true);
                }
              });
            },
            teardown : function() {
              var $this = $(this);
              $this.off('.alopexuitapworkaround'+eventname);
            },
            _default : function(event, data) {
              $(this).data('alopex-ui-tap-wtapped-keyup'+eventname,null);
            },
            handle : function(event,noinc) {
              var $this = $(this);
              var handleObj = event.handleObj;
              var targetData = jQuery.data( event.target );
              var ret = null;
              event.type = handleObj.origType;
              if(!(event.origType === "keyup" && $this.data('alopex-ui-tap-wtapped-keyup'+eventname))) {
                ret = handleObj.handler.apply(this, arguments);
                if(noinc !== true) {
                  $this.data('alopex-ui-tap-wtapped'+eventname, true);
                }
              }
              event.type = handleObj.type;
              return ret;
            }
        };
      });
      
    }
    var tapevents = [event.singletap, event.doubletap, event.tripletap,
                     event.longtap];
    $.each(tapevents, function(i,v) {
      $.fn[v] = function(handler,realHandler) {
        if($.isFunction(handler)) {
          this.on(v, handler);
        } else if($.isPlainObject(handler) && $.isFunction(realHandler)) {
          this.on(v, handler, realHandler);
        } else {
          this.trigger(v);
        }
      };
    });
  };

  //drag & drop 구현.
  // http://api.jquery.com/category/events/event-object/
  //$.event.props.push('dataTransfer');

  /**************************************************
   * 이벤트모듈 초기화
   *************************************************/
  var unbindme = function() {
    $(document).unbind(eventns);
    $(document).unbind(startevent);
    $(document).unbind(moveevent);
    $(document).unbind(endevent);
  };

  function init() {
    unbindme();
    initCurrentState();
    currentState.tapcount = 0;
    currentState.pointer = state.idle;
    enterState(currentState.pointer, {});
  }

  specialEventsRegister();
  init();
})(jQuery);
