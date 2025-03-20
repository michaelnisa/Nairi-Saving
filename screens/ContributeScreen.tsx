import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';


// Define the navigation stack type
type RootStackParamList = {
  GroupOverview: { groupId: string };
  // Add other screens here if needed
};

import { Ionicons } from '@expo/vector-icons';
  

// Mock data for the group
const groupData = {
  id: '1',
  name: 'Family Savings',
  contributionAmount: 50000,
  dueDate: '10 Apr 2023',
};

// Mock payment methods
const paymentMethods = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    // icon: require('../assets/mpesa.png'),
  },
  {
    id: 'tigopesa',
    name: 'Tigo Pesa',
    // icon: require('../assets/tigopesa.png'),
  },
  {
    id: 'airtel',
    name: 'Airtel Money',
    // icon: require('../assets/airtel.png'),
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    // icon: require('../assets/bank.png'),
  },
  {
    id: 'cash',
    name: 'Cash',
    // icon: require('../assets/cash.png'),
  },
];

const ContributeScreen = () => {
  // Removed incorrect navigation declaration
  
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TZS';
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      if (selectedMethod === 'cash') {
        Alert.alert(
          'Manual Payment',
          'Please inform the group admin about your cash payment.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('GroupOverview', { groupId: groupData.id }),
            },
          ]
        );
      } else {
        // Show success and navigate back
        Alert.alert(
          'Payment Successful',
          `You have successfully contributed ${formatCurrency(groupData.contributionAmount)} to ${groupData.name}`,
          [
            {
              text: 'View Receipt',
              onPress: () => {
                // In a real app, you would show the receipt
                navigation.navigate('GroupOverview', { groupId: groupData.id });
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.navigate('GroupOverview', { groupId: groupData.id }),
            },
          ]
        );
      }
    }, 2000);
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
        <Text style={styles.headerTitle}>Contribute Funds</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.groupInfoCard}>
          <Text style={styles.groupName}>{groupData.name}</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount Due</Text>
            <Text style={styles.amount}>
              {formatCurrency(groupData.contributionAmount)}
            </Text>
          </View>
          <View style={styles.dueDateContainer}>
            <Text style={styles.dueDateLabel}>Due Date</Text>
            <Text style={styles.dueDate}>{groupData.dueDate}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethodCard,
              selectedMethod === method.id && styles.selectedPaymentMethod,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            {/* <Image source={method.icon} style={styles.paymentMethodIcon} /> */}
            <Text style={styles.paymentMethodName}>{method.name}</Text>
            {selectedMethod === method.id && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#009E60"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.noteText}>
            Your contribution will be recorded immediately after successful payment.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedMethod || isProcessing) && styles.disabledButton,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod || isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.payButtonText}>Processing...</Text>
          ) : (
            <Text style={styles.payButtonText}>
              Pay {formatCurrency(groupData.contributionAmount)}
            </Text>
          )}
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
  amountContainer: {
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009E60',
  },
  dueDateContainer: {},
  dueDateLabel: {
    fontSize: 14,
    color: '#666',
  },
  dueDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  paymentMethodCard: {
    flexDirection: 'row',
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
  selectedPaymentMethod: {
    borderWidth: 2,
    borderColor: '#009E60',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  paymentMethodName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 158, 96, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContributeScreen;