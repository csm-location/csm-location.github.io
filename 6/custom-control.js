/* ==================================================
   HRIDOYTV – SMART BUFFERING PLAYER (FIXED)
================================================== */

const tvVideo = document.getElementById("tvPlayer");

if (tvVideo) {
  /* ---------- Font Awesome (CDN) ---------- */
  if (!document.getElementById("fa-css")) {
    const fa = document.createElement("link");
    fa.id = "fa-css";
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(fa);
  }

  /* ---------- CSS ---------- */
  const style = document.createElement("style");
  style.innerHTML = `
  
 /* ===== FULLSCREEN FIX ===== */
.tv-wrap:fullscreen {
  width: 100vw;
  height: 100vh;
}

/* 🔓 Fullscreen এ click allow */
.tv-wrap:fullscreen,
.tv-wrap:fullscreen video {
  pointer-events: auto;
}

.tv-wrap:fullscreen #tvPlayer {
  width: 100%;
  height: 100%;
  object-fit: contain; /* চাইলে cover দিতে পারো */
}

.tv-wrap:fullscreen .tv-bottom {
  bottom: 0;
}

.tv-wrap:fullscreen .tv-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
} 
  
    .tv-wrap { position: relative; width: 100%; background: #000; overflow: hidden; cursor: pointer; }
    #tvPlayer { width: 100%; display: block; }
    #tvPlayer::-webkit-media-controls { display: none !important; }

    /* CENTER UI (Ring + Play Button) */
    .tv-center {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 100px; height: 100px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 10; 
      opacity: 1; 
      transition: opacity 0.2s ease;
    pointer-events: auto;
      background: radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
   
    }

    /* Realtime Progress Ring */
    .tv-ring { 
    box-shadow:
    inset 0 0 12px rgba(0,0,0,0.8),
    0 0 18px rgba(0,255,102,0.4);
    
    pointer-events: none;
      position: absolute; inset: 0;
      border-radius: 50%;
      background: conic-gradient(#00ff66 0deg, rgba(255,255,255,0.1) 0deg);
      mask: radial-gradient(transparent 55%, black 56%);
      -webkit-mask: radial-gradient(transparent 55%, black 56%);
    }

    /* Center Icon (Play/Pause/Loading) */
    .tv-play-btn {
    text-shadow:
    0 2px 6px rgba(0,0,0,0.9),
    0 0 15px rgba(0,255,102,0.6);
      position: relative; z-index: 2;
      width: 50px; height: 50px; border-radius: 50%;
      color: #00ff66;
      display: flex; align-items: center; justify-content: center;
      font-size: 30px;
      text-shadow: 0 0 10px rgba(0,0,0,0.8);
    }
    
    /* লোডিং আইকন ঘোরানোর জন্য */
    .fa-spin-fast { animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    /* Percentage Text */
    .tv-percent {
      position: absolute; bottom: 20px;
  pointer-events: none;    color: #fff; font-family: monospace;
      font-size: 12px; font-weight: bold; z-index: 5;
   background: rgba(0, 0, 0, 0.45);   /* 🔥 কালো ব্যাক */
  padding: 0px 5px;
  border-radius: 5px;
  
  text-shadow:
    0 2px 4px rgba(0,0,0,1),
    0 0 8px rgba(0,255,102,0.7);

  box-shadow:
    0 2px 6px rgba(0,0,0,0.8),
    inset 0 0 6px rgba(0,0,0,0.6);
    }

/* % fade animtion */

.tv-percent {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.tv-percent.hide {
  opacity: 0;
  transform: translateY(6px); /* একটু নিচে নামতে নামতে হাইড */
}

    /* BOTTOM BAR */
    .tv-bottom {
      position: absolute; bottom: 0; left: 0; width: 100%;
      height: 60px;
      background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
      display: flex; align-items: center; padding: 0 20px;
      box-sizing: border-box; gap: 15px; z-index: 20;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .tv-bottom.hide { opacity: 0; transform: translateY(100%); pointer-events: none; }

    .tv-time { font-size: 14px; color: #fff; font-family: sans-serif; min-width: 90px; text-shadow: 0 1px 2px #000; }
    .tv-right { margin-left: auto; display: flex; align-items: center; gap: 15px; }
    
    .tv-volume { display: flex; align-items: center; position: relative; z-index: 30;}
    .tv-volume input { width: 80px; cursor: pointer; accent-color: #00ff66; height: 4px; }
    
    .tv-bottom button {
      background: none; border: none; color: #fff;
      font-size: 18px; cursor: pointer; transition: 0.2s; padding: 5px;
    }
    .tv-bottom button:hover { color: #00ff66; transform: scale(1.1); }
  `;
  document.head.appendChild(style);

  /* ---------- Create Elements ---------- */
  let wrap = tvVideo.parentElement;
  if (!wrap.classList.contains("tv-wrap")) {
    wrap = document.createElement("div");
    wrap.className = "tv-wrap";
    tvVideo.parentNode.insertBefore(wrap, tvVideo);
    wrap.appendChild(tvVideo);
  }


// 🔰 RESPONSIVE LOGO (All Screen Support)
const logo = document.createElement("img");
logo.src = "https://iili.io/qHq804R.png";
logo.style.position = "absolute";
logo.style.zIndex = "1";
logo.style.pointerEvents = "none";
logo.style.transition = "all 0.3s ease";
logo.style.opacity = "0.85";

wrap.appendChild(logo);

// 🔄 Responsive Size Function
function updateLogoSize() {

  const isFullscreen = !!document.fullscreenElement;
  const isMobile = window.innerWidth <= 768;

  if (isFullscreen) {
    // 🔵 Fullscreen
    logo.style.width = isMobile ? "120px" : "160px";
    logo.style.bottom = "20px";
    logo.style.right = "20px";
  } else {
    // 🟢 Normal Screen
    logo.style.width = isMobile ? "70px" : "80px";
    logo.style.bottom = "10px";
    logo.style.right = "10px";
  }
}

// 🔄 Run On Load
updateLogoSize();

// 🔄 Run On Resize
window.addEventListener("resize", updateLogoSize);

// 🔄 Run On Fullscreen Change
document.addEventListener("fullscreenchange", updateLogoSize);



  // Remove old elements if exists
  const oldCenter = document.getElementById("tvCenter"); if(oldCenter) oldCenter.remove();
  const oldControls = document.getElementById("tvControls"); if(oldControls) oldControls.remove();

  wrap.insertAdjacentHTML('beforeend', `
    <div class="tv-center" id="tvCenter">
      <div class="tv-ring" id="tvRing"></div>
      <div class="tv-play-btn" id="tvMidBtn"><i class="fa-solid fa-play"></i></div>
      <div class="tv-percent" id="tvPercent">0%</div>
    </div>
    <div class="tv-bottom" id="tvControls">
      <div class="tv-time" id="tvTime">00:00 / 00:00</div>
      <div class="tv-right">
        <div class="tv-volume"><input id="tvVol" type="range" min="0" max="1" step="0.05" value="1"></div>
        <button id="tvMute"><i class="fa-solid fa-volume-high"></i></button>
        <button id="tvPip"><i class="fa-solid fa-clone"></i></button>
        <button id="tvFull"><i class="fa-solid fa-expand"></i></button>
      </div>
    </div>
  `);

  /* ---------- Logic ---------- */
  const centerUI = document.getElementById("tvCenter");
  const midBtn = document.getElementById("tvMidBtn");
  const ring = document.getElementById("tvRing");
  const percentText = document.getElementById("tvPercent");
  const controls = document.getElementById("tvControls");
  const timeText = document.getElementById("tvTime");
  const volRange = document.getElementById("tvVol");
  const muteBtn = document.getElementById("tvMute");

  const togglePlay = () => {
    if (tvVideo.paused) tvVideo.play();
    else tvVideo.pause();
  };

  let hideTimer;
  let centerHideTimer;
  const showControls = () => {
    controls.classList.remove("hide");
    wrap.style.cursor = "default";

    // বাফারিং বা লোডিং না হলে এবং পজ থাকলে দেখাবে
    if (tvVideo.paused) {
        centerUI.style.opacity = "1";
    }

    clearTimeout(hideTimer);
    
    // প্লে অবস্থায় ৩ সেকেন্ড পর নিচের বার হাইড হবে
    if (!tvVideo.paused) {
      hideTimer = setTimeout(() => {
        controls.classList.add("hide");
        wrap.style.cursor = "none";
      }, 3000);
    }
  };

  const formatTime = (t) => {
      if(isNaN(t)) return "00:00";
      return new Date(t * 1000).toISOString().substr(14, 5);
  };

/* ---------- SMOOTH PROGRESS RING ---------- */
let ringStage = "idle";
let centerVisible = true;
let isLoading = false;
let smoothPercent = 0;
let fakePercent = 0;
let hasDuration = false;


let ringRAF = null;

function animateRing() {
  if (ringRAF) cancelAnimationFrame(ringRAF);

  // 🟥 FAKE STAGE (0 → random max 60)
  if (ringStage === "fake") {

    const randomStep = Math.random() * 1.2 + 0.2;
    fakePercent += randomStep;

    if (fakePercent > 60) fakePercent = 60;

    percentText.textContent = Math.floor(fakePercent) + "%";
    ring.style.background =
      `conic-gradient(#00ff66 ${fakePercent * 3.6}deg, rgba(255,255,255,0.1) 0deg)`;

    ringRAF = requestAnimationFrame(animateRing);
    return;
  }

  // 🟩 REAL STAGE (60 → 100 smooth)
  if (ringStage === "real") {

    smoothPercent += (100 - smoothPercent) * 0.18;

    percentText.textContent = Math.floor(smoothPercent) + "%";
    ring.style.background =
      `conic-gradient(#00ff66 ${smoothPercent * 3.6}deg, rgba(255,255,255,0.1) 0deg)`;

    if (smoothPercent < 99.5) {
      ringRAF = requestAnimationFrame(animateRing);
      return;
    }

    ringStage = "done";
  }

  // 🟢 DONE
  if (ringStage === "done") {

    percentText.textContent = "100%";
    ring.style.background =
      `conic-gradient(#00ff66 360deg, rgba(255,255,255,0.1) 0deg)`;

   // 100% হলে % টেক্সট ফেড হয়ে হাইড
setTimeout(() => {
  percentText.classList.add("hide");

  // তারপর পুরো center হাইড
  setTimeout(() => {
    centerUI.style.opacity = "0";
  }, 400);

}, 200);
  }
}

// ইভেন্ট 
/* ---------- SAFE CLICK LOGIC ---------- */

// শুধু মাঝের বাটনে play / pause
midBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePlay();
});

