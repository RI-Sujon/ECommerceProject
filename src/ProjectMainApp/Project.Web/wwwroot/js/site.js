// E-Bazaar — Global JS

// ── Scroll-to-Top Button ───────────────────────────────────────────────
(function () {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.title = 'Back to top';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ── Smooth focus ring removal on mouse click ───────────────────────────
document.addEventListener('mousedown', function () {
    document.body.classList.add('using-mouse');
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') document.body.classList.remove('using-mouse');
});
