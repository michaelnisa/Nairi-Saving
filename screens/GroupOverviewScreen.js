import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for group details
const groupDetails = {
  id: '1',
  name: 'Family Savings',
  balance: 1250000,
  goal: 2000000,
  contributionAmount: 50000,
  frequency: 'Weekly',
  loan_allowance_enabled: true,
  loan_interest_rate: 5,
  nextRotation: {
    member: 'John Doe',
    date: '15 Apr 2023',
    daysLeft: 5,
  },
  members: [
    { id: '1', name: 'Sarah (You)', status: true, trustScore: 5 },
    { id: '2', name: 'John Doe', status: true, trustScore: 4 },
    { id: '3', name: 'Jane Smith', status: false, trustScore: 5 },
    { id: '4', name: 'Mike Johnson', status: true, trustScore: 3 },
    { id: '5', name: 'Emily Brown', status: false, trustScore: 4 },
    { id: '6', name: 'David Wilson', status: true, trustScore: 5 },
    { id: '7', name: 'Lisa Taylor', status: true, trustScore: 4 },
    { id: '8', name: 'Robert Miller', status: false, trustScore: 3 },
  ],
  contributions: [
    { id: '1', date: '01 Apr 2023', amount: 50000, member: 'Sarah (You)' },
    { id: '2', date: '01 Apr 2023', amount: 50000, member: 'John Doe' },
    { id: '3', date: '02 Apr 2023', amount: 50000, member: 'Mike Johnson' },
    { id: '4', date: '03 Apr 2023', amount: 50000, member: 'David Wilson' },
    { id: '5', date: '04 Apr 2023', amount: 50000, member: 'Lisa Taylor' },
  ],
  rotationSchedule: [
    { id: '1', date: '15 Apr 2023', member: 'John Doe', amount: 400000 },
    { id: '2', date: '15 May 2023', member: 'Jane Smith', amount: 400000 },
    { id: '3', date: '15 Jun 2023', member: 'Sarah (You)', amount: 400000 },
    { id: '4', date: '15 Jul 2023', member: 'Mike Johnson', amount: 400000 },
  ],
  announcements: [
    {
      id: '1',
      sender: 'Admin',
      message: 'Remember to make your contributions before Friday!',
      date: '02 Apr 2023',
    },
    {
      id: '2',
      sender: 'John Doe',
      message: 'I will be making my contribution tomorrow.',
      date: '03 Apr 2023',
    },
    {
      id: '3',
      sender: 'Admin',
      message: 'Meeting scheduled for next week.',
      date: '05 Apr 2023',
    },
  ],
};

const GroupOverviewScreen = () => {
  const [activeTab, setActiveTab] = useState('members');
  const navigation = useNavigation();

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
      data={groupDetails.members}
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
    />
  );

  const renderContributionsTab = () => (
    <View>
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValues}>
            {formatCurrency(groupDetails.balance)} / {formatCurrency(groupDetails.goal)}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${(groupDetails.balance / groupDetails.goal) * 100}%` },
            ]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.contributeButton}
        onPress={() => navigation.navigate('MakeContribution', { groupId: "1" })}
      >
        <Text style={styles.contributeButtonText}>Contribute Now</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Contributions</Text>
      <FlatList
        data={groupDetails.contributions}
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
      />
    </View>
  );

  const renderRotationTab = () => (
    <View>
      <View style={styles.nextRotationCard}>
        <Text style={styles.nextRotationTitle}>Next Payout</Text>
        <Text style={styles.nextRotationMember}>
          {groupDetails.nextRotation.member}
        </Text>
        <Text style={styles.nextRotationDate}>
          {groupDetails.nextRotation.date} ({groupDetails.nextRotation.daysLeft} days left)
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Rotation Schedule</Text>
      <FlatList
        data={groupDetails.rotationSchedule}
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
      />
    </View>
  );

  const renderAnnouncementsTab = () => (
    <FlatList
      data={groupDetails.announcements}
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
      ListFooterComponent={
        <TouchableOpacity
          style={styles.createAnnouncementButton}
          onPress={() => navigation.navigate('CreateAnnouncement', )}
        >
          <Text style={styles.createAnnouncementButtonText}>Create Announcement</Text>
        </TouchableOpacity>
      }
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{groupDetails.name}</Text>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => navigation.navigate('GroupActivities', { groupId: groupDetails.id })}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Saved</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(groupDetails.balance)}
        </Text>
        <Text style={styles.contributionInfo}>
          {formatCurrency(groupDetails.contributionAmount)} {groupDetails.frequency}
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
          onPress={() => navigation.navigate('RequestLoan', )}
        >
          <Ionicons name="cash-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Request Loan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.disburseButton]}
          onPress={() => {
            // Handle disburse funds - would navigate to a screen in a real app
            alert('Disburse funds feature would open here');
          }}
        >
          <Ionicons name="wallet-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}
          onPress={ () => navigation.navigate('DisburseFunds')}>Disburse Funds</Text>
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
  createAnnouncementButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  createAnnouncementButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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