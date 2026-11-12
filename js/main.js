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
  initAppointmentBooking();
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
 * Accessible mobile navigation drawer toggle, backdrop scrim, and quick studio actions.
 */
function initMobileNav() {
  const header = document.querySelector("[data-site-header]");
  const toggleBtn = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-primary-nav]");
  if (!toggleBtn || !nav) return;

  // Inject backdrop scrim and studio quick-action footer once across all pages
  let backdrop = document.querySelector("[data-nav-backdrop]");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("data-nav-backdrop", "");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
  }

  if (!nav.querySelector(".nav-mobile-kicker")) {
    const kicker = document.createElement("div");
    kicker.className = "nav-mobile-kicker";
    kicker.innerHTML = '<span>Teynampet Studio</span><span>Open &middot; Til 8:00 PM</span>';
    nav.insertBefore(kicker, nav.firstChild);
  }

  if (!nav.querySelector(".nav-mobile-meta")) {
    const meta = document.createElement("div");
    meta.className = "nav-mobile-meta";
    meta.innerHTML = `
      <p class="nav-mobile-address">No. 25/11, Cenotoph 2nd Ln, Austin Nagar, Teynampet</p>
      <div class="nav-drawer-actions">
        <a class="nav-drawer-btn nav-drawer-btn--primary" href="tel:+918754516531">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>Call Reception</span>
        </a>
        <a class="nav-drawer-btn nav-drawer-btn--outline" href="https://wa.me/918754516531?text=Hello%20Dr.%20Sowmya%27s%20Dental%20Care%2C%20I%20would%20like%20to%20enquire%20about%20visiting%20the%20clinic." target="_blank" rel="noopener noreferrer">
          <span>WhatsApp</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </a>
      </div>
    `;
    nav.appendChild(meta);
  }

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    document.body.classList.toggle("is-nav-open", open);
    if (header) header.classList.toggle("is-nav-open", open);
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  };

  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    setOpen(!isOpen);
  });

  backdrop.addEventListener("click", () => setOpen(false));

  nav.querySelectorAll("a.nav-link").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
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

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860 && nav.classList.contains("is-open")) {
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
    const cleanUrls = items.map(sanitizeInstagramUrl).filter(Boolean);
    const modal = createReelModal(cleanUrls, config.handle || "@drsowmyasdentalcare");

    cleanUrls.forEach((cleanUrl, index) => {
      const card = document.createElement("article");
      card.className = "reel-card reel-card--embed";

      const viewport = document.createElement("div");
      viewport.className = "reel-embed-viewport";
      viewport.setAttribute("aria-hidden", "true");

      const previewIframe = document.createElement("iframe");
      previewIframe.src = buildReelEmbedSrc(cleanUrl);
      previewIframe.title = `${config.handle || "@drsowmyasdentalcare"} Reel ${index + 1}`;
      previewIframe.tabIndex = -1;
      previewIframe.setAttribute("scrolling", "no");
      viewport.appendChild(previewIframe);

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "reel-card-trigger";
      trigger.setAttribute("aria-label", `Play Instagram Reel ${index + 1} of ${cleanUrls.length}`);

      const bottomBar = document.createElement("div");
      bottomBar.className = "reel-card-bottom";

      const watchLabel = document.createElement("span");
      watchLabel.className = "reel-watch-label";
      watchLabel.appendChild(createPlayIconSvg());
      const watchText = document.createElement("span");
      watchText.textContent = "Watch Reel";
      watchLabel.appendChild(watchText);

      const indexPill = document.createElement("span");
      indexPill.className = "reel-index-pill";
      indexPill.textContent = `${String(index + 1).padStart(2, "0")} / ${String(cleanUrls.length).padStart(2, "0")}`;

      bottomBar.append(watchLabel, indexPill);
      trigger.appendChild(bottomBar);
      trigger.addEventListener("click", () => modal.open(index, trigger));

      card.append(viewport, trigger);
      track.appendChild(card);
    });
  } else {
    items.forEach((item) => {
      track.appendChild(buildSpotlightReelCard(item));
    });
  }

  buildCarouselDots(track, dotsWrap, track.children.length);
  wireCarouselNavigation(track, prevBtn, nextBtn, dotsWrap);
}

function buildReelEmbedSrc(cleanUrl) {
  return `${cleanUrl.replace(/\/+$/, "")}/embed/`;
}

