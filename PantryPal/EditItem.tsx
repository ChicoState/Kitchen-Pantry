/*
 * File: PantryPal/EditItem.js
 * Description: This is the EditItem screen
 * It allows the user to edit an item in the pantry.
 * It is accessed from the Pantry screen.
*/

import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Button, TextInput, Switch, ImageBackground} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {editItem, loadItem} from './PantryStorage';
// This is for the route from the pantry screen
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import styles from './Styles.js';

// This is the route type
type MyParamList = ParamListBase & {
  EditItem: {itemName: string};
  route: RouteProp<MyParamList, 'EditItem'>;
};

interface EditItemProps {
  navigation: NavigationProp<MyParamList, 'EditItem'>;
  route: RouteProp<MyParamList, 'EditItem'>;
}

// This is the edit item screen
const EditItem: React.FC<EditItemProps> = ({navigation, route}) => {
  // Get the item name from the route params
  const itemName: string = route.params.itemName;
  // State variables for the fields
  const [quantity, setQuantity] = useState<string>('');
  const [datePurchased, setDatePurchased] = useState<Date>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date>(new Date());
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [noExpiration, setNoExpiration] = useState(false);
  // States for the date pickers
  const [showDatePickerPurchase, setShowDatePickerPurchase] = useState<boolean>(false);
  const [showDatePickerExpiration, setShowDatePickerExpiration] = useState<boolean>(false);

  // Show the date picker for the expiration or purchase dates
  const showDatepicker = (datePickerType: string): void => {
    if (datePickerType === 'purchase') {
      setShowDatePickerPurchase(true);
    } else if (datePickerType === 'expiration') {
      if (noExpiration) setNoExpiration(false);
      setExpirationDate(new Date());
      setShowDatePickerExpiration(true);
    }
  };

  // Fetch the item data from storage
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const item = await loadItem(itemName);
      // Set the item data
      if (item === null) {
        throw new Error('Item not found!');
      }
      setQuantity(item.quantity);
      setDatePurchased(new Date(item.datePurchased));
      setExpirationDate(new Date(item.expiration));
      if (item.expiration.toDateString() === 'Thu Dec 30 9999'){
        setNoExpiration(true);
      }
      // Handle the item data as needed
    } catch (error: any) {
      setErrorMessage(error.message);
      Snackbar.show({
        text: errorMessage,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  }, [errorMessage, itemName]);

  const updateItem = async (): Promise<void> => {
    if (!validateQuantity(quantity)) return;

    try {
      await editItem(
        itemName,
        datePurchased.toString(),
        expirationDate.toString(),
        quantity,
      );
      // Reset the input fields
      setDatePurchased(new Date());
      setExpirationDate(new Date());
      setQuantity('');
      Snackbar.show({
        text: 'Item updated!',
        duration: Snackbar.LENGTH_SHORT,
      });
      navigation.goBack();
    } catch (error: any) {
      console.log(error.message);
      setErrorMessage(error.message);
      Snackbar.show({
        text: 'Failed to update item!',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  // Number input validation
  const validateQuantity = (inputText: any): boolean => {
    const number = parseInt(inputText, 10);
    if (isNaN(number)) {
      Snackbar.show({
        text: 'Please enter a valid number',
        duration: Snackbar.LENGTH_SHORT,
      });
      setQuantity('');
      setErrorMessage('Not a number');
      return false;
    } else if (number < 0) {
      Snackbar.show({
        text: 'Please enter a positive number',
        duration: Snackbar.LENGTH_SHORT,
      });
      setQuantity('');
      setErrorMessage('Negative number');
      return false;
    } else {
      setErrorMessage('');
      setQuantity(inputText);
      return true;
    }
  };

  // Fetch the item data from storage
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.addContainer}>
        <View style={styles.addTextContainer}>
          <Text style={styles.addText3}>{itemName}</Text>
        </View>
        <TextInput
          keyboardType="numeric"
          placeholder="Enter a Quantity"
          onChangeText={quantity => setQuantity(quantity)}
          value={quantity}
          maxLength={5}
          style={styles.textBox2}
        />
        <View style={styles.addTextContainer}>
          <Text style={styles.status}>
            Purchased: {datePurchased.toDateString()}
          </Text>
        </View>
        <View style={styles.addTextContainer}>
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
          <View style={styles.addTextContainer}>
            <Text style={styles.status}>Expires: {expirationDate.toDateString()}</Text>
          </View>
        )}
        <View style={styles.buttonContainer2}>
          <Button
            title="Purchase Date"
            color="goldenrod"
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
          <Text>          </Text>
          <Button
            title="Expiration Date"
            color="darkred"
            onPress={() => showDatepicker('expiration')}
          />
          {showDatePickerExpiration && (
            <DateTimePicker
              value={expirationDate}
              mode="date"
              display="default"
              onChange={(_, selectedExpDate) => {
                setShowDatePickerExpiration(false);
                if (selectedExpDate) {
                  setExpirationDate(new Date(selectedExpDate));
                }
              }}
            />
          )}
        </View>
        <View style={styles.buttonContainer3}>
          <Button
            color={'green'}
            title="Save"
            onPress={async () => {
              if (quantity === '0' || quantity === '') {
                Snackbar.show({
                  text: 'Cannot save item without a quantity!',
                  duration: Snackbar.LENGTH_SHORT,
                });
              } else {
                await updateItem();
              }
            }}
          />
          <Text>          </Text>
          <Button
            color={'red'}
            title="Cancel"
            onPress={() => {
              navigation.goBack();
          }}
          />
        </View>
      </View>
    </View>
  );
};

export default EditItem;
