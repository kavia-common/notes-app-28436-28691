import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Notes App', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
    localStorageMock.setItem.mockClear();
  });

  test('renders app header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Notes App/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders create note form', () => {
    render(<App />);
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content:/i)).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    render(<App />);
    expect(screen.getByText(/Generate Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Note/i)).toBeInTheDocument();
  });

  test('title input accepts text', () => {
    render(<App />);
    const titleInput = screen.getByLabelText(/Title:/i);
    fireEvent.change(titleInput, { target: { value: 'Test Note' } });
    expect(titleInput.value).toBe('Test Note');
  });

  test('content textarea accepts text', () => {
    render(<App />);
    const contentTextarea = screen.getByLabelText(/Content:/i);
    fireEvent.change(contentTextarea, { target: { value: 'Test content' } });
    expect(contentTextarea.value).toBe('Test content');
  });

  test('save button is disabled when fields are empty', () => {
    render(<App />);
    const saveButton = screen.getByText(/Save Note/i);
    expect(saveButton).toBeDisabled();
  });

  test('save button is enabled when fields are filled', () => {
    render(<App />);
    const titleInput = screen.getByLabelText(/Title:/i);
    const contentTextarea = screen.getByLabelText(/Content:/i);
    const saveButton = screen.getByText(/Save Note/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.change(contentTextarea, { target: { value: 'Content' } });
    
    expect(saveButton).not.toBeDisabled();
  });

  test('displays empty state message when no notes', () => {
    render(<App />);
    expect(screen.getByText(/No notes saved yet/i)).toBeInTheDocument();
  });
});
