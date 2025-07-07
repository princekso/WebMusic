async function searchSongs() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("searchResults");
  if (!query) return alert("❗ Please enter a song name.");

  resultsDiv.innerHTML = "<p>🔎 Searching...</p>";

  try {
    const res = await fetch(`https://backendapi-xgqd.onrender.com/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    console.log("🔎 API Raw Response:", data);

    const songs = data?.data?.songs?.results;

    if (!songs || !songs.length) {
      resultsDiv.innerHTML = "<p>❌ No songs found.</p>";
      return;
    }

    resultsDiv.innerHTML = "";
    for (const song of songs.slice(0, 12)) {
      const image = song.image?.[2]?.url || "";
      const title = song.title || "Unknown";
      const artist = song.primaryArtists || "Unknown";
      const id = song.id;

      const div = document.createElement("div");
      div.className = "result-card";
      div.innerHTML = `
        <img src="${image}" />
        <h3>${title}</h3>
        <p>${artist}</p>
        <button onclick="playTrack('${id}', \`${title}\`, \`${artist}\`, '${image}')">▶️ Play</button>
      `;
      resultsDiv.appendChild(div);
    }
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    resultsDiv.innerHTML = "<p>❌ Failed to fetch songs.</p>";
  }
}

async function playTrack(id, title, artist, image) {
  try {
    const res = await fetch(`https://backendapi-xgqd.onrender.com/api/song/${id}`);
    const data = await res.json();
    const audio = data?.audio_url;

    if (!audio) return alert("❌ No audio URL found.");

    // Save to localStorage
    localStorage.setItem("audio_url", audio);
    localStorage.setItem("title", title);
    localStorage.setItem("artist", artist);
    localStorage.setItem("image", image);

    window.location.href = "player.html";
  } catch (err) {
    console.error("❌ Play Fetch Error:", err);
    alert("❌ Failed to load track.");
  }
}
