import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })) as jest.Mock;
});

test('renders the main portfolio sections', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: /Transformo problemas/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Sobre mim/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Projetos reais/i })).toBeInTheDocument();
});
