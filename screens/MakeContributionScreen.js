import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../screens/services/api';

const ContributeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;
  const [groupData, setGroupData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch group details
        const groupDetails = await api.groups.getGroup(groupId);
        setGroupData(groupDetails);
        
        // Fetch payment methods
        const methods = await api.contributions.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        Alert.alert('Error', 'Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TZS';
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setIsProcessing(true);
    try {
      // Make contribution API call
      await api.contributions.makeContribution(
        groupId,
        groupData.contributionAmount,
        selectedMethod
      );
      
      // Show success message
      if (selectedMethod === 'cash') {
        Alert.alert(
          'Manual Payment',
          'Please inform the group admin about your cash payment.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('GroupOverview', { groupId }),
            },
          ]
        );
      } else {
        Alert.alert(
          'Payment Successful',
          `You have successfully contributed ${formatCurrency(groupData.contributionAmount)} to ${groupData.name}`,
          [
            {
              text: 'View Receipt',
              onPress: () => {
                // In a real app, you would show the receipt
                navigation.navigate('GroupOverview', { groupId });
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.navigate('GroupOverview', { groupId }),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Payment failed:', error);
      Alert.alert('Payment Failed', error.message || 'Something went wrong with your payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
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
        <Text style={styles.headerTitle}>Contribute Funds</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.groupInfoCard}>
          <Text style={styles.groupName}>{groupData?.name}</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount Due</Text>
            <Text style={styles.amount}>
              {formatCurrency(groupData?.contributionAmount || 0)}
            </Text>
          </View>
          <View style={styles.dueDateContainer}>
            <Text style={styles.dueDateLabel}>Due Date</Text>
            <Text style={styles.dueDate}>{groupData?.dueDate || 'N/A'}</Text>
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
            <Image source={{ uri: method.iconUrl }} style={styles.paymentMethodIcon} />
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
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay {formatCurrency(groupData?.contributionAmount || 0)}
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