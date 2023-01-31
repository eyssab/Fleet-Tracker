import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Button, Text, TextInput } from 'react-native-paper';
import { listSchools, getStudent } from '../src/graphql/queries';
import { Auth } from 'aws-amplify';
import { updateStudent } from '../src/graphql/mutations';

export default function SchoolListView({ navigation }) {
  //School password user input
  const [password, setPassword] = React.useState("");

  //Add all schools into list
  const [schools, setSchools] = useState([]);
  useEffect(() => {
    API.graphql(graphqlOperation(listSchools)).then((result) => {
      setSchools(result.data?.listSchools?.items);
    });
  }, []);

  function onFinishPress() {
    //Get School by entered schoolPassword, if valid then Get Student by Auth ID, then store password into studentData
    const syncStudents = async () => {
      const matches = schools.find(schools => schools.schoolPassword == password);
      //Update User info on successful password input(for save functionality)
      if (matches) {
        const authUser = await Auth.currentAuthenticatedUser();
        const studentData = await API.graphql(graphqlOperation(getStudent, { id: authUser.attributes.sub }));

        //Updating Student school password on password input for save functionality later on
        const updatedStudent = {
          _version: studentData.data.getStudent._version,
          email: authUser.attributes.email,
          id: authUser.attributes.sub,
          verifiedSchoolID: matches.id,
        };

        const updatingStudent = await API.graphql(graphqlOperation(updateStudent, { input: updatedStudent }));

        //Navigate to next page on successful password input
        if(studentData.data.getStudent.isAdmin){
          navigation.navigate('DashBoardView')
        }else if(studentData.data.getStudent.isDriver){
          navigation.navigate('DriverView')
        }else{
          navigation.navigate('Routes')
        }
        
      }

    }
    syncStudents();

  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{...styles.container, flex: 3}}>
        <Text style={styles.textStyle}>Enter School Password</Text>
      </View>
      <View style={{...styles.container, flex: 6}}>
        <TextInput
          style={styles.cardTheme}
          label="School Password"
          value={password}
          onChangeText={password => setPassword(password)}
        />
        <Button mode="contained" style={{margin:20}}onPress={() => onFinishPress()}>
          Enter Password
        </Button>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  cardTheme: {
    width: 300,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
