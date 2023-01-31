import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { Card, Text, Button } from 'react-native-paper';
import { listRoutesBySchoolID } from '../Screens/RouteView/queries';
import { getStudent } from '../src/graphql/queries';
import { Dimensions } from 'react-native';

export default function DashBoardView({ navigation }) {
  //Add all routes into list
  const [schoolName, setSchoolName] = useState("");

  //CARD DESIGN USING PAPER
  const RouteListItem = ({ Route }) => {
    if (Route.item.isActive) {
      return (
        <Card style={styles.activeCardTheme} onPress={() => navigation.navigate('Stops', { routeID: Route.item.id })}>

          <Card.Content>
            <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold', color: 'white' }} variant="titleLarge">{Route.item.routeName}</Text>
            <Text style={{ fontSize: 18, textAlign: 'right', color: 'white' }} variant="titleLarge">Upcoming Stop</Text>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card style={styles.inactiveCardTheme} onPress={() => navigation.navigate('Stops', { routeID: Route.item.id })}>

          <Card.Content>
            <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold', color: 'white' }} variant="titleLarge">{Route.item.routeName}</Text>
            <Text style={{ fontSize: 18, textAlign: 'right', color: 'white' }} variant="titleLarge">Upcoming Stop</Text>
          </Card.Content>
        </Card>
      );
    }
  }

  //fetching all the routes at start and placing them into a list for rendering, also fetching schoolName
  useEffect(() => {
    const fetchRoutes = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const studentData = await API.graphql(graphqlOperation(getStudent, { id: authUser.attributes.sub }));
      const response = await API.graphql(graphqlOperation(listRoutesBySchoolID, { id: studentData.data.getStudent.verifiedSchoolID }))
      setSchoolName(response.data.getSchool.schoolName);
    };
    fetchRoutes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ ...styles.textStyle, fontSize: 20 }}>DashBoard</Text>
        <Text style={styles.textStyle}>{schoolName}</Text>
      </View>

      <View style={styles.routeList}>
        <Button mode="Text" onPress={() => console.log('Manage Drivers Pressed')}>
          Manage Drivers
        </Button>
        <Button mode="Text" onPress={() => navigation.navigate('RouteManagerView')}>
          Manage Routes
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 8,
    alignItems: 'center',
  },
  routeList: {
    flex: 7,
    padding: 0,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  activeCardTheme: {
    width: Dimensions.get('window').width,
    height: 75,
    borderRadius: 2,
    borderLeftWidth: 4,
    borderColor: '#404040',
    backgroundColor: '#7E0B33'
  },
  inactiveCardTheme: {
    width: Dimensions.get('window').width,
    height: 75,
    borderLeftWidth: 4,
    borderColor: '#404040',
    borderRadius: 2,
    backgroundColor: '#121212'
  },
  textStyle: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
