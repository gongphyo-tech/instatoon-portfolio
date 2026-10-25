/*
  ✨ 움직임 · 편의 기능 (고칠 필요 없어요)
  1) 예전 주소 연결: 예전 메뉴 주소(#작가소개 등)로 들어오면 새 위치로 옮겨줘요.
  2) 스크롤 등장: 화면에 들어오는 제목·카드·그림이 아래에서 스르륵 올라와요.
  3) 흐르는 브랜드 띠
  4) 지금 보고 있는 메뉴 표시 · 맨 위로 버튼
  5) 협업 프로젝트 필터 (전체 / 게시물툰 / 릴스툰)
  6) 사진 크게 보기
  - "동작 줄이기"를 켠 사람에게는 움직임 없이 그대로 보여줘요.
*/
(function () {
  const 움직임줄이기 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1) 예전 주소 연결 ── */
  const 예전주소 = {
    "작가소개": "about", "소개": "about",
    "최근프로젝트": "stats", "도달률": "stats",
    "인사이트": "insights", "프로젝트": "projects",
    "견적서계약서": "pricing", "유의사항": "process",
  };
  function 예전주소확인() {
    const 해시 = decodeURIComponent(location.hash.slice(1));
    if (!예전주소[해시]) return;
    history.replaceState(null, "", "#" + 예전주소[해시]);
    const 목표 = document.getElementById(예전주소[해시]);
    if (목표) setTimeout(function () { 목표.scrollIntoView(); }, 0);
  }
  예전주소확인();
  window.addEventListener("hashchange", 예전주소확인);

  /* ── 3) 흐르는 브랜드 띠 ── */
  document.querySelectorAll(".band-list").forEach(function (목록) {
    if (움직임줄이기) return;
    const 원본 = Array.from(목록.children);
    if (!원본.length) return;
    목록.classList.add("running");
    const 화면폭 = Math.max(window.innerWidth, 1200);
    const 한바퀴 = 원본.slice();
    while (목록.scrollWidth < 화면폭 && 한바퀴.length < 200) {
      원본.forEach(function (항목) { const c = 항목.cloneNode(true); c.setAttribute("aria-hidden", "true"); 목록.appendChild(c); 한바퀴.push(c); });
    }
    한바퀴.forEach(function (항목) { const c = 항목.cloneNode(true); c.setAttribute("aria-hidden", "true"); 목록.appendChild(c); });
    목록.style.setProperty("--band-time", Math.max(20, 한바퀴.length * 3) + "s");
  });

  /* ── 4) 지금 보고 있는 메뉴 표시 · 맨 위로 버튼 ── */
  const 머리 = document.querySelector(".site-header");
  const 위로 = document.querySelector(".to-top");
  const 메뉴링크 = Array.from(document.querySelectorAll(".nav a, .mobile-nav a"));
  const 구역들 = Array.from(new Set(메뉴링크.map(function (a) { return a.getAttribute("href"); })))
    .map(function (h) { return document.querySelector(h); }).filter(Boolean);
  function 스크롤확인() {
    const y = window.scrollY;
    if (머리) 머리.classList.toggle("scrolled", y > 8);
    if (위로) 위로.classList.toggle("show", y > 600);
    let 현재 = null;
    구역들.forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight * 0.35) 현재 = s.id; });
    메뉴링크.forEach(function (a) {
      const on = a.getAttribute("href") === "#" + 현재;
      a.classList.toggle("active", on);
      if (on && a.closest(".mobile-nav")) {
        const 메뉴 = a.parentElement;
        const 왼쪽 = a.offsetLeft - (메뉴.clientWidth - a.offsetWidth) / 2;
        if (Math.abs(메뉴.scrollLeft - 왼쪽) > 40) 메뉴.scrollTo({ left: 왼쪽, behavior: 움직임줄이기 ? "auto" : "smooth" });
      }
    });
  }
  window.addEventListener("scroll", 스크롤확인, { passive: true });
  스크롤확인();

  /* ── 5) 협업 프로젝트 필터 ── */
  const 필터들 = document.querySelectorAll(".filter");
  필터들.forEach(function (버튼) {
    버튼.addEventListener("click", function () {
      const 종류 = 버튼.dataset.filter;
      필터들.forEach(function (b) { b.setAttribute("aria-pressed", String(b === 버튼)); });
      document.querySelectorAll(".project").forEach(function (카드) {
        카드.hidden = !(종류 === "all" || 카드.dataset.type === 종류);
      });
      const 줄 = document.querySelector(".project-grid");
      if (줄) 줄.scrollLeft = 0;
    });
  });

  /* ── 6) 사진 크게 보기 ── */
  const 창 = document.querySelector(".lightbox");
  document.querySelectorAll("[data-zoom]").forEach(function (버튼) {
    if (!버튼.dataset.zoom) { 버튼.hidden = true; return; }
    버튼.hidden = false;
    버튼.addEventListener("click", function () {
      if (!창 || typeof 창.showModal !== "function") { window.open(버튼.dataset.zoom, "_blank"); return; }
      const 그림 = 창.querySelector("img");
      그림.src = 버튼.dataset.zoom;
      그림.alt = 버튼.dataset.caption || "인사이트 원본";
      창.querySelector(".lightbox-caption").textContent = 버튼.dataset.caption || "";
      창.showModal();
    });
  });
  if (창) 창.addEventListener("click", function (e) { if (e.target === 창) 창.close(); });

  /* ── 2) 스크롤 등장 ── */
  if (움직임줄이기 || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".chart").forEach(function (c) { c.classList.add("in"); });
    return;
  }
  const 대상 = [
    ".hero-copy > *", ".hero-art", ".brand-band",
    ".section-head > *", ".section-head.with-char > div > *",
    ".card", ".gallery-item", ".sub-title", ".pitch", ".filters", ".quote-app", ".callout",
    ".section .btn-row", ".contact-char", ".contact-lines",
  ].join(",");
  const 요소들 = Array.from(document.querySelectorAll(대상 + ", .project-grid")).filter(function (el) {
    if (el.closest(".quote-app .card") && !el.matches(".quote-app")) return false; // 견적표 안쪽 카드는 견적표와 함께 나타나요
    if (el.matches(".project")) return false; // 프로젝트 카드는 묶음 전체가 한 번에 나타나요 (휴대폰에서 옆으로 밀어도 보이도록)
    return true;
  });
  요소들.forEach(function (요소) {
    const 형제 = Array.from(요소.parentElement.children).filter(function (x) { return 요소들.includes(x); });
    요소.style.setProperty("--delay", (Math.min(형제.indexOf(요소), 5) * 0.07) + "s");
    요소.classList.add("reveal");
  });
  const 관찰자 = new IntersectionObserver(function (항목들) {
    항목들.forEach(function (항목) {
      if (!항목.isIntersecting) return;
      항목.target.classList.add("in");
      관찰자.unobserve(항목.target);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
  요소들.forEach(function (요소) { 관찰자.observe(요소); });
  // 안전장치: 혹시 관찰이 늦어져도 화면 안에 있는 건 2.5초 뒤 모두 보여요
  setTimeout(function () {
    요소들.forEach(function (요소) { if (요소.getBoundingClientRect().top < window.innerHeight) 요소.classList.add("in"); });
  }, 2500);
})();
