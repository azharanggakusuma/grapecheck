import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  View as RNView,
} from 'react-native';
import { Text, View } from '@/components/ui/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { useGlobalRefresh } from '@/components/contexts/GlobalRefreshContext';
import { Feather } from '@expo/vector-icons';

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
            <View
              style={[
                styles.avatarContainer,
                {
                  borderColor: colors.tint,
                  shadowColor: colors.tint + '40',
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.tint }]}>A</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]}>Azharangga Kusuma</Text>
            <Text style={[styles.email, { color: colors.tabIconDefault }]}>azhar@example.com</Text>
          </RNView>

          <SectionHeader title="Akun" colors={colors} />
          <View style={styles.section}>
            <ProfileItem icon="edit-2" label="Edit Profil" colors={colors} onPress={() => {}} />
            <ProfileItem icon="lock" label="Ganti Password" colors={colors} onPress={() => {}} />
          </View>

          <SectionHeader title="Lainnya" colors={colors} />
          <View style={styles.section}>
            <ProfileItem icon="log-out" label="Keluar" colors={colors} onPress={() => console.log('Logout')} />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 24,
    paddingBottom: 80,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 24,
    marginLeft: 5,
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
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
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
});
