import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Share,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const InviteMembersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get group data from route params or use default
  const groupData = route.params?.groupData || {
    id: '1',
    name: 'Family Savings',
    code: '123456',
  };

  const handleAddMember = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    // Simple validation for phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Add to invited members list
    const newMember = {
      id: Date.now().toString(),
      phoneNumber: phoneNumber,
      status: 'pending',
    };

    setInvitedMembers([...invitedMembers, newMember]);
    setPhoneNumber('');

    // In a real app, you would send an invitation via SMS or other means
    Alert.alert('Success', `Invitation sent to ${phoneNumber}`);
  };

  const handleRemoveMember = (id) => {
    setInvitedMembers(invitedMembers.filter(member => member.id !== id));
  };

  const handleShareInvite = async () => {
    try {
      const result = await Share.share({
        message: `Join my savings group "${groupData.name}" on Chama App! Use group code: ${groupData.code}`,
        title: 'Invite to Savings Group',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the invitation');
    }
  };

  const handleSendAllInvitations = () => {
    if (invitedMembers.length === 0) {
      Alert.alert('Error', 'Please add at least one member to invite');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Invitations Sent',
        'All invitations have been sent successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <View>
        <Text style={styles.memberPhone}>{item.phoneNumber}</Text>
        <Text style={styles.memberStatus}>
          {item.status === 'pending' ? 'Invitation pending' : 'Joined'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveMember(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
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
        <Text style={styles.headerTitle}>Invite Members</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.groupInfoCard}>
          <Text style={styles.groupName}>{groupData.name}</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Group Code</Text>
            <View style={styles.codeDisplay}>
              <Text style={styles.codeText}>{groupData.code}</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => {
                  // In a real app, you would copy to clipboard
                  Alert.alert('Copied', 'Group code copied to clipboard');
                }}
              >
                <Ionicons name="copy-outline" size={20} color="#009E60" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inviteSection}>
          <Text style={styles.sectionTitle}>Invite by Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                !phoneNumber.trim() && styles.disabledButton,
              ]}
              onPress={handleAddMember}
              disabled={!phoneNumber.trim()}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareInvite}
          >
            <Ionicons name="share-social-outline" size={20} color="#009E60" />
            <Text style={styles.shareButtonText}>Share Invite Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Invited Members</Text>
          {invitedMembers.length > 0 ? (
            <FlatList
              data={invitedMembers}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No members invited yet. Add members above.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.sendButton,
            (invitedMembers.length === 0 || isLoading) && styles.disabledButton,
          ]}
          onPress={handleSendAllInvitations}
          disabled={invitedMembers.length === 0 || isLoading}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? 'Sending...' : 'Send All Invitations'}
          </Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  groupInfoCard: {
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
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  codeContainer: {
    marginBottom: 10,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  codeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    letterSpacing: 2,
  },
  copyButton: {
    padding: 5,
  },
  inviteSection: {
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#009E60',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#009E60',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 158, 96, 0.1)',
  },
  shareButtonText: {
    color: '#009E60',
    fontWeight: '500',
    marginLeft: 10,
  },
  membersSection: {
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
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberPhone: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  memberStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 5,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sendButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InviteMembersScreen;