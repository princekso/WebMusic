// 🔍 Search Songs Function
let playlist = [];

async function searchSongs() {
  const query = document.getElementById("searchInput").value.trim();
  const results = document.getElementById("searchResults");
  if (!query) return alert("❌ Please enter a song name");

  results.innerHTML = "<p>🔍 Searching...</p>";

  try {
    const res = await fetch(`https://backendapi-xgqd.onrender.com/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    console.log("🔎 API Raw Response:", data);

    const songs = data?.data?.songs?.results;

    if (!songs || !songs.length) {
      results.innerHTML = "<p>❌ No result found.</p>";
      return;
    }

    results.innerHTML = "";

    // 🎵 Build playlist from search results
    playlist = songs.slice(0, 8).map(song => {
      return {
        id: song.id,
        title: song.title || "Unknown Title",
        artist: song.primaryArtists || "Unknown Artist",
        image: song.image?.[2]?.url || ""
      };
    });

    for (let [index, song] of playlist.entries()) {
      const div = document.createElement("div");
      div.className = "result-card";
      div.innerHTML = `
        <img src="${song.image}" />
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <button onclick="getTrack(${index})">▶️ Play</button>
      `;
      results.appendChild(div);
    }
  } catch (err) {
    console.error("❌ Search Error:", err);
    results.innerHTML = "<p>❌ Failed to fetch songs.</p>";
  }
}

// ▶️ Play selected track and store playlist
function getTrack(index) {
  const song = playlist[index];
  if (!song) return alert("❌ Song not found");

  fetch(`https://backendapi-xgqd.onrender.com/api/song/${song.id}`)
    .then(res => res.json())
    .then(data => {
      const downloadOptions = data?.data?.[0]?.downloadUrl;
      const audio = downloadOptions?.find(d => d.quality === "320kbps")?.url || downloadOptions?.[0]?.url;

      if (!audio) return alert("❌ No audio URL found");

      // ✅ Inject audio URL into selected song
      song.url = audio;

      // ⏯️ Save playlist (only current song has url, others will be fetched on player.html)
      const fullPlaylist = playlist.map((s, i) => {
        if (i === index) return { ...song };
        return s;
      });

      localStorage.setItem("playlist", JSON.stringify(fullPlaylist));
      window.location.href = "player.html";
    })
    .catch(err => {
      console.error("❌ Track Fetch Error:", err);
      alert("❌ Could not load track");
    });
}
