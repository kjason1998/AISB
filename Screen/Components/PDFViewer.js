import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions,StatusBar } from 'react-native';
import { Header, Left, Right, Icon, Button, Body, Title } from 'native-base';
import PDFReader from 'rn-pdf-reader-js';


const PDFViewer = props => {
    const path = props.link;
    return (
        <View style={styles.container}>
            <StatusBar></StatusBar>
            <Header style={styles.header}>
                <Left>
                    <Icon name='arrow-back' onPress={props.close} style={styles.iconMenu} />
                </Left>
                <Body>
                    <Text style={styles.headerText}>{props.titleHeader}</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Button transparent>
                            <Text style={styles.logOutTextButton} onPress={props.logOut}>Log out</Text>
                        </Button>
                    </Button>
                </Right>
            </Header>
            <PDFReader
                source={{
                    uri: path,
                }}/>
            <Text>{props.link}</Text>
        </View >
    );
}

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, iconMenu: {
        color: (Platform.OS === 'ios') ? '#147efb' : '#fff',
    }, logOutTextButton: {
        color: (Platform.OS === 'ios') ? '#147efb' : '#fff',
    }, header: {
        marginTop: (Platform.OS === 'ios') ? 0 : StatusBar.currentHeight
    },headerText:{
        fontWeight:'bold',
        fontSize:18,
        color: (Platform.OS === 'ios') ? '#000' : '#fff',
    }
});

export default PDFViewer;

