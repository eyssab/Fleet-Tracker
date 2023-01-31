import { StyleSheet, Text, Pressable, View } from 'react-native';
import RouteView from './Screens/RouteView/RouteView'
import MapStopView from './Screens/MapStopView/MapStopView'
import SchoolsView from './Screens/SchoolListView'
import DashBoardView from './Screens/DashBoardView'
import RouteManagerView from './Screens/RouteManagerView'
import StopManagerView from './Screens/StopManagerView'
import DriverView from './Screens/DriverView'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { Appbar } from 'react-native-paper';
import { withAuthenticator, AmplifyTheme } from 'aws-amplify-react-native';
import awsconfig from './src/aws-exports';
import { useEffect } from 'react';
import { getStudent } from "./src/graphql/queries";
import { createStudent } from "./src/graphql/mutations";

const Stack = createNativeStackNavigator();

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

const signOut = async () => {
  try {
    await Auth.signOut({ global: true });
  } catch (error) {
    console.log('error signing out: ', error);
  }
};


function CustomNavigationBar({ navigation, back }) {
  //Custom Header with sign out and page navigation
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="BusLeft" />
      <Pressable style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
    </Appbar.Header>
  );
}

const App = () => {
  useEffect(() => {
    const syncStudents = async () => {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});

      const studentData = await API.graphql(graphqlOperation(getStudent, { id: authUser.attributes.sub }));

      if(studentData.data.getStudent) {
        console.log("User already exists in DB");
        return;
      };

      //New User Creation
      const newStudent = {
        id: authUser.attributes.sub,
        email: authUser.attributes.email,
      };

      const newStudentResponse = await API.graphql(
        graphqlOperation(createStudent, { input: newStudent })
      );
    };

    syncStudents();
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />,
        }}>
        <Stack.Screen name="Schools" component={SchoolsView}/>
        <Stack.Screen name="Routes" component={RouteView} />
        <Stack.Screen name="RouteManagerView" component={RouteManagerView} />
        <Stack.Screen name="StopManagerView" component={StopManagerView} />
        <Stack.Screen name="DashBoardView" component={DashBoardView}/>
        <Stack.Screen name="Stops" component={MapStopView} />
        <Stack.Screen name="DriverView" component={DriverView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const signUpConfig = {
  
  hideAllDefaults: true,
  signUpFields: [
    {
      label: "Email",
      key: "email",
      required: true,
      displayOrder: 2,
      type: "string",
    },
    {
      label: "Username",
      key: "preferred_username",
      required: false,
      displayOrder: 3,
      type: "string",
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 4,
      type: "password",
    },
  ],
};

const customTheme = { 
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff9900',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default withAuthenticator(App, {signUpConfig, theme: customTheme});