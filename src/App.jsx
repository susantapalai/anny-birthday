import {useEffect,useMemo,useRef,useState} from "react";
import {AnimatePresence,motion,useReducedMotion} from "framer-motion";
import gsap from "gsap";
import C from "./config";

const rnd=(a,b)=>a+Math.random()*(b-a);

function Sky(){
  const s=useMemo(()=>Array.from({length:70},()=>({x:rnd(0,100),y:rnd(0,100),r:rnd(1,3),d:rnd(2,6)})),[]);
  return <div aria-hidden className="fixed inset-0 z-0 bg-gradient-to-b from-navy via-[#1a1442] to-[#2a1b4d]">
    {s.map((p,i)=><span key={i} className="twinkle absolute rounded-full bg-white" style={{left:p.x+"%",top:p.y+"%",width:p.r,height:p.r,animationDuration:p.d+"s"}}/>)}</div>;
}
function Petals({n=24,emoji=["🌸","✨","🦋","🌷","⭐"]}){
  const rm=useReducedMotion();
  const p=useMemo(()=>Array.from({length:n},(_,i)=>({x:rnd(0,100),d:rnd(7,13),l:rnd(0,8),e:emoji[i%emoji.length]})),[n]);
  if(rm) return null;
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
    {p.map((q,i)=><motion.span key={i} className="absolute text-xl" style={{left:q.x+"%"}} initial={{y:"-10vh",opacity:0}}
      animate={{y:"110vh",x:[0,30,-30,0],rotate:360,opacity:[0,1,1,0]}} transition={{duration:q.d,delay:q.l,repeat:Infinity,ease:"linear"}}>{q.e}</motion.span>)}</div>;
}
const Page=({children})=><motion.section initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.8}}
  className="relative z-10 mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">{children}</motion.section>;
const Btn=({children,...p})=><motion.button whileHover={{scale:1.05}} whileTap={{scale:.97}}
  className="mt-6 rounded-full border border-gold/60 bg-white/10 px-6 py-3 text-lg text-gold shadow-[0_0_25px_#e8c47c33] backdrop-blur" {...p}>{children}</motion.button>;
const H=({children})=><h2 className="font-script text-4xl text-gold sm:text-5xl">{children}</h2>;
const Glass=({children,className=""})=><div className={"rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md "+className}>{children}</div>;

/* 1 — Envelope */
function Intro({next}){
  const [i,setI]=useState(0),[open,setOpen]=useState(false),rm=useReducedMotion(),L=C.intro;
  useEffect(()=>{if(i>=L.length)return;const t=setTimeout(()=>setI(i+1),rm?150:2300);return()=>clearTimeout(t)},[i]);
  return <Page>
    <h1 className="font-script text-3xl text-gold sm:text-4xl">{C.title}</h1>
    <p className="mt-2 text-sm italic text-lavender">{C.subtitle}</p>
    <motion.div animate={open?{scale:1.3,opacity:0}:{y:[0,-8,0]}} transition={open?{duration:1.4,delay:.6}:{repeat:Infinity,duration:4}}
      className="relative my-8 h-32 w-48 rounded-md bg-gradient-to-br from-rose to-lavender shadow-[0_0_60px_#e8c47c77]">
      <motion.div style={{transformOrigin:"top"}} animate={{rotateX:open?180:0}} transition={{duration:.8}}
        className="absolute inset-x-0 top-0 h-16 bg-lavender [clip-path:polygon(0_0,100%_0,50%_100%)]"/>
      <span className="absolute inset-0 grid place-items-center text-3xl">❤️</span></motion.div>
    <div aria-live="polite" className="min-h-40 space-y-3 text-xl">
      {L.slice(0,i).map((l,k)=><motion.p key={k} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.2}}>{l}</motion.p>)}</div>
    {i>=L.length&&!open&&<Btn onClick={()=>{setOpen(true);setTimeout(next,2000)}}>{C.introButton}</Btn>}
  </Page>;
}

