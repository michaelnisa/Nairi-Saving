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
  Switch,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for the group
const mockGroup = {
  id: '1',
  name: 'Family Savings',
  balance: 1250000,
  contribution_amount: 50000,
  loan_allowance_enabled: true,
  loan_interest_rate: 5,
};

const RequestLoanScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get groupId from route params or use default '1'
  const groupId = route.params?.groupId || '1';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [group, setGroup] = useState(null);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [repaymentDate, setRepaymentDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // For custom date picker
  const [selectedYear, setSelectedYear] = useState(repaymentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(repaymentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(repaymentDate.getDate());
  
  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      setGroup(mockGroup);
      
      // Check if loans are enabled for this group
      if (!mockGroup.loan_allowance_enabled) {
        Alert.alert(
          'Loans Not Available',
          'This group does not allow loan requests at this time.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [groupId]);
  
  const handleRequestLoan = async () => {
    // Validate inputs
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid loan amount');
      return;
    }
    
    if (!purpose.trim()) {
      Alert.alert('Error', 'Please enter the purpose of the loan');
      return;
    }
    
    if (!agreeToTerms) {
      Alert.alert('Error', 'You must agree to the loan terms and conditions');
      return;
    }
    
    // Check if the amount is within the allowed limit
    const maxLoanAmount = group.balance * 0.5; // Example: 50% of group balance
    if (parseFloat(amount) > maxLoanAmount) {
      Alert.alert(
        'Loan Amount Too High',
        `The maximum loan amount allowed is ${formatCurrency(maxLoanAmount)}. Please enter a lower amount.`
      );
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      Alert.alert(
        'Loan Request Submitted',
        'Your loan request has been submitted and is pending approval from the group admin.',
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
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Custom date picker functions
  const openDatePicker = () => {
    setSelectedYear(repaymentDate.getFullYear());
    setSelectedMonth(repaymentDate.getMonth());
    setSelectedDay(repaymentDate.getDate());
    setShowDatePicker(true);
  };
  
  const confirmDateSelection = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    
    // Validate the date is at least 7 days from now
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    
    if (newDate < minDate) {
      Alert.alert('Invalid Date', 'Repayment date must be at least 7 days from today.');
      return;
    }
    
    setRepaymentDate(newDate);
    setShowDatePicker(false);
  };
  
  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };
  
  // Generate arrays for date picker
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const days = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1
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
        <Text style={styles.headerTitle}>Request Loan</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.groupInfoCard}>
          <Text style={styles.groupName}>{group.name}</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Group Balance:</Text>
            <Text style={styles.balanceValue}>{formatCurrency(group.balance)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Maximum Loan Amount:</Text>
            <Text style={styles.infoValue}>{formatCurrency(group.balance * 0.5)}</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Loan Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount (TZS)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter loan amount"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Purpose</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="Explain why you need this loan"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Repayment Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={openDatePicker}
            >
              <Text style={styles.dateText}>{formatDate(repaymentDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#009E60" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.termsContainer}>
            <Switch
              value={agreeToTerms}
              onValueChange={setAgreeToTerms}
              trackColor={{ false: '#ccc', true: '#009E60' }}
              thumbColor="white"
            />
            <Text style={styles.termsText}>
              I agree to repay this loan by the specified date with any applicable interest. I understand that failure to repay may result in penalties and affect my standing in the group.
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isSubmitting || !agreeToTerms) && styles.disabledButton,
            ]}
            onPress={handleRequestLoan}
            disabled={isSubmitting || !agreeToTerms}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Loan Request</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Loan Information</Text>
          <Text style={styles.infoText}>
            • Your loan request will be reviewed by the group admin
          </Text>
          <Text style={styles.infoText}>
            • If approved, the funds will be transferred to your account
          </Text>
          <Text style={styles.infoText}>
            • Interest rate: {group.loan_interest_rate || 5}% of the loan amount
          </Text>
          <Text style={styles.infoText}>
            • Late repayment may incur additional fees
          </Text>
        </View>
        
        {/* Extra space at bottom */}
        <View style={{ height: 30 }} />
      </ScrollView>
      
      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <Text style={styles.datePickerTitle}>Select Repayment Date</Text>
            
            <View style={styles.datePickerContainer}>
              {/* Month Picker */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Month</Text>
                <ScrollView style={styles.datePickerScroll}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.datePickerItem,
                        selectedMonth === index && styles.datePickerItemSelected,
                      ]}
                      onPress={() => setSelectedMonth(index)}
                    >
                      <Text
                        style={[
                          styles.datePickerItemText,
                          selectedMonth === index && styles.datePickerItemTextSelected,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Day Picker */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Day</Text>
                <ScrollView style={styles.datePickerScroll}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.datePickerItem,
                        selectedDay === day && styles.datePickerItemSelected,
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text
                        style={[
                          styles.datePickerItemText,
                          selectedDay === day && styles.datePickerItemTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Year Picker */}
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Year</Text>
                <ScrollView style={styles.datePickerScroll}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.datePickerItem,
                        selectedYear === year && styles.datePickerItemSelected,
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.datePickerItemText,
                          selectedYear === year && styles.datePickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.datePickerActions}>
              <TouchableOpacity
                style={[styles.datePickerButton, styles.datePickerCancelButton]}
                onPress={cancelDateSelection}
              >
                <Text style={styles.datePickerButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.datePickerButton, styles.datePickerConfirmButton]}
                onPress={confirmDateSelection}
              >
                <Text style={[styles.datePickerButtonText, styles.datePickerConfirmButtonText]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
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
  // Custom Date Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  datePickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  datePickerScroll: {
    height: 200,
  },
  datePickerItem: {
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  datePickerItemSelected: {
    backgroundColor: 'rgba(0, 158, 96, 0.1)',
  },
  datePickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerItemTextSelected: {
    color: '#009E60',
    fontWeight: 'bold',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  datePickerCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  datePickerConfirmButton: {
    backgroundColor: '#009E60',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  datePickerConfirmButtonText: {
    color: 'white',
  },
});

export default RequestLoanScreen;