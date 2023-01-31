import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { Card, Text, Button, TextInput, Modal, Portal, Provider } from 'react-native-paper';
import { listStopsByRouteID } from '../Screens/MapStopView/queries';
import { Dimensions } from 'react-native';
import { getStop, getStudent } from '../src/graphql/queries';
import { createStop, deleteRoute, deleteStop, updateRoute, updateStop } from '../src/graphql/mutations';
onUpdateRoute
import { onUpdateRoute } from '../src/graphql/subscriptions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FlashList } from '@shopify/flash-list';

const StopManagerView = ({ route, navigation }) => {
    //Stop List
    const [stops, setStops] = useState([]);
    const [schoolName, setSchoolName] = useState("");

    //Retrieving screen Dimensions
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    //New Stop user input
    const [newStopName, setNewStopName] = React.useState("");

    //Updated Route name user input
    const [newRouteName, setNewRouteName] = React.useState("");

    //Bus Location variable
    const [busLocation, setBusLocation] = useState({
        latitude: 37.99825,
        longitude: -122.4324,
    });

    //Param retrieval from prev page
    const { routeID } = route.params;

    //Marker Input variable used for new/updating stop details
    const [markerInput, setMarkerInput] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324
    })

    //Map reference variable
    const mapRef = useRef();

    //Used for Updating priority number
    const [newStopNumber, setNewStopNumber] = React.useState(0);

    //Initial region used before zooming into current stop
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    //Current stop to be edited
    const [curStopID, setCurStopID] = React.useState("");

    //Route Edit Modal
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { alignSelf: 'center', backgroundColor: 'white', height: windowHeight * 0.75, width: windowWidth * 0.75 };

    //Stop Card CRUD Modal
    const [stopCardVisible, setStopCardVisible] = React.useState(false);
    const showStopModal = () => setStopCardVisible(true);
    const hideStopModal = () => setStopCardVisible(false);

    //Create Stop Modal
    const [createModalVisible, setCreateModalVisible] = React.useState(false);
    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => setCreateModalVisible(false);

    //Get specific stopID and open the modal for CRUD
    function funHandleCrudModal(stop) {
        setCurStopID(stop.item.id)
        showStopModal()
    }

    //Stop Card with CRUD Modal
    const StopListItem = ({ Stop }) => {
        return (
            <Card style={styles.activeCardTheme} onPress={() => funHandleCrudModal(Stop)}>
                <Card.Content>
                    <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold', color: 'white' }} variant="titleLarge">{Stop.item.stopName}</Text>
                    <Text style={{ fontSize: 18, textAlign: 'right', color: 'white' }} variant="titleLarge">Upcoming Stop</Text>
                </Card.Content>
            </Card>
        );
    }

    function funCreateStop() {
        const syncStops = async () => {
            //handle if stopName is already taken
            const matches = stops.find(stops => stops.stopName == newStopName);

            if (!matches) {
                const authUser = await Auth.currentAuthenticatedUser();
                const studentData = await API.graphql(graphqlOperation(getStudent, { id: authUser.attributes.sub }));

                //New Stop Data
                const newStop = {
                    _version: studentData.data.getStudent._version,
                    stopName: newStopName,
                    routeID: routeID,
                    latitude: markerInput.latitude,
                    longitude: markerInput.longitude,
                    priorityNumber: newStopNumber,
                };

                const creatingStop = await API.graphql(graphqlOperation(createStop, { input: newStop }));

                //Refetching stops
                const response = await API.graphql(graphqlOperation(listStopsByRouteID, { id: routeID }))

                setStops(response.data.getRoute.Stops.items.filter((item) => !item._deleted));
                stops.sort((a, b) => a.priorityNumber > b.priorityNumber)
                hideCreateModal();
            } else {
                console.log("name already taken!")
            }
        }
        syncStops();
    };

    function funDeleteRoute() {
        const syncDeletion = async () => {
            const response = await API.graphql(graphqlOperation(listStopsByRouteID, { id: routeID }))

            //Route Deletion Data
            const delRoute = {
                _version: response.data.getRoute._version,
                id: routeID,
            };

            //deleteRoute
            const deletingRoute = await API.graphql(graphqlOperation(deleteRoute, { input: delRoute }));
        }
        syncDeletion();
        navigation.goBack();
        navigation.goBack();
    };

    function funDeleteStop() {
        const syncDeletion = async () => {
            const response = await API.graphql(graphqlOperation(getStop, { id: curStopID }))

            //Route Deletion Data
            const delStop = {
                _version: response.data.getStop._version,
                id: curStopID,
            };

            //deleteStop
            const deletingStop = await API.graphql(graphqlOperation(deleteStop, { input: delStop }));
        }
        syncDeletion();
        navigation.goBack();
    };

    function funUpdateRouteName() {
        const syncUpdate = async () => {
            const response = await API.graphql(graphqlOperation(listStopsByRouteID, { id: routeID }))

            //Route Update Data
            const updatedRoute = {
                _version: response.data.getRoute._version,
                id: routeID,
                routeName: newRouteName,
                priorityNumber: newStopNumber,
            };

            //updateRoute
            const updatingRoute = await API.graphql(graphqlOperation(updateRoute, { input: updatedRoute }));
            navigation.goBack();
            navigation.goBack();
        }
        syncUpdate();
    }

    function funUpdateStop() {
        const syncUpdate = async () => {
            const response = await API.graphql(graphqlOperation(getStop, { id: curStopID }))

            //Route Update Data
            const updateStopData = {
                _version: response.data.getStop._version,
                id: curStopID,
                stopName: newRouteName,
                latitude: markerInput.latitude,
                longitude: markerInput.longitude,
            };

            //updateRoute
            const updatingStop = await API.graphql(graphqlOperation(updateStop, { input: updateStopData }));
            navigation.goBack();
        }
        syncUpdate();
    }

    //Fetching all needed variables from DB
    useEffect(() => {
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
            next: ({value}) => {
                setBusLocation({latitude: value.data.onUpdateRoute.busLatitude, longitude: value.data.onUpdateRoute.busLongitude})
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

    return (
        <Provider>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={styles.StopCardTheme}
                            label="Change Route Name"
                            value={newRouteName}
                            onChangeText={newRouteName => setNewRouteName(newRouteName)}
                        />
                        <Button icon="content-save" mode="contained" onPress={() => funUpdateRouteName()}>
                            Save
                        </Button>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Button icon="delete-forever-outline" mode="contained" onPress={() => funDeleteRoute()}>
                            Delete Route
                        </Button>
                    </View>
                </Modal>
            </Portal>

            <Portal>
                <Modal visible={stopCardVisible} onDismiss={hideStopModal} contentContainerStyle={containerStyle}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={styles.StopCardTheme}
                            label="Change Stop Name"
                            value={newRouteName}
                            onChangeText={newRouteName => setNewRouteName(newRouteName)}
                        />
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <GooglePlacesAutocomplete
                            placeholder='Enter Stop Location'
                            fetchDetails={true}
                            GooglePlacesSearchQuery={{ rankby: "distance" }}
                            onPress={(data, details = null) => {
                                // 'details' is provided when fetchDetails = true
                                setMarkerInput({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng
                                })
                            }}
                            query={{
                                key: 'AIzaSyBBuHLlqhGexl6I3RR-HSYew3QJ8SPEL28',
                                language: 'en',
                                components: "country:us",
                                radius: 10000,
                                location: `${markerInput.latitude}, ${markerInput.longitude}`
                            }}
                            styles={{
                                container: { position: "absolute", width: "100%", zIndex: 1 },
                                listView: { backgroundColor: "white" }
                            }}
                        />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={styles.StopCardTheme}
                            label="Stop Order Number"
                            value={newStopNumber}
                            onChangeText={newStopNumber => setNewStopNumber(newStopNumber)}
                        />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Button icon="content-save" mode="contained" onPress={() => funUpdateStop()}>
                            Save
                        </Button>
                        <Button icon="delete-forever-outline" mode="contained" onPress={() => funDeleteStop()}>
                            Delete Stop
                        </Button>
                    </View>
                </Modal>
            </Portal>

            <Portal>
                <Modal visible={createModalVisible} onDismiss={hideCreateModal} contentContainerStyle={containerStyle}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={styles.StopCardTheme}
                            label="New Stop Name"
                            value={newStopName}
                            onChangeText={newStopName => setNewStopName(newStopName)}
                        />
                        <Text>Enter Stop Location</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <GooglePlacesAutocomplete
                            placeholder='Search'
                            fetchDetails={true}
                            GooglePlacesSearchQuery={{ rankby: "distance" }}
                            onPress={(data, details = null) => {
                                setMarkerInput({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng
                                })
                            }}
                            query={{
                                key: 'kek',
                                language: 'en',
                                components: "country:us",
                                radius: 10000,
                                location: `${markerInput.latitude}, ${markerInput.longitude}`
                            }}
                            styles={{
                                container: { position: "absolute", width: "100%", zIndex: 1 },
                                listView: { backgroundColor: "white" }
                            }}
                        />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={styles.StopCardTheme}
                            label="Stop Order Number"
                            value={newStopNumber}
                            onChangeText={newStopNumber => setNewStopNumber(newStopNumber)}
                        />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Button icon="plus" mode="contained" onPress={() => funCreateStop()}>
                            Create Stop
                        </Button>
                    </View>
                </Modal>
            </Portal>

            <View style={{ flex: 1 }}>
                <View style={styles.editRouteName}>
                    <Text style={styles.cardTheme} variant="titleLarge">{schoolName}</Text>
                    <Button styles={{ alignItems: 'flex-end' }} icon="account-edit-outline" mode="contained" onPress={showModal}>
                        Edit Route
                    </Button>
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


                <View style={styles.createStopView}>
                    <Button icon="plus" mode="contained" onPress={() => showCreateModal()}>
                        Create New Stop
                    </Button>
                    <Button icon="plus" mode="contained" onPress={() => calculateDistance()}>
                        calculate dist
                    </Button>
                </View>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    mapView: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createStopView: {
        flex: 2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cardTheme: {
        width: 200,
        alignItems: 'center'
    },
    StopCardTheme: {
        width: 200,
        height: 50,
    },
    editRouteName: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
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
    stopList: {
        flex: 7,
        backgroundColor: '#121212',
        flexDirection: 'column',
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

export default StopManagerView;