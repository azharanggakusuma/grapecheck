// components/chatbot/ChatbotModal.tsx
import React, { useState, useRef, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/components/ui/ThemeProvider";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { CHAT_URL, CHAT_RESET_URL } from "@/constants/api";
import Markdown from 'react-native-markdown-display';
import { staticChatResponses } from "@/constants/staticChatData";

// --- INTERFACES & TYPES ---
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
}

type ConnectionStatus = 'connecting' | 'connected_server' | 'connected_static' | 'error';

// --- SUB-KOMPONEN ---

const SuggestionChip = ({ text, onPress, themeColors }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      { backgroundColor: themeColors.surface, borderColor: themeColors.border },
    ]}
    accessibilityRole="button"
    accessibilityLabel={`Suggestion: ${text}`}
  >
    <Text style={[styles.chipText, { color: themeColors.tint }]}>{text}</Text>
  </TouchableOpacity>
);

const TypingIndicator = ({ themeColors }: { themeColors: any }) => {
    const animations = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
      ];
      useEffect(() => {
        const createAnimation = (anim: Animated.Value) =>
          Animated.sequence([
            Animated.timing(anim, {
              toValue: -5,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]);
        const loop = Animated.loop(
          Animated.stagger(150, animations.map(createAnimation))
        );
        loop.start();
        return () => loop.stop();
      }, []);
    
      return (
        <View style={[styles.messageContainer, styles.botMessageContainer]}>
          <LinearGradient
            colors={[`${themeColors.tint}2A`, `${themeColors.tint}0A`]}
            style={styles.botAvatar}
          >
            <MaterialCommunityIcons
              name="robot-happy-outline"
              size={22}
              color={themeColors.tint}
            />
          </LinearGradient>
          <View
            style={[
              styles.messageBubble,
              styles.botBubble,
              styles.typingBubble,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
              },
            ]}
          >
            {animations.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.typingDot,
                  {
                    backgroundColor: themeColors.tabIconDefault,
                    transform: [{ translateY: anim }],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      );
};

const MessageBubble = ({ message, themeColors }: { message: Message; themeColors: any; }) => {
    const isBot = message.sender === "bot";
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
        }),
      ]).start();
    }, []);
  
    const markdownStyle = StyleSheet.create({
      body: {
        color: isBot ? themeColors.text : "#FFFFFF",
        fontSize: 15.5,
        lineHeight: 24,
      },
      heading1: {
        color: isBot ? themeColors.tint : "#FFFFFF",
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 12,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: isBot ? themeColors.border : '#FFFFFF44',
        paddingBottom: 4,
      },
      bullet_list: {
        marginBottom: 10,
      },
      bullet_list_icon: {
        color: isBot ? themeColors.tabIconDefault : "#FFFFFF99",
        marginRight: 10,
        lineHeight: 24,
      },
      strong: {
          fontWeight: 'bold',
          color: isBot ? themeColors.tint : '#FFFFFF',
      },
      link: {
        color: isBot ? themeColors.tint : '#FFFFFF',
        textDecorationLine: 'underline',
      }
    });
  
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isBot ? styles.botMessageContainer : styles.userMessageContainer,
          { opacity: opacityAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        {isBot && (
          <LinearGradient
            colors={[`${themeColors.tint}2A`, `${themeColors.tint}0A`]}
            style={styles.botAvatar}
          >
            <MaterialCommunityIcons name="robot-happy-outline" size={22} color={themeColors.tint} />
          </LinearGradient>
        )}
        <LinearGradient
          colors={
            isBot
              ? [themeColors.surface, themeColors.surface]
              : [`${themeColors.primaryLight}`, `${themeColors.tint}`]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.messageBubble,
            isBot ? styles.botBubble : styles.userBubble,
            isBot && { borderWidth: 1, borderColor: themeColors.border },
          ]}
        >
          {isBot ? (
            <Markdown style={markdownStyle}>
              {message.text}
            </Markdown>
          ) : (
            <Text style={[styles.messageText, { color: "#FFFFFF" }]}>
              {message.text}
            </Text>
          )}
          <Text
            style={[
              styles.timeText,
              { color: isBot ? themeColors.tabIconDefault : "#FFFFFF99" },
            ]}
          >
            {message.time}
          </Text>
        </LinearGradient>
      </Animated.View>
    );
};

// --- MAIN COMPONENT ---

