async function searchSongs() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Please enter a song name");

  const results = document.getElementById("searchResults");
  results.innerHTML = "<p>🔍 Searching...</p>";

  try {
    const res = await fetch(`https://backendapi-xgqd.onrender.com/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    console.log("🔎 API Raw Response:", data);

    // ⛳ Try multiple structure possibilities
    const songs = data.data?.results || data.data || [];

    if (!Array.isArray(songs) || songs.length === 0) {
      results.innerHTML = "<p>❌ No songs found.</p>";
      return;
    }

    results.innerHTML = "";

    for (let song of songs.slice(0, 10)) {
      const title = song.title || song.name || "Unknown";
      const artist = song.primaryArtists || song.artist || "Unknown Artist";
      const image = song.image || song.imageUrl || "";
      let audio = "";

      if (Array.isArray(song.downloadUrl)) {
        const high = song.downloadUrl.find(x => x.quality === "320kbps");
        const low = song.downloadUrl.find(x => x.quality === "96kbps");
        audio = high?.link || low?.link || "";
      } else if (typeof song.downloadUrl === "string") {
        audio = song.downloadUrl;
      }

      if (!audio) continue;

      const div = document.createElement("div");
      div.className = "result-card";
      div.innerHTML = `
        <img src="${image}" />
        <h3>${title}</h3>
        <p>${artist}</p>
        <button onclick="playTrack('${audio}', \`${title}\`, \`${artist}\`, '${image}')">▶️ Play</button>
      `;
      results.appendChild(div);
    }
  } catch (err) {
    console.error("❌ Error:", err);
    results.innerHTML = "<p>❌ Failed to fetch songs.</p>";
  }
}

function playTrack(audio, title, artist, image) {
  if (!audio || audio === "undefined") {
    alert("❌ No audio URL found!");
    return;
  }

  localStorage.setItem("audio_url", audio);
  localStorage.setItem("title", title);
  localStorage.setItem("artist", artist);
  localStorage.setItem("image", image);

  window.location.href = "player.html";
}

window.onload = () => {
  const input = document.getElementById("searchInput");
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      searchSongs();
    }
  });
};
