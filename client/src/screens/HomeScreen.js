import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ onNavigate }) {
  const [dailyTip, setDailyTip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyTip();
  }, []);

  const loadDailyTip = async () => {
    try {
      const response = await fetch(
        'https://us-central1-sugar-lens-1e06b.cloudfunctions.net/library'
      );
      const data = await response.json();
      
      // 전체 콘텐츠 수집
      const allContent = [];
      Object.values(data.categories).forEach(cat => {
        allContent.push(...cat.content);
      });
      
      // 오늘 날짜로 시드 생성
      const now = new Date();
      const dateString = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
      let hash = 0;
      for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash = hash & hash;
      }
      
      // 날짜 기반 인덱스
      const index = Math.abs(hash) % allContent.length;
      setDailyTip(allContent[index]);
      
    } catch (error) {
      console.error('팁 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getKoreanDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>안녕하세요!</Text>
        <Text style={styles.subtitle}>오늘도 건강하게.</Text>
        <Text style={styles.date}>{getKoreanDate()}</Text>
      </View>

      {/* 음식 스캐너 버튼 */}
<TouchableOpacity onPress={() => onNavigate('scan')} style={styles.buttonWrapper}>
  <LinearGradient
  colors={['#0043D8', '#6F9BFF']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.scannerButton}
>
  <Text style={styles.buttonTitleWhite}>음식 스캐너</Text>
  <Text style={styles.buttonSubtitleWhite}>카메라로 찍으면 영양 자동 분석</Text>
  <Text style={styles.buttonArrowWhite}>›</Text>
</LinearGradient>
</TouchableOpacity>

{/* AI 푸드 코치 버튼 */}
<TouchableOpacity onPress={() => onNavigate('chatbot')} style={styles.buttonWrapper}>
  <LinearGradient
  colors={['#6F9BFF', '#CCDEFF']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.coachButton}
>
  <Text style={styles.buttonTitleBlack}>AI 푸드 코치에게 물어보기</Text>
  <Text style={styles.buttonSubtitleBlue}>AI와 대화하며 당뇨 궁금증 해결</Text>
  <Text style={styles.buttonArrowBlack}>›</Text>
</LinearGradient>
</TouchableOpacity>

      {/* 오늘의 팁 */}
      <Text style={styles.sectionTitle}>오늘의 팁</Text>
      
      {loading ? (
        <View style={styles.tipLoading}>
          <ActivityIndicator size="small" color="#5B7FFF" />
        </View>
      ) : dailyTip ? (
        <TouchableOpacity 
  style={styles.tipCard}
  onPress={() => {
    if (dailyTip) {
      // dailyTip의 ID로 해당 카테고리 내 인덱스 찾기
      const categoryMap = {
        '당뇨 관리': 'diabetes_management',
        '저GI 식품': 'low_gi_foods',
        '생활 습관': 'lifestyle',
        '운동/활동': 'exercise',
      };
      
      onNavigate('libraryDetail', { 
        category: categoryMap[dailyTip.category],
        contentId: dailyTip.id,  // ID 전달
        from: 'tip'
      });
    }
  }}
>
          <Text style={styles.tipIcon}>{dailyTip.icon}</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>{dailyTip.title}</Text>
            <Text style={styles.tipSummary} numberOfLines={1}>
              {dailyTip.summary}
            </Text>
          </View>
          <Text style={styles.tipArrow}>›</Text>
        </TouchableOpacity>
      ) : null}

      {/* 당뇨 정보 라이브러리 */}
<Text style={styles.sectionTitle}>당뇨 정보 라이브러리</Text>

<View style={styles.cardGrid}>
  <TouchableOpacity 
  style={styles.libraryCard}
  onPress={() => onNavigate('libraryDetail', { 
    category: 'diabetes_management', 
    index: 0,
    from: 'home'
  })}
>
    <View style={[styles.iconCircle, { backgroundColor: '#EAF1FE' }]}>
      <Image 
        source={require('../../assets/card_management.png')}
        style={styles.cardIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.cardTitle}>당뇨 관리</Text>
    <Text style={styles.cardSubtitle}>카드 보기 ▶</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.libraryCard}
    onPress={() => onNavigate('libraryDetail', { 
  category: 'low_gi_foods', 
  index: 0,
  from: 'home'
})}
  >
    <View style={[styles.iconCircle, { backgroundColor: '#EAF1FE' }]}>
      <Image 
        source={require('../../assets/card_food.png')}
        style={styles.cardIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.cardTitle}>저GI 식품</Text>
    <Text style={styles.cardSubtitle}>카드 보기 ▶</Text>
  </TouchableOpacity>
</View>

<View style={styles.cardGrid}>
  <TouchableOpacity 
    style={styles.libraryCard}
    onPress={() => onNavigate('libraryDetail', { 
  category: 'lifestyle', 
  index: 0,
  from: 'home'
})}
  >
    <View style={[styles.iconCircle, { backgroundColor: '#EAF1FE' }]}>
      <Image 
        source={require('../../assets/card_lifestyle.png')}
        style={styles.cardIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.cardTitle}>생활 습관</Text>
    <Text style={styles.cardSubtitle}>카드 보기 ▶</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.libraryCard}
    onPress={() => onNavigate('libraryDetail', { 
  category: 'exercise', 
  index: 0,
  from: 'home'
})}
  >
    <View style={[styles.iconCircle, { backgroundColor: '#EAF1FE' }]}>
      <Image 
        source={require('../../assets/card_exercise.png')}
        style={styles.cardIcon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.cardTitle}>운동 / 활동</Text>
    <Text style={styles.cardSubtitle}>카드 보기 ▶</Text>
  </TouchableOpacity>
</View>

      <View style={{height: 20}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5B7FFF',
    fontFamily: 'Inter',
    marginTop: 3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginBottom: 12,
  },
  scannerButton: {
    width: '100%',
    height: 110,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  coachButton: {
    width: '100%',
    height: 110,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  buttonTitleWhite: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#FFFFFF',
  fontFamily: 'Inter',
  marginBottom: 8,
},
buttonSubtitleWhite: {
  fontSize: 16,
  color: '#FFFFFF',
  fontFamily: 'Inter',
  fontWeight: 'bold',

},
buttonArrowWhite: {
  position: 'absolute',
  right: 20,
  top: '50%',
  marginTop: -20,
  fontSize: 40,
  color: '#FFFFFF',
  opacity: 0.7,
},
buttonTitleBlack: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#000000',
  fontFamily: 'Inter',
  marginBottom: 8,
},
buttonSubtitleBlue: {
  fontSize: 16,
  color: '#1E4CB2',
  fontFamily: 'Inter',
  fontWeight: 'bold',
},
buttonArrowBlack: {
  position: 'absolute',
  right: 20,
  top: '50%',
  marginTop: -20,
  fontSize: 40,
  color: '#000000',
  opacity: 0.3,
},
  buttonArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -20,
    fontSize: 40,
    color: '#FFFFFF',
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  tipLoading: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 27,
    borderRadius: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#2D6EFF',
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  tipSummary: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Inter',
  },
  tipArrow: {
    fontSize: 24,
    color: '#CCC',
  },
  cardGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  libraryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#2D6EFF',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter',
  },
});
