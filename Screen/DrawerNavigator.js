import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import Home from '../Screen/Home';
import Member from '../Screen/Member';

const DrawerNav = props => {

    function HomeScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Home  firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openPDF={props.openPDF} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function MemberScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Member  firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function NotificationsScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button onPress={() => navigation.goBack()} title="Go back home" />
            </View>
        );
    }

    const Drawer = createDrawerNavigator();
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Member" component={MemberScreen} />
                <Drawer.Screen name="Notifications" component={NotificationsScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default DrawerNav;