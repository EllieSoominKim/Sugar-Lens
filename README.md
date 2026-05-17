# Sugar-Lens
> **AI 기반 음식 인식 데이터 매핑 및 혈당 관리 풀스택 모바일 서비스 (Architecture Archive)**

 **프로젝트 검토 안내**
본 프로젝트는 현재 Cloud 인프라 비용 및 관리 이슈로 인해 Firebase 백엔드 서버가 종료(Deprecate)되었습니다. 따라서 로컬 환경에서의 실시간 API 통신 및 앱 구동은 제한됩니다. 
대신, 프로젝트의 기획 배경, 상세 구동 메커니즘, 코딩 스타일을 명확히 확인하실 수 있도록 **최종 PPT 발표 자료**와 **다양한 연출의 버전별 데모 영상**, 그리고 **핵심 아키텍처 코드 스니펫**을 본 README에 상세히 아카이빙해 두었습니다. 코드 및 설계 구조 중심으로 검토해 주시면 감사하겠습니다.

---

##  프로젝트 아카이브 자료 (Media & Assets)

>  **리뷰어 필수 참고:** 모든 링크는 권한 요청 없이 즉시 확인 가능하도록 공개되어 있습니다.

*   **📊 [최종 프로젝트 발표 PPT (Google Drive)](구글드라이브_PPT_링크_넣기):** 기획 배경, 데이터베이스 모델링(USDA 및 Sydney GI 수동 매핑 알고리즘), 전체 서비스 아키텍처 및 기대 효과가 정리된 마일스톤 발표 자료입니다.
*   **🎥 [최종 통합 데모 영상 (Google Drive)](https://drive.google.com/file/d/1muKlDiArzqFHZNQYK1bvFVV9v1U-gc02/view?usp=sharing):** 앱의 전체 핵심 시나리오가 매끄럽게 구동되는 메인 시연 영상입니다.
*   **🎞️ [버전별 데모 영상 모음 폴더 (Google Drive)](https://drive.google.com/drive/folders/11JFxR7ieHL3WIhiV7Q1sTYca-Rb1WLN7?usp=drive_link):** 발표 연출 상황, 시연 시나리오별 동선에 맞춰 다양한 버전으로 독립 제작된 완성형 데모 영상 아카이브입니다.

---

##  본인 역할 및 기여도 (My Role & Contributions)

**"Figma UI/UX 디자인 가이드를 제외한 기획 및 설계, 풀스택 개발 전 과정 100% 전담"**

*   **UI/UX 코드 변환 및 프론트엔드 구축:** 디자이너의 Figma 원안 가이드를 분석하여 React Native(Expo) 컴포넌트 코드로 100% 직접 이식 및 퍼블리싱을 완료했습니다.
*   **핵심 비즈니스 로직 및 데이터 설계:** 음식 이미지 인식 스캔 API 연동, 중량(Portion) 정보 제어 알고리즘 구현, USDA 및 Sydney GI 영양소/혈당 지수 매핑 로직을 통틀어 직접 설계하고 구현했습니다.
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
├── .firebaserc              # Firebase 프로젝트 매핑 설정
├── firebase.json            # Firebase 호스팅 및 보안/배포 규칙 정의
├── requirements.txt         # 백엔드 및 AI 모델 환경을 위한 Python 패키지 명세
├── package.json (Root)      # 프로젝트 루틴 및 배포 스크립트 관리자 설정
└── [client 폴더명]           # Expo 기반 React Native 모바일 앱 소스 코드
    ├── src/
    │   ├── screens/         # 구현 완료된 모든 독립 화면 컴포넌트
    │   └── assets/          # 앱에 사용된 이미지 및 고해상도 벡터 그래픽 에셋
    ├── App.js               # 중앙 집중형 상태 라우팅 엔진 및 인터랙션 통제
    └── package.json (Client)# 모바일 앱 전용 라이브러리 명세 (expo-camera, svg 등)
```
---

## 기술적 도전 및 핵심 설계 특징

### 1. 외부 의존성을 제거한 '중앙 집중형 상태 라우팅 (State-based Routing)'
본 프로젝트는 무거운 외부 네비게이션 라이브러리 오버헤드를 줄이고자, `App.js` 중심의 **독자적인 상태 관리 시스템(`useState`)과 조건부 렌더링**을 설계하여 화면을 제어합니다.
*   **성능 최적화:** 네비게이션 라이브러리 의존성을 전면 배제(다운사이징)하여 앱 초기 로딩 속도를 최적화하고 최종 빌드 패키지 용량을 크게 줄였습니다.
*   **UX 인터랙션:** `Animated.View`와 페이드 인터랙션을 결합해 기기 간 이질감 없는 유기적인 화면 연동을 보장합니다.
*   **안정적인 데이터 흐름:** 식품 스캔 데이터(`scanData`), 섭취량 데이터(`portionData`), 지식 데이터베이스 카테고리(`libraryCategory`) 등 핵심 상태를 최상위 레벨에서 양방향 콜백 인터페이스(`onNavigate`)로 통제하여 데이터 흐름을 추적성 높고 안전하게 관리합니다.

####  App.js 핵심 라우팅 아키텍처 구조
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
        return <WelcomeScreen onNext="{()"> setCurrentScreen('welcome2')} />;
      case 'home':
        return <HomeScreen onNavigate="{(screen,"> {
          setCurrentScreen(screen);
          if (data?.category) setLibraryCategory(data.category);
        }} />;
      case 'scan':
        return <ScanScreen onNavigate="{setCurrentScreen}" onResult="{setScanData}"/>;
      case 'portionConfirm':
        return <PortionConfirmScreen foodData="{scanData}" onConfirm="{setPortionData}" onNavigate="{setCurrentScreen}"/>;
      case 'result':
        return <ResultScreen data="{portionData}" onNavigate="{setCurrentScreen}"/>;
      case 'chatbot':
        return <ChatbotScreen onNavigate="{setCurrentScreen}"/>;
      default:
        return <WelcomeScreen onNext="{()"> setCurrentScreen('welcome2')} />;
    }
  };

  // 특정 화면 풀스크린 구동을 위한 하단 탭 바 분기 처리
  const showTabBar = ['home', 'chatbot', 'library', 'scan', 'result'].includes(currentScreen);

  return (
    <SafeAreaView style="{styles.container}">
      <Animated.View fadeAnim opacity: style="{[styles.screenContainer," { }]}>
        {renderScreen()}
      </Animated.View>
      
      {showTabBar && (
        <View style="{styles.tabBar}">
          <TouchableOpacity onPress="{()"> setCurrentScreen('home')}>
            <Text && 'home' currentScreen="==" style="{[styles.tabLabel," styles.tabLabelActive]}>홈</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress="{()"> setCurrentScreen('scan')}>
            <Text && 'scan' currentScreen="==" style="{[styles.tabLabel," styles.tabLabelActive]}>스캔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress="{()"> setCurrentScreen('chatbot')}>
            <Text && 'chatbot' currentScreen="==" style="{[styles.tabLabel," styles.tabLabelActive]}>챗봇</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
---

##  기술 스택 (Tech Stack)

###  Client
*   **Framework:** React Native (Expo)
*   **Libraries:** 
    *   `expo-camera` (하드웨어 카메라 모듈 제어 및 이미지 캡처)
    *   `expo-splash-screen` (초기 로딩 UX 최적화를 위한 스플래시 화면 제어)
    *   `react-native-svg` & `react-native-svg-transformer` (고해상도 벡터 아이콘 컴포넌트화 및 렌더링)

###  Backend & Infrastructure (Archived)
*   **Language/Environment:** Python, Node.js
*   **Database & Deployment:** Firebase (Hosting & Functions)

