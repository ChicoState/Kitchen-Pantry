import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer

// Mocking the @react-native-firebase/auth module
jest.mock('@react-native-firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

// Helper function to wrap component in NavigationContainer
const renderWithNavigation = (ui, { navigation } = {}) => {
  return render(<NavigationContainer>{ui}</NavigationContainer>, { navigation });
};

test('renders HomeScreen', () => {
  const { getByText, getByTestId } = renderWithNavigation(<HomeScreen />);

  // Check if the component renders correctly
  expect(getByText('Grocery List')).toBeTruthy();
  expect(getByText('Pantry')).toBeTruthy();
  expect(getByText('Recipes')).toBeTruthy();
  expect(getByText('PantryPal Inc 2023')).toBeTruthy();
});

test('navigates to Grocery List screen', () => {
  const mockNavigation = { navigate: jest.fn() };
  const { getByText } = renderWithNavigation(<HomeScreen navigation={mockNavigation} />);

  fireEvent.press(getByText('Grocery List'));

  expect(mockNavigation.navigate).toHaveBeenCalledWith('Grocery List');
});

test('navigates to Pantry screen', () => {
  const mockNavigation = { navigate: jest.fn() };
  const { getByText } = renderWithNavigation(<HomeScreen navigation={mockNavigation} />);

  fireEvent.press(getByText('Pantry'));

  expect(mockNavigation.navigate).toHaveBeenCalledWith('Pantry');
});

test('navigates to Recipes screen', () => {
  const mockNavigation = { navigate: jest.fn() };
  const { getByText } = renderWithNavigation(<HomeScreen navigation={mockNavigation} />);

  fireEvent.press(getByText('Recipes'));

  expect(mockNavigation.navigate).toHaveBeenCalledWith('Meal Plans');
});

test('signs out and navigates to LogIn screen', async () => {
  const mockNavigation = { navigate: jest.fn() };
  const { getByTestId } = renderWithNavigation(<HomeScreen navigation={mockNavigation} />);

  const signOutButton = getByTestId('signout-button');
  fireEvent.press(signOutButton);

  expect(mockNavigation.navigate).toHaveBeenCalledWith('LogIn');
});
