import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

const Login = props => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const emailStringHandler = (inputString) => {
    setEmail(inputString);
  };

  const passwordStringHandler = (inputString) => {
    setPassword(inputString);
  };

  // control login button
  const loginHandler = async () => {
    setShowLoading(true);
    //firebase login
    await props.firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        (user) => {
          setShowLoading(false);
          props.loginEmailPassword()
        })
      .catch(
        (error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          setShowLoading(false);
          if (errorCode == 'auth/email-already-in-use') {
            alert('Email is already registered, please sign in or sign up different email address.');
          } else {
            alert(errorMessage);
          }
        })
  }


  // control sign up button
  const singUplHandler = () => {
    props.registerHandler;
  }

  return (
    // floating label is so that the label goes up when we click input text email
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logoIcon}
          source={require('./Pictures/AISB_Large.png')}></Image>
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
                onChangeText={passwordStringHandler}
                returnKeyType='go'
                onSubmitEditing={loginHandler}
              />
            </Item>
          </Form>
        </KeyboardAvoidingView>
        {showLoading &&
          <ActivityIndicator size="large" color='#01458E' />
        }
        <Form style={styles.form}>
          <Button style={styles.button}
            transparent
            full
            onPress={props.loginAsGuessHandler}>
            <Text style={styles.textButton}>Login as guest</Text>
          </Button>
          <Button style={styles.button}
            transparent
            full
            onPress={props.registerHandler}>
            <Text style={styles.textButton}>Register</Text>
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
  }, button: {
    width: win.width / 1.2,
    height: 30,
    backgroundColor: 'white'
  }, textButton: {
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
  }, form: {
    paddingBottom: 10,
  }, formStyle: {
    paddingBottom:win.height/40
  }
});

export default Login;