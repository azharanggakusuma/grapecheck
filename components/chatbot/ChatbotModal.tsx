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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

// Tipe untuk setiap pesan
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

// --- Komponen Animasi Mengetik (Sudah Diperbarui) ---
const TypingIndicator = ({ themeColors }: { themeColors: any }) => {
  const yAnim1 = useRef(new Animated.Value(0)).current;
  const yAnim2 = useRef(new Animated.Value(0)).current;
  const yAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value) => 
      Animated.sequence([
        Animated.timing(animValue, { toValue: -5, duration: 300, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]);

    const loop = Animated.loop(
      Animated.stagger(150, [
        createAnimation(yAnim1),
        createAnimation(yAnim2),
        createAnimation(yAnim3),
      ])
    );
    loop.start();
    
    return () => loop.stop();
  }, []);

  return (
    // Pembungkus agar tata letaknya sama seperti pesan bot
    <View style={[styles.messageContainer, styles.botMessageContainer]}>
      {/* Avatar Bot */}
      <LinearGradient colors={[`${themeColors.tint}2A`, `${themeColors.tint}0A`]} style={styles.botAvatar}>
        <Feather name="cpu" size={20} color={themeColors.tint} />
      </LinearGradient>
      {/* Animasi titik-titik */}
      <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Animated.View style={[styles.typingDot, { backgroundColor: themeColors.tabIconDefault, transform: [{ translateY: yAnim1 }] }]} />
        <Animated.View style={[styles.typingDot, { backgroundColor: themeColors.tabIconDefault, transform: [{ translateY: yAnim2 }] }]} />
        <Animated.View style={[styles.typingDot, { backgroundColor: themeColors.tabIconDefault, transform: [{ translateY: yAnim3 }] }]} />
      </View>
    </View>
  );
};


// Komponen untuk bubble chat
const MessageBubble = ({ message, themeColors }: { message: Message, themeColors: any }) => {
  const isBot = message.sender === 'bot';
  const slideAnim = useRef(new Animated.Value(isBot ? -50 : 50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 6,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const bubbleStyle = isBot ? styles.botBubble : styles.userBubble;
  const textStyle = isBot ? { color: themeColors.text } : { color: '#FFFFFF' };
  const transformStyle = { transform: [{ translateX: slideAnim }, { scale: opacityAnim }] };

  return (
    <Animated.View style={[
      styles.messageContainer, 
      isBot ? styles.botMessageContainer : styles.userMessageContainer,
      transformStyle,
      { opacity: opacityAnim }
    ]}>
      {isBot && (
        <LinearGradient colors={[`${themeColors.tint}2A`, `${themeColors.tint}0A`]} style={styles.botAvatar}>
          <Feather name="cpu" size={20} color={themeColors.tint} />
        </LinearGradient>
      )}
      <LinearGradient
        colors={isBot ? [themeColors.surface, themeColors.surface] : [`${themeColors.primaryLight}`, `${themeColors.tint}`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.messageBubble, bubbleStyle, { borderColor: themeColors.border }]}
      >
        <Text style={[styles.messageText, textStyle]}>{message.text}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// Komponen untuk chip saran
const SuggestionChip = ({ text, onPress, themeColors }: { text: string, onPress: () => void, themeColors: any }) => (
  <TouchableOpacity onPress={onPress} style={[styles.chip, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
    <Text style={[styles.chipText, { color: themeColors.tint }]}>{text}</Text>
  </TouchableOpacity>
);

// Komponen utama Modal Chatbot
export const ChatbotModal: React.FC<{ visible: boolean; onClose: () => void; }> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          { id: '1', text: 'Halo! Saya GrapeCheck Bot. Ada yang bisa saya bantu terkait penyakit daun anggur?', sender: 'bot' }
        ]);
        setIsTyping(false);
      }, 1200);
    } else if (!visible) {
        setMessages([]);
        setIsTyping(false);
    }
  }, [visible]);

  const handleSend = () => {
    if (input.trim().length === 0) return;

    const newMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    
    const userMessage = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Maaf, saya masih dalam tahap pengembangan dan belum bisa memproses permintaan "${userMessage}".`,
        sender: 'bot',
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500 + Math.random() * 500);
  };
  
  const handleSuggestionPress = (suggestion: string) => {
    const newMessage: Message = { id: Date.now().toString(), text: suggestion, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Maaf, saya masih dalam tahap pengembangan dan belum bisa memproses permintaan "${suggestion}".`,
        sender: 'bot',
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500 + Math.random() * 500);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header Modal */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerTitleContainer}>
                <Feather name="cpu" size={22} color={colors.tint} />
                <Text style={[styles.headerTitle, { color: colors.text }]}>GrapeCheck Bot</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Konten Chat */}
            <ScrollView 
              ref={scrollViewRef}
              contentContainerStyle={styles.chatContainer}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(msg => <MessageBubble key={msg.id} message={msg} themeColors={colors} />)}
              
              {isTyping && <TypingIndicator themeColors={colors} />}

              {messages.length === 1 && !isTyping && (
                <View style={styles.chipContainer}>
                    <SuggestionChip text="Apa itu Black Rot?" onPress={() => handleSuggestionPress("Apa itu Black Rot?")} themeColors={colors} />
                    <SuggestionChip text="Gejala Esca" onPress={() => handleSuggestionPress("Gejala Esca")} themeColors={colors} />
                </View>
              )}
            </ScrollView>

            {/* Input Chat */}
            <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                placeholder="Ketik pertanyaanmu..."
                placeholderTextColor={colors.tabIconDefault}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: colors.tint }]}>
                <Feather name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
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
    height: '92%',
    width: '100%',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeButton: {},
  chatContainer: {
    flexGrow: 1,
    padding: 15,
  },
  messageContainer: {
    marginVertical: 5,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  botBubble: {
    borderTopLeftRadius: 5,
    borderWidth: 1,
  },
  userBubble: {
    borderTopRightRadius: 5,
  },
  messageText: {
    fontSize: 15.5,
    lineHeight: 22,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 44,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
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
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 18,
    marginRight: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Style untuk typing indicator yang baru
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // Disesuaikan agar titik-titik di tengah
    paddingHorizontal: 16,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});