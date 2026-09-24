gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const shell = document.querySelector('.terminal-shell');
const title = document.getElementById('sceneTitle');
const status = document.getElementById('statusPill');
const statusText = status.querySelector('span');
const statusDot = status.querySelector('i');
const promptTarget = "Berth 1 is available after Vessel C finishes. Reassign Vessel B there, and keep all other vessel assignments and reclaiming schedules unchanged.";
let typingTimer = null;
let combinedRecoveryTimeline = null;

const captionIndex = document.getElementById('captionIndex');
const captionEyebrow = document.getElementById('captionEyebrow');
const captionTitle = document.getElementById('captionTitle');
const captionBody = document.getElementById('captionBody');
const captionNote = document.getElementById('captionNote');
const sceneProgress = document.getElementById('sceneProgress');
let activeScene = 0;

const sceneCopy = Array.from(document.querySelectorAll('.step')).map((step, i) => {
  const source = step.querySelector('.step__copy--source');
  return {
    index: String(i + 1).padStart(2, '0'),
    eyebrow: source.querySelector('.eyebrow')?.textContent.replace(/^\d+\s+—\s+/, '') || '',
    title: source.querySelector('h2')?.textContent || '',
    body: source.querySelector('p')?.textContent || '',
    note: source.querySelector('small')?.textContent || ''
  };
});

function setSceneCaption(i){
  const copy = sceneCopy[i];
  if(!copy) return;
  captionIndex.textContent = copy.index;
  captionEyebrow.textContent = copy.eyebrow;
  captionTitle.textContent = copy.title;
  captionBody.textContent = copy.body;
  captionNote.textContent = copy.note;
  sceneProgress.textContent = `${i + 1} / ${sceneCopy.length}`;
  gsap.fromTo('#sceneCaption',{y:10,opacity:.72},{y:0,opacity:1,duration:.28,ease:'power2.out'});
  gsap.fromTo('.scene-scroll-cue__handle',{scaleY:.72,transformOrigin:'50% 0%'},{scaleY:1,duration:.34,ease:'power2.out'});
}

