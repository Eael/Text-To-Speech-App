import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders text to speech converter heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/text to speech converter/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders text input area', () => {
  render(<App />);
  const textInput = screen.getByPlaceholderText(/enter text to convert to speech/i);
  expect(textInput).toBeInTheDocument();
});

test('renders character count', () => {
  render(<App />);
  const characterCount = screen.getByText(/0 \/ 5000 characters/i);
  expect(characterCount).toBeInTheDocument();
});

test('renders footer', () => {
  render(<App />);
  const footerElement = screen.getByText(/built with react and web speech api/i);
  expect(footerElement).toBeInTheDocument();
});
