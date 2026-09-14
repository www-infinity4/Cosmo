(function(){
  "use strict";
  if(window.__infinityCosmoChannelLoader)return;
  window.__infinityCosmoChannelLoader=true;
  const ROOT="https://www-infinity4.github.io/Cosmo/";
  const AI="https://infinity-rogers.marvaseater.workers.dev/v1/reason";
  const add=(tag,attrs)=>{const node=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>node[k]=v);document.head.appendChild(node);return node};
  if(!document.querySelector('link[data-cosmo-shared]')){const link=add("link",{rel:"stylesheet",href:ROOT+"cosmo.css?v=20260914-channel1"});link.dataset.cosmoShared="1";}
  const style=document.createElement("style");
  style.textContent="#infinityCosmoButton{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(74px,calc(env(safe-area-inset-bottom) + 64px));z-index:10000;width:52px;height:58px;border:1px solid #9ef9df99;border-radius:48% 48% 42% 42%;background:linear-gradient(145deg,#b8ffe9,#298d80 72%);box-shadow:0 10px 30px #0008,0 0 16px #75ffd655;color:#071713;cursor:pointer}#infinityCosmoButton:before,#infinityCosmoButton:after{content:'';position:absolute;top:25px;width:10px;height:14px;border-radius:50%;background:#071426;box-shadow:0 0 7px #72ccff}#infinityCosmoButton:before{left:11px;transform:rotate(12deg)}#infinityCosmoButton:after{right:11px;transform:rotate(-12deg)}#infinityCosmoButton span{position:absolute;left:25px;top:-10px;width:2px;height:13px;background:#9ef9df}#infinityCosmoButton span:after{content:'';position:absolute;left:-3px;top:-3px;width:8px;height:8px;border-radius:50%;background:#ffe878;box-shadow:0 0 8px #ffe878}#infinityCosmoButton small{position:absolute;left:50%;bottom:5px;transform:translateX(-50%);font:900 9px/1 system-ui}.cosmo{z-index:10003;bottom:max(136px,calc(env(safe-area-inset-bottom) + 126px))}@media(max-width:540px){.cosmo{bottom:0;max-height:76dvh}#infinityCosmoButton{bottom:max(72px,calc(env(safe-area-inset-bottom) + 62px))}}";
  document.head.appendChild(style);
  function text(selector){return String(document.querySelector(selector)?.textContent||"").replace(/\s+/g," ").trim()}
  function mount(){
    if(!window.Cosmo||document.getElementById("infinityCosmoRoot"))return;
    const root=document.createElement("aside");root.id="infinityCosmoRoot";root.hidden=true;document.body.appendChild(root);
    const button=document.createElement("button");button.id="infinityCosmoButton";button.type="button";button.setAttribute("aria-label","Open Cosmo companion");button.innerHTML="<span></span><small>COSMO</small>";document.body.appendChild(button);
    const program=()=>{const title=text("[data-now-playing],#nowTitle,#programTitle,.now-title")||document.title.split(/[—|·]/)[0];const channel=document.body.dataset.channel||text(".brand")||document.title.split(/[—|·]/)[0];return{id:(channel+":"+title).toLowerCase().replace(/[^a-z0-9]+/g,"-"),title,channel}};
    const playback=()=>{let seconds=0,playing=false;try{const p=window.player||window.channelPlayer;if(p&&typeof p.getCurrentTime==="function"){seconds=p.getCurrentTime();playing=p.getPlayerState?.()===1}}catch(_){}return{seconds,playing}};
    const index=()=>({moments:[{id:"live-program",start:0,end:86400,transcript:text("#nowMeta,.meta,[data-program-description]"),setting:"Live "+program().channel+" channel",themes:[program().title,program().channel],entities:[],objects:[],connections:[]}]});
    const respond=async payload=>{const response=await fetch(AI,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are Cosmo, the Infinity TV viewing companion. Answer naturally and concisely using the supplied live channel context. Do not invent scene details."},{role:"user",content:JSON.stringify(payload)}],context:{site:location.href,program:payload.program,playback:payload.playback}})});if(!response.ok)throw new Error("AI unavailable");const data=await response.json();return{text:data.output_text||data.text||data.response||"I could not form a response."}};
    window.Cosmo.mount({root,user:{id:"channel-viewer"},program,playback,index,respond,proactiveEveryMs:180000});
    button.addEventListener("click",()=>{root.hidden=!root.hidden});
  }
  if(window.Cosmo)mount();else{const script=add("script",{src:ROOT+"cosmo.js?v=20260914-channel1"});script.onload=mount;}
})();