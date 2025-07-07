function verifyPass() {
  const pass = document.getElementById("adminPass").value;
  if (pass === "123Chintu") {
    document.getElementById("authBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadDashboard();
  } else {
    alert("❌ Wrong password!");
  }
}

function loadDashboard() {
  const playlist = JSON.parse(localStorage.getItem("playlist")) || [];
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  document.getElementById("playlistCount").innerText = playlist.length;

  const historyList = document.getElementById("searchHistory");
  historyList.innerHTML = "";
  history.forEach(q => {
    const li = document.createElement("li");
    li.textContent = q;
    historyList.appendChild(li);
  });
}

function clearLogs() {
  localStorage.removeItem("searchHistory");
  alert("🧹 Search history cleared!");
  loadDashboard();
}

function clearPlaylist() {
  localStorage.removeItem("playlist");
  alert("🗑️ Playlist cleared!");
  loadDashboard();
}
