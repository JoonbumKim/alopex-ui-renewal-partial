(function($) {

	$.alopex.widget.tree = $.alopex.inherit($.alopex.widget.object, {
		widgetName : 'tree',
		defaultClassName : 'af-tree Tree',
		eventHandlers : {
			cancelEvent : {
				event : 'selectstart',
				handler : '_cancelEventHandler'
			}
		},
		classNames: {
			arrow: 'Arrow',
			checkbox: 'Checkbox'
		},
		setters : [ 'tree', 'createNode', 'expand', 'collapse', 'expandAll', 'collapseAll', 'deleteNode', 'editNode', 'setSelected', 'toggleCheckbox', 'showCheckbox', 'hideCheckbox', 'toggleExpand', 'setDataSource' ],
		getters : [ 'getNode','getObject', 'getSelectedNode', 'getCheckedNodes', 'deleteAllNodes'],
		properties: {
			checked: 'checked',
			parentIdKey: 'parentId',
			idKey:'id',
			textKey :'text',
			subItems : 'items',
			iconUrlKey : 'iconUrl',
			linkUrlKey :'linkUrl',
			depthKey :'depth',
			lazyKey : 'isLazy',
			sourcetype : 'unflatten',
			draggable : false
		},
		
		init : function(el, options) {
			$.extend(el, this.properties, options);
			this.refresh(el);
		},

		toggleExpand : function(el, node) {
			if (node === undefined) {
				node = el;
			} else {
				node = node.node;
			}
			$.alopex.widget.tree._toggle(node);
		},

		_toggle : function(li) {
			if (!$.alopex.util.parseBoolean($(li).attr('data-expand'))) {
				if ($(li).find('ul').length > 0) {
					$.alopex.widget.tree._expand(li);
				}
			} else {
				$.alopex.widget.tree._collapse(li);
			}
		},

		toggleCheckbox : function(el) {
			if ($(el).attr('data-checkbox') !== 'visible') {
				this.showCheckbox(el);
			} else {
				this.hideCheckbox(el);
			}
		},
		
		showCheckbox: function(el) {
			$(el).attr('data-checkbox', 'visible');
			$(el).find('input[type="checkbox"]').css('display', 'inline-block');
		},
		
		hideCheckbox: function(el) {
			$(el).removeAttr('data-checkbox');
			$(el).find('input[type="checkbox"]').css('display', 'none');
		},
		
		expand : function(el, node) {
			if (node === undefined) {
				node = el;
			}
			var li = node.node;
			$.alopex.widget.tree._expand(li);
		},

		_expand : function(li) {
			var $li = $(li);
			var el = $li.closest('ul');
			$li.attr('data-expand', 'true').addClass('af-tree-expanded Expanded');
			var $ul = $li.find('> ul');
			if($ul.length === 0){
				$li.attr('data-expand', 'false').removeClass('af-tree-expanded Expanded');
			}
			$ul.css('display', 'block');
			$.alopex.widget.tree._triggerEvent(el, li, 'expand');
		},

		collapse : function(el, node) {
			if (node === undefined) {
				node = el;
			}
			var li = node.node;
			$.alopex.widget.tree._collapse(li);
		},

		_collapse : function(li) {
			if (li === undefined) {
				li = this;
			}
			var el = $(li).closest('ul');
			$(li).attr('data-expand', 'false').removeClass('af-tree-expanded Expanded');
			$(li).find('> ul').css('display', 'none');
			$.alopex.widget.tree._triggerEvent(el, li, 'collapse');
		},

		setSelected : function(el, node) {
			var selectedNode = node.node;
			$(selectedNode).closest('[data-type="tree"]').find('.af-pressed, .Selected').removeClass('af-pressed Selected');
			$(selectedNode).parents('li').each(function() {
				$.alopex.widget.tree._expand(this);
			});
			$(selectedNode).find('> a').addClass('af-pressed Selected');
		},

		expandAll : function(el) {
			$(el).find('li').each(function() {
				$.alopex.widget.tree._expand(this);
			});
		},

		collapseAll : function(el) {
			$(el).find('li').each(function() {
				$.alopex.widget.tree._collapse(this);
			});
		},

		createNode : function(el, node, data) {
			var ul = null;
			if (!$.alopex.util.isValid(node)) {
				ul = node = el;
			} else {
				node = node.node;

				ul = $(node).find('ul');
				if (ul.length > 0) {
					ul = ul[0];
				} else {
					ul = $('<ul></ul>').appendTo(node)[0];
				}
			}
			var jsonArray = null;
			if( el.sourcetype == "flat" && (Object.prototype.toString.call( data ) === '[object Array]')) {
				jsonArray = $.alopex.widget.tree._unflatten(el, data);
			}else{
				jsonArray = [ data ];
			}
			$.alopex.widget.tree._createNode(el, ul, jsonArray); // same structure

			$.alopex.widget.tree.refresh($(node).closest('ul')[0]);
		},

		deleteNode : function(el, node) {
			node = node.node;
			var $checkbox = $(node).find('input[type="checkbox"]');
			$checkbox.removeAttr('checked');
			$.alopex.widget.tree._traverseUp($checkbox[0]);
			$(node).remove();
		},
		deleteAllNodes : function(el) {
			$(el).empty();
		},
		editNode : function(el, node, data) {
			node = node.node;
			$(node).find('> a').text(data[el.textKey]);
			$(node).find('> a > img.af-tree-img').attr('src', data[el.iconUrlKey ]);
			$(node).attr('id', data[el.idKey]);
		},

		getNode : function(el, text, type) {
			if (text !== undefined) {
				text = $.alopex.util.trim(text);
			}
			var node = null;
			if (type === 'id') {
				node = $(el).find('[id="' + text + '"]')[0];
			} else {
				$(el).find('a').each(function() {
					if ($.alopex.util.trim($(this).text()) === text) {
						node = $(this).closest('li')[0];
					}
				});
			}
			return $.alopex.widget.tree._getTreeNodeObj(el, node);
		},
		
		
		getObject : function(el, text, type) {
			if (text !== undefined) {
				text = $.alopex.util.trim(text);
			}
			var node = null;
			if (type === 'id') {
				node = $(el).find('[id="' + text + '"]')[0];
			} else {
				$(el).find('a').each(function() {
					if ($.alopex.util.trim($(this).text()) === text) {
						node = $(this).closest('li')[0];
					}
				});
			}
			return node;
		},

		getSelectedNode : function(el) {
			var node = $(el).find('.af-pressed').closest('li')[0];
			return $.alopex.widget.tree._getTreeNodeObj(el, node);
		},

		getCheckedNodes : function(el, options) {
			var array = [];
			$(el).find('input[type="checkbox"]:checked').each(function() {
				var node = $(this).closest('li')[0];
				array.push($.alopex.widget.tree._getTreeNodeObj(el, node));
			});
			
			if(options && options.indeterminate) {
				$(el).find('.Checkbox:indeterminate').each(function() {
					var node = $(this).closest('li')[0];
					array.push($.alopex.widget.tree._getTreeNodeObj(el, node));
				});
			}
			
			return array;
		},

		setDataSource : function(el, data) {
			$(el).empty();
			if( el.sourcetype == "flat" && (Object.prototype.toString.call( data ) === '[object Array]') ) {
				data = $.alopex.widget.tree._unflatten(el, data);
			}
			$.alopex.widget.tree._createNode(el, el, data); // same structure
			$(el).refresh(data);
		},

		_getTreeNodeObj : function(el, node) {
			var textKey = el.textKey;
			var iconUrlKey = el.iconUrlKey;
			var idKey = el.idKey;
			var depthKey = el.depthKey;
			var something = {};
			
			something[el.idKey] =  $(node).attr('id');
			something[el.textKey] = $.alopex.util.trim($(node).find('> a').text());
			something[el.iconUrlKey] =  $(node).find('> a > img.af-tree-img').attr('src');
			something[el.linkUrlKey] =  $(node).find('> a').attr('href');
			something[el.depthKey] =  $(node).attr('depth');
			something[el.parentIdKey] =  $(node).parents('ul.af-tree-group:eq(0)').parents('li.expandable:eq(0)').attr('id');
			something['data'] = $(node).prop('data');
			something['node'] = node;
			
			
			return something;
		},

		_createNode : function(el, ul, jsonArray) {
			for (var i = 0; i < jsonArray.length; i++) {
				var item = jsonArray[i];
				
				var li = $('<li/>')
		        .attr('id', $.alopex.util.isValid(item[el.idKey]) ? item[el.idKey] : '')
		        .attr('depth', item[el.depthKey])
		        .prop('data', item)
				.appendTo($(ul));
			
				if( $.alopex.util.parseBoolean(item[el.lazyKey]) ) {
					$(li).attr("data-is-lazy", item[el.lazyKey]);
					$(li).attr("data-is-loaded", "false"); // is loaded : false (default)
				}
					
				var span = $('<span/>')
					.addClass('Arrow')
					.appendTo(li);

				var checkbox = $('<input/>')
				.attr('type', 'checkbox')
				.addClass('Checkbox af-checkbox')
				.appendTo(li);
				
				var aaa = $('<a/>')
				    .addClass('ui-all')
			        .appendTo(li);
				
				if ($.alopex.util.isValid(item[el.linkUrlKey]) ) {
					aaa.attr('href', item[el.linkUrlKey]);
				}

				if ($.alopex.util.isValid(item[el.iconUrlKey]) ) {
					var img =  $('<img/>')
					.attr('src', item[el.iconUrlKey])
					.appendTo(aaa);
					img.after(item[el.textKey]);
				}else{
					aaa.html(item[el.textKey]);	
				}
				
				
				if ($.alopex.util.isValid(item[el.subItems])) {
					var subUl = $('<ul/>')
			        .appendTo(li)[0];

					this._createNode(el, subUl, item[el.subItems])
				}
			
			}
		},
		
		refresh : function(el, data) {
			$.alopex.widget.tree._structure(el);
			$.alopex.widget.tree._removeEvent(el);
      		$.alopex.widget.tree._addBasicEvent(el);
			$.alopex.widget.tree._addKeydownEvent(el);
			$.alopex.widget.tree._addCheckbox(el);
      		$.alopex.widget.tree._checkCheckbox(el, data);
		},

		_structure : function(ul) {
			var i;
			if ($(ul).attr('data-type') !== undefined && $(ul).attr('data-type').indexOf('tree') !== -1) {
				if ($(ul).children().length > 0) {
					for (i = 0; i < $(ul).children().length; i++) {
						if (i === 0) {
							$($(ul).children()[i]).find('> a').attr('tabindex', 0);
						} else {
							$($(ul).children()[i]).find('> a').attr('tabindex', -1);
						}
					}
				}
			} else {
				if ($(ul).children().length > 0) {
					for (i = 0; i < $(ul).children().length; i++) {
						$($(ul).children()[i]).find('> a').attr('tabindex', -1);
					}
				}
			}
			$(ul).find('> li')./*addClass('af-tree-node').*/each(function() {
				var $link = $(this).find('> a').addClass('af-tree-link');
				$link.find('> img').addClass('af-tree-img');

				var children = $(this).find('> ul').addClass('af-tree-group');
				var isExpandable = (children.find('li').length > 0);
				if ( isExpandable || $.alopex.util.parseBoolean($(this).attr("data-is-lazy")) ) {
					$(this).addClass('expandable');
					var $span = $(this).find("span.Arrow").first();
					if ( $span.length == 0 ) {
						$('<span></span>').attr('class', 'af-tree-icon Arrow').attr('data-expand', 'false').insertBefore($(this).children()[0]);
					}
					$span.attr('data-expand', 'false');
					$.alopex.widget.tree._structure(children[0]);
					$span.css('visibility', 'visible');
				} else {
					$(this).attr('data-expand', 'false').removeClass('expandable'); 
					$(this.querySelectorAll('span.Arrow')).css('visibility', 'hidden');
				}

				if (!$.alopex.util.parseBoolean($(this).attr('data-expand'))) {
					$(this).attr('data-expand', 'false').removeClass('af-tree-expanded Expanded');
					$(this).find('> ul').css('display', 'none');
				}

				if($(this).find('>ul')) {
					$(this).css('list-style', 'none');
				}
			});
		},

		_removeEvent : function(el) {
			$(el).find('.af-tree-icon, li>span').unbind('click');
			$(el).find('.af-tree-link, li>a').unbind('click').unbind('dbclick').unbind('hoverstart').unbind('focusin');
		},

		_triggerEvent : function(el, link, event) {
			var _id = $(link).closest('li').attr('id');
			var _text = $.alopex.widget.tree._getNodeText(link);
			var _path = $.alopex.widget.tree._getNodePath(link);
			var target = $(link).closest('li')[0];
			
			var param = {
				id : _id,
				text : _text,
				path : _path,
				node : target,
				data : $(target).prop('data')
			};

			$(el).trigger(event, [ param ]);
		},

		_addBasicEvent : function(el) {
			var clicks = 0;
			$(el).find('.af-tree-icon, li>span').bind('click', function(e) {
				var li = e.target.parentNode;
				if ( $.alopex.util.parseBoolean($(li).attr("data-is-lazy")) && !$.alopex.util.parseBoolean($(li).attr("data-is-loaded"))){
					$.alopex.widget.tree._lazyLoadHandler(el, li);
					$(li).attr("data-is-loaded", "true");
				} else {
					$.alopex.widget.tree._toggle(li);
				}
			});
			$(el).find('.af-tree-link, li>a').bind('dbclick', function(e) {
				var leaf = e.target;
				$.alopex.widget.tree._triggerEvent(el, leaf, 'doubleselect');
				$.alopex.widget.tree._triggerEvent(el, leaf, 'dbclick');
			});
			$(el).find('.af-tree-link, li>a').bind('click', function(e) {
				var target = e.currentTarget;
				clicks++;
			      if (clicks == 1) {
			        setTimeout(function(){
			          if(clicks == 1) {
			        	  $(el).find('[class~=af-pressed]').removeClass('af-pressed');
							$(target).addClass('af-pressed');
							$(el).find('[class~=Selected]').removeClass('Selected');
							$(target).addClass('Selected');
							$.alopex.widget.tree._triggerEvent(el, target, 'select');
			          } else {
			        	  
			        	  var leaf = e.target;
						  $.alopex.widget.tree._triggerEvent(el, leaf, 'doubleselect');
						  $.alopex.widget.tree._triggerEvent(el, leaf, 'dbclick');
			          }
			          clicks = 0;
			        }, 300);
			      }    
			});
			$(el).find('.af-tree-link, li>a').bind('hoverstart', function(e) {
				var target = e.currentTarget;
				$(el).find('[class~=af-hover]').removeClass('af-hover');
				$(target).addClass('af-hover');
				$.alopex.widget.tree._triggerEvent(el, target, 'hover');
			});
			$(el).find('.af-tree-link, li>a').bind('hoverend', function(e) {
				var target = e.currentTarget;
				$(target).removeClass('af-hover');
			});
			
			if( $(el).attr("data-draggable") === "true" || $(el).attr("data-draggable") === true ){
				$(el).find("li > a").each(function(){
					$(this).attr("draggable", true);
					$(this).off("dragover.alopex").on("dragover.alopex", $.alopex.widget.tree._treeDragOver);
					$(this).off("dragstart.alopex").on("dragstart.alopex", $.alopex.widget.tree._treeDragStart);
					$(this).off("drop.alopex").on("drop.alopex", $.alopex.widget.tree._treeDrop);
				});
			}

			// $(el).find('.af-tree-link, li>a').bind('focusin', function(e) {
			// var target = e.target;
			// __ALOG('focusin select');
			// $.alopex.widget.tree._triggerEvent(el, target, 'select');
			// });
		},
		
		_treeDragStart : function(e){
			var $dragElem = $(e.target).parent("li");
			if( $.alopex.util.isValid($dragElem.attr("id"))){ 
				e.originalEvent.dataTransfer.setData("dragElemId", $dragElem.attr("id"));
			}else{ // 빈 아이디일 경우
				$dragElem.attr("id", "alopex-tree-temp-id-"+Math.random().toString(36).substr(2, 5));
				e.originalEvent.dataTransfer.setData("dragTempId", $dragElem.attr("id"));
			}
		},
		
		_treeDrop : function(e){
		    var dragElem, dragParentElem;
		    if(e.originalEvent.dataTransfer.getData("dragTempId")){
		    	dragElem = $("#"+e.originalEvent.dataTransfer.getData("dragTempId")).removeAttr("id");
		    }else {
		    	dragElem = $("#"+e.originalEvent.dataTransfer.getData("dragElemId"));
		    }
		    dragParentElem = dragElem[0].parentElement;
		    var dropTarget = $(e.target).closest("li").children("ul").first();
		    if( dropTarget.length == 0 ){	
		    	dropTarget = $('<ul></ul>').appendTo($(e.target).closest("li"));
		    } else if ( $(dropTarget).closest("li").is(  $(dragElem).parent().closest("li")) ){
		    	return;
		    }
		    $(dropTarget).append(dragElem);
		    
		    var $treeElem =  $(dropTarget).closest(".Tree");
		    var dropLi =  $(e.target).closest("li")[0];
		    
		    if( $treeElem.attr("data-checkbox") === "visible" ){
		    	$.alopex.widget.tree._traverseDown(dragParentElem);
		    	$.alopex.widget.tree._traverseUp(dragParentElem);
		    	$.alopex.widget.tree._traverseUp(dragElem);
		    }
		    $treeElem.refresh();
	
		    var param = {
		    		dragTarget : 
			    		{
			    			id : dragElem[0].id,
			    			text : $(dragElem[0]).children("a").first().text(),
			    			path : $.alopex.widget.tree._getNodePath(dragElem[0]),
			    			node : dragElem[0],
			    			data : $(dragElem[0]).prop('data')
						},
		    		dropTarget : 
			    		{
			    			id : dropLi.id,
			    			text : $(dropLi).children("a").first().text(),
			    			path : $.alopex.widget.tree._getNodePath(dropLi),
			    			node : dropLi,
			    			data : $(dropLi).prop('data')
						}
		    };
		    $treeElem.trigger("dragdrop", [param]);
		    e.preventDefault();
		},
		
		_treeDragOver : function(e){
			e.preventDefault();
		},

		_getNodeText : function(leaf) {
			return $.alopex.util.trim($(leaf).text());
		},

		_getNodePath : function(leaf) {
			var path = '/' + $.alopex.widget.tree._getNodeText(leaf);
			try {
				while ($(leaf).closest('ul').siblings('a').length > 0) {
					leaf = $(leaf).closest('ul').siblings('a')[0];
					path = '/' + $.alopex.widget.tree._getNodeText(leaf) + path;
				}
				return path;
			} catch (e) {
				return path;
			}

		},

		/**
		 * Key Event Handler for Accessibility
		 */
		_addKeydownEvent : function(el) {
			var i, parent, pass;
			$(el).find('.af-tree-link, li>a').bind('focusin click', function(e) {
				$.alopex.widget.tree.currentTree = el;
				$(window).bind('mousedown', function(e) {
					var target = e.target;
					var ul = $(target).closest('ul');
					if (ul.length === 0 || ul[0] !== el) {
						$(document.body).unbind('keydown');
						$(window).unbind('mousedown');
					}
				});
				$(el).unbind('keydown');
				$(el).bind('keydown', function(e) {
					var target = e.target;
					var $selecttarget = $(target), $ul, $leaves;
					var code = e.keyCode !== null ? e.keyCode : e.which;
					switch (code) {
					case 36: // home
						$selecttarget.removeClass('af-pressed');
						$selecttarget = $($.alopex.widget.tree.currentTree).find('[class~="af-tree-link"]')[0];
						$selecttarget.focus();
						break;
					case 35: // end
						$selecttarget.removeClass('af-pressed');
						target = $($.alopex.widget.tree.currentTree).children('li').last();
						while ($(target).attr('data-expand') === 'true') {
							target = $(target).children('ul').children('li').last();
						}
						$selecttarget = target.find('> [class="af-tree-link"]').focus();
						break;
					case 37: // Left
						if ($selecttarget.parent().attr('data-expand') !== 'true') {
							var $parent = $selecttarget.closest('ul').siblings('[class~="af-tree-link"]');
							if ($parent.length > 0) {
								$selecttarget.removeClass('af-pressed');
								$parent.focus();
							}
						} else {
							$.alopex.widget.tree._toggle($selecttarget.parent()[0]);
						}
						break;
					case 38: // Up
						$ul = $selecttarget.closest('ul');
						$leaves = $ul.find('[class~="af-tree-link"]');

						if ($($selecttarget.parent().prev()).attr('data-expand') === 'false') {
							if ($selecttarget.parent().prev().length !== 0) {
								$($selecttarget.parent().prev().find('[class~="af-tree-link"]')[0]).focus();
								break;
							}
						}

						if ($selecttarget[0] === $leaves.first()[0]) {
							$($ul.siblings('a')).focus();
						} else if ($selecttarget[0] === $leaves.last()[0] && $($selecttarget.parent().siblings()[0]).attr('data-expand') === 'false') {
							$($selecttarget.parent().prev().find('[class~="af-tree-link"]')[0]).focus();
						} else {
							pass = false;
							i = $leaves.length - 1;
							for (; i >= 0; i--) {
								if (!pass) {
									if ($leaves[i] === $selecttarget[0]) {
										pass = true;
									}
								} else {
									if ($($leaves[i]).closest('ul').css('display') !== 'none') {
										break;
									}
								}
							}
							if (i >= 0) {
								$leaves.removeClass('af-pressed');
								$($leaves[i]).focus();
							}
						}
						break;
					case 39: // Right
						if ($selecttarget.parent().attr('data-expand') !== 'true') {
							$.alopex.widget.tree._toggle($selecttarget.parent()[0]);
						} else {
							if ($selecttarget.siblings('ul').find('[class~="af-tree-link"]').length > 0) {
								$selecttarget.removeClass('af-pressed');
								$($selecttarget.siblings('ul').find('[class~="af-tree-link"]').first()).focus();
							}
						}
						break;
					case 40: // Down
						$ul = $selecttarget.closest('ul');
						$leaves = $ul.find('[class~="af-tree-link"]');

						if ($($selecttarget.parent()).attr('data-expand') === 'false') {
							if ($selecttarget.parent().next().length !== 0) {
								$($selecttarget.parent().next().find('[class~="af-tree-link"]')[0]).focus();
								break;
							}
						}

						if ($selecttarget[0] === $leaves.last()[0]) {
							parent = $ul.parent();
							while (parent.next().length === 0) {
								parent = parent.closest('ul').parent();
								if (parent[0] === undefined) {
									return;
								}
							}
							$(parent.next().find('[class~="af-tree-link"]')[0]).focus();
						} else if ($selecttarget[0] === $leaves.first()[0] && $($leaves.first().parent()).attr('data-expand') === 'false' && $leaves.first().siblings('span').length > 0 && $selecttarget.parent().siblings().length === 0) {
							if ($($ul).attr('data-type') !== 'tree') {
								parent = $ul.parent();
								while (parent.next().length === 0) {
									parent = parent.closest('ul').parent();
								}
								$(parent.next().find('[class~="af-tree-link"]')[0]).focus();
							} else {
								if ($selecttarget.parent().next().length > 0) {
									$($selecttarget.parent().next().find('[class~="af-tree-link"]')[0]).focus();
								}
							}
						} else {
							pass = false;
							i = 0;
							for (; i < $leaves.length; i++) {
								if (!pass) {
									if ($leaves[i] === $selecttarget[0]) {
										pass = true;
									}
								} else {
									if ($($leaves[i]).closest('ul').css('display') !== 'none') {
										break;
									}
								}
							}
							if (i < $leaves.length) {
								$leaves.removeClass('af-pressed');
								$($leaves[i]).focus();
							}
						}
						break;
					default:
						return;
					}
					e.stopPropagation();
					e.preventDefault();
				});
			});
		},

		/**
		 * insert checkbox if there isn't checkbox
		 */
		_addCheckbox : function(el) {
			var checkboxVisible = $(el).closest('.Tree').attr('data-checkbox') === 'visible';

			$(el).find('input.Checkbox').each(function() {
				$this = $(this);
				$this.attr('data-type', 'checkbox').checkbox().bind('change click', $.alopex.widget.tree._checkboxHandler);
				$this.attr('style', $this.attr('style') + ';');

				if(checkboxVisible) {
					$this.css('display', 'inline-block');
				} else {
					$this.css('display', 'none')
				};
			});
		},

		/**
		 * Event Handler called when checkbox value is changed
		 */
		_checkboxHandler : function(e) {
			var checkbox = e.currentTarget;
			var $checkbox = $(checkbox);
			// 이전 버전에서는 change 이벤트로 처리하였으나, 오페라 브라우져에서 checked attribute 조작시 change 이벤트가 발생안하는 버그로
			// click 이벤트 사용. setTimeout 사용은 디폴트 액션(상태값 변화) 이후 처리하기 위해서.
			// setTimeout(function() {
				if ($checkbox.is(':checked')) {
					$(checkbox.parentNode).find('input[type="checkbox"]').each(function() {
						this.indeterminate = false;
						this.setAttribute('checked', true);
						this.checked = true;
					});
//					$.alopex.widget.tree._expand($checkbox.parents('li.expandable')[0]);
					
				} else {
					$(checkbox.parentNode).find('input[type="checkbox"]').removeAttr('checked').each(function() {
						this.indeterminate = false;
						this.removeAttribute('checked');
					});
					
					
				}
				$.alopex.widget.tree._traverseUp(checkbox.parentNode);
			// }, 100);
		},

		/**
		 * Checkbox Logic
		 */
		_traverseUp : function(checkbox) {
			var numCheckbox = $(checkbox).closest('ul').find('> li > input').length;
			var numChecked = 0;
			var numIndeterminate = 0;
			$(checkbox).closest('ul').find('> li > input').each(function() {
				if (this.indeterminate) {
					numIndeterminate++;
				} else if ($(this).is(':checked')) {
					numChecked++;
				}
			});
			var parentCheckbox = $(checkbox).closest('ul').siblings('input[type="checkbox"]');
			if (parentCheckbox.length > 0) {
				if (numChecked === 0 && numIndeterminate === 0) {
					parentCheckbox.prop('indeterminate', false);
					parentCheckbox.removeAttr('checked');
					parentCheckbox.each(function() {
						this.indeterminate = false;
						this.removeAttribute('checked');
					});
				} else if (numChecked === numCheckbox) {
					parentCheckbox.prop('indeterminate', false);
					parentCheckbox.attr('checked', 'true');
					parentCheckbox.each(function() {
						this.indeterminate = false;
						this.setAttribute('checked', 'true');
						this.checked = true;
					});

				} else { // indeterminate
					parentCheckbox.prop('indeterminate', true);
					parentCheckbox.removeAttr('checked');
					parentCheckbox.each(function() {
						this.indeterminate = true;
						this.removeAttribute('checked');
					});
				}
				$.alopex.widget.tree._traverseUp(parentCheckbox[0]);
			}
		},
		
		/**
		 * Checkbox Logic 
		 * 하위의 아이템에 대해서 체크박스 로직 검사 
		 */
		_traverseDown : function(checkbox) { 
			var $checkbox = $(checkbox);
			var numCheckbox = $(checkbox).find('> li > input').length;
			var numChecked = 0;
			var numIndeterminate = 0;
			$(checkbox).find('> li > input').each(function() {
				if (this.indeterminate) {
					numIndeterminate++;
				} else if ($(this).is(':checked')) {
					numChecked++;
				}
			});
			
			if (numChecked === 0 && numIndeterminate === 0) {
				$checkbox.prop('indeterminate', false);
				$checkbox.removeAttr('checked');
			} else if (numChecked === numCheckbox) {
				$checkbox.prop('indeterminate', false);
				$checkbox.attr('checked', 'true');
				$checkbox.indeterminate = false;
			} else { // indeterminate
				$checkbox.prop('indeterminate', true);
				$checkbox.removeAttr('checked');
			}
		},
		
		_checkCheckbox: function(el, data) {
			var sortedData = {};
			if(data) {
				for(var i = 0 ; i < data.length ; i++) {
					sort(data[i]);
				}
			}

			function sort(data) {
				var childCheckCount = 0;
				if(data[el.idKey]) {
					sortedData.type = "ID";
					sortedData[data[el.idKey]] = data[el.checked];
				} else {
					sortedData[data[el.textKey]] = data[el.checked];
				}
				
				if(data[el.subItems] && (data[el.subItems] instanceof Array) && (data[el.subItems].length > 0)) {
					for(var i = 0 ; i < data[el.subItems].length ; i++) {
						if(sort(data[el.subItems][i])) {
							childCheckCount++;
						}
					}
					
					if(childCheckCount == data[el.subItems].length) {
						sortedData[data[el.idKey]] = true;
					} else if(childCheckCount > 0) {
						sortedData[data[el.idKey]] = {};
						sortedData[data[el.idKey]].ime = true;
					}

					if(sortedData[data[el.idKey]] == true)
						return true;
					else 
						return false;
				}

				return data[el.checked];
			}

			var $this;
			if(sortedData.type == "ID") {
				$(el).find('li').each(function() {
					$this = $(this);
					checkbox = $this.find('>.af-checkbox')[0];
					$checkbox = $(checkbox);

					if(sortedData[this.id] == true) {
						$checkbox.attr('checked', true);
						checkbox.checked = true;
					} else if(sortedData[this.id] && sortedData[this.id]['ime']) {
						$checkbox.prop('indeterminate', true);
						$checkbox.removeAttr('checked');
						checkbox.indeterminate = true;
						checkbox.removeAttribute('checked');
//						$.alopex.widget.tree._expand(this);
					}
				});
			} 
			else {
				$(el).find('.af-tree-link').each(function() {
					$this = $(this);
					checkbox = $this.find('>.af-checkbox')[0];
					$checkbox = $(checkbox);
					if(sortedData[$this.text()]) {
						$checkbox.attr('checked', true);
						checkbox.checked = true;
					} else if(sortedData[$this.text()] && sortedData[$this.text()]['ime']) {
						$checkbox.prop('indeterminate', true);
						$checkbox.removeAttr('checked');
						checkbox.indeterminate = true;
						checkbox.removeAttribute('checked');
//						$.alopex.widget.tree._expand(this);
					}
				});
			}
		},
		
		_unflatten : function (el, arr) {
			  var tree = [],
			      mappedArr = {},
			      arrElem,
			      mappedElem; 

			  // 1st loop -> create a hash table.
			  for(var i = 0, len = arr.length; i < len; i++) {
			    arrElem = arr[i];
			    mappedArr[arrElem[el.idKey]] = arrElem;
			    mappedArr[arrElem[el.idKey]][el.subItems] = [];
			  }

			  // 2nd loop -> create a tree data.
			  for (var key in mappedArr) {
			    if (mappedArr.hasOwnProperty(key)) {
			      mappedElem = mappedArr[key];
			      // If the element is not at the root level, add it to its parent array of children.
			      if (mappedElem[el.parentIdKey] && mappedArr.hasOwnProperty(mappedElem[el.parentIdKey])) {
			        mappedArr[mappedElem[el.parentIdKey]][el.subItems].push(mappedElem);
			      }
			      // If the element is at the root level, add it to first level elements array.
			      else {
			        tree.push(mappedElem);
			      }
			    }
			  }
			  return tree;
		},
		
		_lazyLoadHandler : function(el, li){
			$.alopex.widget.tree._triggerEvent(el, li, 'lazyLoad');
			$.alopex.widget.tree._expand(li);
		}
	});

})(jQuery);