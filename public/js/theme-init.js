(function () {
  try {
    var t = localStorage.getItem('commonground-theme') || localStorage.getItem('cg-theme');
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) { /* ignore */ }
})();
