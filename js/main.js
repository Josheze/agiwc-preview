// AGIWC website preview: dark mode + live countdown
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var dark = root.dataset.theme === 'dark';
      root.dataset.theme = dark ? 'light' : 'dark';
      try { localStorage.setItem('agiwc-theme', root.dataset.theme); } catch (e) {}
    });
  }


  // Phone menu
  var menu = document.querySelector('.menu-btn');
  if (menu) {
    menu.addEventListener('click', function () {
      var header = menu.closest('header');
      var open = header.classList.toggle('open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Next service countdown (times in UTC; Abuja is UTC+1)
  var services = [
    { day: 0, h: 6, m: 0, label: 'Sunday \u00b7 1st Service', when: 'Sunday at 7:00am' },
    { day: 3, h: 16, m: 30, label: 'Midweek Service', when: 'Wednesday at 5:30pm' },
    { day: 6, h: 9, m: 0, label: 'Saturday Evangelism', when: 'Saturday at 10:00am' }
  ];
  function nextService() {
    var now = new Date(), best = null;
    services.forEach(function (s) {
      var t = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), s.h, s.m, 0));
      t.setUTCDate(t.getUTCDate() + ((s.day - now.getUTCDay() + 7) % 7));
      if (t <= now) t.setUTCDate(t.getUTCDate() + 7);
      if (!best || t < best.t) best = { t: t, s: s };
    });
    return best;
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  function set(name, value) {
    document.querySelectorAll('[data-cd="' + name + '"]').forEach(function (el) { el.textContent = value; });
  }
  function tick() {
    var next = nextService();
    var diff = Math.max(0, Math.floor((next.t - new Date()) / 1000));
    var d = Math.floor(diff / 86400); diff -= d * 86400;
    var h = Math.floor(diff / 3600); diff -= h * 3600;
    var m = Math.floor(diff / 60), s = diff - m * 60;
    set('cd-label', next.s.label); set('cd-when', next.s.when + ' (WAT)');
    set('cd-d', d); set('cd-h', pad(h)); set('cd-m', pad(m)); set('cd-s', pad(s));
  }
  if (document.querySelector('[data-cd]')) { tick(); setInterval(tick, 1000); }

  // Copy buttons on the bank card
  document.querySelectorAll('button').forEach(function (b) {
    if (b.textContent.trim() !== 'Copy') return;
    b.addEventListener('click', function () {
      var num = b.parentElement.querySelector('p:last-child');
      if (navigator.clipboard && num) navigator.clipboard.writeText(num.textContent.trim());
      b.textContent = 'Copied!';
      setTimeout(function () { b.textContent = 'Copy'; }, 1500);
    });
  });
})();
