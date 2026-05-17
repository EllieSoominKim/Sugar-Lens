# Sugar-Lens
> **AI 기반 음식 인식 데이터 매핑 및 혈당 관리 풀스택 모바일 서비스 (Architecture Archive)**

 **프로젝트 검토 안내**
본 프로젝트는 현재 Cloud 인프라 비용 및 관리 이슈로 인해 Firebase 백엔드 서버가 종료(Deprecate)되었습니다. 따라서 로컬 환경에서의 실시간 API 통신 및 앱 구동은 제한됩니다. 
대신, 프로젝트의 기획 배경, 상세 구동 메커니즘, 코딩 스타일을 명확히 확인하실 수 있도록 **최종 PPT 발표 자료**와 **다양한 연출의 버전별 데모 영상**, 그리고 **핵심 아키텍처 코드 스니펫**을 본 README에 상세히 아카이빙해 두었습니다. 코드 및 설계 구조 중심으로 검토해 주시면 감사하겠습니다.

---

##  프로젝트 아카이브 자료 (Media & Assets)

>  **리뷰어 필수 참고:** 모든 링크는 권한 요청 없이 즉시 확인 가능하도록 공개되어 있습니다.

*   ** [최종 프로젝트 발표 PPT (Google Drive)](구글드라이브_PPT_링크_넣기):** 기획 배경, 데이터베이스 모델링(식약처 및 Sydney GI 매핑 알고리즘), 전체 서비스 아키텍처 및 기대 효과가 정리된 마일스톤 발표 자료입니다.
*   ** [최종 통합 데모 영상 (Google Drive)](https://drive.google.com/file/d/1muKlDiArzqFHZNQYK1bvFVV9v1U-gc02/view?usp=sharing):** 앱의 전체 핵심 시나리오가 매끄럽게 구동되는 메인 시연 영상입니다.
*   ** [버전별 데모 영상 모음 폴더 (Google Drive)](https://drive.google.com/drive/folders/11JFxR7ieHL3WIhiV7Q1sTYca-Rb1WLN7?usp=drive_link):** 발표 연출 상황, 시연 시나리오별 동선에 맞춰 다양한 버전으로 독립 제작된 완성형 데모 영상 아카이브입니다.

---

##  본인 역할 및 기여도 (My Role & Contributions)

**"Figma UI/UX 디자인 가이드를 제외한 기획 및 설계, 풀스택 개발 전 과정 100% 전담"**

*   **UI/UX 코드 변환 및 프론트엔드 구축:** 디자이너의 Figma 원안 가이드를 분석하여 React Native(Expo) 컴포넌트 코드로 100% 직접 이식 및 퍼블리싱을 완료했습니다.
*   **핵심 비즈니스 로직 및 데이터 설계:** 음식 이미지 인식 스캔 API 연동, 중량(Portion) 정보 제어 알고리즘 구현, 식약처 영양소 데이터 및 Sydney GI 혈당 지수 매핑 로직을 통틀어 직접 설계하고 구현했습니다.
*   **맞춤형 운동 환산 알고리즘 설계:** 사용자의 신체 스펙(몸무게) 데이터와 식단으로 섭취한 칼로리를 연동하여, 목표 소모를 위한 맞춤형 운동량(걷기, 러닝, 스쿼트)을 실시간으로 역산해내는 알고리즘을 독자적으로 구축했습니다.
*   **백엔드 인프라 구축 및 배포:** Firebase 서버리스 아키텍처(Functions, Hosting) 환경을 직접 세팅하여 모바일 클라이언트와의 데이터 파이프라인을 연결하고 배포 프로세스를 총괄했습니다.

---

##  주요 기능 (Key Features)

*   **AI 푸드 스캔:** 디바이스 카메라를 연동하여 음식을 촬영하고, 이미지 인식을 통해 식품 명을 정밀하게 추출합니다.
*   **섭취량 및 영양소 매핑:** 인식된 식품의 정확한 중량(Portion) 정보와 매치하여 탄수화물, 단백질, 지방 및 혈당 지수(GI/GL)를 역산하여 매핑합니다.
*   **개인화된 맞춤형 운동 환산 로직:** 사용자가 입력한 현재 몸무게를 기반으로, 섭취한 칼로리를 전량 소모하기 위해 필요한 운동량(걷기 시간, 러닝 시간, 스쿼트 개수 등)을 실시간 계산하여 직관적으로 시각화합니다.
*   **AI 대화형 챗봇 인터페이스:** Google Gemini API를 직접 연동하여 구축한 대화형 인터페이스입니다. 사용자가 추가적인 영양 정보나 관리 팁을 자유롭게 질의응답할 수 있는 유연한 가이드 기능을 제공합니다.
*   **건강 지식 라이브러리:** 혈당 조절 및 당뇨 예방을 위한 전문 건강 정보를 카테고리별로 탐색하고 상세 콘텐츠를 조회할 수 있습니다.

---

##  프로젝트 폴더 구조 (Architecture)

모바일 클라이언트, 파이썬 기반 백엔드/데이터 환경, Firebase 서버리스 인프라가 결합된 멀티 디렉토리 구조입니다.

```text
sugar-lens/
├── package.json (Root)              # 프로젝트 전체 스크립트 관리 (client/server 구동 명령)
│
├── server/                          # 백엔드, 데이터 분석 및 인프라 통합 폴더
│   ├── .firebaserc                  # Firebase 프로젝트 매핑 설정
│   ├── firebase.json                # Firebase 호스팅 및 배포 규칙 정의
│   ├── package-lock.json            # Firebase 배포 패키지 잠금 파일
│   ├── requirements.txt             # 로컬 개발 및 데이터 분석 환경 전체 파이썬 패키지 명세
│   │
│   └── functions/                   #  Firebase Cloud Functions 배포 서버 소스 코드
│       ├── gi_mapping.csv               # 로컬 실시간 데이터 조회용 핵심 데이터셋 (100개 음식 × 14개 컬럼)
│       ├── main.py                  # Gemini API 호출 및 데이터 가공 처리 핵심 백엔드 로직
│       ├── library_content.py       # 건강 정보 라이브러리 콘텐츠 데이터 모듈
│       └── requirements.txt         # [Cloud 배포 전용] 서버 구동 핵심 패키지 (functions, generativeai 등)
│
└── client/                          #  React Native (Expo) 모바일 앱
    ├── src/
    │   ├── api/                     #  Firebase Functions API 통신 레이어
    │   ├── screens/                 #  UI 화면 컴포넌트
    │   └── styles/                  #  공통 스타일 정의
    │
    ├── assets/                      #  이미지 및 벡터 그래픽 리소스
    │
    ├── App.js                       #  중앙 집중형 상태 라우팅 엔진
    ├── app.json                     #  Expo 앱 설정 (name, version, orientation 등)
    └── package.json (Client)        #  모바일 앱 전용 라이브러리 명세
```
---

##  기술적 도전 및 핵심 설계 특징

### 외부 의존성을 제거한 '중앙 집중형 상태 라우팅'
본 프로젝트는 무거운 외부 네비게이션 라이브러리 오버헤드를 줄이고자, `App.js` 중심의 **독자적인 상태 관리 시스템(`useState`)과 조건부 렌더링**을 설계하여 화면을 제어합니다.

*   **성능 최적화:** 네비게이션 라이브러리 의존성을 전면 배제(다운사이징)하여 앱 초기 로딩 속도를 최적화하고 최종 빌드 패키지 용량을 크게 줄였습니다.
*   **UX 인터랙션:** `Animated.View`와 페이드 인터랙션을 결합해 기기 간 이질감 없는 유기적인 화면 연동을 보장합니다.
*   **완전한 Stateless 구조:** 본 앱은 로컬 저장소(AsyncStorage)를 사용하지 않는 완전한 Stateless 구조로 설계되어, 매 스캔마다 Firebase API를 호출하여 실시간 데이터를 조회합니다.
*   **안정적인 데이터 흐름:** 별도의 무거운 외부 RDBMS 대신, 정제된 핵심 데이터셋인 `gi_mapping.csv`를 기반으로 실시간 데이터 조회 및 역산 아키텍처를 구축했습니다. `scanData`(식품 매칭 결과), `portionData`(칼로리 및 운동 환산 결과), `libraryCategory`(카테고리 필터링) 등의 핵심 상태를 최상위 레벨에서 통제하여 데이터 오버헤드 없이 안전하고 빠른 흐름을 보장합니다.

###  핵심 데이터셋 구조 (`gi_mapping.csv`)
*   **데이터 규모:** 총 100개 음식 × 14개 주요 스키마 컬럼 구성
*   **주요 명세:** `food_id`(고유 ID), `food_name_ko/en`(한/영 음식명), `category/subcategory`(분류), `gi_value/gi_grade`(GI 지수 및 등급), `carbs_g/sugar_g`(탄수화물/당류), `kcal`(칼로리), `serving_size_g`(1회 제공량), `data_source`(출처)

###  로컬 실시간 데이터 처리 프로세스 (Data Pipeline)
1.  **AI 음식명 매칭:** Gemini API 인식 결과 문자열을 기반으로 `gi_mapping.csv` 내 최적의 `food_id`를 실시간으로 인덱싱 및 조회합니다.
2.  **GI 등급 판정:** 조회된 `gi_grade`를 기준으로 사용자 UI에 **안심 / 주의 / 위험** 3단계 상태를 즉각적으로 분류하여 시각화합니다.
3.  **저GI 대안 추천:** 유저가 선택한 음식의 동일 `subcategory` 내에서 혈당 스파이크를 방지할 수 있는 '저GI(Low-GI) 음식'을 실시간 필터링하여 맞춤 추천합니다.
4.  **운동량 환산:** 단순히 칼로리(`kcal`)만 계산하는 것이 아니라, 해당 식품의 **GI 가중치**를 연산 모델에 함께 결합하여 걷기, 러닝, 스쿼트 등 실제 필요한 운동량을 정밀하게 역산해 냅니다.

###  App.js 핵심 라우팅 아키텍처 구조
```javascript
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [scanData, setScanData] = useState(null);
  const [portionData, setPortionData] = useState(null);
  const [libraryCategory, setLibraryCategory] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 화면 전환 시 페이드인 애니메이션 제어
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentScreen]);

  // 중앙 집중형 조건부 렌더링 시스템
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setCurrentScreen('welcome2')} />;
      case 'home':
        return <HomeScreen onNavigate={(screen, data) => {
          setCurrentScreen(screen);
          if (data?.category) setLibraryCategory(data.category);
        }} />;
      case 'scan':
        return <ScanScreen onNavigate={setCurrentScreen} onResult={setScanData} />;
      case 'portionConfirm':
        return <PortionConfirmScreen foodData={scanData} onConfirm={setPortionData} onNavigate={setCurrentScreen} />;
      case 'result':
        return <ResultScreen data={portionData} onNavigate={setCurrentScreen} />;
      case 'chatbot':
        return <ChatbotScreen onNavigate={setCurrentScreen} />;
      default:
        return <WelcomeScreen onNext={() => setCurrentScreen('welcome2')} />;
    }
  };

  // 특정 화면 풀스크린 구동을 위한 하단 탭 바 분기 처리
  const showTabBar = ['home', 'chatbot', 'library', 'scan', 'result'].includes(currentScreen);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
        {renderScreen()}
      </Animated.View>
      
      {showTabBar && (
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}>
            <Text style={[styles.tabLabel, currentScreen === 'home' && styles.tabLabelActive]}>홈</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('scan')}>
            <Text style={[styles.tabLabel, currentScreen === 'scan' && styles.tabLabelActive]}>스캔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('chatbot')}>
            <Text style={[styles.tabLabel, currentScreen === 'chatbot' && styles.tabLabelActive]}>챗봇</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
```
---

##  기술 스택 (Tech Stack)

###  Client
*   **Framework:** React Native v0.81.5 (Expo SDK 54.0.33)
*   **Libraries:** 
    *   `expo-camera` (하드웨어 카메라 모듈 제어 및 이미지 캡처)
    *   `expo-splash-screen` (초기 로딩 UX 최적화를 위한 스플래시 화면 제어)
    *   `react-native-svg` & `react-native-svg-transformer` (고해상도 벡터 아이콘 컴포넌트화 및 렌더링)

###  Backend & Infrastructure
*   **Language:** Python 3.12
*   **Framework:** Firebase Cloud Functions
*   **AI API:** Google Gemini Flash API
*   **Database:** CSV (gi_mapping.csv - 100 items)
*   **Deployment:** Firebase Hosting & Functions

###  Data Sources
*   **식품의약품안전처 (MFDS):** 국내 식품 영양 성분 데이터
*   **Sydney University GI Database:** 국제 검증 GI 지수 데이터 (100개 음식)
