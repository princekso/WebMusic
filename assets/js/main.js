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
    const track_id = track.id;
    const artwork = track.artwork && track.artwork['480x480'];

    const div = document.createElement("div");
    div.className = "result-card";
    div.innerHTML = `
      <img src="${artwork}" />
      <h3>${title}</h3>
      <p>${artist}</p>
      <button onclick="playTrack('${track_id}', '${title}', '${artist}', '${artwork}')">Play</button>
      <button onclick="addToPlaylist('${track_id}', '${title}', '${artist}', '${artwork}')">➕ Add to Playlist</button>
    `;
    results.appendChild(div);
  });

  saveToHistory(query);
}

// ▶️ Play selected track (resolve stream)
async function playTrack(track_id, title, artist, image) {
  try {
    const res = await fetch(`https://api.audius.co/v1/tracks/${track_id}/stream`);
    const data = await res.json();
    const stream = data.data;

    localStorage.setItem("audio_url", stream);
    localStorage.setItem("title", title);
    localStorage.setItem("artist", artist);
    localStorage.setItem("image", image);
    window.location.href = "player.html";
  } catch (err) {
    alert("❌ Unable to stream this track.");
    console.error(err);
  }
}

// ➕ Add to playlist
function addToPlaylist(track_id, title, artist, image) {
  let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
  playlist.push({ track_id, title, artist, image });
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
