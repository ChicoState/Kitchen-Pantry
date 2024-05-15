import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MealScreen from '../MealScreen';
import axios from 'axios';

// Mock axios to prevent actual API calls during tests
jest.mock('axios');

test('renders MealScreen', () => {
  const { getByPlaceholderText } = render(<MealScreen />);

  // Check if search input is rendered
  const searchInput = getByPlaceholderText('Search Meals');
  expect(searchInput).toBeTruthy();
});

test('displays search results when a search is made', async () => {
  const mockResults = [
    { id: 1, title: 'Spaghetti Bolognese' },
    { id: 2, title: 'Chicken Salad' },
  ];
  axios.get.mockResolvedValueOnce({ data: { results: mockResults } });

  const { getByPlaceholderText, getByText, findByText } = render(<MealScreen />);

  const searchInput = getByPlaceholderText('Search Meals');

  fireEvent.changeText(searchInput, 'Spaghetti');
  fireEvent(searchInput, 'submitEditing');

  expect(await findByText('Spaghetti Bolognese')).toBeTruthy();
  expect(await findByText('Chicken Salad')).toBeTruthy();
});

test('displays all pre-coded meals in a modal', () => {
  // Implement this test based on the actual implementation details of pre-coded meals
});

test('adds a meal to the list', () => {
  // Adjust this test as per your actual implementation if required
});

test('removes a meal from the list', () => {
  // Adjust this test as per your actual implementation if required
});

test('displays meal details correctly', () => {
  // Adjust this test as per your actual implementation if required
});
