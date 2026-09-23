/* ==========================================================================
   site.js — minimal behaviour for the homepage
   --------------------------------------------------------------------------
   Replaces the inherited Academic Pages bundle, which was ~4.6 MB of jQuery,
   Mapbox and Plotly for features this single page never uses — and whose
   document-ready handler threw before initialising the navigation.

   Everything here is progressive enhancement: with JavaScript disabled the
   page still reads correctly and the in-page anchors still work.
   ========================================================================== */

(function () {
  'use strict';

  var nav = document.querySelector('.greedy-nav');
  var masthead = document.querySelector('.masthead');

  /* ------------------------------------------------------------------ nav --
     Collapse navigation into the overflow menu when it no longer fits.
     Mirrors what the original jquery.greedy-navigation plugin did, but
     measured against the real container instead of a fixed minimum width. */
  if (nav) {
    var toggle = nav.querySelector('button');
    var visible = nav.querySelector('.visible-links');
    var hidden = nav.querySelector('.hidden-links');
    var items = visible ? Array.prototype.slice.call(visible.children) : [];

    var closeMenu = function () {
      if (!hidden) return;
      hidden.classList.add('hidden');
      nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    };

    var openMenu = function () {
      if (!hidden) return;
      hidden.classList.remove('hidden');
      nav.classList.add('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    };

    var fit = function () {
      if (!visible || !hidden || !toggle) return;

      closeMenu();

      // Restore every item, then measure the natural width of the full row.
      items.forEach(function (li) { visible.appendChild(li); });

      var available = nav.clientWidth;
      var needed = items.reduce(function (sum, li) {
        return sum + li.getBoundingClientRect().width;
      }, 0);

      if (needed <= available) {
        toggle.hidden = true;   // everything fits — no menu needed
        return;
      }

      toggle.hidden = false;

      // Move items into the overflow menu from the end until the row fits.
      for (var i = items.length - 1; i > 0; i--) {
        hidden.insertBefore(items[i], hidden.firstChild);
        needed -= items[i].getBoundingClientRect().width;
        if (needed <= available) break;
      }
    };

    if (toggle) {
      toggle.hidden = true;               // only revealed by fit() when needed
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Toggle navigation');

      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        if (nav.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
      });
    }

    // Dismiss the menu on outside click or Escape.
    document.addEventListener('click', function (event) {
      if (nav.classList.contains('is-open') && !nav.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    // Collapse while a jump link is followed, so the target is not obscured.
    if (visible) {
      visible.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
      });
    }

    var pending;
    window.addEventListener('resize', function () {
      window.clearTimeout(pending);
      pending = window.setTimeout(fit, 120);
    });

    // Runs after fonts and layout settle, otherwise the first measurement is wrong.
    if (document.readyState === 'complete') {
      fit();
    } else {
      window.addEventListener('load', fit);
    }
    fit();
  }

  /* ------------------------------------------------------------- masthead --
     A hairline plus a soft lift once the page has scrolled, so the fixed
     header separates from the content without a heavy border at rest. */
  if (masthead) {
    var ticking = false;
    var sync = function () {
      masthead.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(sync);
      }
    }, { passive: true });
    sync();
  }
}());
