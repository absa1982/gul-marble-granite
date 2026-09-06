(function () {
  "use strict";

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- theme toggle ---------- */
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var root = document.documentElement;
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("gul-theme", next); } catch (e) {}
    });
  }

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobilePanel = document.getElementById("mobilePanel");

  function closeMobilePanel() {
    if (!mobilePanel) return;
    mobilePanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function openMobilePanel() {
    if (!mobilePanel) return;
    mobilePanel.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mobilePanel) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobilePanel.classList.contains("is-open");
      if (isOpen) closeMobilePanel(); else openMobilePanel();
    });

    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobilePanel);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobilePanel();
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- hide floating WhatsApp button while hero is in view ---------- */
  var fab = document.querySelector(".fab-whatsapp");
  var heroSection = document.getElementById("top");
  if (fab && heroSection && "IntersectionObserver" in window) {
    var fabIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          fab.classList.toggle("is-hidden", entry.intersectionRatio > 0.35);
        });
      },
      { threshold: [0, 0.35, 1] }
    );
    fabIo.observe(heroSection);
  }

  /* ---------- contact form -> WhatsApp ---------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  var WHATSAPP_NUMBER = "923215108348";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("cf-name").value.trim();
      var phone = document.getElementById("cf-phone").value.trim();
      var message = document.getElementById("cf-message").value.trim();

      if (!name || !phone) {
        note.textContent = "Please add your name and phone number so we can reply.";
        note.removeAttribute("data-state");
        return;
      }

      var text = "Hi, I'm " + name + " (" + phone + ").";
      if (message) text += " " + message;

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");

      note.textContent = "WhatsApp is opening in a new tab with your message ready to send.";
      note.setAttribute("data-state", "sent");
    });
  }
})();
