/*
 * File: PantryPal/Pantry.js
 * Description: This is the Pantry screen
 * It allows the user to add, edit, and delete items from the pantry.
 * It is accessed from the HomeScreen.
 */

import React, { useEffect, useState } from "react";
import {Button, FlatList,TouchableOpacity, ImageBackground, Modal, RefreshControl, Text, View, ActivityIndicator} from "react-native";
import {loadPantryData, deleteItem} from './PantryStorage.ts';  // storage methods 
import Snackbar from "react-native-snackbar";
import image from './Images/pantryimage.jpg';     // backround image
import styles from './Styles.js';

/* Pantry Screen */
const Pantry = ({navigation}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);  // delete conformation modal state
  const [pantryData, setPantryData] = useState({});               // firebase pantry state
  const [name, setName] = useState('');                           // editing input fields states
  const [loading, setLoading] = useState(true);

  /* Screen Functions */
  const toggleDialog = () => {setIsDialogVisible(!isDialogVisible);}; // togles delete confirmation

  /* Sorts items by expiration date in asc order */
  const sortDataByExpiration = (data) => {
    const sortedData = data.sort((a, b) => {
      const expirationDateA = new Date(a.itemData.expiration);
      const expirationDateB = new Date(b.itemData.expiration);
      return expirationDateA - expirationDateB;
    });
    return sortedData;
  };
  

  /* Loads the pantry data from firebase */
  const fetchData = async () => {
    setLoading(true); 
    const data = await loadPantryData();
    if (data === null) {
      setPantryData(data);
      setLoading(false);
      return;
    }
    const sortedData = sortDataByExpiration(data);
    setPantryData(sortedData);
    setLoading(false);
  }; 

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]); 

  // This is the render method for the individual pantry items
  const renderItem = ({ item }) => {
    const today = new Date();
    const item_expiration = new Date(item.itemData.expiration);
    const days_till_expiration= Math.ceil((item_expiration - today) / (1000*60*60*24)); // 4 days
    let expiration_text = "";
    let color = "";
  
    if (days_till_expiration < 0) {
      expiration_text = "Expired";
      color = "red"; 
    } else if (days_till_expiration <= 4) {
      expiration_text = "Soon To Expire";
      color = "orange";
    }


    return (
      <View style={styles.itemContainer}>
        {/* Item Details */}
        <View style={styles.textContainer}>
          <Text style={styles.text2}>{item.key}</Text>
          <Text style={styles.text2}>Quantity: {item.itemData.quantity}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text3}>Purchased: </Text>
          <Text style={styles.text3}>{`${item.itemData.datePurchased.getMonth()+1}/${item.itemData.datePurchased.getDate()}/${item.itemData.datePurchased.getFullYear()}`}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text3}>Expiration Date: </Text>
          <Text style={styles.text3}>{
            item.itemData.expiration.toDateString() === 'Thu Dec 30 9999' ? 'N/A' 
            : item.itemData.expiration.toDateString()}
          </Text>
        </View>
        {expiration_text ? (
          <View style={styles.textContainer}>
            <Text style={[styles.text3, { color: color }]}>{expiration_text}</Text>
          </View>
        ) : null}
        <View style={styles.buttonContainer}>
          {/* funciton buttons */}
          <Button
            title = "Edit Item"
            color = "darkorange"
            onPress = {() => {
              setName(item.key);
              navigation.navigate('Edit Item', { itemName: item.key });
            }}
          />
          <Text> </Text>
          <Button
            title = "Delete Item"
            color = "darkred"
            onPress = {() => {
              setName(item.key); // Set the name of the item
              toggleDialog();
            }}
          />
        </View>
      </View>
    );
  };
  
  
  // This is the actual screen that is rendered
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            {/* Conditionally render the pantry items */}
            {!pantryData || Object.keys(pantryData).length === 0 ? (
              <View style={styles.itemContainer}>
                <Text style={styles.text}>Your pantry is empty!</Text>
                <Text style={styles.text}>You should add some items!</Text>
                <Button
                  title="Add Item"
                  onPress={() => { navigation.navigate("Add Item");}}
                />
              </View>
            ) : (
              <View style={styles.pantryContainer}>
                <FlatList
                  data = {pantryData}
                  renderItem = {renderItem}
                  keyExtractor = {(item) => item.key}
                />
              </View>
            )}
  
            <Modal
              animationType="slide"
              transparent={true}
              visible={isDialogVisible}
            >
              {/* This is the delete item modal */}
              <View style={styles.modalContainer}>
                <Text style={styles.confirmationText}>
                  Are you sure you want to delete the item from your pantry?
                </Text>
                <View style={styles.buttonContainer}>
                  <Button title="No" color="red" onPress={toggleDialog} />
                  <Text>          </Text>
                  <Button
                    title="Yes"
                    color="green"
                    onPress={async () => {
                      if (name) {
                        await deleteItem(name);
                        fetchData(); // Refresh pantry data
                        toggleDialog(); // Close the modal
                        Snackbar.show({
                          text: "Item deleted!",
                          duration: Snackbar.LENGTH_SHORT,
                        });
                      }
                    }}
                  />
                </View>
              </View>
            </Modal>
          </>
        )}
  
        {/* Buttons at the bottom of the screen */}
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
          <Button
            title="Add Item"
            color="green"
            onPress={() => {
              navigation.navigate("Add Item");
            }}
          />
        </View>
        </View>
      </View>
  );  
};

export default Pantry;