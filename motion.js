/*
  ✨ 움직임 효과 (고칠 필요 없어요)
  1) 스크롤 등장: 화면에 들어오는 제목·카드·그림이 아래에서 스르륵 올라와요.
  2) 흐르는 브랜드 띠: 브랜드 이름이 옆으로 계속 흘러가요.
  - 휴대폰·컴퓨터에서 "동작 줄이기"를 켠 사람에게는 움직임 없이 그대로 보여줘요.
*/
(function () {
  const 움직임줄이기 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 2) 흐르는 브랜드 띠 ── */
  document.querySelectorAll(".브랜드목록").forEach(function (목록) {
    if (움직임줄이기) return;
    const 원본 = Array.from(목록.children);
    if (!원본.length) return;
    목록.classList.add("흐르는중"); // 한 줄로 펼쳐서 길이를 재요
    const 화면폭 = Math.max(window.innerWidth, 1200);
    // 한 바퀴 분량이 화면보다 넓어질 때까지 이름을 이어 붙여요
    let 한바퀴 = 원본.slice();
    while (목록.scrollWidth < 화면폭 && 한바퀴.length < 200) {
      원본.forEach(function (항목) {
        const 복사 = 항목.cloneNode(true);
        복사.setAttribute("aria-hidden", "true");
        목록.appendChild(복사);
        한바퀴.push(복사);
      });
    }
    // 똑같은 묶음을 한 번 더 붙여서 끊김 없이 이어지게 해요
    한바퀴.forEach(function (항목) {
      const 복사 = 항목.cloneNode(true);
      복사.setAttribute("aria-hidden", "true");
      목록.appendChild(복사);
    });
    const 초 = Math.max(18, 한바퀴.length * 3.2);
    목록.style.setProperty("--흐름시간", 초 + "s");
  });

  /* ── 1) 스크롤 등장 ── */
  if (움직임줄이기 || !("IntersectionObserver" in window)) return;

  const 대상 = [
    ".첫화면 > div:first-child > *", ".대표그림",
    ".상세머리 > *",
    ".브랜드띠",
    ".구역 .번호", ".구역 h2", ".소개제목", ".소개글", ".구역 .설명", ".기준", ".소제목",
    ".카드", ".사진", ".프로젝트", ".단계", ".비용표", ".안내상자", ".연락처", ".가치",
    ".캐릭터", ".구역 .버튼들", ".구역 .안쪽 > .버튼", ".구역 .안쪽 > div > .버튼",
    "footer > *"
  ].join(",");

  const 요소들 = Array.from(document.querySelectorAll(대상));
  요소들.forEach(function (요소) {
    // 같은 줄에 나란히 있는 카드끼리는 조금씩 늦게 나타나요
    const 형제 = Array.from(요소.parentElement.children).filter(function (x) { return 요소들.includes(x); });
    const 순서 = Math.min(형제.indexOf(요소), 6);
    요소.style.setProperty("--등장지연", (순서 * 0.08) + "s");
    요소.classList.add("등장대기");
  });

  const 관찰자 = new IntersectionObserver(function (항목들) {
    항목들.forEach(function (항목) {
      if (!항목.isIntersecting) return;
      항목.target.classList.add("등장");
      관찰자.unobserve(항목.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  요소들.forEach(function (요소) { 관찰자.observe(요소); });

  // 혹시 관찰이 늦어져도 3초 뒤엔 모두 보이게 해요 (안전장치)
  setTimeout(function () {
    요소들.forEach(function (요소) {
      const 위치 = 요소.getBoundingClientRect();
      if (위치.top < window.innerHeight) 요소.classList.add("등장");
    });
  }, 3000);
})();
