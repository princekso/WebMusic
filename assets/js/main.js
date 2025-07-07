async function searchSongs() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Please enter a song name");

  const results = document.getElementById("searchResults");
  results.innerHTML = "<p>🔍 Searching...</p>";

  try {
    const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const songs = data.data.results;

    if (!songs.length) {
      results.innerHTML = "<p>No results found.</p>";
      return;
    }

    results.innerHTML = "";

    for (let song of songs.slice(0, 8)) {
      const id = song.id;
      const detRes = await fetch(`https://saavn.dev/api/songs/${id}`);
      const detData = await detRes.json();
      const track = detData.data[0];

      const audio = track?.downloadUrl?.find(x => x.quality === "320kbps")?.link || "";
      const title = track.name;
      const artist = track.primaryArtists;
      const image = track.image?.[2]?.link;

      const card = document.createElement("div");
      card.className = "result-card";
      card.innerHTML = `
        <img src="${image}" />
        <h3>${title}</h3>
        <p>${artist}</p>
        <button onclick="playTrack('${audio}', \`${title}\`, \`${artist}\`, '${image}')">▶️ Play</button>
      `;
      results.appendChild(card);
    }
  } catch (err) {
    console.error(err);
    results.innerHTML = "<p>❌ Failed to fetch songs.</p>";
  }
}

function playTrack(audio, title, artist, image) {
  if (!audio) return alert("❌ No audio URL found!");

  localStorage.setItem("audio_url", audio);
  localStorage.setItem("title", title);
  localStorage.setItem("artist", artist);
  localStorage.setItem("image", image);
  window.location.href = "player.html";
}
