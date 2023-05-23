import { panda } from "./pandalib.js";

// cache tt sauf le menu principale
document.querySelectorAll(".menu").forEach(i =>{
    if(i.classList.contains("main")){
        i.style.display = "";
    }else{
        i.style.display = "none";
    }
});

// cache ath et demarre le loader
document.querySelector("#ath").style.display = "none";
panda.loader.init(document.querySelector("#loader"),document.querySelector(".main"));
panda.loader.new(document.body,document.querySelector(".main"),"ext",'./img/PandaMan_A_richly_detailed_game_card_with_an_adorable_panda_at__55dac5eb-d929-4c86-a51b-f524148d55a8.png');
//function principale du jeux et ses variable           
let game = {
    menu:"home",
    val:{timers:{h:0,m:0,s:0},chrono:false,select:{"1":null,"2":null},cardlist:[],cardfound:[],life:0,gamelife:5,size:{h:2,l:3},timer:0,gamepause:0,coup:0,pair:{found:0,total:0}},
    lifes:{found:[]},
    intTimer:null,
    init:function(){
        this.clear();
        if(this.val.chrono == true){
            this.val.timer = this.val.timers.s+(this.val.timers.m*60)+(this.val.timers.h*3600);
            this.hud.timer(this.val.timers);
        }else{
            this.val.timer = 0;
            this.hud.timer({"h":0,"m":0,"s":0});
        }
        if(panda.cookie.read("memorie")){
            this.val = panda.cookie.read("memorie");
        }
        // document.querySelector(".menu.setting .h").innerHTML = '<span class="top">&gt;</span>' + this.val.size.h + '<span class="bottom">&gt;</span>';
        // document.querySelector(".menu.setting .l").innerHTML = '<span class="top">&gt;</span>' + this.val.size.l + '<span class="bottom">&gt;</span>';
        // document.querySelector(".menu.setting .life").innerHTML = '<span class="top">&gt;</span>' + this.val.gamelife + '<span class="bottom">&gt;</span>';
        this.val.pair.total = this.val.size.h*this.val.size.l/2;
        this.val.pair.found = 0;
        this.val.cardlist = [];
        this.val.cardfound = [];
        this.val.gamepause = 0;
        this.val.coup = 0;
        this.val.life = this.val.gamelife;
        this.val.select = {"1":null,"2":null};

        this.hud.info(this.val);
        this.hud.life(this.val.life);
        this.timer(true);
    },
    clear:function(){
        document.querySelector(".menu.game").innerHTML = "";
        document.querySelector("#life > .life").innerHTML = "";
        this.lifes.found = [];
    },
    updateSettings:function(newSettings) {
        if (newSettings.size) this.val.size = newSettings.size;
        if (newSettings.gamelife) this.val.gamelife = newSettings.gamelife;
        if (newSettings.useTimer) this.val.useTimer = newSettings.useTimer;
        if (newSettings.timer) this.val.timer = newSettings.timer;
        if (newSettings.chrono) this.val.chrono = newSettings.chrono;
        panda.cookie.save(this.val,"memorie");
    },
    end:function(endtype,raison){
        let games = document.querySelector(".menu.game");
        this.timer();
        if(endtype == "victory"){
            games.innerHTML = "";
            games.style.gridTemplateColumns = "repeat(1, 1fr)";
            games.style.gridTemplateRows = "repeat(1, 1fr)";
            document.querySelectorAll(".menu").forEach(element => {
                if(element.classList.contains("end")){
                    element.style.display = "";
                    element.querySelector("h1").innerHTML = "Felicitation";
                    panda.util.word.simple(element.querySelector("p.word"),"Vous avez fait "+this.val.coup+" coups en "+panda.util.secondToHHMMSS(this.val.timer),100);
                }else{
                    element.style.display = "none";
                }
            });
        }else{
            games.querySelectorAll(".card").forEach(element => {
                element.classList.add("return");
            });
            setTimeout(() => {
                document.querySelector("#timer > .timer").style = "transform:scale(2);";
                let savetimer = game.val.timer;
                let endinterval = setInterval(() => {
                    game.val.timer--;
                    if(game.val.timer == 0){
                        document.querySelector("#timer > .timer").style = "";
                        games.innerHTML = "";
                        games.style.gridTemplateColumns = "repeat(1, 1fr)";
                        games.style.gridTemplateRows = "repeat(1, 1fr)";
                        document.querySelectorAll(".menu").forEach(element => {
                            if(element.classList.contains("end")){
                                element.style.display = "";
                                element.querySelector("h1").innerHTML = "Perdu";
                                panda.util.word.simple(element.querySelector("p.word"),"Vous avez fait "+this.val.coup+" coups en "+panda.util.secondToHHMMSS(savetimer),100);
                            }else{
                                element.style.display = "none";
                            }
                        });
                        clearInterval(endinterval);
                    }
                    let h = Math.floor(this.val.timer/3600);
                    let m = Math.floor((this.val.timer-(h*3600))/60);
                    let s = this.val.timer-((h*3600)+(m*60));
                    this.hud.timer({"h":h,"m":m,"s":s});
                },10);
            }, 2000);
        }
    },
    gridgen:function(){
        let games = document.querySelector(".menu.game");
        
        panda.loader.setmenu(document.querySelector("#ath,.game"));
        panda.loader.update("show");
        game.menu = "game";
        games.style.gridTemplateColumns = "repeat("+this.val.size.l+", 1fr)";
        games.style.gridTemplateRows = "repeat("+this.val.size.h+", 1fr)";
        let size = this.val.pair.total;
        const fixedrdm = 156;
        for (let ncard = 1; ncard <= size; ncard++) {
            var rdm1 = panda.util.rdm(0,size*2-1);
            while (typeof this.val.cardlist[rdm1] === 'number') {
                
                rdm1 = panda.util.rdm(0,size*2-1);
            }
            this.val.cardlist[rdm1] = ncard;

            var rdm2 = panda.util.rdm(0,size*2-1);
            while (typeof this.val.cardlist[rdm2] === 'number') {
                rdm2 = panda.util.rdm(0,size*2-1);
            }
            this.val.cardlist[rdm2] = ncard;
        }
        for (let cardid = 0; cardid <= this.val.cardlist.length-1; cardid++) {
            let card = panda.util.newelem("div",{"className":"card"});
            let front = panda.util.newelem("div",{"className":"front"});
            const meid = this.val.cardlist[cardid]+fixedrdm;
            let back = panda.util.newelem("div",{"className":"back","style":'background-image: url("https://picsum.photos/id/'+meid+'/800/800");'});
            card.dataset.id = cardid;
            // front.appendChild(panda.util.newelem("img",{"className":"nes-avatar","style":"image-rendering: pixelated;width:100%;height:auto;","src":"https://pandatown.fr/assets/img/PandaMor3ackV2.png"}))
            card.appendChild(front);
            card.appendChild(back);
            panda.loader.new(card,document.querySelector("#ath,.game"),"ext",'https://picsum.photos/id/'+meid+'/800/800',document.querySelector(".menu .game"));

            card.addEventListener("click",(e) =>{
                let i = e.target.closest('.card');
                game.coup(i,i.dataset.id);
            });
            games.appendChild(card);
        }
    },
    hud:{
        menu:function(type){
            if(type = "setting"){
                game.hud.info(-1);
                game.hud.life(-1);
                game.hud.timer({"s":-1});
                game.menu = "setting";
            }else if(type = "home"){

            }else if(type = "game"){
                
            }else if(type = "end"){

            }
        },
        life:function(life,option){
            let menu = document.querySelector("#ath");
            
            if(life == -1){
                menu.querySelector("#life").style.display = "none";
            }else{
                menu.querySelector("#life").style.display = "";
                if(option){
                    if(option == "-1"){
                        menu.querySelector(".life-"+life).classList.add("is-transparent")
                    }
                }else{
                    for(let i=1;i<=life;i++){
                        let span = panda.util.newelem("span",{"className":"life-"+i+" is-small nes-icon heart"});
                        menu.querySelector("#life .life").appendChild(span);
                    }
                }
            }
        },
        timer:function(timer){
            let menu = document.querySelector("#ath");
            if(timer.s <= -1){
                menu.querySelector("#timer").style.display = "none";
            }else{
                menu.querySelector("#timer").style.display = "";
                let texttimer = panda.util.secondToHHMMSS(game.val.timer);
                menu.querySelector("#timer .timer").innerHTML = texttimer;
            }
        },
        info:function(val){
            if(val == -1){
                document.querySelector("#info").style.display = "none";
            }else{
                document.querySelector("#info").style.display = "";
                document.querySelector("#info .coup").innerHTML = "Coup : "+val.coup;
                document.querySelector("#info .pair").innerHTML = "Pair : "+val.pair.found+" / "+val.pair.total;
            }
        }
    },
    coup:function(item,id){
        if(this.val.cardfound.includes(this.val.cardlist[id])){
            return;
        }
        if(id == this.val.select[1] || id == this.val.select[2]){
            return;
        }
        if(this.val.gamepause == 0){
            this.timer();
        }
        
        if(this.val.select[1] === null){
            this.val.select[1] = id;
            item.removeEventListener("click",()=>{});
            item.classList.add("return");
        }else if(this.val.select[2] === null){
            this.val.select[2] = id;
            this.val.coup++;
            item.classList.add("return");
            if(this.val.cardlist[this.val.select[2]] == this.val.cardlist[this.val.select[1]]){
                this.val.pair.found++;
                this.val.cardfound.push(this.val.cardlist[this.val.select[2]]);
                setTimeout(()=>{
                        document.querySelectorAll(".card").forEach(element => {
                        
                            if(element.dataset.id == this.val.select[1] || element.dataset.id == this.val.select[2]){
                                element.style.background = "";
                                element.innerHTML = "";
                            }
                        });
                        this.val.select[1] = null;
                        this.val.select[2] = null;                    
                },1500);
            }else{
                if(this.val.life != 0){
                    this.life(this.val.select[1],this.val.select[2]);
                }
                item.removeEventListener("click",()=>{});
                setTimeout(()=>{
                    
                    if(game.val.gamepause == 1){
                        document.querySelectorAll(".menu .card").forEach(element => {
                            if(element.dataset.id == this.val.select[1] || element.dataset.id == this.val.select[2]){
                                element.classList.remove("return");
                            }
                        });
                        this.val.select[1] = null;
                        this.val.select[2] = null;
                    }
                },1500);
                
            }
            this.hud.info(this.val);
            if(this.val.pair.found == this.val.pair.total){
                this.end("victory");
                
            }
            // this.hud.life(setting.life);
        }

    },
    timer:function(state){
        if(state){
            switch (state) {
                case 0:
                    this.val.gamepause = 0;
                    break;
                default:
                    this.val.gamepause = 1;
                    break;
            }
        }
        switch (this.val.gamepause) {
            case 1:
                this.val.gamepause = 0;
                clearInterval(this.intTimer);
                break;
            case 0:
                this.val.gamepause = 1;
                this.intTimer = setInterval(() => {
                    if(this.val.chrono==true){ 
                        this.val.timer--;
                    }else{
                        this.val.timer++;
                    }
                    if(this.val.timer == 0){
                        clearTimeout(this.intTimer);
                    }
                    let h = Math.floor(this.val.timer/3600);
                    let m = Math.floor((this.val.timer-(h*3600))/60);
                    let s = this.val.timer-((h*3600)+(m*60));
                    this.hud.timer({"h":h,"m":m,"s":s});
                }, 1000);
                break;
        }
    },
    setting:{
        add:function(text,div){
            
        },
        set:function(elem,type){
            switch (elem.classList[0]) {
                case "h":
                    let h1 = game.val.size.h;
                    let l1 = game.val.size.l;
                    if(type == "+"){
                        if(parseInt(l1) % 2 != 0){
                            if(h1 < 8){
                                h1++;
                                h1++;
                            }
                        }else{
                            if(h1 < 9){
                                h1++;
                            }
                        }
                        game.updateSettings({size:{h:h1,l:l1}});
                        panda.util.uditem.set(elem,h1);
                    }else if(type == "-"){
                        if(parseInt(l1) % 2 != 0){
                            if(h1 > 3){
                                h1--;
                                h1--;
                            }
                        }else{
                            if(l1 > 2){
                                h1--;
                            }
                        }
                        game.updateSettings({size:{h:h1,l:l1}});
                        panda.util.uditem.set(elem,h1);
                    }
                    break;
                case "l":
                    let h2 = game.val.size.h;
                    let l2 = game.val.size.l;
                    if(type == "+"){
                        if(parseInt(h2) % 2 != 0){
                            if(l2 < 8){
                                l2++;
                                l2++;
                            }
                        }else{
                            if(l2 < 9){
                                l2++;
                            }
                        }
                        game.updateSettings({size:{h:h2,l:l2}});
                        panda.util.uditem.set(elem,l2);
                    }else if(type == "-"){
                        if(parseInt(h2) % 2 != 0){
                            if(l2 > 3){
                                l2--;
                                l2--;
                            }
                        }else{
                            if(l2 > 2){
                                l2--;
                            }
                        }
                        game.updateSettings({size:{h:h2,l:l2}});
                        panda.util.uditem.set(elem,l2);
                    }
                    break;
                case "life":
                    if(type == "+"){
                        let newlife = game.val.gamelife;
                        if(newlife == -1){
                            newlife = 1;
                        }else if(newlife < 10){
                            newlife++;
                        }
                        game.updateSettings({gamelife:newlife});
                        panda.util.uditem.set(elem,newlife);
                    }else if(type == "-"){
                        let newlife = game.val.gamelife;
                        if(newlife <= 1){
                            newlife = -1;
                        }else{
                            newlife--;
                        }
                        game.updateSettings({gamelife:newlife});
                        panda.util.uditem.set(elem,newlife);
                    }
                    break;
                default:

                    break;
            }
        }
    },
    clavier:{
        game:function(direction){
            let select = document.querySelector(".keyselect");
            let undef;
            if(select){
                select.classList.remove("keyselect");
                select = select.dataset.id;
                if(direction == "up" || direction == "down"){
                    let max = game.val.size.h;
                    let lines = [];
                    let tline = [];
                    let sline = null;
                    for(let i = 0;i< game.val.size.l;i++){
                        for(let t = 0;t < max;t++){
                            tline.push(max*t+i);
                            if(max*t+i == select){
                                sline = i;
                            }
                        }
                        lines.push(tline);
                        tline = [];
                    }
                    let endselect;
                    for(let i = 0 ;i < lines[sline].length;i++){
                        if(lines[sline][i] == select){
                            let i1;
                            if(direction == "down"){
                                i1 = i+1;
                            }else if(direction == "up"){
                                i1 = i-1;
                            }
                            if(lines[sline][i1] !== undef){
                                endselect = lines[sline][i1];
                            }else{
                                if(direction == "down"){
                                    endselect = lines[sline][0];
                                }else if(direction == "up"){
                                    endselect = lines[sline][max-1];
                                }
                                // console.log(lines,sline,max)
                            }
                        }
                    }
                    document.querySelectorAll(".card").forEach(element => {
                        if(element.dataset.id == endselect){
                            element.classList.add("keyselect");
                        }
                    });
                }else{
                    let max = game.val.size.l;
                    let lines = [];
                    let tline = [];
                    let sline = null;
                    for(let i = 0; i <= game.val.cardlist.length; i++){
                        // console.log(lines.length);
                        tline.push(i);
                        if(i == select){
                            sline = lines.length;
                            // console.log("select");
                        }
                        if(tline.length == max){
                            lines.push(tline);
                            tline = [];
                        }
                        
                    }
                    let endselect;
                    for(let i = 0 ;i < lines[sline].length;i++){
                        if(lines[sline][i] == select){
                            let i1;
                            if(direction == "right"){
                                i1 = i+1;
                            }else if(direction == "left"){
                                i1 = i-1;
                            }
                            if(lines[sline][i1] !== undef){
                                endselect = lines[sline][i1];
                            }else{
                                if(direction == "right"){
                                    endselect = lines[sline][0];
                                }else if(direction == "left"){
                                    endselect = lines[sline][max-1];
                                }
                            }
                        }
                    }
                    document.querySelectorAll(".card").forEach(element => {
                        if(element.dataset.id == endselect){
                            element.classList.add("keyselect");
                        }
                    });
                }
            }else{
                document.querySelectorAll(".card").forEach(element => {
                    if(element.dataset.id == 0){
                        element.classList.add("keyselect");
                        return;
                    }
                });
            }
        }
    },
    life:function(id1,id2){
        if(this.lifes.found.includes(id1) && this.lifes.found.includes(id2)){
            this.val.life--;            
            this.hud.life(this.val.life+1,"-1");
            if(this.val.life == 0){
                this.end("defeat","lifedown");
            }
        }
        if(!this.lifes.found.includes(id1)){
            this.lifes.found.push(id1);
        }
        if(!this.lifes.found.includes(id2)){
            this.lifes.found.push(id2);
        }
    }
}

