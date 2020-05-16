import React, { useState } from 'react';
import { StyleSheet, Text, ActivityIndicator, Image, Dimensions, SafeAreaView, Picker, Alert, KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard } from 'react-native';

import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

const Register = props => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pickedMembership, setPickedMembership] = useState([{ membership: "UK/EU 1 year", year: 1 }]);
  const [showLoading, setShowLoading] = useState(false);

  const emailStringHandler = (inputString) => {
    setEmail(inputString);
  };

  const passwordStringHandler = (inputString) => {
    setPassword(inputString);
  };

  const setMembership = (membershipType, index) => {
    if (index % 2 == 0) {// index even -> 1 year
      setPickedMembership({ membership: membershipType, year: 1 })
    } else {
      setPickedMembership({ membership: membershipType, year: 3 })
    }
  };

  // cacthing firestore update that have null value have a bug.
  const addInFirestore = () => {
    user = props.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const docRef = props.firebase.firestore().collection("users").doc(user.uid);
        docRef.set({
          email: email,
          datemembershipstart: new Date().getDate(),
          monthmembershipstart: new Date().getMonth()+1,
          yearmembershipstart: new Date().getFullYear(),
          datemembershipend: new Date().getDate(),
          monthmembershipend: new Date().getMonth()+1,
          settingtextsize:12,
          premium:true,
        })
          .then(() => {
            if (pickedMembership.membership != null) {
              docRef.update({
                membershiptype: pickedMembership.membership,
                yearmembershipend: new Date().getFullYear() + pickedMembership.year,
                membershiplength:pickedMembership.year,
              })
                .then(() => {
                  //props.registerSuccess();
                  setShowLoading(false);
                })
            } else { // if user did not pick any membership - which is the first choice
              docRef.update({
                membershiptype: "UK/EU 1 year",
                yearmembershipend: new Date().getFullYear() + 1,
                membershiplength:1,
              })
                .then(() => {
                  //props.registerSuccess();
                  setShowLoading(false);
                })
            }
          })
          .catch(function (error) {
            setShowLoading(false);
            alert('Register failed ' + error);
            console.error("Error writing document: ", error);
          })
      } else {
        setShowLoading(false);
        console.warn("User not logged in or has just logged out");
      }
    })
  }

  // control sign up button
  const singUplHandler = async () => {
    if (password.length < 8) {
      alert("Please make different password (at least 8 characters)");
      return;
    } else {
      setShowLoading(true);
      await props.firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          addInFirestore();
        })
        .catch((error) => {
          setShowLoading(false);
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/email-already-in-use') {
            alert('Email is already registered, please sign in or sign up different email address.');
          } else {
            console.log('Register.js error whe signing up inside signuphandler: '+errorMessage)
          }
        })
    }
  }

  return (
    // floating label is so that the label goes up when we click input text email
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logoIcon}
          source={require('../Pictures/AISB_Large.png')} />
        <KeyboardAvoidingView
          behavior='padding'>
          <Form
            style={styles.formStyle}>
            <Item style={styles.inputItem}>
              <Input
                style={styles.inputText}
                autoCorrect={false}
                autoCapitalize='none'
                placeholder="Email"
                placeholderTextColor='gray'
                onChangeText={emailStringHandler}
              />
            </Item>
            <Item style={styles.inputItem}>
              <Input
                style={styles.inputText}
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize='none'
                placeholder="Password"
                placeholderTextColor='gray'
                onChangeText={passwordStringHandler}
              />
            </Item>
            <Item style={styles.itemPicker}>
              <Picker
                style={styles.pickerMembership}
                selectedValue={pickedMembership.membership}
                onValueChange={(itemValue, itemIndex) => { setMembership(itemValue, itemIndex) }}>
                <Picker.Item label="UK/EU (1)" value="UK/EU (1)"/>
                <Picker.Item label="UK/EU (3)" value="UK/EU (3)" />
                <Picker.Item label="UK/EU Student/Retired (1)" value="UK/EU Student/Retired (1)" />
                <Picker.Item label="UK/EU Seniors (3)" value="UK/EU Seniors (3)" />
                <Picker.Item label="UK/EU Seniors (1)" value="UK/EU Seniors (1)" />
                <Picker.Item label="UK/EU Non-commercial Institutions (3)" value="UK/EU Non-commercial Institutions (3)" />
                <Picker.Item label="UK/EU Non-commercial Institutions (1)" value="UK/EU Non-commercial Institutions (1)" />
                <Picker.Item label="UK/EU commercial Institutions (3)" value="UK/EU commercial Institutions (3)" />
                <Picker.Item label="Non EU/UK (1)" value="Non EU/UK (1)" />
                <Picker.Item label="Non EU/UK (3)" value="Non EU/UK (3)" />
                <Picker.Item label="Non EU/UK Student/Retired (1)" value="Non EU/UK Student/Retired (1)" />
                <Picker.Item label="Non EU/UK Seniors (3)" value="Non EU/UK Seniors (3)" />
                <Picker.Item label="Non EU/UK Seniors (1)" value="Non EU/UK Seniors (1)" />
                <Picker.Item label="Non EU/UK Non-commercial Institutions (3)" value="Non EU/UK Non-commercial Institutions (3)" />
                <Picker.Item label="Non EU/UK Non-commercial Institutions (1)" value="Non EU/UK Non-commercial Institutions (1)" />
                <Picker.Item label="Non EU/UK commercial Institutions (3)" value="Non EU/UK commercial Institutions (3)" />
              </Picker>
            </Item>
          </Form>
        </KeyboardAvoidingView>
        {showLoading &&
          <ActivityIndicator size="large" color='#01458E' />
        }
        <Form>
          <Button style={styles.buttonSquare}
            transparent
            primary
            onPress={singUplHandler}>
            <Text style={styles.textButton}>Sign Up</Text>
          </Button>
          <Button style={styles.buttonText}
            transparent
            full
            onPress={props.alreadyHaveAccount}>
            <Text style={styles.textButtonUnderline}>Already have an account</Text>
          </Button>
        </Form>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const win = Dimensions.get('window');
const ratioWidth = win.width / 649 / 2;

const styles = StyleSheet.create({
  logoIcon: {
    width: win.width / 2,
    height: 360 * ratioWidth, //362 is actual height of image
    margin: 20,
    marginTop: win.height / 8
  }, container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between', // content center of vertical
    alignItems: 'center', // items in the center of horizontal line
    padding: 10,
  }, buttonText: {
    marginTop:win.height/70,
    width: win.width / 2,
    height: 30,
    backgroundColor: 'transparent'
  },buttonSquare: {
    width: win.width / 2,
    justifyContent:"center"
  }, textButton: {
    color: '#fff',
  }, textButtonUnderline: {
    color: '#01458E',
    textDecorationLine: 'underline'
  }, inputItem: {
    width: win.width / 2,
    marginBottom: 20,
    borderBottomColor: '#01458E',
    borderBottomWidth: 1.5,
  }, inputText: {
    paddingLeft: -5,
    height: 25,
  }, pickerMembership: {
    width: win.width,
  }, itemPicker: {
    borderColor: 'transparent',
  }, formStyle: {
    alignItems:'center'
  }
});

export default Register;