// 👉 toggle function আলাদা করি
function toggleControls() {
if (controls.classList.contains("hide")) {
  showControls();

  if (!isLoading) {
    centerVisible = true;
    centerUI.style.opacity = "1";
  }

  // ✅ ক্লিক করলে আবার auto-hide শুরু
  if (!isLoading && !tvVideo.paused) {
    clearTimeout(centerHideTimer);
    centerHideTimer = setTimeout(() => {
      centerVisible = false;
      centerUI.style.opacity = "0";
    }, 3000);
  }

} else {
  clearTimeout(hideTimer);
  controls.classList.add("hide");

  // ✅ CLICK করলে center-ও hide করো (play অবস্থায়)
  if (!isLoading && !tvVideo.paused) {
    clearTimeout(centerHideTimer);
    centerVisible = false;
    centerUI.style.opacity = "0";
  }

  wrap.style.cursor = "none";
  }
}

// ✅ FULLSCREEN এ ক্লিক করলে কন্ট্রোল শো/হাইড
// ✅ সব অবস্থায় (normal + fullscreen) ক্লিক করলে toggle
wrap.addEventListener("click", (e) => {

  // নিচের কন্ট্রোল ক্লিক হলে বাদ
  if (
    e.target.closest('.tv-bottom') ||
    e.target.closest('button') ||
    e.target.closest('input')
  ) return;

  toggleControls();
});


  // 1. PLAYING: হাইড করো সবকিছু
  tvVideo.addEventListener("playing", () => {
isLoading = false;   // 🔴 loading শেষ

  midBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

  // প্রথমে দেখাও
  centerUI.style.opacity = "1";
  centerVisible = true;
  
  // আগে পুরোনো center টাইমার বন্ধ করো
clearTimeout(centerHideTimer);

// 1.5 সেকেন্ড পর center auto-hide
centerHideTimer = setTimeout(() => {
  if (!tvVideo.paused && !isLoading) {
    centerUI.style.opacity = "0";
  }
}, 3000);


// আগে পুরোনো bottom টাইমার বন্ধ
clearTimeout(hideTimer);

// 3 সেকেন্ড পর bottom bar auto-hide
hideTimer = setTimeout(() => {
  controls.classList.add("hide");
  wrap.style.cursor = "none";
}, 5000);
  
});

  // 2. PAUSE: প্লে বাটন দেখাও
