import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Alert } from 'react-native';

import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './constans/ApiKeys';

// let vs const vs var https://dev.to/sandy8111112004/javascript-var-let-const-41he
// == is comparing value === comparing value and type
// useRef is not rendered, and when use/change app doesnt auto render like useState
// useEffect (another react token)  allows to run side effect / allows to run object after render cycle  - look inside GameScreen
import Login from './Screen/Login';
import Register from './Screen/Register'
import PDFViewer from './Components/PDFViewer';
import DrawerNav from './Components/DrawerNavigator'

console.disableYellowBox = true;

firebase.initializeApp(firebaseConfig);

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGuess, setIsGuess] = useState(false);
  const [linkToPDF, setLinkToPDF] = useState('');
  const [titleJournal, setTitleJournal] = useState('');
  const [uuid, setUUID] = useState('');

  const goRegisterPage = () => {
    setIsRegistering(true);
  };

  const loginAsGuess = () => {
    setIsGuess(true);
    setIsRegistering(false);
    setLinkToPDF("");
  };

  const goLoginPage = () => {
    setIsGuess(false);
    setIsRegistering(false);
    cancelViewPDF();
  }

  function loggingInToDrawerNav(){
    loginAsGuess();
    // we will check if membership experie
    // if yes just log in like a guess and send an alert
    var user = firebase.auth().currentUser;

    if (user) {
      let userRef = firebase.firestore().collection('users').doc(user.uid);
      userRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('Trying to get user, but user is not in firestore!');
          } else {
            data = doc.data()
            // get the date of membership end
            // this to check if we will give a warning
            // that membership is about to end (less than a month)
            let yearend = data.yearmembershipend
            let monthend = data.monthmembershipend
            let dateend = data.datemembershipend

            endDate = new Date(yearend, monthend-1, dateend)
            todayDate = new Date()

            diff = monthDiff(todayDate, endDate);

            if(diff<=0){
              if(diff<0){
                userRef.set({premium:false},{merge:true})
                alert('Your membership ended on '+formatDate(endDate)+ ' \nplease renew in membership page')
              }else{
                if(endDate.getDate<todayDate.getDate){
                  alert('Your membership ended on '+formatDate(endDate)+ ' \nplease renew in membership page')
                }
              }
            }
          }
        })
        .catch(err => {
          console.log('Error getting document when logging in,', err);
        });
    } else {
      console.log("user not available");
      // User not logged in or has just logged out.
    }
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        loggingInToDrawerNav();
      }
    });
    
  },[]);

  // this can be called from login and register ( uuid also passed from both page )
  const loginUser = () => {
    let user = firebase.auth().currentUser;
    if(user){
      setUUID(user.uid);
    }
  }

  const logOut = () => {
    let user = firebase.auth().currentUser;
    if(user){
      console.log('logout called in log');
      firebase.auth().signOut().then(function () {
        Alert.alert('Log out successful',"Log out successful user also able to login as a guest")
      }).catch(function (error) {
        alert("Log out user unsuccessful" + error.message)
      });
    } else {
      Alert.alert('Did you know','Making a membership in this mobile app is free and easy!')
      firebase.auth().signOut().then(function () {
        console.log('Firebase logout in guess log out');
      }).catch(function (error) {
        alert("Log out user unsuccessful" + error.message)
      });
    }

    setUUID('');
    goLoginPage();
  }

  const openPDF = (link, title) => {
    setLinkToPDF(link);
    setTitleJournal(title);
  }

  const cancelViewPDF = () => {
    setLinkToPDF("");
    setTitleJournal("");
  }

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

  // initiate the app with login page after splash screen
  let content = <Login firebase={firebase} loginEmailPassword={loginUser} registerHandler={goRegisterPage} loginAsGuessHandler={loginAsGuess}></Login>

  if (!isGuess && !isRegistering) {
    content = <Login firebase={firebase} loginEmailPassword={loginUser} registerHandler={goRegisterPage} loginAsGuessHandler={loginAsGuess}></Login>
  }

  if (isRegistering) {
    content = <Register registerSuccess={loginUser} firebase={firebase} alreadyHaveAccount={goLoginPage}></Register>
  }

  if (isGuess) {
    content = <DrawerNav firebase={firebase} firestore={firebase.firestore()} logOut={logOut} openPDF={openPDF} />
  }

  if (linkToPDF && titleJournal) {
    content = <PDFViewer link={linkToPDF} titleHeader={titleJournal} close={cancelViewPDF} logOut={logOut} />
  }

  return (
    <View style={styles.screen}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
});

