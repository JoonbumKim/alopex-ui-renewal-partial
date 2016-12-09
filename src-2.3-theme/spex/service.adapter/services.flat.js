$.alopex.service.setup({
  "FLAT" : {
    platform : true,
    before : [
      function(id,data){
        var request = this;
        request.data = $.isPlainObject(data) ? JSON.stringify(data) : data;
        request.method = "POST";
        request.headers["Content-Type"] = "application/json; charset=UTF-8";
      }
    ],
    after : [
      function(){
        var response = this;
        response.success = false;
        try{
          response.data = JSON.parse(response.responseText);
          response.success = true;
        } catch(e) {
          response.data = {};
        }
      }
    ]
  }
});