// initialisation
game.init();
panda.util.uditem.add(document.querySelector(".menu.setting .h"),game.val.size.h,game.setting.set);
panda.util.uditem.add(document.querySelector(".menu.setting .l"),game.val.size.l,game.setting.set);
panda.util.uditem.add(document.querySelector(".menu.setting .life"),game.val.life,game.setting.set);

// gestion des button menu principale
document.querySelectorAll(".menu.main label").forEach(element => {
    
    element.addEventListener("click",(e) => {
        setTimeout(()=>{
            e.target.checked = false;
        },1000);
        switch(e.target.value){
            case "new":
                document.querySelector("#ath").style.display = "";
                document.querySelectorAll(".menu").forEach(i =>{
                    if(i.classList.contains("game")){
                        i.style.display = "";
                    }else{
                        i.style.display = "none";
                    }
                });
                game.init();
                game.gridgen();
                break;
            case "setting":
                document.querySelector("#ath").style.display = "";
                game.hud.menu("setting");
                document.querySelectorAll(".menu").forEach(i => {
                    if(i.classList.contains("setting")){
                        i.style.display = "";
                    }else{
                        i.style.display = "none";
                    }
                });
                // game.setting.show();
            default:
                break;
        }
    })
});

// gestion du button retour dans l'ath
document.querySelector("#backbt").addEventListener("click",(e) => {
    game.timer(true);
    game.menu = "home";
    document.querySelectorAll(".menu").forEach(element => {
        if(element.classList.contains("main")){
            element.style.display = "";
        }else{
            element.style.display = "none";
        }
    });
    document.querySelector("#ath").style.display = "none";
});

