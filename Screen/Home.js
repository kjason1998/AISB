import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, Dimensions, FlatList, StatusBar } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Left, Right, Body, Icon, Title } from 'native-base';

import InfiniteScroll from '../Components/InfiniteScroll'
import InfiniteScrollJournals from '../Components/InfiniteScrollJournals'

const Home = props => {

    return (
        // floating label is so that the label goes up when we click input text email
        <Container style={styles.container}>
            <Header style={styles.header}>
                <Left>
                    <Icon name='menu' style={styles.iconMenu} onPress={props.openDrawer}/>
                </Left>
                <Body>
                    <Text style={styles.headerText}>Journals</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Button transparent>
                            <Text style={styles.logOutTextButton} onPress={props.logOut}>Log out</Text>
                        </Button>
                    </Button>
                </Right>
            </Header>
            <InfiniteScrollJournals firebase={props.firebase} database={props.firestore} openPDFFromScroll={props.openPDF}/>
        </Container>
    );
}

const win = Dimensions.get('window');
const ratioWidth = win.width / 649 / 2;

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:win.width,
    },
    iconMenu:{
        color:(Platform.OS === 'ios') ? '#147efb' : '#fff'
    },logOutTextButton:{
        color:(Platform.OS === 'ios') ? '#147efb' : '#fff'
    },header:{
        marginTop: StatusBar.currentHeight
    },headerText:{
        fontWeight:'bold',
        fontSize:18,
        color: (Platform.OS === 'ios') ? '#000' : '#fff',
    }
});

export default Home;