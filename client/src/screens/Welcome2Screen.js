import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Welcome2Screen({ onNext }) {
  return (
    <View style={styles.container}>
      {/* Logo + 텍스트 영역 */}
      <View style={styles.contentArea}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.subtitle}>더 스마트한 혈당 관리를 위해</Text>
        <Text style={styles.subtitle}>AI 기반 음식 분석을 시작해보세요</Text>
      </View>
      
      {/* 인디케이터 */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, styles.indicatorActive]} />
        <View style={styles.indicator} />
        <View style={styles.indicator} />
      </View>
      
      {/* 시작하기 버튼 */}
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 500,
    height: 200,
    left:10,
    marginBottom:0,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
