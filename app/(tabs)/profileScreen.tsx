import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  View as RNView,
  Modal,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Text, View } from '@/components/ui/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { useGlobalRefresh } from '@/components/contexts/GlobalRefreshContext';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const SectionHeader = ({ title, colors }: { title: string; colors: any }) => (
  <Text style={[styles.sectionHeader, { color: colors.tabIconDefault }]}>{title}</Text>
);

const ProfileItem = ({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  colors: any;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.itemContainer, { backgroundColor: colors.surface }]}
  >
    <Feather name={icon} size={20} color={colors.tint} style={styles.itemIcon} />
    <Text style={[styles.itemLabel, { color: colors.text }]}>{label}</Text>
    <Feather name="chevron-right" size={20} color={colors.tabIconDefault} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { refreshApp } = useGlobalRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [name, setName] = useState('Azharangga Kusuma');
  const [email, setEmail] = useState('azhar@example.com');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [refreshApp]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert('Konfirmasi', 'Apakah kamu yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => console.log('Logout') },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
        contentContainerStyle={styles.container}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY }],
            width: '100%',
          }}
        >
          <RNView style={styles.headerContainer}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <View
                style={[
                  styles.avatarContainer,
                  {
                    borderColor: colors.tint,
                    shadowColor: colors.tint + '30',
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                ) : (
                  <Text style={[styles.avatarText, { color: colors.tint }]}>
                    {name[0].toUpperCase()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
            <Text style={[styles.email, { color: colors.tabIconDefault }]}>{email}</Text>
          </RNView>

          <SectionHeader title="Akun" colors={colors} />
          <View style={styles.section}>
            <ProfileItem
              icon="edit-2"
              label="Edit Profil"
              colors={colors}
              onPress={() => setEditing(true)}
            />
            <ProfileItem
              icon="lock"
              label="Ganti Password"
              colors={colors}
              onPress={() => console.log('Ganti password')}
            />
          </View>

          <SectionHeader title="Lainnya" colors={colors} />
          <View style={styles.section}>
            <ProfileItem icon="log-out" label="Keluar" colors={colors} onPress={handleLogout} />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modal Edit Profil */}
      <Modal visible={editing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profil</Text>

            <TextInput
              placeholder="Nama"
              value={name}
              onChangeText={setName}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.tabIconDefault}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.tabIconDefault}
              keyboardType="email-address"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <Text style={{ color: colors.error, fontSize: 16 }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <Text style={{ color: colors.tint, fontWeight: 'bold', fontSize: 16 }}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 100,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 44,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 30,
    marginBottom: 12,
    marginLeft: 6,
  },
  section: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#00000005',
  },
  itemIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 24,
  },
});
