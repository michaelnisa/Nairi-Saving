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
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for the group
const mockGroup = {
  id: '1',
  name: 'Family Savings',
  contribution_amount: 50000,
  balance: 1250000,
  goal: 2000000,
  frequency: 'Weekly',
};

const MakeContributionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get groupId from route params or use default '1'
  const groupId = route.params?.groupId || '1';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [group, setGroup] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [note, setNote] = useState('');
  
  useEffect(() => {
    // Simulate API fetch with a delay
    const timer = setTimeout(() => {
      // Use the groupId to "fetch" the right group (in a real app)
      // For now, we'll just use our mock data
      setGroup(mockGroup);
      setAmount(mockGroup.contribution_amount.toString());
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [groupId]); // Add groupId as dependency
  
  const handleMakeContribution = async () => {
    // Validate inputs
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (paymentMethod === 'mobile_money' && !mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setIsProcessing(false);
      
      Alert.alert(
        'Success',
        'Your contribution has been processed successfully',
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
        <Text style={styles.headerTitle}>Make Contribution</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.groupInfoCard}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.contributionPeriod}>
            Contribution for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Required Amount:</Text>
            <Text style={styles.amountValue}>{formatCurrency(group.contribution_amount)}</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount (TZS)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
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
            
            <TouchableOpacity
              style={[
                styles.paymentMethodOption,
                paymentMethod === 'cash' && styles.selectedPaymentMethod,
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <View style={[styles.iconPlaceholder, { backgroundColor: '#FF9500' }]}>
                <Ionicons name="cash-outline" size={20} color="white" />
              </View>
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'cash' && styles.selectedPaymentMethodText,
                ]}
              >
                Cash
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
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note about your contribution"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.payButton, isProcessing && styles.disabledButton]}
            onPress={handleMakeContribution}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.payButtonText}>Make Contribution</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Information</Text>
          <Text style={styles.infoText}>
            Your contribution will be recorded immediately. If you selected Mobile Money or Bank Transfer, please complete the payment process through your provider.
          </Text>
          <Text style={styles.infoText}>
            For cash payments, please contact your group administrator to confirm receipt.
          </Text>
        </View>
        
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
    marginBottom: 5,
  },
  contributionPeriod: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amountValue: {
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
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethodOption: {
    width: '30%',
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
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  selectedPaymentMethodText: {
    color: '#009E60',
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
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
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default MakeContributionScreen;