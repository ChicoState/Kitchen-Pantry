/**
 * @format
 */

import 'react-native';
import React from 'react';
import { Text } from 'react-native';
import App from '../App';
import { render, waitFor } from '@testing-library/react-native';

// Mock the screens to isolate App component testing
jest.mock('../LogIn', () => {
  const { Text } = require('react-native');
  return () => <Text>LogIn Screen</Text>;
});
jest.mock('../HomeScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>Home Screen</Text>;
});
jest.mock('../GroceryList', () => {
  const { Text } = require('react-native');
  return () => <Text>Grocery List</Text>;
});
jest.mock('../MealScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>Meal Plans</Text>;
});
jest.mock('../Pantry', () => {
  const { Text } = require('react-native');
  return () => <Text>Your Pantry</Text>;
});
jest.mock('../AddItem', () => {
  const { Text } = require('react-native');
  return () => <Text>Add Item</Text>;
});
jest.mock('../EditItem', () => {
  const { Text } = require('react-native');
  return () => <Text>Edit Item</Text>;
});
jest.mock('../components/recipeDetailsComponent', () => {
  const { Text } = require('react-native');
  return () => <Text>Recipe Details</Text>;
});

test('renders the initial LogIn screen', async () => {
  const { getByText } = render(<App />);

  await waitFor(() => {
    expect(getByText('LogIn Screen')).toBeTruthy();
  });
});
