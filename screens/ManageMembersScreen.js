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

const ManageMembersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;
  
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchMembers();
  }, []);
  
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const membersData = await groupService.getGroupMembers(groupId);
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
      Alert.alert('Error', 'Failed to load group members');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangeRole = async (memberId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    
    Alert.alert(
      'Change Role',
      `Are you sure you want to make this user a ${newRole}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await groupService.updateMemberRole(groupId, memberId, newRole);
              // Update the local state
              setMembers(members.map(member => 
                member.id === memberId ? { ...member, role: newRole } : member
              ));
              Alert.alert('Success', 'Member role updated successfully');
            } catch (error) {
              console.error('Error updating role:', error);
              Alert.alert('Error', 'Failed to update member role');
            }
          },
        },
      ]
    );
  };
  
  const handleRemoveMember = async (memberId, memberName) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from the group?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await groupService.removeMember(groupId, memberId);
              // Update the local state
              setMembers(members.filter(member => member.id !== memberId));
              Alert.alert('Success', 'Member removed successfully');
            } catch (error) {
              console.error('Error removing member:', error);
              Alert.alert('Error', 'Failed to remove member');
            }
          },
        },
      ]
    );
  };
  
  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.user_name}</Text>
        <View style={styles.roleContainer}>
          <Text style={[
            styles.roleText,
            item.role === 'admin' ? styles.adminRole : styles.memberRole
          ]}>
            {item.role === 'admin' ? 'Admin' : 'Member'}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleChangeRole(item.id, item.role)}
        >
          <Ionicons 
            name={item.role === 'admin' ? 'person-outline' : 'shield-outline'} 
            size={20} 
            color="#007AFF" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveMember(item.id, item.user_name)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
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
        <Text style={styles.headerTitle}>Manage Members</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => navigation.navigate('InviteMembers', { groupId })}
          >
            <Ionicons name="person-add-outline" size={20} color="white" />
            <Text style={styles.inviteButtonText}>Invite Members</Text>
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <ActivityIndicator style={styles.loader} size="large" color="#009E60" />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Group Members ({members.length})</Text>
            
            {members.length > 0 ? (
              <FlatList
                data={members}
                renderItem={renderMemberItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.membersList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No members found</Text>
              </View>
            )}
          </>
        )}
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
  actionsBar: {
    marginBottom: 20,
  },
  inviteButton: {
    flexDirection: 'row',
    backgroundColor: '#009E60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  membersList: {
    paddingBottom: 20,
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
    color: '#333',
    marginBottom: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  adminRole: {
    backgroundColor: 'rgba(0, 158, 96, 0.1)',
    color: '#009E60',
  },
  memberRole: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    color: '#007AFF',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  loader: {
    marginTop: 50,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ManageMembersScreen;