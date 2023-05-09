import { panda } from "./pandalib.js";
const setting = {
    "timer":{"h":0,"m":0,"s":30},
    "life": 6,
    "size":{"h":4,"l":4}
};
const game = {
    init:function(){
        this.hud.life(setting.life);
        this.hud.timer(setting.timer);
    },
    hud:{
        life:function(life){
            let menu = document.querySelector(".menu.ath");
            if(setting.life == -1){
                menu.querySelector("#life").style.display = "none";
            }else{
                for(let i=1;i<=setting.life;i++){
                    let span = panda.util.newelem("span",{"className":"life-"+i+" nes-icon heart is-large"});
                    menu.querySelector("#life").appendChild(span);
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
                menu.querySelector("#timer h3").innerHTML = texttimer;
            }
        }
    },
    start:function(){

    }
    
}
document.querySelectorAll(".menu.main label").forEach(element => {
    element.addEventListener("click",(e) => {
        switch(e.target.value){
            case "new":
                document.querySelectorAll(".menu").forEach(i =>{
                    if(i.classList.contains("game") || i.classList.contains("ath")){
                        i.style.display = "block";
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