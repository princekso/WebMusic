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

    for (let song of songs.slice(0, 10)) {
      const songUrl = song.url;
      const songId = songUrl.split("/").pop();

      // Fetch full song data to get stream
      const detailsRes = await fetch(`https://saavn.dev/api/songs/${songId}`);
      const detailsData = await detailsRes.json();
      const track = detailsData.data[0];

      const title = track.name;
      const artist = track.primaryArtists;
      const image = track.image?.[2]?.link || "";
      const audio = track.downloadUrl?.[2]?.link || track.downloadUrl?.[1]?.link || "";

      if (!audio) continue; // skip if no stream

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
    }

    saveToHistory(query);
  } catch (error) {
    console.error(error);
    results.innerHTML = "<p>❌ Something went wrong while searching.</p>";
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
