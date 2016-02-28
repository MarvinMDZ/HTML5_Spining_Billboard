var adDiv,cubeDiv,intervaloGiro;
var currentRotation = 0;
var degree;


function initEB() {
    if (!EB.isInitialized()) {
        EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAd);
    } else {
        startAd();
    }
}

function startAd() {
    adDiv = document.getElementById("ad");
    cubeDiv = document.getElementById("cube");
    adDiv.addEventListener("touchstart",onTouchStartedDraggable);
    autoSpin();

}

function onTouchStartedDraggable(e){
    
    e && e.preventDefault() && e.stopPropagation();
    clearInterval(intervaloGiro);
    initPosY = e.changedTouches[0].clientY;
    initRotation = currentRotation;

    setSpinSpeed(.5);
    applyTransition("scale(0.65) rotateX("+currentRotation+"deg) translateZ(0px)");
    adDiv.addEventListener('touchmove',onTouchMoveDraggable);
    adDiv.addEventListener('touchend',onTouchEndedDraggable);
    adDiv.addEventListener('touchcancelled',onTouchEndedDraggable);
}
function onTouchMoveDraggable(e){
    e && e.preventDefault() && e.stopPropagation();
    degree = Math.round(currentRotation-(e.changedTouches[0].clientY-initPosY)*90/250);
    setSpinSpeed(0.1);
    applyTransition("scale(0.65) rotateX("+degree+"deg) translateZ(0px)");
    
}
function onTouchEndedDraggable(e){
    e && e.preventDefault() && e.stopPropagation();
    var diff = 0;
    clearInterval(intervaloGiro);
    degree = Math.round(currentRotation-(e.changedTouches[0].clientY-initPosY)*90/250);
    
    if(degree>initRotation){
        while(degree%90!=0){
            degree++;
            diff++;
        }
        degree+=((Math.floor(Math.abs(diff)/90))*90);
        EB.userActionCounter("Drag User Cube Left");
    }else{
        while(degree%90!=0){
            degree--;
            diff--;
        }
        degree-=((Math.floor(Math.abs(diff)/90))*90);
        EB.userActionCounter("Drag User Cube Right");
    }
    currentRotation = degree;
    var speed = (Math.abs(diff)/90)+.5;
    setSpinSpeed(speed);
    applyTransition("scale(0.65) rotateX("+currentRotation+"deg) translateZ(0px)");

    adDiv.removeEventListener('touchmove',onTouchMoveDraggable);
    adDiv.removeEventListener('touchend',onTouchEndedDraggable);
    adDiv.removeEventListener('touchcanceled',onTouchEndedDraggable);

    setTimeout(function(){
        setSpinSpeed(.5);
        applyTransition("scale(0.88) rotateX("+currentRotation+"deg) translateZ(0px)");
    },speed*1000);

    setTimeout(function(){
        autoSpin();
    },1000);
}

function autoSpin(){
    clearInterval(intervaloGiro);
    intervaloGiro = setInterval(function(){
        setSpinSpeed(.5);
        applyTransition("scale(0.65) rotateX("+currentRotation+"deg) translateZ(0px)");
        setTimeout(function(){
            setSpinSpeed(1);
            EB.automaticEventCounter("Cube Auto Spin");
            applySpin();  
        },500);       
    }, 7000);
}

function applySpin(degrees){
    if(!isNaN(degrees)){
        currentRotation += degrees;
    }else{
        currentRotation += 90;
    }
    applyTransition("scale(0.65) rotateX("+currentRotation+"deg) translateZ(0px)");
    
    setTimeout(function(){
        setSpinSpeed(.5);
        applyTransition("scale(0.88) rotateX("+currentRotation+"deg) translateZ(0px)");
    },1000); 
}
function applyTransition(transition){
    cubeDiv.style.webkitTransform = transition;
    cubeDiv.style.transform = transition;
}
function setSpinSpeed(seconds){
    cubeDiv.style.webkitTransition = seconds+"s";
    cubeDiv.style.transition = seconds+"s";
}


window.addEventListener("load", initEB);
