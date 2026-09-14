(function(){
  "use strict";
  if(window.__infinityCosmoChannelLoader)return;
  window.__infinityCosmoChannelLoader=true;
  const ROOT="https://www-infinity4.github.io/Cosmo/";
  const AI="https://infinity-rogers.marvaseater.workers.dev/v1/reason";
  const add=(tag,attrs)=>{const node=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>node[k]=v);document.head.appendChild(node);return node};
  if(!document.querySelector('link[data-cosmo-shared]')){const link=add("link",{rel:"stylesheet",href:ROOT+"cosmo.css?v=20260914-editor2"});link.dataset.cosmoShared="1";}
  const style=document.createElement("style");
  style.textContent="#infinityCosmoButton{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(74px,calc(env(safe-area-inset-bottom) + 64px));z-index:10000;width:52px;height:58px;border:1px solid #9ef9df99;border-radius:48% 48% 42% 42%;background:linear-gradient(145deg,#b8ffe9,#298d80 72%);box-shadow:0 10px 30px #0008,0 0 16px #75ffd655;color:#071713;cursor:pointer}#infinityCosmoButton:before,#infinityCosmoButton:after{content:'';position:absolute;top:25px;width:10px;height:14px;border-radius:50%;background:#071426;box-shadow:0 0 7px #72ccff}#infinityCosmoButton:before{left:11px;transform:rotate(12deg)}#infinityCosmoButton:after{right:11px;transform:rotate(-12deg)}#infinityCosmoButton span{position:absolute;left:25px;top:-10px;width:2px;height:13px;background:#9ef9df}#infinityCosmoButton span:after{content:'';position:absolute;left:-3px;top:-3px;width:8px;height:8px;border-radius:50%;background:#ffe878;box-shadow:0 0 8px #ffe878}#infinityCosmoButton small{position:absolute;left:50%;bottom:5px;transform:translateX(-50%);font:900 9px/1 system-ui}.cosmo{z-index:10003;bottom:max(136px,calc(env(safe-area-inset-bottom) + 126px))}#cosmoPageEditor{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:18px;background:#02060dcc;backdrop-filter:blur(9px);font:15px/1.45 Inter,system-ui;color:#fff}#cosmoPageEditor[hidden]{display:none}#cosmoPageEditor .cpe-card{width:min(620px,100%);padding:20px;border:1px solid #72ccff77;border-radius:20px;background:linear-gradient(145deg,#102744,#071426);box-shadow:0 25px 90px #000b}#cosmoPageEditor h2{margin:0 0 6px}#cosmoPageEditor p{margin:0 0 14px;color:#c9dded}#cosmoPageEditor textarea{width:100%;min-height:120px;padding:12px;border:1px solid #72ccff66;border-radius:13px;background:#061222;color:#fff;font:inherit;resize:vertical}#cosmoPageEditor .cpe-status{min-height:24px;margin:10px 0;color:#ffe878}#cosmoPageEditor .cpe-actions{display:flex;flex-wrap:wrap;gap:8px}#cosmoPageEditor button{min-height:44px;padding:0 14px;border:1px solid #72ccff66;border-radius:12px;background:#102744;color:#fff;font-weight:850}#cosmoPageEditor [data-cpe=save]{background:#58d7ad;color:#051611}#cosmoPageEditor [data-cpe=close]{margin-left:auto}@media(max-width:540px){.cosmo{bottom:0;max-height:76dvh}#infinityCosmoButton{bottom:max(72px,calc(env(safe-area-inset-bottom) + 62px))}#cosmoPageEditor{align-items:end;padding:0}#cosmoPageEditor .cpe-card{border-radius:20px 20px 0 0}}";
  document.head.appendChild(style);
  function text(selector){return String(document.querySelector(selector)?.textContent||"").replace(/\s+/g," ").trim()}
  const EDIT_KEY="infinity:cosmoPageEdit:"+location.origin+location.pathname;
  const ALLOWED_STYLE=new Set(["color","backgroundColor","fontSize","fontFamily","fontWeight","borderRadius","gap","maxWidth","letterSpacing","textAlign"]);
  let previewUndo=[],previewPatch=null;
  function editableNodes(){
    return [...document.querySelectorAll("h1,h2,h3,p")].filter(node=>!node.closest("#infinityCosmoRoot,#cosmoPageEditor,#infinityChannelGuide")&&!node.hidden).slice(0,80).map((node,index)=>{node.dataset.cosmoEditId=String(index);return{selector:`[data-cosmo-edit-id=\"${index}\"]`,tag:node.tagName.toLowerCase(),text:String(node.textContent||"").replace(/\s+/g," ").trim().slice(0,260)}});
  }
  function safePatch(input){
    const changes=(Array.isArray(input?.changes)?input.changes:[]).slice(0,20).flatMap(change=>{
      const selector=String(change?.selector||"");if(selector!=="body"&&!/^\[data-cosmo-edit-id="\d+"\]$/.test(selector))return [];
      const out={selector};if(typeof change.text==="string"&&selector!=="body")out.text=change.text.slice(0,500);
      if(change.styles&&typeof change.styles==="object"){out.styles={};Object.entries(change.styles).forEach(([key,value])=>{const cleanValue=String(value).slice(0,120);if(ALLOWED_STYLE.has(key)&&!/[<>@]|url\s*\(|expression\s*\(/i.test(cleanValue))out.styles[key]=cleanValue})}
      return out.text!==undefined||Object.keys(out.styles||{}).length?[out]:[];
    });
    return{summary:String(input?.summary||"Cosmo page edit").slice(0,160),changes};
  }
  function undoPreview(){previewUndo.splice(0).reverse().forEach(undo=>undo());previewPatch=null}
  function applyPatch(patch,recordUndo=true){
    if(recordUndo)undoPreview();
    safePatch(patch).changes.forEach(change=>{const node=document.querySelector(change.selector);if(!node)return;const oldText=node.textContent,oldStyles={};if(change.text!==undefined)node.textContent=change.text;Object.entries(change.styles||{}).forEach(([key,value])=>{oldStyles[key]=node.style[key];node.style[key]=value});if(recordUndo)previewUndo.push(()=>{if(change.text!==undefined)node.textContent=oldText;Object.entries(oldStyles).forEach(([key,value])=>node.style[key]=value)})});
    previewPatch=safePatch(patch);return previewPatch.changes.length;
  }
  function fallbackPatch(request,nodes){
    const changes=[];const bg=request.match(/background(?:\s+color)?\s+(?:to\s+)?(#[0-9a-f]{3,8}|black|white|navy|blue|red|green|purple|gray|grey)/i);if(bg)changes.push({selector:"body",styles:{backgroundColor:bg[1]}});
    const color=request.match(/(?:text|font)(?:\s+color)?\s+(?:to\s+)?(#[0-9a-f]{3,8}|black|white|navy|blue|red|green|purple|gray|grey)/i);if(color)changes.push({selector:"body",styles:{color:color[1]}});
    const replace=request.match(/(?:change|replace)\s+[“\"]([^”\"]+)[”\"]\s+(?:to|with)\s+[“\"]([^”\"]+)[”\"]/i);if(replace){const node=nodes.find(item=>item.text.includes(replace[1]));if(node)changes.push({selector:node.selector,text:node.text.replace(replace[1],replace[2])})}
    return{summary:"Preview based on your request",changes};
  }
  function parseModelEdit(value){try{const raw=String(value||"");const json=raw.match(/\{[\s\S]*\}/)?.[0]||raw;return safePatch(JSON.parse(json))}catch{return null}}
  async function proposeEdit(request){
    const nodes=editableNodes(),system="You are Cosmo's page editor. Return JSON only: {summary:string,changes:[{selector:string,text?:string,styles?:object}]}. Use only selectors provided in the page snapshot or body. Keep the page usable, preserve factual meaning unless the user explicitly requests text changes, and make only requested changes.";
    try{const response=await fetch(AI,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:system},{role:"user",content:JSON.stringify({request,page:{title:document.title,url:location.href,elements:nodes}})}],context:{site:location.href,mode:"page-edit-preview"}})});if(response.ok){const data=await response.json();const parsed=parseModelEdit(data.output_text||data.text||data.response);if(parsed?.changes.length)return parsed}}catch(_){}
    return safePatch(fallbackPatch(request,nodes));
  }
  function editor(){
    let root=document.getElementById("cosmoPageEditor");if(root)return root;
    root=document.createElement("section");root.id="cosmoPageEditor";root.hidden=true;root.innerHTML='<div class="cpe-card"><h2>Cosmo · Edit this page</h2><p>Describe the change. Cosmo previews it first; nothing is saved until you confirm.</p><textarea maxlength="800" placeholder="Example: Make the background navy and change “TV guide” to “Tonight on this channel”."></textarea><div class="cpe-status" aria-live="polite"></div><div class="cpe-actions"><button data-cpe="preview">Preview changes</button><button data-cpe="save" disabled>Save on this page</button><button data-cpe="undo" disabled>Undo preview</button><button data-cpe="close">Close</button></div></div>';document.body.appendChild(root);
    const status=root.querySelector(".cpe-status"),save=root.querySelector('[data-cpe="save"]'),undo=root.querySelector('[data-cpe="undo"]');
    root.querySelector('[data-cpe="preview"]').addEventListener("click",async event=>{const request=root.querySelector("textarea").value.trim();if(!request)return status.textContent="Describe the change you want.";event.target.disabled=true;status.textContent="Cosmo is preparing a safe preview…";const patch=await proposeEdit(request);const count=applyPatch(patch);status.textContent=count?`${patch.summary} · ${count} change${count===1?"":"s"} previewed.`:"I could not turn that request into a safe page change yet.";save.disabled=!count;undo.disabled=!count;event.target.disabled=false});
    save.addEventListener("click",()=>{if(!previewPatch)return;try{localStorage.setItem(EDIT_KEY,JSON.stringify(previewPatch));previewUndo=[];status.textContent="Saved for this page on this device.";save.disabled=true;undo.disabled=false}catch{status.textContent="The browser blocked saving; the preview is still visible."}});
    undo.addEventListener("click",()=>{undoPreview();localStorage.removeItem(EDIT_KEY);status.textContent="Page edit removed.";save.disabled=true;undo.disabled=true});root.querySelector('[data-cpe="close"]').addEventListener("click",()=>{root.hidden=true});return root;
  }
  function openEditor(payload={}){const root=editor();root.hidden=false;const field=root.querySelector("textarea");if(payload.request)field.value=payload.request;field.focus();return Promise.resolve({message:"I opened a page-edit preview. Tell me the change, preview it, then confirm before it is saved."})}
  function applySaved(){editableNodes();try{const saved=JSON.parse(localStorage.getItem(EDIT_KEY));if(saved)applyPatch(saved,false)}catch{}}
  function mount(){
    if(!window.Cosmo||document.getElementById("infinityCosmoRoot"))return;
    const root=document.createElement("aside");root.id="infinityCosmoRoot";root.hidden=true;document.body.appendChild(root);
    const button=document.createElement("button");button.id="infinityCosmoButton";button.type="button";button.setAttribute("aria-label","Open Cosmo companion");button.innerHTML="<span></span><small>COSMO</small>";document.body.appendChild(button);
    const program=()=>{const title=text("[data-now-playing],#nowTitle,#programTitle,.now-title")||document.title.split(/[—|·]/)[0];const channel=document.body.dataset.channel||text(".brand")||document.title.split(/[—|·]/)[0];return{id:(channel+":"+title).toLowerCase().replace(/[^a-z0-9]+/g,"-"),title,channel}};
    const playback=()=>{let seconds=0,playing=false;try{const p=window.player||window.channelPlayer;if(p&&typeof p.getCurrentTime==="function"){seconds=p.getCurrentTime();playing=p.getPlayerState?.()===1}}catch(_){}return{seconds,playing}};
    const index=()=>({moments:[{id:"live-program",start:0,end:86400,transcript:text("#nowMeta,.meta,[data-program-description]"),setting:"Live "+program().channel+" channel",themes:[program().title,program().channel],entities:[],objects:[],connections:[]}]});
    const respond=async payload=>{const response=await fetch(AI,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:"You are Cosmo, the Infinity TV viewing companion. Answer naturally and concisely using the supplied live channel context. Do not invent scene details."},{role:"user",content:JSON.stringify(payload)}],context:{site:location.href,program:payload.program,playback:payload.playback}})});if(!response.ok)throw new Error("AI unavailable");const data=await response.json();return{text:data.output_text||data.text||data.response||"I could not form a response."}};
    window.Cosmo.mount({root,user:{id:"channel-viewer"},program,playback,index,respond,editPage:openEditor,proactiveEveryMs:180000});
    button.addEventListener("click",()=>{root.hidden=!root.hidden});
    applySaved();setTimeout(applySaved,1200);
  }
  if(window.Cosmo)mount();else{const script=add("script",{src:ROOT+"cosmo.js?v=20260914-editor2"});script.onload=mount;}
})();
