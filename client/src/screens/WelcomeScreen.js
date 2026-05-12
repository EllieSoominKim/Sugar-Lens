import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function WelcomeScreen({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.lensImage}
          resizeMode="contain"
        />
        
        <Text style={styles.subtitle}>더 스마트한 혈당 관리를 위해</Text>
        <Text style={styles.subtitle}>AI 기반 음식 분석을 시작해보세요</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  lensImage: {
    width: 500,   
    height: 200,     
    marginBottom: 0,
    left:10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});
