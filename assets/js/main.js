async function searchSongs() {
  const query = document.getElementById("searchInput").value;
  if (!query.trim()) return alert("Please enter a search query");

  const res = await fetch(`https://api.audius.co/v1/tracks/search?query=${encodeURIComponent(query)}`);
  const data = await res.json();

  const results = document.getElementById("searchResults");
  results.innerHTML = "";

  data.data.forEach(track => {
    const title = track.title;
    const artist = track.user.name;
    const stream_url = track.stream_url;
    const artwork = track.artwork && track.artwork['480x480'];

    const div = document.createElement("div");
    div.className = "result-card";
    div.innerHTML = `
      <img src="${artwork}" />
      <h3>${title}</h3>
      <p>${artist}</p>
      <button onclick="playTrack('${stream_url}', '${title}', '${artist}', '${artwork}')">Play</button>
      <button onclick="addToPlaylist('${stream_url}', '${title}', '${artist}', '${artwork}')">➕ Add to Playlist</button>
    `;
    results.appendChild(div);
  });

  saveToHistory(query);
}

// ▶️ Play selected track
function playTrack(url, title, artist, image) {
  localStorage.setItem("audio_url", url);
  localStorage.setItem("title", title);
  localStorage.setItem("artist", artist);
  localStorage.setItem("image", image);
  window.location.href = "player.html";
}

// ➕ Add to playlist (in localStorage)
function addToPlaylist(url, title, artist, image) {
  let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
  playlist.push({ url, title, artist, image });
  localStorage.setItem("playlist", JSON.stringify(playlist));
  alert("🎶 Added to playlist!");
}

// 📖 Save search history
function saveToHistory(query) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.unshift(query);
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem("searchHistory", JSON.stringify(history));
}
