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

      const details = await fetch(`https://saavn.dev/api/songs/${id}`);
      const detailsData = await details.json();
      const track = detailsData.data?.[0];

      if (!track || !track.downloadUrl || track.downloadUrl.length === 0) continue;

      const audioObj = track.downloadUrl.find(x => x.link && x.quality === "320kbps");
      const audio = audioObj?.link || "";

      console.log("🎵 Audio URL for", track.name, "=", audio);

      const title = track.name || "Unknown Title";
      const artist = track.primaryArtists || "Unknown Artist";
      const image = track.image?.[2]?.link || "";

      if (!audio) continue; // skip track if no audio

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
    console.error("❌ ERROR:", err);
    results.innerHTML = "<p>❌ Search failed. Try again.</p>";
  }
}

function playTrack(audio, title, artist, image) {
  console.log("🧪 playTrack:", audio);
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
