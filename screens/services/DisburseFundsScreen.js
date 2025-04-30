import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for the group
const mockGroup = {
  id: '1',
  name: 'Family Savings',
  balance: 1250000,
  contribution_amount: 50000,
  members: [
    { id: '1', name: 'Sarah (You)', role: 'admin', status: true },
    { id: '2', name: 'John Doe', role: 'member', status: true },
    { id: '3', name: 'Jane Smith', role: 'member', status: false },
    { id: '4', name: 'Mike Johnson', role: 'member', status: true },
    { id: '5', name: 'Emily Brown', role: 'member', status: false },
    { id: '6', name: 'David Wilson', role: 'member', status: true },
    { id: '7', name: 'Lisa Taylor', role: 'member', status: true },
    { id: '8', name: 'Robert Miller', role: 'member', status: false },
  ],
};

const DisburseFundsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get groupId from route params or use default '1'
  const groupId = route.params?.groupId || '1';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [group, setGroup] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  
  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setGroup(mockGroup);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [groupId]);
  
  const handleDisburseFunds = () => {
    // Validate inputs
    if (!selectedMember) {
      Alert.alert('Error', 'Please select a member to disburse funds to');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (parseFloat(amount) > group.balance) {
      Alert.alert('Error', 'Disbursement amount cannot exceed group balance');
      return;
    }
    
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a reason for this disbursement');
      return;
    }
    
    if (paymentMethod === 'mobile_money' && !mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter the recipient\'s mobile number');
      return;
    }
    
    if (paymentMethod === 'bank_transfer' && !bankAccount.trim()) {
      Alert.alert('Error', 'Please enter the recipient\'s bank account details');
      return;
    }
    
    // Show confirmation dialog
    const paymentDetails = paymentMethod === 'mobile_money' 
      ? `via Mobile Money to ${mobileNumber}` 
      : `via Bank Transfer to account ${bankAccount}`;
      
    Alert.alert(
      'Confirm Disbursement',
      `Are you sure you want to disburse ${formatCurrency(parseFloat(amount))} to ${selectedMember.name} ${paymentDetails}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: processDisbursement,
        },
      ]
    );
  };
  
  const processDisbursement = () => {
    setIsProcessing(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setIsProcessing(false);
      
      const paymentDetails = paymentMethod === 'mobile_money' 
        ? `via Mobile Money` 
        : `via Bank Transfer`;
        
      Alert.alert(
        'Disbursement Successful',
        `${formatCurrency(parseFloat(amount))} has been disbursed to ${selectedMember.name} ${paymentDetails}.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };
  
  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TZS';
  };
  
  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => {
        setSelectedMember(item);
        setShowMemberSelector(false);
      }}
    >
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
      </View>
      {item.id === selectedMember?.id && (
        <Ionicons name="checkmark-circle" size={24} color="#009E60" />
      )}
    </TouchableOpacity>
  );
  
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
        <Text style={styles.headerTitle}>Disburse Funds</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.groupInfoCard}>
          <Text style={styles.groupName}>{group.name}</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Available Balance:</Text>
            <Text style={styles.balanceValue}>{formatCurrency(group.balance)}</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Disbursement Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Member</Text>
            <TouchableOpacity
              style={styles.memberSelector}
              onPress={() => setShowMemberSelector(true)}
            >
              {selectedMember ? (
                <Text style={styles.selectedMemberText}>{selectedMember.name}</Text>
              ) : (
                <Text style={styles.placeholderText}>Select a member</Text>
              )}
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount (TZS)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount to disburse"
              keyboardType="numeric"
            />
          </View>
          
          <Text style={styles.inputLabel}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                paymentMethod === 'mobile_money' && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod('mobile_money')}
            >
              <View style={[styles.iconPlaceholder, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="phone-portrait-outline" size={20} color="white" />
              </View>
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'mobile_money' && styles.selectedPaymentMethodText,
                ]}
              >
                Mobile Money
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                paymentMethod === 'bank_transfer' && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod('bank_transfer')}
            >
              <View style={[styles.iconPlaceholder, { backgroundColor: '#34C759' }]}>
                <Ionicons name="card-outline" size={20} color="white" />
              </View>
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'bank_transfer' && styles.selectedPaymentMethodText,
                ]}
              >
                Bank Transfer
              </Text>
            </TouchableOpacity>
          </View>
          
          {paymentMethod === 'mobile_money' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Enter recipient's mobile number"
                keyboardType="phone-pad"
              />
            </View>
          )}
          
          {paymentMethod === 'bank_transfer' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bank Account Details</Text>
              <TextInput
                style={styles.input}
                value={bankAccount}
                onChangeText={setBankAccount}
                placeholder="Enter recipient's bank account details"
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Reason</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={reason}
              onChangeText={setReason}
              placeholder="Explain the reason for this disbursement"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.disburseButton, isProcessing && styles.disabledButton]}
            onPress={handleDisburseFunds}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.disburseButtonText}>Disburse Funds</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Disbursement Information</Text>
          <Text style={styles.infoText}>
            • Funds will be transferred to the selected member via the chosen payment method
          </Text>
          <Text style={styles.infoText}>
            • For mobile money transfers, ensure the phone number is correct and active
          </Text>
          <Text style={styles.infoText}>
            • For bank transfers, include the bank name, account number, and branch if applicable
          </Text>
          <Text style={styles.infoText}>
            • This transaction will be recorded in the group's activity log
          </Text>
          <Text style={styles.infoText}>
            • All group members will be notified of this disbursement
          </Text>
        </View>
        
        {/* Extra space at bottom */}
        <View style={{ height: 30 }} />
      </ScrollView>
      
      {/* Member Selector Modal */}
      {showMemberSelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.memberSelectorModal}>
            <View style={styles.memberSelectorHeader}>
              <Text style={styles.memberSelectorTitle}>Select Member</Text>
              <TouchableOpacity
                onPress={() => setShowMemberSelector(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={group.members}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.membersList}
            />
          </View>
        </View>
      )}
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
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009E60',
  },
  formContainer: {
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
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
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
  memberSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
  },
  selectedMemberText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethodOption: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  selectedPaymentMethod: {
    borderColor: '#009E60',
    backgroundColor: 'rgba(0, 158, 96, 0.05)',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  selectedPaymentMethodText: {
    color: '#009E60',
    fontWeight: '500',
  },
  disburseButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disburseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 5,
  },
  // Member Selector Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberSelectorModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  memberSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberSelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  membersList: {
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
});

export default DisburseFundsScreen;