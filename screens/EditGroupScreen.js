import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const EditGroupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Group details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [savingGoal, setSavingGoal] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const [lateFeesEnabled, setLateFeesEnabled] = useState(false);
  const [loanAllowanceEnabled, setLoanAllowanceEnabled] = useState(false);
  const [votingRulesEnabled, setVotingRulesEnabled] = useState(false);
  
  useEffect(() => {
    fetchGroupDetails();
  }, []);
  
  const fetchGroupDetails = async () => {
    setIsLoading(true);
    try {
      const group = await groupService.getGroupById(groupId);
      
      setName(group.name);
      setDescription(group.description || '');
      setSavingGoal(group.saving_goal ? group.saving_goal.toString() : '');
      setContributionAmount(group.contribution_amount.toString());
      setFrequency(group.frequency);
      setLateFeesEnabled(group.late_fees_enabled);
      setLoanAllowanceEnabled(group.loan_allowance_enabled);
      setVotingRulesEnabled(group.voting_rules_enabled);
      
    } catch (error) {
      console.error('Error fetching group details:', error);
      Alert.alert('Error', 'Failed to load group details');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert('Error', 'Group name is required');
      return;
    }
    
    if (!contributionAmount || isNaN(parseFloat(contributionAmount)) || parseFloat(contributionAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid contribution amount');
      return;
    }
    
    if (savingGoal && (isNaN(parseFloat(savingGoal)) || parseFloat(savingGoal) <= 0)) {
      Alert.alert('Error', 'Please enter a valid saving goal');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedGroup = {
        name,
        description,
        saving_goal: savingGoal ? parseFloat(savingGoal) : null,
        contribution_amount: parseFloat(contributionAmount),
        frequency,
        late_fees_enabled: lateFeesEnabled,
        loan_allowance_enabled: loanAllowanceEnabled,
        voting_rules_enabled: votingRulesEnabled,
      };
      
      await groupService.updateGroup(groupId, updatedGroup);
      
      Alert.alert(
        'Success',
        'Group details updated successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating group:', error);
      Alert.alert('Error', 'Failed to update group details');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
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
        <Text style={styles.headerTitle}>Edit Group</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Group Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter group name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter group description"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Financial Settings</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contribution Amount (TZS)</Text>
            <TextInput
              style={styles.input}
              value={contributionAmount}
              onChangeText={setContributionAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Saving Goal (Optional)</Text>
            <TextInput
              style={styles.input}
              value={savingGoal}
              onChangeText={setSavingGoal}
              placeholder="Enter goal amount"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contribution Frequency</Text>
            <View style={styles.frequencyOptions}>
              {['Daily', 'Weekly', 'Bi-weekly', 'Monthly'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.frequencyOption,
                    frequency === option && styles.selectedFrequency,
                  ]}
                  onPress={() => setFrequency(option)}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      frequency === option && styles.selectedFrequencyText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Group Rules</Text>
          
          <View style={styles.toggleContainer}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Enable Late Fees</Text>
              <Text style={styles.toggleDescription}>
                Charge members who contribute late
              </Text>
            </View>
            <Switch
              value={lateFeesEnabled}
              onValueChange={setLateFeesEnabled}
              trackColor={{ false: '#ccc', true: '#009E60' }}
              thumbColor="white"
            />
          </View>
          
          <View style={styles.toggleContainer}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Allow Loans</Text>
              <Text style={styles.toggleDescription}>
                Members can request loans from group funds
              </Text>
            </View>
            <Switch
              value={loanAllowanceEnabled}
              onValueChange={setLoanAllowanceEnabled}
              trackColor={{ false: '#ccc', true: '#009E60' }}
              thumbColor="white"
            />
          </View>
          
          <View style={styles.toggleContainer}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Enable Voting</Text>
              <Text style={styles.toggleDescription}>
                Major decisions require member voting
              </Text>
            </View>
            <Switch
              value={votingRulesEnabled}
              onValueChange={setVotingRulesEnabled}
              trackColor={{ false: '#ccc', true: '#009E60' }}
              thumbColor="white"
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Delete Group',
              'Are you sure you want to delete this group? This action cannot be undone.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await groupService.deleteGroup(groupId);
                      Alert.alert('Success', 'Group deleted successfully');
                      navigation.navigate('Home');
                    } catch (error) {
                      console.error('Error deleting group:', error);
                      Alert.alert('Error', 'Failed to delete group');
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.deleteButtonText}>Delete Group</Text>
        </TouchableOpacity>
        
        {/* Extra space at bottom */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
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
  content: {
    flex: 1,
    padding: 20,
  },
  formSection: {
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
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  frequencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  frequencyOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFrequency: {
    backgroundColor: '#009E60',
    borderColor: '#009E60',
  },
  frequencyText: {
    color: '#333',
  },
  selectedFrequencyText: {
    color: 'white',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  toggleDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditGroupScreen;