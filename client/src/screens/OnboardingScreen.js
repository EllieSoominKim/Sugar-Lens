import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

export default function OnboardingScreen({ onNext }) {
  const features = [
    {
      icon: require('../../assets/onboarding_camera.png'),
      title: 'AI 음식 분석',
      subtitle: '카메라로 찍기만 하면 영양 분석',
    },
    {
      icon: require('../../assets/onboarding_nutrition.png'),
      title: '영양 정보 분석',
      subtitle: 'GI 지수와 칼로리를 자동 분석',
    },
    {
      icon: require('../../assets/onboarding_exercise.png'),
      title: '운동량 환산',
      subtitle: 'GI 지수 기반 운동 시간 계산',
    },
    {
      icon: require('../../assets/onboarding_food.png'),
      title: '저당 대안 추천',
      subtitle: 'Low-GI 기반 대체 음식 추천',
    },
  ];

  return (
    <View style={styles.container}>
      {/* 상단 로고 + 텍스트 */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>더 스마트한 혈당 관리를 위해</Text>
        <Text style={styles.subtitle}>AI 음식 분석을 시작해보세요</Text>
      </View>

      {/* 기능 카드 */}
<View style={styles.featureList}>
  {features.map((feature, index) => (
    <View key={index} style={styles.featureCard}>
      <View style={styles.iconCircle}>
        <Image 
          source={feature.icon}
          style={styles.featureIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
      </View>
    </View>
  ))}
</View>
      
      {/* 인디케이터 */}
      <View style={styles.indicatorContainer}>
        <View style={styles.indicator} />
        <View style={[styles.indicator, styles.indicatorActive]} />
        <View style={styles.indicator} />
      </View>
      
      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
  alignItems: 'center',
  marginBottom: 24,
},
logo: {
  width: 200,
  height: 80,
  marginBottom: 12,
},
subtitle: {
  fontSize: 14,
  color: '#64748B',
  lineHeight: 20,
  textAlign: 'center',
  fontFamily: 'Inter',
},
featureList: {
  flex: 1,
  justifyContent: 'space-evenly',
},
featureCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F8F9FA',
  padding: 16,
  borderRadius: 16,
  gap: 12,
},
iconCircle: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#E8EEFF',
  justifyContent: 'center',
  alignItems: 'center',
},
featureIcon: {
  width: 28,
  height: 28,
},
featureTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#222',
  marginBottom: 2,
  fontFamily: 'Inter',
},
featureSubtitle: {
  fontSize: 13,
  color: '#64748B',
  fontFamily: 'Inter',
},
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  indicatorActive: {
    backgroundColor: '#5B7FFF',
    width: 24,
  },
  button: {
    width: '100%',
    backgroundColor: '#5B7FFF',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});
