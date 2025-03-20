import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';


// Mock group data that would be fetched after entering a code
const mockGroupData = {
  id: '123456',
  name: 'Neighborhood Fund',
  contributionAmount: 50000,
  frequency: 'Weekly',
  members: 15,
  rules: [
    'Weekly contributions of 50,000 TZS',
    'Late fees apply after 2 days',
    'Loans available after 3 months of membership',
  ],
};

const JoinGroupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [groupCode, setGroupCode] = useState('');
  const [groupData, setGroupData] = useState<{
    id: string;
    name: string;
    contributionAmount: number;
    frequency: string;
    members: number;
    rules: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TZS';
  };

  const handleFindGroup = () => {
    if (!groupCode.trim()) {
      Alert.alert('Error', 'Please enter a group code');
      return;
    }

    setIsLoading(true);

    // Simulate API call to find group
    setTimeout(() => {
      setIsLoading(false);
      setGroupData(mockGroupData);
    }, 1500);
  };

  const handleJoinGroup = () => {
    // In a real app, you would send a request to join the group
    Alert.alert(
      'Request Sent',
      `Your request to join ${groupData?.name ?? 'the group'} has been sent. The group admin will review your request.`,
      [
        {
          text: 'OK',
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
        <Text style={styles.headerTitle}>Join Group</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Enter Group Code</Text>
          <Text style={styles.sectionDescription}>
            Enter the 6-digit code provided by the group admin or scan a QR code.
          </Text>

          <View style={styles.codeInputContainer}>
            <TextInput
              style={styles.codeInput}
              placeholder="Enter 6-digit code"
              value={groupCode}
              onChangeText={setGroupCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              style={[
                styles.findButton,
                (!groupCode.trim() || isLoading) && styles.disabledButton,
              ]}
              onPress={handleFindGroup}
              disabled={!groupCode.trim() || isLoading}
            >
              {isLoading ? (
                <Text style={styles.findButtonText}>Searching...</Text>
              ) : (
                <Text style={styles.findButtonText}>Find Group</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.scanQRButton}>
            <Ionicons name="qr-code-outline" size={20} color="#009E60" />
            <Text style={styles.scanQRText}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>

        {groupData && (
          <View style={styles.groupInfoSection}>
            <Text style={styles.sectionTitle}>Group Information</Text>
            
            <View style={styles.groupInfoCard}>
              <Text style={styles.groupName}>{groupData.name}</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contribution:</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(groupData.contributionAmount)} {groupData.frequency}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Members:</Text>
                <Text style={styles.infoValue}>{groupData.members}</Text>
              </View>
              
              <View style={styles.rulesContainer}>
                <Text style={styles.rulesTitle}>Group Rules:</Text>
                {groupData.rules.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#009E60" />
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinGroup}
            >
              <Text style={styles.joinButtonText}>Request to Join</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  codeSection: {
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
    marginBottom: 10,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginRight: 10,
  },
  findButton: {
    backgroundColor: '#009E60',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  findButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scanQRButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanQRText: {
    color: '#009E60',
    fontWeight: '500',
    marginLeft: 5,
  },
  groupInfoSection: {
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
  groupInfoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  rulesContainer: {
    marginTop: 10,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  joinButton: {
    backgroundColor: '#009E60',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JoinGroupScreen;