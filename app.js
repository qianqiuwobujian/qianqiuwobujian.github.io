
const tutorials = window.SITE_DATA.tutorials;
const app = document.getElementById("app");
const cats = ["全部", ...new Set(tutorials.map(x=>x.category))];
let activeCat = "全部";

function pageImg(n){ return `assets/pages/page-${String(n).padStart(2,"0")}.webp`; }
function card(t){
  return `<a class="card" href="#/tutorial/${t.id}">
    <div class="card-cover"><img loading="lazy" src="${pageImg(t.pages[0])}" alt="${t.title}"></div>
    <div class="card-body">
      <div class="meta"><span>${t.category}</span><span class="badge">${t.tag}</span></div>
      <h3>${t.title}</h3><p>${t.subtitle}</p>
    </div></a>`;
}
function renderHome(){
  app.innerHTML = `
    <section class="hero">
      <div>
        <span class="eyebrow">固件 · 电路图 · 图纸 · 烧录教程</span>
        <h1>把创意，<br>真正做出来。</h1>
        <p>这里收录“千秋我不见”的 DIY 项目资料。按照视频找到对应项目，查看材料清单、电路连接、固件下载和制作注意事项。</p>
        <div class="actions"><a class="btn primary" href="#tutorials">浏览全部教程</a><a class="btn" href="#/tutorial/faq">遇到问题？先看排查</a></div>
      </div>
      <div class="hero-art"><img src="${pageImg(1)}" alt="千秋我不见 DIY 作品"></div>
    </section>
    <section class="section" id="tutorials">
      <div class="section-head"><div><h2>项目教程</h2><p>点击项目进入完整图文页面</p></div><p>${tutorials.length} 个教程与帮助页面</p></div>
      <div class="toolbar"><input id="search" class="search" placeholder="搜索：翻转时钟、机器人、ESP32……"></div>
      <div class="chips">${cats.map(c=>`<button class="chip ${c===activeCat?'active':''}" data-cat="${c}">${c}</button>`).join("")}</div>
      <div id="grid" class="grid">${tutorials.map(card).join("")}</div>
    </section>`;
  const search = document.getElementById("search");
  const grid = document.getElementById("grid");
  function filter(){
    const q=search.value.trim().toLowerCase();
    const list=tutorials.filter(t=>(activeCat==="全部"||t.category===activeCat)&&(`${t.title}${t.subtitle}${t.category}${t.tag}`.toLowerCase().includes(q)));
    grid.innerHTML=list.length?list.map(card).join(""):`<div class="empty">没有找到对应教程</div>`;
  }
  search.addEventListener("input",filter);
  document.querySelectorAll(".chip").forEach(btn=>btn.onclick=()=>{
    activeCat=btn.dataset.cat;
    document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===btn));
    filter();
  });
}
function renderArticle(id){
  const i=tutorials.findIndex(x=>x.id===id), t=tutorials[i];
  if(!t){ location.hash="#/"; return; }
  const prev=tutorials[(i-1+tutorials.length)%tutorials.length], next=tutorials[(i+1)%tutorials.length];
  app.innerHTML=`<article class="article">
    <a class="back" href="#/">← 返回教程首页</a>
    <header class="article-head"><span class="eyebrow">${t.category} · ${t.tag}</span><h1>${t.title}</h1><p>${t.subtitle}</p></header>
    <div class="notice"><b>阅读提示：</b>点击任何图片可放大查看。手机端可双指缩放；下载链接和接线信息请以图片中的原始内容为准。</div>
    <div class="page-stack">${t.pages.map(n=>`<figure class="page-frame"><img loading="lazy" src="${pageImg(n)}" data-full="${pageImg(n)}" alt="${t.title}教程第${n}页"><figcaption class="page-number">原文第 ${n} 页</figcaption></figure>`).join("")}</div>
    <nav class="article-nav"><a class="btn" href="#/tutorial/${prev.id}">← ${prev.title}</a><a class="btn primary" href="#/tutorial/${next.id}">${next.title} →</a></nav>
  </article>`;
  document.querySelectorAll(".page-frame img").forEach(img=>img.onclick=()=>openViewer(img.dataset.full));
  window.scrollTo(0,0);
}
function route(){
  const m=location.hash.match(/^#\/tutorial\/(.+)$/);
  m?renderArticle(m[1]):renderHome();
}
const viewer=document.getElementById("viewer"), viewerImg=document.getElementById("viewerImg");
function openViewer(src){viewerImg.src=src;viewer.classList.add("open");viewer.setAttribute("aria-hidden","false")}
function closeViewer(){viewer.classList.remove("open");viewer.setAttribute("aria-hidden","true");viewerImg.src=""}
viewer.querySelector(".viewer-close").onclick=closeViewer;
viewer.onclick=e=>{if(e.target===viewer)closeViewer()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeViewer()});
document.getElementById("menuBtn").onclick=()=>location.hash="#/";
window.addEventListener("hashchange",route); route();
