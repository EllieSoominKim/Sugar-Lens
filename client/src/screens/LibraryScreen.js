import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function LibraryScreen({ onNavigate }) {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('home')}
        >
          <Image 
            source={require('../../assets/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>라이브러리</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 첫 번째 카드 */}
        <View style={styles.categoryGrid}>
          <TouchableOpacity 
            style={[styles.categoryCard, { borderColor: '#5B7FFF' }]}
            onPress={() => onNavigate('libraryDetail', { category: 'diabetes_management', index: 0 })}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#E8F0FF' }]}>
                <Image 
                  source={require('../../assets/lib_management.png')}
                  style={styles.categoryIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>당뇨 관리</Text>
                <Text style={styles.categorySubtitle}>식이섬유로 완성하는 혈당 밸런스</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryCard, { borderColor: '#4CAF50' }]}
            onPress={() => onNavigate('libraryDetail', { category: 'low_gi_foods', index: 0 })}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                <Image 
                  source={require('../../assets/lib_food.png')}
                  style={styles.categoryIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>저GI 식품</Text>
                <Text style={styles.categorySubtitle}>혈당 지수를 고려한 식품 가이드</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 두 번째 카드 */}
        <View style={styles.categoryGrid}>
          <TouchableOpacity 
            style={[styles.categoryCard, { borderColor: '#FF9800' }]}
            onPress={() => onNavigate('libraryDetail', { category: 'lifestyle', index: 0 })}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                <Image 
                  source={require('../../assets/lib_habit.png')}
                  style={styles.categoryIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>생활 습관</Text>
                <Text style={styles.categorySubtitle}>공복 혈당을 낮추는 생활 수칙</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.categoryCard, { borderColor: '#F44336' }]}
            onPress={() => onNavigate('libraryDetail', { category: 'exercise', index: 0 })}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
                <Image 
                  source={require('../../assets/lib_exercise.png')}
                  style={styles.categoryIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>운동 / 활동</Text>
                <Text style={styles.categorySubtitle}>혈당을 태우는 효율적인 운동</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
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
  categoryGrid: {
    flexDirection: 'column', 
    paddingHorizontal: 16,
    gap: 10, 
    marginTop: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    minHeight: 120,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 35,
    height: 35,
  },
  textContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'Inter',
    lineHeight: 20,
  },
});
