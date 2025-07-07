// 🔍 Search Songs Function
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
      results.innerHTML = "<p>❌ No results found.</p>";
      return;
    }

    results.innerHTML = "";

    for (let song of songs.slice(0, 8)) {
      const id = song.id;
      const title = song.title || "Unknown Title";
      const artist = song.primaryArtists || "Unknown Artist";
      const img = song.image?.[2]?.url || "";

      const div = document.createElement("div");
      div.className = "result-card";
      div.innerHTML = `
        <img src="${img}" />
        <h3>${title}</h3>
        <p>${artist}</p>
        <button onclick="getTrack('${id}', \`${title}\`, \`${artist}\`, '${img}')">▶️ Play</button>
      `;
      results.appendChild(div);
    }
  } catch (err) {
    console.error("❌ Search Error:", err);
    results.innerHTML = "<p>❌ Failed to fetch songs.</p>";
  }
}

// ▶️ Play Track via Backend API
function getTrack(id, title, artist, image) {
  fetch(`https://backendapi-xgqd.onrender.com/api/song/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log("🎧 Track Data:", data);

      let audio = "";

      // 🔍 Pick 320kbps if available
      if (Array.isArray(data.url)) {
        const best = data.url.find(x => x.quality === "320kbps");
        audio = best?.url || data.url[0]?.url || "";
      } else if (typeof data.url === "string") {
        audio = data.url;
      }

      if (!audio) {
        alert("❌ No audio URL found!");
        return;
      }

      localStorage.setItem("audio_url", audio);
      localStorage.setItem("title", title);
      localStorage.setItem("artist", artist);
      localStorage.setItem("image", image);
      window.location.href = "player.html";
    })
    .catch(err => {
      console.error("❌ Track Fetch Error:", err);
      alert("❌ Could not load track");
    });
}
