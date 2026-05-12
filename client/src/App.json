import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import Welcome2Screen from './src/screens/Welcome2Screen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DisclaimerScreen from './src/screens/DisclaimerScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import LibraryDetailScreen from './src/screens/LibraryDetailScreen';
import ScanScreen from './src/screens/ScanScreen';
import PortionConfirmScreen from './src/screens/PortionConfirmScreen';
import ResultScreen from './src/screens/ResultScreen';
import AlternativeScreen from './src/screens/AlternativeScreen';

SplashScreen.preventAutoHideAsync();

const PHONE_WIDTH = 393;
const PHONE_HEIGHT = 852;

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
  });
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [scanResult, setScanResult] = useState(null);
  const [selectedNutrition, setSelectedNutrition] = useState(null);
  const [exerciseResult, setExerciseResult] = useState(null);
  const [libraryCategory, setLibraryCategory] = useState(null);
  const [libraryIndex, setLibraryIndex] = useState(0);
  const [scanData, setScanData] = useState(null);
  const [portionData, setPortionData] = useState(null);
  const [previousScreen, setPreviousScreen] = useState(null);
  const [libraryFrom, setLibraryFrom] = useState(null);
  const [libraryContentId, setLibraryContentId] = useState(null);
  
  // 애니메이션 값
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
  if (fontsLoaded) {
    SplashScreen.hideAsync();
  }
}, [fontsLoaded]);

  // 화면 전환 애니메이션
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentScreen]);

  const handleScanResult = (data) => {
    setScanResult(data);
    setCurrentScreen('result');
  };

  const handleExerciseClick = (nutrition) => {
    setSelectedNutrition(nutrition);
    setCurrentScreen('exerciseInput');
  };

  const handleExerciseCalculate = (data) => {
    setExerciseResult(data);
    setCurrentScreen('exerciseResult');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setCurrentScreen('welcome2')} />;
      case 'welcome2':
        return <Welcome2Screen onNext={() => setCurrentScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onNext={() => setCurrentScreen('disclaimer')} />;
      case 'disclaimer':
        return <DisclaimerScreen onNext={() => setCurrentScreen('home')} />;
      case 'home':
        return <HomeScreen onNavigate={(screen, data) => {
          setCurrentScreen(screen);
          if (data?.category) {
            setLibraryCategory(data.category);
            setLibraryFrom(data.from || 'home');
          }
          if (data?.contentId) setLibraryContentId(data.contentId);
          if (data?.index !== undefined) setLibraryIndex(data.index);
        }} />;
      case 'chatbot':
        return <ChatbotScreen onNavigate={setCurrentScreen} />;
      case 'library':
        return <LibraryScreen onNavigate={(screen, data) => {
          setCurrentScreen(screen);
          if (data?.category) {
            setLibraryCategory(data.category);
            setLibraryFrom('library');
          }
          if (data?.index !== undefined) setLibraryIndex(data.index);
        }} />;
      case 'libraryContent':
        return <LibraryContentScreen 
          category={libraryCategory} 
          onNavigate={(screen, data) => {
            setCurrentScreen(screen);
            if (data?.index !== undefined) setLibraryIndex(data.index);
          }} 
        />;
      case 'libraryDetail':
        return <LibraryDetailScreen 
          category={libraryCategory} 
          index={libraryIndex}
          contentId={libraryContentId}
          from={libraryFrom}
          onNavigate={(screen) => {
            setCurrentScreen(screen);
            setLibraryContentId(null);
            setLibraryFrom(null);
          }} 
        />;
      case 'scan':
        return <ScanScreen onNavigate={setCurrentScreen} onResult={setScanData} />;
      case 'portionConfirm':
        return <PortionConfirmScreen foodData={scanData} onNavigate={setCurrentScreen} onConfirm={setPortionData} />;
      case 'result':
        return <ResultScreen data={portionData} onNavigate={setCurrentScreen} />;
      case 'alternative':
        return <AlternativeScreen currentFood={portionData} onNavigate={setCurrentScreen} />;
      default:
        return <WelcomeScreen onNext={() => setCurrentScreen('welcome2')} />;
    }
  };

  if (!fontsLoaded) return null;

  const showTabBar = ['home', 'chatbot', 'library', 'scan', 'libraryDetail', 'alternative', 'result'].includes(currentScreen);

  return (
    <View style={styles.desktopContainer}>
      <View style={styles.phoneFrame}>
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
            {renderScreen()}
          </Animated.View>
          
          {showTabBar && (
            <View style={styles.tabBar}>
              <TouchableOpacity 
                style={[styles.tab, currentScreen === 'home' && styles.tabActive]}
                onPress={() => setCurrentScreen('home')}
              >
                <Image 
                  source={
                    currentScreen === 'home' 
                      ? require('./assets/home.png')
                      : require('./assets/home_g.png')
                  }
                  style={styles.tabIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.tabLabel, currentScreen === 'home' && styles.tabLabelActive]}>
                  홈
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, (currentScreen === 'scan' || currentScreen === 'alternative' || currentScreen === 'result') && styles.tabActive]}
                onPress={() => setCurrentScreen('scan')}
              >
                <Image 
                  source={
                    (currentScreen === 'scan' || currentScreen === 'alternative' || currentScreen === 'result')
                      ? require('./assets/scan.png')
                      : require('./assets/scan_g.png')
                  }
                  style={styles.tabIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.tabLabel, (currentScreen === 'scan' || currentScreen === 'alternative' || currentScreen === 'result') && styles.tabLabelActive]}>
                  스캔
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, currentScreen === 'chatbot' && styles.tabActive]}
                onPress={() => setCurrentScreen('chatbot')}
              >
                <Image 
                  source={
                    currentScreen === 'chatbot' 
                      ? require('./assets/chatbot.png')
                      : require('./assets/chatbot_g.png')
                  }
                  style={styles.tabIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.tabLabel, currentScreen === 'chatbot' && styles.tabLabelActive]}>
                  챗봇
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, (currentScreen === 'library' || currentScreen === 'libraryDetail') && styles.tabActive]}
                onPress={() => setCurrentScreen('library')}
              >
                <Image 
                  source={
                    (currentScreen === 'library' || currentScreen === 'libraryDetail')
                      ? require('./assets/lib.png')
                      : require('./assets/lib_g.png')
                  }
                  style={styles.tabIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.tabLabel, (currentScreen === 'library' || currentScreen === 'libraryDetail') && styles.tabLabelActive]}>
                  정보
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneFrame: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    backgroundColor: '#000000',
    borderRadius: 47,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    marginBottom: -25,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: '#5B7FFF',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
});
