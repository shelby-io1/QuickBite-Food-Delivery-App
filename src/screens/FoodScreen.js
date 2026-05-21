import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { fetchMeals } from '../services/api';
import { getFavorites, addFavorite, removeFavorite, isFavorite } from '../services/favoritesService';
import FoodCard from '../components/FoodCard';
import SearchBar from '../components/SearchBar';
import CustomHeader from '../components/CustomHeader';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const FoodScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadMeals();
    loadFavorites();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMeals();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadMeals = async () => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      const data = await fetchMeals(search);
      setMeals(data);
    } catch (err) {
      setError('Failed to load meals. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMeals();
  };

  const handleFavorite = async (meal) => {
    const item = {
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      price: null,
    };

    const fav = favorites.find((f) => f.id === item.id);
    if (fav) {
      await removeFavorite(item.id);
    } else {
      await addFavorite(item);
    }
    loadFavorites();
  };

  const isItemFavorite = (mealId) => {
    return favorites.some((f) => f.id === mealId);
  };

  const renderMeal = ({ item }) => (
    <FoodCard
      image={item.strMealThumb}
      name={item.strMeal}
      category={item.strCategory}
      price={null}
      isFavorite={isItemFavorite(item.idMeal)}
      onPress={() => navigation.navigate('FoodDetail', { meal: item })}
      onFavorite={() => handleFavorite(item)}
    />
  );

  if (loading && meals.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading delicious meals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <CustomHeader title="Browse Food" icon="search" />
        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search meals..."
          />
        </View>
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cloud-offline-outline" size={60} color={colors.border} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : meals.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={60} color={colors.border} />
          <Text style={styles.emptyText}>No meals found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          renderItem={renderMeal}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  headerSection: {
    paddingTop: 40,
  },
  searchContainer: {
    marginTop: 12,
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textLight,
    fontSize: 14,
  },
  errorText: {
    marginTop: 12,
    color: colors.danger,
    fontSize: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
});

export default FoodScreen;
