import React, { useState,useEffect } from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import Convention from '../Screen/Convention';
import Home from '../Screen/Home';
import Member from '../Screen/Member';
import AISB from '../Screen/AISB';
import Setting from '../Screen/Setting';
import Committee from '../Screen/Committee';
import Events from '../Screen/Events';
import Workshop from '../Screen/Workshop';
import Travel from '../Screen/Travel';
import Fellows from '../Screen/Fellows';

const DrawerNav = props => {
    const [userOnline, setUserOnline] = useState(null);
    const [userPremium,setUserPremium] = useState(false);

    function ConventionScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Convention  firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openPDF={props.openPDF} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function WorkshopScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Workshop  firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openPDF={props.openPDF} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function FellowsScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Fellows  firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openPDF={props.openPDF} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function TravelScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Travel  firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openPDF={props.openPDF} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

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
                <Member firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function AISBScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <AISB firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function EventsScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Events firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function CommitteeScreen({ navigation }) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Committee firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    function SettingScreen({ navigation }) {
        // <Button onPress={() => navigation.goBack()} title="Go back home" />
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Setting firebase={props.firebase} firestore={props.firestore} logOut={props.logOut} openDrawer={navigation.openDrawer}/>
            </View>
        );
    }

    const Drawer = createDrawerNavigator();

    useEffect (() => {
        let user = props.firebase.auth().currentUser;
        if(user){
            let doc = props.firestore.collection('users').doc(user.uid);

            doc.onSnapshot(docSnapshot => {
                console.log(`Received doc snapshot in DrawerNav listener: ${docSnapshot}`);
                setUserPremium(docSnapshot.data().premium)
            }, err => {
                console.log(`Encountered error: ${err}`);
        });
        }
    },[userPremium])

    useEffect (() =>{
        if(props.firebase){
            props.firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    setUserOnline(user)
                    let userRef = props.firestore.collection('users').doc(user.uid);
                    userRef.get()
                        .then(doc => {
                            if (!doc.exists) {
                                console.log('DrawerNavigator.js, No user with user that id');
                            } else {
                                setUserPremium(doc.data().premium)
                            }
                        })
                        .catch(err => {
                            console.log('DrawerNavigator.js, Error getting document', err);
                        });
                }else{
                    setUserOnline(null)
                }
            });
        }else{
            setUserOnline(null)
        }
    },[userOnline])

    if(userOnline && userPremium){
        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Home">
            
                    <Drawer.Screen name="Convention" component={ConventionScreen} />

                    <Drawer.Screen name="Workshop" component={WorkshopScreen} />

                    <Drawer.Screen name="Fellows" component={FellowsScreen} />

                    <Drawer.Screen name="Committee" component={CommitteeScreen} />

                    <Drawer.Screen name="Travel Awards" component={TravelScreen} />
                    
                    <Drawer.Screen name="Events" component={EventsScreen} />

                    <Drawer.Screen name="Home" component={HomeScreen} />
    
                    <Drawer.Screen name="Member" component={MemberScreen} />
    
                    <Drawer.Screen name="AISB" component={AISBScreen} />
                    
                    <Drawer.Screen name="Setting" component={SettingScreen} />
                </Drawer.Navigator>
            </NavigationContainer>
        );
    }else{
        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Home">
                    <Drawer.Screen name="Convention" component={ConventionScreen} />

                    <Drawer.Screen name="Workshop" component={WorkshopScreen} />

                    <Drawer.Screen name="Fellows" component={FellowsScreen} />

                    <Drawer.Screen name="Committee" component={CommitteeScreen} />

                    <Drawer.Screen name="Travel Awards" component={TravelScreen} />

                    <Drawer.Screen name="Events" component={EventsScreen} />

                    <Drawer.Screen name="Home" component={HomeScreen} />
    
                    <Drawer.Screen name="Member" component={MemberScreen} />
    
                    <Drawer.Screen name="AISB" component={AISBScreen} />
    
                </Drawer.Navigator>
            </NavigationContainer>
        );
    }
}

export default DrawerNav;