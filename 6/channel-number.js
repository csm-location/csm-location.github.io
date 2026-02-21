// =========================
// 🔢 CHANNEL NUMBERS (MASTER)
// =========================
window.CHANNEL_NUMBERS = {

  // ===== SPORTS =====
  tsports: 101,
  tsports2: 102,
  willowsports: 106,
  ptvsports: 110,
  eurosports: 116,
  tencricket: 121,
  starsports1: 126,
  sonyten2: 131,

  // ===== NEWS =====
  starnews: 201,
  ekattortv: 206,
  somoytv: 210,
  ekhontv: 216,
  jamunatv: 221,
  independenttv: 226,

  // ===== BANGLA =====
  gtv: 301,
  atnbangla: 302,
  ntv: 303,
  deeptotv: 304,
  maasrangatv: 305,
  ekushetv: 306,

  // ===== KIDS =====
  cartoonnetwork: 401,
  cartoonnetworkhd: 402,
  sonyyay: 403,
  discoverykids: 404,
  pbskids: 405,

  // ===== MOVIES =====
  jiocinema: 501,

  // ===== ISLAMIC =====
  madanichannelbangla: 601,
  peacetvbangla: 602,
  rtvislam: 603,
  madinalive: 604
};

// =========================
// ⭐ PRO CHANNELS
// =========================
window.PRO_CHANNELS = [
  "tsports",
  "willowsports",
  "starsports1",
  "sonyten2",
  "discoverykids"
];

// =========================
// 🔴 CHANNEL DISABLE SYSTEM
// true = OFF
// =========================
window.CHANNEL_DISABLED = {
  // উদাহরণ:
  // tsports: true
};

// =========================
// 🔧 HELPERS (SAFE)
// =========================

// 🔢 Channel number getter
window.getChannelNumber = function (channelId) {
  return window.CHANNEL_NUMBERS?.[channelId] ?? "";
};

// ⭐ Pro checker
window.isProChannel = function (channelId) {
  return Array.isArray(window.PRO_CHANNELS)
    ? window.PRO_CHANNELS.includes(channelId)
    : false;
};

// 🔴 Enable / Disable checker (🔥 SAFE DEFAULT)
window.isChannelEnabled = function (channelId) {

  // যদি explicitly disable করা থাকে
  if (
    window.CHANNEL_DISABLED &&
    Object.prototype.hasOwnProperty.call(
      window.CHANNEL_DISABLED,
      channelId
    )
  ) {
    return window.CHANNEL_DISABLED[channelId] !== true;
  }

  // 🔥 default: ENABLED
  return true;
};