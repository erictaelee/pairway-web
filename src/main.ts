/**
 * Pairway landing page interactivity.
 * No backend / no build-time data — everything here is client-only.
 */

const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle") as HTMLButtonElement | null;
const navLinks = document.getElementById("nav-links");
const yearEl = document.getElementById("year");

// ---------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// ---------------------------------------------------------------
// Header appearance
//
// The header renders light (white logo + links) only while resting at the
// very top of the dark hero. As soon as the page scrolls it becomes the
// solid white bar, so hero content never slides under transparent white
// text. Checking the hero's real position (rather than scroll alone) keeps
// deep links landing in the right state on first paint.
// ---------------------------------------------------------------
const hero = document.querySelector<HTMLElement>(".hero");

function updateHeaderState(): void {
  if (!header) return;
  const atTop = window.scrollY <= 8;
  const overHero = hero
    ? hero.getBoundingClientRect().bottom > header.offsetHeight
    : false;
  header.classList.toggle("is-over-hero", atTop && overHero);
  header.classList.toggle("is-scrolled", !atTop);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", updateHeaderState, { passive: true });
window.addEventListener("load", updateHeaderState);
window.addEventListener("hashchange", updateHeaderState);

// ---------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------
function closeMobileNav(): void {
  navToggle?.setAttribute("aria-expanded", "false");
  navLinks?.classList.remove("is-open");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open", !isOpen);
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

// ---------------------------------------------------------------
// Active nav link highlighting based on section in view
// ---------------------------------------------------------------
const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
const navAnchors = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]')
);

if (sections.length && navAnchors.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navAnchors.forEach((anchor) => {
          anchor.classList.toggle("is-active", anchor.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// ---------------------------------------------------------------
// Scroll-reveal animations
// ---------------------------------------------------------------
const revealEls = document.querySelectorAll<HTMLElement>(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: no IntersectionObserver support, just show everything.
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// ---------------------------------------------------------------
// Team avatars: fall back to initials if a photo hasn't been added yet
// ---------------------------------------------------------------
document.querySelectorAll<HTMLImageElement>(".avatar img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.display = "none";
  }, { once: true });
});

// ---------------------------------------------------------------
// Launch-list signup
//
// A static page can't send mail itself, so the address is POSTed to a form
// endpoint (Formspree, Basin, Getform, Web3Forms — they all accept a JSON
// POST), which forwards it to updates@pairwaygolf.com.
//
// SET SIGNUP_ENDPOINT BEFORE LAUNCH. Create a form on one of those services
// with updates@pairwaygolf.com as the destination and paste the URL below.
// Until it's set there is nowhere to send the address, so the form says so
// rather than pretending to have signed the visitor up.
// ---------------------------------------------------------------
const SIGNUP_ENDPOINT = "https://formspree.io/f/mnpqzrvd";
const SIGNUP_ADDRESS = "updates@pairwaygolf.com";

const signupForm = document.getElementById("signup-form") as HTMLFormElement | null;
const signupInput = document.getElementById("signup-email") as HTMLInputElement | null;
const signupButton = document.getElementById("signup-button") as HTMLButtonElement | null;
const signupStatus = document.getElementById("signup-status");
const signupTrap = document.getElementById("signup-company") as HTMLInputElement | null;

function setSignupStatus(message: string, isError: boolean): void {
  if (!signupStatus) return;
  signupStatus.textContent = message;
  signupStatus.classList.toggle("is-error", isError);
}

function reportUnconfigured(): void {
  console.warn(
    "[pairway] SIGNUP_ENDPOINT is not set in src/main.ts — signups are not being collected."
  );
  setSignupStatus(
    `Our signup form isn't live yet — email ${SIGNUP_ADDRESS} and we'll add you.`,
    true
  );
}

async function submitSignup(email: string): Promise<void> {
  if (!signupForm) return;

  signupButton?.setAttribute("disabled", "true");
  setSignupStatus("Adding you…", false);

  try {
    const response = await fetch(SIGNUP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, _subject: "New Pairway Golf signup" }),
    });

    if (!response.ok) {
      // Formspree replies { errors: [{ field?, message }] } — surface the
      // real reason (blocked address, form paused) instead of a generic one.
      const detail = await response
        .json()
        .then((data) => data?.errors?.[0]?.message as string | undefined)
        .catch(() => undefined);
      throw new Error(detail ?? `Signup failed: ${response.status}`);
    }

    signupForm.reset();
    setSignupStatus(
      "Thank you for your interest. We'll email you the moment we launch.",
      false
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    setSignupStatus(
      detail && !detail.startsWith("Signup failed")
        ? `${detail} You can also email ${SIGNUP_ADDRESS}.`
        : `Something went wrong. Email us at ${SIGNUP_ADDRESS} and we'll add you.`,
      true
    );
  } finally {
    signupButton?.removeAttribute("disabled");
  }
}

// "Join the waitlist" buttons scroll to the form; put the cursor in the
// email field when they arrive so the next step is just typing.
document.querySelectorAll<HTMLAnchorElement>('a[href="#download"]').forEach((link) => {
  link.addEventListener("click", () => {
    window.setTimeout(() => signupInput?.focus({ preventScroll: true }), 500);
  });
});

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!signupInput) return;

  // Honeypot: bots fill hidden fields, people don't.
  if (signupTrap?.value) return;

  const email = signupInput.value.trim();

  if (!email || !signupInput.checkValidity()) {
    signupInput.setAttribute("aria-invalid", "true");
    setSignupStatus("Please enter a valid email address.", true);
    signupInput.focus();
    return;
  }

  signupInput.removeAttribute("aria-invalid");

  if (SIGNUP_ENDPOINT) {
    void submitSignup(email);
  } else {
    reportUnconfigured();
  }
});
