/* =========================
   AUTO UPDATE GITHUB IPTV
   PLAYLIST-LOCK VERSION
========================= */

/* =========================
   GITHUB PLAYLIST LIST
========================= */

const GITHUB_PLAYLISTS = {
  ForHttp:
"https://raw.githubusercontent.com/thihazawsatellite/live-try/9ff4eff3ed09ee6e60145483394acdd6e5b75749/live-try.m3u",
  BioStarTV: "https://pli.hridoytvx.workers.dev/?list=biostar",
  MirazTV:   "https://pli.hridoytvx.workers.dev/?list=miraz",
  RoarZone:  "https://pli.hridoytvx.workers.dev/?list=roarzone",
  CricHD:    "https://pli.hridoytvx.workers.dev/?list=crichd",
  CloudISP:  "https://pli.hridoytvx.workers.dev/?list=cloudisp"
};

/* =========================
   STREAM MAP (LOCK)
========================= */

window.STREAM_MAP = {};

/* =========================
   LOAD ALL PLAYLISTS
========================= */

window.loadGitHubPlaylists = async function () {

  // 🔥 PLAYER SOURCE MAP (VERY IMPORTANT)
  window.channels = window.channels || {};

  // পুরোনো stream clear
  Object.keys(window.STREAM_MAP).forEach(k => delete window.STREAM_MAP[k]);

  for (const [playlistName, url] of Object.entries(GITHUB_PLAYLISTS)) {
    try {
      const res = await fetch(url);
      const text = await res.text();

      parseM3U(text, playlistName);

    } catch (e) {
      console.warn("❌ Playlist load failed:", playlistName, e);
    }
  }

  console.log("✅ STREAM_MAP READY", window.STREAM_MAP);
  console.log("✅ CHANNELS READY", window.channels);

  // 🔔 notify app that github streams are ready
  window.dispatchEvent(new Event("githubStreamsReady"));
};


/* =========================
   PARSE + MATCH (PLAYLIST LOCK)
========================= */

function parseM3U(text, playlistName) {

  let currentName = "";

  text.split("\n").forEach(line => {
    line = line.trim();

    /* 🎯 Channel Name */
    if (line.startsWith("#EXTINF")) {
      const m = line.match(/,(.*)$/);
      currentName = m ? m[1].toLowerCase() : "";
      return;
    }

    /* 🎯 Stream URL */
    if (
      currentName &&
      line &&
      !line.startsWith("#") &&
      line.includes(".m3u8")
    ) {

      Object.values(window.categoryChannels || {})
        .flat()
        .forEach(ch => {

          /* ❌ Playlist mismatch */
          if (ch.playlist !== playlistName) return;

          const matches = [
            ch.name?.toLowerCase(),
            ...(ch.match || []).map(m => m.toLowerCase())
          ];

          if (matches.some(m => currentName.includes(m))) {

            /* 🔥 First match wins */
            if (!window.STREAM_MAP[ch.id]) {

              // 🔒 lock stream
              window.STREAM_MAP[ch.id] = line;

              // ▶️ REGISTER FOR PLAYER
              window.channels[ch.id] = {
                type: "m3u8",
                url: line
              };

              console.log(
                `🎯 ${ch.name} ← ${playlistName}`
              );
            }
          }
        });

      currentName = "";
    }
  });
}