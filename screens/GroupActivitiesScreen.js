import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const GroupActivitiesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all'); // all, contributions, loans, rotations
  
  useEffect(() => {
    fetchActivities();
  }, [filter]);
  
  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const activitiesData = await groupService.getGroupActivities(groupId, filter);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'Failed to load group activities');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TZS';
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'contribution':
        return <Ionicons name="cash-outline" size={20} color="#009E60" />;
      case 'loan':
        return <Ionicons name="wallet-outline" size={20} color="#007AFF" />;
      case 'loan_repayment':
        return <Ionicons name="arrow-up-circle-outline" size={20} color="#FF9500" />;
      case 'rotation_payment':
        return <Ionicons name="swap-horizontal-outline" size={20} color="#5856D6" />;
      case 'member_added':
        return <Ionicons name="person-add-outline" size={20} color="#34C759" />;
      case 'member_removed':
        return <Ionicons name="person-remove-outline" size={20} color="#FF3B30" />;
      default:
        return <Ionicons name="ellipsis-horizontal-circle-outline" size={20} color="#8E8E93" />;
    }
  };
  
  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIconContainer, { backgroundColor: getActivityBackgroundColor(item.type) }]}>
        {getActivityIcon(item.type)}
      </View>
      
      <View style={styles.activityDetails}>
        <Text style={styles.activityText}>
          {item.description}
        </Text>
        <Text style={styles.activityDate}>{formatDate(item.created_at)}</Text>
      </View>
      
      {item.amount && (
        <Text style={[styles.activityAmount, { color: getAmountColor(item.type) }]}>
          {getAmountPrefix(item.type)}{formatCurrency(item.amount)}
        </Text>
      )}
    </View>
  );
  
  const getActivityBackgroundColor = (type) => {
    switch (type) {
      case 'contribution':
        return 'rgba(0, 158, 96, 0.1)';
      case 'loan':
        return 'rgba(0, 122, 255, 0.1)';
      case 'loan_repayment':
        return 'rgba(255, 149, 0, 0.1)';
      case 'rotation_payment':
        return 'rgba(88, 86, 214, 0.1)';
      case 'member_added':
        return 'rgba(52, 199, 89, 0.1)';
      case 'member_removed':
        return 'rgba(255, 59, 48, 0.1)';
      default:
        return 'rgba(142, 142, 147, 0.1)';
    }
  };
  
  const getAmountColor = (type) => {
    switch (type) {
      case 'contribution':
        return '#009E60';
      case 'loan':
        return '#FF3B30';
      case 'loan_repayment':
        return '#FF9500';
      case 'rotation_payment':
        return '#5856D6';
      default:
        return '#333';
    }
  };
  
  const getAmountPrefix = (type) => {
    switch (type) {
      case 'contribution':
        return '+';
      case 'loan':
        return '-';
      case 'loan_repayment':
        return '+';
      case 'rotation_payment':
        return '-';
      default:
        return '';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Activities</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterOption, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterOption, filter === 'contributions' && styles.activeFilter]}
            onPress={() => setFilter('contributions')}
          >
            <Text style={[styles.filterText, filter === 'contributions' && styles.activeFilterText]}>
              Contributions
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterOption, filter === 'loans' && styles.activeFilter]}
            onPress={() => setFilter('loans')}
          >
            <Text style={[styles.filterText, filter === 'loans' && styles.activeFilterText]}>
              Loans
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterOption, filter === 'rotations' && styles.activeFilter]}
            onPress={() => setFilter('rotations')}
          >
            <Text style={[styles.filterText, filter === 'rotations' && styles.activeFilterText]}>
              Rotations
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterOption, filter === 'members' && styles.activeFilter]}
            onPress={() => setFilter('members')}
          >
            <Text style={[styles.filterText, filter === 'members' && styles.activeFilterText]}>
              Members
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#009E60" />
        </View>
      ) : (
        <>
          {activities.length > 0 ? (
            <FlatList
              data={activities}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.activitiesList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No activities found</Text>
              <Text style={styles.emptySubtext}>
                Activities will appear here as members contribute and interact with the group
              </Text>
            </View>
          )}
        </>
      )}
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
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#009E60',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitiesList: {
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default GroupActivitiesScreen;