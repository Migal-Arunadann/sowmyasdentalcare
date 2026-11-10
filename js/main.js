/**
 * Dr. Sowmya's Dental Care — Main Interactive Scripts
 * Strictly Vanilla ES6+ JavaScript | No external frameworks
 */

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("has-js");

  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initBeforeAfterSliders();
  initReelsCarousel();
  initFaqAccordion();
  initDynamicYear();
});

/**
 * Adds elevated shadow to sticky header after scrolling past top edge.
 */
function initHeaderScroll() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const updateScrollState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
}

/**
 * Accessible mobile navigation drawer toggle.
 */
function initMobileNav() {
  const toggleBtn = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-primary-nav]");
  if (!toggleBtn || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  };

  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    setOpen(!isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggleBtn.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      nav.classList.contains("is-open") &&
      !nav.contains(event.target) &&
      !toggleBtn.contains(event.target)
    ) {
      setOpen(false);
    }
  });
}

/**
 * Smooth IntersectionObserver reveal animations with reduced-motion safeguard.
 */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.02,
      rootMargin: "0px 0px 40px 0px"
    }
  );

  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.98) {
      el.classList.add("is-visible");
    } else {
      observer.observe(el);
    }
  });
}

/**
 * Interactive Before/After Dental Comparison Slider.
 * Supports pointer drag, touch swipe, range input, and arrow keys.
 */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll("[data-ba-slider]");
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const range = slider.querySelector("[data-ba-range]");
    if (!range) return;

    const setPosition = (percent) => {
      const clamped = Math.max(4, Math.min(96, Number(percent) || 50));
      slider.style.setProperty("--ba-pos", `${clamped}%`);
      range.value = String(Math.round(clamped));
    };

    setPosition(range.value || 50);

    range.addEventListener("input", () => {
      setPosition(range.value);
    });

    const updateFromPointer = (clientX) => {
      const rect = slider.getBoundingClientRect();
      if (!rect.width) return;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPosition(pct);
    };

    let isDragging = false;

    slider.addEventListener("pointerdown", (event) => {
      isDragging = true;
      updateFromPointer(event.clientX);
      if (slider.setPointerCapture) {
        try {
          slider.setPointerCapture(event.pointerId);
        } catch (_) {
          // Ignore capture errors on synthetic events
        }
      }
    });

    slider.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      updateFromPointer(event.clientX);
    });

    const endDrag = () => {
      isDragging = false;
    };

    slider.addEventListener("pointerup", endDrag);
    slider.addEventListener("pointercancel", endDrag);
  });
}

/**
 * Horizontal Instagram Reels Carousel powered by js/reels-data.js.
 * Renders official Instagram embeds if reel URLs are provided, or curated spotlight cards.
 */
function initReelsCarousel() {
  const root = document.querySelector("[data-reels-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-reels-track]");
  const prevBtn = root.querySelector("[data-reels-prev]");
  const nextBtn = root.querySelector("[data-reels-next]");
  const dotsWrap = root.querySelector("[data-reels-dots]");
  const config = window.CLINIC_REELS_CONFIG;

  if (!track || !config) return;

  const hasLiveEmbeds = Array.isArray(config.reelEmbedUrls) && config.reelEmbedUrls.length > 0;
  const items = hasLiveEmbeds ? config.reelEmbedUrls : config.spotlightCards || [];

  track.replaceChildren();

  if (hasLiveEmbeds) {
    items.forEach((rawUrl, index) => {
      const cleanUrl = sanitizeInstagramUrl(rawUrl);
      if (!cleanUrl) return;

      const card = document.createElement("article");
      card.className = "reel-card reel-card--embed";

      const blockquote = document.createElement("blockquote");
      blockquote.className = "instagram-media";
      blockquote.setAttribute("data-instgrm-permalink", cleanUrl);
      blockquote.setAttribute("data-instgrm-version", "14");
      blockquote.style.width = "100%";
      blockquote.style.minWidth = "0";
      blockquote.style.margin = "0";
      blockquote.style.border = "0";
      blockquote.style.boxShadow = "none";

      blockquote.appendChild(buildEmbedFallback(cleanUrl, index + 1, items.length, config.handle));
      card.appendChild(blockquote);
      track.appendChild(card);
    });

    loadInstagramEmbedScript();
  } else {
    items.forEach((item) => {
      track.appendChild(buildSpotlightReelCard(item));
    });
  }

  buildCarouselDots(track, dotsWrap, track.children.length);
  wireCarouselNavigation(track, prevBtn, nextBtn, dotsWrap);
}

