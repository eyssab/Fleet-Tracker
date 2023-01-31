import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { Button } from 'react-native-paper';
import { getRoute, getStudent } from '../src/graphql/queries';
import { updateRoute } from '../src/graphql/mutations';
import * as Location from 'expo-location';

const DriverView = ({ route, navigation }) => {
    const [loc, setLoc] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [recievedLocation, setRecievedLocation] = useState(false);
    const [busLocation, setBusLocation] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324
    })

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLoc(location);
            setRecievedLocation(true);
        })();


    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (loc) {
        text = JSON.stringify(loc);
    }

    if (recievedLocation) {
        setBusLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
        setRecievedLocation(false);
    }

    //Fetch driver location and update route variables(isActive, busLatitude, busLongitude)
    function funUpdateDriverLocation() {
        const syncUpdate = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            const studentData = await API.graphql(graphqlOperation(getStudent, { id: authUser.attributes.sub }));
            const response = await API.graphql(graphqlOperation(getRoute, { id: studentData.data.getStudent.driverRouteID }));

            //Route Update Data
            const updatedRoute = {
                _version: response.data.getRoute._version,
                id: studentData.data.getStudent.driverRouteID,
                busLatitude: busLocation.latitude,
                busLongitude: busLocation.longitude,
            };
            const updatingRoute = await API.graphql(graphqlOperation(updateRoute, { input: updatedRoute }));
        }
        syncUpdate();
    }

    return (
        <View style={{ flex: 1 }}>
            <Button style={styles.textStyle} onPress={() => funUpdateDriverLocation()}>
                Update Bus Location
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        marginBottom: 8,
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DriverView;