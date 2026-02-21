// ================================
// 🔥 SAFE CHANNEL RENDER SYSTEM
// Desktop + Mobile Compatible
// ================================

window.renderCategory = function (category, containerId) {

  const grid = document.getElementById(containerId);
  if (!grid) {
    console.warn("❌ Grid not found:", containerId);
    return;
  }

  // 🔥 Clear old content
  grid.innerHTML = "";

  const list = window.categoryChannels?.[category] || [];

  // 🔹 empty count (footer/search uses this)
  grid.dataset.count = list.length;

  // =========================
  // 🔁 Render Cards
  // =========================
  list.forEach((ch) => {

    // 🔴 MASTER DISABLE CHECK (SAFE)
    if (typeof isChannelEnabled === "function") {
      if (!isChannelEnabled(ch.id)) return;
    }

    const card = document.createElement("div");
    card.className = "channel-card item-box";

    // ⭐ MUST for fav/search/highlight
    card.dataset.id = ch.id;

    // 🔍 search keywords
    card.dataset.keywords =
      (window.SEARCH_KEYWORDS?.[ch.id] || "").toLowerCase();

    // ▶️ play handler
    card.onclick = () => {
      if (typeof loadChannel === "function") {
        loadChannel(ch.id, card);
      }
    };

    // 🔢 channel number
    const number =
      typeof getChannelNumber === "function"
        ? getChannelNumber(ch.id)
        : "";

    // ⭐ pro badge
    const isPro =
      typeof isProChannel === "function"
        ? isProChannel(ch.id)
        : false;

    // =========================
    // 🧱 Card HTML
    // =========================
    card.innerHTML = `
      ${number ? `
        <span class="channel-number">
          ${String(number).padStart(2, "0")}
        </span>
      ` : ""}

      ${isPro ? `
        <span class="pro-icon" title="PRO Channel">
          <i class="fa-solid fa-crown"></i>
        </span>
      ` : ""}

      <div class="inner-card">
        <img src="${ch.logo}" alt="${ch.name}">
      </div>

      <div class="playing-indicator">
        <img src="https://iili.io/fmraLEg.webp" alt="Playing">
      </div>
    `;

    grid.appendChild(card);
  });

  // =========================
  // 🔥 CRITICAL FIX
  // Ensure at least one grid visible
  // =========================
  requestAnimationFrame(() => {

    const hasActiveGrid =
      document.querySelector(".channel-grid.active");

    // 👉 যদি কোনো grid active না থাকে
    if (!hasActiveGrid) {
      grid.classList.add("active");
    }

    // 👉 Desktop browsers sometimes need force
    if (window.innerWidth >= 769) {
      grid.style.display = "grid";
    }
  });
};