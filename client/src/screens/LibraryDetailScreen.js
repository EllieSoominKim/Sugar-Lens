import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function LibraryDetailScreen({ category, index, contentId, onNavigate, from }) {
  const [content, setContent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch(
        'https://us-central1-sugar-lens-1e06b.cloudfunctions.net/library'
      );
      const data = await response.json();
      setContent(data.categories[category]);
      
      if (contentId && data.categories[category]) {
        const foundIndex = data.categories[category].content.findIndex(
          item => item.id === contentId
        );
        if (foundIndex !== -1) {
          setCurrentIndex(foundIndex);
        }
      }
    } catch (error) {
      console.error('콘텐츠 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDetailCardColor = (key) => {
    const cards = {
      diabetes_management: require('../../assets/detail_card_blue.png'),
      low_gi_foods: require('../../assets/detail_card_green.png'),
      lifestyle: require('../../assets/detail_card_yellow.png'),
      exercise: require('../../assets/detail_card_red.png'),
    };
    return cards[key];
  };

  const getTextColor = (key) => {
    const colors = {
      diabetes_management: '#1E4CB2',
      low_gi_foods: '#158611',
      lifestyle: '#F59E0B',
      exercise: '#EF4444',
    };
    return colors[key] || '#FFFFFF';
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < content.content.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B7FFF" />
      </View>
    );
  }

  const currentItem = content.content[currentIndex];
  const totalCount = content.content.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
  style={styles.backButton}
  onPress={() => {
    console.log('from:', from);  // 디버깅용
    if (from === 'home' || from === 'tip') {
      onNavigate('home');
    } else {
      onNavigate('library');
    }
  }}
>
          <Image 
            source={require('../../assets/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>라이브러리</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.cardContainer}>
          <Image 
            source={getDetailCardColor(category)}
            style={styles.cardBg}
            resizeMode="stretch"
          />
          <View style={styles.cardTextOverlay}>
            <Text style={[styles.categoryText, { color: getTextColor(category) }]}>
              {content.title}
            </Text>
            <Text style={[styles.itemTitle, { color: getTextColor(category) }]}>
              {currentItem.title}
            </Text>
            <Text style={styles.itemSummary}>
              {currentItem.summary}
            </Text>
            <Text style={styles.itemContent}>
              {currentItem.content}
            </Text>
            <Text style={[styles.pageNumber, { color: getTextColor(category) }]}>
              {currentIndex + 1}/{totalCount}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrev} 
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, currentIndex === totalCount - 1 && styles.navButtonDisabled]}
          onPress={handleNext} 
          disabled={currentIndex === totalCount - 1}
        >
          <Text style={styles.navButtonText}>다음</Text>
        </TouchableOpacity>
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
  cardContainer: {
    margin: 16,
    marginBottom: 24,
    position: 'relative',
  },
  cardBg: {
    width: '100%',
    height: 450,
    borderRadius: 16,
  },
  cardTextOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 17,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  pageNumber: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'right',
    fontFamily: 'Inter',
  },
  itemSummary: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'Inter',
    color: '#222222',
  },
  itemContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'Inter',
    color: '#222222',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    gap: 20,
    marginBottom:50,
  },
  navButton: {
    width: 150,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#2D6EFF',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
  },
});