/* 2 — Seven stars */
const POS=[[12,70],[26,32],[40,64],[52,24],[64,58],[78,30],[88,66]];
function Stars({next}){
  const [o,setO]=useState(null),[seen,setSeen]=useState(new Set());
  useEffect(()=>{const k=e=>e.key==="Escape"&&setO(null);addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[]);
  return <Page>
    <H>Seven Years in Seven Stars</H><p className="mt-2 text-lavender">Tap each star ({seen.size}/7)</p>
    <div className="relative my-6 h-[55svh] w-full">
      {POS.map(([x,y],i)=><div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{left:x+"%",top:y+"%"}}>
        <motion.button aria-label={`Year ${i+1}: ${C.years[i].t}`} onClick={()=>{setO(i);setSeen(new Set(seen).add(i))}}
          className="text-4xl text-gold drop-shadow-[0_0_12px_#e8c47c]" animate={{scale:[1,1.25,1]}} transition={{repeat:Infinity,duration:2+i*.3}}>
          {seen.has(i)?"✦":"★"}<span className="block text-xs">Year {i+1}</span></motion.button></div>)}</div>
    <AnimatePresence>{o!=null&&<motion.div key="m" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setO(null)}
      className="fixed inset-0 z-30 grid place-items-center bg-navy/70 p-5">
      <motion.div role="dialog" aria-modal="true" initial={{scale:.8}} animate={{scale:1}} onClick={e=>e.stopPropagation()}>
        <Glass className="max-w-sm"><p className="text-sm text-lavender">Year {o+1}</p><h3 className="font-script text-3xl text-gold">{C.years[o].t}</h3>
          <p className="mt-3 text-xl">{C.years[o].s}</p>{C.years[o].memory&&<p className="mt-3 italic text-rose">{C.years[o].memory}</p>}
          <Btn onClick={()=>setO(null)} autoFocus>Close</Btn></Glass></motion.div></motion.div>}</AnimatePresence>
    {seen.size===7&&<Btn onClick={next}>Continue ✨</Btn>}
  </Page>;
}

/* 3 — Letter, one line per scroll */
function Letter({next}){
  return <Page><H>The Things I Never Said Properly</H><p className="mt-2 text-lavender">Scroll slowly</p>
    <Glass className="mt-6 h-[60svh] w-full max-w-xl overflow-y-auto !p-8 text-left">
      {C.letter.map((l,i)=><motion.p key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.8}}
        transition={{duration:.9}} className="my-[16vh] font-script text-3xl leading-snug first:mt-[4vh]">{l}</motion.p>)}
      <div className="pb-[8vh] text-center"><Btn onClick={next}>Continue</Btn></div></Glass></Page>;
}

/* 4 — Hearts + gallery */
function Hearts({next}){
  const [o,setO]=useState(null);
  return <Page><H>The Little Things</H><p className="mt-2 text-lavender">Tap a heart</p>
    <div className="relative my-4 h-[42svh] w-full">
      {C.hearts.map((h,i)=><motion.button key={i} aria-label={h.label} onClick={()=>setO(i)} className="absolute text-4xl"
        style={{left:10+(i*37)%75+"%",top:6+(i*53)%75+"%"}} animate={{y:[0,-12,0],scale:o===i?1.4:1}} transition={{repeat:Infinity,duration:3+i*.4}}>
        {o===i?"💖":"🤍"}</motion.button>)}</div>
    <div aria-live="polite" className="min-h-28 w-full max-w-md">{o!=null&&<motion.div key={o} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
      <Glass><h3 className="font-script text-3xl text-gold">{C.hearts[o].label}</h3><p className="mt-1 text-lg">{C.hearts[o].text}</p></Glass></motion.div>}</div>
    <div className="mt-6 grid w-full grid-cols-3 gap-3">{C.photos.map((p,i)=><figure key={i}>
      {p.src?<img src={p.src} alt={p.caption} loading="lazy" className="aspect-square w-full rounded-xl object-cover"/>
        :<div className="grid aspect-square place-items-center rounded-xl bg-white/10 text-2xl">📷</div>}
      <figcaption className="mt-1 text-xs text-lavender">{p.caption}</figcaption></figure>)}</div>
    <Btn onClick={next}>Continue</Btn></Page>;
}

