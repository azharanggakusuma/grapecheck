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
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/components/ui/ThemeProvider";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { CHAT_URL } from "@/constants/api";
import Markdown from 'react-native-markdown-display';

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const SuggestionChip = ({ text, onPress, themeColors }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      { backgroundColor: themeColors.surface, borderColor: themeColors.border },
    ]}
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

const MessageBubble = ({
  message,
  themeColors,
}: {
  message: Message;
  themeColors: any;
}) => {
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
      lineHeight: 22,
    },
    heading1: {
      color: isBot ? themeColors.text : "#FFFFFF",
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 10,
      marginBottom: 5,
    },
    bullet_list_icon: {
      color: isBot ? themeColors.tabIconDefault : "#FFFFFF99",
    },
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
          { borderColor: themeColors.border },
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

export const ChatbotModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (visible && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            text: "Halo! Saya GrapeCheck Bot. Ada yang bisa saya bantu?",
            sender: "bot",
            time: getCurrentTime(),
          },
        ]);
        setIsTyping(false);
      }, 1200);
    } else if (!visible) {
      setMessages([]);
      setIsTyping(false);
    }
  }, [visible]);

  const sendPromptToBackend = async (prompt: string) => {
    setIsTyping(true);
    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Gagal mendapatkan respons dari server.');

      const data = await response.json();
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Maaf, saya tidak mengerti.",
        sender: "bot",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error("Error sending prompt to backend:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Maaf, terjadi kesalahan koneksi. Coba lagi nanti.",
        sender: "bot",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (input.trim().length === 0) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, newMessage]);
    sendPromptToBackend(input);
    setInput("");
  };

  const handleSuggestionPress = (suggestion: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: suggestion,
      sender: "user",
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, newMessage]);
    sendPromptToBackend(suggestion);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.headerTitleContainer}>
                <MaterialCommunityIcons
                  name="robot-happy-outline"
                  size={24}
                  color={colors.tint}
                />
                <View>
                  <Text style={[styles.headerTitle, { color: colors.text }]}>
                    GrapeCheck Bot
                  </Text>
                  <Text
                    style={[
                      styles.headerStatus,
                      { color: isTyping ? colors.tint : colors.tabIconDefault },
                    ]}
                  >
                    {isTyping ? "Mengetik..." : "Online"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.chatContainer}
            >
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  themeColors={colors}
                />
              ))}
              {isTyping && <TypingIndicator themeColors={colors} />}
              {messages.length === 1 && !isTyping && (
                <View style={styles.chipContainer}>
                  <SuggestionChip
                    text="Apa itu Black Rot?"
                    onPress={() => handleSuggestionPress("Apa itu Black Rot?")}
                    themeColors={colors}
                  />
                  <SuggestionChip
                    text="Gejala Esca"
                    onPress={() => handleSuggestionPress("Gejala Esca")}
                    themeColors={colors}
                  />
                </View>
              )}
            </ScrollView>

            <View
              style={[styles.inputContainer, { borderTopColor: colors.border }]}
            >
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
              />
              <TouchableOpacity
                onPress={handleSend}
                style={[styles.sendButton, { backgroundColor: colors.tint }]}
              >
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 12 },
  headerStatus: { fontSize: 13, marginLeft: 12, fontWeight: "500" },
  closeButton: {},
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
  botBubble: { borderTopLeftRadius: 5, borderWidth: 1 },
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