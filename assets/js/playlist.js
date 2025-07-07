window.onload = function () {
  const playlist = JSON.parse(localStorage.getItem("playlist")) || [];
  const container = document.getElementById("playlistContainer");

  if (!playlist.length) {
    container.innerHTML = "<p>No songs added yet.</p>";
    return;
  }

  playlist.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "result-card";
    div.innerHTML = `
      <img src="${song.image}" />
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <button onclick="playFromPlaylist('${song.track_id}', '${song.title}', '${song.artist}', '${song.image}')">▶️ Play</button>
      <button onclick="removeTrack(${index})">❌ Remove</button>
    `;
    container.appendChild(div);
  });
};

// ▶️ Play from playlist (fixed stream)
async function playFromPlaylist(track_id, title, artist, image) {
  try {
    const stream = `https://cdn.audius.co/v1/stream/${track_id}?app_name=ChintuMusic`;
    localStorage.setItem("audio_url", stream);
    localStorage.setItem("title", title);
    localStorage.setItem("artist", artist);
    localStorage.setItem("image", image);
    window.location.href = "player.html";
  } catch (err) {
    alert("❌ Could not stream this track.");
    console.error(err);
  }
}

// ❌ Remove from playlist
function removeTrack(index) {
  let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
  playlist.splice(index, 1);
  localStorage.setItem("playlist", JSON.stringify(playlist));
  location.reload();
}
