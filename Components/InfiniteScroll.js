import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
            console.log('Infinite scroll 26')
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
        console.log('Infinite scroll retrieve data 45')
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
        console.log('Infinite scroll 75')
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

            
            // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
            //let lastVisibleIn = documentSnapshots.docs[documentSnapshots.docs.length - 1].id;
            setLastItemId(documentSnapshots.docs[documentSnapshots.docs.length - 1].id)


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

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    // Data
                    data={(this.state.documentData)}
                    // Render Items
                    renderItem={({ item }) => (
                        //check if header
                        item.header === true ?
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>
                                {item.title}
                            </Text>
                        </View> 
                        :
                        // if not header
                        // also check if item is not premium
                        item.premium == false ?
                        <View style={styles.itemContainer}>
                            <Text style={styles.textJournal}
                                onPress={() => this.props.openPDFFromScroll(item.link,item.title)}>
                                {item.title}
                            </Text>
                        </View> 
                        :
                        // if it is premium
                        // check if uuid is empty (not logged in as a member
                        // if yes show nothing
                        this.state.uuid === '' ?
                        <View></View> 
                        :
                        // if journal is not premium
                        <View style={styles.itemContainer}> 
                            <Text style={styles.textJournal}
                                onPress={() => this.props.openPDFFromScroll(item.link,item.title)}>
                                {item.title}
                            </Text>
                        </View> 
                    )}
                    // Item Key
                    keyExtractor={(item, index) => String(index)}
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
    }, headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'gray',
        margin: 12,
        textAlign: 'center'
    }, headerContainer: {
        width: width,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    }, itemContainer: {
        height: 18,
        width: width,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    }, textJournal: {
        alignItems: 'center',
        color: 'black',
        textDecorationLine: 'underline',
        fontSize: 15
    },
});