function killSceneTweens(){
  if(combinedRecoveryTimeline){
    combinedRecoveryTimeline.kill();
    combinedRecoveryTimeline = null;
  }
  gsap.killTweensOf([
    '.vessel-b','.delay-ghost','.delayed-start-marker','.conflict-window','.dependency-row','.dependency-node',
    '.timeline-head','.berth-grid',
    '.decision-layer','.decision-center','.decision-option',
    '.engine-layer','.input-stack span','.output-stack span','.engine-core',
    '.chat-layer','.chat-card','.role-strip div','#chatResponse',
    '.confirm-layer','.confirm-card','.confirm-list div','.confirm-button',
    '.options-layer','.result-card','.result-grid div',
    '.approval-layer','.approval-card','.approval-icon'
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
  gsap.set('.delayed-start-marker',{opacity:0});
  gsap.set('.conflict-window',{opacity:0});
  gsap.set('.dependency-row',{autoAlpha:1});
  gsap.set('.dependency-node',{opacity:1,scale:1});
  gsap.set('.vessel-b',{xPercent:0,background:'#f0ecff',color:'#5d41cc'});
  gsap.set('.decision-option',{y:0,opacity:1});
  gsap.set('.result-card',{y:30,opacity:0,scale:1});
  gsap.set('.confirm-list div',{x:0,opacity:1});
  gsap.set('.confirm-button',{y:0,opacity:1,boxShadow:'none'});
  gsap.set('#chatResponse',{opacity:0});
}
function showSchedule(){
  gsap.set(['.timeline-head','.berth-grid','.dependency-row'],{autoAlpha:1});
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
  title.textContent='Operational data update: Vessel B +4h';
  statusText.textContent='Auto-updated';
  statusDot.style.background='#ff9f0a';
  statusDot.style.boxShadow='0 0 0 5px rgba(255,159,10,.12)';

  gsap.set('.decision-layer',{autoAlpha:0});
  gsap.set('.decision-center',{scale:.9,opacity:0});
  gsap.set('.decision-option',{y:30,opacity:0});

  combinedRecoveryTimeline = gsap.timeline();
  combinedRecoveryTimeline
    .to('.delay-ghost',{opacity:1,duration:.25},0)
    .to('.delayed-start-marker',{opacity:1,duration:.25},0.2)
    .to('.conflict-window',{opacity:1,duration:.3},0.35)
    .fromTo('.dependency-node',{opacity:.45,scale:.98},{opacity:1,scale:1,stagger:.06,duration:.3},0.18)
    .to('.vessel-b',{xPercent:100,background:'#fff1df',color:'#9a4f00',duration:.8,ease:'power3.inOut'},0)
    .add(()=>{ title.textContent='Updated state → Berth 2 conflict'; statusText.textContent='Conflict'; },0.78)
    .to(['.timeline-head','.berth-grid','.dependency-row'],{autoAlpha:0,duration:.3,ease:'power2.out'},1.25)
    .to('.decision-layer',{autoAlpha:1,duration:.25},1.34)
    .fromTo('.decision-center',{scale:.9,opacity:0},{scale:1,opacity:1,duration:.35},1.38)
    .fromTo('.decision-option',{y:26,opacity:0},{y:0,opacity:1,stagger:.1,duration:.4,ease:'power3.out'},1.45)
    .add(()=>{ title.textContent='Conflict detected → evaluate recovery directions'; statusText.textContent='3 options'; },1.36);
}
function impactScene(){
  resetTransientState();
  showSchedule();
  gsap.set('.vessel-b',{xPercent:100,background:'#fff1df',color:'#9a4f00'});
  gsap.set('.delay-ghost',{opacity:1});
  gsap.set('.delayed-start-marker',{opacity:1});
  gsap.set('.conflict-window',{opacity:1});
  gsap.to(shell,{backgroundColor:'rgba(255,248,240,.95)',duration:.25});
  title.textContent='Berth 2 conflict from 15:00';
  statusText.textContent='Reschedule';
  statusDot.style.background='#ff9f0a';
  statusDot.style.boxShadow='0 0 0 5px rgba(255,159,10,.12)';
}
function prepareFocusScene(){
  resetTransientState();
  gsap.set(['.delay-ghost','.delayed-start-marker','.conflict-window'],{opacity:0});
  gsap.to(['.timeline-head','.berth-grid','.dependency-row'],{autoAlpha:0,duration:.22,ease:'power2.out'});
}

function decisionScene(){
  hideLayers();
  prepareFocusScene();
  gsap.set('.vessel-b',{xPercent:100});
  gsap.to('.decision-layer',{autoAlpha:1,duration:.25});
  gsap.fromTo('.decision-center',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.4});
  gsap.fromTo('.decision-option',{y:30,opacity:0},{y:0,opacity:1,stagger:.12,duration:.5,ease:'power3.out'});
  title.textContent='Conflict detected → evaluate recovery directions';statusText.textContent='Options';
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
  title.textContent='Scheduler expertise → validated model input';statusText.textContent='LLM bridge';
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
  gsap.fromTo('.result-card',{y:30,opacity:0,scale:.985},{y:0,opacity:1,scale:1,duration:.55,ease:'power3.out'});
  gsap.fromTo('.result-grid div',{y:10,opacity:0},{y:0,opacity:1,stagger:.08,delay:.18,duration:.35,ease:'power2.out'});
  title.textContent='Scheduling engine recomputes and compares recovery plans';statusText.textContent='Recomputed';
}
function approvalScene(){
  hideLayers();
  prepareFocusScene();
  gsap.to('.approval-layer',{autoAlpha:1,duration:.2});
  gsap.fromTo('.approval-card',{scale:.9,opacity:0},{scale:1,opacity:1,duration:.6,ease:'back.out(1.5)'});
  gsap.fromTo('.approval-icon',{scale:.4,rotation:-18},{scale:1,rotation:0,duration:.5,delay:.25,ease:'back.out(2)'});
  title.textContent='Recovered plan ready for scheduler review';statusText.textContent='Human decision';
  statusDot.style.background='#34c759';
  statusDot.style.boxShadow='0 0 0 5px rgba(52,199,89,.12)';
}
const scenes=[baseScene,disruptionScene,chatScene,optionsScene,approvalScene];

function activateScene(i){
  activeScene = Math.max(0, Math.min(i, scenes.length - 1));
  setSceneCaption(activeScene);
  scenes[activeScene]();
}

function setShellPull(progress, direction=1){
  const p = Math.max(0, Math.min(progress, 1));
  gsap.set(shell,{
    opacity:1 - (0.48 * p),
    scale:1 - (0.022 * p),
    y:(direction > 0 ? -16 : 16) * p,
    filter:`blur(${1.4 * p}px) saturate(${1 - 0.12 * p})`,
    boxShadow:`0 ${20 + 12*p}px ${60 + 18*p}px rgba(0,0,0,${0.08 + 0.04*p})`
  });
}

function restoreShell(){
  gsap.to(shell,{
    opacity:1,scale:1,y:0,filter:'blur(0px) saturate(1)',
    boxShadow:'0 20px 60px rgba(0,0,0,.08)',
    duration:.28,ease:'power2.out',overwrite:true
  });
}

if(!reduced){
  gsap.from('.hero__content',{y:36,opacity:0,duration:1.1,ease:'power3.out'});
  gsap.to('.orb-a',{yPercent:-18,xPercent:-8,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.orb-b',{yPercent:20,xPercent:8,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.port-vessel-bg',{xPercent:360,yPercent:-30,rotation:2,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.to('.yard-grid',{yPercent:-10,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});

  const steps = Array.from(document.querySelectorAll('.step'));
  steps.forEach((step,i)=>{
    ScrollTrigger.create({
      trigger:step,
      start:'top 56%',
      end:'bottom 44%',
      onEnter:()=>{ if(!manualNavigation) activateScene(i); },
      onEnterBack:()=>{ if(!manualNavigation) activateScene(i); },
      onLeaveBack:()=>{ if(!manualNavigation) activateScene(Math.max(0,i-1)); }
    });
  });

  const story = document.querySelector('.story');
  let gestureLock = false;
  let manualNavigation = false;
  let touchStartY = null;

  function storyIsActive(){
    const rect = story.getBoundingClientRect();
    return rect.top <= 60 && rect.bottom >= window.innerHeight * .65;
  }

  function isStoryBoundaryExit(direction){
    return (direction > 0 && activeScene === steps.length - 1) ||
           (direction < 0 && activeScene === 0);
  }

  function goToScene(index, direction=1){
    const next = Math.max(0, Math.min(index, steps.length - 1));
    if(next === activeScene || !steps[next]){
      restoreShell();
      return;
    }

    gestureLock = true;
    manualNavigation = true;
    gsap.killTweensOf(shell);

    gsap.to(shell,{
      opacity:.18,
      scale:.972,
      y:direction > 0 ? -14 : 14,
      filter:'blur(2px) saturate(.84)',
      boxShadow:'0 36px 84px rgba(0,0,0,.13)',
      duration:.15,
      ease:'power2.in',
      overwrite:true,
      onComplete:()=>{
        const targetY = window.scrollY + steps[next].getBoundingClientRect().top;

        // Reposition the invisible trigger section immediately. The shell stays
        // faded while this happens, so Safari never shows an intermediate page.
        window.scrollTo({top:targetY,behavior:'auto'});
        ScrollTrigger.update();
        activateScene(next);

        gsap.set(shell,{
          opacity:.18,
          scale:.974,
          y:direction > 0 ? 18 : -18,
          filter:'blur(2px) saturate(.84)'
        });

        gsap.to(shell,{
          opacity:1,
          scale:1,
          y:0,
          filter:'blur(0px) saturate(1)',
          boxShadow:'0 20px 60px rgba(0,0,0,.08)',
          duration:.34,
          ease:'power3.out',
          overwrite:true,
          onComplete:()=>{
            manualNavigation=false;
            gestureLock=false;
          }
        });
      }
    });
  }

  window.addEventListener('wheel',(event)=>{
    if(!storyIsActive() || gestureLock || Math.abs(event.deltaY) < 14) return;
    const direction = event.deltaY > 0 ? 1 : -1;

    // At the first/last story scene, release the gesture back to the browser
    // so the user can continue naturally to the hero or the sections below.
    if(isStoryBoundaryExit(direction)){
      restoreShell();
      return;
    }

    event.preventDefault();
    setShellPull(.72,direction);
    goToScene(activeScene + direction,direction);
  },{passive:false});

  story.addEventListener('touchstart',(event)=>{
    if(!storyIsActive() || gestureLock) return;
    touchStartY = event.changedTouches[0]?.clientY ?? null;
    gsap.killTweensOf(shell);
  },{passive:true});

  story.addEventListener('touchmove',(event)=>{
    if(!storyIsActive() || gestureLock || touchStartY === null) return;
    const y = event.changedTouches[0]?.clientY ?? touchStartY;
    const delta = touchStartY - y;
    const direction = delta >= 0 ? 1 : -1;

    // Do not trap the user's swipe at the beginning or end of the 5-scene story.
    // Allow Safari to take over and continue down to the PoC/industry sections.
    if(isStoryBoundaryExit(direction)){
      restoreShell();
      return;
    }

    event.preventDefault();
    const progress = Math.min(Math.abs(delta) / 120, 1);
    setShellPull(progress,direction);
  },{passive:false});

  story.addEventListener('touchend',(event)=>{
    if(!storyIsActive() || gestureLock || touchStartY === null) return;
    const endY = event.changedTouches[0]?.clientY ?? touchStartY;
    const delta = touchStartY - endY;
    touchStartY = null;

    if(Math.abs(delta) < 38){
      restoreShell();
      return;
    }

    const direction = delta > 0 ? 1 : -1;

    if(isStoryBoundaryExit(direction)){
      restoreShell();
      return;
    }

    goToScene(activeScene + direction,direction);
  },{passive:true});

  story.addEventListener('touchcancel',()=>{
    touchStartY = null;
    restoreShell();
  },{passive:true});

  gsap.from('.poc-flow div',{y:24,opacity:0,stagger:.09,duration:.45,scrollTrigger:{trigger:'.poc-flow',start:'top 75%'}});
  gsap.from('.question-grid div',{y:28,opacity:0,stagger:.1,duration:.55,scrollTrigger:{trigger:'.question-grid',start:'top 78%'}});
  gsap.from('.about-grid article',{y:28,opacity:0,stagger:.1,duration:.55,scrollTrigger:{trigger:'.about-grid',start:'top 78%'}});
  gsap.from('.about-cta',{y:20,opacity:0,duration:.55,scrollTrigger:{trigger:'.about-cta',start:'top 84%'}});
}
setSceneCaption(0);
baseScene();