export const ChatbotModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  const checkServerConnection = async () => {
    setConnectionStatus('connecting');
    setIsTyping(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: "ping" }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setConnectionStatus(response.ok ? 'connected_server' : 'connected_static');
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Connection check failed:", error);
      setConnectionStatus('error');
    } finally {
      setIsTyping(false);
    }
  };

  const resetChatHistory = async () => {
      try {
          await fetch(CHAT_RESET_URL, { method: 'POST' });
          setMessages([]);
          checkServerConnection();
      } catch (error) {
          console.error("Failed to reset chat history on server:", error);
      }
  }

  useEffect(() => {
    if (visible) {
      resetChatHistory();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && messages.length === 0 && (connectionStatus === 'connected_server' || connectionStatus === 'connected_static')) {
      const greetingText =
        connectionStatus === 'connected_server'
          ? "Halo! Saya GrapeCheck Bot. Ada yang bisa saya bantu terkait penyakit daun anggur?"
          : "Halo! Saat ini saya sedang offline, namun saya tetap bisa menjawab beberapa pertanyaan umum. Ada yang bisa saya bantu?";
      
      setTimeout(() => {
        setMessages([{ id: "1", text: greetingText, sender: "bot", time: getCurrentTime() }]);
      }, 500);
    }
  }, [connectionStatus, visible, messages.length]);

  const sendPromptToBackend = async (prompt: string) => {
    setIsTyping(true);
    let botResponseText = staticChatResponses.default;

    if (connectionStatus === 'connected_server') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(CHAT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                botResponseText = data.response || staticChatResponses.default;
            } else {
                setConnectionStatus('error');
                botResponseText = staticChatResponses.default;
                console.error(`Backend error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Error sending prompt to backend:", error);
            setConnectionStatus('error');
            botResponseText = staticChatResponses.default;
        }
    } else {
        botResponseText = staticChatResponses[prompt.toLowerCase()] || staticChatResponses.default;
    }

    setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: botResponseText, sender: "bot", time: getCurrentTime() }]);
        setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (input.trim().length === 0 || isTyping) return;
    const newMessage: Message = { id: Date.now().toString(), text: input, sender: "user", time: getCurrentTime() };
    setMessages((prev) => [...prev, newMessage]);
    sendPromptToBackend(input);
    setInput("");
  };

  const handleSuggestionPress = (suggestion: string) => {
    const newMessage: Message = { id: Date.now().toString(), text: suggestion, sender: "user", time: getCurrentTime() };
    setMessages((prev) => [...prev, newMessage]);
    sendPromptToBackend(suggestion);
  };

  const getStatusInfo = () => {
    if (isTyping && messages.length > 0) return { name: 'dots-horizontal' as const, color: colors.tint, text: 'Mengetik...' };
    switch (connectionStatus) {
      case 'connecting':
        return { name: 'wifi-off' as const, color: colors.warning, text: 'Menyambungkan...' };
      case 'connected_server':
        return { name: 'wifi-strength-4' as const, color: colors.success, text: 'Online' };
      case 'connected_static':
        return { name: 'wifi-strength-2' as const, color: colors.warning, text: 'Mode Offline' };
      case 'error':
        return { name: 'wifi-off' as const, color: colors.error, text: 'Gagal Terhubung' };
      default:
        return { name: 'wifi-off' as const, color: colors.tabIconDefault, text: 'Tidak Diketahui' };
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);
  
  const statusInfo = getStatusInfo();

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerTitleContainer}>
                <MaterialCommunityIcons name="robot-happy-outline" size={30} color={colors.tint} />
                <View style={{backgroundColor: 'transparent', marginLeft: 12}}>
                  <Text style={[styles.headerTitle, { color: colors.text }]}>GrapeCheck Bot</Text>
                   {/* --- Status dipindahkan ke sini --- */}
                  <View style={styles.statusIndicator}>
                    <View style={[styles.statusDot, {backgroundColor: statusInfo.color}]} />
                    <Text style={[styles.statusText, {color: statusInfo.color}]}>{statusInfo.text}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={resetChatHistory} style={styles.headerButton}>
                    <Feather name="refresh-cw" size={20} color={colors.tabIconDefault} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.headerButton} accessibilityRole="button" accessibilityLabel="Close chatbot">
                  <Feather name="x" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.chatContainer}>
              {messages.map((msg) => ( <MessageBubble key={msg.id} message={msg} themeColors={colors} /> ))}
              {isTyping && <TypingIndicator themeColors={colors} />}
              {messages.length === 1 && !isTyping && (
                <View style={styles.chipContainer}>
                  <SuggestionChip text="Apa itu Black Rot?" onPress={() => handleSuggestionPress("Apa itu Black Rot?")} themeColors={colors} />
                  <SuggestionChip text="Gejala Esca" onPress={() => handleSuggestionPress("Gejala Esca")} themeColors={colors} />
                   <SuggestionChip text="Cara menangani Hawar" onPress={() => handleSuggestionPress("Cara menangani Hawar")} themeColors={colors} />
                </View>
              )}
            </ScrollView>

            <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Ketik pertanyaanmu..."
                placeholderTextColor={colors.tabIconDefault}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                editable={!isTyping}
              />
              <TouchableOpacity
                onPress={handleSend}
                style={[styles.sendButton, { backgroundColor: isTyping || !input.trim() ? colors.tabIconDefault : colors.tint }]}
                disabled={isTyping || !input.trim()}
              >
                {isTyping ? <ActivityIndicator size="small" color="#fff" /> : <Feather name="send" size={20} color="#fff" />}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: "92%",
    width: "100%",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  headerTitleContainer: { 
    flex: 1,
    flexDirection: "row", 
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {},
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    backgroundColor: 'transparent'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500'
  },
  chatContainer: { flexGrow: 1, padding: 15 },
  messageContainer: {
    marginVertical: 5,
    maxWidth: "85%",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  botMessageContainer: { alignSelf: "flex-start" },
  userMessageContainer: { alignSelf: "flex-end" },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  botBubble: { borderTopLeftRadius: 5 },
  userBubble: { borderTopRightRadius: 5 },
  messageText: { fontSize: 15.5, lineHeight: 22, marginBottom: 5 },
  timeText: { fontSize: 11, textAlign: "right", opacity: 0.8 },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
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
  chipText: { fontSize: 14, fontWeight: "500" },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  typingDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 3 },
});