document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('mobileOverlay');

    function setMenu(open) {
        if (!hamburger || !navLinks || !overlay) return;
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        navLinks.classList.toggle('open', open);
        overlay.classList.toggle('active', open);
        body.style.overflow = open ? 'hidden' : '';
    }

    if (hamburger && navLinks && overlay) {
        hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
        overlay.addEventListener('click', () => setMenu(false));
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setMenu(false));
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setMenu(false);
        });
    }

    function updateNavbar() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 24);
    }

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('visible'));
    }

    const statNumbers = document.querySelectorAll('.stat-num');
    function animateCounter(element, target) {
        const duration = 1200;
        const startedAt = performance.now();
        element.textContent = '0';

        function tick(now) {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = String(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const target = Number(entry.target.dataset.target || 0);
                animateCounter(entry.target, target);
                statObserver.unobserve(entry.target);
            });
        }, { threshold: 0.6 });

        statNumbers.forEach((element) => statObserver.observe(element));
    } else {
        statNumbers.forEach((element) => {
            element.textContent = element.dataset.target || '0';
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!button || !answer) return;

        if (item.classList.contains('active')) {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
            button.setAttribute('aria-expanded', 'true');
        }

        button.addEventListener('click', () => {
            const shouldOpen = !item.classList.contains('active');

            faqItems.forEach((otherItem) => {
                const otherButton = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherItem.classList.remove('active');
                if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                if (otherAnswer) otherAnswer.style.maxHeight = '0px';
            });

            if (shouldOpen) {
                item.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });
});
