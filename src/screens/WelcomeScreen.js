import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import colors from '../theme/colors';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.iconCircle}>
          <Ionicons name="fast-food" size={80} color={colors.textWhite} />
        </View>
        <Text style={styles.title}>QuickBite</Text>
        <Text style={styles.subtitle}>Your favorite meals, just a tap away</Text>
      </View>

      <View style={styles.featuresRow}>
        <View style={styles.feature}>
          <Ionicons name="restaurant" size={28} color={colors.primary} />
          <Text style={styles.featureText}>Browse Food</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="heart" size={28} color={colors.primary} />
          <Text style={styles.featureText}>Save Favorites</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="bicycle" size={28} color={colors.primary} />
          <Text style={styles.featureText}>Fast Delivery</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <CustomButton
          title="Get Started"
          onPress={() => navigation.navigate('Signup')}
        />
        <CustomButton
          title="I already have an account"
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          style={styles.loginBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '600',
  },
  bottomSection: {
    paddingBottom: 40,
  },
  loginBtn: {
    marginTop: 12,
  },
});

export default WelcomeScreen;
