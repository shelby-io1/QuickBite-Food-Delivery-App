import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const CustomHeader = ({ title, icon }) => {
  return (
    <View style={styles.container}>
      {icon ? (
        <Ionicons name={icon} size={24} color={colors.primary} style={styles.icon} />
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
});

export default CustomHeader;
