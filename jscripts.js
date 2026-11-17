/* ==========================================================================
   Tanzim's Portfolio — interactions
   ========================================================================== */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------
       Typewriter intro
       --------------------------------------------------------------- */

    function Typewriter(el, words, period) {
        this.el = el;
        this.words = words;
        this.period = period || 1500;
        this.wordIndex = 0;
        this.text = '';
        this.deleting = false;
        this.timer = null;

        if (reduceMotion) {
            el.textContent = words[0];
            return;
        }

        this.tick();
    }

    Typewriter.prototype.tick = function () {
        var word = this.words[this.wordIndex % this.words.length];
        var delay;

        if (this.deleting) {
            this.text = word.substring(0, this.text.length - 1);
            delay = 35;
        } else {
            this.text = word.substring(0, this.text.length + 1);
            delay = 65 + Math.random() * 55;
        }

        this.el.textContent = this.text;

        if (!this.deleting && this.text === word) {
            delay = this.period;
            this.deleting = true;
        } else if (this.deleting && this.text === '') {
            this.deleting = false;
            this.wordIndex++;
            delay = 450;
        }

        var self = this;
        this.timer = window.setTimeout(function () {
            self.tick();
        }, delay);
    };

    /* ---------------------------------------------------------------
       Reveal on scroll
       --------------------------------------------------------------- */

    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    function showAll() {
        revealEls.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    function initReveal() {
        if (!('IntersectionObserver' in window) || reduceMotion) {
            showAll();
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ---------------------------------------------------------------
       Sticky header shading + active nav link
       --------------------------------------------------------------- */

    function initHeader() {
        var header = document.querySelector('.site-header');
        if (!header) {
            return;
        }

        function shade() {
            header.classList.toggle('scrolled', window.scrollY > 6);
        }

        shade();
        window.addEventListener('scroll', shade, { passive: true });

        if (!('IntersectionObserver' in window)) {
            return;
        }

        var links = Array.prototype.slice.call(document.querySelectorAll('#mainNav .nav-link'));
        var sections = links
            .map(function (link) {
                var id = link.getAttribute('href');
                return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
            })
            .filter(Boolean);

        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                links.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, {
            rootMargin: '-45% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach(function (section) {
            spy.observe(section);
        });
    }

    /* ---------------------------------------------------------------
       Close the mobile menu after tapping a link
       --------------------------------------------------------------- */

    function initMobileNav() {
        var nav = document.getElementById('mainNav');
        if (!nav) {
            return;
        }

        nav.addEventListener('click', function (event) {
            var link = event.target.closest('.nav-link');
            if (!link || !nav.classList.contains('show') || !window.bootstrap) {
                return;
            }

            window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
        });
    }

    /* ---------------------------------------------------------------
       Init
       --------------------------------------------------------------- */

    document.addEventListener('DOMContentLoaded', function () {
        var elements = document.getElementsByClassName('typewrite');

        for (var i = 0; i < elements.length; i++) {
            var words = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');

            if (words) {
                new Typewriter(elements[i], JSON.parse(words), period);
            }
        }

        initReveal();
        initHeader();
        initMobileNav();
    });
})();
