import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreateGroupScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [groupName, setGroupName] = useState('');
  const [savingGoal, setSavingGoal] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [frequency, setFrequency] = useState('Weekly');
  const [rotationOrder, setRotationOrder] = useState('Manual');
  const [lateFees, setLateFees] = useState(false);
  const [loanAllowance, setLoanAllowance] = useState(false);
  const [votingRules, setVotingRules] = useState(false);

  const frequencies = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'];
  const rotationOrders = ['Manual', 'Auto-Randomized'];

  const handleCreateGroup = () => {
    // Validate inputs
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (!contributionAmount.trim()) {
      Alert.alert('Error', 'Please enter a contribution amount');
      return;
    }

    // In a real app, you would send this data to your backend
    Alert.alert(
      'Group Created',
      `Your group "${groupName}" has been created successfully. You can now invite members.`,
      [
        {
          text: 'Invite Members',
          onPress: () => {
            // In a real app, you would navigate to an invite screen
            navigation.navigate('Home');
          },
        },
        {
          text: 'Later',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Create Group</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Group Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Group Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Saving Goal (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter target amount"
              keyboardType="numeric"
              value={savingGoal}
              onChangeText={setSavingGoal}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contribution Amount *</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount per contribution"
              keyboardType="numeric"
              value={contributionAmount}
              onChangeText={setContributionAmount}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contribution Frequency *</Text>
            <View style={styles.optionsContainer}>
              {frequencies.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionButton,
                    frequency === item && styles.selectedOption,
                  ]}
                  onPress={() => setFrequency(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      frequency === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Rotation Order *</Text>
            <View style={styles.optionsContainer}>
              {rotationOrders.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionButton,
                    rotationOrder === item && styles.selectedOption,
                  ]}
                  onPress={() => setRotationOrder(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      rotationOrder === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Group Rules</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Late Fees</Text>
              <Text style={styles.switchDescription}>
                Charge fees for late contributions
              </Text>
            </View>
            <Switch
              value={lateFees}
              onValueChange={setLateFees}
              trackColor={{ false: '#ccc', true: '#009E60' }}
              thumbColor="white"
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Loan Allowance</Text>
              <Text style={styles.switchDescription}>
                Allow members to request loans
              </Text>
            </View>
            <Switch
              value={loanAllowance}
              onValueChange={setLoanAllowance}
              trackColor={{ false: '#ccc', true: '#009E60' }}
              thumbColor="white"
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Voting Rules</Text>
              <Text style={styles.switchDescription}>
                Major decisions require member voting
              </Text>
            </View>
            <Switch
              value={votingRules}
              onValueChange={setVotingRules}
              trackColor={{ false: '#ccc', true: '#009E60' }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={styles.inviteSection}>
          <Text style={styles.sectionTitle}>Invite Members</Text>
          <Text style={styles.inviteDescription}>
            After creating the group, you can invite members via phone number or share a QR code.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGroup}
        >
          <Text style={styles.createButtonText}>Create Group</Text>
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
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 158, 96, 0.1)',
    borderColor: '#009E60',
  },
  optionText: {
    color: '#666',
  },
  selectedOptionText: {
    color: '#009E60',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchInfo: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  switchDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
  inviteDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  createButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGroupScreen;