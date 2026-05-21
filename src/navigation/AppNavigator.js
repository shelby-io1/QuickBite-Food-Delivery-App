import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebase';
import colors from '../theme/colors';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FoodScreen from '../screens/FoodScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import RestaurantScreen from '../screens/RestaurantScreen';
import OrdersScreen from '../screens/OrdersScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const FoodStack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: colors.background },
};

const FoodNavigator = () => (
  <FoodStack.Navigator screenOptions={screenOptions}>
    <FoodStack.Screen name="FoodList" component={FoodScreen} />
    <FoodStack.Screen name="FoodDetail" component={FoodDetailScreen} />
  </FoodStack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Food':
            iconName = focused ? 'search' : 'search-outline';
            break;
          case 'Restaurant':
            iconName = focused ? 'restaurant' : 'restaurant-outline';
            break;
          case 'Orders':
            iconName = focused ? 'receipt' : 'receipt-outline';
            break;
          case 'Favorites':
            iconName = focused ? 'heart' : 'heart-outline';
            break;
          default:
            iconName = 'ellipse';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.inactive,
      tabBarStyle: {
        backgroundColor: colors.card,
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        height: 60,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Food" component={FoodNavigator} />
    <Tab.Screen name="Restaurant" component={RestaurantScreen} />
    <Tab.Screen name="Orders" component={OrdersScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
  </Tab.Navigator>
);

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (!auth) {
      setAuthError(true);
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthLoading(false);
    }, (error) => {
      setAuthError(true);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;
