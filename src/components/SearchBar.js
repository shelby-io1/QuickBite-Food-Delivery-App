import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const SearchBar = ({ value, onChangeText, placeholder = 'Search...' }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.textLight} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value ? (
        <Ionicons
          name="close-circle"
          size={20}
          color={colors.textLight}
          onPress={() => onChangeText('')}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
});

export default SearchBar;
