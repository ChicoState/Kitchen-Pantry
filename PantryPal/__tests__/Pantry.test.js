import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Pantry from '../Pantry';
import { loadPantryData, deleteItem } from '../PantryStorage';

// Mock the storage methods
jest.mock('../PantryStorage', () => ({
  loadPantryData: jest.fn(),
  deleteItem: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn((event, callback) => {
    if (event === 'focus') {
      callback();
    }
    return jest.fn(); // unsubscribe function
  }),
};

const mockPantryData = [
  {
    key: 'Apples',
    itemData: {
      quantity: 5,
      expiration: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      datePurchased: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  },
  {
    key: 'Milk',
    itemData: {
      quantity: 2,
      expiration: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      datePurchased: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  },
];

describe('Pantry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Pantry screen with empty state', async () => {
    loadPantryData.mockResolvedValueOnce(null);

    await act(async () => {
      const { getByText } = render(<Pantry navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('Your pantry is empty!')).toBeTruthy();
        expect(getByText('You should add some items!')).toBeTruthy();
      });
    });
  });

  test('renders Pantry screen with items', async () => {
    loadPantryData.mockResolvedValueOnce(mockPantryData);

    await act(async () => {
      const { findByText } = render(<Pantry navigation={mockNavigation} />);
      await waitFor(() => {
        expect(findByText('Apples')).toBeTruthy();
        expect(findByText('Milk')).toBeTruthy();
      });
    });
  });

  test('navigates to Add Item screen when "Add Item" button is pressed', async () => {
    loadPantryData.mockResolvedValueOnce(null);

    await act(async () => {
      const { getByText } = render(<Pantry navigation={mockNavigation} />);
      fireEvent.press(getByText('Add Item'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Add Item');
    });
  });

  test('shows delete confirmation modal and deletes item', async () => {
    loadPantryData.mockResolvedValueOnce(mockPantryData);
    deleteItem.mockResolvedValueOnce(true);

    await act(async () => {
      const { findAllByText, findByText } = render(<Pantry navigation={mockNavigation} />);
      const deleteButtons = await findAllByText('Delete Item');
      fireEvent.press(deleteButtons[0]);
      const yesButton = await findByText('Yes');
      fireEvent.press(yesButton);
      await waitFor(() => expect(deleteItem).toHaveBeenCalledWith('Apples'));
    });
  });

  test('navigates to Edit Item screen when "Edit Item" button is pressed', async () => {
    loadPantryData.mockResolvedValueOnce(mockPantryData);

    await act(async () => {
      const { findAllByText } = render(<Pantry navigation={mockNavigation} />);
      const editButtons = await findAllByText('Edit Item');
      fireEvent.press(editButtons[0]);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Edit Item', { itemName: 'Apples' });
    });
  });
});
