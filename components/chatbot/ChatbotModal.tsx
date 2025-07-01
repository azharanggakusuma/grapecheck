// components/chatbot/ChatbotModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  TextInput,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const TypingIndicator = ({ themeColors }: { themeColors: any }) => {
  const animations = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const createAnimation = (anim: Animated.Value) => Animated.sequence([
      Animated.timing(anim, { toValue: -6, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]);
    const loop = Animated.loop(Animated.stagger(200, animations.map(createAnimation)));
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={[styles.messageContainer, styles.botMessageContainer]}>
      <LinearGradient colors={[`${themeColors.tint}2A`, `${themeColors.tint}0A`]} style={styles.botAvatar}>
        <Feather name="cpu" size={20} color={themeColors.tint} />
      </LinearGradient>
      <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        {animations.map((anim, index) => (
          <Animated.View key={index} style={[styles.typingDot, { backgroundColor: themeColors.tabIconDefault, transform: [{ translateY: anim }] }]} />
        ))}
      </View>
    </View>
  );
};

const MessageBubble = ({ message, themeColors }: { message: Message, themeColors: any }) => {
  const isBot = message.sender === 'bot';
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, speed: 15, bounciness: 10, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.messageContainer, 
      isBot ? styles.botMessageContainer : styles.userMessageContainer,
      { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
    ]}>
      {isBot && (
        <LinearGradient colors={[`${themeColors.tint}2A`, `${themeColors.tint}0A`]} style={styles.botAvatar}>
          <Feather name="cpu" size={20} color={themeColors.tint} />
        </LinearGradient>
      )}
      <LinearGradient
        colors={isBot ? [themeColors.surface, themeColors.surface] : [`#22C55E`, `#00880C`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble, { borderColor: themeColors.border }]}
      >
        <Text style={[styles.messageText, { color: isBot ? themeColors.text : '#FFFFFF' }]}>{message.text}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const AnimatedSuggestionChip = ({ text, onPress, themeColors, index }: { text: string; onPress: () => void; themeColors: any; index: number }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const transformAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 500, delay: 200 + index * 100, useNativeDriver: true }).start();
    Animated.spring(transformAnim, { toValue: 0, speed: 12, bounciness: 8, delay: 200 + index * 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: transformAnim }] }}>
      <TouchableOpacity onPress={onPress} style={[styles.chip, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Text style={[styles.chipText, { color: themeColors.tint }]}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ChatbotModal: React.FC<{ visible: boolean; onClose: () => void; }> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  const handleSendPressIn = () => Animated.spring(sendButtonScale, { toValue: 0.85, useNativeDriver: true }).start();
  const handleSendPressOut = () => Animated.spring(sendButtonScale, { toValue: 1, friction: 3, tension: 50, useNativeDriver: true }).start();
  
  useEffect(() => {
    if (visible && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{ id: '1', text: 'Halo! Saya GrapeCheck Bot. Ada yang bisa saya bantu?', sender: 'bot' }]);
      }, 1200);
    } else if (!visible) {
      setTimeout(() => {
        setMessages([]);
        setIsTyping(false);
      }, 300); // Reset after modal close animation
    }
  }, [visible]);

  const handleSend = () => {
    if (input.trim().length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    
    const userMessage = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = { id: (Date.now() + 1).toString(), text: `Jawaban untuk "${userMessage}" akan segera hadir. Fitur ini masih dalam pengembangan.`, sender: 'bot' };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500 + Math.random() * 500);
  };
  
  const handleSuggestionPress = (suggestion: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newMessage: Message = { id: Date.now().toString(), text: suggestion, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = { id: (Date.now() + 1).toString(), text: `Jawaban untuk "${suggestion}" akan segera hadir. Fitur ini masih dalam pengembangan.`, sender: 'bot' };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500 + Math.random() * 500);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const suggestions = ["Apa itu penyakit Black Rot?", "Gejala penyakit Esca", "Cara mencegah jamur"];

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerTitleContainer}>
                <Feather name="cpu" size={22} color={colors.tint} />
                <Text style={[styles.headerTitle, { color: colors.text }]}>GrapeCheck Bot</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <View style={[styles.closeButtonInner, { backgroundColor: colors.surface }]}>
                    <Feather name="x" size={18} color={colors.text} />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.chatContainer}>
              {messages.map(msg => <MessageBubble key={msg.id} message={msg} themeColors={colors} />)}
              {isTyping && <TypingIndicator themeColors={colors} />}
              {messages.length === 1 && !isTyping && (
                <View style={styles.chipContainer}>
                    {suggestions.map((item, index) => (
                      <AnimatedSuggestionChip key={item} text={item} onPress={() => handleSuggestionPress(item)} themeColors={colors} index={index} />
                    ))}
                </View>
              )}
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
                <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
                    <TextInput
                    style={[styles.textInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                    placeholder="Tulis pesan..."
                    placeholderTextColor={colors.tabIconDefault}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                    />
                    <TouchableOpacity onPress={handleSend} onPressIn={handleSendPressIn} onPressOut={handleSendPressOut}>
                        <Animated.View style={[styles.sendButton, { backgroundColor: colors.tint, transform: [{ scale: sendButtonScale }] }]}>
                            <Feather name="send" size={20} color="#fff" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: '95%',
    width: '100%',
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 5
  },
  closeButtonInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  botBubble: {
    borderTopLeftRadius: 6,
    borderWidth: 1,
  },
  userBubble: {
    borderTopRightRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 23,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 48,
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});