async function searchSongs() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Please enter a song name");

  const results = document.getElementById("searchResults");
  results.innerHTML = "<p>🔍 Searching...</p>";

  try {
    const searchRes = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
    const searchData = await searchRes.json();
    const songs = searchData.data.results || [];

    if (!songs.length) {
      results.innerHTML = "<p>No songs found.</p>";
      return;
    }

    results.innerHTML = "";

    for (let song of songs.slice(0, 8)) {
      const songUrl = song.url;
      const songId = songUrl.split("/").pop();

      try {
        const detailsRes = await fetch(`https://saavn.dev/api/songs/${songId}`);
        const detailsData = await detailsRes.json();
        const track = detailsData.data?.[0];

        if (!track || !track.downloadUrl?.[2]) continue;

        const title = track.name;
        const artist = track.primaryArtists;
        const image = track.image?.[2]?.link || "";
        const audio = track.downloadUrl?.[2]?.link || track.downloadUrl?.[1]?.link || "";

        const div = document.createElement("div");
        div.className = "result-card";
        div.innerHTML = `
          <img src="${image}" />
          <h3>${title}</h3>
          <p>${artist}</p>
          <button onclick="playTrack('${audio}', \`${title}\`, \`${artist}\`, '${image}')">▶️ Play</button>
          <button onclick="addToPlaylist('${audio}', \`${title}\`, \`${artist}\`, '${image}')">➕ Add</button>
        `;
        results.appendChild(div);
      } catch (err) {
        console.warn("⚠️ Failed to fetch song details for:", song.name);
        continue;
      }
    }

    saveToHistory(query);
  } catch (error) {
    console.error("❌ Search error:", error);
    results.innerHTML = "<p>❌ Failed to search. Try again later.</p>";
  }
}

function playTrack(audio_url, title, artist, image) {
  localStorage.setItem("audio_url", audio_url);
  localStorage.setItem("title", title);
  localStorage.setItem("artist", artist);
  localStorage.setItem("image", image);
  window.location.href = "player.html";
}

function addToPlaylist(audio_url, title, artist, image) {
  let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
  playlist.push({ audio_url, title, artist, image });
  localStorage.setItem("playlist", JSON.stringify(playlist));
  alert("🎶 Added to playlist!");
}

function saveToHistory(query) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.unshift(query);
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem("searchHistory", JSON.stringify(history));
}
