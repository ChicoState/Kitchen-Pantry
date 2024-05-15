import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GroceryList from '../GroceryList';

test('renders correctly', () => {
  const { getByTestId } = render(<GroceryList />);
  
  expect(getByTestId('add-button')).toBeTruthy();
});

test('opens and closes the modal', () => {
  const { getByTestId, queryByTestId } = render(<GroceryList />);

  const addButton = getByTestId('add-button');
  fireEvent.press(addButton);

  expect(queryByTestId('food-item-input')).toBeTruthy();

  const closeButton = getByTestId('close-button');
  fireEvent.press(closeButton);

  expect(queryByTestId('food-item-input')).toBeNull();
});

test('adds an item to the list', () => {
  const { getByPlaceholderText, getByText, getByTestId } = render(<GroceryList />);

  const addButton = getByTestId('add-button');
  fireEvent.press(addButton);

  const foodItemInput = getByPlaceholderText('Enter a Food Item');
  const quantityInput = getByPlaceholderText('Quantity (optional)');
  const addItemButton = getByText('Add Item');

  fireEvent.changeText(foodItemInput, 'Tomatoes');
  fireEvent.changeText(quantityInput, '2');
  fireEvent.press(addItemButton);

  expect(getByText('2 Tomatoes')).toBeTruthy();
});

test('toggles item checkbox', () => {
  const { getByPlaceholderText, getByText, getByTestId } = render(<GroceryList />);

  const addButton = getByTestId('add-button');
  fireEvent.press(addButton);

  const foodItemInput = getByPlaceholderText('Enter a Food Item');
  const quantityInput = getByPlaceholderText('Quantity (optional)');
  const addItemButton = getByText('Add Item');

  fireEvent.changeText(foodItemInput, 'Tomatoes');
  fireEvent.changeText(quantityInput, '2');
  fireEvent.press(addItemButton);

  const itemText = getByTestId('item-text-0');
  const checkbox = getByTestId('checkbox-0');

  fireEvent.press(checkbox);

  // Check if the item is checked
  const itemTextStyle = itemText.props.style.find(style => style.textDecorationLine === 'line-through');
  expect(itemTextStyle).toBeDefined();

  fireEvent.press(checkbox);

  // Check if the item is unchecked
  const itemTextStyleAfterToggle = itemText.props.style.find(style => style.textDecorationLine === 'line-through');
  expect(itemTextStyleAfterToggle).toBeUndefined();
});

test('removes an item from the list', () => {
  const { getByPlaceholderText, getByText, queryByText, getByTestId } = render(<GroceryList />);

  const addButton = getByTestId('add-button');
  fireEvent.press(addButton);

  const foodItemInput = getByPlaceholderText('Enter a Food Item');
  const quantityInput = getByPlaceholderText('Quantity (optional)');
  const addItemButton = getByText('Add Item');

  fireEvent.changeText(foodItemInput, 'Tomatoes');
  fireEvent.changeText(quantityInput, '2');
  fireEvent.press(addItemButton);

  const removeButton = getByTestId('remove-button-0');
  fireEvent.press(removeButton);

  expect(queryByText('2 Tomatoes')).toBeNull();
});

test('removes all checked items when done shopping', () => {
  const { getByPlaceholderText, getByText, getByTestId, queryByText } = render(<GroceryList />);

  const addButton = getByTestId('add-button');
  fireEvent.press(addButton);

  const foodItemInput = getByPlaceholderText('Enter a Food Item');
  const quantityInput = getByPlaceholderText('Quantity (optional)');
  const addItemButton = getByText('Add Item');

  fireEvent.changeText(foodItemInput, 'Tomatoes');
  fireEvent.changeText(quantityInput, '2');
  fireEvent.press(addItemButton);

  fireEvent.changeText(foodItemInput, 'Milk');
  fireEvent.changeText(quantityInput, '1');
  fireEvent.press(addItemButton);

  const firstItemCheckbox = getByTestId('checkbox-0');
  fireEvent.press(firstItemCheckbox);

  const doneShoppingButton = getByText('Done Shopping');
  fireEvent.press(doneShoppingButton);

  expect(getByText('1 Milk')).toBeTruthy();
  expect(queryByText('2 Tomatoes')).toBeNull();
});