function createReelModal(cleanUrls, handle) {
  const modal = document.createElement("div");
  modal.className = "reel-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Instagram Reel Player");
  modal.setAttribute("data-reel-modal", "");

  const dialog = document.createElement("div");
  dialog.className = "reel-modal-dialog";

  const header = document.createElement("div");
  header.className = "reel-modal-header";

  const title = document.createElement("span");
  title.className = "reel-modal-title";

  const actions = document.createElement("div");
  actions.className = "reel-modal-actions";

  const extLink = document.createElement("a");
  extLink.className = "reel-modal-ext";
  extLink.target = "_blank";
  extLink.rel = "noopener noreferrer";
  extLink.textContent = "Open on Instagram ↗";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "reel-modal-close";
  closeBtn.setAttribute("aria-label", "Close Reel player");
  closeBtn.appendChild(createCloseIconSvg());

  actions.append(extLink, closeBtn);
  header.append(title, actions);

  const stage = document.createElement("div");
  stage.className = "reel-modal-stage";

  const iframe = document.createElement("iframe");
  iframe.className = "reel-modal-iframe";
  iframe.title = "Instagram Reel Player";
  iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share");
  iframe.setAttribute("allowfullscreen", "");
  stage.appendChild(iframe);

  const footer = document.createElement("div");
  footer.className = "reel-modal-footer";

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "reel-modal-nav-btn";
  prevBtn.textContent = "← Previous";

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "reel-modal-nav-btn";
  nextBtn.textContent = "Next →";

  footer.append(prevBtn, nextBtn);
  dialog.append(header, stage, footer);
  modal.appendChild(dialog);
  document.body.appendChild(modal);

  let activeIndex = 0;
  let lastTrigger = null;

  const renderSlide = (index) => {
    activeIndex = Math.max(0, Math.min(cleanUrls.length - 1, index));
    const url = cleanUrls[activeIndex];
    title.textContent = `${handle} · ${activeIndex + 1} / ${cleanUrls.length}`;
    extLink.href = url;
    iframe.src = buildReelEmbedSrc(url);
    prevBtn.disabled = activeIndex === 0;
    nextBtn.disabled = activeIndex === cleanUrls.length - 1;
  };

  const close = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    iframe.src = "about:blank";
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  };

  const open = (index, triggerEl) => {
    lastTrigger = triggerEl || null;
    renderSlide(index);
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => renderSlide(activeIndex - 1));
  nextBtn.addEventListener("click", () => renderSlide(activeIndex + 1));

  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft" && activeIndex > 0) renderSlide(activeIndex - 1);
    if (event.key === "ArrowRight" && activeIndex < cleanUrls.length - 1) renderSlide(activeIndex + 1);
  });

  return { open, close };
}

function createCloseIconSvg() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  const l1 = document.createElementNS(ns, "line");
  l1.setAttribute("x1", "18"); l1.setAttribute("y1", "6"); l1.setAttribute("x2", "6"); l1.setAttribute("y2", "18");
  const l2 = document.createElementNS(ns, "line");
  l2.setAttribute("x1", "6"); l2.setAttribute("y1", "6"); l2.setAttribute("x2", "18"); l2.setAttribute("y2", "18");
  svg.append(l1, l2);
  return svg;
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

/**
 * Appointment booking form handler and WhatsApp redirection.
 * Formats patient details into prefilled text and redirects to WhatsApp.
 */
