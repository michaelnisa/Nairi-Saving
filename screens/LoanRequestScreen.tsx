import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, useRoute, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Mock group data
const groupData = {
  id: "1",
  name: "Family Savings",
  maxLoanAmount: 500000,
  interestRate: 5,
  repaymentPeriod: 30, // days
};

  const LoanRequestScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loanAmount, setLoanAmount] = useState("");
    const [reason, setReason] = useState("");
    const [repaymentDate, setRepaymentDate] = useState("");
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const formatCurrency = (amount: number) => {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " TZS";
    };
  
    const calculateInterest = () => {
      if (!loanAmount) return 0;
      return (parseFloat(loanAmount) * groupData.interestRate) / 100;
    };
  
    const calculateTotalRepayment = () => {
      if (!loanAmount) return 0;
      return parseFloat(loanAmount) + calculateInterest();
    };
  
    const handleSubmit = () => {
      // Validate inputs
      if (!loanAmount.trim() || parseFloat(loanAmount) <= 0) {
        Alert.alert("Error", "Please enter a valid loan amount");
        return;
      }
  
      if (parseFloat(loanAmount) > groupData.maxLoanAmount) {
        Alert.alert(
          "Error",
          `Maximum loan amount is ${formatCurrency(groupData.maxLoanAmount)}`
        );
        return;
      }
  
      if (!repaymentDate.trim()) {
        Alert.alert("Error", "Please enter a repayment date");
        return;
      }
  
      if (!termsAgreed) {
        Alert.alert("Error", "Please agree to the loan terms");
        return;
      }
  
      setIsSubmitting(true);
  
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          "Loan Request Submitted",
          "Your loan request has been submitted for approval. You will be notified once it is reviewed.",
          [
            {
              text: "OK",
              onPress: () =>
                // navigation.navigate("GroupOverview", { groupId: groupData.id }),
              navigation.goBack(),
            },
          ]
        );
      }, 1500);
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
        <Text style={styles.headerTitle}>Request Loan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.groupInfoCard}>
          <Text style={styles.groupName}>{groupData.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Max Loan:</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(groupData.maxLoanAmount)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Interest Rate:</Text>
            <Text style={styles.infoValue}>{groupData.interestRate}%</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Repayment Period:</Text>
            <Text style={styles.infoValue}>
              {groupData.repaymentPeriod} days
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Loan Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Loan Amount *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={loanAmount}
              onChangeText={setLoanAmount}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Reason (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Why do you need this loan?"
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Repayment Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={repaymentDate}
              onChangeText={setRepaymentDate}
            />
          </View>

          {loanAmount ? (
            <View style={styles.calculationContainer}>
              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>Loan Amount:</Text>
                <Text style={styles.calculationValue}>
                  {formatCurrency(parseFloat(loanAmount))}
                </Text>
              </View>
              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>
                  Interest ({groupData.interestRate}%):
                </Text>
                <Text style={styles.calculationValue}>
                  {formatCurrency(calculateInterest())}
                </Text>
              </View>
              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>Total Repayment:</Text>
                <Text style={[styles.calculationValue, styles.totalValue]}>
                  {formatCurrency(calculateTotalRepayment())}
                </Text>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setTermsAgreed(!termsAgreed)}
          >
            <View
              style={[
                styles.checkbox,
                termsAgreed ? styles.checkboxChecked : styles.checkboxUnchecked,
              ]}
            >
              {termsAgreed && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.termsText}>
              I agree to the loan terms and conditions, including repayment by
              the specified date.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!loanAmount || !repaymentDate || !termsAgreed || isSubmitting) &&
              styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={
            !loanAmount || !repaymentDate || !termsAgreed || isSubmitting
          }
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Submitting..." : "Submit Loan Request"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoanRequestScreen;

const styles: { [key: string]: any } = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  groupInfoCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  formSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  calculationContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calculationLabel: {
    fontSize: 14,
    color: "#666",
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  totalValue: {
    fontWeight: "bold",
    color: "#009E60",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#009E60",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#009E60",
  },
  checkboxUnchecked: {
    backgroundColor: "transparent",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  submitButton: {
    backgroundColor: "#009E60",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

