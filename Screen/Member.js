import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, FlatList, StatusBar } from 'react-native';

import { Container, Content, Header, Form, Input, Item, Button, Left, Right, Body, Icon, Title } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { membershipBenefits } from '../constans/StringsMembership'

const Member = props => {

    return (
        // floating label is so that the label goes up when we click input text email
        <Container style={styles.container}>
            <Header style={styles.header}>
                <Left>
                    <Icon name='menu' style={styles.iconMenu} onPress={props.openDrawer} />
                </Left>
                <Body>
                    <Text style={styles.headerText}>Member</Text>
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
                <View style={styles.containerMember}>
                    <View style={styles.backgroundContainer}>
                        <Image source={require('../Image/profile_bg_default.png')} style={styles.imageBackground} />
                    </View>
                    <View style={styles.profileView}>
                        <Image style={styles.logo} source={require('../Image/profile_default.png')} />
                    </View>
                </View>
                <View style={styles.contentView}>
                    <Text style={styles.membershipText}>Membership</Text>
                    <Text style={styles.premiumText}>Premium</Text>
                    <Text style={styles.HeadingDescription}>All members receive the following membership benefits:​</Text>
                    <Text style={styles.descriptionText}>{membershipBenefits}</Text>
                </View>
            </ScrollView>
        </Container>
    );
}

const win = Dimensions.get('window');
const ratioWidth = win.width / 375;
const heightBg = 257 * ratioWidth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: win.width,
    },
    iconMenu: {
        color: (Platform.OS === 'ios') ? '#147efb' : '#fff'
    }, logOutTextButton: {
        color: (Platform.OS === 'ios') ? '#147efb' : '#fff'
    }, header: {
        marginTop: (Platform.OS === 'ios') ? 0 : StatusBar.currentHeight
    }, headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: (Platform.OS === 'ios') ? '#000' : '#fff',
    }, backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    profileView: {
        // opacity: 0.5,
        // backgroundColor: '#000000'
    },
    logo: {
        marginTop: heightBg / 2.5,
    },
    imageBackground: {
        resizeMode: 'cover',
        height: heightBg,
        width: win.width,
    },
    containerMember: {
        alignItems: 'center',
    },
    contentView: {
        marginVertical: 15,
        width: win.width,
        flexDirection: 'column',
        alignItems: 'center'
    }, membershipText: {
        fontSize: 24,
    }, premiumText: {
        fontSize: 24,
        color: '#01758E',
        fontStyle: 'italic',
        fontWeight:'bold'
    },descriptionText:{
        margin:20
    },HeadingDescription:{
        marginTop:20,
        fontSize:18
    }
});

export default Member;