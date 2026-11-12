/* ==========================================================
   Junard Gumatay — Portfolio 2026
   Vanilla JavaScript
   ========================================================== */

(function () {
  "use strict";

  const CATEGORIES = [
    { id: "short-form", label: "Short Form &<br>Podcast Clips" },
    { id: "ugc", label: "UGC &<br>Product Ads" },
    { id: "talking-head", label: "Talking Head" },
    { id: "long-form", label: "Long Form" },
    { id: "ai", label: "AI Clips" },
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Split intro word into animated letters ---------- */
  function splitIntroLetters() {
    const word = document.querySelector("[data-split]");
    if (!word) return;
    const text = word.textContent.trim();
    word.setAttribute("aria-label", text);
    word.textContent = "";
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.setProperty("--i", i);
      span.setAttribute("aria-hidden", "true");
      word.appendChild(span);
    });
  }

  /* ---------- Glow that follows the cursor on the intro ---------- */
  function initIntroGlow() {
    const intro = document.querySelector(".intro");
    const glow = document.querySelector(".intro__glow");
    if (!intro || !glow || prefersReducedMotion) return;

    let targetX = window.innerWidth * 0.68;
    let targetY = window.innerHeight * 0.58;
    let x = targetX;
    let y = targetY;
    let rafId = null;

    function render() {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      rafId = Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5 ? requestAnimationFrame(render) : null;
    }

    intro.addEventListener("pointermove", (e) => {
      const rect = intro.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!rafId) rafId = requestAnimationFrame(render);
    });

    render();

    intro.addEventListener("click", () => {
      document.getElementById("about").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------- Build the category pill navigation ---------- */
  function buildPills() {
    document.querySelectorAll("[data-pills]").forEach((nav) => {
      const active = nav.getAttribute("data-pills");
      nav.innerHTML = CATEGORIES.map(
        (cat) =>
          `<a class="pill" href="#${cat.id}"${cat.id === active ? ' aria-current="true"' : ""}>${cat.label}</a>`
      ).join("");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Parallax on the big outlined divider numbers ---------- */
  function initParallax() {
    if (prefersReducedMotion) return;
    const ghosts = document.querySelectorAll(".divider__ghost");
    const progress = document.querySelector(".progress");
    const toTop = document.querySelector(".to-top");
    let ticking = false;

    function update() {
      const vh = window.innerHeight;
      ghosts.forEach((ghost) => {
        const rect = ghost.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -0.15;
        ghost.style.transform = `translate(${offset * 0.4}px, calc(-50% + ${offset}px))`;
      });

      const max = document.documentElement.scrollHeight - vh;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      if (toTop) toTop.classList.toggle("is-visible", window.scrollY > vh);

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    const btn = document.querySelector(".to-top");
    if (!btn) return;
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Video placeholders → swap in real video on play ---------- */
  function initVideos() {
    document.querySelectorAll("[data-video]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-video");
        const frame = btn.closest(".video-frame");
        const poster = frame.querySelector("img");
        const video = document.createElement("video");
        video.src = src;
        video.poster = poster ? poster.src : "";
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
        video.addEventListener("error", () => {
          frame.replaceChildren(poster);
          frame.insertAdjacentHTML(
            "beforeend",
            '<p style="position:absolute;inset:auto 0 0;margin:0;padding:1rem;background:rgba(0,0,0,.6);color:#fff;font-size:.9rem;text-align:center">Add your video file at <code>' +
              src +
              "</code></p>"
          );
        });
        frame.replaceChildren(video);
      });
    });
  }

  /* ---------- Current year ---------- */
  function setYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = year));
  }

  document.addEventListener("DOMContentLoaded", () => {
    splitIntroLetters();
    buildPills();
    initIntroGlow();
    initReveal();
    initParallax();
    initToTop();
    initVideos();
    setYear();
  });
})();
