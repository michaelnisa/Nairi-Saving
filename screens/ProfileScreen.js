import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../screens/services/api';
import { useAuth } from '../screens/context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const profile = await api.user.getProfile();
        setUserData(profile);
        
        // Fetch wallet balance
        const wallet = await api.user.getWalletBalance();
        setWalletBalance(wallet.balance);
        
        // Fetch transactions
        const userTransactions = await api.user.getTransactions();
        setTransactions(userTransactions);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TZS';
  };

  const renderTrustScore = (score) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={16} color="#FFD700" style={{ marginRight: 2 }} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color="#FFD700" style={{ marginRight: 2 }} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color="#FFD700" style={{ marginRight: 2 }} />
        );
      }
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {stars}
        <Text style={{ marginLeft: 5, color: '#666' }}>{score.toFixed(1)}</Text>
      </View>
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#009E60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userData?.name?.split(' ').map(n => n[0]).join('') || user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{userData?.name || user?.name || 'User'}</Text>
          <Text style={styles.userPhone}>{userData?.phoneNumber || user?.phoneNumber || ''}</Text>
          <Text style={styles.userBio}>{userData?.bio || 'No bio available'}</Text>
          <View style={styles.trustScoreContainer}>
            <Text style={styles.trustScoreLabel}>Trust Score:</Text>
            {renderTrustScore(userData?.trustScore || 0)}
          </View>
        </View>

        <View style={styles.walletSection}>
          <Text style={styles.sectionTitle}>Wallet Balance</Text>
          <Text style={styles.walletBalance}>
            {formatCurrency(walletBalance)}
          </Text>
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletAction}>
              <Ionicons name="add-circle-outline" size={20} color="#009E60" />
              <Text style={styles.walletActionText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletAction}>
              <Ionicons name="arrow-down-circle-outline" size={20} color="#009E60" />
              <Text style={styles.walletActionText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIconContainer}>
                  <Ionicons
                    name={
                      transaction.type === 'contribution'
                        ? 'arrow-up-circle'
                        : transaction.type === 'payout'
                        ? 'cash'
                        : transaction.type === 'loan'
                        ? 'arrow-down-circle'
                        : 'repeat'
                    }
                    size={24}
                    color={
                      transaction.type === 'contribution' || transaction.type === 'repayment'
                        ? '#FF6B6B'
                        : '#009E60'
                    }
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </Text>
                  <Text style={styles.transactionGroup}>{transaction.group}</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === 'contribution' || transaction.type === 'repayment'
                            ? '#FF6B6B'
                            : '#009E60',
                      },
                    ]}
                  >
                    {transaction.type === 'contribution' || transaction.type === 'repayment'
                      ? '-'
                      : '+'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent transactions</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.logoutFooter}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#009E60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  trustScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustScoreLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  walletSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009E60',
    marginBottom: 15,
  },
  walletActions: {
    flexDirection: 'row',
  },
  walletAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  walletActionText: {
    fontSize: 14,
    color: '#009E60',
    marginLeft: 5,
  },
  transactionsSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionIconContainer: {
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionGroup: {
    fontSize: 14,
    color: '#666',
  },
  transactionDetails: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  logoutFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 2,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;