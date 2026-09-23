gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const shell = document.querySelector('.terminal-shell');
const title = document.getElementById('sceneTitle');
const status = document.getElementById('statusPill');
const statusText = status.querySelector('span');
const statusDot = status.querySelector('i');
const promptTarget = 'What if Berth 2 is unavailable for the next six hours?';
let typedOnce = false;

function hideLayers(){
  gsap.set(['.impact-layer','.decision-layer','.engine-layer','.chat-layer','.options-layer','.approval-layer'],{autoAlpha:0});
}
function baseScene(){
  hideLayers();
  gsap.set('.vessel-b',{xPercent:0,background:'#f0ecff',color:'#5d41cc'});
  gsap.set('.delay-ghost',{opacity:0});
  gsap.set('.resource span',{background:'#34c759'});
  title.textContent='Original operating plan';statusText.textContent='Feasible';
  statusDot.style.background='#34c759';statusDot.style.boxShadow='0 0 0 5px rgba(52,199,89,.12)';
  gsap.to(shell,{backgroundColor:'rgba(250,250,252,.92)',duration:.4});
}
function disruptionScene(){
  hideLayers();
  title.textContent='Vessel B delayed +4h';statusText.textContent='Disrupted';
  statusDot.style.background='#ff9f0a';statusDot.style.boxShadow='0 0 0 5px rgba(255,159,10,.12)';
  gsap.to('.delay-ghost',{opacity:1,duration:.3});
  gsap.to('.vessel-b',{xPercent:68,background:'#fff1df',color:'#9a4f00',duration:.9,ease:'power3.inOut'});
}
function impactScene(){
  disruptionScene();
  gsap.to('.impact-layer',{autoAlpha:1,duration:.25});
  gsap.fromTo('.impact-chip',{scale:.75,y:12,opacity:0},{scale:1,y:0,opacity:1,stagger:.12,duration:.45,ease:'back.out(1.6)'});
  gsap.to('.resource span',{background:'#ff9f0a',stagger:.1,duration:.25});
  gsap.to(shell,{backgroundColor:'rgba(255,248,240,.95)',duration:.4});
  title.textContent='Knock-on effects emerge';
}
function prepareFocusScene(){
  gsap.set('.delay-ghost',{opacity:0});
}

function decisionScene(){
  hideLayers();
  prepareFocusScene();
  gsap.set('.vessel-b',{xPercent:68});
  gsap.to('.decision-layer',{autoAlpha:1,duration:.25});
  gsap.fromTo('.decision-center',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.4});
  gsap.fromTo('.decision-option',{y:30,opacity:0},{y:0,opacity:1,stagger:.12,duration:.5,ease:'power3.out'});
  title.textContent='Recovery decision space';statusText.textContent='Evaluate';
}
function engineScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.engine-layer',{autoAlpha:1,duration:.25});
  gsap.fromTo('.input-stack span',{x:-20,opacity:0},{x:0,opacity:1,stagger:.08,duration:.4});
  gsap.fromTo('.output-stack span',{x:20,opacity:0},{x:0,opacity:1,stagger:.1,delay:.45,duration:.4});
  gsap.fromTo('.engine-core',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.6,ease:'back.out(1.3)'});
  gsap.to('.engine-ring',{rotation:360,duration:8,ease:'none',repeat:-1});
  title.textContent='PortOptimiser recovery engine';statusText.textContent='Optimising';
}
function typePrompt(){
  if(typedOnce) return; typedOnce=true;
  const target=document.getElementById('typedPrompt'); target.textContent='';
  let i=0; const tick=()=>{target.textContent=promptTarget.slice(0,i++); if(i<=promptTarget.length){setTimeout(tick,23);}else{gsap.to('#chatResponse',{opacity:1,duration:.5,delay:.25});}}; tick();
}
function chatScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.chat-layer',{autoAlpha:1,duration:.25});
  gsap.fromTo('.chat-card',{y:28,scale:.97,opacity:0},{y:0,scale:1,opacity:1,duration:.55,ease:'power3.out',onComplete:typePrompt});
  gsap.fromTo('.role-strip div',{y:15,opacity:0},{y:0,opacity:1,stagger:.08,delay:.35,duration:.35});
  title.textContent='Conversational scenario exploration';statusText.textContent='Human-led';
}
function optionsScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.options-layer',{autoAlpha:1,duration:.2});
  gsap.to('.option-card',{y:0,opacity:1,stagger:.12,duration:.55,ease:'power3.out'});
  gsap.fromTo('.ob',{scale:1},{scale:1.035,duration:.45,yoyo:true,repeat:1,delay:.6});
  title.textContent='Compare recovery trade-offs';statusText.textContent='3 options';
}
function approvalScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.approval-layer',{autoAlpha:1,duration:.2});
  gsap.fromTo('.approval-card',{scale:.9,opacity:0},{scale:1,opacity:1,duration:.6,ease:'back.out(1.5)'});
  gsap.fromTo('.approval-icon',{scale:.4,rotation:-18},{scale:1,rotation:0,duration:.5,delay:.25,ease:'back.out(2)'});
  title.textContent='Human approval';statusText.textContent='Scheduler decides';
  statusDot.style.background='#34c759';
}
const scenes=[baseScene,disruptionScene,impactScene,decisionScene,engineScene,chatScene,optionsScene,approvalScene];

if(!reduced){
  gsap.from('.hero__content',{y:36,opacity:0,duration:1.1,ease:'power3.out'});
  gsap.to('.orb-a',{yPercent:-18,xPercent:-8,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.orb-b',{yPercent:20,xPercent:8,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

  document.querySelectorAll('.step').forEach((step,i)=>{
    ScrollTrigger.create({trigger:step,start:'top 52%',end:'bottom 48%',onEnter:()=>scenes[i](),onEnterBack:()=>scenes[i]()});
  });

  gsap.from('.before-after .mini-card',{y:40,opacity:0,stagger:.18,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'.before-after',start:'top 75%'}});
  gsap.from('.poc-flow div',{y:24,opacity:0,stagger:.09,duration:.45,scrollTrigger:{trigger:'.poc-flow',start:'top 75%'}});
  gsap.from('.question-grid div',{y:28,opacity:0,stagger:.1,duration:.55,scrollTrigger:{trigger:'.question-grid',start:'top 78%'}});
}
baseScene();
