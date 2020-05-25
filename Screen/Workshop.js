import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, Dimensions, StatusBar,View } from 'react-native';

import { Container, Header, Button, Left, Right, Body, Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

import {workshopDescription,workshopvii,workshopvi,workshopv,workshopiv,workshopiii,workshopii,workshopi } from '../constans/WorkshopStrings'

const Workshop = props => {

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
                        console.log(`Workshop.js Encountered error: ${err}`);
                        });
                }
            }
        });
    }, [mainContentSize]);

    return (
        // floating label is so that the label goes up when we click input text email
        <Container style={styles.container}>
            <Header style={styles.header}>
                <Left>
                    <Icon name='menu' style={styles.iconMenu} onPress={props.openDrawer}/>
                </Left>
                <Body>
                    <Text style={styles.headerText}>Workshop</Text>
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
                <View style={styles.contentView}>
                    <Text style={styles.headingOne}>Members Workshops</Text>
                    <Text style={styles.headingItalic}>If you are interested in hosting one of these events, you will find information on what you will need to do on this page.</Text>
                    <View style={styles.line}/>
                    <Text style={styles.headingOne}>AISB X: Creativity Meets Economy (incorporating the Loebner Prize)</Text>
                    
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{workshopDescription}</Text>


                    <Text style={styles.headingOne}>Past Workshops</Text>
                    <View style={styles.line}/>

                    <Text style={styles.headingOne}>Workshop VII: Serendipity Symposium</Text>
                    <Text style={styles.headingThree}>15 June 2017</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{workshopvii}</Text>


                    <Text style={styles.headingOne}>Workshop VI: Agent-Based Models of Bounded Rationality</Text>
                    <Text style={styles.headingThree}>7-8 May 2015</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{workshopvi}</Text>


                    <Text style={styles.headingOne}>Workshop V: Figurative language: its patterns and meanings in domain-specific discourse</Text>
                    <Text style={styles.headingThree}>18-19 August 2014</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{workshopv}</Text>


                    <Text style={styles.headingOne}>Workshop IV: Modelling Organisational Behaviour and Social Agency</Text>
                    <Text style={styles.headingThree}>27-28 January 2014</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{workshopiv}</Text>


                    <Text style={styles.headingOne}>Workshop III: The Emergence Of Consciousness</Text>
                    <Text style={styles.headingThree}>9 May 2013</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{workshopiii}</Text>


                    <Text style={styles.headingOne}>Workshop II: Distributed Thinking Symposium V</Text>
                    <Text style={styles.headingThree}>30-31 of January 2013</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{workshopii}</Text>


                    <Text style={styles.headingOne}>Workshop I: Sensorimotor Theory Workshop</Text>
                    <Text style={styles.headingThree}>26 September 2012</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{workshopi}</Text>


                </View>
            </ScrollView>
        </Container>
    );
}

const win = Dimensions.get('window');
const ratioWidth = win.width / 649 / 2;

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:win.width,
    },iconMenu:{
        color:(Platform.OS === 'ios') ? '#147efb' : '#fff'
    },logOutTextButton:{
        color:(Platform.OS === 'ios') ? '#147efb' : '#fff'
    },header:{
        marginTop: (Platform.OS === 'ios') ? 0 : StatusBar.currentHeight
    },headerText:{
        fontWeight:'bold',
        fontSize:18,
        color: (Platform.OS === 'ios') ? '#000' : '#fff',
    },contentView:{
        padding:15,
        width: win.width,
        flexDirection: 'column',
    },headingOne:{
        fontWeight:'bold',
        fontSize:24,
        color:'#147efb',
    },headingTwo:{
        fontWeight:'bold',
        fontSize:18,
        color:'black',
        paddingVertical:15
    },headingThree:{
        fontSize:16,
        color:'black',
        paddingVertical:15
    },headingItalic:{
        fontSize:16,
        fontStyle:'italic',
        fontWeight:'400',
        color:'black',
        paddingVertical:15
    },contentText:{
        fontSize:12,
        color:'gray',
        paddingBottom:30,
    },contentTextBlack:{
        fontSize:12,
        fontWeight:'900',
    }, line : {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical:15,
    }, tableHead: {
        height: 40, 
        backgroundColor: '#f1f8ff'
    }, tableText: {
        margin: 6 
    },
});

export default Workshop;