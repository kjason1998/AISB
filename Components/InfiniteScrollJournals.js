import React, {useState,useEffect} from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View, Linking } from 'react-native';

// Screen Dimensions
const { height, width } = Dimensions.get('window');

const InfiniteScrollJournals = props => {
    const [data,setData] = useState([]);
    const [limit,setLimit] = useState(10);
    const [lastVisible,setLastVisible] = useState('');
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);
    const [uuid,setUuid] = useState('');
    const [userPremium,setUserPremium] = useState(false);

    useEffect (() => {
        let user = props.firebase.auth().currentUser;
        if(user){
            let doc = props.database.collection('users').doc(user.uid);

            doc.onSnapshot(docSnapshot => {
                console.log(`Received doc snapshot in DrawerNav listener: ${docSnapshot}`);
                setUserPremium(docSnapshot.data().premium)
            }, err => {
                console.log(`Encountered error: ${err}`);
        });
        }
    },[userPremium])

    useEffect(() => {
        try {
            // Cloud Firestore: Initial Query
            retrieveData();
            props.firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    setUuid(user.uid.String)
                }
             });
        }
        catch (error) {
            console.log(error);
        }
    },[uuid]);

    //Retrieve Data
    async function retrieveData(){
        try {
            console.log('retrieveData for journals in infinite scroll journals.js')
            // Set State: Loading
            setLoading(true)

            // Cloud Firestore: Query
            let initialQuery = await props.database.collection('journals')
                .orderBy('title')
                .limit(limit)
            // Cloud Firestore: Query Snapshot
            let documentSnapshots = await initialQuery.get();
            // Cloud Firestore: Document Data
            let documentData = documentSnapshots.docs.map(document => document.data());
            // Set State
            setData(documentData)
            setLoading(false)
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                // Data
                data={(data)}
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
                            onPress={() => props.openPDFFromScroll(item.link,item.title)}>
                            {item.title}
                        </Text>
                    </View> 
                    :
                    // if it is premium
                    // check if uuid is empty (not logged in as a member
                    // if yes show nothing
                    ((uuid === '') || (!userPremium)) ?
                    <View></View> 
                    :
                    // if journal is not premium
                    <View style={styles.itemContainer}> 
                        <Text style={styles.textJournal}
                            onPress={() => props.openPDFFromScroll(item.link,item.title)}>
                            {item.title}
                        </Text>
                    </View> 
                )}
                // Item Key
                keyExtractor={(item, index) => String(index)}
                // On End Reached (Takes a function)
                //onEndReached={retrieveMore}
                // How Close To The End Of List Until Next Data Request Is Made
                onEndReachedThreshold={0}
                // Refreshing (Set To True When End Reached)
                refreshing={refreshing}
            />
        </SafeAreaView>
    );
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

export default InfiniteScrollJournals;