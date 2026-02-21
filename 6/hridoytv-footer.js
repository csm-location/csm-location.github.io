document.addEventListener("DOMContentLoaded", () => {

let lastViewMode = "all";
let lastActiveFooter = null;
let searchSelectionMade = false;

let lastSelectedSearchId = null;
let lastClickedTab = null;


const isDesktop = window.innerWidth >= 769;

const scrollState = {
  home: 0,
  favs: 0,
  category: {}
};

function saveScroll(type, key = null) {
  const c = document.querySelector(".channel-container");
  if (!c) return;

  if (type === "home") {
    scrollState.home = c.scrollTop;
  } 
  else if (type === "favs") {
    scrollState.favs = c.scrollTop;
  } 
  else if (type === "cat" && key) {
    scrollState.category[key] = c.scrollTop;
  }
}

function restoreScroll(type, key = null) {
  const c = document.querySelector(".channel-container");
  if (!c) return;

  let top = 0;

  if (type === "home") {
    top = scrollState.home || 0;
  } 
  else if (type === "favs") {
    top = scrollState.favs || 0;
  } 
  else if (type === "cat" && key) {
    top = scrollState.category[key] || 0;
  }

  c.scrollTo({ top, behavior: "auto" });
}

/* ================= CSS ================= */
const style = document.createElement("style");
style.textContent = `
:root{
--green:#1fa463;
--green-dark:#0b6b3a;
--panel:#121212;
}

.search-number{
font-family: 'Montserrat', system-ui, sans-serif;
  background:#333;
  color:#fff;
  font-size:5px;
  font-weight:500;

  padding:3px 5px;
  border-radius:5px;

  display:inline-flex;
  align-items:center;
  justify-content:center;

  line-height:1;
  white-space:nowrap;
}
/* 🔥 SEARCH SELECT FLASH */
.search-flash{
  animation: searchFlash 1.9s ease;
}

@keyframes searchFlash{
  0%{
    box-shadow: 0 0 0 rgba(31,164,99,0);
    transform: scale(1);
  }
  30%{
    box-shadow: 0 0 14px rgba(31,164,99,0.9);
    transform: scale(1.03);
  }
  60%{
    box-shadow: 0 0 10px rgba(31,164,99,0.6);
  }
  100%{
    box-shadow: 0 0 0 rgba(31,164,99,0);
    transform: scale(1);
  }
}




.search-clear,
.search-close{
  flex-shrink: 0;
}


/* 🔥 GLOBAL – desktop + mobile */
.search-results{
  display: none;
}

.search-results.show{
  display: block;
  opacity: 1;
  transform: translateY(0);
}

/* ===== DESKTOP MENU SLIDE FROM RIGHT ===== */
.menu-overlay.desktop .menu-box{
transform: translateX(40px); /* ডান দিকে লুকানো */
opacity: 0;
transition: transform .35s ease, opacity .35s ease;
}

/* যখন menu open হবে */
.menu-overlay.show.desktop .menu-box{
transform: translateX(0); /* নিজের জায়গায় আসবে */
opacity: 1;
}

.fav-empty-state{
margin-top: 40px; /* 🔥 আগে 40px ছিল */
padding: 15px;

display:flex; align-items:center; justify-content:center; gap:10px; background: transparent; border-radius:10px; color:#aaa; font-size:14px; min-height: auto; /* 🔥 extra height off */ 

}

.footer-item.active i{
background:#fff;
color:#000;
border-radius:50%;
padding:6px;
}

.search-logo{
width:36px;
height:36px;
border-radius:8px;
overflow:hidden;
flex-shrink:0;
}
.search-logo img{
width:100%;
height:100%;
object-fit:contain;
}

.search-clear{
width:42px;
height:42px;
border-radius:50%;
border:none;
background:#2a2a2a;
color:#ccc;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
}
.search-clear:active{
transform:scale(.92);
}

body.keyboard-open .tg-wrapper{
display:none !important;
}

body.keyboard-open.search-open .app-footer{
display:none !important;
}

.search-empty-box{
background:#121212;
color:#777;
padding:10px;
border-radius:8px;
text-align:center;
font-size:13px;
margin-top:0px;
}

/* ================= SEARCH PANEL ================= */
.search-panel{
display:flex;
flex-direction: column;
max-height:100%;
}

/* ================= DESKTOP VIEW ================= */
@media (min-width:769px){

/* Search bar on top */ .search-bar{ order:1; display:flex; align-items:center; gap:6px; padding:10px; background:#121212; border-bottom:1px solid #1f1f1f; } /* Results below */ .search-results{ order:2; flex:1; overflow-y:auto; padding:10px 4px; max-height:360px; } 

}

/* ================= MOBILE VIEW ================= */
@media (max-width:768px){

/* 🔍 SEARCH BAR — ALWAYS TOP */
.search-bar{
display:flex;
align-items:center;
gap:6px;
padding:5px;
background:#121212;
border-bottom:1px solid #222;

position:fixed; /* 🔥 FIXED */ top:0; /* 🔥 একদম টপ */ left:0; right:0; height:50px; z-index:1005; transform: translateY(-100%); opacity: 0; transition: transform .35s ease, opacity .35s ease; } /* panel open হলে */ 

.panel-overlay.show .search-bar{
transform: translateY(0);
opacity: 1;
}

/* 📋 RESULTS — BELOW INPUT */
.search-results{
position:relative;
max-height: 70vh; /* 🔥 স্ক্রিনের 65% এর বেশি হবে না */
overflow-y: auto;
flex: unset; /* 🔥 flex:1 বন্ধ */
background: #121212; /* রেজাল্টের পিছনে কালো ব্যাকগ্রাউন্ড */
padding: 10px 8px; /* রেজাল্টের চারপাশে সামান্য জায়গা */
margin-top: -20px; /* সার্চ বার যেন রেজাল্টকে ঢেকে না ফেলে */
border-radius:10px;
display: none; /* 🔥 এটি নতুন যোগ করুন, যাতে শুরুতে কালো বক্স না দেখায় */
opacity: 0;
transform: translateY(-10px);
transition: opacity .25s ease, transform .25s ease;
}

.search-results.show{ display:block; opacity: 1; transform: translateY(0);} 

}

/* ================= SEARCH INPUT ================= */


.search-input::placeholder{
color:#888;
}

/* ================= SEARCH BUTTONS ================= */
.search-action,
.search-close{
width:42px;
height:42px;
border-radius:50%;
border:none;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
font-size:16px;
}

.search-action{
background:#1fa463;
color:#fff;
}

.search-close{
background:#2a2a2a;
color:#ccc;
}

/* ================= SEARCH RESULTS ================= */
.search-item{
display:flex;
align-items:center;
gap:8px;
padding:8px 10px;
border-radius:0px;
background:#111;
color:#ddd;
cursor:pointer;
margin-bottom:8px;
border-bottom: 1px solid #222;
transition:background .2s ease, transform .15s ease;
}

.search-item:hover{
background:#1f1f1f;
}

.search-item:active{
transform:scale(0.97);
}

.search-item img{
width:36px;
height:36px;
border-radius:50%;
object-fit:contain;
background:#fff;
flex-shrink:0;
}

.search-item span{
font-size:13.5px;
font-weight:500;
line-height:1.3;
color:#e0e0e0;
}

/* ================= MATCH HIGHLIGHT ================= */
.search-highlight{
color:#1fa463;
font-weight:700;
background:rgba(31,164,99,.15);
padding:0 3px;
border-radius:4px;
}

/* ================= EMPTY STATE ================= */
.search-empty{
text-align:center;
font-size:13px;
color:#777;
padding:24px 0;
opacity:0.9;
}

/* ===== FOOTER ===== */
.app-footer{
width:auto;
height:55px;

background-color: #111;
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(32px);

box-shadow: 0 -8px 30px rgba(0,0,0,0.6); border-top: 1px solid rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:space-around; box-shadow:0 -6px 20px rgba(0,0,0,.45); z-index:999; 

}

/* FOOTER ITEMS */
.footer-item{
display:flex;
flex-direction:column;
align-items:center;
gap:4px;
font-size:11px;
color:#fff;
cursor:pointer;
}

.footer-item i{
font-size:18px;
transition:transform .25s ease;
}
.footer-item:active i{
transform:scale(1.25);
}

/* ===== ACCOUNT (PREMIUM PRO) ===== */
.footer-account{
position:relative;
}

.account-ring{
position:relative;
width:40px;
height:40px;
border-radius:50%;
background:
radial-gradient(circle at top left,#ffffff,#dcdcdc);
display:flex;
align-items:center;
justify-content:center;
box-shadow:
0 10px 24px rgba(0,0,0,.45),
inset 0 0 0 3px rgba(21,128,61,.7); /* dark green */
}

/* OUTER GLOW RING */
.account-ring::before{
content:"";
position:absolute;
inset:-4px;
border-radius:50%;
background:#15803d;
filter:blur(5px);
opacity:.45;
z-index:-1;
}

/* INNER GLASS */
.account-ring::after{
content:"";
position:absolute;
inset:2px;
border-radius:50%;
background:linear-gradient(
145deg,
rgba(255,255,255,.55),
rgba(255,255,255,0)
);
pointer-events:none;
}

.account-ring i{
font-size:20px;
color:var(--green-dark);
z-index:2;
}

/* ===== MOBILE FOOTER ===== */
@media(max-width:768px){
.app-footer{
position:fixed;
bottom:0;
left:0;
right:0;
}
}

/* ===== DESKTOP FOOTER (Fixed) ===== */
@media(min-width:769px){
  .app-footer {
    position: fixed;
    bottom: 0;
    left: 0;       /* এটি নিশ্চিত করুন */
    right: 0;      /* এটি নিশ্চিত করুন */
    width: 100%;
    height: 60px;
    z-index: 10000; /* এখানে মান বাড়িয়ে দিন যাতে সবার উপরে থাকে */
    background: #111;
    display: flex !important; /* নিশ্চিত করুন এটি ফ্লেক্স হিসেবে আছে */
    align-items: center;
    justify-content: space-around;
  }
}

/* অন্যান্য CSS কোড ঠিক আছে... */


/* ===== PANEL BASE ===== */
.panel-overlay{
position:fixed;
inset:0;
display:none;
z-index:1000;
}
.panel-overlay.show{display:flex}

/* ===== DESKTOP SIDE PANEL ===== */
.panel-overlay.side{
justify-content:flex-end;
align-items:flex-start;
background:rgba(0,0,0,.4);
padding:90px 16px 16px;
}

.panel{
width:320px;
max-width:100%;
background:var(--panel);
border-radius:15px;
padding:15px;
box-sizing:border-box;

}

@keyframes slideRight{
from{transform:translateX(30px);opacity:0}
to{transform:translateX(0);opacity:1}
}

#searchPanel .panel{
animation:slideRight .25s ease;
}

/* ===== MOBILE PANELS (BOTTOM SHEET ABOVE FOOTER) ===== */
@media(max-width:768px){
.panel-overlay.side {
justify-content: center;
align-items: stretch;  /* 'flex-start' এর বদলে 'stretch' দিন */

background: rgba(0,0,0,.55);
padding-bottom: 0px; /* এখানে আগে ৬৬ পিক্সেল ছিল, এটি ০ করে দিন */
}

.panel { background: transparent; /* কালো ভাব দূর হবে */ width: 100%; height: 100%; /* প্যানেলকে পুরো স্ক্রিন জুড়ে রাখার জন্য */ border-radius: 0; /* ফুল স্ক্রিন হলে উপরের রেডিয়াস দরকার নেই */ padding: 0px; animation: slideUp .25s ease; } /* 🔥 ONLY search panel: bottom slide off */ #searchPanel .panel{ animation: none !important; transform: none !important; } @keyframes slideUp{ from{transform:translateY(100%)} to{transform:translateY(0)} } 

}

/* ===== PANEL CONTENT ===== */
.panel-header{
display:flex;
justify-content:space-between;
align-items:center;
color:#fff;
margin-bottom:12px;
}
.panel-header i{cursor:pointer}

.search-input{
width:100%;
padding:12px 14px;
border-radius:12px;
border:none;
background:#1c1c1c;
color:#fff;
font-size:14px;
box-sizing:border-box;
}
.search-input::placeholder{color:#888}

/* ===== MENU ===== */

.menu-overlay{
position:fixed;
inset:0;
z-index:1000;

display:flex; /* 🔥 সবসময় DOM এ থাকবে */ visibility:hidden; opacity:0; pointer-events:none; transition: opacity .25s ease; 

}

.menu-overlay.show{
visibility:visible;
opacity:1;
pointer-events:auto;
}

/* DESKTOP MENU */
.menu-overlay.desktop{
justify-content:flex-end;
align-items:flex-start;
background: rgba(0,0,0,.55);
padding:90px 16px;
}

/* MOBILE MENU (ABOVE FOOTER) */
.menu-overlay.mobile{
justify-content:center;
align-items:flex-end;
background: rgba(0,0,0,.55);
padding-bottom:66px; /* 🔥 footer gap */
}

.menu-box{
width:260px;
background:#181818;
border-radius:18px;
padding:16px;
animation: none; /* 🔥 desktop jump বন্ধ */
}

@media(max-width:768px){
.menu-box{
animation: slideUp .25s ease;
}
}

.menu-header{
display:flex;
justify-content:space-between;
align-items:center;
color:#fff;
margin-bottom:10px;
}

.menu-item{
display:flex;
align-items:center;
gap:12px;
padding:12px;
border-radius:12px;
color:#ddd;
cursor:pointer;
}
.menu-item i{color:var(--green)}
.menu-item:hover{
background:var(--green);
color:#000;
}
.menu-item:hover i{color:#000}
`;
document.head.appendChild(style);

const searchPanelHTML = `
<div class="panel-overlay side" id="searchPanel">
  <div class="panel search-panel">

    <div class="search-bar">
      <!-- 🔹 LOGO -->
      <div class="search-logo">
        <img src="https://i.postimg.cc/2j12z04x/hridoytv_logo_v.png" />
      </div>

      <!-- 🔹 INPUT -->
      <input class="search-input" placeholder="Search channel..." />

      <!-- 🔹 CLEAR -->
      <button class="search-clear" title="Clear">
        <i class="fa-solid fa-eraser"></i>
      </button>

      <!-- 🔹 CLOSE -->
      <button class="search-close" onclick="closePanel('searchPanel')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- 🔽 RESULTS -->
    <div class="search-results" id="searchResults"></div>

  </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", searchPanelHTML);

/* ================= HTML ================= */
const footerHTML = `
<div class="app-footer">
<div class="footer-item" id="homeBtn">
  <i class="fa-solid fa-house"></i>
  <span>Home</span>
</div>

  <div class="footer-item" id="searchBtn">
    <i class="fa-solid fa-magnifying-glass"></i>
    <span>Search</span>
  </div>

  <a href="account.html" class="footer-item footer-account">
    <div class="account-ring">
      <i class="fa-solid fa-user"></i>
    </div>
  </a>

  <div class="footer-item" id="favBtn">
    <i class="fa-solid fa-heart"></i>
    <span>Favs</span>
  </div>

  <div class="footer-item" id="menuBtn">
    <i class="fa-solid fa-bars"></i>
    <span>Menu</span>
  </div>
</div>

<div class="menu-overlay" id="menuOverlay">
  <div class="menu-box">

    <div class="menu-header">
      <span>Menu</span>
      <i class="fa-solid fa-xmark" onclick="closeMenu()"></i>
    </div>

    <div class="menu-item">
      <i class="fa-solid fa-gear"></i>
      <span>Settings</span>
    </div>

    <div class="menu-item">
      <i class="fa-solid fa-headset"></i>
      <span>Support</span>
    </div>

    <div class="menu-item">
      <i class="fa-solid fa-circle-info"></i>
      <span>About</span>
    </div>

    <div class="menu-item">
      <i class="fa-solid fa-right-from-bracket"></i>
      <span>Logout</span>
    </div>

  </div>
</div>
`;   // ✅ 🔥 এই backtick + semicolon MUST


/* INSERT ABOVE TAB */
document.body.insertAdjacentHTML("beforeend", footerHTML);

const searchBtn = document.getElementById("searchBtn");
const favBtn = document.getElementById("favBtn");
const menuBtn = document.getElementById("menuBtn");
// ✅ এই লাইনটা যোগ করো
const homeBtn = document.getElementById("homeBtn");

// 🔹 HOME BUTTON ধরলাম


// 🔹 PAGE LOAD এ HOME ACTIVE
homeBtn.classList.add("active");
lastActiveFooter = homeBtn;

/* ================= JS ================= */
window.closePanel = id => {
  const panel = document.getElementById(id);
  panel?.classList.remove("show");

  document.body.classList.remove("search-open");
  if (id !== "searchPanel") return;

  const input = document.querySelector("#searchPanel .search-input");
  const hadSearchEmpty = !!document.getElementById("searchEmptyState");

  // 🔹 যদি search result থেকে channel ক্লিক করা হয়ে থাকে
  if (searchSelectionMade) {
    searchSelectionMade = false;
    isSearchMode = false;

    restoreFooterActive();
    restorePlayingHighlight();
    return;
  }

  // 🔹 যদি search empty state ছিল
  if (hadSearchEmpty) {
  
    if (!isDesktop) {
  document.querySelectorAll(".channel-grid")
    .forEach(g => g.classList.remove("active"));
}

    document.getElementById(lastActiveCategory)
      ?.classList.add("active");

    showAllChannels();
    removeSearchEmptyState();

    isSearchMode = false;
    restoreFooterActive();
    restorePlayingHighlight();
    return;
  }

  // 🔹 যদি input এ লেখা ছিল কিন্তু select করা হয়নি
  if (input && input.value.trim() !== "") {
    isSearchMode = false;

    restoreFooterActive();
    restorePlayingHighlight();
    return;
  }

  // 🔹 যদি কিছুই লেখা না থাকে (DEFAULT CASE)
 if (!isDesktop) {
  document.querySelectorAll(".channel-grid")
    .forEach(g => g.classList.remove("active"));
}

  document.getElementById(lastActiveCategory)
    ?.classList.add("active");

  showAllChannels();

  isSearchMode = false;
  restoreFooterActive();
  restorePlayingHighlight();
};

// end 


window.closeMenu = () => {
document.getElementById("menuOverlay")?.classList.remove("show");
restoreFooterActive();
};

searchBtn.onclick = () => {
// ✅ আগের selected search থাকলে সেটা ধরে রাখো
  if (isSearchMode) {
    lastActiveFooter = searchBtn;
  }
  
lastActiveCategory = "cat_8";
removeSearchEmptyState();
// 🔥 search panel open হলে সব tab off
document.querySelectorAll(".tab-btn")
  .forEach(tab => tab.classList.remove("active"));
  
removeCategoryEmptyState();

// 🔥 FAV MODE OFF
isFavMode = false;

// 🔥 সব grid off
if (!isDesktop) {
  document.querySelectorAll(".channel-grid")
    .forEach(g => g.classList.remove("active"));
}
  
  // ✅ ACTIVE CATEGORY GRID BACK
document.getElementById(lastActiveCategory)
  ?.classList.add("active");

// ✅ সব channel দেখাও
showAllChannels();



 

  lastActiveFooter = document.querySelector(".app-footer .footer-item.active");
  lastViewMode = favBtn.classList.contains("active") ? "fav" : "all";



  clearFooterActive();
  searchBtn.classList.add("active");
  favBtn.classList.remove("active");

  isFavMode = false;
  document.body.classList.add("search-open");

  const p = document.getElementById("searchPanel");
  p.classList.add("show");



  const input = p.querySelector(".search-input");

  setTimeout(() => {
    input?.focus();
    if (input && input.value.trim() !== "") {
      runSearch(); // এখন fresh list থেকে search হবে
    }
  }, 150);
};


favBtn.onclick = () => {
// 🔥 Home এ থাকলে তার স্ক্রল মনে রাখি
if (lastViewMode === "home") {
  saveScroll("home");
}

  // ✅ যদি Favs আগেই active থাকে → শুধু top
  if (favBtn.classList.contains("active")) {
    document.querySelector(".channel-container")
      ?.scrollTo({ top: 0, behavior: "smooth" });
    return; // ⛔ নিচের কোড চলবে না
  }



  lastClickedTab = null;
  clearTabActive();
  removeSearchEmptyState();
  removeCategoryEmptyState();

  lastActiveFooter = favBtn;
  lastViewMode = "fav";

  clearFooterActive();
  favBtn.classList.add("active");

  showFavChannelsInGrid();
  restorePlayingHighlight();
  
  requestAnimationFrame(() => {
  restoreScroll("favs");
});
};

menuBtn.onclick = () => {

lastActiveFooter = document.querySelector(".app-footer .footer-item.active"); 

clearFooterActive(); menuBtn.classList.add("active"); const m = document.getElementById("menuOverlay"); 

// 🔥 আগে device class
m.classList.toggle("mobile", window.innerWidth <= 768);
m.classList.toggle("desktop", window.innerWidth > 768);

// 🔥 তারপর 
requestAnimationFrame(() => {
    m.classList.add("show");
});

};

document.getElementById("menuOverlay")?.addEventListener("click", e => {
  if (e.target.id === "menuOverlay") {
    closeMenu();
  }
});

homeBtn.onclick = () => {

  // ১. আগের view (যেমন Sports বা Favs) এর স্ক্রল পজিশন সেভ করে রাখি
  if (lastViewMode === "cat") {
    saveScroll("cat", lastActiveCategory);
  } else if (lastViewMode === "fav") {
    saveScroll("favs");
  } else {
    saveScroll("home");
  }
  
  // ২. যদি Home ইতিমধ্যেই active থাকে, তবে শুধু smooth scroll করে উপরে যাবে
  if (homeBtn.classList.contains("active") && lastActiveCategory === "cat_0") {
    document.querySelector(".channel-container")
      ?.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  /* ================= RESET STATES ================= */
  searchSelectionMade = false;
  isSearchMode = false;
  isFavMode = false;

  removeSearchEmptyState();
  removeFavEmptyState();
  removeCategoryEmptyState();

  /* ================= FOOTER UPDATE ================= */
  clearFooterActive();
  homeBtn.classList.add("active");
  lastActiveFooter = homeBtn;

  /* ================= TAB RESET & POPULAR ACTIVE ================= */
  // সব ট্যাব থেকে active ক্লাস সরিয়ে দিচ্ছি
  document.querySelectorAll(".tab-btn").forEach(tab => tab.classList.remove("active"));

  // 'cat_0' বা Popular ট্যাবটি খুঁজে বের করে active করছি
  const popularTab = [...document.querySelectorAll(".tab-btn")]
    .find(tab => 
      (tab.getAttribute("onclick") || "").includes("'cat_0'") || 
      tab.dataset.target === "cat_0"
    );

  if (popularTab) {
    popularTab.classList.add("active");
  }

  /* ================= GRID RESET ================= */
  // সব গ্রিড বন্ধ করে শুধু Popular গ্রিড (cat_0) চালু করছি
  document.querySelectorAll(".channel-grid").forEach(grid => grid.classList.remove("active"));

  const popularGrid = document.getElementById("cat_0");
  if (popularGrid) {
    popularGrid.classList.add("active");
    // নিশ্চিত করছি যেন ওই গ্রিডের সব চ্যানেল দৃশ্যমান থাকে
    popularGrid.querySelectorAll(".channel-card").forEach(card => card.style.display = "");
  }

  /* ================= STATE & SCROLL UPDATE ================= */
  lastViewMode = "home";
  lastActiveCategory = "cat_0"; // এখানে 'cat_0' সেট করে দেওয়া হলো

  requestAnimationFrame(() => {
    // হোম এর সেভ করা স্ক্রল পজিশনে ফিরে যাবে (অথবা একদম উপরে)
    restoreScroll("home");
  });
};

// হোম end

// সার্চ

/* ================= SEARCH RESULT + HIGHLIGHT ================= */
const searchInput = document.querySelector("#searchPanel .search-input");
const searchResults = document.getElementById("searchResults");

function highlightText(text, query) {
const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const regex = new RegExp(`(${safe})`, "ig");
return text.replace(regex, `<span class="search-highlight">$1</span>`);
}

/* 🔥 এখানেই বসাবে */
function normalizeBangla(text) {
return text
.replace(/য়/g, "য়")
.replace(/ড়/g, "ড়")
.replace(/ঢ়/g, "ঢ়")
.trim();
}

/* ================= ONLY runSearch FUNCTION ================= */

function runSearch() {
let seenChannelIds = new Set();
searchSelectionMade = false;
const searchGrid = document.getElementById("search_grid");

// 🔴 সব grid বন্ধ
if (!isDesktop) {
  document.querySelectorAll(".channel-grid")
    .forEach(g => g.classList.remove("active"));
}

// 🟢 শুধু search grid চালু
searchGrid.classList.add("active");
searchGrid.innerHTML = "";

removeFavEmptyState(); // 🔥 ALWAYS


// 🔥 SEARCH শুরু মানেই fav mode OFF
isFavMode = false;
favBtn.classList.remove("active");
const query = normalizeBangla(
searchInput.value.toLowerCase()
);

// 🔹 ইনপুট খালি হলে
if (!query) {

  // 🔥 search grid off
  document.getElementById("search_grid")
    ?.classList.remove("active");

  // 🔥 আগের category grid on
  document.getElementById(lastActiveCategory)
    ?.classList.add("active");

  showAllChannels();

  searchResults.innerHTML = "";
  searchResults.classList.remove("show");
  return;
}

 // 🔹 রেজাল্ট বক্স দেখানো
  requestAnimationFrame(() => { searchResults.classList.add("show"); }); searchResults.innerHTML = ""; let found = false; let matchedCards = []; 
  // 🔹 চ্যানেল সার্চ
   document.querySelectorAll(".channel-card").forEach(card => { 
   const channelId = card.dataset.id;
if (!channelId) return;

// ❌ যদি এই channel আগেই পাওয়া যায়, skip
if (seenChannelIds.has(channelId)) return;

   const img = card.querySelector("img"); if (!img || !img.alt) return;   const name = normalizeBangla(img.alt.toLowerCase());
       


const keywords = normalizeBangla(
  (window.SEARCH_KEYWORDS?.[channelId] || "").toLowerCase()
);
        
        const searchableText = name + " " + keywords; if (searchableText.includes(query)) {
        seenChannelIds.add(channelId);
         found = true; matchedCards.push(card); 
                
       const number = getChannelNumber(channelId);
       
        const item = document.createElement("div"); item.className = "search-item";
        item.dataset.id = channelId;   // ✅ এই লাইনটা এখানে বসাবে
         item.innerHTML = `
  <img src="${img.src}">
  ${number ? `<span class="search-number">${String(number).padStart(2,"0")}</span>` : ""}
  <span>${highlightText(img.alt, query)}</span>
`;
      
      
      item.onclick = () => {
      // ✅ কোন channel select হয়েছে মনে রাখছি
  lastSelectedSearchId = channelId;
let selectedClone = null;
  // 🔥 MODE RESET
  searchSelectionMade = true;
  isSearchMode = true;
  isFavMode = false;
  lastViewMode = "all";

  favBtn.classList.remove("active");

  // 🔥 EMPTY STATE REMOVE
  removeFavEmptyState();
  removeCategoryEmptyState();

  // 🔥 সব tab off
  document.querySelectorAll(".tab-btn")
    .forEach(tab => tab.classList.remove("active"));

  // 🔥 সব grid off
  document.querySelectorAll(".channel-grid")
    .forEach(grid => grid.classList.remove("active"));

  // 🔥 শুধু SEARCH GRID on
  const searchGrid = document.getElementById("search_grid");
  searchGrid.classList.add("active");
  searchGrid.innerHTML = "";

  // 🔥 সব matched channel clone করে দেখাও
  matchedCards.forEach(originalCard => {
    const clone = originalCard.cloneNode(true);

    clone.onclick = () => { currentPlayingChannelId = originalCard.dataset.id; // 🔥 এই লাইন MUST
      loadChannel(originalCard.dataset.id, clone);
    };
    
// ⭐ এই লাইন ২টা নতুন
  if (originalCard === card) {
    selectedClone = clone;
  }
  
    searchGrid.appendChild(clone);
  });

if (selectedClone) { currentPlayingChannelId = channelId;
  loadChannel(card.dataset.id, selectedClone);
}

requestAnimationFrame(() => {
  setTimeout(() => {
    scrollToSelectedSearchResult();
    closePanel("searchPanel"); // 🔥 scroll এর পরে close
  }, 80);
});

lastActiveFooter = searchBtn;};

 searchResults.appendChild(item); } }); 
 
 
if (found) {
removeSearchEmptyState();
  matchedCards.forEach(originalCard => {
    const clone = originalCard.cloneNode(true);

    clone.onclick = () => { currentPlayingChannelId = channelId;
      loadChannel(originalCard.dataset.id, clone);
    };
    
  

    searchGrid.appendChild(clone);
  });
} else {

  // 🔥 SEARCH PANEL এর নিচে empty দেখাও
  searchResults.innerHTML = `
    <div class="search-empty-box">
      No channel found
    </div>
  `;
  searchResults.classList.add("show");
  showSearchEmptyState();
  
}


} // 🔴 runSearch() এর END
searchInput.addEventListener("input", runSearch);

function showAllChannels() {

  removeSearchEmptyState();
  removeFavEmptyState();

  document.getElementById("fav_grid")
    ?.classList.remove("active");

  document.querySelectorAll(".channel-card").forEach(card => {
    card.style.display = "";
  });

} // ✅ showAllChannels এখানেই শেষ

// favs highlight 

function showFavChannelsInGrid() {
  const favGrid = document.getElementById("fav_grid");
  if (!favGrid) return;

  favGrid.innerHTML = "";

  // 🔥 fav mode on
  isFavMode = true;

  // 🔥 সব grid off
if (!isDesktop) {
  document.querySelectorAll(".channel-grid")
    .forEach(g => g.classList.remove("active"));
}

  // 🔥 fav grid on
  favGrid.classList.add("active");

  

// 🔥 favChannels array ব্যবহার করবো
if (!window.favChannels || favChannels.length === 0) {
  showFavEmptyState();
  return;
}

removeFavEmptyState();

favChannels.forEach(id => {
  const originalCard = document.querySelector(
    `.channel-card[data-id="${id}"]`
  );
  if (!originalCard) return;

  const clone = originalCard.cloneNode(true);
  clone.classList.remove("active");

  clone.onclick = () => {
    currentPlayingChannelId = id;
    loadChannel(id, originalCard);
    restorePlayingHighlight();
  };

  favGrid.appendChild(clone);
});

  // 🔥 fav এ ঢুকলেই playing highlight দেখাও
  restorePlayingHighlight();
}



function showOnlyMatchedChannels(matchedCards) {
document.querySelectorAll(".channel-card").forEach(card => {
card.style.display = "none";
});

matchedCards.forEach(card => { card.style.display = ""; }); 

}

// ক্লিয়ার বাটন + টেক্সট

/* ================= CLEAR BUTTON (CHAR / FULL CLEAR) ================= */
const clearBtn = document.querySelector(".search-clear");
const searchInputField = document.querySelector("#searchPanel .search-input");

let pressTimer = null;
let isLongPress = false;

if (clearBtn && searchInputField) {

const startPress = (e) => { e.stopPropagation(); isLongPress = false; pressTimer = setTimeout(() => { 
// ⏱️ LONG PRESS → FULL CLEAR
 isLongPress = true; searchInputField.value = ""; runSearch(); }, 500); }; const endPress = (e) => { e.stopPropagation(); clearTimeout(pressTimer); 
 // 👆 SINGLE TAP → REMOVE LAST CHARACTER
  if (!isLongPress) { const val = searchInputField.value; if (val.length > 0) { searchInputField.value = val.slice(0, -1); searchInputField.focus(); runSearch(); } } }; 
  // 📱 Mobile
   clearBtn.addEventListener("touchstart", startPress); clearBtn.addEventListener("touchend", endPress); 
   // 🖥️ Desktop
    clearBtn.addEventListener("mousedown", startPress); clearBtn.addEventListener("mouseup", endPress); 

}

// সার্চ

const footer = document.querySelector(".app-footer");
const tg = document.querySelector(".tg-wrapper");

let initialHeight = window.innerHeight;

const isMobile = () =>
/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

window.addEventListener("resize", () => {
if (!isMobile()) return; // 👉 Desktop এ কিছুই করবে না

const h = window.innerHeight; if (h < initialHeight * 0.75) { document.body.classList.add("keyboard-open"); } else { document.body.classList.remove("keyboard-open"); } 

});


// হেল্পার

function clearFooterActive() {
document
.querySelectorAll(".app-footer .footer-item")
.forEach(i => i.classList.remove("active"));
}

function restoreFooterActive() {
clearFooterActive();
if (lastActiveFooter) {
lastActiveFooter.classList.add("active");
}
}

// 🔥 MOBILE: search bar ছাড়া যেকোনো জায়গায় ক্লিক করলে close
document.addEventListener("click", (e) => {
  const panel = document.getElementById("searchPanel");
  if (!panel || !panel.classList.contains("show")) return;

  // 🔥 CATEGORY TABS (index.html) → ignore
  if (e.target.closest(".tab-wrapper")) return;
  if (e.target.closest(".tab-btn")) return;

  // 🔥 FOOTER → ignore
  if (e.target.closest(".app-footer")) return;

  // 🔥 SEARCH BUTTON → ignore
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn && searchBtn.contains(e.target)) return;

  const searchBar = panel.querySelector(".search-bar");
  const searchResults = panel.querySelector(".search-results");

  // 🔥 SEARCH BAR / RESULTS এর বাইরে ক্লিক হলে close
  if (
    !searchBar.contains(e.target) &&
    !searchResults.contains(e.target)
  ) {
    closePanel("searchPanel");
  }
});



// ❌ সার্চ এম্পটি স্টেট

window.showCategoryEmpty = function (catId) {
  removeCategoryEmptyState();

  const grid = document.getElementById(catId);
  if (!grid) return;

  const cards = grid.querySelectorAll(".channel-card");

  if (cards.length === 0) {
    const div = document.createElement("div");
    div.id = "categoryEmptyState";
    div.className = "fav-empty-state";
    div.innerHTML = `
      <i class="fa-solid fa-tv"
         style="color:#777;font-size:18px"></i>
      <span>No channel in this category</span>
    `;
    document.querySelector(".channel-container")?.prepend(div);
  }
};
// ❤️ FAV EMPTY STATE (GLOBAL)

window.showFavEmptyState = function () {
const old = document.getElementById("favEmptyState");
if (old) old.remove();

const div = document.createElement("div"); div.id = "favEmptyState"; div.className = "fav-empty-state"; div.innerHTML = ` <i class="fa-solid fa-heart-crack" style="color:#ff5a5a;font-size:18px"></i> <span>No favourite channel</span> `; document.querySelector(".channel-container") ?.prepend(div); }; 

// 🔍 SEARCH EMPTY STATE (CONTAINER)
window.showSearchEmptyState = function () {
  const old = document.getElementById("searchEmptyState");
  if (old) old.remove();

  const div = document.createElement("div");
  div.id = "searchEmptyState";
  div.className = "fav-empty-state"; // fav এর মতোই style
  div.innerHTML = `
    <i class="fa-solid fa-magnifying-glass"
       style="color:#777;font-size:18px"></i>
    <span>No channel found</span>
  `;

  document.querySelector(".channel-container")
    ?.prepend(div);
};

window.removeSearchEmptyState = function () {
  const el = document.getElementById("searchEmptyState");
  if (el) el.remove();
};

// cat empty 

window.removeFavEmptyState = function () {
const empty = document.getElementById("favEmptyState");
if (empty) empty.remove();
};

window.removeCategoryEmptyState = function () {
  const el = document.getElementById("categoryEmptyState");
  if (el) el.remove();
};


// ===== INITIAL CATEGORY BOOTSTRAP =====
const initGrid = document.getElementById(lastActiveCategory);
if (initGrid) {
  initGrid.classList.add("active");
}

// initial empty check
showCategoryEmpty(lastActiveCategory);

// highlight ধরে থাকবে

function restorePlayingHighlight() {
  if (!currentPlayingChannelId) return;

  // সব জায়গা থেকে active সরাও
  document.querySelectorAll(".channel-card")
    .forEach(card => card.classList.remove("active"));

  // যেখানেই থাকুক (home / fav / search) সব matching card active করো
  document.querySelectorAll(
    `.channel-card[data-id="${currentPlayingChannelId}"]`
  ).forEach(card => {
    card.classList.add("active");
  });
}

// tab reset
function clearTabActive() {
  document.querySelectorAll(".tab-btn")
    .forEach(tab => tab.classList.remove("active"));
}



// auto search results 
function scrollToSelectedSearchResult() {
  if (!lastSelectedSearchId) return;

  const grid = document.getElementById("search_grid");
  if (!grid) return;

  const target = grid.querySelector(
    `.channel-card[data-id="${lastSelectedSearchId}"]`
  );
  if (!target) return;

  // 🔥 কোনটা আসলে scroll হচ্ছে detect
  const scrollContainer =
    grid.closest(".channel-container") || grid;
grid.offsetHeight; // 🔥 force reflow
  const top =
    target.getBoundingClientRect().top -
    scrollContainer.getBoundingClientRect().top +
    scrollContainer.scrollTop -
    20;

  // 🔥 smooth scroll
  scrollContainer.scrollTo({
    top,
    behavior: "smooth"
  });

  // 🔥 FLASH EFFECT
  target.classList.add("search-flash");
  setTimeout(() => {
    target.classList.remove("search-flash");
  }, 1200);
}


// scroll top 


function activateTabByCategory(catId) {
  // সব tab off
  document.querySelectorAll(".tab-btn")
    .forEach(tab => tab.classList.remove("active"));

  // index.html এর onclick="openTab(event,'cat_x')" থেকে
  // catId match করা tab বের করি
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    const onClick = tab.getAttribute("onclick") || "";
    if (onClick.includes(`'${catId}'`)) {
      tab.classList.add("active");
    }
  });
}
// end

});




