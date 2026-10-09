import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    }),
  ) as jest.Mock;
});

test('renders the portfolio sections and contact links', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: /Constru/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Sobre mim/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Experi\u00eancia' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Projetos' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /WhatsApp/i })).toHaveAttribute(
    'href',
    'https://wa.me/5551997447884',
  );
});
