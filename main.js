import { panda } from "./pandalib.js";


let game = {
    val:{timers:{h:0,m:1,s:30},chrono:false,select:{"1":null,"2":null},cardlist:[],cardfound:[],life:0,gamelife:-1,size:{h:6,l:4},timer:0,gamepause:0,coup:0,pair:{found:0,total:0}},
    intTimer:null,
    init:function(){;
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
        this.gridgen();
        // setTimeout(() => {
        //     this.val.coup++;
        //     this.hud.info(this.val);
        //     this.hud.life(this.val.life,"-1");
        //     this.val.life = this.val.life-1;
        //     // console.log(this.val.timer);
        //     this.timer();
        // }, 5000);
        // setTimeout(() => {
        //     this.val.coup++;
        //     this.hud.info(this.val);
        //     this.hud.life(this.val.life,"-1");
        //     this.val.life = this.val.life-1;
        //     // console.log(this.val.timer);
        //     this.timer();
        // }, 10000);
    },
    clear:function(){
        
    },
    gridgen:function(){
        let games = document.querySelector(".menu.game");
        games.style.gridTemplateColumns = "repeat("+this.val.size.l+", 1fr)";
        games.style.gridTemplateRows = "repeat("+this.val.size.h+", 1fr)";
        let size = this.val.pair.total;
        for (let ncard = 1; ncard <= size; ncard++) {
            let rdm1 = panda.util.rdm(0,size*2-1);
            while (typeof this.val.cardlist[rdm1] !== 'undefined') {
                rdm1 = panda.util.rdm(0,size*2-1);
            }
            let rdm2 = panda.util.rdm(0,size*2-1);
            while (typeof this.val.cardlist[rdm2] !== 'undefined') {
                rdm2 = panda.util.rdm(0,size*2-1);
            }
            // console.log('resultat: ',rdm1,rdm2)
            this.val.cardlist[rdm1] = ncard;
            this.val.cardlist[rdm2] = ncard;
        }
        // console.log(this.val.cardlist);
        for (let cardid = 0; cardid < this.val.cardlist.length; cardid++) {
            console.log(this.val.cardlist);
            let card = panda.util.newelem("div",{"className":"card"});
            card.dataset.id = cardid;
            card.appendChild(panda.util.newelem("div",{"className":"front","innerHTML":this.val.cardlist[cardid]}));
            card.appendChild(panda.util.newelem("div",{"className":"back"}));
            card.addEventListener("click",(e) =>{
                let i = e.target.closest('.card');
                game.coup(i,i.dataset.id);
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
    coup:function(item,id){
        console.log(this.val.cardfound.includes(this.val.cardlist[id]));
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
                        // console.log(this);
                        if(element.dataset.id == this.val.select[1] || element.dataset.id == this.val.select[2]){
                            console.log(element);
                            element.classList.remove("return");
                        }
                    });
                    this.val.select[1] = null;
                    this.val.select[2] = null;
                },1500);
                
            }
            this.hud.info(this.val);
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