import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { Card, Text, Button } from 'react-native-paper';
import { listStopsByRouteID } from '../../Screens/MapStopView/queries';
import { onUpdateRoute } from '../../src/graphql/subscriptions';
import { Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { getStudent, getStop } from '../../src/graphql/queries';
import { updateStudent } from '../../src/graphql/mutations';

export default function MapStopView({ route, navigation }) {
  //Stop List
  const [stops, setStops] = useState([]);
  const { studentID } = route.params;

  const [schoolName, setSchoolName] = useState("");

  //Bus Location variable
  const [busLocation, setBusLocation] = useState({
    latitude: 37.99825,
    longitude: -122.4324,
  });

  //Subbed stop ID
  const subbedStop = useRef();

  //Param retrieval from prev page
  const { routeID } = route.params;

  //Map reference variable
  const mapRef = useRef();

  //Initial region used before zooming into current stop
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //CARD DESIGN USING PAPER
  const StopListItem = ({ Stop }) => {
    return (
      <Card style={styles.activeCardTheme}>
        <Card.Content>
          <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold', color: 'white' }} variant="titleLarge">{Stop.item.stopName}</Text>
        </Card.Content>
        <Card.Actions>
          <Button buttonColor='white' mode='text' onPress={() => updateSubID(Stop.item)}>SUB</Button>
          <Button buttonColor='white' mode='text' onPress={() => console.log(calculateDistance())}>CALC DIST</Button>
        </Card.Actions>
      </Card>
    );
  }

  function updateSubID(subbedInput) {
    subbedStop.current = subbedInput;

    API.graphql(graphqlOperation(getStudent, { id: studentID })).then((response) => {
      const updatedStudent = {
        _version: response.data.getStudent._version,
        id: studentID,
        subbedStop: subbedInput.id,
      };
      API.graphql(graphqlOperation(updateStudent, { input: updatedStudent }));
    });
  }

  //Fetching all needed variables from DB
  useEffect(() => {
    API.graphql(graphqlOperation(getStudent, { id: studentID })).then((response) => {
      API.graphql(graphqlOperation(getStop, { id: response.data.getStudent.subbedStop })).then((response2) => {
        subbedStop.current = response2.data.getStop;
      });
    });


    API.graphql(graphqlOperation(listStopsByRouteID, { id: routeID })).then((response) => {
      setStops(response.data.getRoute.Stops.items.filter((item) => !item._deleted).sort((a, b) => a.priorityNumber > b.priorityNumber));
      setSchoolName(response.data.getRoute.routeName)
      setBusLocation({ latitude: response.data.getRoute.busLatitude, longitude: response.data.getRoute.busLongitude })
      setRegion({
        latitude: response.data.getRoute.busLatitude,
        longitude: response.data.getRoute.busLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })

    //subscribe to busLocation
    API.graphql(graphqlOperation(onUpdateRoute)).subscribe({
      next: ({ value }) => {
        setBusLocation({ latitude: value.data.onUpdateRoute.busLatitude, longitude: value.data.onUpdateRoute.busLongitude })
        setRegion({
          latitude: value.data.onUpdateRoute.busLatitude,
          longitude: value.data.onUpdateRoute.busLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error: (err) => console.warn(err)
    })
  }, [])

  function distance(lat1,
    lat2, lon1, lon2) {

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 3956;

    // calculate the result
    return (c * r);
  }

  function calculateDistance() {
    return distance(busLocation.latitude, subbedStop.current.latitude, busLocation.longitude, subbedStop.current.longitude);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.editRouteName}>
        <Text variant="titleLarge">{schoolName}</Text>
      </View>

      <View style={styles.mapView}>
        <MapView
          style={{ height: 300, width: '100%' }}
          ref={mapRef}
          region={region}
        >
          {stops.map((item, index) => (
            <Marker key={index} title={item.stopName} coordinate={{ latitude: item.latitude, longitude: item.longitude }} />
          ))}
          <Marker coordinate={{ latitude: busLocation.latitude, longitude: busLocation.longitude }} />
        </MapView>
      </View>

      <View style={styles.stopList}>
        <FlashList
          data={stops}
          renderItem={(item) => <StopListItem Stop={item} />}
          estimatedItemSize={20}
          alwaysBounceVertical={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  editRouteName: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mapView: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopList: {
    flex: 6,
    backgroundColor: '#121212',
    flexDirection: 'column',
  },
  activeCardTheme: {
    width: Dimensions.get('window').width,
    height: 90,
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
  map: {
    width: '100%',
    height: '100%',
  },
  textStyle: {
    marginBottom: 8,
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
