// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

// Import screens
import SplashScreen from "../screens/SplashScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import GroupOverviewScreen from "../screens/GroupOverviewScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import JoinGroupScreen from "../screens/JoinGroupScreen";
import ContributeScreen from "../screens/ContributeScreen";
import LoanRequestScreen from "../screens/LoanRequestScreen";
import ProfileScreen from "../screens/ProfileScreen";
import InviteMembersScreen from "../screens/InviteMembersScreen";
import ManageMembersScreen from "../screens/ManageMembersScreen";
import EditGroupScreen from "../screens/EditGroupScreen";
import MakeContributionScreen from "../screens/MakeContributionScreen";
import RequestLoanScreen from "../screens/RequestLoanScreen";
import DisburseFundsScreen from "../screens/DisburseFundsScreen";



export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      // linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="GroupOverview" component={GroupOverviewScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
      <Stack.Screen name="Contribute" component={ContributeScreen} />
      <Stack.Screen name="LoanRequest" component={LoanRequestScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="InviteMembers" component={InviteMembersScreen} />
      <Stack.Screen name="ManageMembers" component={ManageMembersScreen} />
      <Stack.Screen name="EditGroup" component={EditGroupScreen} /> 
      <Stack.Screen name="MakeContribution" component={MakeContributionScreen} />
      <Stack.Screen name="RequestLoan" component={RequestLoanScreen} />
      <Stack.Screen name="DisburseFunds" component={DisburseFundsScreen} />


      
    

    </Stack.Navigator>
  );
}
