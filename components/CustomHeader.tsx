import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import Colors from '@/constants/Colors';
import { getHeaderTitle } from '@react-navigation/elements';

export function CustomHeader(props: any) {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  
  const title = getHeaderTitle(props.options, route.name);

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <View style={[
        styles.headerContainer, 
        { 
          paddingTop: StatusBar.currentHeight, 
          backgroundColor: colors.background, // Pastikan background sesuai tema
          borderBottomColor: theme === 'dark' ? '#2A2A2A' : '#EFEFEF', // Garis bawah tipis
          borderBottomWidth: StyleSheet.hairlineWidth,
        }
      ]}>
        <View style={styles.leftContainer}>
          {navigation.canGoBack() && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={toggleTheme} style={styles.button}>
            <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60 + (StatusBar.currentHeight || 0),
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
  }
});