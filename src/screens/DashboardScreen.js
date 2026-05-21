import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { signOut, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';
import CustomButton from '../components/CustomButton';
import CustomHeader from '../components/CustomHeader';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const DashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(auth?.currentUser || null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setUser(auth?.currentUser || null);
    }, [])
  );

  const handleLogout = () => {
    if (!auth) {
      Alert.alert('Error', 'Firebase not initialized. Check your config.');
      return;
    }
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    setEditName(user?.displayName || '');
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: editName.trim() });
      setUser(auth.currentUser);
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const quickActions = [
    {
      icon: 'search',
      label: 'Browse Food',
      screen: 'Food',
      color: '#D4AF37',
    },
    {
      icon: 'restaurant',
      label: 'Restaurants',
      screen: 'Restaurant',
      color: '#F5D76E',
    },
    {
      icon: 'heart',
      label: 'Favorites',
      screen: 'Favorites',
      color: '#E8C547',
    },
    {
      icon: 'receipt',
      label: 'My Orders',
      screen: 'Orders',
      color: '#C5A028',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <CustomHeader title="Dashboard" icon="home" />
        <TouchableOpacity style={styles.profileCard} onPress={handleEditProfile} activeOpacity={0.7}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.textWhite} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>
              Welcome back,
            </Text>
            <Text style={styles.userName}>
              {user?.displayName || 'User'}
            </Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={() => navigation.navigate(action.screen)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}
            >
              <Ionicons name={action.icon} size={28} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <CustomButton
          title="Logout"
          variant="danger"
          onPress={handleLogout}
        />
      </View>

      <Modal visible={showEditModal} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textLight}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user?.email || ''}
              editable={false}
            />
            <CustomButton title="Save Changes" onPress={handleSaveProfile} loading={saving} style={styles.saveBtn} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: colors.textLight,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  disabledInput: {
    opacity: 0.6,
  },
  saveBtn: {
    marginTop: 20,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  logoutSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
});

export default DashboardScreen;