function initAppointmentBooking() {
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach((inp) => {
    inp.min = today;
  });

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.patient_name ? form.patient_name.value.trim() : "";
    const phone = form.patient_phone ? form.patient_phone.value.trim() : "";
    const service = form.service ? form.service.value : "";
    const date = form.appointment_date ? form.appointment_date.value : "";
    const time = form.appointment_time ? form.appointment_time.value : "";
    const notes = form.notes ? form.notes.value.trim() : "";

    if (!name || !phone || !service || !date) {
      alert("Please fill in your name, phone number, treatment, and preferred date.");
      return;
    }

    let formattedDate = date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split("-");
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const mIdx = parseInt(month, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        formattedDate = `${parseInt(day, 10)} ${monthNames[mIdx]} ${year}`;
      }
    }

    let message = "Hello Dr. Sowmya's Dental Care, I would like to book an appointment.\n\n" +
      "Patient Details:\n" +
      "Name: " + name + "\n" +
      "Phone: " + phone + "\n" +
      "Treatment: " + service + "\n" +
      "Preferred Date: " + formattedDate + "\n" +
      "Preferred Time: " + time;
    if (notes) {
      message += "\nNotes: " + notes;
    }

    const waUrl = "https://wa.me/918754516531?text=" + encodeURIComponent(message);
    const win = window.open(waUrl, "_blank");
    if (!win) {
      window.location.href = waUrl;
    }
  };

  document.addEventListener("submit", (e) => {
    if (e.target.matches("[data-appointment-form]")) {
      handleBookingSubmit(e);
    }
  });

  // Modal setup
  const ensureModal = () => {
    let modal = document.querySelector("[data-booking-modal]");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "booking-modal";
    modal.setAttribute("data-booking-modal", "");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "modal-book-title");
    modal.innerHTML = `
      <div class="booking-modal-content">
        <button class="booking-modal-close" type="button" data-close-booking aria-label="Close booking modal">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="booking-modal-header">
          <span class="eyebrow" style="margin-bottom: 6px;">Direct Scheduling</span>
          <h2 id="modal-book-title">Book An Appointment</h2>
          <p>Fill in your details below to confirm your appointment via WhatsApp.</p>
        </div>
        <form class="appointment-form" data-appointment-form>
          <div class="form-row">
            <div class="form-group">
              <label for="modal-name">Patient Full Name *</label>
              <input type="text" id="modal-name" name="patient_name" placeholder="Enter your full name" required autocomplete="name">
            </div>
            <div class="form-group">
              <label for="modal-phone">Phone Number *</label>
              <input type="tel" id="modal-phone" name="patient_phone" placeholder="e.g. 9876543210" required autocomplete="tel">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="modal-service">Treatment Needed *</label>
              <select id="modal-service" name="service" required>
                <option value="" disabled selected>Select dental treatment</option>
                <option value="Dental Implants">Dental Implants</option>
                <option value="Dental Braces">Dental Braces</option>
                <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                <option value="Gum Care">Gum Care</option>
                <option value="Preventive Care">Preventive Care</option>
                <option value="Root Canal Treatment">Root Canal Treatment</option>
                <option value="General Consultation">General Consultation</option>
              </select>
            </div>
            <div class="form-group">
              <label for="modal-date">Preferred Date *</label>
              <input type="date" id="modal-date" name="appointment_date" min="${today}" required>
            </div>
          </div>
          <div class="form-group">
            <label for="modal-time">Preferred Time Slot *</label>
            <select id="modal-time" name="appointment_time" required>
              <option value="Morning (10:00 AM to 1:00 PM)">Morning (10:00 AM to 1:00 PM)</option>
              <option value="Afternoon (1:00 PM to 4:00 PM)">Afternoon (1:00 PM to 4:00 PM)</option>
              <option value="Evening (4:00 PM to 8:00 PM)">Evening (4:00 PM to 8:00 PM)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="modal-notes">Dental Concern or Notes (Optional)</label>
            <textarea id="modal-notes" name="notes" rows="3" placeholder="Briefly describe your concern or any questions..."></textarea>
          </div>
          <button class="btn btn--forest btn--full" type="submit">
            <span>Confirm &amp; Book via WhatsApp</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </button>
          <p class="form-disclaimer">Your appointment request will open in WhatsApp with these details prefilled.</p>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest("[data-close-booking]")) {
        closeModal();
      }
    });

    return modal;
  };

  const openModal = () => {
    const modal = ensureModal();
    modal.classList.add("is-open");
    document.body.classList.add("is-booking-open");
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    const modal = document.querySelector("[data-booking-modal]");
    if (modal) {
      modal.classList.remove("is-open");
    }
    document.body.classList.remove("is-booking-open");
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-booking]");
    if (!btn) return;
    const targetSection = document.getElementById("book-appointment");
    if (targetSection && !btn.hasAttribute("data-force-modal")) {
      e.preventDefault();
      targetSection.scrollIntoView({ behavior: "smooth" });
      const firstInput = targetSection.querySelector("input");
      if (firstInput) firstInput.focus();
    } else {
      e.preventDefault();
      openModal();
    }
  });
}
