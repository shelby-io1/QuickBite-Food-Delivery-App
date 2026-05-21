import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import CustomHeader from '../components/CustomHeader';
import CustomButton from '../components/CustomButton';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');

  const user = auth?.currentUser;

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orderList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        orderList.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.orderTime || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.orderTime || 0);
          return dateB - dateA;
        });
        setOrders(orderList);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error('Orders fetch error:', error);
        Alert.alert('Firestore Error', error.message);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const handlePlaceOrder = async () => {
    if (!db) {
      Alert.alert('Error', 'Firestore not initialized. Check your Firebase config.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }
    if (!foodName.trim()) {
      Alert.alert('Error', 'Please enter food name');
      return;
    }
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        foodName: foodName.trim(),
        quantity: qty,
        price: parseFloat(price),
        total: qty * parseFloat(price),
        createdAt: new Date(),
        orderTime: new Date().toLocaleString(),
      });
      setFoodName('');
      setQuantity('1');
      setPrice('');
      Alert.alert('Success', 'Order placed successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to place order');
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (!db) return;
    Alert.alert('Delete Order', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'orders', orderId));
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderName}>{item.foodName}</Text>
          <Text style={styles.orderTime}>{item.orderTime || 'Just now'}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteOrder(item.id)}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Qty</Text>
          <Text style={styles.detailValue}>{item.quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={styles.detailValue}>${item.price?.toFixed(2)}</Text>
        </View>
        <View style={[styles.detailItem, styles.totalItem]}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.totalValue}>${item.total?.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <CustomHeader title="My Orders" icon="receipt" />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Place New Order</Text>
        <TextInput
          style={styles.input}
          value={foodName}
          onChangeText={setFoodName}
          placeholder="Food name"
          placeholderTextColor={colors.textLight}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Qty"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={price}
            onChangeText={setPrice}
            placeholder="Price"
            placeholderTextColor={colors.textLight}
            keyboardType="decimal-pad"
          />
        </View>
        <CustomButton title="Place Order" onPress={handlePlaceOrder} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={60} color={colors.border} />
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Place your first order above</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerSection: {
    paddingTop: 40,
  },
  formCard: {
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
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  listContent: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  orderTime: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  orderDetails: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  totalItem: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
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

export default OrdersScreen;
