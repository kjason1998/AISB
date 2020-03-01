import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import TextJournal from './TextJournal';

// Screen Dimensions
const { height, width } = Dimensions.get('window');

// Screen: Infinite Scroll - lazy loading
export default class InfiniteScroll extends React.Component {
    // Constructor
    constructor(props) {
        super(props);

        this.state = {
            documentData: [],
            limit: 9,
            lastVisible: null,
            loading: false,
            refreshing: false,
            uuid: '',
        };
    }
    
    // Component Did Mount - invoked immediately after a component is mounted (this is a good place to instantiate the network request)
    componentDidMount = () => {
        try {
            // Cloud Firestore: Initial Query
            this.retrieveData();
            this.props.firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    console.log('infiniteScroll check if user is online' + user.uid)
                    this.setState({
                        uuid: user.uid.String,
                    });
                }
             });
             console.log('infiniteScroll UUID:'+this.uuid)
        }
        catch (error) {
            console.log(error);
        }
    };

    // Retrieve Data
    retrieveData = async () => {
        try {
            // Set State: Loading
            this.setState({
                loading: true,
            });
            console.log('infiniteScroll : Retrieving Data');
            // Cloud Firestore: Query
            let initialQuery = await this.props.database.collection('journals')
                .orderBy('title')
                .limit(this.state.limit)
            // Cloud Firestore: Query Snapshot
            let documentSnapshots = await initialQuery.get();
            // Cloud Firestore: Document Data
            let documentData = documentSnapshots.docs.map(document => document.data());
            // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
            let lastVisible = documentData[documentData.length - 1].id;
            // Set State
            this.setState({
                documentData: documentData,
                lastVisible: lastVisible,
                loading: false,
            });
        }
        catch (error) {
            console.log(error);
        }
    };

    // Retrieve More
    retrieveMore = async () => {
        try {
            // Set State: Refreshing
            this.setState({
                refreshing: true,
            });
            console.log('infiniteScroll : Retrieving additional Data');
            // Cloud Firestore: Query (Additional Query)
            let additionalQuery = await this.props.database.collection('journals')
                .startAfter(this.state.lastVisible)
                .orderBy('title')
                .limit(this.state.limit)
            // Cloud Firestore: Query Snapshot
            let documentSnapshots = await additionalQuery.get();
            // Cloud Firestore: Document Data
            let documentData = documentSnapshots.docs.map(document => document.data());
            // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
            let lastVisible = documentData[documentData.length - 1].id;
            // Set State
            this.setState({
                documentData: [...this.state.documentData, ...documentData],
                lastVisible: lastVisible,
                refreshing: false,
            });
        }
        catch (error) {
            console.log(error);
        }
    };

    // Render Header of all the list - currently not used
    renderHeader = () => {
        try {
            return (
                <Text style={styles.headerText}>AISB QUATERLY</Text>
            )
        }
        catch (error) {
            console.log(error);
        }
    };
    
    // Render Footer
    renderFooter = () => {
        try {
            // Check If Loading
            if (this.state.loading) {
                return (
                    <ActivityIndicator />
                )
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    // Data
                    data={(this.state.documentData)}
                    // Render Items
                    renderItem={({ item }) => (
                        item.header === true ?
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>
                                {item.title}
                            </Text>
                        </View> 
                        :
                        item.premium == false ?
                        <View style={styles.itemContainer}>
                            <Text style={styles.textJournal}
                                onPress={() => this.props.openPDFFromScroll(item.link,item.title)}>
                                {item.title}
                            </Text>
                        </View> 
                        :
                        this.state.uuid === '' ?
                        <View></View>
                        :
                        <View style={styles.itemContainer}>
                            <Text style={styles.textJournal}
                                onPress={() => this.props.openPDFFromScroll(item.link,item.title)}>
                                {item.title}
                            </Text>
                        </View> 
                    )}
                    // Item Key
                    keyExtractor={(item, index) => String(index)}
                    // Header (Title)
                    //ListHeaderComponent={this.renderHeader}
                    // Footer (Activity Indicator)
                    ListFooterComponent={this.renderFooter}
                    // On End Reached (Takes a function)
                    onEndReached={this.retrieveMore}
                    // How Close To The End Of List Until Next Data Request Is Made
                    onEndReachedThreshold={0}
                    // Refreshing (Set To True When End Reached)
                    refreshing={this.state.refreshing}
                />
            </SafeAreaView>
        );
    }
}
// Styles
const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'gray',
        margin: 12,
        textAlign: 'center'
    },
    headerContainer: {
        width: width,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        height: 18,
        width: width,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
    },textJournal: {
        alignItems: 'center',
        color: 'black',
        textDecorationLine: 'underline',
        fontSize: 15
    },
});