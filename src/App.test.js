import { render, screen } from '@testing-library/react';
import App from './App';

test('affiche le titre de la boutique et les produits', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { level: 1, name: /Ma Boutique React/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', { level: 2, name: /Nos produits/i })
  ).toBeInTheDocument();
});
