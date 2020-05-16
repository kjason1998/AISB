import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, Dimensions, StatusBar,View } from 'react-native';

import { Container, Header, Button, Left, Right, Body, Icon } from 'native-base';

import { ScrollView } from 'react-native-gesture-handler';
import { aboutAISB, BulletPointsAboutAISB} from '../constans/Strings'

const AISB = props => {

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
                        console.log(`AISB.js Encountered error: ${err}`);
                        });
                }
            }
        });
        //alert("change text size " + mainContentSize)
    }, [mainContentSize]);

    return (
        // floating label is so that the label goes up when we click input text email
        <Container style={styles.container}>
            <Header style={styles.header}>
                <Left>
                    <Icon name='menu' style={styles.iconMenu} onPress={props.openDrawer}/>
                </Left>
                <Body>
                    <Text style={styles.headerText}>AISB</Text>
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
                    <Text style={styles.headingOne}>Who are we?</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{aboutAISB}</Text>
                    <Text style={styles.contentTextBlack}>{BulletPointsAboutAISB}</Text>
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
        //marginTop: (Platform.OS === 'ios') ? 0 : StatusBar.currentHeight
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
        color:'#147efb'
    },contentText:{
        fontSize:12,
        color:'gray',
    },contentTextBlack:{
        fontSize:12,
        fontWeight:'900',
    }
});

export default AISB;