tvVideo.addEventListener("pause", () => {
 midBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
 
  clearTimeout(centerHideTimer);   // 🔴 auto-hide বন্ধ
  centerVisible = true;
  centerUI.style.opacity = "1";

  showControls();
});
 // 3. BUFFERING / WAITING: লোডার আইকন + পার্সেন্টেজ দেখাও
tvVideo.addEventListener("waiting", () => {
  isLoading = true;

  // যদি এখনো duration না আসে → fake progress চলবে (0–60%)
  if (!hasDuration) {
    fakePercent = Math.min(fakePercent, 60);
  }

  centerUI.style.opacity = "1";
  midBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin-fast"></i>';
});



  // 4. LOAD START: লোডিং এর শুরুতেও দেখাবে
tvVideo.addEventListener("loadstart", () => {
  ringStage = "fake";
  fakePercent = 0;
  smoothPercent = 60;
percentText.style.display = "block";
percentText.textContent = "0%";
percentText.classList.remove("hide");

  centerUI.style.opacity = "1";
  midBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin-fast"></i>';

  animateRing();
});

  // 5. SEEKED: বাফারিং শেষ হলে চেক করবে প্লে না পজ
  tvVideo.addEventListener("seeked", () => {
    if(tvVideo.paused) {
        midBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        centerUI.style.opacity = "1";
    } else {
        // প্লে অবস্থায় থাকলে আবার হাইড করে দেবে
        centerUI.style.opacity = "0";
    }
  });

  // TIME UPDATE & PROGRESS RING
  tvVideo.addEventListener("timeupdate", () => {
    const cur = tvVideo.currentTime;
    const dur = tvVideo.duration || 0;
    timeText.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
   });

