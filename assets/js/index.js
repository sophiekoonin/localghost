function toggleHaunting() {
  const ghost = document.getElementById('ghost');
  ghost.className === 'haunt'
    ? (ghost.className = '')
    : (ghost.className = 'haunt');
}
