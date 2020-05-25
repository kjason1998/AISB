import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, Dimensions, StatusBar,View } from 'react-native';

import { Container, Header, Button, Left, Right, Body, Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import { Events2019Update, Events2019About,Events2019Location,Events2019Loebner,Events2018,Events2018All} from '../constans/EventsString'
import { events2018TableData} from '../constans/Data'

const Events = props => {

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
                        console.log(`Event.js Encountered error: ${err}`);
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
                    <Text style={styles.headerText}>Events</Text>
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
                    <Text style={styles.headingOne}>Past Events</Text>
                    <View style={styles.line}/>
                    <Text style={styles.headingOne}>AISB X: Creativity Meets Economy (incorporating the Loebner Prize)</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize,marginTop:15}]}>An exhibition at the Computational Foundry, supported by CHERISH-DE (cherish-de.uk) and AISB (http://aisb.org.uk).</Text>
                    <Text style={styles.headingTwo}>Update:</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{Events2019Update}</Text>
                    
                    <Text style={styles.headingTwo}>About this Event:</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{Events2019About}</Text>

                    <Text style={styles.headingTwo}>Date And Time:</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>Thu, 12 Sep 2019, 10:00 – Sun, 15 Sep 2019, 16:00 BST</Text>

                    <Text style={styles.headingTwo}>Location:</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{Events2019Location}</Text>

                    <Text style={styles.headingThree}>Loebner Prize @ Bletchley Park</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{Events2019Loebner}</Text>

                    <View style={styles.line}/>
                    <Text style={styles.headingOne}>Results of the 2018 Finals</Text>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{Events2018}</Text>

                    <Text style={styles.headingTwo}>2018 Selection Results:</Text>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#147efb'}}>
                        <Row data={['Rank','Name','Score']} style={styles.tableHead} textStyle={styles.text}/>
                        <Rows data={events2018TableData} textStyle={styles.tableText}/>
                    </Table>
                    <Text style={[styles.contentText,{fontSize:mainContentSize}]}>{Events2018All}</Text>
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
        color:'#147efb'
    },headingTwo:{
        fontWeight:'bold',
        fontSize:18,
        color:'black',
        paddingVertical:15
    },headingThree:{
        fontSize:16,
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

export default Events;