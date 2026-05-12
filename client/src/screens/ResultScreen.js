import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function ResultScreen({ data, onNavigate }) {
  const [showAlternativeTab, setShowAlternativeTab] = useState(true);
  const foodName = data?.food_name || '음식';
const portion = data?.portion || 1;
const unit = data?.unit?.replace(/^1/, '') || '인분';  // "1개" → "개"
const portionGrams = Math.round((data?.portion_grams || 100) * portion);  // 포션에 맞게 계산
  
  const giValue = data?.gi_value || 55;
  const category = data?.category || '곡류';
  const carbs = data?.carbs || 65;
  const sugar = data?.sugar || 0.7;
  const calories = data?.calories || 320;
  
  // GI와 칼로리 기반 운동량 계산
const calculateExercise = () => {
  // 기본 칼로리 소모량 (분당)
  const walkingPerMin = 3.5; // kcal/분
  const runningPerMin = 8.0; // kcal/분
  const squatPerRep = 0.5; // kcal/회
  
  // GI 지수에 따른 가중치 (높을수록 더 많은 운동 필요)
  const giWeight = giValue / 100;
  
  // 칼로리 × GI 가중치
  const adjustedCalories = calories * (0.5 + giWeight * 0.5);
  
  return {
    walking: Math.round(adjustedCalories / walkingPerMin),
    running: Math.round(adjustedCalories / runningPerMin),
    squat: Math.round(adjustedCalories / squatPerRep),
  };
};

const exercise = data?.exercise || calculateExercise();
const walking = exercise.walking;
const running = exercise.running;
const squat = exercise.squat;

  // GI 등급 계산
  const getGiLevel = (gi) => {
    if (gi < 55) return 'safe';
    if (gi < 70) return 'warning';
    return 'danger';
  };

  const giLevel = getGiLevel(giValue);

  const getBadgeImage = () => {
    if (giLevel === 'safe') return require('../../assets/result_green_badge.png');
    if (giLevel === 'warning') return require('../../assets/result_orange_badge.png');
    return require('../../assets/result_red_badge.png');
  };

  const getHandleImage = () => {
    if (giLevel === 'safe') return require('../../assets/result_gi_handle_green.png');
    if (giLevel === 'warning') return require('../../assets/result_gi_handle_orange.png');
    return require('../../assets/result_gi_handle_red.png');
  };

  const getHandlePosition = () => {
    return `${giValue}%`;
  };

  const getGiValueColor = (gi) => {
  if (gi < 55) return '#22C55E';
  if (gi < 70) return '#F59E0B'; 
  return '#EF4444';  
};

  return (
    <View style={styles.container}>
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
              <Text style={styles.headerTitle}>분석 결과</Text>
            </View>

      <ScrollView style={styles.content}>
        {/* 대안 메뉴 탭 (위험 등급일 때만) */}
{giLevel === 'danger' && showAlternativeTab && (
  <View style={styles.alternativeTab}>
    <Text style={styles.alternativeQuestion}>
      대신 이런 음식을 먹어보는 게 어떤가요?
    </Text>
    <View style={styles.alternativeActions}>
      <TouchableOpacity onPress={() => setShowAlternativeTab(false)}>
        <Text style={styles.alternativeSkip}>창 닫기</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.alternativeButton}
        onPress={() => onNavigate('alternative')}
      >
        <Text style={styles.alternativeButtonText}>대안 메뉴 추천 ▶</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

        {/* 음식 정보 */}
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.foodPortion}>
  {portion}{unit} 기준 | {portion}{unit}({portionGrams}g)
</Text>
        </View>

        {/* GI 지수 카드 */}
<View style={styles.giCard}>
  <View style={styles.giHeader}>
    <Text style={styles.giLabel}>GI 지수</Text>
    <Image 
      source={getBadgeImage()}
      style={styles.giBadge}
      resizeMode="contain"
    />
  </View>

  <Text style={styles.giValue}>
  <Text style={{ color: getGiValueColor(giValue) }}>{giValue}</Text>
  <Text style={{ color: '#999' }}> / 100</Text>
</Text>

  {/* GI 슬라이더 */}
  <View style={styles.sliderContainer}>
    <Image 
      source={require('../../assets/result_gi_slider_bg.png')}
      style={styles.sliderBg}
      resizeMode="stretch"
    />
    <Image 
      source={getHandleImage()}
      style={[styles.sliderHandle, { left: `${giValue}%` }]}
      resizeMode="contain"
    />
  </View>

  <View style={styles.sliderLabels}>
    <View style={styles.sliderLabelItem}>
      <Text style={styles.sliderLabelNumber}>0</Text>
      <Text style={styles.sliderLabelSafe}>안심</Text>
    </View>
    <View style={styles.sliderLabelItem}>
      <Text style={styles.sliderLabelNumber}>55</Text>
      <Text style={styles.sliderLabelWarning}>주의</Text>
    </View>
    <View style={styles.sliderLabelItem}>
      <Text style={styles.sliderLabelNumber}>100</Text>
      <Text style={styles.sliderLabelDanger}>위험</Text>
    </View>
  </View>
</View>

        {/* 영양 정보 */}
<View style={styles.nutritionGrid}>
  <View style={styles.nutritionCard}>
    <Text style={styles.nutritionLabel}>카테고리</Text>
    <Text style={styles.nutritionValue}>{category}</Text>
  </View>
  <View style={styles.nutritionCard}>
    <Text style={styles.nutritionLabel}>탄수화물</Text>
    <Text style={styles.nutritionValue}>{carbs}g</Text>
  </View>
</View>

<View style={styles.nutritionGrid}>
  <View style={styles.nutritionCard}>
    <Text style={styles.nutritionLabel}>당류</Text>
    <Text style={styles.nutritionValue}>{sugar}g</Text>
  </View>
  <View style={styles.nutritionCard}>
    <Text style={styles.nutritionLabel}>열량</Text>
    <Text style={styles.nutritionValue}>{calories}Kcal</Text>
  </View>
</View>

        {/* 운동량 */}
        <View style={styles.exerciseContainer}>
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseLabel}>걷기</Text>
            <Text style={styles.exerciseValue}>{walking}분</Text>
          </View>
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseLabel}>러닝</Text>
            <Text style={styles.exerciseValue}>{running}분</Text>
          </View>
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseLabel}>스쿼트</Text>
            <Text style={styles.exerciseValue}>{squat}회</Text>
          </View>
        </View>

        {/* 홈으로 버튼 */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
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
  },
  alternativeTab: {
  margin: 16,
  padding: 20,
  backgroundColor: '#E8F0FF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#5B7FFF',
},
alternativeQuestion: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#5B7FFF',
  marginBottom: 16,
  fontFamily: 'Inter',
},
alternativeActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
alternativeSkip: {
  fontSize: 16,
  color: '#5B7FFF',
  fontFamily: 'Inter',
},
alternativeButton: {
  backgroundColor: '#5B7FFF',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 20,
},
alternativeButtonText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#FFFFFF',
  fontFamily: 'Inter',
},
  foodInfo: {
    padding: 20,
  },
  foodName: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    fontFamily: 'Inter',
    alignSelf: 'flex-start',
    marginBottom: '-2',
    marginTop: -20,
  },
  foodPortion: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter',
    marginBottom: '-20',
  },
  giCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  giHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  giLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
  },
  giBadge: {
    width: 60,
    height: 30,
    marginBottom: '-20',
  },
  giValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222222',
    fontFamily: 'Inter',
  },
  sliderContainer: {
  position: 'relative',
  height: 60,
  justifyContent: 'center',
},
sliderBg: {
  width: '100%',
  height: 20,
},
sliderHandle: {
  position: 'absolute',
  width: 40,
  height: 40,
  marginLeft: -20,
},
sliderLabels: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
sliderLabelItem: {
  alignItems: 'center',
},
sliderLabelNumber: {
  fontSize: 12,
  color: '#999',
  marginBottom: 4,
  fontFamily: 'Inter',
},
sliderLabelSafe: {
  fontSize: 12,
  color: '#4CAF50',
  fontFamily: 'Inter',
},
sliderLabelWarning: {
  fontSize: 12,
  color: '#FF9800',
  fontFamily: 'Inter',
},
sliderLabelDanger: {
  fontSize: 12,
  color: '#F44336',
  fontFamily: 'Inter',
},
nutritionGrid: {
  flexDirection: 'row',
  paddingHorizontal: 16,
  gap: 12,
  marginBottom: 12,
},
  nutritionCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  nutritionLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
  },
  exerciseContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  exerciseCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E8EEFF',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: '-10',
    marginBottom: '-10',
  },
  exerciseLabel: {
    fontSize: 15,
    color: '#5B7FFF',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  exerciseValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
  },
  homeButton: {
    margin: 16,
    padding: 18,
    backgroundColor: '#5B7FFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});
