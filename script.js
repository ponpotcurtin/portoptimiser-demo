gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const shell = document.querySelector('.terminal-shell');
const title = document.getElementById('sceneTitle');
const status = document.getElementById('statusPill');
const statusText = status.querySelector('span');
const statusDot = status.querySelector('i');
const promptTarget = "I'm the scheduler. Reassign Vessel B to Berth 1 after Vessel C finishes. Keep all other vessel assignments and their reclaiming schedules unchanged.";
let typingTimer = null;

function killSceneTweens(){
  gsap.killTweensOf([
    '.vessel-b','.delay-ghost','.conflict-window',
    '.timeline-head','.berth-grid',
    '.decision-layer','.decision-center','.decision-option',
    '.engine-layer','.input-stack span','.output-stack span','.engine-core',
    '.chat-layer','.chat-card','.role-strip div','#chatResponse',
    '.confirm-layer','.confirm-card','.confirm-list div','.confirm-button',
    '.options-layer','.option-card','.approval-layer','.approval-card','.approval-icon'
  ]);
}
function hideLayers(){
  gsap.set(['.decision-layer','.engine-layer','.chat-layer','.confirm-layer','.options-layer','.approval-layer'],{autoAlpha:0});
}
function resetTransientState(){
  killSceneTweens();
  hideLayers();
  gsap.set(['.timeline-head','.berth-grid'],{autoAlpha:1});
  gsap.set('.delay-ghost',{opacity:0});
  gsap.set('.conflict-window',{opacity:0});
  gsap.set('.vessel-b',{xPercent:0,background:'#f0ecff',color:'#5d41cc'});
  gsap.set('.decision-option',{y:0,opacity:1});
  gsap.set('.option-card',{y:30,opacity:0,scale:1});
  gsap.set('.confirm-list div',{x:0,opacity:1});
  gsap.set('.confirm-button',{y:0,opacity:1,boxShadow:'none'});
  gsap.set('#chatResponse',{opacity:0});
}
function showSchedule(){
  gsap.set(['.timeline-head','.berth-grid'],{autoAlpha:1});
}
function baseScene(){
  resetTransientState();
  showSchedule();
  title.textContent='Example baseline plan';statusText.textContent='Baseline';
  statusDot.style.background='#34c759';statusDot.style.boxShadow='0 0 0 5px rgba(52,199,89,.12)';
  gsap.to(shell,{backgroundColor:'rgba(250,250,252,.92)',duration:.4});
}
function disruptionScene(){
  resetTransientState();
  showSchedule();
  title.textContent='Example disruption: Vessel B +4h';statusText.textContent='Conflict';
  statusDot.style.background='#ff9f0a';statusDot.style.boxShadow='0 0 0 5px rgba(255,159,10,.12)';
  gsap.to('.delay-ghost',{opacity:1,duration:.3});
  gsap.to('.conflict-window',{opacity:1,duration:.35,delay:.45});
  gsap.to('.vessel-b',{xPercent:100,background:'#fff1df',color:'#9a4f00',duration:.9,ease:'power3.inOut'});
}
function impactScene(){
  resetTransientState();
  showSchedule();
  gsap.set('.vessel-b',{xPercent:100,background:'#fff1df',color:'#9a4f00'});
  gsap.set('.delay-ghost',{opacity:1});
  gsap.set('.conflict-window',{opacity:1});
  gsap.to(shell,{backgroundColor:'rgba(255,248,240,.95)',duration:.25});
  title.textContent='Berth 2 conflict from 15:00';
  statusText.textContent='Reschedule';
  statusDot.style.background='#ff9f0a';
  statusDot.style.boxShadow='0 0 0 5px rgba(255,159,10,.12)';
}
function prepareFocusScene(){
  resetTransientState();
  gsap.set(['.delay-ghost','.conflict-window'],{opacity:0});
  gsap.to(['.timeline-head','.berth-grid'],{autoAlpha:0,duration:.22,ease:'power2.out'});
}

