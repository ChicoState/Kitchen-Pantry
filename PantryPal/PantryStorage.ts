                                                 /*
 * File: PantryPal/Storage.ts
 * Description: Firebase Firestore Cloud Database storage functions for PantryPal
 */

// Necessary imports
import firestore from '@react-native-firebase/firestore';
import { getUserId } from './UserStorage';


// This is our collection
const pantry = 'Pantry';

// Storage Functions
/*
 * Add a item to our pantry
 * @param name - name of the item, i.e. "milk", "eggs", etc
 * @param datePurchased - date the item was purchased
 * @param expiration - expiration date of item
 * @param quantity - quantity of item
 */
export const addItem = async (
  name: string,
  datePurchased: string,
  expiration: string,
  quantity: number,
 
) => {
  // Create an object to store the data
  const itemData = {
    datePurchased: datePurchased,
    expiration: expiration,
    quantity: quantity,
  
  };
  // Try to save the item to the storage
  try {
    const userId = await getUserId();
    await firestore().collection('users').doc(userId).collection(pantry).doc(name).set(itemData);
  } catch (error) {
    console.log(error);
    throw new addItemError('Failed to add item: ' + error);
  }
};

/*
 * Delete an item from our pantry
 * @param name - This should be the name of the item, ie "milk", "eggs", etc
 */
export const deleteItem = async (name: string) => {
  try {
    const userId = await getUserId();
    await firestore().collection('users').doc(userId).collection(pantry).doc(name).delete();
  } catch (error) {
    console.log(error);
    throw new deleteItemError('Failed to delete item: ' + error);
  }
};

/*
 * Update the entire item
 * @param name - name of the item, i.e. "milk", "eggs", etc
 * @param datePurchased - date the item was purchased, as a string
 * @param expiration - expiration date of item, as a string
 * @param quantity - quantity of item
 */
export const editItem = async (
  name: string,
  datePurchased: string,
  expiration: string,
  quantity: number,
) => {
  try {
    // Update the item's data
    const itemData = {
      datePurchased: datePurchased,
      expiration: expiration,
      quantity: quantity,
    };
    // Update the item
    const userId = await getUserId();
    await firestore().collection('users').doc(userId).collection(pantry).doc(name).set(itemData);
  } catch (error) {
    console.log(error);
    throw new updateItemError('Failed to update item: ' + error);
  }
};

/*
 * Load an item in our pantry from storage
 * @param name - name of the item, ie "milk", "eggs", etc
 */
export const loadItem = async (name: string) => {
  try {
    // Get the item from storage using the name
    const userId = await getUserId();
    const itemDoc = await firestore().collection('users').doc(userId).collection(pantry).doc(name).get();
    if (itemDoc.exists) {
      const itemData = itemDoc.data();
      if (itemData) {
        // Convert the date strings back to Date objects
        itemData.datePurchased = new Date(itemData.datePurchased);
        itemData.expiration = new Date(itemData.expiration);
        return itemData;
      }
      // If there is no data, return null
      return null;
    }
    // If the item doesn't exist, return null
    return null;
  } catch (error) {
    console.log(error);
    throw new loadItemError('Failed to load item: ' + error);
  }
};

// Loads all of the items and associated data in our pantry
export const loadPantryData = async () => {
  console.log(getUserId());
  try {
    // Grab all the documents in the collection
    const userId = await getUserId();
    const itemsQuerySnapshot = await firestore().collection('users').doc(userId).collection(pantry).get();
    // If there are no documents, return null
    if (itemsQuerySnapshot.empty) {return null;}
    // If there are documents, convert the strings back to Date objects
    const allStoredData = itemsQuerySnapshot.docs.map(doc => {
      const itemData = doc.data();
      itemData.datePurchased = new Date(itemData.datePurchased);
      itemData.expiration = new Date(itemData.expiration);
      return {key: doc.id, itemData};
    });
    // Return the data
    return allStoredData;
  } catch (error) {
    console.log(error);
    throw new loadPantryDataError('Failed to pantry data: ' + error);
  }
};

