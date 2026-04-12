(function () {
  try {
    var t = localStorage.getItem('curve-theme');
    if (t === 'chad') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-curve-theme', 'chad');
    }
  } catch (e) {}
})();
