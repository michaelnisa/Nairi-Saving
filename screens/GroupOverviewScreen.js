import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../screens/services/api';

const GroupOverviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;
  const [activeTab, setActiveTab] = useState('members');
  const [groupDetails, setGroupDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [rotationSchedule, setRotationSchedule] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchGroupDetails = async () => {
    try {
      const details = await api.groups.getGroup(groupId);
      setGroupDetails(details);
    } catch (error) {
      console.error('Failed to fetch group details:', error);
      Alert.alert('Error', 'Failed to load group details');
    }
  };

  const fetchMembers = async () => {
    try {
      const membersData = await api.groups.getGroupMembers(groupId);
      setMembers(membersData);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      Alert.alert('Error', 'Failed to load group members');
    }
  };

  const fetchContributions = async () => {
    try {
      const contributionsData = await api.groups.getGroupContributions(groupId);
      setContributions(contributionsData);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      Alert.alert('Error', 'Failed to load contributions');
    }
  };

  const fetchRotation = async () => {
    try {
      const rotationData = await api.groups.getGroupRotation(groupId);
      setRotationSchedule(rotationData);
    } catch (error) {
      console.error('Failed to fetch rotation schedule:', error);
      Alert.alert('Error', 'Failed to load rotation schedule');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const announcementsData = await api.groups.getGroupAnnouncements(groupId);
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      Alert.alert('Error', 'Failed to load announcements');
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchGroupDetails(),
        fetchMembers(),
        fetchContributions(),
        fetchRotation(),
        fetchAnnouncements(),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [groupId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAllData();
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TZS';
  };

  const renderTrustScore = (score) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < score ? 'star' : 'star-outline'}
          size={14}
          color={i < score ? '#FFD700' : '#ccc'}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const renderMembersTab = () => (
    <FlatList
      data={members}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.memberItem}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{item.name}</Text>
            {renderTrustScore(item.trustScore)}
          </View>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.status ? '#009E60' : '#FF6B6B' },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status ? 'Paid' : 'Due'}
            </Text>
          </View>
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#009E60']}
        />
      }
    />
  );

  const renderContributionsTab = () => (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#009E60']}
        />
      }
    >
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValues}>
            {groupDetails ? (
              <>
                {formatCurrency(groupDetails.balance)} / {formatCurrency(groupDetails.goal)}
              </>
            ) : (
              '0 / 0'
            )}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { 
                width: groupDetails 
                  ? `${(groupDetails.balance / groupDetails.goal) * 100}%` 
                  : '0%' 
              },
            ]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.contributeButton}
        onPress={() => navigation.navigate('Contribute', { groupId })}
      >
        <Text style={styles.contributeButtonText}>Contribute Now</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Contributions</Text>
      <FlatList
        data={contributions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contributionItem}>
            <View>
              <Text style={styles.contributionMember}>{item.member}</Text>
              <Text style={styles.contributionDate}>{item.date}</Text>
            </View>
            <Text style={styles.contributionAmount}>
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );

  const renderRotationTab = () => (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#009E60']}
        />
      }
    >
      {groupDetails?.nextRotation && (
        <View style={styles.nextRotationCard}>
          <Text style={styles.nextRotationTitle}>Next Payout</Text>
          <Text style={styles.nextRotationMember}>
            {groupDetails.nextRotation.member}
          </Text>
          <Text style={styles.nextRotationDate}>
            {groupDetails.nextRotation.date} ({groupDetails.nextRotation.daysLeft} days left)
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Rotation Schedule</Text>
      <FlatList
        data={rotationSchedule}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rotationItem}>
            <View>
              <Text style={styles.rotationMember}>{item.member}</Text>
              <Text style={styles.rotationDate}>{item.date}</Text>
            </View>
            <Text style={styles.rotationAmount}>
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );

  const renderAnnouncementsTab = () => (
    <FlatList
      data={announcements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.announcementItem}>
          <View style={styles.announcementHeader}>
            <Text style={styles.announcementSender}>{item.sender}</Text>
            <Text style={styles.announcementDate}>{item.date}</Text>
          </View>
          <Text style={styles.announcementMessage}>{item.message}</Text>
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#009E60']}
        />
      }
    />
  );

  if (isLoading && !groupDetails) {
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
        <Text style={styles.headerTitle}>{groupDetails?.name || 'Group'}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Saved</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Saved</Text>
        <Text style={styles.balanceAmount}>
          {groupDetails ? formatCurrency(groupDetails.balance) : '0 TZS'}
        </Text>
        <Text style={styles.contributionInfo}>
          {groupDetails ? (
            <>
              {formatCurrency(groupDetails.contributionAmount)} {groupDetails.frequency}
            </>
          ) : (
            '0 TZS'
          )}
        </Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'members' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('members')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'members' && styles.activeTabButtonText,
              ]}
            >
              Members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'contributions' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('contributions')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'contributions' && styles.activeTabButtonText,
              ]}
            >
              Contributions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'rotation' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('rotation')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'rotation' && styles.activeTabButtonText,
              ]}
            >
              Rotation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'announcements' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('announcements')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'announcements' && styles.activeTabButtonText,
              ]}
            >
              Announcements
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'members' && renderMembersTab()}
        {activeTab === 'contributions' && renderContributionsTab()}
        {activeTab === 'rotation' && renderRotationTab()}
        {activeTab === 'announcements' && renderAnnouncementsTab()}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.loanButton]}
          onPress={() => navigation.navigate('LoanRequest', { groupId })}
        >
          <Ionicons name="cash-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Request Loan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.disburseButton]}
          onPress={() => {
            // Handle disburse funds - would need admin check
            Alert.alert(
              'Disburse Funds',
              'Are you sure you want to disburse funds to the next member?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Disburse',
                  onPress: async () => {
                    try {
                      // This would need proper implementation with your API
                      if (groupDetails?.nextRotation) {
                        // Example API call
                        // await api.disbursements.disburseFunds(
                        //   groupId,
                        //   groupDetails.nextRotation.memberId,
                        //   groupDetails.nextRotation.amount
                        // );
                        Alert.alert('Success', 'Funds have been disbursed successfully');
                        loadAllData();
                      }
                    } catch (error) {
                      console.error('Failed to disburse funds:', error);
                      Alert.alert('Error', 'Failed to disburse funds');
                    }
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="wallet-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Disburse Funds</Text>
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
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  moreButton: {
    padding: 5,
  },
  balanceCard: {
    backgroundColor: '#009E60',
    padding: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
  },
  contributionInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: 'rgba(0, 158, 96, 0.1)',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#009E60',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
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
  progressContainer: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressValues: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#009E60',
  },
  contributeButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  contributeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
  },
  contributionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contributionMember: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  contributionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  contributionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009E60',
  },
  nextRotationCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nextRotationTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nextRotationMember: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  nextRotationDate: {
    fontSize: 14,
    color: '#009E60',
  },
  rotationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rotationMember: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  rotationDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rotationAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009E60',
  },
  announcementItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  announcementSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  announcementDate: {
    fontSize: 12,
    color: '#666',
  },
  announcementMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  loanButton: {
    backgroundColor: '#333',
    marginRight: 10,
  },
  disburseButton: {
    backgroundColor: '#009E60',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default GroupOverviewScreen;