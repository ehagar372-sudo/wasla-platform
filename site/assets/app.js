(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
let lang=store.get("wasla-lang"); if(lang!=="ar"&&lang!=="en") lang="ar";
const t=k=>I18N[lang][k]??k;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const page=document.body.dataset.page;
const ICON={
 users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
 plus:'<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
 star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>',
 coin:'<circle cx="12" cy="12" r="10"/><path d="M15 9.5a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2s1.3 1.8 3 2 3 .9 3 2-1.3 2-3 2a3 3 0 0 1-3-1.5M12 6v2m0 8v2"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
 sprout:'<path d="M7 20h10M12 20V10"/><path d="M12 10c0-4 3-6 7-6 0 4-2 7-7 6ZM12 13c0-3-2-5-6-5 0 3 2 5.500 6 5Z"/>',
 swap:'<path d="m17 3 4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3"/>',
 chev:'<path d="m6 9 6 6 6-6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
 eye:'<path d="M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/>',
 check:'<path d="M20 6 9 17l-5-5"/>'
};
const ic=(n,s=22)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
const slot=(label,cls="")=>`<div class="photo ${cls}" role="img" aria-label="${esc(label)}"><div>${ic("camera",32)}<div>${esc(label)}</div><small>${esc(t("photo_slot"))}</small></div></div>`;
const href=p=>p; // relative links work from file:// and any host

/* ---------- Supabase (lazy, optional) ---------- */
let sbPromise=null;
function getSb(){
  if(sbPromise) return sbPromise;
  sbPromise=new Promise(res=>{
    const cfg=window.WASLA_CONFIG; if(!cfg) return res(null);
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js";
    s.onload=()=>{try{res(window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY))}catch{res(null)}};
    s.onerror=()=>res(null);
    document.head.appendChild(s);
  });
  return sbPromise;
}
const safeNext=()=>{const n=new URLSearchParams(location.search).get("next");return n&&/^[a-z0-9\-_.\/]+\.html(\?[\w=&%\-.]*)?$/i.test(n)?n:"index.html"};

/* ---------- theme ---------- */
function applyTheme(m){
  const dark=m==="dark"||(m!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme=dark?"dark":"light";
}
applyTheme(store.get("wasla-theme"));
function toggleTheme(){const cur=document.documentElement.dataset.theme==="dark"?"light":"dark";store.set("wasla-theme",cur);applyTheme(cur)}

/* ---------- chrome ---------- */
const NAV=[["index.html","nav_home","home"],["explore.html","nav_explore","explore"],["how-it-works.html","nav_how","how"],["about.html","nav_about","about"],["faq.html","nav_faq","faq"]];
function chrome(){
  const h=$("#site-header");
  h.className="site-header";
  h.innerHTML=`<a class="skip" href="#main">${t("skip")}</a><div class="container nav">
   <a class="logo" href="${href("index.html")}"><span class="logo-mark">${ic("swap",20)}</span>${t("brand")}</a>
   <nav class="nav-links" id="navlinks" aria-label="${t("menu")}">${NAV.map(([u,k,p])=>`<a href="${u}" ${p===page?'aria-current="page"':""}>${t(k)}</a>`).join("")}</nav>
   <div class="nav-actions">
     <button class="icon-btn" id="langBtn" type="button" aria-label="${t("lang_btn")}">${t("lang_btn")==="English"?"EN":"ع"}</button>
     <button class="icon-btn" id="themeBtn" type="button" aria-label="${t("theme_btn")}">${ic("sun",18)}</button>
     <span id="authSlot" class="nav-actions"><a class="btn btn-ghost hide-sm" href="sign-in.html">${t("sign_in")}</a><a class="btn btn-primary hide-sm" href="sign-up.html">${t("join")}</a></span>
     <button class="icon-btn menu-btn" id="menuBtn" type="button" aria-label="${t("menu")}" aria-expanded="false" aria-controls="navlinks">${ic("menu",20)}</button>
   </div></div>`;
  $("#langBtn").onclick=()=>{store.set("wasla-lang",lang==="ar"?"en":"ar");location.reload()};
  $("#themeBtn").onclick=toggleTheme;
  $("#menuBtn").onclick=e=>{const o=$("#navlinks").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o)};
  $("#site-footer").className="site-footer";
  $("#site-footer").innerHTML=`<div class="container"><div class="foot-grid">
   <div><a class="logo" href="index.html"><span class="logo-mark">${ic("swap",20)}</span>${t("brand")}</a><p class="muted">${t("f_note")}</p><p><strong>${t("tagline")}</strong></p></div>
   <div><h4>${t("f_nav")}</h4><a href="index.html">${t("nav_home")}</a><a href="explore.html">${t("nav_explore")}</a><a href="how-it-works.html">${t("nav_how")}</a></div>
   <div><h4>${t("f_about")}</h4><a href="about.html">${t("nav_about")}</a><a href="faq.html">${t("nav_faq")}</a></div>
   <div><h4>${t("f_support")}</h4><a href="contact.html">${t("nav_contact")}</a><a href="sign-in.html">${t("sign_in")}</a><a href="sign-up.html">${t("join")}</a></div>
  </div><div class="copy">© ${new Date().getFullYear()} ${t("brand")} — ${t("f_rights")}</div></div>`;
  // reflect session in nav
  getSb().then(async sb=>{
    if(!sb) return;
    const {data}=await sb.auth.getSession();
    if(data&&data.session){
      $("#authSlot").innerHTML=`<button class="btn btn-secondary hide-sm" id="so" type="button">${t("sign_out")}</button>`;
      $("#so").onclick=async()=>{await sb.auth.signOut();location.href="index.html"};
    }
  });
}
function reveal(){
  const els=$$(".reveal");
  if(!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("in"));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
  els.forEach(e=>io.observe(e));
}
const catIcon={programming:"users",languages:"heart",design:"sprout",business:"coin",media:"camera",writing:"send",personal:"star"};
const demoSkill=s=>({...s,name:s[lang][0],desc:s[lang][1],teacherName:DEMO.people[s.teacher][lang]});
const skillName=id=>{const s=DEMO.skills.find(x=>x.id===id);return s?s[lang][0]:id};

