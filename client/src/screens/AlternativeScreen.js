import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function AlternativeScreen({ currentFood, onNavigate }) {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlternatives();
  }, []);

  const loadAlternatives = async () => {
    const currentCategory = currentFood?.category || '곡류';
    const currentGI = currentFood?.gi_value || 84;

    // CSV 기반 대안 데이터베이스
    const foodDatabase = {
      '곡류': [
        { name: '통밀빵', category: '곡류', portion: '2조각(70g)', gi_value: 53 },
        { name: '현미밥', category: '곡류', portion: '1공기(210g)', gi_value: 55 },
        { name: '콩밥', category: '곡류', portion: '1공기(210g)', gi_value: 52 },
        { name: '파스타', category: '곡류', portion: '1접시(300g)', gi_value: 49 },
        { name: '잡곡밥', category: '곡류', portion: '1공기(210g)', gi_value: 58 },
      ],
      '빵류': [
        { name: '통밀빵', category: '빵류', portion: '2조각(70g)', gi_value: 53 },
        { name: '마늘빵', category: '빵류', portion: '2조각(80g)', gi_value: 66 },
        { name: '크루아상', category: '빵류', portion: '1개(60g)', gi_value: 67 },
      ],
      '면류': [
        { name: '파스타', category: '면류', portion: '1접시(300g)', gi_value: 49 },
        { name: '크림파스타', category: '면류', portion: '1접시(350g)', gi_value: 54 },
        { name: '잔치국수', category: '면류', portion: '1그릇(500g)', gi_value: 61 },
      ],
      '과일': [
        { name: '사과', category: '과일', portion: '1개(150g)', gi_value: 36 },
        { name: '배', category: '과일', portion: '1개(180g)', gi_value: 38 },
        { name: '딸기', category: '과일', portion: '1컵(150g)', gi_value: 41 },
        { name: '복숭아', category: '과일', portion: '1개(150g)', gi_value: 42 },
        { name: '오렌지', category: '과일', portion: '1개(180g)', gi_value: 43 },
      ],
      '디저트': [
        { name: '아이스크림', category: '디저트', portion: '1컵(100g)', gi_value: 61 },
        { name: '치즈케이크', category: '디저트', portion: '1조각(120g)', gi_value: 63 },
        { name: '쿠키', category: '디저트', portion: '3개(50g)', gi_value: 64 },
      ],
      '음료': [
        { name: '아메리카노', category: '음료', portion: '1잔(355ml)', gi_value: 0 },
        { name: '카페라떼', category: '음료', portion: '1잔(355ml)', gi_value: 41 },
        { name: '초코우유', category: '음료', portion: '1팩(240ml)', gi_value: 49 },
      ],
      '한식': [
        { name: '된장찌개', category: '한식', portion: '1뚝배기(400g)', gi_value: 32 },
        { name: '순두부찌개', category: '한식', portion: '1뚝배기(400g)', gi_value: 34 },
        { name: '김치찌개', category: '한식', portion: '1뚝배기(400g)', gi_value: 38 },
      ],
      '간식': [
        { name: '감자칩', category: '간식', portion: '1봉지(60g)', gi_value: 56 },
        { name: '찐고구마', category: '간식', portion: '1개(150g)', gi_value: 63 },
      ],
    };

    // 카테고리에 맞는 음식 선택
    let categoryFoods = foodDatabase[currentCategory] || foodDatabase['과일'];

    // 현재 음식보다 GI가 낮은 음식만 필터링
    let recommendations = categoryFoods.filter(food => food.gi_value < currentGI);

    // GI 낮은 순으로 정렬 후 상위 3개
    recommendations = recommendations
      .sort((a, b) => a.gi_value - b.gi_value)
      .slice(0, 3);

    // 3개 미만이면 다른 카테고리에서 추가
    if (recommendations.length < 3) {
      const extraFoods = [
        { name: '사과', category: '과일', portion: '1개(150g)', gi_value: 36 },
        { name: '현미밥', category: '곡류', portion: '1공기(210g)', gi_value: 55 },
        { name: '통밀빵', category: '빵류', portion: '2조각(70g)', gi_value: 53 },
      ];
      recommendations = [...recommendations, ...extraFoods].slice(0, 3);
    }

    setAlternatives(recommendations);
  };

  const getFoodIcon = (category) => {
    const colors = {
      '곡류': '#FDE68A',
      '빵류': '#FED7AA',
      '면류': '#FEF3C7',
      '과일': '#86EFAC',
      '디저트': '#FBCFE8',
      '음료': '#BAE6FD',
      '한식': '#FCA5A5',
      '간식': '#93C5FD',
      '양식': '#C7D2FE',
    };
    return colors[category] || '#CBD5E1';
  };

  const getFoodEmoji = (category) => {
    const emojis = {
      '곡류': '🌾',
      '빵류': '🍞',
      '면류': '🍜',
      '과일': '🍎',
      '디저트': '🍰',
      '음료': '☕',
      '한식': '🍲',
      '간식': '🍪',
      '양식': '🍝',
    };
    return emojis[category] || '🍽️';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B7FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('result')}
        >
          <Image 
            source={require('../../assets/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대안 메뉴</Text>
      </View>

      {/* 타이틀 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>대안 메뉴</Text>
        <Text style={styles.subtitle}>혈당 부담이 낮은 식품을 선택해보세요:)</Text>
      </View>

      {/* 대안 음식 카드 */}
      <View style={styles.cardList}>
        {alternatives.map((food, index) => (
          <View key={index} style={styles.foodCard}>
            <View style={styles.cardLeft}>
              <View style={[styles.foodIconCircle, { backgroundColor: getFoodIcon(food.category) }]}>
                <Text style={styles.foodIconText}>{getFoodEmoji(food.category)}</Text>
              </View>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodDetail}>
                  {food.category} | {food.portion}
                </Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.giLabel}>GI</Text>
              <Text style={styles.giValue}>{food.gi_value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  titleContainer: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5B7FFF',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter',
    marginBottom: -15,
  },
  cardList: {
    padding: 16,
    gap: 12,
  },
  foodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  foodIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  foodIconText: {
    fontSize: 28,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  foodDetail: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  giLabel: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  giValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
  },
});
