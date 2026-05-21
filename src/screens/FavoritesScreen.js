import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, removeFavorite, clearFavorites } from '../services/favoritesService';
import FoodCard from '../components/FoodCard';
import CustomButton from '../components/CustomButton';
import CustomHeader from '../components/CustomHeader';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleRemoveFavorite = async (item) => {
    const success = await removeFavorite(item.id);
    if (success) {
      loadFavorites();
      Alert.alert('Removed', `${item.name} removed from favorites`);
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Remove all favorites?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          const success = await clearFavorites();
          if (success) {
            setFavorites([]);
            Alert.alert('Done', 'All favorites cleared');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <FoodCard
      image={item.image}
      name={item.name}
      category={item.category}
      price={item.price}
      isFavorite={true}
      onPress={() => {
        if (item.screen) {
          navigation.navigate(item.screen, { item });
        }
      }}
      onFavorite={() => handleRemoveFavorite(item)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <CustomHeader title="My Favorites" icon="heart" />
      </View>

      {favorites.length > 0 && (
        <CustomButton
          title="Clear All Favorites"
          variant="outline"
          onPress={handleClearAll}
          style={styles.clearBtn}
        />
      )}

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={70} color={colors.border} />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Browse food and save your favorites
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString()}
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
  headerSection: {
    paddingTop: 40,
  },
  clearBtn: {
    marginTop: 12,
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default FavoritesScreen;