/* 5 — Cake + gift */
function Birthday({next}){
  const [out,setOut]=useState([]),[gift,setGift]=useState(false),done=out.length===3;
  return <Page>{done&&<Petals n={36}/>}
    {!done?<><H>Make a wish</H><p className="mt-2 text-lavender">Tap the candles to blow them out</p></>
    :<motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}><H>Happy Birthday, {C.name} 🎂</H><p className="mx-auto mt-3 max-w-md text-xl">{C.birthdayLine}</p></motion.div>}
    <div className="mt-10 flex flex-col items-center">
      <div className="flex gap-6">{[0,1,2].map(i=><button key={i} aria-label={out.includes(i)?"Candle out":"Blow out candle"} className="flex flex-col items-center p-2"
        onClick={()=>!out.includes(i)&&setOut([...out,i])}>
        <motion.span animate={out.includes(i)?{opacity:0,scale:0}:{scale:[1,1.25,1]}} transition={{repeat:out.includes(i)?0:Infinity,duration:1.2}}
          className="h-5 w-3 rounded-full bg-gradient-to-t from-gold to-white shadow-[0_0_18px_#e8c47c]"/><span className="h-10 w-2 bg-lavender"/></button>)}</div>
      <div className="h-14 w-52 rounded-t-xl bg-rose"/><div className="h-16 w-64 rounded-b-xl bg-lavender/80"/></div>
    {done&&<div className="mt-8"><motion.button aria-label="Open your gift" onClick={()=>setGift(true)} className="text-6xl" animate={gift?{}:{rotate:[0,-8,8,0]}} transition={{repeat:Infinity,duration:2}}>{gift?"🎊":"🎁"}</motion.button>
      {gift&&<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}><Glass className="mt-3 max-w-sm"><p className="font-script text-3xl text-gold">Dear {C.name},</p><p className="mt-2 text-xl">{C.card}</p></Glass><Btn onClick={next}>Continue</Btn></motion.div>}
      {!gift&&<p className="mt-2 text-sm text-lavender">A gift appeared… open it</p>}</div>}
  </Page>;
}

/* 6 — Postcard */
function Future({next}){
  return <Page><H>A Letter to Your Future Self</H>
    <Glass className="mt-6 w-full max-w-lg !p-7 text-left"><p className="font-script text-3xl text-gold">Dear {C.name} of the future,</p>
      <ul className="mt-4 space-y-3">{C.future.map((f,i)=><motion.li key={i} initial={{opacity:0,x:-15}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}>
        <b className="text-rose">{f.h}.</b> {f.t}</motion.li>)}</ul>
      <p className="mt-5 border-t border-white/20 pt-4 font-script text-3xl">{C.futureQuote}</p></Glass>
    <Btn onClick={next}>Continue</Btn></Page>;
}

