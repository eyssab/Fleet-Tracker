import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import { listRoutesBySchoolID } from '../Screens/RouteView/queries';
import { getStudent } from '../src/graphql/queries';
import { createRoute } from '../src/graphql/mutations';
import { Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';

export default function RouteManagerView({ navigation }) {
    //Add all routes into list
    const [routes, setRoutes] = useState([]);
    const [schoolName, setSchoolName] = useState("");

    //New Route user input
    const [newRouteName, setNewRouteName] = React.useState("");

    //CARD DESIGN USING PAPER
    const RouteListItem = ({ Route }) => {
        if (Route.item.isActive) {
            return (
                <Card style={styles.activeCardTheme} onPress={() => navigation.navigate('StopManagerView', { routeID: Route.item.id })}>
                    <Card.Content>
                        <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold', color: 'white' }} variant="titleLarge">{Route.item.routeName}</Text>
                        <Text style={{ fontSize: 18, textAlign: 'right', color: 'white' }} variant="titleLarge">Upcoming Stop</Text>
                    </Card.Content>
                </Card>
            );
        } else {
            return (
                <Card style={styles.inactiveCardTheme} onPress={() => navigation.navigate('StopManagerView', { routeID: Route.item.id })}>

                    <Card.Content>
                        <Text style={{ fontSize: 20, textAlign: 'left', fontWeight: 'bold', color: 'white' }} variant="titleLarge">{Route.item.routeName}</Text>
                        <Text style={{ fontSize: 18, textAlign: 'right', color: 'white' }} variant="titleLarge">Upcoming Stop</Text>
                    </Card.Content>
                </Card>
            );
        }
    }

    //Async function for creating new route
    function funCreateRoute() {
        const syncRoutes = async () => {
            //handle if routeName is already taken
            const matches = routes.find(routes => routes.routeName == newRouteName);

            if (!matches) {
                const authUser = await Auth.currentAuthenticatedUser();
                const studentData = await API.graphql(graphqlOperation(getStudent, { id: authUser.attributes.sub }));

                //New Route Data
                const newRoute = {
                    _version: studentData.data.getStudent._version,
                    routeName: newRouteName,
                    schoolID: studentData.data.getStudent.verifiedSchoolID,
                    isActive: true,
                };

                const creatingRoute = await API.graphql(graphqlOperation(createRoute, { input: newRoute }));

                //Refetching routes
                const response = await API.graphql(graphqlOperation(listRoutesBySchoolID, { id: studentData.data.getStudent.verifiedSchoolID }))
                setRoutes(response.data.getSchool.Routes.items.filter((item) => !item._deleted));
            } else {
                console.log("name already taken!")
            }
        }
        syncRoutes();
    };

    //fetching all the routes at start and placing them into a list for rendering, also fetching schoolName
    useEffect(() => {
        const fetchRoutes = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            const studentData = await API.graphql(graphqlOperation(getStudent, { id: authUser.attributes.sub }));
            const response = await API.graphql(graphqlOperation(listRoutesBySchoolID, { id: studentData.data.getStudent.verifiedSchoolID }))
            setSchoolName(response.data.getSchool.schoolName);
            setRoutes(response.data.getSchool.Routes.items.filter((item) => !item._deleted));
        };
        fetchRoutes();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={{ ...styles.textStyle, fontSize: 20 }}>Route Manager</Text>
                <Text style={{ ...styles.textStyle, fontSize: 25 }}>{schoolName}</Text>
            </View>

            <View style={styles.routeList}>
                <FlashList
                    data={routes}
                    renderItem={(item) => <RouteListItem Route={item} />}
                    estimatedItemSize={20}
                    alwaysBounceVertical={false}
                />
            </View>

            <View style={styles.createRouteView}>
                <TextInput
                    style={styles.cardTheme}
                    label="New Route Name"
                    value={newRouteName}
                    onChangeText={newRouteName => setNewRouteName(newRouteName)}
                />
                <Button icon="plus" mode="contained" onPress={() => funCreateRoute()}>
                    add
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
    cardTheme: {
        width: 250,
        height: 50,
    },
    createRouteView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
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
