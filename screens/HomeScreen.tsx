import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for groups
type Group = {
  id: string;
  name: string;
  balance: number;
  nextMember: string;
  nextDate: string;
  members: number;
  contributionStatus: boolean;
};

const groups: Group[] = [
  {
    id: '1',
    name: 'Family Savings',
    balance: 1250000,
    nextMember: 'John Doe',
    nextDate: '15 Apr',
    members: 8,
    contributionStatus: true,
  },
  {
    id: '2',
    name: 'Office Chama',
    balance: 750000,
    nextMember: 'Jane Smith',
    nextDate: '22 Apr',
    members: 12,
    contributionStatus: false,
  },
  {
    id: '3',
    name: 'Neighborhood Fund',
    balance: 2000000,
    nextMember: 'You',
    nextDate: '30 Apr',
    members: 15,
    contributionStatus: true,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TZS';
  };

  const renderGroupCard = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('GroupOverview', { groupId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: item.contributionStatus ? '#009E60' : '#FF6B6B' },
          ]}
        >
          <Text style={styles.statusText}>
            {item.contributionStatus ? 'Paid' : 'Due'}
          </Text>
        </View>
      </View>

      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>{formatCurrency(item.balance)}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.nextRotation}>
          <Text style={styles.nextRotationLabel}>Next Rotation</Text>
          <Text style={styles.nextRotationInfo}>
            {item.nextMember} • {item.nextDate}
          </Text>
        </View>
        <View style={styles.memberCount}>
          <Ionicons name="people" size={16} color="#009E60" />
          <Text style={styles.memberCountText}>{item.members}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Sarah</Text>
          <Text style={styles.subGreeting}>Manage your savings groups</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              // Handle notifications
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Groups</Text>
        
        {groups.length > 0 ? (
          <FlatList
            data={groups}
            renderItem={renderGroupCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.groupsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={60} color="#009E60" />
            <Text style={styles.emptyStateText}>
              You haven't joined any groups yet
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.joinButton]}
          onPress={() => navigation.navigate('JoinGroup')}
        >
          <Ionicons name="log-in-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Join Group</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.createButton]}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Ionicons name="add-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Create Group</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  groupsList: {
    paddingBottom: 100, // Extra space for the action buttons
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#009E60',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextRotation: {},
  nextRotationLabel: {
    fontSize: 12,
    color: '#666',
  },
  nextRotationInfo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButton: {
    backgroundColor: '#333',
    marginRight: 10,
  },
  createButton: {
    backgroundColor: '#009E60',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default HomeScreen;