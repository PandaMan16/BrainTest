const panda = {
    util: {
        word: {
            multiple:function(item,message,speed) { 
              var vars = {
                "part":null,
                "i": 0,
                "offset": 0,
                "len": message.length,
                "forwards": true,
                "skip_count": 0,
                "skip_delay": 15,
                "speed": speed
              }
              var intervale = null;
              intervale = setInterval(function () {
                item.dataset.intervale = intervale;
                if (vars.forwards) {
                  // console.log(item.dataset.stop , vars.i == vars.len-1 , vars.offset == message[vars.i].length)
                  if (vars.offset >= message[vars.i].length) {
                    ++vars.skip_count;
                    if (vars.skip_count == vars.skip_delay) {
                      vars.forwards = false;
                      vars.skip_count = 0;
                    }
                  }
                  if(item.dataset.stop && vars.i == vars.len-1 && vars.offset == message[vars.i].length){
                    clearInterval(intervale);
                    delete item.dataset.intervale;
                  }
                }
                else {
                  if (vars.offset == 0) {
                    vars.forwards = true;
                    vars.i++;
                    vars.offset = 0;
                    if (vars.i >= vars.len) {
                      vars.i = 0;

                    }
                  }
                }
                vars.part = message[vars.i].substr(0, vars.offset);
                if (vars.skip_count == 0) {
                  if (vars.forwards) {
                    vars.offset++;
                  }
                  else {
                    vars.offset--;
                  }
                }
                // console.log();
                if(vars.part == ""){
                  item.innerHTML = "_";
                }else{
                  item.innerHTML = vars.part;
                }
                
              },speed);
            },
            simple:function(item,message,speed) { 
              var vars = {
                "part":null,
                "offset": 0,
                "forwards": true,
                "skip_count": 0,
                "skip_delay": 15,
                "speed": speed
              }
              var intervale = null;
              intervale = setInterval(function () {
                item.dataset.intervale = intervale;
                if (vars.forwards) {
                  if (vars.offset >= message.length) {
                    ++vars.skip_count;
                    if (vars.skip_count == vars.skip_delay) {
                      vars.forwards = false;
                      vars.skip_count = 0;
                      clearInterval(intervale);
                      delete item.dataset.intervale;
                    }
                  }
                }
                vars.part = message.substr(0, vars.offset);
                if (vars.skip_count == 0) {
                  if (vars.forwards) {
                    vars.offset++;
                  }
                }
                item.innerHTML = vars.part;
              },speed);
            },
        },
        rdm:function(min,max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        newelem:function(type, object){
            //exemple -> newElement("span", {"className": "close btn","innerHTML": "&times;"});
            var element = document.createElement(type);    
            for(var i in object){
                element[i] = object[i];
            }
            return element;
        }
    },
    loader: {
      var:{init:false},
      init:function(loader,menu){
        this.var.init = true;
        this.var.loader = loader;
        this.var.menu = menu;
        this.var.loadimage = 0;
        this.var.image = [];
        this.update("show");
        var images = document.querySelectorAll("img, audio");
        if(images.length == 0){
          this.update(50);
          setTimeout(()=>{this.update(100);this.update("hide")},1000)
          
          // this.update("hide");
        }else{
          images.forEach(element => {
            this.new(element,menu);
          });
        }
      },
      setmenu:function(menu){
        this.var.menu = menu;
      },
      new:function(item,menu,type,ext){
        if(this.init == false){
          console.log("need init(elem loader,elemall menu)");
          return;
        }
        this.var.menu = menu;
        let cheminImage = "";
        if(type == "css"){
          cheminImage = window.getComputedStyle(item).style.background.slice(4, -1).replace(/"/g, "");
          item = new Image();
        }
        if(type == "ext"){
          cheminImage = ext;
          item = new Image();
        }
        
        this.var.image.push(item);
        item.addEventListener("load",(e) => {
          // console.log(e);
          panda.loader.resourceLoaded();
        });
        if(cheminImage != ""){
          item.src = cheminImage;
        }
      },
      resourceLoaded:function(){
        this.var.loadimage++;
        if (this.var.loadimage === this.var.image.length) {
          this.update("hide");
          this.var.image = [];
          this.var.loadimage = 0;
        }else{
          this.update("show");
          // console.log(this.var,Math.round((this.var.loadimage / this.var.image.length) * 100));
          this.update(Math.round((this.var.loadimage / this.var.image.length) * 100));
        }
      },
      update:function(state){
        switch (state) {
          case "show":
            this.var.loader.style.display = "";
            this.var.menu.style.display = "none";
            break;
          case "hide":
            this.var.loader.style.display = "none";
            this.var.menu.style.display = "";
            break;
          default:
            this.var.loader.querySelector('.nes-progress__bar').value = state;
            break;
        }
      }
    },
    cookie: {
      save:function(parametres){
        function formatOptions(options) {
          var cookieOptions = '';
        
          // Parcourez toutes les options pour formater la chaîne
          for (var option in options) {
            if (options.hasOwnProperty(option)) {
              cookieOptions += option + '=' + options[option] + ';';
            }
          }
        
          return cookieOptions;
        }
        const options = {
          expires: 365,
          path: '/'
        };
        let parametresJSON = JSON.stringify(parametres);
        document.cookie = 'parametres=' + encodeURIComponent(parametresJSON) + ';' + formatOptions(options);
      },
      read:function(){
        
        var cookies = document.cookie.split(';');
        var parametres = false;
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
      
          if (cookie.indexOf('parametres=') === 0) {
            var parametresJSON = decodeURIComponent(cookie.substring('parametres='.length));
      
            parametres = JSON.parse(parametresJSON);
            break;
          }
        }
      
        return parametres;
      }
    }
}
export { panda };