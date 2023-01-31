import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { Card, Text } from 'react-native-paper';
import { listRoutesBySchoolID } from '../../Screens/RouteView/queries';
import { getStudent } from '../../src/graphql/queries';
import { Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';

export default function RouteView({ navigation }) {
  //Add all routes into list
  const [routes, setRoutes] = useState([]);
  const [schoolName, setSchoolName] = useState("");
  const [studentID, setStudentID] = useState();

  //CARD DESIGN USING PAPER
  const RouteListItem = ({ Route }) => {
    if (Route.item.isActive) {
      return (
        <Card style={styles.activeCardTheme} onPress={() => navigation.navigate('Stops', { routeID: Route.item.id, studentID: studentID })}>

          <Card.Content>
            <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold', color: 'white' }} variant="titleLarge">{Route.item.routeName}</Text>
            <Text style={{ fontSize: 18, textAlign: 'right', color: 'white' }} variant="titleLarge">Upcoming Stop</Text>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card style={styles.inactiveCardTheme} onPress={() => navigation.navigate('Stops', { routeID: Route.item.id, studentID: studentID  })}>

          <Card.Content>
            <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold', color: 'white' }} variant="titleLarge">{Route.item.routeName}</Text>
            <Text style={{ fontSize: 18, textAlign: 'right', color: 'white' }} variant="titleLarge">Upcoming Stop</Text>
          </Card.Content>
        </Card>
      );
    }
  }

  function fetchStudID() {
    const fetchRoutes = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setStudentID( authUser.attributes.sub );
    };
    fetchRoutes();
  }

  //fetching all the routes at start and placing them into a list for rendering, also fetching schoolName
  useEffect(() => {
    const fetchRoutes = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const studentData = await API.graphql(graphqlOperation(getStudent, { id: authUser.attributes.sub }));
      const response = await API.graphql(graphqlOperation(listRoutesBySchoolID, { id: studentData.data.getStudent.verifiedSchoolID }))
      setSchoolName(response.data.getSchool.schoolName);
      setRoutes(response.data.getSchool.Routes.items.filter((item) => !item._deleted));
      setStudentID( authUser.attributes.sub );
    };
    fetchRoutes();
    fetchStudID();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ ...styles.textStyle, fontSize: 20 }}>ROUTES</Text>
        <Text style={styles.textStyle}>{schoolName}</Text>
      </View>

      <View style={styles.routeList}>
        <FlashList
          data={routes}
          renderItem={(item) => <RouteListItem Route={item} />}
          estimatedItemSize={20}
          alwaysBounceVertical={false}
        />
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
    backgroundColor: '#121212',
    flexDirection: 'column',
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