// Loads the the names of all of the items in our pantry
export const loadPantryKeys = async () => {
  try {
    const userId = await getUserId();
    const itemsQuerySnapshot = await firestore().collection('users').doc(userId).collection(pantry).get();
    // If there are no documents, return null
    if (itemsQuerySnapshot.empty) {
      return null;
    }
    // If there are documents, return the ids
    return itemsQuerySnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.log(error);
    throw new loadPantryCollectionError('Failed to load pantry items: ' + error,);
  }
};

// Various update methods for pantry items
/*
 * Update the purchase date of an item
 * @param name - name of the item, ie "milk", "eggs", etc
 * @param datePurchased - date the item was purchased
 */
export const updateDatePurchased = async (name: string, datePurchased: string) => {
  try {
    const userId = await getUserId();
    await firestore().collection('users').doc(userId).collection(pantry).doc(name).update({
      datePurchased: datePurchased,
    });
  } catch (error) {
    console.log(error);
    throw new updateDatePurchasedError('Failed to update date purchased: ' + error,);
  }
};

/*
 * Update the expiration date of an item
 * @param name - name of the item, ie "milk", "eggs", etc
 * @param expiration - expiration date of item
 */
export const updateExpiration = async (name: string, expiration: string) => {
  try {
    const userId = await getUserId();
    await firestore().collection('users').doc(userId).collection(pantry).doc(name).update({
      expiration: expiration,
    });
  } catch (error) {
    console.log(error);
    throw new updateExpirationError('Failed to update expiration date: ' + error,);
  }
};

/*
 * Update the name of an item
 * @param name - current name of the item, ie "milk", "eggs", etc
 * @param newName - new name of the item
 */
export const updateName = async (name: string, newName: string) => {
  try {
    // Run a transaction to update the name
    // This ensures that both the update and delete operations happen atomically, providing data consistency.
    const userId = await getUserId();
    await firestore().runTransaction(async transaction => {
      // Get a reference to the old item and the new item
      const oldItemRef = firestore().collection('users').doc(userId).collection(pantry).doc(name);
      const newItemRef = firestore().collection('users').doc(userId).collection(pantry).doc(newName);

      // Get the old item's data
      const oldItemSnapshot = await transaction.get(oldItemRef);
      if (!oldItemSnapshot.exists) {
        throw new updateNameError('Item does not exist: ' + name);
      }

      // Create a snapshot of the old item's data
      const itemData = oldItemSnapshot.data();

      // Create a new item with the new name
      const newItemData = {
        ...itemData,
      };

      // Set the new item and delete the old item
      transaction.set(newItemRef, newItemData);
      transaction.delete(oldItemRef);
    });
  } catch (error) {
    // This is for debugging purposes
    console.log(error);
    throw new updateNameError('Failed to update name: ' + error);
  }
};

/*
 * Update the quantity of an item
 * @param name - Current name of the item, ie "milk", "eggs", etc
 * @param quantity - quantity of item
 */
export const updateQuantity = async (name: string, quantity: number) => {
  try {
    const userId = await getUserId();
    await firestore().collection('users').doc(userId).collection(pantry).doc(name).update({
      quantity: quantity,
    });
  } catch (error) {
    console.log(error);
    throw new updateQuantityError('Failed to update quantity: ' + error);
  }
};

// Various Error Handlers for Storage Functions
// Error for adding an item
export class addItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'addItemError';
  }
}

// Error for deleting an item
export class deleteItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'deleteItemError';
  }
}

// Error for loading an item
export class loadItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'loadItemError';
  }
}

// Error for loading all the items in our pantry
export class loadPantryDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'loadPantryDataError';
  }
}
// Error for loading the keys of all the items in our pantry
export class loadPantryCollectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'loadKeysError';
  }
}

// No data error
export class noItemOrDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'noDataError';
  }
}

// Error for parsing data
export class parseDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'parseDataError';
  }
}

// Error for updating the purchase date of an item
export class updateDatePurchasedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'updateDatePurchasedError';
  }
}

// Error for updating the expiration date of an item
export class updateExpirationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'updateExpirationError';
  }
}

// Error for updating an item
export class updateItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'updateItemError';
  }
}

// Error for updating the location of an item
export class updateLocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'updateLocationError';
  }
}

// Error for updating the name of an item
export class updateNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'updateNameError';
  }
}

// Error for updating the quantity of an item
export class updateQuantityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'updateQuantityError';
  }
}