/* ---------- shared blocks ---------- */
function faqHTML(items,idp){
  return items.map((q,i)=>`<div class="faq-item"><h3 style="margin:0"><button class="faq-q" type="button" aria-expanded="false" aria-controls="${idp}${i}" id="${idp}b${i}"><span>${esc(q[0])}</span>${ic("chev",20)}</button></h3><div class="faq-a" id="${idp}${i}" role="region" aria-labelledby="${idp}b${i}"><div><p>${esc(q[1])}</p></div></div></div>`).join("");
}
function bindFaq(root){
  $$(".faq-q",root).forEach(b=>b.onclick=()=>{const o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",!o)});
}
function skillCard(s){
  const d=demoSkill(s);
  return `<article class="card skill-card reveal">${slot(d.name,"")}
  <div class="body"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span class="chip">${esc(t("cats")[s.cat])}</span><span class="demo-tag">${t("demo")}</span></div>
  <h3>${esc(d.name)}</h3><p class="muted" style="margin:0">${esc(d.desc)}</p>
  <div class="row"><span class="mini-av" aria-hidden="true">${esc(d.teacherName.charAt(0))}</span><span>${esc(d.teacherName)} · <span class="muted">${t("level")[s.level]}</span></span></div>
  <div><span class="muted">${t("wants")}:</span> <span class="chip want">${esc(skillName(s.want))}</span></div>
  <a class="btn btn-secondary" style="margin-top:auto" href="skill.html?id=${encodeURIComponent(s.id)}">${t("view_details")}</a></div></article>`;
}
function ctaBlock(){
  return `<section><div class="container"><div class="cta reveal"><h2>${t("final_h")}</h2><p>${t("final_p")}</p><a class="btn" href="sign-up.html">${t("final_btn")}</a></div></div></section>`;
}
function whyCards(){
  const icons=["coin","users","sprout","heart"];
  return `<div class="grid g4">${t("why_cards").map((c,i)=>`<div class="card reveal"><div class="ico">${ic(icons[i])}</div><h3>${c[0]}</h3><p class="muted" style="margin:0">${c[1]}</p></div>`).join("")}</div>`;
}

/* ---------- pages ---------- */
const P={};
P.home=()=>`
<section class="hero"><div class="container hero-grid"><div>
 <span class="eyebrow">${t("tagline")}</span>
 <h1 style="margin-top:16px">${t("home_h1a")} <span class="grad">${t("home_h1b")}</span></h1>
 <p class="lead">${t("home_lead")}</p>
 <div class="btns"><a class="btn btn-primary" href="sign-up.html">${t("start")}</a><a class="btn btn-secondary" href="explore.html">${t("explore_cta")}</a></div></div>
 ${slot(t("photo_hero"),"tall")}</div></section>
<section><div class="container grid g2" style="align-items:center"><div class="reveal"><h2>${t("home_concept_h")}</h2><p class="lead">${t("home_concept_p")}</p></div>
 <div class="reveal">${exchangeBlock(false)}</div></div></section>
<section style="background:var(--surface-2)"><div class="container"><div class="center"><h2>${t("cats_h")}</h2><p class="lead">${t("cats_p")}</p></div>
 <div class="grid g4" style="margin-top:32px">${Object.entries(t("cats")).map(([k,v])=>`<a class="card reveal" href="explore.html?cat=${k}"><div class="ico">${ic(catIcon[k])}</div><h3 style="margin:0">${v}</h3></a>`).join("")}</div></div></section>
<section><div class="container"><div class="center"><h2>${t("feat_h")}</h2><p class="lead">${t("feat_p")}</p></div>
 <div class="grid g4" style="margin-top:32px">${DEMO.skills.slice(0,4).map(skillCard).join("")}</div></div></section>
<section style="background:var(--surface-2)"><div class="container"><div class="center" style="margin-bottom:32px"><h2>${t("benefits_h")}</h2></div>${whyCards()}</div></section>
<section><div class="container grid g2" style="align-items:center">${slot(t("photo_how"),"wide")}<div class="reveal"><h2>${t("why_h")}</h2><p class="lead">${t("why_p")}</p></div></div></section>
${ctaBlock()}`;

function exchangeBlock(showGain){
  return `<div class="card"><div class="exchange">
   <div class="person"><div class="avatar" aria-hidden="true">A</div><strong>${t("ex_a_name")}</strong><div class="muted">${t("offers")}</div><span class="chip">${t("prog")}</span><div class="muted">${t("wants")}</div><span class="chip want">${t("eng")}</span></div>
   <div class="arrows" aria-hidden="true">${ic("arrow",30)}${ic("arrow",30)}</div>
   <div class="person"><div class="avatar" aria-hidden="true">B</div><strong>${t("ex_b_name")}</strong><div class="muted">${t("offers")}</div><span class="chip">${t("eng")}</span><div class="muted">${t("wants")}</div><span class="chip want">${t("prog")}</span></div></div>
   ${showGain?`<div class="exchange-toggle"><button class="btn btn-secondary" id="exBtn" type="button" aria-expanded="false" aria-controls="exGain">${t("ex_toggle")}</button></div>
   <div id="exGain" hidden class="notice" style="margin-top:16px" role="status"><p style="margin:0 0 6px">${t("ex_a_gain")}</p><p style="margin:0 0 6px">${t("ex_b_gain")}</p><strong>${t("ex_note")}</strong></div>`:""}
   <p class="muted center" style="margin:16px 0 0"><small>${t("ex_sample")}</small></p></div>`;
}

P.how=()=>`
<section class="hero"><div class="container hero-grid"><div><h1>${t("how_h1")}</h1><p class="lead">${t("how_lead")}</p>
 <div class="btns"><a class="btn btn-primary" href="sign-up.html">${t("start")}</a><a class="btn btn-secondary" href="explore.html">${t("explore_cta")}</a></div></div>
 ${slot(t("photo_hero"),"tall")}</div></section>
<section><div class="container"><div class="center" style="margin-bottom:40px"><h2>${t("how_steps_h")}</h2></div>
 <ol class="steps" style="list-style:none;padding:0;margin:0 auto;max-width:760px">${t("steps").map((s,i)=>`<li class="step reveal"><div class="step-num" aria-hidden="true">${i+1}</div><div class="card"><h3>${s[0]}</h3><p class="muted" style="margin:0">${s[1]}</p></div></li>`).join("")}</ol></div></section>
<section style="background:var(--surface-2)"><div class="container" style="max-width:860px"><div class="center" style="margin-bottom:28px"><h2>${t("ex_h")}</h2><p class="lead">${t("ex_p")}</p></div><div class="reveal">${exchangeBlock(true)}</div></div></section>
<section><div class="container"><div class="center" style="margin-bottom:32px"><h2>${t("benefits_h")}</h2></div>${whyCards()}</div></section>
<section style="background:var(--surface-2)"><div class="container" style="max-width:820px"><div class="center" style="margin-bottom:28px"><h2>${t("faq_h")}</h2></div><div id="faqList">${faqHTML(t("faqs"),"hf")}</div></div></section>
${ctaBlock()}`;

P.about=()=>`<section class="hero"><div class="container"><h1>${t("about_h")}</h1><p class="lead">${t("about_p")}</p></div></section>
<section><div class="container grid g2"><div class="card reveal"><h2>${t("mission_h")}</h2><p class="muted">${t("mission_p")}</p></div><div class="card reveal"><h2>${t("vision_h")}</h2><p class="muted">${t("vision_p")}</p></div></div></section>
<section style="background:var(--surface-2)"><div class="container"><div class="center" style="margin-bottom:28px"><h2>${t("values_h")}</h2></div><div class="grid g3">${t("values").map((v,i)=>`<div class="card reveal"><div class="ico">${ic(["heart","users","swap"][i])}</div><h3>${v[0]}</h3><p class="muted" style="margin:0">${v[1]}</p></div>`).join("")}</div></div></section>${ctaBlock()}`;

P.faq=()=>`<section class="hero"><div class="container"><h1>${t("faq_h")}</h1>
 <div class="field" style="max-width:520px;margin-top:20px"><label class="sr" for="faqSearch">${t("faq_search")}</label><input id="faqSearch" class="input" type="search" placeholder="${t("faq_search")}"></div></div></section>
<section style="padding-top:20px"><div class="container" style="max-width:820px"><div id="faqList"></div><div id="faqEmpty" class="empty" hidden><p>${t("faq_empty")}</p></div>
 <p class="center" style="margin-top:24px"><a class="btn btn-secondary" href="contact.html">${t("faq_contact")}</a></p></div></section>`;

P.explore=()=>`<section class="hero"><div class="container"><h1>${t("explore_h")}</h1><p class="lead">${t("explore_lead")}</p>
 <div class="notice" style="margin-top:16px"><span class="demo-tag">${t("demo")}</span> ${t("demo_banner")}</div>
 <div class="filters"><label for="q" class="sr">${t("search_ph")}</label><input id="q" class="input" type="search" placeholder="${t("search_ph")}"><button class="btn btn-secondary" id="clr" type="button">${t("clear")}</button></div>
 <div class="pills" id="pills" role="group"></div></div></section>
<section style="padding-top:24px"><div class="container"><p class="muted" id="count" aria-live="polite"></p><div class="grid g4" id="cards"></div><div id="state"></div></div></section>`;

P.skill=()=>`<section><div class="container" id="detail"></div></section>`;
P.profile=()=>`<section><div class="container" id="detail"></div></section>`;

function notFound(){return `<div class="empty"><h1>${t("not_found")}</h1><p class="muted">${t("not_found_p")}</p><a class="btn btn-primary" href="explore.html">${t("back_explore")}</a></div>`}

function field(id,label,type,extra=""){return `<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" name="${id}" type="${type}" ${extra}><div class="err" id="${id}-e" role="alert"></div></div>`}
function pwField(id,label){return `<div class="field"><label for="${id}">${label}</label><div class="pw"><input class="input" id="${id}" name="${id}" type="password" autocomplete="${id==="password"?"current-password":"new-password"}"><button class="icon-btn" type="button" data-pw="${id}" aria-label="${t("show_pw")}" aria-pressed="false">${ic("eye",18)}</button></div><div class="err" id="${id}-e" role="alert"></div></div>`}
P.signin=()=>`<div class="container"><div class="auth-wrap card"><h1 style="font-size:2rem">${t("si_h")}</h1><form class="form" id="f" novalidate>${field("email",t("email"),"email",'autocomplete="email"')}${pwField("password",t("password"))}<div id="msg" role="status"></div><button class="btn btn-primary" id="go" type="submit">${t("sign_in")}</button></form><p class="muted">${t("no_account")} <a href="sign-up.html" style="color:var(--primary);font-weight:700">${t("join")}</a></p></div></div>`;
P.signup=()=>`<div class="container"><div class="auth-wrap card"><h1 style="font-size:2rem">${t("su_h")}</h1><form class="form" id="f" novalidate>${field("name",t("name"),"text",'autocomplete="name"')}${field("email",t("email"),"email",'autocomplete="email"')}${pwField("password",t("password"))}${pwField("confirm",t("confirm"))}<div id="msg" role="status"></div><button class="btn btn-primary" id="go" type="submit">${t("join")}</button></form><p class="muted">${t("have_account")} <a href="sign-in.html" style="color:var(--primary);font-weight:700">${t("sign_in")}</a></p></div></div>`;
P.contact=()=>`<section class="hero"><div class="container"><h1>${t("contact_h")}</h1><p class="lead">${t("contact_lead")}</p></div></section><section style="padding-top:20px"><div class="container" style="max-width:640px"><form class="form card" id="f" novalidate>${field("name",t("name"),"text",'autocomplete="name"')}${field("email",t("email"),"email",'autocomplete="email"')}${field("subject",t("subject"),"text")}<div class="field"><label for="message">${t("message")}</label><textarea class="input" id="message" name="message"></textarea><div class="err" id="message-e" role="alert"></div></div><div id="msg" role="status"></div><button class="btn btn-primary" id="go" type="submit">${t("send")}</button></form></div></section>`;

/* ---------- page behaviours ---------- */
const B={};
B.how=()=>{
  bindFaq($("#faqList"));
  const b=$("#exBtn"); if(b) b.onclick=()=>{const g=$("#exGain");const open=g.hidden;g.hidden=!open;b.setAttribute("aria-expanded",open)};
};
B.home=()=>{};
B.faq=()=>{
  const all=[...t("faqs"),...t("faq_more")];
  const draw=q=>{
    const n=q.trim().toLowerCase();
    const list=all.filter(x=>!n||(x[0]+" "+x[1]).toLowerCase().includes(n));
    $("#faqList").innerHTML=faqHTML(list,"fq"); bindFaq($("#faqList")); $("#faqEmpty").hidden=list.length>0;
  };
  draw(""); $("#faqSearch").oninput=e=>draw(e.target.value);
};
B.explore=()=>{
  const params=new URLSearchParams(location.search);
  let cat=params.get("cat")||"all"; if(cat!=="all"&&!t("cats")[cat]) cat="all";
  $("#q").value=params.get("q")||"";
  const pills=$("#pills");
  const draw=()=>{
    pills.innerHTML=[["all",t("all")],...Object.entries(t("cats"))].map(([k,v])=>`<button class="pill" type="button" data-c="${k}" aria-pressed="${k===cat}">${esc(v)}</button>`).join("");
    $$(".pill",pills).forEach(b=>b.onclick=()=>{cat=b.dataset.c;draw();render()});
  };
  const render=()=>{
    const q=$("#q").value.trim().toLowerCase();
    const list=DEMO.skills.filter(s=>(cat==="all"||s.cat===cat)&&(!q||(s.ar.join(" ")+" "+s.en.join(" ")+" "+DEMO.people[s.teacher].ar+" "+DEMO.people[s.teacher].en).toLowerCase().includes(q)));
    $("#count").textContent=`${list.length} ${t("results")}`;
    $("#cards").innerHTML=list.map(skillCard).join("");
    $("#state").innerHTML=list.length?"":`<div class="empty"><h3>${t("no_results")}</h3><p class="muted">${t("no_results_p")}</p></div>`;
    reveal();
  };
  $("#q").oninput=render;
  $("#clr").onclick=()=>{$("#q").value="";cat="all";draw();render()};
  draw();render();
};
B.skill=()=>{
  const id=new URLSearchParams(location.search).get("id");
  const s=DEMO.skills.find(x=>x.id===id); const box=$("#detail");
  if(!s){box.innerHTML=notFound();return}
  const d=demoSkill(s); document.title=d.name+" — "+t("brand");
  box.innerHTML=`<div class="grid g2" style="align-items:start"><div>${slot(d.name,"tall")}</div><div>
   <span class="chip">${esc(t("cats")[s.cat])}</span> <span class="demo-tag">${t("demo")}</span>
   <h1 style="margin-top:12px;font-size:2.2rem">${esc(d.name)}</h1><p class="lead">${esc(d.desc)}</p>
   <div class="card" style="margin:20px 0"><h3>${t("expect_h")}</h3><p class="muted" style="margin:0">${esc(d.desc)}</p></div>
   <div class="card" style="margin:20px 0"><h3>${t("teacher")}</h3><div class="row" style="display:flex;gap:12px;align-items:center"><span class="mini-av" aria-hidden="true">${esc(d.teacherName.charAt(0))}</span><div><strong>${esc(d.teacherName)}</strong> · <span class="muted">${t("level")[s.level]}</span><div><a style="color:var(--primary);font-weight:700" href="profile.html?id=${s.teacher}">${t("view_profile")}</a></div></div></div>
   <p style="margin-bottom:0"><span class="muted">${t("wants_h")}:</span> <span class="chip want">${esc(skillName(s.want))}</span></p></div>
   <button class="btn btn-primary" id="req" type="button">${t("request")}</button><div id="reqMsg" role="status" style="margin-top:12px"></div></div></div>`;
  $("#req").onclick=async()=>{
    const sb=await getSb(); const out=$("#reqMsg");
    if(!sb){out.innerHTML=`<div class="alert bad">${t("svc_err")}</div>`;return}
    const {data}=await sb.auth.getSession();
    if(!data||!data.session){location.href="sign-in.html?next="+encodeURIComponent("skill.html?id="+s.id);return}
    out.innerHTML=`<div class="notice">${t("req_demo")}</div>`;
  };
};
B.profile=async()=>{
  const id=new URLSearchParams(location.search).get("id"); const box=$("#detail");
  const p=DEMO.people[id];
  if(p){
    const offered=DEMO.skills.filter(s=>s.teacher===id), wanted=offered.map(s=>s.want);
    box.innerHTML=profileHTML({name:p[lang],bio:p.bio[lang],interests:p.interests[lang],avail:p.avail[lang],offered:offered.map(s=>skillName(s.id)),wanted:wanted.map(skillName),demo:true});
    return;
  }
  if(!/^[0-9a-f-]{36}$/i.test(id||"")){box.innerHTML=notFound();return}
  const sb=await getSb(); if(!sb){box.innerHTML=`<div class="alert bad">${t("svc_err")}</div>`;return}
  const {data:pr}=await sb.from("profiles").select("display_name,bio,interests,availability").eq("id",id).maybeSingle();
  if(!pr){box.innerHTML=notFound();return}
  const {data:us}=await sb.from("user_skills").select("kind,skills(name_ar,name_en)").eq("user_id",id);
  const nm=r=>r.skills?(lang==="ar"?r.skills.name_ar:r.skills.name_en):"";
  box.innerHTML=profileHTML({name:pr.display_name||"—",bio:pr.bio||"",interests:pr.interests||[],avail:pr.availability||"",offered:(us||[]).filter(r=>r.kind==="offer").map(nm),wanted:(us||[]).filter(r=>r.kind==="want").map(nm),demo:false});
};
function profileHTML(o){
  const chips=a=>a.length?a.map(x=>`<span class="chip">${esc(x)}</span>`).join(""):`<span class="muted">—</span>`;
  return `<div class="card" style="max-width:820px;margin:0 auto"><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><div class="avatar" style="margin:0" aria-hidden="true">${esc(o.name.charAt(0)||"?")}</div><div><h1 style="font-size:2rem;margin:0">${esc(o.name)}</h1>${o.demo?`<span class="demo-tag">${t("demo")}</span>`:""}</div></div>
  <p class="lead">${esc(o.bio)}</p><h3>${t("offered_h")}</h3><p>${chips(o.offered)}</p><h3>${t("wanted_h")}</h3><p>${o.wanted.length?o.wanted.map(x=>`<span class="chip want">${esc(x)}</span>`).join(""):'<span class="muted">—</span>'}</p>
  <h3>${t("interests_h")}</h3><p>${chips(o.interests)}</p>${o.avail?`<h3>${t("avail_h")}</h3><p class="muted">${esc(o.avail)}</p>`:""}
  <a class="btn btn-primary" href="sign-in.html?next=${encodeURIComponent(location.pathname.split("/").pop()+location.search)}">${t("request")}</a></div>`;
}
/* forms */
const EMAIL=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function setErr(id,msg){const i=$("#"+id),e=$("#"+id+"-e");if(!e)return;e.textContent=msg||"";i.setAttribute("aria-invalid",msg?"true":"false")}
function bindPw(){$$("[data-pw]").forEach(b=>b.onclick=()=>{const i=$("#"+b.dataset.pw);const show=i.type==="password";i.type=show?"text":"password";b.setAttribute("aria-pressed",show);b.setAttribute("aria-label",show?t("hide_pw"):t("show_pw"))})}
function formFlow(validate,submit){
  const f=$("#f"),btn=$("#go"),msg=$("#msg"),label=btn.textContent;
  f.onsubmit=async e=>{
    e.preventDefault(); msg.innerHTML="";
    if(!validate()) return;
    btn.disabled=true;btn.textContent=t("loading");
    try{await submit(msg)}catch{msg.innerHTML=`<div class="alert bad">${t("auth_err")}</div>`}
    btn.disabled=false;btn.textContent=label;
  };
}
B.signin=()=>{bindPw();
  formFlow(()=>{const em=$("#email").value.trim(),pw=$("#password").value;setErr("email",EMAIL.test(em)?"":t("v_email"));setErr("password",pw.length>=8?"":t("v_pw"));return EMAIL.test(em)&&pw.length>=8},
  async msg=>{const sb=await getSb();if(!sb){msg.innerHTML=`<div class="alert bad">${t("svc_err")}</div>`;return}
   const {error}=await sb.auth.signInWithPassword({email:$("#email").value.trim(),password:$("#password").value});
   if(error){msg.innerHTML=`<div class="alert bad">${t("auth_err")}</div>`;return}
   msg.innerHTML=`<div class="alert ok">${t("si_ok")}</div>`;location.href=safeNext()});
};
B.signup=()=>{bindPw();
  formFlow(()=>{const n=$("#name").value.trim(),em=$("#email").value.trim(),pw=$("#password").value,c=$("#confirm").value;
   setErr("name",n.length>=2?"":t("v_name"));setErr("email",EMAIL.test(em)?"":t("v_email"));setErr("password",pw.length>=8?"":t("v_pw"));setErr("confirm",c===pw?"":t("v_confirm"));
   return n.length>=2&&EMAIL.test(em)&&pw.length>=8&&c===pw},
  async msg=>{const sb=await getSb();if(!sb){msg.innerHTML=`<div class="alert bad">${t("svc_err")}</div>`;return}
   const {data,error}=await sb.auth.signUp({email:$("#email").value.trim(),password:$("#password").value,options:{data:{display_name:$("#name").value.trim()}}});
   if(error){msg.innerHTML=`<div class="alert bad">${t("auth_err")}</div>`;return}
   if(data.session){location.href=safeNext();return}
   msg.innerHTML=`<div class="alert ok">${t("su_ok")}</div>`});
};
B.contact=()=>{
  formFlow(()=>{const n=$("#name").value.trim(),em=$("#email").value.trim(),s=$("#subject").value.trim(),m=$("#message").value.trim();
   setErr("name",n.length>=2?"":t("v_name"));setErr("email",EMAIL.test(em)?"":t("v_email"));setErr("subject",s.length>=3?"":t("v_subject"));setErr("message",m.length>=10?"":t("v_msg"));
   return n.length>=2&&EMAIL.test(em)&&s.length>=3&&m.length>=10},
  async msg=>{const sb=await getSb();if(!sb){msg.innerHTML=`<div class="alert bad">${t("contact_err")}</div>`;return}
   const {error}=await sb.from("contact_messages").insert({name:$("#name").value.trim(),email:$("#email").value.trim(),subject:$("#subject").value.trim(),message:$("#message").value.trim()});
   if(error){msg.innerHTML=`<div class="alert bad">${t("contact_err")}</div>`;return}
   $("#f").reset();msg.innerHTML=`<div class="alert ok">${t("contact_ok")}</div>`});
};

/* ---------- boot ---------- */
document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
const titles={home:"home_title",how:"how_title",about:"about_title",faq:"faq_title",explore:"explore_title",skill:"skill_title",profile:"profile_title",signin:"si_title",signup:"su_title",contact:"contact_title"};
document.title=t(titles[page]);
chrome();
$("#main").innerHTML=P[page]();
if(B[page]) B[page]();
reveal();
})();
