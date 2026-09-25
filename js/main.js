/* SplitWire Tech — site scripts */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = {
    menu: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };

  /* Mobile menu */
  var header = document.getElementById('header');
  var menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menuBtn.innerHTML = open ? ICON.x : ICON.menu;
    });
  }

  /* Scroll reveal (with fallback so content never stays hidden) */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* Animated stat counters (home page) */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = +el.getAttribute('data-count');
    if (reduce) return;
    var start = null, dur = 1300;
    el.textContent = '0';
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 300);
  });

  /* Live dispatch status rotation (home page) */
  var dt = document.getElementById('dispatchText');
  if (dt && !reduce) {
    var msgs = [
      'Technician en route · ETA 42 min · Dallas–Fort Worth region',
      'Work order closed · Report delivered · Houston, TX',
      'Technician matched · Structured cabling · Austin, TX',
      'Technician on-site · POS rollout · Oklahoma City, OK'
    ];
    var mi = 0;
    dt.style.transition = 'opacity .3s';
    setInterval(function () {
      mi = (mi + 1) % msgs.length;
      dt.style.opacity = 0;
      setTimeout(function () { dt.textContent = msgs[mi]; dt.style.opacity = 0.92; }, 300);
    }, 4200);
  }

  /* Service request form -> pre-filled email (contact page) */
  var form = document.getElementById('reqForm');
  if (form) {
    var note = document.getElementById('formNote');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('name') || '').trim();
      var email = (d.get('email') || '').trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
        note.style.color = '#C0392B';
        note.textContent = 'Add your full name and a valid email so our intake team can reply.';
        (name ? form.email : form.name).focus();
        return;
      }
      var body = 'Name: ' + name + '\nCompany: ' + (d.get('company') || '-') + '\nEmail: ' + email +
        '\nPhone: ' + (d.get('phone') || '-') + '\nService needed: ' + d.get('service') +
        '\n\nJob details:\n' + (d.get('message') || '-');
      var url = 'mailto:intake@splitwire.tech?subject=' +
        encodeURIComponent('Service request: ' + d.get('service') + ' — ' + name) +
        '&body=' + encodeURIComponent(body);
      note.style.color = '';
      note.textContent = 'Opening your email app with the request filled in. If nothing opens, email intake@splitwire.tech directly.';
      window.location.href = url;
    });
  }
})();
