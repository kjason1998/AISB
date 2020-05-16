import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, StatusBar, Alert } from 'react-native';

import { Container, Header, Button, Left, Right, Body, Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { membershipBenefits } from '../constans/Strings'

const Member = props => {

    const [uuid, setUUID] = useState('');
    const [typeLogin, setTypeLogin] = useState('Guest');
    const [monthDifference, setMonthDifference] = useState('empty')
    const [user,setUser] = useState(null)
    const [userDocRef,setUserDocRef] = useState(null)
    
    const [userDatabaseRef,setUserDatabaseRef] = useState(null)

    const [mainContentSize, setMainContentSize] = useState(14)

    const [dateEnd,setDateEnd] = useState();
    const [warning,setWarning] = useState(null)
    
    const createTwoButtonAlert = () =>
        Alert.alert(
            "Renew membership",
            "Renewing will subscribe with the same membership as initially subscribed",
            [
            {text: "Cancel",onPress: () => 
                console.log("Member.js alert user press cancel"),
                style: "cancel"},
            { text: "OK", onPress: () =>
            userDocRef.set({
                datemembershipend: new Date().getDate(),
                monthmembershipend: new Date().getMonth()+1,
                yearmembershipend: new Date().getFullYear() + userDatabaseRef.membershiplength,
                premium:true,
            },{merge:true})
            }],
            { cancelable: false }
    );

    //calculate difference in month
    function monthDiff(from, till) {
        var diff;
        diff = (till.getFullYear() - from.getFullYear()) * 12;
        diff -= from.getMonth()+1;
        diff += till.getMonth();
        return diff;
    }

    // make a date into string dd-mm-yyyy
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
    }

    useEffect(() => {
        props.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                if(user.uid){
                    let userRef = props.firestore.collection('users').doc(user.uid);
                    userRef.onSnapshot(docSnapshot => {
                        let data = docSnapshot.data()
    
                        setMainContentSize(data.settingtextsize)
                        }, err => {
                        console.log(`Committee.js Encountered error: ${err}`);
                        });
                }
            }
        });
    }, [mainContentSize]);

    useEffect(() => {
        if(monthDifference < 2){
            if(monthDifference < 0){
                setWarning('Membership expired on '+formatDate(dateEnd)+'\nClick to renew')
            }
            else{
                if(dateEnd){
                    setWarning('Membership expiring on '+formatDate(dateEnd)+'\nClick to renew')
                }
            }
        }else{
            setWarning('')
        }
    }, [monthDifference,dateEnd]);

    useEffect(() => {
        var user = props.firebase.auth().currentUser;
        if (user) {
            setUser(user)
            setTypeLogin('Premium')
            setUUID(user.uid);
            setTypeLogin('Premium')
            
            if(user.uid){
                let userRef = props.firestore.collection('users').doc(user.uid);
                setUserDocRef(userRef)
                userRef.onSnapshot(docSnapshot => {
                    let data = docSnapshot.data()
                    setUserDatabaseRef(data)
                    setMainContentSize(data.settingtextsize)

                    // get the date of membership end
                    // this to check if we will give a warning
                    // that membership is about to end (less than a month)
                    let yearend = data.yearmembershipend
                    let monthend = data.monthmembershipend
                    let dateend = data.datemembershipend

                    diff = monthDiff(
                        new Date(), // current date
                        new Date(yearend, monthend, dateend)  // end
                    );

                    setMonthDifference(diff)
                    setDateEnd(new Date(yearend, monthend-1, dateend))
                    }, err => {
                    console.log(`Member.js Encountered error: ${err}`);
                    });
            }
        }
    }, [uuid,typeLogin,mainContentSize]);
        

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
                    <Text style={styles.premiumText}>{typeLogin}</Text>
                    <Text style={styles.warningText}
                        onPress={createTwoButtonAlert}>{warning}</Text>
                    <Text style={styles.HeadingDescription}>All members receive the following membership benefits:​</Text>
                    <Text style={[styles.descriptionText,{fontSize:mainContentSize}]}>{membershipBenefits}</Text>
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
    }, backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }, profileView: {
        // opacity: 0.5,
        // backgroundColor: '#000000'
    }, logo: {
        marginTop: heightBg / 2.5,
    }, imageBackground: {
        resizeMode: 'cover',
        height: heightBg,
        width: win.width,
    }, containerMember: {
        alignItems: 'center',
    }, contentView: {
        padding: 15,
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
    }, HeadingDescription:{
        marginTop:20,
        fontSize:18
    }, descriptionText:{
        //fontSize:mainContentSize,
        color:'grey',
        marginTop:15
    }, warningText:{
        fontStyle:1,
        color:'red',
        fontStyle:'italic',
        textAlign: 'center',
    }
});

export default Member;