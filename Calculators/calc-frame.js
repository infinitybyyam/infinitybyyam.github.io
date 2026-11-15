/* Calculators by Yam: shared frame.
   Put this script as the first thing inside <body>. It adds the nav at the top
   and the footer at the bottom of every page. On a calculator page, an empty
   <div data-calc-end></div> becomes the Reset and Other Calculators buttons;
   Reset calls the page's own window.calcReset(). */
(function () {
  var SITE = 'https://infinitybyyam.github.io/';

  document.body.insertAdjacentHTML('afterbegin',
    '<nav>' +
      '<a href="' + SITE + '" class="nav-logo"><img src="' + SITE + 'nav-mark.png" alt="Infinity by Yam"></a>' +
      '<ul class="nav-links">' +
        '<li><a href="' + SITE + '">Back to Home</a></li>' +
        '<li><a href="' + SITE + 'Learning/">Learning</a></li>' +
        '<li>' +
          '<button class="nav-drop-btn" id="yam-products-btn" type="button" aria-expanded="false" aria-controls="yam-products-menu">Products <span class="caret">▾</span></button>' +
          '<ul class="nav-menu" id="yam-products-menu">' +
            '<li>' +
              '<button class="item" id="yam-nonaff-btn" type="button" aria-expanded="false" aria-controls="yam-nonaff-sub">Non-affiliated <span class="caret">▸</span></button>' +
              '<ul class="nav-sub" id="yam-nonaff-sub">' +
                '<li><a href="' + SITE + 'Products/credit_card_finder.html">Credit Card Finder</a></li>' +
              '</ul>' +
            '</li>' +
            '<li><span class="item dim" aria-disabled="true">Affiliated</span></li>' +
          '</ul>' +
        '</li>' +
        '<li><a href="mailto:infinitybyyam@gmail.com">Contact</a></li>' +
      '</ul>' +
    '</nav>');

  // Products menu, same as the home page: tap or click to open; Non-affiliated opens the
  // product list; Affiliated is shown dimmed and does nothing. Closes on outside tap or Esc.
  (function () {
    var btn = document.getElementById('yam-products-btn');
    var menu = document.getElementById('yam-products-menu');
    var subBtn = document.getElementById('yam-nonaff-btn');
    var sub = document.getElementById('yam-nonaff-sub');
    function setOpen(open) {
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) { sub.classList.remove('open'); subBtn.setAttribute('aria-expanded', 'false'); }
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!menu.classList.contains('open')); });
    subBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !sub.classList.contains('open');
      sub.classList.toggle('open', open);
      subBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  })();

  function finish() {
    var end = document.querySelector('[data-calc-end]');
    if (end) {
      end.className = 'end-btns';
      end.innerHTML =
        '<button type="button" class="btn-outline">Reset</button>' +
        '<a class="btn-primary" href="' + SITE + 'Calculators/">Other Calculators</a>';
      end.querySelector('button').addEventListener('click', function () {
        if (typeof window.calcReset === 'function') window.calcReset();
      });
    }
    document.body.insertAdjacentHTML('beforeend',
      '<footer>' +
        '<div class="footer-logo"><span>INFINITY</span> <span class="b">BY YAM</span></div>' +
        '<div class="footer-copy">© 2026 Infinity by Yam. All rights reserved.</div>' +
      '</footer>');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', finish);
  else finish();
})();
