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
        '<li><a href="mailto:infinitybyyam@gmail.com">Contact</a></li>' +
      '</ul>' +
    '</nav>');

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
