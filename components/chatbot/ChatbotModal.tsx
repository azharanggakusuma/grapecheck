// components/chatbot/ChatbotModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header Modal */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>GrapeCheck Bot</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Konten Chat (Placeholder) */}
            <View style={styles.chatContainer}>
              <Text style={{ color: colors.tabIconDefault }}>Tanyakan sesuatu tentang penyakit anggur...</Text>
            </View>

            {/* Input Chat */}
            <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text, backgroundColor: colors.background }]}
                placeholder="Ketik pesanmu..."
                placeholderTextColor={colors.tabIconDefault}
              />
              <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.tint }]}>
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
    height: '85%',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});