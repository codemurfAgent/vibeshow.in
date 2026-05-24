/* ============================================================
   VibeShow.in — Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('mobileOverlay');

    if (hamburger && navLinks && overlay) {
        function toggleMenu(forceClose) {
            const isOpen = navLinks.classList.contains('open');
            if (forceClose && !isOpen) return;
            navLinks.classList.toggle('open');
            overlay.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        }

        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', () => toggleMenu(true));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });
    }

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;
    let ticking = false;

    function handleNavScroll() {
        const currentY = window.scrollY;
        if (currentY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = currentY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleNavScroll);
            ticking = true;
        }
    });

    // ---- Scroll Reveal (IntersectionObserver) ----
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Add a small cascading delay based on data attributes or classes
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, 50);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all immediately
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ---- Stat Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-num');

    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        const statObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.dataset.target) || 0;
                        animateCounter(el, target);
                        statObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(el => statObserver.observe(el));
    } else {
        statNumbers.forEach(el => {
            el.textContent = el.dataset.target || '0';
        });
    }

    function animateCounter(el, target) {
        const duration = 1500;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ---- FAQ Toggle ----
    window.toggleFaq = function(button) {
        const faqItem = button.closest('.faq-item');
        if (!faqItem) return;

        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked one if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    };

    // ---- Copy UPI ----
    window.copyUPI = function() {
        const upiId = 'vibeshow@upi';
        const copyBtn = document.querySelector('.btn-copy');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(upiId).then(() => {
                showToast('UPI ID copied!');
                if (copyBtn) {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }
            }).catch(() => {
                fallbackCopy(upiId);
            });
        } else {
            fallbackCopy(upiId);
        }
    };

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('UPI ID copied!');
            const copyBtn = document.querySelector('.btn-copy');
            if (copyBtn) {
                copyBtn.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        } catch (e) {
            showToast('UPI ID: vibeshow@upi');
        }
        document.body.removeChild(textarea);
    }

    // ---- Toast Notification ----
    let toastTimer = null;

    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        if (toastTimer) clearTimeout(toastTimer);

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        });

        toastTimer = setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(10px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
            toastTimer = null;
        }, 2200);
    }

    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: rgba(124, 92, 252, 0.95);
            backdrop-filter: blur(12px);
            color: white;
            padding: 12px 28px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 99999;
            opacity: 0;
            transition: all 0.3s ease;
            white-space: nowrap;
            box-shadow: 0 4px 24px rgba(0,0,0,0.3);
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

});
