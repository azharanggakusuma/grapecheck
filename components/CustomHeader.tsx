import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import Colors from '@/constants/Colors';
import { getHeaderTitle } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomHeader(props: any) {
  const { navigation, route, options } = props; // Ambil options dari props
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const { top } = useSafeAreaInsets();
  
  const title = getHeaderTitle(options, route.name);

  // Cek apakah header harus transparan
  const isTransparent = options.headerTransparent === true;

  // Tentukan warna teks & ikon berdasarkan transparansi
  // Jika transparan, warna diatur ke putih agar terlihat di atas gradien hijau
  const headerTintColor = isTransparent ? '#FFFFFF' : colors.text;

  return (
    <View style={{ 
      // Saat transparan, navigator akan mengatur posisi. Latar belakang diatur di sini.
      backgroundColor: isTransparent ? 'transparent' : colors.background 
    }}>
      <View style={[
        styles.headerContainer,
        {
          paddingTop: top,
          height: 60 + top,
          // Hilangkan shadow jika transparan
          ...(!isTransparent && {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: theme === 'dark' ? 0.25 : 0.05,
            shadowRadius: 5,
            elevation: 7,
          })
        }
      ]}>
        <View style={styles.leftContainer}>
          {navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
              <Feather name="arrow-left" size={24} color={headerTintColor} />
            </TouchableOpacity>
          ) : (
            <Image 
              source={require('@/assets/images/icon.png')} 
              // Beri warna putih pada logo jika header transparan
              style={[styles.logo, isTransparent && { tintColor: '#FFFFFF' }]}
            />
          )}
        </View>
        <Text style={[styles.title, { color: headerTintColor }]}>{title}</Text>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={toggleTheme} style={styles.button}>
            <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerTintColor} />
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
  logo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  }
});