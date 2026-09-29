const loader = document.getElementById("pageLoader");
window.addEventListener("load",()=>setTimeout(()=>loader.classList.add("done"),700));

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let W,H,DPR,stars=[];
function resizeStars(){
  DPR=Math.min(window.devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
  canvas.width=W*DPR; canvas.height=H*DPR;
  canvas.style.width=W+"px"; canvas.style.height=H+"px";
  const count=Math.min(210,Math.floor(W/5));
  stars=Array.from({length:count},()=>({x:Math.random()*W,y:Math.random()*H,r:.35+Math.random()*1.05,a:.15+Math.random()*.55,s:.04+Math.random()*.25,tw:Math.random()*Math.PI*2}));
}
resizeStars();addEventListener("resize",resizeStars);

function renderStars(t){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    s.y+=s.s;
    if(s.y>H+2)s.y=-2;
    const alpha=s.a*(.55+.45*Math.sin(t*.001+s.tw));
    ctx.globalAlpha=alpha;
    ctx.fillStyle="#fff";
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(renderStars);
}
requestAnimationFrame(renderStars);

const cursor=document.querySelector(".cursor"), core=document.querySelector(".cursor-core");
let tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty;
addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY});
function cursorLoop(){
  cx+=(tx-cx)*.15; cy+=(ty-cy)*.15;
  cursor.style.left=cx+"px";cursor.style.top=cy+"px";core.style.left=tx+"px";core.style.top=ty+"px";
  requestAnimationFrame(cursorLoop);
}
cursorLoop();

document.querySelectorAll(".magnet").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    if(innerWidth<700)return;
    const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.16}px,${y*.16}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="translate(0,0)");
});

document.querySelectorAll("[data-tilt]").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    if(innerWidth<800)return;
    const r=card.getBoundingClientRect();
    const x=e.clientX-r.left,y=e.clientY-r.top;
    const rx=((y/r.height)-.5)*-7, ry=((x/r.width)-.5)*7;
    card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)");
});

const heroVisual=document.getElementById("heroVisual"),portrait=document.getElementById("portraitShell");
heroVisual?.addEventListener("pointermove",e=>{
  if(innerWidth<900)return;
  const r=heroVisual.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  portrait.style.transform=`rotateY(${-9+x*18}deg) rotateX(${3-y*12}deg)`;
});
heroVisual?.addEventListener("pointerleave",()=>portrait.style.transform="rotateY(-9deg) rotateX(3deg)");

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.animate(
      [{opacity:0,transform:"translateY(34px)"},{opacity:1,transform:"translateY(0)"}],
      {duration:850,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"}
    );
    revealObserver.unobserve(entry.target);
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

const menuBtn=document.getElementById("menuBtn"),menu=document.getElementById("mobileMenu");
menuBtn?.addEventListener("click",()=>menu.classList.toggle("open"));
document.querySelectorAll(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("open")));

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});}
  });
});

let lastScroll=0;
window.addEventListener("scroll",()=>{
  const y=scrollY;
  document.querySelector(".nav").style.transform=y>lastScroll&&y>80?"translateY(-10px)":"translateY(0)";
  document.querySelector(".nav").style.transition="transform .35s ease";
  lastScroll=y;
});

/* Project redirect links */
document.querySelectorAll(".project-link[data-project]").forEach(link=>{
  const key=link.dataset.project;
  const url=window.PROJECT_LINKS?.[key];
  if(url && url !== "#") link.href=url;
});
