import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

export default function ChatbotScreen({ onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 'Sugar Lens'입니다 :)\n오늘 당뇨 관리에 대해 궁금한 점이 있으신가요?",
      isBot: true,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const quickButtons = [
    '저GI 음식',
    '식사 순서',
    '운동 시간',
    '간식 추천',
    '당뇨 상식'
  ];

  const handleSend = async () => {
  if (inputText.trim() === '') return;

  const userMessage = {
    id: Date.now(),
    text: inputText,
    isBot: false,
  };

  setMessages(prev => [...prev, userMessage]);
  const userInput = inputText;
  setInputText('');

  try {
  const response = await fetch(
    'https://us-central1-sugar-lens-1e06b.cloudfunctions.net/chatbot',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    }
  );

  const data = await response.json();

console.log('API 응답:', JSON.stringify(data));

const botMessage = {
  id: Date.now() + 1,
  text: data.response || data.reply || '죄송합니다. 응답을 받을 수 없습니다.',
  isBot: true,
};

  setMessages(prev => [...prev, botMessage]);
}catch (error) {
  console.error('챗봇 오류:', error);
  const errorMessage = {
    id: Date.now() + 1,
    text: '오류가 발생했습니다. 다시 시도해주세요.',
    isBot: true,
  };
  setMessages(prev => [...prev, errorMessage]);
}
  };

  const handleQuickButton = (text) => {
    setInputText(text);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
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
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Sugar Lens 챗봇</Text>
          <Text style={styles.headerSubtitle}>당뇨 관리 AI 상담</Text>
        </View>
      </View>

      {/* 메시지 목록 */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isBot ? styles.botMessageContainer : styles.userMessageContainer,
            ]}
          >
            {message.isBot && (
              <Image 
                source={require('../../assets/ai_profile.png')}
                style={styles.botAvatar}
                resizeMode="contain"
              />
            )}
            <View
              style={[
                styles.messageBubble,
                message.isBot ? styles.botBubble : styles.userBubble,
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isBot ? styles.botText : styles.userText,
              ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 하단 영역 */}
      <View style={styles.bottomContainer}>
        {/* 퀵 버튼 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickButtonContainer}
          contentContainerStyle={styles.quickButtonContent}
          keyboardShouldPersistTaps="handled"
        >
          {quickButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickButton}
              onPress={() => handleQuickButton(button)}
            >
              <Text style={styles.quickButtonText}>{button}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 입력창 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요"
            placeholderTextColor="#999"
            onSubmitEditing={handleSend}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
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
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 'auto',
    color: '#222',
    fontFamily: 'Inter',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#2D6EFF',
    fontFamily: 'Inter',
    marginTop: 5,
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: '#E8EEFF',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#5B7FFF',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  botText: {
    color: '#222',
  },
  userText: {
    color: '#FFFFFF',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
  },
  quickButtonContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    maxHeight: 60,
  },
  quickButtonContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5B7FFF',
    alignSelf: 'flex-start',
  },
  quickButtonText: {
    fontSize: 13,
    color: '#5B7FFF',
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 0,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter',
    color: '#222',
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: '#5B7FFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});
