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

  /* Service request form -> Google Form (contact page) */
  // From the Google Form's pre-filled link: the form ID and each question's entry ID.
  var GFORM_ID = '1FAIpQLSckqIwlAMfJxaNIPPH9Rqim7W-E8qXdcbN2g8y76uDmTR7WHA';
  var GFORM_FIELDS = {
    name: 'entry.1402843735',
    company: 'entry.1813888766',
    email: 'entry.1852012031',
    phone: 'entry.1987098863',
    service: 'entry.881791538',
    message: 'entry.1248535144'
  };
  var form = document.getElementById('reqForm');
  if (form) {
    var note = document.getElementById('formNote');
    var btn = form.querySelector('button[type="submit"]');
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
      var done = function () {
        form.reset();
        btn.disabled = false;
        note.style.color = '';
        note.textContent = 'Thanks, ' + name + '! Your request is in — our intake team will reply to ' + email + ' shortly.';
      };
      // Honeypot: bots tick the hidden box; pretend success without sending.
      if (d.get('botcheck')) return done();
      var body = new URLSearchParams();
      Object.keys(GFORM_FIELDS).forEach(function (k) { body.append(GFORM_FIELDS[k], (d.get(k) || '').trim()); });
      btn.disabled = true;
      note.style.color = '';
      note.textContent = 'Sending your request…';
      // Google doesn't allow reading the response (no-cors), so only network errors are detectable.
      fetch('https://docs.google.com/forms/d/e/' + GFORM_ID + '/formResponse', { method: 'POST', mode: 'no-cors', body: body })
        .then(done)
        .catch(function () {
          btn.disabled = false;
          note.style.color = '#C0392B';
          note.textContent = 'Something went wrong sending your request. Please call +1 (945) 272-8551 or email intake@splitwire.tech.';
        });
    });
  }
})();
