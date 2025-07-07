async function searchSongs() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Please enter a song name");

  const results = document.getElementById("searchResults");
  results.innerHTML = "<p>🔍 Searching...</p>";

  try {
    const res = await fetch(`https://backendapi-xgqd.onrender.com/api/search?query=${encodeURIComponent(query)}`);
    const raw = await res.json();
    console.log("🔎 API Raw Response:", raw);

    const songs = raw?.data?.songs?.results || [];

    if (!songs.length) {
      results.innerHTML = "<p>❌ No songs found.</p>";
      return;
    }

    results.innerHTML = "";

    for (let song of songs.slice(0, 8)) {
      const id = song.id;

      const detRes = await fetch(`https://backendapi-xgqd.onrender.com/api/song/${id}`);
      const detData = await detRes.json();
      const track = detData?.data;

      const audio = track?.downloadUrl?.find(x => x?.quality === "320kbps")?.url || "";
      const title = track?.title || "Unknown Title";
      const artist = track?.primaryArtists || "Unknown Artist";
      const image = track?.image?.[2]?.url || "";

      if (!audio) continue;

      console.log("🎵 Audio URL:", audio);

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
    console.error("❌ Search Error:", err);
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
