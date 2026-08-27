/**
 * App B - Career Interest Explorer용 데이터 정의 파일
 * [App B 교육용 구현 가정] 태그가 표기된 매핑 및 수치들은 O*NET, 커리어넷의 직업군 기술서를 기반으로 교육 목적으로 설계된 고유 매핑입니다.
 */

// 6개 관심영역 정의 [App B 교육용 구현 가정]
const DOMAINS = {
  r: {
    id: 'r',
    name: '기계·기술형',
    originalName: 'Realistic',
    icon: '🔧',
    description: '도구, 장비, 기계를 직접 조작하고 신체적으로 움직여 실제적인 결과물을 만들어내는 활동을 선호합니다.',
    learningFields: '기계공학, 전기전자공학, 건축공학, 체육학, 소방방재학',
    typicalActivities: [
      'DIY 가구 제작 또는 조립식 키트 조립하기',
      '고장 난 전자기기 분해 및 간단한 자가 정비',
      '3D 설계 프로그램을 통한 모형 디자인 및 출력'
    ],
    typicalJobs: ['로봇공학기술자', '항공기 조종사', '자동차 정비원', '제품디자이너'],
    nextStepAdvice: '이번 주에 DIY 공방이나 메이커 스페이스를 방문하여 손으로 직접 창작하는 체험활동을 한 번 경험해 보세요!'
  },
  i: {
    id: 'i',
    name: '탐구·분석형',
    originalName: 'Investigative',
    icon: '🔬',
    description: '사물이나 자연 현상의 원리를 깊이 탐구하고, 지적 호기심을 바탕으로 논리적·과학적인 분석과 관찰을 선호합니다.',
    learningFields: '물리학, 화학, 생명과학, 통계학, 인공지능학, 심리학',
    typicalActivities: [
      '과학 교양 서적이나 학술 트렌드 잡지 읽기',
      '수치 데이터나 실험 결과를 차트와 그래프로 분석하기',
      '사회/자연 현상 속에 숨겨진 인과관계를 밝히는 연구'
    ],
    typicalJobs: ['기초과학 연구원', '데이터 과학자', '의약품 개발자', '프로파일러'],
    nextStepAdvice: '관심 있는 주제의 과학/인문 학술 강연 영상을 찾아보거나 최신 과학 뉴스 칼럼을 한 편 읽어보세요!'
  },
  a: {
    id: 'a',
    name: '창작·표현형',
    originalName: 'Artistic',
    icon: '🎨',
    description: '상상력과 감수성을 발휘하여 글, 그림, 음악, 영상 등 다양한 매체로 자신을 독창적이고 자유롭게 표현하는 것을 좋아합니다.',
    learningFields: '시각디자인, 문예창작학, 멀티미디어학, 실용음악학, 연극영화학',
    typicalActivities: [
      '나만의 이야기나 감정을 담은 짧은 수필, 대본 집필',
      'SNS 카드뉴스나 숏폼 비디오 직접 기획 및 제작',
      '예술 전시회나 공연 관람 후 나만의 독창적인 비평 작성'
    ],
    typicalJobs: ['시각 디자이너', '웹툰 작가', '광고 기획자', '영화 감독'],
    nextStepAdvice: '나만의 기분을 담은 플레이리스트를 만들거나, 30초 분량의 일상 숏폼 동영상을 직접 제작해 보세요!'
  },
  s: {
    id: 's',
    name: '사람·도움형',
    originalName: 'Social',
    icon: '🤝',
    description: '타인의 감정에 깊이 공감하고 소통하며, 사람들을 가르치거나 돕는 교육 및 사회 지원 활동에서 깊은 보람을 느낍니다.',
    learningFields: '교육학, 간호학, 심리상담학, 사회복지학, 언어치료학',
    typicalActivities: [
      '고민이나 어려움이 있는 친구의 말 진심으로 귀 기울여 듣기',
      '복지관이나 아동센터에서 교육 멘토링 봉사 참여',
      '팀 프로젝트나 동아리에서 소통 조율 및 중재하기'
    ],
    typicalJobs: ['고등학교 교사', '심리상담사', '간호사', '사회복지사'],
    nextStepAdvice: '주변 복지 시설의 교육 봉사나 동아리 멘토링 활동을 알아보고 가벼운 마음으로 참가 신청을 해보세요!'
  },
  e: {
    id: 'e',
    name: '기획·설득형',
    originalName: 'Enterprising',
    icon: '📢',
    description: '공동의 목표 달성을 위해 프로젝트를 기획하고, 동료들을 설득하여 리더로서 팀을 이끄는 리더십 활동에 적극적입니다.',
    learningFields: '경영학, 정치외교학, 마케팅학, 미디어커뮤니케이션학',
    typicalActivities: [
      '모의 창업 아이디어 경진대회나 동아리 사업 구상하기',
      '축제 부스나 학급 프로젝트에서 마케팅/홍보 기획 주도',
      '내 주장이나 기획을 친구들 앞에서 매끄럽고 설득력 있게 발표'
    ],
    typicalJobs: ['창업가(CEO)', '마케터', '경영 컨설턴트', '행사 기획자'],
    nextStepAdvice: '와디즈나 텀블벅 같은 크라우드 펀딩 플랫폼에 들어가서 참신한 스타트업 기획안을 분석해 보세요!'
  },
  c: {
    id: 'c',
    name: '정리·운영형',
    originalName: 'Conventional',
    icon: '📊',
    description: '정보, 자금, 자료를 명확한 기준에 맞춰 꼼꼼하게 기록 및 관리하며, 체계적이고 약속된 규칙을 성실히 따르는 것을 즐깁니다.',
    learningFields: '회계학, 세무학, 문헌정보학, 데이터공학, 행정학',
    typicalActivities: [
      '동아리 예산 수립 및 오차 없는 출납 장부 관리',
      'Notion이나 Excel을 사용한 일정표 및 자료 체계적 구조화',
      '약속된 절차와 매뉴얼에 맞춰 임무를 깔끔하게 완성하기'
    ],
    typicalJobs: ['공인회계사', '데이터베이스 관리자', '행정 공무원', '사서'],
    nextStepAdvice: '이번 주에 나만의 일정 계획이나 공부시간 흐름을 엑셀 혹은 노션 다이어리 템플릿으로 구조화해 보세요!'
  }
};

