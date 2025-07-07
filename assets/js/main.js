async function searchSongs() {
  const query = document.getElementById("searchInput").value;
  if (!query.trim()) return alert("Please enter a search query");

  const res = await fetch(`https://saavn.me/search/songs?query=${encodeURIComponent(query)}`);
  const data = await res.json();

  const results = document.getElementById("searchResults");
  results.innerHTML = "";

  const songs = data.data.results || [];

  songs.forEach(track => {
    const title = track.name;
    const artist = track.primaryArtists;
    const image = track.image[2].link; // Medium quality image
    const audio = track.downloadUrl[4].link; // 320kbps link (or 2 = 160kbps)

    const div = document.createElement("div");
    div.className = "result-card";
    div.innerHTML = `
      <img src="${image}" />
      <h3>${title}</h3>
      <p>${artist}</p>
      <button onclick="playTrack('${audio}', '${title}', '${artist}', '${image}')">▶️ Play</button>
      <button onclick="addToPlaylist('${audio}', '${title}', '${artist}', '${image}')">➕ Add</button>
    `;
    results.appendChild(div);
  });

  saveToHistory(query);
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
  alert("🎵 Added to playlist!");
}

function saveToHistory(query) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.unshift(query);
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem("searchHistory", JSON.stringify(history));
}