function decisionScene(){
  hideLayers();
  prepareFocusScene();
  gsap.set('.vessel-b',{xPercent:100});
  gsap.to('.decision-layer',{autoAlpha:1,duration:.25});
  gsap.fromTo('.decision-center',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.4});
  gsap.fromTo('.decision-option',{y:30,opacity:0},{y:0,opacity:1,stagger:.12,duration:.5,ease:'power3.out'});
  title.textContent='Candidate revised berth schedules';statusText.textContent='3 candidates';
}
function engineScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.engine-layer',{autoAlpha:1,duration:.25});
  gsap.fromTo('.input-stack span',{x:-20,opacity:0},{x:0,opacity:1,stagger:.08,duration:.4});
  gsap.fromTo('.output-stack span',{x:20,opacity:0},{x:0,opacity:1,stagger:.1,delay:.45,duration:.4});
  gsap.fromTo('.engine-core',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.6,ease:'back.out(1.3)'});
  gsap.to('.engine-ring',{rotation:360,duration:8,ease:'none',repeat:-1});
  title.textContent='Confirmed changes → recompute revised schedules';statusText.textContent='Rescheduling';
}
function typePrompt(){
  if(typingTimer) clearTimeout(typingTimer);
  const target=document.getElementById('typedPrompt');
  target.textContent='';
  gsap.set('#chatResponse',{opacity:0});
  let i=0;
  const tick=()=>{
    target.textContent=promptTarget.slice(0,i++);
    if(i<=promptTarget.length){
      typingTimer=setTimeout(tick,23);
    }else{
      gsap.to('#chatResponse',{opacity:1,duration:.4,delay:.18});
    }
  };
  tick();
}
function chatScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.chat-layer',{autoAlpha:1,duration:.25});
  gsap.fromTo('.chat-card',{y:28,scale:.97,opacity:0},{y:0,scale:1,opacity:1,duration:.55,ease:'power3.out',onComplete:typePrompt});
  gsap.fromTo('.role-strip div',{y:15,opacity:0},{y:0,opacity:1,stagger:.08,delay:.35,duration:.35});
  title.textContent='Add operational context to the rescheduling task';statusText.textContent='Refine';
}
function confirmationScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.confirm-layer',{autoAlpha:1,duration:.22});
  gsap.fromTo('.confirm-card',{y:24,scale:.975,opacity:0},{y:0,scale:1,opacity:1,duration:.5,ease:'power3.out'});
  gsap.fromTo('.confirm-list div',{x:-16,opacity:0},{x:0,opacity:1,stagger:.08,delay:.16,duration:.35,ease:'power2.out'});
  gsap.fromTo('.confirm-button',{y:10,opacity:0},{y:0,opacity:1,stagger:.08,delay:.42,duration:.3});
  gsap.fromTo('.confirm-button--primary',{boxShadow:'0 0 0 rgba(0,113,227,0)'},{boxShadow:'0 0 0 7px rgba(0,113,227,.10)',duration:.65,yoyo:true,repeat:1,delay:.72});
  title.textContent='Review interpreted changes before recomputation';
  statusText.textContent='Confirm';
  statusDot.style.background='#ff9f0a';
  statusDot.style.boxShadow='0 0 0 5px rgba(255,159,10,.12)';
}
function optionsScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.options-layer',{autoAlpha:1,duration:.2});
  gsap.to('.option-card',{y:0,opacity:1,stagger:.12,duration:.55,ease:'power3.out'});
  gsap.fromTo('.ob',{scale:1},{scale:1.035,duration:.45,yoyo:true,repeat:1,delay:.6});
  title.textContent='Compare candidate revised schedules';statusText.textContent='Compare';
}
function approvalScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.approval-layer',{autoAlpha:1,duration:.2});
  gsap.fromTo('.approval-card',{scale:.9,opacity:0},{scale:1,opacity:1,duration:.6,ease:'back.out(1.5)'});
  gsap.fromTo('.approval-icon',{scale:.4,rotation:-18},{scale:1,rotation:0,duration:.5,delay:.25,ease:'back.out(2)'});
  title.textContent='Scheduler selects the revised schedule';statusText.textContent='Human decision';
  statusDot.style.background='#34c759';
}
const scenes=[baseScene,disruptionScene,impactScene,decisionScene,chatScene,confirmationScene,engineScene,optionsScene,approvalScene];

if(!reduced){
  gsap.from('.hero__content',{y:36,opacity:0,duration:1.1,ease:'power3.out'});
  gsap.to('.orb-a',{yPercent:-18,xPercent:-8,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.orb-b',{yPercent:20,xPercent:8,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.port-vessel-bg',{xPercent:360,yPercent:-30,rotation:2,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.yard-grid',{yPercent:-10,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});

  document.querySelectorAll('.step').forEach((step,i)=>{
    ScrollTrigger.create({
      trigger:step,
      start:'top 52%',
      end:'bottom 48%',
      onEnter:()=>scenes[i](),
      onEnterBack:()=>scenes[i](),
      onLeaveBack:()=>scenes[Math.max(0,i-1)]()
    });
  });

  gsap.from('.poc-flow div',{y:24,opacity:0,stagger:.09,duration:.45,scrollTrigger:{trigger:'.poc-flow',start:'top 75%'}});
  gsap.from('.question-grid div',{y:28,opacity:0,stagger:.1,duration:.55,scrollTrigger:{trigger:'.question-grid',start:'top 78%'}});
}
baseScene();
