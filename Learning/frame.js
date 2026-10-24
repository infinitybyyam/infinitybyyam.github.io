/* Learning by Yam: shared frame.
   Every topic page loads this file from https://infinitybyyam.github.io/Learning/frame.js.
   It adds the favicons, reading-progress bar, nav, footer and the Atrás / Próxima pager,
   then turns each <section class="s"> inside <main class="wrap"> into one screen.
   Change the nav, footer or pager here and every topic page changes with it. */
(function () {
  var SITE = 'https://infinitybyyam.github.io/';
  var LEARNING = SITE + 'Learning/';

  var NAV =
    '<div id="progress" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>' +
    '<nav class="yam-nav">' +
      '<a href="' + SITE + '" class="nav-logo" aria-label="Infinity by Yam"><img src="' + SITE + 'nav-mark.png" alt="Infinity by Yam"></a>' +
      '<ul class="nav-links">' +
        '<li><a href="' + LEARNING + '">Back to Learning</a></li>' +
        '<li><a href="mailto:infinitybyyam@gmail.com">Contact</a></li>' +
      '</ul>' +
    '</nav>';

  var FOOTER =
    '<footer class="yam-footer">' +
      '<div class="footer-logo"><span class="footer-logo-infinity">INFINITY</span> <span class="footer-logo-byyam">BY YAM</span></div>' +
      '<div class="footer-copy">&copy; 2026 Infinity by Yam. All rights reserved.</div>' +
    '</footer>' +
    '<div id="pager" role="navigation" aria-label="Sections">' +
      '<button type="button" class="pbtn" id="pPrev">&larr; Atr&aacute;s</button>' +
      '<div class="pmid"><div class="dots" id="pDots"></div><div class="plabel" id="pLabel"></div></div>' +
      '<button type="button" class="pbtn primary" id="pNext">Pr&oacute;xima &rarr;</button>' +
    '</div>';

  function addIcons() {
    [['icon', '32x32', 'favicon-32.png'], ['icon', '16x16', 'favicon-16.png'], ['apple-touch-icon', '180x180', 'favicon-180.png']].forEach(function (f) {
      var l = document.createElement('link');
      l.rel = f[0]; l.sizes = f[1]; l.href = SITE + f[2];
      if (f[0] === 'icon') l.type = 'image/png';
      document.head.appendChild(l);
    });
  }

  function addFrame() {
    var top = document.createElement('div');
    top.innerHTML = NAV;
    while (top.lastChild) document.body.insertBefore(top.lastChild, document.body.firstChild);
    var bottom = document.createElement('div');
    bottom.innerHTML = FOOTER;
    while (bottom.firstChild) document.body.appendChild(bottom.firstChild);
  }

  function addPager() {
    var main = document.querySelector('main.wrap');
    if (!main) return;
    var hero = main.querySelector('.hero');
    var secs = Array.prototype.filter.call(main.children, function (c) { return c.tagName === 'SECTION'; });
    if (!secs.length) return;
    var steps = secs.map(function (sec, i) {
      var d = document.createElement('div');
      d.className = 'step';
      sec.parentNode.insertBefore(d, sec);
      if (i === 0 && hero) d.appendChild(hero);
      d.appendChild(sec);
      return d;
    });
    var n = steps.length, cur = -1, seen = {};
    var dotsEl = document.getElementById('pDots'), labelEl = document.getElementById('pLabel');
    var prev = document.getElementById('pPrev'), next = document.getElementById('pNext');
    var bar = document.getElementById('progress'), fill = bar.firstElementChild;
    var dots = steps.map(function (s, i) {
      var b = document.createElement('button');
      var h = secs[i].querySelector('h2');
      b.type = 'button'; b.className = 'dot';
      b.setAttribute('aria-label', 'Go to section ' + (i + 1) + (h ? ': ' + h.textContent : ''));
      b.addEventListener('click', function () { go(i); });
      dotsEl.appendChild(b);
      return b;
    });
    document.documentElement.className += ' pager-on';
    var navEl = document.querySelector('nav.yam-nav');
    function setNavH() { if (navEl) document.documentElement.style.setProperty('--navh', navEl.offsetHeight + 'px'); }
    setNavH();
    window.addEventListener('resize', setNavH);
    window.addEventListener('load', setNavH);

    function go(i, fromHash) {
      i = Math.max(0, Math.min(n - 1, i));
      if (i === cur) return;
      var back = i < cur;
      steps.forEach(function (s, k) {
        s.classList.toggle('active', k === i);
        s.classList.toggle('back', k === i && back);
      });
      seen[i] = true;
      dots.forEach(function (d, k) {
        d.classList.toggle('on', k === i);
        d.classList.toggle('seen', k !== i && !!seen[k]);
        if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      labelEl.textContent = (i + 1) + ' / ' + n;
      prev.disabled = i === 0;
      if (i === n - 1) next.textContent = 'Back to Learning'; else next.innerHTML = 'Pr&oacute;xima &rarr;';
      var p = (i + 1) / n;
      fill.style.transform = 'scaleX(' + p + ')';
      bar.setAttribute('aria-valuenow', Math.round(p * 100));
      cur = i;
      if (!fromHash && window.history && history.replaceState) { try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {} }
      window.scrollTo(0, 0);
      var h = steps[i].querySelector('h2');
      if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
    }
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () {
      if (cur === n - 1) { window.location.href = LEARNING; } else { go(cur + 1); }
    });

    document.addEventListener('keydown', function (e) {
      var t = e.target && e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight') go(cur + 1);
      else if (e.key === 'ArrowLeft') go(cur - 1);
    });

    /* A sideways swipe on plain text turns the page. Controls, charts and tables keep their own touches;
       a page can protect any other area by giving it the attribute data-noswipe. */
    var sx = 0, sy = 0, st = 0, ok = false;
    main.addEventListener('touchstart', function (e) {
      var t = e.target, touches = e.touches;
      ok = touches.length === 1 && !(t.closest && t.closest('input, select, textarea, button, a, svg, table, [role="group"], [data-noswipe]'));
      if (!ok) return;
      sx = touches[0].clientX; sy = touches[0].clientY; st = Date.now();
    }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (!ok) return; ok = false;
      var c = e.changedTouches[0], dx = c.clientX - sx, dy = c.clientY - sy;
      if (Date.now() - st > 800 || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
      go(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });

    function fromHash() { var m = /^#(\d+)$/.exec(location.hash); return m ? parseInt(m[1], 10) - 1 : 0; }
    window.addEventListener('hashchange', function () { go(fromHash(), true); });
    go(fromHash(), true);
  }

  function start() { addIcons(); addFrame(); addPager(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
