import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

export default function PortionConfirmScreen({ foodData, onNavigate, onConfirm }) {
  const [portion, setPortion] = useState(1);
  const [weight, setWeight] = useState('70');

  const foodName = foodData?.food_name || '음식';
  const unit = foodData?.unit || '인분';
  const unitText = unit.replace(/^1/, ''); // "1개" → "개"
  const portionOptions = foodData?.portion_options || [0.5, 1, 1.5, 2];

  const handleMinus = () => {
    if (portion > 0.5) {
      setPortion(portion - 0.5);
    }
  };

  const handlePlus = () => {
    setPortion(portion + 0.5);
  };

  const handlePortionSelect = (value) => {
    setPortion(value);
  };

  const handleAnalyze = () => {
    onConfirm({
      ...foodData,
      portion: portion,
      weight: parseFloat(weight) || 70,
    });
    onNavigate('result');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('scan')}
        >
          <Image 
            source={require('../../assets/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>포션 확인</Text>
      </View>

      <ScrollView 
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* AI 분석 카드 */}
        <View style={styles.aiCard}>
          <Text style={styles.aiLabel}>AI ANALYSIS</Text>
          <Text style={styles.foodName}>{foodName}</Text>
        </View>

        {/* 포션 조절 */}
        <Text style={styles.portionValue}>{portion}</Text>
        <Text style={styles.portionUnit}>{unitText}</Text>

        <View style={styles.controlRow}>
          <TouchableOpacity onPress={handleMinus}>
            <Image 
              source={require('../../assets/portion_minus.png')}
              style={styles.controlButton}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.portionDisplay}>{portion} {unitText}</Text>

          <TouchableOpacity onPress={handlePlus}>
            <Image 
              source={require('../../assets/portion_plus.png')}
              style={styles.controlButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* 포션 선택 버튼 */}
        <View style={styles.portionGrid}>
          {portionOptions.map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.portionButton,
                portion === value && styles.portionButtonActive,
              ]}
              onPress={() => handlePortionSelect(value)}
            >
              <Text style={[
                styles.portionButtonText,
                portion === value && styles.portionButtonTextActive,
              ]}>
                {value}{unitText}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 체중 입력 */}
        <View style={styles.weightContainer}>
          <Text style={styles.weightLabel}>내 체중:</Text>
          <TextInput
            style={styles.weightInput}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="70"
          />
          <Text style={styles.weightUnit}>kg</Text>
        </View>

        {/* 분석 시작 버튼 */}
        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Text style={styles.analyzeButtonText}>분석 시작</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 5,
    top: 0,
    zIndex: 10,
    width: 80,   
    height: 80, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 35,
    height: 35,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 'auto',
    color: '#222',
    fontFamily: 'Inter',
    marginTop: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  aiCard: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
  },
  aiLabel: {
    position: 'absolute',  
  top: 10,                
  left: 16,              
  fontSize: 12,
  color: '#64748B',
  fontFamily: 'Inter',
  letterSpacing: 1,
  },
  foodName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5B7FFF',
    textAlign: 'center',
    fontFamily: 'Inter',
    marginTop: 15,
  },
  portionValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  portionUnit: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
  },
  portionDisplay: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Inter',
  },
  portionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  portionButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  portionButtonActive: {
    backgroundColor: '#5B7FFF',
    borderColor: '#5B7FFF',
  },
  portionButtonText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  portionButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 30,
  },
  weightLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 12,
    fontFamily: 'Inter',
  },
  weightInput: {
    fontSize: 18,
    color: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#5B7FFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  weightUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  analyzeButton: {
    backgroundColor: '#5B7FFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});
