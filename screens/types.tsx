// In your types.ts file
export type Group = {
  id: string;
  name: string;
  balance: number;
  goal: number;
  contributionAmount: number;
  frequency: string;
  nextRotation: {
    member: string;
    date: string;
    daysLeft: number;
  };
  groupDetails: {
    id: string;
    name: string;
    balance: number;
    goal: number;
    contributionAmount: number;
    frequency: string;
    nextRotation: {
      member: string;
      date: string;
      daysLeft: number;
    };
    members: {
      id: string;
      name: string;
      status: boolean;
      trustScore: number;
    }[];
    contributions: {
      id: string;
      date: string;
      amount: number;
      member: string;
    }[];
    rotationSchedule: {
      id: string;
      date: string;
      member: string;
      amount: number;
    }[];
    announcements: {
      id: string;
      sender: string;
      message: string;
      date: string;
    }[];
  };
};

  // Add other properties as needed



  
export type RootStackParamList = {
  Home: undefined;
  Contribute: { groupData: any };
  LoanRequest: { groupId: string }; // Add LoanRequest route with correct parameter type
  GroupOverview: { groupId: string };
  Profile: undefined;
  JoinGroup: undefined;
  CreateGroup: undefined;
  Auth: undefined;
  Onboarding: undefined;
  SplashScreen: undefined;


 
    


  };