function buildEmbedFallback(url, index, total, handle) {
  const wrap = document.createElement("div");
  wrap.className = "reel-embed-fallback";

  const top = document.createElement("div");
  top.className = "reel-embed-fallback-top";

  const pill = document.createElement("span");
  pill.className = "reel-embed-pill";
  pill.textContent = `Reel ${index} of ${total}`;

  const playBadge = document.createElement("span");
  playBadge.className = "reel-play-badge";
  playBadge.setAttribute("aria-hidden", "true");
  playBadge.appendChild(createPlayIconSvg());
  top.append(pill, playBadge);

  const body = document.createElement("div");
  body.className = "reel-embed-fallback-body";

  const title = document.createElement("strong");
  title.textContent = handle || "@drsowmyasdentalcare";

  const note = document.createElement("span");
  note.textContent = "Patient stories, dental education & gentle smile care from our Teynampet clinic.";
  body.append(title, note);

  const link = document.createElement("a");
  link.className = "reel-embed-link";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Watch Reel on Instagram →";

  wrap.append(top, body, link);
  return wrap;
}

function sanitizeInstagramUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("instagram.com")) {
      return `${parsed.origin}${parsed.pathname}`;
    }
  } catch (_) {
    return null;
  }
  return null;
}

function loadInstagramEmbedScript() {
  const existing = document.querySelector('script[src*="instagram.com/embed.js"]');
  if (existing) {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.instagram.com/embed.js";
  script.addEventListener("load", () => {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  });
  document.body.appendChild(script);
}

function buildSpotlightReelCard(item) {
  const link = document.createElement("a");
  link.className = "reel-card";
  link.href = item.url || "https://www.instagram.com/drsowmyasdentalcare/reels/";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${item.title} — Watch on Instagram`);

  const img = document.createElement("img");
  img.className = "reel-bg-img";
  img.src = item.image;
  img.alt = item.imageAlt || item.title;
  img.loading = "lazy";
  img.decoding = "async";

  const scrim = document.createElement("div");
  scrim.className = "reel-scrim";
  scrim.setAttribute("aria-hidden", "true");

  const topRow = document.createElement("div");
  topRow.className = "reel-top-row";

  const tag = document.createElement("span");
  tag.className = "reel-tag";
  tag.textContent = item.tag;

  const playBadge = document.createElement("span");
  playBadge.className = "reel-play-badge";
  playBadge.setAttribute("aria-hidden", "true");
  playBadge.appendChild(createPlayIconSvg());

  topRow.append(tag, playBadge);

  const content = document.createElement("div");
  content.className = "reel-overlay-content";

  const title = document.createElement("h3");
  title.textContent = item.title;

  const desc = document.createElement("p");
  desc.textContent = item.description;

  const cta = document.createElement("span");
  cta.className = "reel-cta-label";
  cta.textContent = "Watch on @drsowmyasdentalcare →";

  content.append(title, desc, cta);
  link.append(img, scrim, topRow, content);
  return link;
}

function createPlayIconSvg() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  const polygon = document.createElementNS(ns, "polygon");
  polygon.setAttribute("points", "6 4 20 12 6 20 6 4");
  svg.appendChild(polygon);
  return svg;
}

function buildCarouselDots(track, dotsWrap, count) {
  if (!dotsWrap || count <= 1) return;
  dotsWrap.replaceChildren();

  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `reels-dot${i === 0 ? " is-active" : ""}`;
    dot.setAttribute("aria-label", `Go to reel ${i + 1}`);
    dot.addEventListener("click", () => {
      const card = track.children[i];
      if (card) {
        track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      }
    });
    dotsWrap.appendChild(dot);
  }
}

function wireCarouselNavigation(track, prevBtn, nextBtn, dotsWrap) {
  const getStep = () => {
    const firstCard = track.querySelector(".reel-card");
    return firstCard ? firstCard.getBoundingClientRect().width + 20 : 300;
  };

  const syncUi = () => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 6;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 6;

    if (dotsWrap && dotsWrap.children.length) {
      const step = getStep();
      const activeIdx = Math.min(
        dotsWrap.children.length - 1,
        Math.max(0, Math.round(track.scrollLeft / step))
      );
      Array.from(dotsWrap.children).forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === activeIdx);
      });
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });
  }

  track.addEventListener("scroll", syncUi, { passive: true });
  window.addEventListener("resize", syncUi, { passive: true });
  syncUi();
}

/**
 * Accessible FAQ accordion on treatments.html.
 */
function initFaqAccordion() {
  const triggers = document.querySelectorAll("[data-faq-trigger]");
  if (!triggers.length) return;

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (!item) return;

      const isOpen = item.classList.contains("is-open");
      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

/**
 * Keeps footer copyright year accurate.
 */
function initDynamicYear() {
  const el = document.querySelector("[data-year]");
  if (el) {
    el.textContent = String(new Date().getFullYear());
  }
}
