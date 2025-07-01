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
import { staticChatResponses } from "@/constants/staticChatData"; // Import data statis

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
}

// Define timeouts
const INITIAL_CHECK_TIMEOUT_MS = 5000; // 5 seconds for initial connection check
const CHAT_TIMEOUT_MS = 10000;       // 10 seconds for regular chat prompts
const TYPING_DELAY_MS = 1000;       // Delay for static responses to show typing animation (e.g., 1 second)
const INITIAL_GREETING_DELAY_MS = 1200; // Delay for initial bot greeting animation

type ConnectionStatus = 'connecting' | 'connected_server' | 'connected_static' | 'error';

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
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [useStaticMode, setUseStaticMode] = useState(false); // Flag to force static mode
  const scrollViewRef = useRef<ScrollView>(null);
  
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to perform initial server check
  const checkServerConnection = async () => {
    setConnectionStatus('connecting'); // Set status to connecting
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), INITIAL_CHECK_TIMEOUT_MS); // Set timeout for initial check

    try {
      // Attempt a lightweight request to the backend
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: "ping" }), // Send a dummy prompt or use a /health endpoint
        signal: controller.signal,
      });
      clearTimeout(timeoutId); // Clear timeout if fetch completes in time

      if (response.ok) {
        setConnectionStatus('connected_server'); // Set status to connected_server
        setUseStaticMode(false); // Disable static mode
      } else {
        // Server responded but with an error status
        setConnectionStatus('connected_static'); // Set status to connected_static
        setUseStaticMode(true); // Enable static mode
      }
    } catch (error: any) {
      clearTimeout(timeoutId); // Ensure timeout is cleared even on error
      console.error("Initial connection check failed:", error); // Log error
      setConnectionStatus('connected_static'); // Set status to connected_static
      setUseStaticMode(true); // Enable static mode
    }
  };

  // Effect to handle modal visibility and initial connection check
  useEffect(() => {
    if (visible) {
      setMessages([]); // Clear messages on open
      setIsTyping(false); // Initially, NO typing when modal opens
      setConnectionStatus('connecting'); // Show connecting status immediately
      checkServerConnection(); // Start connection check
    } else {
      // Reset all states when modal is closed
      setMessages([]);
      setIsTyping(false);
      setConnectionStatus('connecting');
      setUseStaticMode(false);
    }
  }, [visible]);

  // Effect to handle initial greeting after connection status is determined
  useEffect(() => {
    // Trigger when connectionStatus changes, modal is visible, and no messages yet
    if (visible && messages.length === 0 && (connectionStatus === 'connected_server' || connectionStatus === 'connected_static')) {
      setIsTyping(true); // Start typing animation for greeting
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            text: "Halo! Saya GrapeCheck Bot. Ada yang bisa saya bantu?",
            sender: "bot",
            time: getCurrentTime(),
          },
        ]);
        setIsTyping(false); // Hide typing indicator after greeting
      }, INITIAL_GREETING_DELAY_MS); // Use new constant for clarity
    }
  }, [visible, connectionStatus]); // Trigger when connectionStatus changes and modal is visible


  const sendPromptToBackend = async (prompt: string) => {
    setIsTyping(true); // Start typing animation
    let botResponseText = staticChatResponses.default; // Default to a general static response

    if (!useStaticMode) { // Only try backend if not in static mode yet
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS); // Set timeout for chat prompt

        try {
            const response = await fetch(CHAT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId); // Clear timeout if fetch completes in time

            if (response.ok) {
                const data = await response.json();
                if (data.response) {
                    botResponseText = data.response; // Use backend response
                }
            } else {
                // Server responded with an error status (e.g., 404, 500), switch to static mode for future chats
                setUseStaticMode(true);
                setConnectionStatus('connected_static');
                // Try to get a specific static response for the prompt if available, otherwise default
                botResponseText = staticChatResponses[prompt.toLowerCase()] || staticChatResponses.default;
                console.error(`Backend error: ${response.status} ${response.statusText}`);
            }
        } catch (error: any) {
            clearTimeout(timeoutId); // Ensure timeout is cleared even on error
            console.error("Error sending prompt to backend:", error); // Log error
            // Network error or timeout, switch to static mode for future chats
            setUseStaticMode(true);
            setConnectionStatus('connected_static');
            // Try to get a specific static response for the prompt if available, otherwise default
            botResponseText = staticChatResponses[prompt.toLowerCase()] || staticChatResponses.default;
        }
    } else {
        // Already in static mode, get response directly
        // Try to get a specific static response for the prompt if available, otherwise default
        botResponseText = staticChatResponses[prompt.toLowerCase()] || staticChatResponses.default;
    }

    // Simulate typing delay for all bot responses (server or static)
    setTimeout(() => {
        const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponseText,
            sender: "bot",
            time: getCurrentTime(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false); // Stop typing after message appears
    }, TYPING_DELAY_MS);
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

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Menghubungkan...';
      case 'connected_server':
        return 'Terhubung (Server)';
      case 'connected_static':
        return 'Terhubung (Data Statis)';
      case 'error': // This case might be less used with current logic
        return 'Terjadi Kesalahan';
      default:
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    if (isTyping) return colors.tint; // Typing overrides connection status color
    switch (connectionStatus) {
      case 'connecting':
        return colors.warning; // Kuning untuk menghubungkan
      case 'connected_server':
        return colors.success; // Hijau untuk terhubung ke server
      case 'connected_static':
        return colors.tabIconDefault; // Abu-abu untuk terhubung statis
      case 'error':
        return colors.error; // Merah untuk error
      default:
        return colors.tabIconDefault;
    }
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
                      { color: getStatusColor() }, // Dynamic color
                    ]}
                  >
                    {isTyping ? "Mengetik..." : getStatusText()} {/* Dynamic text */}
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