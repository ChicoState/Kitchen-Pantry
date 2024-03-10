/* 
 * File Name: PantryPal/HomeScreen.js
 * Description: This is the HomeScreen screen
 * It allows the user to navigate to the grocery list and pantry screens.
 * It is the first screen the user sees.
 * It is accessed from the App.tsx file.
 * If you want navigate to a new screen, add a button and add the screen to the navigator.
 */

import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet, Image, TouchableOpacity} from 'react-native';
import image1 from './Images/italy.jpg';
import image2 from './Images/pantrypal.jpg';
import Icon from 'react-native-vector-icons/FontAwesome6';


// This is the HomeScreen
const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={image1}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={styles.container}>
        <Image
          source={image2}
          style={{ width: 350, height: 200, resizeMode: 'contain' }}
        />
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Grocery List')}>
            <View style={styles.iconWrapper}>
              <Icon name="kitchen-set" size={45} color="#1a5062" />
            </View>
            <Text style={styles.iconText}>Grocery List</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Pantry')}>
            <View style={styles.iconWrapper}>
              <Icon name="lemon" size={45} color="#1a5062" />
            </View>
            <Text style={styles.iconText}>Pantry</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Meal Plans')}>
            <View style={styles.iconWrapper}>
              <Icon name="book" size={45} color="#1a5062" />
            </View>
            <Text style={styles.iconText}>Recipes</Text>
          </TouchableOpacity>

        </View>
        <Text style={styles.bottomText }>PantryPal Inc 2023</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Add this to allow absolute positioning
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute icons evenly
    width: '100%', // Make the container take full width
    position: 'absolute', // Position it over the background
    bottom: 60, // Distance from bottom
  },
  iconWrapper: {
    backgroundColor: 'white',
    padding: 10, // Adjust this to increase or decrease the size of the circle
    borderRadius: 20, // This should be half of the width/height to create a perfect circle
    alignItems: 'center', // Center the icon horizontally
    justifyContent: 'center', // Center the icon vertically
    width: 70, // Specify the width for the circle
    height: 70, // Specify the height for the circle
  },
  iconText: {
    marginTop: 8, // Adjust as needed for space between icon and text
    textAlign: 'center', // Center the text
    color: "#1a5062",
  },
  bottomText: {
    color: 'white',
    fontSize: 18,
    position: 'absolute',
    bottom: 0,
    marginBottom: 20, // Adjust margin as needed
  },
});

export default HomeScreen;