/* 7 — Stars become words (GSAP) */
function StarText({text}){
  const ref=useRef(),rm=useReducedMotion();
  useEffect(()=>{
    const c=ref.current,w=c.width=c.clientWidth,h=c.height=240,ctx=c.getContext("2d");
    const o=document.createElement("canvas");o.width=w;o.height=h;const x=o.getContext("2d");
    const fs=Math.min(w/9,70);x.fillStyle="#fff";x.font=`700 ${fs}px Georgia,serif`;x.textAlign="center";x.textBaseline="middle";
    x.fillText(text[0],w/2,h/2-fs*.65);x.fillText(text[1],w/2,h/2+fs*.65);
    const d=x.getImageData(0,0,w,h).data,P=[],st=w<500?4:3;
    for(let y=0;y<h;y+=st)for(let xx=0;xx<w;xx+=st)if(d[(y*w+xx)*4+3]>128)P.push({x:rnd(0,w),y:rnd(0,h),tx:xx,ty:y,a:0});
    P.forEach(p=>gsap.to(p,{x:p.tx,y:p.ty,a:1,duration:rm?0:rnd(2,4),delay:rm?0:rnd(0,1.5),ease:"power2.out"}));
    const draw=()=>{ctx.clearRect(0,0,w,h);ctx.fillStyle="#e8c47c";ctx.shadowColor="#e8c47c";ctx.shadowBlur=6;
      P.forEach(p=>{ctx.globalAlpha=p.a;ctx.beginPath();ctx.arc(p.x,p.y,1.4,0,7);ctx.fill()})};
    gsap.ticker.add(draw);return()=>{gsap.ticker.remove(draw);gsap.killTweensOf(P)};
  },[]);
  return <canvas ref={ref} role="img" aria-label={text.join(" ")} className="h-[240px] w-full"/>;
}
function Finale({replay}){
  const [i,setI]=useState(0),[s,setS]=useState(false),[egg,setEgg]=useState(false),[copied,setCopied]=useState(false),L=C.finale;
  useEffect(()=>{if(i>L.length)return;const t=setTimeout(()=>setI(i+1),i===0?4500:2300);return()=>clearTimeout(t)},[i]);
  return <Page>
    <button aria-label="A tiny secret" onClick={()=>setEgg(!egg)} className="fixed right-4 top-14 z-20 text-xl opacity-40">🌙</button>
    {egg&&<Glass className="fixed inset-x-4 top-24 z-30 mx-auto max-w-sm !p-4 text-lg" ><p>{C.easterEgg}</p></Glass>}
    <StarText text={["HAPPY BIRTHDAY,",`${C.name.toUpperCase()} ❤`]}/>
    <div aria-live="polite" className="mt-4 min-h-48 space-y-2 text-xl">{L.slice(0,i).map((l,k)=><motion.p key={k} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.2}}>{l}</motion.p>)}</div>
    {i>=L.length&&<Btn onClick={()=>setS(true)}>{C.finalButton}</Btn>}
    <AnimatePresence>{s&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-navy/85 p-6">
      <Petals n={44}/><div className="relative z-50 max-w-md"><p className="font-script text-5xl text-gold">Happy Birthday, {C.name} 🎂</p>
        <p className="mt-5 text-2xl">{C.finalMessage}</p>
        <div className="flex flex-wrap justify-center gap-3"><Btn onClick={replay}>↺ Replay</Btn>
          <Btn onClick={()=>navigator.clipboard?.writeText(location.href).then(()=>setCopied(true))}>{copied?"Link copied ✓":"Copy link"}</Btn>
          <Btn onClick={()=>setS(false)}>Close</Btn></div></div></motion.div>}</AnimatePresence>
  </Page>;
}

const CH=[Intro,Stars,Letter,Hearts,Birthday,Future,Finale];
export default function App(){
  const [s,setS]=useState(0),[play,setPlay]=useState(false),[ok,setOk]=useState(!!C.music),a=useRef();
  useEffect(()=>{scrollTo(0,0)},[s]);
  const toggle=()=>{const el=a.current;if(play){el.pause();setPlay(false)}else el.play().then(()=>setPlay(true)).catch(()=>setOk(false))};
  const Ch=CH[s];
  return <main><Sky/>
    {ok&&<><audio ref={a} src={C.music} loop preload="none" onError={()=>setOk(false)}/>
      <button onClick={toggle} aria-pressed={play} aria-label={play?"Pause music":"Play music"} className="fixed right-4 top-4 z-50 rounded-full border border-gold/50 bg-white/10 px-3 py-2 text-gold backdrop-blur">{play?"❚❚ Music":"♪ Music"}</button></>}
    <AnimatePresence mode="wait"><Ch key={s} next={()=>setS(x=>x+1)} replay={()=>setS(0)}/></AnimatePresence></main>;
}
