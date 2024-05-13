/* 
 * File: PantryPal/AddItem.js
 * Description: This is the add item screen
 * It allows the user to add an item to the pantry.
 * It is accessed from the Pantry screen.
 */

import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Switch, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Snackbar from 'react-native-snackbar';
import { addItem } from './PantryStorage.ts';
import styles from './Styles.js';

const AddItem = ({ navigation }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [datePurchased, setDatePurchased] = useState(new Date());
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [noExpiration, setNoExpiration] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDatePickerPurchase, setShowDatePickerPurchase] = useState(false);
  const [showDatePickerExpiration, setShowDatePickerExpiration] = useState(false);

  const showDatepicker = (datePickerType) => {
    if (datePickerType === 'purchase') {
      setShowDatePickerPurchase(true);
    } else if (datePickerType === 'expiration') {
      setShowDatePickerExpiration(true);
    }
  };

  const saveItem = async () => {
    try {
      await addItem(
        name,
        datePurchased.toString(),
        expirationDate.toString(),
        quantity,
      );
      setName('');
      setDatePurchased(new Date());
      setExpirationDate(new Date());
      setQuantity('');
      Snackbar.show({
        text: 'Item added!',
        duration: Snackbar.LENGTH_SHORT,
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Snackbar.show({
        text: 'Item not added!',
        duration: Snackbar.LENGTH_SHORT,
      });
      throw new Error('Item not added' + error);
    }
  };

  const validateName = (inputText) => {
    if (inputText.trim() === '') {
      Snackbar.show({
        text: 'Please enter a name',
        duration: Snackbar.LENGTH_SHORT,
      });
      setName('');
      setErrorMessage('No item name')
    } else {
      setErrorMessage('');
      setName(inputText);
    }
  };

  const validateQuantity = (inputText) => {
    const number = parseInt(inputText);
    if (isNaN(number)) {
      Snackbar.show({
        text: 'Please enter a valid number',
        duration: Snackbar.LENGTH_SHORT,
      });
      setQuantity(0);
      setErrorMessage('Not a number');
    } else if (number < 0) {
      Snackbar.show({
        text: 'Please enter a positive number',
        duration: Snackbar.LENGTH_SHORT,
      });
      setQuantity(0);
      setErrorMessage('Negative number');
    } else {
      setErrorMessage('');
      setQuantity(inputText);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.addContainer}>
        <TextInput
          placeholder='Enter Name'
          value={name}
          onChangeText={(name) => validateName(name)}
          style={styles.textBox2}
        />
        <TextInput
          keyboardType='numeric'
          placeholder='Enter a Quantity'
          onChangeText={(quantity) => validateQuantity(quantity)}
          value={quantity}
          maxLength={5}
          style={styles.textBox2}
        />
        <Button
          title={`Purchased:\t\t\t\t${datePurchased.toDateString()}`}
          onPress={() => showDatepicker('purchase')}
        />
        {showDatePickerPurchase && (
          <DateTimePicker
            value={datePurchased}
            mode='date'
            display='default'
            onChange={(_, selectedPurDate) => {
              setShowDatePickerPurchase(false);
              if (selectedPurDate) {
                setDatePurchased(new Date(selectedPurDate));
              }
            }}
          />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Text>No Expiration</Text>
          <Switch
            value={noExpiration}
            onValueChange={(value) => {
              setNoExpiration(value);
              if (value) setExpirationDate(new Date('9999-12-31')); 
              else setExpirationDate(new Date());
            }}
          />
        </View>
        {!noExpiration && (
          <>
            <Button
              title={`Expires:\t\t\t\t\t\t\t${expirationDate.toDateString()}`}
              onPress={() => showDatepicker('expiration')}
            />
            {showDatePickerExpiration && (
              <DateTimePicker
                value={expirationDate}
                mode='date'
                display='default'
                onChange={(_, selectedExpDate) => {
                  setShowDatePickerExpiration(false);
                  if (selectedExpDate) {
                    setExpirationDate(new Date(selectedExpDate));
                  }
                }}
              />
            )}
          </>
        )}
        <View style={styles.buttonContainer3}>
          <Button color={'green'} title='Add Item' onPress={async () => {
            if (name.trim() === '') {
              Snackbar.show({
                text: 'Cannot save nameless item!',
                duration: Snackbar.LENGTH_SHORT,
              });
            } if (quantity === 0) {
              Snackbar.show({
                text: 'Cannot save item without a quantity!',
                duration: Snackbar.LENGTH_SHORT,
              });
            } else {
              await saveItem();
            }
          }}
          />
          <Text>          </Text>
          <Button color={'grey'} style={{ color: 'black' }} title='back' onPress={() => {
            navigation.goBack(() => {
              navigation.navigate('Pantry', { refresh: true }); // Navigate back to Pantry and pass a parameter to indicate refresh
            });
          }}
          />
        </View>
      </View>
    </View>
  )
}

export default AddItem;
