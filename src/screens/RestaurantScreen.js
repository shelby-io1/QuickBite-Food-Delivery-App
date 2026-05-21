import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { fetchRestaurants } from '../services/api';
import SearchBar from '../components/SearchBar';
import CustomHeader from '../components/CustomHeader';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const RestaurantScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRestaurants();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadRestaurants = async () => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      const data = await fetchRestaurants(search || '');
      setRestaurants(data);
    } catch (err) {
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRestaurants();
  };

  const renderRestaurant = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.cuisineBadge}>
        <Text style={styles.cuisineText}>{item.cuisine}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={colors.textLight} />
          <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.star} />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>
        </View>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Ionicons name="time-outline" size={12} color={colors.primary} />
            <Text style={styles.tagText}> {item.hours}</Text>
          </View>
          <View style={[styles.tag, styles.openTag]}>
            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
            <Text style={styles.openText}> Open</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading && restaurants.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Finding restaurants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <CustomHeader title="Restaurants" icon="restaurant" />
        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or cuisine..."
          />
        </View>
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cloud-offline-outline" size={60} color={colors.border} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : restaurants.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="business-outline" size={60} color={colors.border} />
          <Text style={styles.emptyText}>No restaurants found</Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurant}
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cuisineBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cuisineText: {
    color: colors.textWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  address: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 4,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 2,
  },
  tags: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
  },
  openTag: {
    backgroundColor: '#E8F5E9',
  },
  openText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '700',
  },
});

export default RestaurantScreen;
