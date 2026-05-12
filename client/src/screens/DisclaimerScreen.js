import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function DisclaimerScreen({ onNext }) {
  const [checks, setChecks] = useState({
    medical: false,
    privacy: false,
    terms: false,
  });

  const allChecked = checks.medical && checks.privacy && checks.terms;

  const toggleCheck = (key) => {
    setChecks({ ...checks, [key]: !checks[key] });
  };

  const toggleAll = () => {
    const newValue = !allChecked;
    setChecks({
      medical: newValue,
      privacy: newValue,
      terms: newValue,
    });
  };

  const handleNext = () => {
    if (allChecked) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ height: 40 }} />
        
        {/* 상단 아이콘 + 텍스트 */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../../assets/screen4.png')} 
              style={styles.shieldIcon}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.mainTitle}>이용 전 안내</Text>
          <Text style={styles.subtitle}>Sugar-Lens는 식이 관리 도우미 도구로,</Text>
          <Text style={styles.subtitle}>의료진의 진단을 대체하지 않아요 ;(</Text>
        </View>

        {/* 경고 박스 */}
        <View style={styles.warningBox}>
          <View style={styles.warningHeader}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningTitle}>의료 기기 안내</Text>
          </View>
          <Text style={styles.warningText}>
            본 앱은 일반적 정보 제공용이며, 식습관 변경이나 약물{'\n'}
            사용은 반드시 의료 전문가와 상담하세요.
          </Text>
        </View>

        {/* 체크박스 */}
        <TouchableOpacity 
          style={styles.checkItem} 
          onPress={() => toggleCheck('medical')}
        >
          <View style={[styles.checkbox, checks.medical && styles.checkboxChecked]}>
            {checks.medical && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkText}>
            본 앱은 의료기기가 아니며,{'\n'}
            의료적 진단을 대체하지 않습니다.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.checkItem} 
          onPress={() => toggleCheck('privacy')}
        >
          <View style={[styles.checkbox, checks.privacy && styles.checkboxChecked]}>
            {checks.privacy && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkText}>개인정보 처리 방침에 동의합니다.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.checkItem} 
          onPress={() => toggleCheck('terms')}
        >
          <View style={[styles.checkbox, checks.terms && styles.checkboxChecked]}>
            {checks.terms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkText}>서비스 이용약관에 동의합니다.</Text>
        </TouchableOpacity>

        {/* 전체 동의 */}
        <TouchableOpacity style={styles.allCheckButton} onPress={toggleAll}>
          <View style={[styles.checkbox, allChecked && styles.checkboxChecked]}>
            {allChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.checkText, styles.allCheckText]}>전체 동의</Text>
        </TouchableOpacity>

        <View style={{height: 20}} />
      </ScrollView>

      {/* 인디케이터 */}
      <View style={styles.indicatorContainer}>
        <View style={styles.indicator} />
        <View style={styles.indicator} />
        <View style={[styles.indicator, styles.indicatorActive]} />
      </View>

      {/* 시작하기 버튼 */}
      <TouchableOpacity 
        style={[styles.button, !allChecked && styles.buttonDisabled]} 
        onPress={handleNext}
        disabled={!allChecked}
      >
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#E8EEFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  shieldIcon: {
    width: 60,
    height: 60,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    fontFamily: 'Inter',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  warningBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE4A3',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
    fontFamily: 'Inter',
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#5B7FFF',
    borderColor: '#5B7FFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkText: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  allCheckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
  },
  allCheckText: {
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
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
    backgroundColor: '#5B7FFF',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});
