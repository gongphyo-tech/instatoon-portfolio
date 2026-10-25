/*
  ================================================================
  ✏️ 링크 모음 — 링크를 바꾸고 싶으면 여기만 고치세요!
  ================================================================
  - 홈페이지의 모든 버튼이 여기 주소를 써요.
  - 따옴표(" ") 안의 주소만 새 주소로 바꿔서 붙여넣고 저장하면 끝이에요.
  - 따옴표, 쉼표(,)는 지우지 마세요.
  - 주소를 비워 두면("") 그 버튼은 화면에서 숨겨져요.
*/
const 링크모음 = {
  // 견적 · 계약 · 안내 (노션)
  광고견적서:   "https://app.notion.com/p/greego_toon-26-8-1-39e349728d4580b281beff65cdde88ec?source=copy_link",
  표준계약서:   "https://app.notion.com/p/402349728d4580dc8f99c2813242d682?source=copy_link", // 모든 작가 포트폴리오 공통 서식
  제작프로세스: "https://sepia-typhoon-102.notion.site/2a1349728d45805b98d8fce4f72bb856?source=copy_link",
  유의사항:     "https://sepia-typhoon-102.notion.site/1f9349728d45806ca2e9cb543baa8bf4?source=copy_link",

  // SNS
  인스타그램:   "https://www.instagram.com/greego_toon/",
  인스타DM:     "https://ig.me/m/greego_toon", // 누르면 그리고툰 DM 창이 바로 열려요
  스레드:       "https://www.threads.com/@greego_toon",

  // 협업 프로젝트 — 인스타그램 게시물 주소 (게시물이 내려가면 "" 로 비워 주세요)
  훤우추석:     "https://www.instagram.com/p/DdPyrxTn4NQ/",
  림데이:       "https://www.instagram.com/p/DbmPfKYH1OB/",
  한율:         "https://www.instagram.com/reel/DRtOVNtkXzz/",
  아이엔젤:     "https://www.instagram.com/reel/DSNAS1NEdOK/",
  // 오브먼트(2026.7.14 게시물): 2026-10-25 확인 시 열리지 않아 뺐어요. 예전 주소 https://www.instagram.com/p/DayvJkyH0pA/
};

/* 아래는 버튼에 주소를 연결해 주는 부분이에요 (고칠 필요 없어요) */
document.querySelectorAll("[data-link]").forEach(function (버튼) {
  const 주소 = 링크모음[버튼.dataset.link];
  if (!주소) { 버튼.hidden = true; return; }
  버튼.href = 주소;
  if (주소.startsWith("http")) {
    버튼.target = "_blank";
    버튼.rel = "noopener";
  } else {
    버튼.removeAttribute("target");
  }
});

/* 📋 복사 버튼: data-copy="..." 가 붙은 버튼을 누르면 그 글자를 복사하고 "복사되었습니다"를 보여줘요 (고칠 필요 없어요) */
(function () {
  const 알림 = document.createElement("div");
  알림.className = "toast";
  알림.setAttribute("role", "status");
  document.body.appendChild(알림);
  let 타이머;

  function 알림보이기(글자) {
    알림.textContent = 글자;
    알림.classList.add("show");
    clearTimeout(타이머);
    타이머 = setTimeout(function () { 알림.classList.remove("show"); }, 2000);
  }

  function 옛날방식복사(글자) {
    const 칸 = document.createElement("textarea");
    칸.value = 글자;
    칸.setAttribute("readonly", "");
    칸.style.position = "fixed";
    칸.style.opacity = "0";
    document.body.appendChild(칸);
    칸.select();
    let 성공 = false;
    try { 성공 = document.execCommand("copy"); } catch (e) {}
    칸.remove();
    return 성공;
  }

  document.querySelectorAll("[data-copy]").forEach(function (버튼) {
    버튼.addEventListener("click", function () {
      const 글자 = 버튼.dataset.copy;
      const 끝 = function (성공) {
        알림보이기(성공 ? "✅ 복사되었습니다" : "메일 주소: " + 글자);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(글자).then(function () { 끝(true); }, function () { 끝(옛날방식복사(글자)); });
      } else {
        끝(옛날방식복사(글자));
      }
    });
  });
})();
