import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import App from '../App';
import AppProvider from '../context/AppProvider';
import fetch from '../../cypress/mocks/fetch';

const searchInputConstant = 'search-input';
const ingredientRadioConst = 'ingredient-search-radio';
const nameRadioConst = 'name-search-radio';
const firstLetterRadioConst = 'first-letter-search-radio';
const searchRecipeBtnConst = 'exec-search-btn';
const searchBtnIdConst = 'search-top-btn';
describe('Testes component Search Bar', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(fetch);
  });
  it('testa se input, radio e botao estão na tela', async () => {
    // Storage.prototype.getItem = jest.fn(() => JSON.stringify(mockUserData));
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <AppProvider>
          <App />
        </AppProvider>
      </Router>,
    );
    history.push('/meals');

    const searchBtn = await screen.findByTestId(searchBtnIdConst);

    act(() => {
      userEvent.click(searchBtn);
    });

    const searchInput = await screen.findByTestId(searchInputConstant);

    expect(searchInput).toBeInTheDocument();

    const ingredientRadio = screen.getByTestId(ingredientRadioConst);
    const nameRadio = screen.getByTestId(nameRadioConst);
    const firstLetterRadio = screen.getByTestId(firstLetterRadioConst);
    const searchRecipeBtn = screen.getByTestId(searchRecipeBtnConst);

    expect(ingredientRadio).toBeInTheDocument();
    expect(nameRadio).toBeInTheDocument();
    expect(firstLetterRadio).toBeInTheDocument();
    expect(searchRecipeBtn).toBeInTheDocument();
  });
  it('testa o filtro por ingrediente em meals', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <AppProvider>
          <App />
        </AppProvider>
      </Router>,
    );
    history.push('/meals');

    const searchBtn = await screen.findByTestId(searchBtnIdConst);

    act(() => {
      userEvent.click(searchBtn);
    });

    const searchInput = await screen.findByTestId(searchInputConstant);

    expect(searchInput).toBeInTheDocument();

    await waitFor(() => {
      const imgCorba = screen.getByRole('img', {
        name: /corba/i,
      });
      expect(imgCorba).toBeInTheDocument();
    });

    const ingredientRadio = await screen.findByTestId(ingredientRadioConst);
    const searchRecipeBtn = await screen.findByTestId(searchRecipeBtnConst);

    act(() => {
      userEvent.type(searchInput, 'Salmon');
      userEvent.click(ingredientRadio);
      userEvent.click(searchRecipeBtn);
    });

    await waitFor(() => {
      const headingBaked = screen.getByRole('img', {
        name: /baked salmon with fennel & tomatoes/i,
      });
      expect(headingBaked).toBeInTheDocument();
    });
  });
  it('testa o filtro por nome no endpoint meals', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <AppProvider>
          <App />
        </AppProvider>
      </Router>,
    );
    history.push('/meals');

    const searchBtn = await screen.findByTestId(searchBtnIdConst);

    act(() => {
      userEvent.click(searchBtn);
    });

    const searchInput = await screen.findByTestId(searchInputConstant);

    expect(searchInput).toBeInTheDocument();

    await waitFor(() => {
      const imgCorba = screen.getByRole('img', {
        name: /corba/i,
      });
      expect(imgCorba).toBeInTheDocument();
    });

    const nameRadio = await screen.findByTestId(nameRadioConst);
    const searchRecipeBtn = await screen.findByTestId(searchRecipeBtnConst);

    act(() => {
      userEvent.type(searchInput, 'Salmon');
      userEvent.click(nameRadio);
      userEvent.click(searchRecipeBtn);
    });

    await waitFor(() => {
      const headingBaked = screen.getByRole('img', {
        name: /salmon prawn risotto/i,
      });
      expect(headingBaked).toBeInTheDocument();
    });
  });
  it('testa o filtro por primeira letra no endpoint meals', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <AppProvider>
          <App />
        </AppProvider>
      </Router>,
    );
    history.push('/meals');

    const searchBtn = await screen.findByTestId(searchBtnIdConst);

    act(() => {
      userEvent.click(searchBtn);
    });

    const searchInput = await screen.findByTestId(searchInputConstant);

    expect(searchInput).toBeInTheDocument();

    await waitFor(() => {
      const imgCorba = screen.getByRole('img', {
        name: /corba/i,
      });
      expect(imgCorba).toBeInTheDocument();
    });

    const firstLetterRadio = await screen.findByTestId(firstLetterRadioConst);
    const searchRecipeBtn = await screen.findByTestId(searchRecipeBtnConst);

    act(() => {
      userEvent.type(searchInput, 'Salmon');
      userEvent.click(firstLetterRadio);
      userEvent.click(searchRecipeBtn);
    });

    await waitFor(() => {
      const heading = screen.getByRole('img', {
        name: /spaghetti bolognese/i,
      });
      expect(heading).toBeInTheDocument();
    });
  });
  it('testa o filtro por primeira letra error no endpoint meals', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <AppProvider>
          <App />
        </AppProvider>
      </Router>,
    );
    history.push('/meals');

    const searchBtn = await screen.findByTestId(searchBtnIdConst);

    act(() => {
      userEvent.click(searchBtn);
    });

    const searchInput = await screen.findByTestId(searchInputConstant);

    expect(searchInput).toBeInTheDocument();

    await waitFor(() => {
      const imgCorba = screen.getByRole('img', {
        name: /corba/i,
      });
      expect(imgCorba).toBeInTheDocument();
    });

    const firstLetterRadio = await screen.findByTestId(firstLetterRadioConst);
    const searchRecipeBtn = await screen.findByTestId(searchRecipeBtnConst);

    act(() => {
      userEvent.type(searchInput, 'Salmon');
      userEvent.click(firstLetterRadio);
      userEvent.click(searchRecipeBtn);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('alert');
    });
  });
  it('testa o filtro por ingrediente em meals', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <AppProvider>
          <App />
        </AppProvider>
      </Router>,
    );
    history.push('/drinks');

    const searchBtn = await screen.findByTestId(searchBtnIdConst);

    act(() => {
      userEvent.click(searchBtn);
    });

    const searchInput = await screen.findByTestId(searchInputConstant);

    expect(searchInput).toBeInTheDocument();

    await waitFor(() => {
      const imgGG = screen.getByRole('img', {
        name: /gg/i,
      });
      expect(imgGG).toBeInTheDocument();
    });

    const ingredientRadio = await screen.findByTestId(ingredientRadioConst);
    const searchRecipeBtn = await screen.findByTestId(searchRecipeBtnConst);

    act(() => {
      userEvent.type(searchInput, 'lemon');
      userEvent.click(ingredientRadio);
      userEvent.click(searchRecipeBtn);
    });

    await waitFor(() => {
      const heading = screen.getByRole('img', {
        name: /a true amaretto sour/i,
      });
      expect(heading).toBeInTheDocument();
    });
  });
});