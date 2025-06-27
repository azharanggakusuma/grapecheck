import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'; // 1. Tambahkan import Image
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import Colors from '@/constants/Colors';
import { getHeaderTitle } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomHeader(props: any) {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const { top } = useSafeAreaInsets();

  const title = getHeaderTitle(props.options, route.name);

  return (
    <View style={{ backgroundColor: colors.background }}>
      <View style={[
        styles.headerContainer,
        {
          paddingTop: top,
          height: 60 + top,
          backgroundColor: colors.background,
          borderBottomColor: theme === 'dark' ? '#2A2A2A' : '#EFEFEF',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }
      ]}>
        <View style={styles.leftContainer}>
          {/* 2. Tambahkan logika untuk menampilkan ikon jika tidak bisa kembali */}
          {navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.logo}
            />
          )}
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={toggleTheme} style={styles.button}>
            <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 2,
  },
  button: {
    padding: 5,
  },
  // 3. Tambahkan style untuk logo
  logo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  }
});