// 18개 행동·상황 중심 질문 정의 [App B 교육용 구현 가정]
const QUESTIONS = [
  // Realistic
  { id: 1, domainId: 'r', text: '고장 난 가전제품이나 전자기기 장치를 직접 분해하고 조립하는 활동이 흥미롭다.' },
  { id: 2, domainId: 'r', text: '나무, 아크릴 등 여러 재료를 다루어 실생활에 필요한 도구나 물건을 제작하는 편이다.' },
  { id: 3, domainId: 'r', text: '자동차, 드론, 로봇 같은 장비나 운송수단이 작동하는 원리를 배우고 조작해 보는 것이 즐겁다.' },

  // Investigative
  { id: 4, domainId: 'i', text: '수학 문제나 과학 실험의 의문점을 해결하기 위해 끈기 있게 이유를 찾아내는 것을 좋아한다.' },
  { id: 5, domainId: 'i', text: '뉴스를 볼 때 단순 사실보다 통계 수치나 논리적 근거를 바탕으로 진위 여부를 따져보는 편이다.' },
  { id: 6, domainId: 'i', text: '자연의 법칙, 인체 작동 메커니즘 등 기초 과학을 심도 있게 다룬 다큐멘터리나 책을 즐겨 본다.' },

  // Artistic
  { id: 7, domainId: 'a', text: '나의 개성이나 생각, 감정을 글, 그림, 음악 등으로 자유롭게 창작하여 사람들에게 전달하고 싶다.' },
  { id: 8, domainId: 'a', text: '방 인테리어, 웹페이지, SNS 디자인 등을 나만의 고유한 스타일이나 색감으로 꾸미는 편이다.' },
  { id: 9, domainId: 'a', text: '새로운 영화나 연극을 보면서 \'내가 감독이나 작가라면 줄거리를 어떻게 바꿀까\' 상상하곤 한다.' },

  // Social
  { id: 10, domainId: 's', text: '고민이나 걱정이 있는 친구의 이야기를 진심으로 경청하고 위로해 줄 때 보람을 느낀다.' },
  { id: 11, domainId: 's', text: '배운 지식이나 나만 알고 있는 유용한 팁을 타인에게 쉽게 설명하고 가르치는 일을 좋아한다.' },
  { id: 12, domainId: 's', text: '모둠 프로젝트나 동아리 활동을 할 때 소외된 동료가 없도록 세심하게 챙기는 편이다.' },

  // Enterprising
  { id: 13, domainId: 'e', text: '공동의 목표를 달성하기 위해 친구들을 모으고 프로젝트의 리더를 맡아 나가는 편이다.' },
  { id: 14, domainId: 'e', text: '회의나 논쟁 상황에서 내 주장을 논리적으로 설득하여 친구들의 합의를 이끌어내는 데 능숙하다.' },
  { id: 15, domainId: 'e', text: '축제 부스 운영이나 새로운 비즈니스 모델 등 흥미로운 아이디어를 구상하고 기획안을 쓰는 데 관심이 많다.' },

  // Conventional
  { id: 16, domainId: 'c', text: '하루 또는 주간 일정을 구체적으로 작성하고, 계획대로 실천하는 데서 안도감을 느낀다.' },
  { id: 17, domainId: 'c', text: '모임의 자금 지출 내역이나 데이터 파일들을 기준에 맞춰 꼼꼼하고 깔끔하게 분류하여 기록한다.' },
  { id: 18, domainId: 'c', text: '정해진 매뉴얼과 공통 규칙에 따라 주어진 임무를 한 치의 오차 없이 마치는 것을 중요하게 생각한다.' }
];

// 교육용 고지 사항 [공식 직업정보] 및 [App B 교육용 구현 가정] 구분
const DISCLAIMER = '이 결과는 관심 분야를 탐색하기 위한 교육용 참고자료입니다. 전문 진로검사·심리검사를 대체하지 않으며, 특정 직업의 적합성을 판정하지 않습니다. 본 분석에 사용된 데이터 매핑과 직업 연계는 [App B 교육용 구현 가정]에 근거하고 있습니다.';

// 참고 출처 데이터
const SOURCES = [
  { name: '커리어넷(CareerNet)', link: 'https://www.career.go.kr' },
  { name: '고용24(Work24)', link: 'https://www.work24.go.kr' },
  { name: 'O*NET Interest Profiler', link: 'https://www.onetcenter.org' }
];

// Export to window object for web runtime
if (typeof window !== 'undefined') {
  window.DOMAINS = DOMAINS;
  window.QUESTIONS = QUESTIONS;
  window.DISCLAIMER = DISCLAIMER;
  window.SOURCES = SOURCES;
}

// Export to module for Node.js testing env
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DOMAINS, QUESTIONS, DISCLAIMER, SOURCES };
}
