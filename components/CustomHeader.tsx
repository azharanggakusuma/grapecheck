import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import Colors from '@/constants/Colors';
import { getHeaderTitle } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomHeader(props: any) {
  const { navigation, route, options } = props;
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const { top } = useSafeAreaInsets();
  
  const title = getHeaderTitle(options, route.name);

  const isTransparent = options.headerTransparent === true;
  const headerTintColor = isTransparent ? '#FFFFFF' : colors.text;

  return (
    <View style={{ 
      backgroundColor: isTransparent ? 'transparent' : colors.background 
    }}>
      <View style={[
        styles.headerContainer,
        {
          paddingTop: top,
          height: 60 + top,
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
            // --- AWAL PERUBAHAN ---
            // Ganti ikon dengan komponen Teks
            <Text style={[styles.logoText, { color: headerTintColor }]}>
              GrapeCheck
            </Text>
            // --- AKHIR PERUBAHAN ---
          )}
        </View>

        {/* Container untuk judul ini sekarang bisa kosong, 
          karena judul diatur per layar atau disembunyikan 
        */}
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
    flex: 2, // Disesuaikan agar tetap center
  },
  button: {
    padding: 5,
  },
  // --- BARU: Style untuk teks logo ---
  logoText: {
    fontSize: 20,
    fontWeight: '700',
  }
});