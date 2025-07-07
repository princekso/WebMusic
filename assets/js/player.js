window.onload = function () {
  const title = localStorage.getItem("title");
  const artist = localStorage.getItem("artist");
  const image = localStorage.getItem("image");
  const audioUrl = localStorage.getItem("audio_url");

  document.getElementById("songTitle").innerText = title || "No title";
  document.getElementById("artistName").innerText = artist || "Unknown Artist";
  document.getElementById("albumArt").src = image || "https://via.placeholder.com/400";
  document.getElementById("audioPlayer").src = audioUrl || "";
};
