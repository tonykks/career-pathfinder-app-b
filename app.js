/**
 * App B - Career Interest Explorer용 실행 로직
 */

document.addEventListener('DOMContentLoaded', () => {
  // State Object
  const state = {
    currentQuestionIdx: 0,
    answers: {} // { questionId: score }
  };

  // DOM Elements
  const sectionIntro = document.getElementById('section-intro');
  const sectionRating = document.getElementById('section-rating');
  const sectionResult = document.getElementById('section-result');

  const btnStart = document.getElementById('btn-start');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnRestart = document.getElementById('btn-restart');
  const btnExportReport = document.getElementById('btn-export-report');

  const progressText = document.getElementById('progress-text');
  const progressFill = document.getElementById('progress-fill');
  const questionText = document.getElementById('question-text');
  const choicesContainer = document.getElementById('choices-container') || document.querySelector('.choices-container');

  const topDomainsContainer = document.getElementById('top-domains-container');
  const scoresChartContainer = document.getElementById('scores-chart-container');
  const disclaimerContainer = document.getElementById('disclaimer-container');
  const sourcesContainer = document.getElementById('sources-container');

  // Load Intro Disclaimer & Sources
  if (disclaimerContainer) disclaimerContainer.innerText = DISCLAIMER;
  if (sourcesContainer) {
    sourcesContainer.innerHTML = '공식 출처: ' + SOURCES.map(s => `<a href="${s.link}" target="_blank" rel="noopener">${s.name}</a>`).join(' | ');
  }

  // Render Current Slide Question
  function renderQuestion() {
    const q = QUESTIONS[state.currentQuestionIdx];
    questionText.innerText = `${q.id}. ${q.text}`;

    // Update Progress
    const totalQ = QUESTIONS.length;
    const currentNum = state.currentQuestionIdx + 1;
    progressText.innerText = `${currentNum} / ${totalQ}`;
    progressFill.style.width = `${(currentNum / totalQ) * 100}%`;

    // Clear and Select Choice Option
    const selectedScore = state.answers[q.id] || null;
    const choiceOptions = choicesContainer.querySelectorAll('.choice-option');
    choiceOptions.forEach(opt => {
      opt.classList.remove('active');
      const score = parseInt(opt.getAttribute('data-score'), 10);
      if (score === selectedScore) {
        opt.classList.add('active');
      }
    });

    // Update Nav Buttons
    btnPrev.disabled = state.currentQuestionIdx === 0;
    if (state.currentQuestionIdx === totalQ - 1) {
      btnNext.innerHTML = '<span>결과 분석하기</span> <i class="fa-solid fa-square-poll-vertical"></i>';
    } else {
      btnNext.innerHTML = '<span>다음 질문</span> <i class="fa-solid fa-arrow-right"></i>';
    }

    // Toggle Next activation depending on answer selection
    btnNext.disabled = selectedScore === null;
  }

  // Choice Options Click Handler
  choicesContainer.querySelectorAll('.choice-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const q = QUESTIONS[state.currentQuestionIdx];
      const score = parseInt(opt.getAttribute('data-score'), 10);
      state.answers[q.id] = score;

      // Update Visuals
      choicesContainer.querySelectorAll('.choice-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      btnNext.disabled = false;
    });
  });

  // Calculate top 2 and sort domains by score & tie-breaker rules
  function calculateResults() {
    const domainScores = {};
    const domainCount5 = {};
    const domainMaxScore = {};

    // Initialize counters
    Object.keys(DOMAINS).forEach(dId => {
      domainScores[dId] = 0;
      domainCount5[dId] = 0;
      domainMaxScore[dId] = 0;
    });

    // Sum ratings and collect criteria
    QUESTIONS.forEach(q => {
      const rating = state.answers[q.id] || 3;
      domainScores[q.domainId] += rating;
      if (rating === 5) {
        domainCount5[q.domainId] += 1;
      }
      if (rating > domainMaxScore[q.domainId]) {
        domainMaxScore[q.domainId] = rating;
      }
    });

    // Compute average (sum / 3.0)
    const domainAverages = {};
    Object.keys(DOMAINS).forEach(dId => {
      domainAverages[dId] = domainScores[dId] / 3.0;
    });

    // Sort domains: 1) Average Score, 2) Count of 5 ratings, 3) Max score, 4) Fixed Order (I > R > A > S > E > C)
    const fixedOrder = ['i', 'r', 'a', 's', 'e', 'c'];
    const sortedDomainIds = Object.keys(DOMAINS).sort((a, b) => {
      if (Math.abs(domainAverages[b] - domainAverages[a]) > 0.0001) {
        return domainAverages[b] - domainAverages[a];
      }
      if (domainCount5[b] !== domainCount5[a]) {
        return domainCount5[b] - domainCount5[a];
      }
      if (domainMaxScore[b] !== domainMaxScore[a]) {
        return domainMaxScore[b] - domainMaxScore[a];
      }
      return fixedOrder.indexOf(a) - fixedOrder.indexOf(b);
    });

    return sortedDomainIds.map(dId => ({
      domain: DOMAINS[dId],
      average: domainAverages[dId]
    }));
  }

  // Render results
  function renderResults(sortedResults) {
    topDomainsContainer.innerHTML = '';
    scoresChartContainer.innerHTML = '';

    // 1. Render Top 2 domain cards
    const ranks = ['first', 'second'];
    const rankTitles = ['최우수 관심영역 (1순위)', '우수 관심영역 (2순위)'];

    for (let i = 0; i < 2; i++) {
      const { domain, average } = sortedResults[i];
      const card = document.createElement('div');
      card.className = 'domain-card';
      card.innerHTML = `
        <div class="rank-badge ${ranks[i]}">${rankTitles[i]}</div>
        <div class="domain-header">
          <span class="domain-icon">${domain.icon}</span>
          <div class="domain-names">
            <span class="domain-title-ko">${domain.name} (${average.toFixed(1)}점)</span>
            <span class="domain-title-en">${domain.originalName}</span>
          </div>
        </div>
        <p class="domain-desc">${domain.description}</p>
        
        <div class="domain-subsection">
          <h4 class="subsection-title"><i class="fa-solid fa-circle-check"></i> 해볼 만한 탐색 활동</h4>
          <ul class="activities-list">
            ${domain.typicalActivities.map(act => `<li>${act}</li>`).join('')}
          </ul>
        </div>

        <div class="domain-subsection">
          <h4 class="subsection-title"><i class="fa-solid fa-graduation-cap"></i> 관련 학습 분야</h4>
          <div class="badge-container">
            ${domain.learningFields.split(', ').map(f => `<span class="result-badge">${f}</span>`).join('')}
          </div>
        </div>

        <div class="domain-subsection">
          <h4 class="subsection-title"><i class="fa-solid fa-briefcase"></i> 대표 직업군 사례</h4>
          <div class="badge-container">
            ${domain.typicalJobs.map(j => `<span class="result-badge job">${j}</span>`).join('')}
          </div>
        </div>

        <div class="domain-subsection" style="margin-bottom: 0;">
          <h4 class="subsection-title"><i class="fa-solid fa-lightbulb"></i> 다음 행동 제안</h4>
          <p class="advice-text">${domain.nextStepAdvice}</p>
        </div>
      `;
      topDomainsContainer.appendChild(card);
    }

    // 2. Render all 6 scores bar chart
    const colors = {
      r: 'linear-gradient(90deg, #F87171, #EF4444)',
      i: 'linear-gradient(90deg, #60A5FA, #3B82F6)',
      a: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
      s: 'linear-gradient(90deg, #34D399, #10B981)',
      e: 'linear-gradient(90deg, #F472B6, #EC4899)',
      c: 'linear-gradient(90deg, #A78BFA, #8B5CF6)'
    };

    sortedResults.forEach(res => {
      const d = res.domain;
      const score = res.average;
      const percent = (score / 5.0) * 100;

      const row = document.createElement('div');
      row.className = 'score-row';
      row.innerHTML = `
        <span class="score-name">${d.icon} ${d.name.split(' ')[0]}</span>
        <div class="score-track">
          <div class="score-fill" style="width: ${percent}%; background: ${colors[d.id]};"></div>
        </div>
        <span class="score-value">${score.toFixed(1)}점</span>
      `;
      scoresChartContainer.appendChild(row);
    });
  }

  // Navigation Event Listeners
  btnStart.addEventListener('click', () => {
    state.currentQuestionIdx = 0;
    state.answers = {};
    sectionIntro.classList.remove('active');
    sectionRating.classList.add('active');
    renderQuestion();
  });

  btnPrev.addEventListener('click', () => {
    if (state.currentQuestionIdx > 0) {
      state.currentQuestionIdx -= 1;
      renderQuestion();
    }
  });

  btnNext.addEventListener('click', () => {
    const totalQ = QUESTIONS.length;
    if (state.currentQuestionIdx === totalQ - 1) {
      // Finished all Qs -> Show Results
      const sortedResults = calculateResults();
      renderResults(sortedResults);
      sectionRating.classList.remove('active');
      sectionResult.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      state.currentQuestionIdx += 1;
      renderQuestion();
    }
  });

  btnRestart.addEventListener('click', () => {
    sectionResult.classList.remove('active');
    sectionIntro.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Modal Elements for App B Export
  const modalExport = document.getElementById('modal-export');
  const btnModalClose = document.getElementById('btn-modal-close');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const studentNameInput = document.getElementById('student-name');
  const modalValidationMsg = document.getElementById('modal-validation-msg');
  const btnFmtPng = document.getElementById('btn-fmt-png');
  const btnFmtPdf = document.getElementById('btn-fmt-pdf');
  const btnDownloadExecute = document.getElementById('btn-download-execute');

  let exportFormat = 'png'; // default

  // Format selection toggle
  btnFmtPng.addEventListener('click', () => {
    exportFormat = 'png';
    btnFmtPng.classList.add('active');
    btnFmtPdf.classList.remove('active');
  });

  btnFmtPdf.addEventListener('click', () => {
    exportFormat = 'pdf';
    btnFmtPdf.classList.add('active');
    btnFmtPng.classList.remove('active');
  });

  // Open modal
  btnExportReport.addEventListener('click', () => {
    modalExport.classList.add('active');
    studentNameInput.value = '';
    modalValidationMsg.style.display = 'none';
    studentNameInput.focus();
  });

  // Close modal
  function closeModal() {
    modalExport.classList.remove('active');
  }
  btnModalClose.addEventListener('click', closeModal);
  btnModalCancel.addEventListener('click', closeModal);

  // Execute Download (Both PNG/PDF supported correctly)
  btnDownloadExecute.addEventListener('click', async () => {
    const rawName = studentNameInput.value.trim();
    if (!rawName) {
      modalValidationMsg.innerText = '다운로드를 위해 학생 이름 또는 닉네임을 입력해 주세요.';
      modalValidationMsg.style.display = 'block';
      studentNameInput.focus();
      return;
    }
    modalValidationMsg.style.display = 'none';

    btnDownloadExecute.disabled = true;
    btnDownloadExecute.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 생성 중...';

    const name = rawName || '익명 학생';

    // Clone element for printing
    const printArea = document.createElement('div');
    printArea.style.padding = '40px';
    printArea.style.background = '#0F111A';
    printArea.style.color = '#F3F4F6';
    printArea.style.fontFamily = "'Noto Sans KR', sans-serif";

    const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

    printArea.innerHTML = `
      <div style="border-bottom: 2px solid #2D324D; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 24px; color: #FFFFFF; margin: 0;">${name} 님의 진로 관심 탐색 결과 리포트</h1>
        <p style="font-size: 14px; color: #9CA3AF; margin: 5px 0 0 0;">진행형식: [App B - Intent] 홀랜드 흥미유형 탐색기 | 생성일: ${dateStr}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; color: #FFFFFF; border-left: 4px solid #8B5CF6; padding-left: 10px; margin-bottom: 15px;">나의 Top 2 진로 관심 성향</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          ${topDomainsContainer.innerHTML}
        </div>
      </div>

      <div style="margin-bottom: 30px; page-break-before: always;">
        <h2 style="font-size: 18px; color: #FFFFFF; border-left: 4px solid #8B5CF6; padding-left: 10px; margin-bottom: 15px;">전체 6대 관심영역 분석 평점</h2>
        <div style="background: #1A1D2C; padding: 20px; border-radius: 12px; border: 1px solid #2D324D;">
          ${scoresChartContainer.innerHTML}
        </div>
      </div>

      <div style="margin-top: 50px; font-size: 11px; color: #9CA3AF; line-height: 1.6; border-top: 1px solid #2D324D; padding-top: 20px;">
        <p>※ 본 리포트는 행동·상황 중심 질문에 근거하여 평점을 계산한 교육용 참고용 간이 탐색 결과입니다.</p>
        <p>※ ${DISCLAIMER}</p>
        <p>※ 공식 참고자료: 커리어넷(www.career.go.kr) | 고용24(www.work24.go.kr) | O*NET(www.onetcenter.org)</p>
      </div>
    `;

    document.body.appendChild(printArea);

    try {
      if (exportFormat === 'png') {
        const canvas = await html2canvas(printArea, { scale: 2, useCORS: true, backgroundColor: '#0F111A' });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${name}_진로관심리포트_AppB.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const opt = {
          margin: 10,
          filename: `${name}_진로관심리포트_AppB.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0F111A' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().from(printArea).set(opt).save();
      }
    } catch (e) {
      console.error(e);
    } finally {
      document.body.removeChild(printArea);
      btnDownloadExecute.disabled = false;
      btnDownloadExecute.innerHTML = '<i class="fa-solid fa-download"></i> 리포트 다운로드';
      closeModal();
    }
  });
});
