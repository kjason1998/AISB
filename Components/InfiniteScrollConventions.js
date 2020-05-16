import React, {useState,useEffect} from 'react';
import { ActivityIndicator, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View, Linking } from 'react-native';

// Screen Dimensions
const { height, width } = Dimensions.get('window');

const InfiniteScrollConventions = props => {
    const [data,setData] = useState([]);
    const [limit,setLimit] = useState(35);
    const [lastVisible,setLastVisible] = useState(null);
    const [loading,setLoading] = useState(false);
    const [refreshing,setRefreshing] = useState(false);
    const [uuid,setUuid] = useState('');

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
            console.log('retrieveData for conventions in infinite scroll conventions.js')
            // Set State: Loading
            setLoading(true)

            // Cloud Firestore: Query
            let initialQuery = await props.database.collection('conventions')
                .orderBy('dateadded','desc')
                .limit(limit)
            // Cloud Firestore: Query Snapshot
            let documentSnapshots = await initialQuery.get();
            // Cloud Firestore: Document Data
            let documentData = documentSnapshots.docs.map(document => document.data());
            // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
            
            // Set State
            setData(documentData)
            setLoading(false)
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headingOne}>Convention Proceedings</Text>
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
                    // show convention title - and set the onclick
                    <View style={styles.itemContainer}> 
                        <Text style={styles.textJournal}
                            onPress={() => {if(item.link){
                                Linking.openURL(item.link)}}}>
                            {item.title}
                        </Text>
                    </View> 
                )}
                // Item Key
                keyExtractor={(item, index) => String(index)}
                
                // Refreshing (Set To True When End Reached)
                refreshing={refreshing}
            />
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        margin:15,
    }, headerText: {
        fontSize: 24,
        fontWeight:'bold',
        color: '#147efb',
        marginVertical: 20,
    }, headerContainer: {
        width: width,
        borderColor: '#000',
    }, itemContainer: {
        height: 18,
        width: width,
        borderColor: '#000',
        justifyContent: 'center',
    }, textJournal: {
        alignItems: 'center',
        color: 'grey',
        textDecorationLine: 'underline',
        fontSize: 15
    }, headingOne:{
        fontWeight:'bold',
        fontSize:24,
        color:'#147efb'
    }
});

export default InfiniteScrollConventions;