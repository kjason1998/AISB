import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import { Container, Header, Button, Left, Right, Body, Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { aboutAISB } from '../constans/Strings'

const Setting = props => {

    const [mainContentSize, setMainContentSize] = useState(14)

    useEffect(() => {
        props.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if(user.uid){
                    let userRef = props.firestore.collection('users').doc(user.uid);
                    userRef.onSnapshot(docSnapshot => {
                        let data = docSnapshot.data()
    
                        setMainContentSize(data.settingtextsize)
                        }, err => {
                        console.log(`Encountered error: ${err}`);
                        });
                }
            }
        });
    }, [mainContentSize]);

    const textSizeSmallHandler = () => {
        props.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if(user.uid){
                    let userRef = props.firestore.collection('users').doc(user.uid);
                    
                    userRef.set({settingtextsize: 8}, {merge: true});
                }
            }
        });
    }

    const textSizeMediumHandler = () => {
        props.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if(user.uid){
                    let userRef = props.firestore.collection('users').doc(user.uid);
                    
                    userRef.set({settingtextsize: 12}, {merge: true});
                }
            }
        });
    }

    const textSizeLargeHandler = () => {
        props.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if(user.uid){
                    let userRef = props.firestore.collection('users').doc(user.uid);
                    
                    userRef.set({settingtextsize: 16}, {merge: true});
                }
            }
        });
    }
    
    return (
        // floating label is so that the label goes up when we click input text email
        <Container style={styles.container}>
            <Header style={styles.header}>
                <Left>
                    <Icon name='menu' style={styles.iconMenu} onPress={props.openDrawer} />
                </Left>
                <Body>
                    <Text style={styles.headerText}>Setting</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Button transparent>
                            <Text style={styles.logOutTextButton} onPress={props.logOut}>Log out</Text>
                        </Button>
                    </Button>
                </Right>
            </Header>
            <ScrollView>
                <View style={styles.settingContentContainer}>
                    <Button bordered style={styles.buttonSize}
                        onPress={textSizeSmallHandler}>
                        <Text style={[styles.buttonSizeText,{fontSize:8}]}>A</Text>
                    </Button>
                    <Button bordered style={styles.buttonSize}
                        onPress={textSizeMediumHandler}>
                        <Text style={[styles.buttonSizeText,{fontSize:12}]}>A</Text>
                    </Button>
                    <Button bordered style={styles.buttonSize}
                        onPress={textSizeLargeHandler}>
                        <Text style={[styles.buttonSizeText,{fontSize:16}]}>A</Text>
                    </Button>
                </View>
                <Text style={[styles.headingOne,{fontSize:mainContentSize}]}>{aboutAISB}</Text>
            </ScrollView>
        </Container>
    );
}

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: win.width,
    }, iconMenu: {
        color: (Platform.OS === 'ios') ? '#147efb' : '#fff'
    }, logOutTextButton: {
        color: (Platform.OS === 'ios') ? '#147efb' : '#fff'
    }, header: {
        //marginTop: (Platform.OS === 'ios') ? 0 : StatusBar.currentHeight
    }, headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: (Platform.OS === 'ios') ? '#000' : '#fff',
    }, headingOne:{
        fontSize:30,
        textAlign:'center',
        paddingHorizontal:15,
    },settingContentContainer: {
        flexDirection:'row',
        justifyContent:'center',
        marginTop:15,
    }, buttonSize:{
        width:win.width/10,
        justifyContent:'center',
        marginHorizontal:10,
    }, buttonSizeText:{
        color:'#147efb'
    }
});

export default Setting;