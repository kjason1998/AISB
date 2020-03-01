import React, { useState } from 'react';
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
import PDFViewer from './Screen/Components/PDFViewer';
import DrawerNav from './Screen/DrawerNavigator'

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

  // this can be called from login and register ( uuid also passed from both page )
  const loginUser = () => {
    loginAsGuess();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUUID(user.uid);
      } else {
        console.log("user not available");
        // User not logged in or has just logged out.
      }
    });
  }

  const logOut = () => {
    console.log('logout called in log');
    if (uuid) {
      console.log('logout called in log');
      firebase.auth().signOut().then(function () {
        alert("Log out successful")
      }).catch(function (error) {
        alert("Log out user unsuccessful" + error.message)
      });
    } else {
      alert('Guess log out from logOut in app')
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