//gestion du clavier
window.addEventListener("keydown",(e) => {
    let menu = game.menu;
    // console.log(game.val.gamepause);
    if(menu == "game"){
        switch (e.code) {
            case "ArrowDown":
                game.clavier.game("down");
                break;
            case "ArrowRight":
                game.clavier.game("right");
                break;
            case "ArrowLeft":
                game.clavier.game("left")
                break;
            case "ArrowUp":
                game.clavier.game("up")
                break;
            case "Escape":
                game.timer(true);
                game.menu = "home";
                document.querySelectorAll(".menu").forEach(element => {
                    if(element.classList.contains("main")){
                        element.style.display = "";
                    }else{
                        element.style.display = "none";
                    }
                });
                document.querySelector("#ath").style.display = "none";
                break;
            case "Enter":
                let i = document.querySelector(".keyselect");
                if(i){
                    game.coup(i,i.dataset.id);
                }
                break;
            case "Space":
                let it = document.querySelector(".keyselect");
                if(it){
                    game.coup(it,it.dataset.id);
                }
                break;
            case "NumpadEnter":
                let itn = document.querySelector(".keyselect");
                if(itn){
                    game.coup(itn,itn.dataset.id);
                }
                break;
            default:
                // console.log(e)
                return;
        }
    } else if(menu == "home"){
        switch (e.key){
            case "ArrowDown":
                let end = 0;
                document.querySelectorAll("nav > label").forEach(element => {
                    if(element.querySelector("input").checked == true){
                        end = 1;
                        element.querySelector("input").checked = false;
                    }else if(element.querySelector("input").disabled == false){
                        if(end == 1){
                            element.querySelector("input").checked = true;
                            end = 0;
                        }
                    }
                });
                if(end == 1){
                    document.querySelectorAll("nav > label").forEach(element => {
                        element.querySelector("input").checked = false;
                    });
                    document.querySelector("nav > label").querySelector("input").checked = true;
                }
                break;
            case "ArrowUp":
                let end2 = 0;
                document.querySelectorAll("nav > label").forEach(element => {
                    if(element.querySelector("input").checked == true){
                        end2 = 1;
                        element.querySelector("input").checked = false;
                    }else if(element.querySelector("input").disabled == false){
                        if(end2 == 1){
                            element.querySelector("input").checked = true;
                            end2 = 0;
                        }
                    }
                });
                if(end2 == 1){
                    document.querySelectorAll("nav > label").forEach(element => {
                        element.querySelector("input").checked = false;
                    });
                    document.querySelector("nav > label").querySelector("input").checked = true;
                }
                break;
            case "Enter":
                document.querySelectorAll("nav > label").forEach(element => {
                    if(element.querySelector("input").checked == true){
                        switch (element.querySelector("input").value) {
                            case "new":
                                document.querySelector("#ath").style.display = "";
                                document.querySelectorAll(".menu").forEach(i =>{
                                    if(i.classList.contains("game")){
                                        i.style.display = "";
                                    }else{
                                        i.style.display = "none";
                                    }
                                });
                                game.init();
                                game.gridgen();
                                game.timer(false);
                                break;
                            case "setting":
                                document.querySelector("#ath").style.display = "";
                                game.hud.menu("setting");
                                document.querySelectorAll(".menu").forEach(i => {
                                    if(i.classList.contains("setting")){
                                        i.style.display = "";
                                    }else{
                                        i.style.display = "none";
                                    }
                                });
                            default:
                                break;
                        }
                    }
                    
                });
                break;
            case "Escape":
                game.timer(true);
                game.menu = "home";
                document.querySelectorAll(".menu").forEach(element => {
                    if(element.classList.contains("main")){
                        element.style.display = "";
                    }else{
                        element.style.display = "none";
                    }
                });
                document.querySelector("#ath").style.display = "none";
                break;
        }
    } else if(menu == "setting"){
        var checkedelem = null;
        var kselelem = null;
        document.querySelectorAll(".menu.setting > label").forEach(element => {
            if(element.querySelector("input").checked == true){
                checkedelem = element;
                if(element.querySelector("span > span.ksel") !== undefined){
                    kselelem = element.querySelector("span > span.ksel");
                }
            }
        });
        if(checkedelem == null){
            checkedelem = document.querySelector(".menu.setting > label");
            checkedelem.querySelector("input").checked = true;
        }else{
            switch (e.code) {
                case "ArrowDown":
                    if(checkedelem.nextElementSibling && kselelem == null){
                        checkedelem.querySelector("input").checked = "";
                        checkedelem.nextElementSibling.querySelector("input").checked = true;
                    }else if(checkedelem != null && kselelem != null){
                        game.setting.set(kselelem,"-");
                    }
                    break;
                case "ArrowUp":
                    if(checkedelem.previousElementSibling && kselelem == null){
                        checkedelem.querySelector("input").checked = "";
                        checkedelem.previousElementSibling.querySelector("input").checked = true;
                    }else if(checkedelem != null && kselelem != null){
                        game.setting.set(kselelem,"+");
                    }
                    break;
                case "ArrowRight":
                    if(kselelem == null){
                        checkedelem.querySelector("span > span").classList.add("ksel");
                    }else if(checkedelem.querySelectorAll("span > span").length != 1){
                        if(kselelem.nextElementSibling){
                            kselelem.classList.remove("ksel");
                            kselelem.nextElementSibling.classList.add("ksel");
                        }
                    }
                    break;
                case "ArrowLeft":
                    if(kselelem != null){
                        if(checkedelem.querySelectorAll("span > span").length != 1){
                            if(kselelem.previousElementSibling){
                                kselelem.classList.remove("ksel");
                                kselelem.previousElementSibling.classList.add("ksel");
                            }else{
                                kselelem.classList.remove("ksel");
                            }
                        }
                    }
                case "Escape":
                    game.timer(true);
                    game.menu = "home";
                    document.querySelectorAll(".menu").forEach(element => {
                        if(element.classList.contains("main")){
                            element.style.display = "";
                        }else{
                            element.style.display = "none";
                        }
                    });
                    document.querySelector("#ath").style.display = "none";
                    break;
                default:
                    return;
            }
        }
        
    }
    
});