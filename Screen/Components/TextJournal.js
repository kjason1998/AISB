import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Linking } from 'react-native';

const TextJournal = props => {
    return (
        <Text style={styles.text}
            onPress={props.openPDFViewer}>
            {props.journalTitle}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        alignItems: 'center',
        color: 'black',
        textDecorationLine: 'underline',
        fontSize: 15
    },
});

export default TextJournal;

{/* <Text style={styles.text}
            onPress={() => Linking.openURL(props.journalLink)}>
            {props.journalTitle}
        </Text> */}