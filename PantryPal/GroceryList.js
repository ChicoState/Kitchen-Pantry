import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GroceryList = () => {
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [groceryList, setGroceryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddItem = () => {
    if (foodItem.trim() !== '') {
      const newItem = {
        name: foodItem,
        quantity: quantity.trim(),
        checked: false,
      };
      setGroceryList((prevList) => [...prevList, newItem]);
      setFoodItem('');
      setQuantity('');
    }
  };

  const toggleCheckbox = (index) => {
    const newList = groceryList.map((item, idx) =>
      idx === index ? { ...item, checked: !item.checked } : item
    );
    setGroceryList(newList);
  };

  const handleRemoveItem = (index) => {
    setGroceryList((prevList) => prevList.filter((_, idx) => idx !== index));
  };

  const handleDoneShopping = () => {
    setGroceryList(groceryList.filter(item => !item.checked));
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setFoodItem('');
    setQuantity('');
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        testID="modal"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
              testID="close-button"
            >
              <Icon name="times" size={20} color="#333" />
            </TouchableOpacity>
            <TextInput
              placeholder="Enter a Food Item"
              value={foodItem}
              onChangeText={setFoodItem}
              style={styles.input}
              testID="food-item-input"
            />
            <TextInput
              placeholder="Quantity (optional)"
              value={quantity}
              onChangeText={setQuantity}
              style={styles.input}
              keyboardType="numeric"
              testID="quantity-input"
            />
            <Button title="Add Item" onPress={handleAddItem} color="teal" />
          </View>
        </View>
      </Modal>
      <FlatList
        data={groceryList}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <TouchableOpacity onPress={() => toggleCheckbox(index)} testID={`checkbox-${index}`}>
                <View style={styles.checkbox}>
                  {item.checked && <View style={styles.checkedBox} />}
                </View>
              </TouchableOpacity>
              <Text
                style={[{ marginLeft: 10, flex: 1 }, item.checked && { textDecorationLine: 'line-through' }]}
                testID={`item-text-${index}`}
              >
                {item.quantity ? `${item.quantity} ${item.name}` : item.name}
              </Text>
            </View>
            <Button title="X" onPress={() => handleRemoveItem(index)} color="maroon" testID={`remove-button-${index}`} />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={() =>
          groceryList.length > 0 ? (
            <Button title="Done Shopping" onPress={handleDoneShopping} color="green" />
          ) : null
        }
        ListFooterComponentStyle={{ padding: 20 }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        testID="add-button"
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 200,
    padding: 8,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'teal',
    borderRadius: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'green',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default GroceryList;
