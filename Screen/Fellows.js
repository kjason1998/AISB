import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, Dimensions, StatusBar,View } from 'react-native';

import { Container, Header, Button, Left, Right, Body, Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

import {fellowDesc,fellowAISBPatron,fellowAISBFellows} from '../constans/FellowsString'

const Fellow = props => {

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
                        console.log(`Fellows.js Encountered error: ${err}`);
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
                    <Text style={styles.headerText}>Fellows</Text>
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
                    <Text style={styles.headingOne}>Fellows</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{fellowDesc}</Text>
                    
                    <Text style={styles.headingThree}>AISB Patron</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{fellowAISBPatron}</Text>

                    <Text style={styles.headingThree}>AISB Fellows</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{fellowAISBFellows}</Text>

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

export default Fellow;