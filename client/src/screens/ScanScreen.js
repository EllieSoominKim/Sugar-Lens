import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanScreen({ onNavigate, onResult }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current && !isScanning) {
      setIsScanning(true);
      
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        console.log('사진 촬영 완료');
        console.log('Base64 길이:', photo.base64 ? photo.base64.length : 'null');

        // API 호출
        const response = await fetch(
          'https://us-central1-sugar-lens-1e06b.cloudfunctions.net/scan',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_base64: photo.base64,
            }),
          }
        );

        const data = await response.json();
        console.log('API 응답:', JSON.stringify(data, null, 2));
        
        // 데이터 변환
        // 데이터 변환
const formattedData = {
  success: data.matched,
  food_name: data.nutrition?.food_name_ko || '알 수 없는 음식',
  unit: data.nutrition?.serving_label || '1인분',
  portion_options: [0.5, 1, 1.5, 2],
  gi_value: data.nutrition?.gi_value || 55,
  gi_grade: data.nutrition?.gi_grade || 'medium',
  category: data.nutrition?.category || '기타',
  carbs: data.nutrition?.carbs_g || 0,
  sugar: data.nutrition?.sugar_g || 0,
  calories: data.nutrition?.kcal || 0,
  portion_grams: data.nutrition?.serving_size_g || 100,
  alternatives: data.alternatives || [],
};
        if (data.matched) {
          onResult(formattedData);
          onNavigate('portionConfirm');
        } else {
          Alert.alert('오류', '음식을 인식할 수 없습니다.');
          setIsScanning(false);
        }
      } catch (error) {
        console.error('스캔 오류:', error);
        Alert.alert('오류', '스캔 중 문제가 발생했습니다: ' + error.message);
        setIsScanning(false);
      }
    }
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B7FFF" />
        <Text style={styles.loadingText}>카메라 권한 확인 중...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
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
          <Text style={styles.headerTitle}>스캔</Text>
        </View>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>카메라 권한이 필요합니다.</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>권한 허용</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>스캔</Text>
      </View>

      {/* 카메라 */}
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera}
          facing="back"
          ref={cameraRef}
        />
        
        {/* AI Scanning 배지 - 카메라 밖으로 */}
        {isScanning && (
  <View style={styles.scanningOverlay}>
    <Image 
      source={require('../../assets/scan_ai_badge.png')}
      style={styles.aiBadge}
      resizeMode="contain"
    />
    <ActivityIndicator size="large" color="#FFFFFF" style={styles.loadingIndicator} />
  </View>
)}

        {/* 가이드 텍스트 - 카메라 밖으로 */}
        {!isScanning && (
          <Text style={styles.guideText}>음식을 화면 안에 맞춰주세요</Text>
        )}
      </View>

      {/* 카메라 버튼 */}
      <TouchableOpacity 
        style={styles.cameraButtonContainer}
        onPress={takePicture}
        disabled={isScanning}
      >
        <Image 
          source={require('../../assets/scan_camera_button.png')}
          style={[styles.cameraButton, isScanning && styles.cameraButtonDisabled]}
          resizeMode="contain"
        />
      </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontFamily: 'Inter',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  permissionButton: {
    backgroundColor: '#5B7FFF',
    padding: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  cameraContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scanningOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  alignItems: 'center',
},
scanningContent: {
  alignItems: 'center',
},
aiBadge: {
  width: 150,
  height: 50,
  marginTop: 20,
},
loadingIndicator: {
  position: 'absolute',
  top: '50%',
  marginTop: -20,
},
  guideText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cameraButtonContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  cameraButton: {
    width: 70,
    height: 70,
  },
  cameraButtonDisabled: {
    opacity: 0.5,
  },
});