// ended ইভেন্ট
tvVideo.addEventListener("ended", () => {
  smoothPercent = 100;
  fakePercent = 100;

  ring.style.background =
    `conic-gradient(#00ff66 360deg, rgba(255,255,255,0.1) 0deg)`;

  percentText.textContent = "100%";
});


// ফুল স্ক্রিন ফিক্স

document.addEventListener("fullscreenchange", () => {

// 🔄 Fullscreen হলে landscape করো
if (document.fullscreenElement) {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("landscape").catch(() => {});
  }
} 
// 🔙 Fullscreen থেকে বের হলে portrait
else {
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
}

  // 🔓 Fullscreen ঢুকলে
  if (document.fullscreenElement) {
    showControls();
    centerUI.style.opacity = "1";

    clearTimeout(centerHideTimer);
    centerHideTimer = setTimeout(() => {
      if (!tvVideo.paused && !isLoading) {
        centerUI.style.opacity = "0";
      }
    }, 3000);
  }

  // 🔙 Fullscreen থেকে বের হলে (IMPORTANT)
  else {
    // 🔥 কন্ট্রোল force show
    controls.classList.remove("hide");
    centerUI.style.opacity = "1";
    wrap.style.cursor = "default";

    // 🔄 পুরোনো timer reset
    clearTimeout(hideTimer);
    clearTimeout(centerHideTimer);

    // ▶️ প্লে থাকলে আবার auto-hide চালু
    if (!tvVideo.paused && !isLoading) {
      centerHideTimer = setTimeout(() => {
        centerUI.style.opacity = "0";
      }, 3000);

      hideTimer = setTimeout(() => {
        controls.classList.add("hide");
        wrap.style.cursor = "none";
      }, 4000);
    }
  }
});

// duration কল ইভেন্ট
tvVideo.addEventListener("loadedmetadata", () => {
  ringStage = "real";
});


  // Volume & Buttons
  volRange.onclick = (e) => e.stopPropagation();
  volRange.oninput = (e) => {
    tvVideo.volume = volRange.value;
    tvVideo.muted = (volRange.value == 0);
    muteBtn.innerHTML = tvVideo.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
  };
  
  muteBtn.onclick = (e) => {
    e.stopPropagation();
    tvVideo.muted = !tvVideo.muted;
    volRange.value = tvVideo.muted ? 0 : (tvVideo.volume || 1);
    muteBtn.innerHTML = tvVideo.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
  };

  document.getElementById("tvPip").onclick = (e) => { e.stopPropagation(); tvVideo.requestPictureInPicture(); };
  document.getElementById("tvFull").onclick = (e) => { e.stopPropagation(); document.fullscreenElement ? document.exitFullscreen() : wrap.requestFullscreen(); };


}
