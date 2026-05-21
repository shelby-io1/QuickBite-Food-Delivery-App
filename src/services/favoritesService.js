import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@quickbite_favorites';

export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = async (item) => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some((fav) => fav.id === item.id);
    if (exists) return false;
    const updated = [...favorites, { ...item, addedAt: new Date().toISOString() }];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

export const removeFavorite = async (itemId) => {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter((fav) => fav.id !== itemId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

export const isFavorite = async (itemId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some((fav) => fav.id === itemId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

export const clearFavorites = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
};
