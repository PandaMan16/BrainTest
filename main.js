import { panda } from "./pandalib.js";
const setting = {
    "timer":{"h":0,"m":1,"s":30},
    "life": 3,
    "size":{"h":4,"l":4}
};

let game = {
    val:{cardlist:[],life:0,size:{h:2,l:3},timer:0,gamepause:0,coup:0,pair:{found:0,total:0}},
    select:{"1":null,"2":null},
    intTimer:null,
    init:function(){;
        this.val.life = setting.life;
        this.val.timer = setting.timer.s+(setting.timer.m*60)+(setting.timer.h*3600);
        this.val.size = setting.size;
        this.val.pair.total = this.val.size.h*this.val.size.l/2;
        
        this.hud.info(this.val);
        this.hud.life(setting.life);
        this.hud.timer(setting.timer)
        this.gridgen();
        setTimeout(() => {
            this.val.coup++;
            this.hud.info(this.val);
            this.hud.life(this.val.life,"-1");
            this.val.life = this.val.life-1;
            console.log(this.val.timer);
            this.timer();
        }, 5000);
        setTimeout(() => {
            this.val.coup++;
            this.hud.info(this.val);
            this.hud.life(this.val.life,"-1");
            this.val.life = this.val.life-1;
            console.log(this.val.timer);
            this.timer();
        }, 10000);
    },
    clear:function(){
        
    },
    gridgen:function(){
        let games = document.querySelector(".menu.game");
        let size = this.val.pair.total;
        for (let ncard = 1; ncard <= size; ncard++) {
            let rdm1 = panda.util.rdm(1,size);
            while (typeof this.val.cardlist[rdm1] !== 'undefined') {
                rdm1 = panda.util.rdm(1,size);
            }
            let rdm2 = panda.util.rdm(size+1,size*2);
            while (typeof this.val.cardlist[rdm2] !== 'undefined') {
                rdm2 = panda.util.rdm(size+1,size*2);
            }
            console.log('resultat: ',rdm1,rdm2)
            this.val.cardlist[rdm1] = ncard;
            this.val.cardlist[rdm2] = ncard;
        }
        console.log(this.val.cardlist);
        for (let cardid = 1; cardid < this.val.cardlist.length; cardid++) {
            let card = panda.util.newelem("div",{"className":"card"});
            card.dataset.id = cardid;
            card.appendChild(panda.util.newelem("div",{"className":"front"}));
            card.appendChild(panda.util.newelem("div",{"className":"back"}));
            card.addEventListener("click",(e) =>{
                
            })
            games.appendChild(card);
        }
    },
    hud:{
        life:function(life,option){
            let menu = document.querySelector(".menu.ath");
            
            if(life == -1){
                menu.querySelector("#life").style.display = "none";
            }else{
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
            let menu = document.querySelector(".menu.ath");
            if(timer.h <= 0 && timer.m <= 0 && timer.s <= -1){
                menu.querySelector("#timer").style.display = "none";
            }else{
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
            document.querySelector("#info .coup").innerHTML = "Coup : "+val.coup;
            document.querySelector("#info .pair").innerHTML = "Pair : "+val.pair.found+" / "+val.pair.total;
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
                    this.val.timer--;
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
    }
    
}
document.querySelectorAll(".menu.main label").forEach(element => {
    element.addEventListener("click",(e) => {
        switch(e.target.value){
            case "new":
                document.querySelectorAll(".menu").forEach(i =>{
                    if(i.classList.contains("game") || i.classList.contains("ath")){
                        i.style.display = "";
                    }else{
                        i.style.display = "none";
                    }
                });
                game.init()
                break;
            default:
                break;
        }
    })
});