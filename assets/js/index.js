function toggleHaunting() {
  const ghost = document.getElementById('ghost');
  ghost.className = '';
  void ghost.offsetWidth;
  ghost.className = 'haunt';
}
