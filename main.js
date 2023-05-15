import { panda } from "./pandalib.js";
document.querySelectorAll(".menu").forEach(i =>{
    if(i.classList.contains("main")){
        i.style.display = "";
    }else{
        i.style.display = "none";
    }
});
document.querySelector("#ath").style.display = "none";
panda.loader.init(document.querySelector("#loader"),document.querySelector(".main"));
panda.loader.new(document.body,document.querySelector(".main"),"ext",'http://localhost/memorie/img/PandaMan_A_richly_detailed_game_card_with_an_adorable_panda_at__55dac5eb-d929-4c86-a51b-f524148d55a8.png');
let game = {
    val:{timers:{h:0,m:1,s:30},chrono:false,select:{"1":null,"2":null},cardlist:[],cardfound:[],life:0,gamelife:-1,size:{h:2,l:3},timer:0,gamepause:0,coup:0,pair:{found:0,total:0}},
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
        // setTimeout(() => {
        //     this.val.coup++;
        //     this.hud.info(this.val);
        //     this.hud.life(this.val.life,"-1");
        //     this.val.life = this.val.life-1;
        //     this.timer();
        // }, 5000);
        // setTimeout(() => {
        //     this.val.coup++;
        //     this.hud.info(this.val);
        //     this.hud.life(this.val.life,"-1");
        //     this.val.life = this.val.life-1;
        //     this.timer();
        // }, 10000);
    },
    clear:function(){
        document.querySelector(".menu.game").innerHTML = "";
    },
    updateSettings:function(newSettings) {
        if (newSettings.size) this.val.size = newSettings.size;
        if (newSettings.lives) this.val.lives = newSettings.lives;
        if (newSettings.useTimer) this.val.useTimer = newSettings.useTimer;
        if (newSettings.timer) this.val.timer = newSettings.timer;
        if (newSettings.chrono) this.val.chrono = newSettings.chrono;
    },
    end:function(){
        let games = document.querySelector(".menu.game");
        games.innerHTML = "";
        games.style.gridTemplateColumns = "repeat(1, 1fr)";
        games.style.gridTemplateRows = "repeat(1, 1fr)";
        document.querySelectorAll(".menu").forEach(element => {
            if(element.classList.contains("end")){
                element.style.display = "";
                element.querySelector("h1").innerHTML = "Felicitation";
                panda.util.word.simple(element.querySelector("p.word"),"Vous avez fait "+this.val.coup+" coup en "+this.val.timer+"s",100);
            }else{
                element.style.display = "none"
            }
        });
        this.timer();
    },
    gridgen:function(){
        let games = document.querySelector(".menu.game");
        
        panda.loader.setmenu(document.querySelector("#ath,.game"));
        panda.loader.update("show");
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
            let back = panda.util.newelem("div",{"className":"back","style":'background-image: url("https://picsum.photos/id/'+meid+'/200/200");'});
            card.dataset.id = cardid;
            // front.appendChild(panda.util.newelem("img",{"className":"nes-avatar","style":"image-rendering: pixelated;width:100%;height:auto;","src":"https://pandatown.fr/assets/img/PandaMor3ackV2.png"}))
            card.appendChild(front);
            card.appendChild(back);
            panda.loader.new(card,document.querySelector("#ath,.game"),"ext",'https://picsum.photos/id/'+meid+'/200/200',document.querySelector(".menu .game"));

            card.addEventListener("click",(e) =>{
                let i = e.target.closest('.card');
                game.coup(i,i.dataset.id);
            });
            games.appendChild(card);
        }
    },
    hud:{
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
                        let span = panda.util.newelem("span",{"className":"life-"+i+" nes-icon heart"});
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
                let texttimer = "";
                
                if(timer.h <= 0){
                    texttimer += "";
                }else if(timer.h < 10){
                    texttimer += "0"+timer.h+":";
                }else{
                    texttimer += timer.h+":";
                }
                if(timer.m <= 0){
                    texttimer += "00:";
                }else if(timer.m < 10){
                    texttimer += "0"+timer.m+":";
                }else{
                    texttimer += timer.m+":";
                }
                if(timer.s <= 0){
                    texttimer += "00";
                }else if(timer.s < 10){
                    texttimer += "0"+timer.s;
                }else{
                    texttimer += timer.s;
                }
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
                item.removeEventListener("click",()=>{});
                setTimeout(()=>{
                    document.querySelectorAll(".menu .card").forEach(element => {
                        if(element.dataset.id == this.val.select[1] || element.dataset.id == this.val.select[2]){
                            element.classList.remove("return");
                        }
                    });
                    this.val.select[1] = null;
                    this.val.select[2] = null;
                },1500);
                
            }
            this.hud.info(this.val);
            if(this.val.pair.found == this.val.pair.total){
                this.end();
                
            }
            // this.hud.life(setting.life);
        }

    },
    timer:function(){
        switch (this.val.gamepause) {
            case 1:
                this.val.gamepause = 0;
                clearInterval(this.intTimer);
                break;
            case 0:
                this.val.gamepause = 1;
                this.intTimer = setInterval(() => {
                    //window.
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
        show:function(){
            game.hud.info(-1);
            game.hud.life(-1);
            game.hud.timer({"s":-1});
        }
    },
    home:function(){
        
    }
    
}
game.init();
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
                document.querySelectorAll(".menu").forEach(i => {
                    if(i.classList.contains("setting")){
                        i.style.display = "";
                    }else{
                        i.style.display = "none";
                    }
                });
                game.setting.show();
            default:
                break;
        }
    })
});

document.querySelector("#backbt").addEventListener("click",(e) => {
    document.querySelectorAll(".menu").forEach(element => {
        if(element.classList.contains("main")){
            element.style.display = "";
        }else{
            element.style.display = "none";
        }
    });
    document.querySelector("#ath").style.display = "none";
});