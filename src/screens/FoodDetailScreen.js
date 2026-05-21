import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { addFavorite, removeFavorite, getFavorites } from '../services/favoritesService';
import CustomButton from '../components/CustomButton';
import colors from '../theme/colors';

const FoodDetailScreen = ({ route, navigation }) => {
  const { meal } = route.params;
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('12.99');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const favs = await getFavorites();
    setIsFav(favs.some((f) => f.id === meal.idMeal));
  };

  const handleToggleFavorite = async () => {
    setFavLoading(true);
    const item = {
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      price,
    };
    if (isFav) {
      await removeFavorite(item.id);
      setIsFav(false);
    } else {
      await addFavorite(item);
      setIsFav(true);
    }
    setFavLoading(false);
  };

  const handlePlaceOrder = async () => {
    const qtyNum = parseInt(qty);
    const priceNum = parseFloat(price);
    if (!qtyNum || qtyNum < 1) {
      Alert.alert('Error', 'Enter a valid quantity');
      return;
    }
    if (!priceNum || priceNum <= 0) {
      Alert.alert('Error', 'Enter a valid price');
      return;
    }
    if (!db) {
      Alert.alert('Error', 'Firestore not initialized. Check Firebase config.');
      return;
    }
    if (!auth || !auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to order');
      return;
    }
    setOrdering(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        foodName: meal.strMeal,
        quantity: qtyNum,
        price: priceNum,
        total: qtyNum * priceNum,
        image: meal.strMealThumb,
        createdAt: new Date(),
        orderTime: new Date().toLocaleString(),
      });
      Alert.alert('Order Placed!', `${meal.strMeal} x${qtyNum} ordered successfully.`, [
        { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
        { text: 'OK' },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.category}>{meal.strCategory}</Text>
          <Text style={styles.name}>{meal.strMeal}</Text>
          <Text style={styles.area}>{meal.strArea} Cuisine</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="globe-outline" size={18} color={colors.primary} />
            <Text style={styles.statText}>{meal.strArea}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
            <Text style={styles.statText}>{meal.strCategory}</Text>
          </View>
        </View>

        <View style={styles.orderBox}>
          <Text style={styles.orderBoxTitle}>Place an Order</Text>
          <View style={styles.orderRow}>
            <View style={styles.qtyWrapper}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty(String(Math.max(1, parseInt(qty || '1') - 1)))}
                >
                  <Ionicons name="remove" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TextInput
                  style={styles.qtyInput}
                  value={qty}
                  onChangeText={setQty}
                  keyboardType="numeric"
                  textAlign="center"
                />
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty(String((parseInt(qty || '1') || 1) + 1))}
                >
                  <Ionicons name="add" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.priceWrapper}>
              <Text style={styles.inputLabel}>Price ($)</Text>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                textAlign="center"
              />
            </View>
          </View>
          <CustomButton
            title="Order Now"
            onPress={handlePlaceOrder}
            loading={ordering}
            style={styles.orderBtn}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <Text style={styles.ingredientText}>
                {item.ingredient} - {item.measure}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </View>

        <CustomButton
          title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
          variant={isFav ? 'outline' : 'primary'}
          onPress={handleToggleFavorite}
          loading={favLoading}
          style={styles.favBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 300,
  },
  backBtn: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  titleSection: {},
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
  },
  area: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 6,
    fontWeight: '500',
  },
  orderBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  orderBoxTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  qtyWrapper: {
    flex: 1,
    marginRight: 12,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  qtyBtn: {
    padding: 10,
  },
  qtyInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 8,
  },
  priceWrapper: {
    width: 100,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  priceInput: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  orderBtn: {
    marginTop: 12,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  instructions: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  favBtn: {
    marginTop: 24,
    marginBottom: 30,
  },
});

export default FoodDetailScreen;
