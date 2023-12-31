import React, { useContext, useEffect, useState } from 'react';
import copy from 'clipboard-copy';
import { useHistory } from 'react-router-dom';
import AppContext from '../../context/AppContext';

import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import Recomended from '../../components/recomended/Recomended';
import StartRecipeButton from '../../components/startRecipeButton/StartRecipeButton';
import { fetchById } from '../../services/fetchs_functions';
import './recipeDetails.css';
import IngredientsList from '../../components/ingredientsList/IngredientsList';

function RecipeDetails() {
  const { apiType, setApiType, recipeId, setRecipeId } = useContext(AppContext);
  const history = useHistory();
  const [recipe, setRecipe] = useState([]);
  const [embed, setEmbed] = useState('');
  const [isShareClicked, setIsShareClicked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const getStoredFavorites = () => {
    if (!JSON.parse(localStorage.getItem('favoriteRecipes'))) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([]));
    }
    const recipeFound = JSON.parse(localStorage.getItem('favoriteRecipes'));
    return recipeFound;
  };

  const [favoriteToStore, setFavoriteToStore] = useState(getStoredFavorites());

  useEffect(() => {
    const type = history.location.pathname.split('/')[1];
    setRecipeId(history.location.pathname.replace(/\D/g, ''));
    const runFetchId = async () => {
      const id = history.location.pathname.split('/')[2];
      const result = await fetchById(type, id);
      setRecipe(result);
      if (type === 'meals') {
        setApiType('Meal');
      }
      if (type === 'drinks') {
        setApiType('Drink');
      }
    };
    runFetchId();
  }, [apiType, setApiType, history.location.pathname, setRecipeId, recipeId]);

  useEffect(() => {
    const createYoutubeEmbed = () => {
      const indexSplice1 = 3;
      const indexSplice2 = 4;
      if (recipe.length) {
        const youtubeLink = recipe[0].strYoutube;
        const link = youtubeLink.split('/');
        link.splice(indexSplice1, 0, 'embed');
        const id = link[4].split('=');
        link.splice(indexSplice2, 1, id[1]);
        setEmbed(link.join('/'));
      }
    };
    if (history.location.pathname.includes('/meals')
    && history.location.pathname !== '/meals/52968') { createYoutubeEmbed(); }
  }, [recipe, history.location.pathname]);

  const handleShare = () => {
    const limit = 3;
    copy(`http://localhost:3000${history.location.pathname.split('/').slice(0, limit).join('/')}`);
    setIsShareClicked(true);
  };

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteToStore));
    if (JSON.parse(localStorage.getItem('favoriteRecipes'))) {
      const favorited = JSON.parse(localStorage.getItem('favoriteRecipes'));
      const favoriteFound = favorited.find((favorite) => favorite.id === recipeId);
      if (favoriteFound) {
        setIsFavorited(true);
      } else {
        setIsFavorited(false);
      }
    }
  }, [recipeId, favoriteToStore]);

  const handleDoneRecipes = async () => {
    const type = history.location.pathname.split('/')[1];
    const dateNow = new Date();
    // const recipeFound = await fetchById(type, recipeId);
    const {
      idDrink, idMeal, strCategory, strAlcoholic, strArea,
      strMeal, strDrink, strDrinkThumb, strMealThumb, strTags,
    } = recipe[0];
    let newType = '';
    let newTags = [];

    if (type === 'meals') newType = 'meal';
    if (type === 'drinks') newType = 'drink';
    if (strTags !== null) newTags = strTags?.split(',');
    if (strTags === null) newTags = [];

    const newDone = {
      id: (type === 'meals' ? idMeal : idDrink),
      nationality: strArea || '',
      name: (type === 'meals' ? strMeal : strDrink),
      category: strCategory || '',
      image: (type === 'meals' ? strMealThumb : strDrinkThumb),
      tags: (type === 'meals' ? newTags : []),
      alcoholicOrNot: strAlcoholic || '',
      type: newType,
      doneDate: dateNow.toISOString(),
    };

    localStorage.setItem('doneRecipes', JSON.stringify([newDone]));
  };

  const handleFavorites = async () => {
    const type = history.location.pathname.split('/')[1];
    const recipeFound = await fetchById(type, recipeId);
    const limit = -1;
    const {
      idDrink, idMeal, strCategory, strAlcoholic, strArea,
      strMeal, strDrink, strDrinkThumb, strMealThumb,
    } = recipeFound[0];

    const newFavorite = {
      id: (apiType === 'Meal' ? idMeal : idDrink),
      type: type.slice(0, limit),
      nationality: strArea || '',
      category: strCategory,
      alcoholicOrNot: strAlcoholic || '',
      name: (apiType === 'Meal' ? strMeal : strDrink),
      image: (apiType === 'Meal' ? strMealThumb : strDrinkThumb),
    };

    setFavoriteToStore((prevState) => {
      const isFavorite = prevState.some(
        (favorite) => favorite.id === newFavorite.id,
      );
      if (isFavorite) {
        setIsFavorited(false);
        return prevState.filter((favorite) => favorite.id !== newFavorite.id);
      }
      setIsFavorited(true);
      return [...prevState, newFavorite];
    });
  };

  return (
    <div className="details-body">
      <h1>Recipe Details</h1>
      {recipe?.map((details, index) => (
        <div
          className="details-div"
          key={ index }
        >
          <img
            className="details-image"
            data-testid="recipe-photo"
            width="220px"
            height="220px"
            src={ details[`str${apiType}Thumb`] }
            alt={ details[`str${apiType}`] }
          />
          {isShareClicked && (
            <span
              className="link-copied"
            >
              Link copied!

            </span>
          ) }
          <div className="details-buttons-div">
            <button
              className="buttons"
              onClick={ handleShare }
            >
              <img
                className="btn-share"
                data-testid="share-btn"
                src={ shareIcon }
                alt="btn"
              />
            </button>
            <button
              className="buttons"
              onClick={ handleFavorites }
            >
              <img
                data-testid="favorite-btn"
                src={ !isFavorited ? whiteHeartIcon : blackHeartIcon }
                alt="btn"
              />
            </button>
          </div>
          <h2
            data-testid="recipe-title"
          >
            { details[`str${apiType}`] }
          </h2>
          <p
            data-testid="recipe-category"
          >
            {history.location.pathname.includes('/meals')
              ? details.strCategory : details.strAlcoholic }
          </p>
          <IngredientsList />
          <h1>Instructions</h1>
          <p
            className="details-instructions"
            data-testid="instructions"
          >
            {details.strInstructions}
          </p>
          {history.location.pathname.includes('/meals') && (
            <iframe
              className="details-iframe"
              data-testid="video"
              width="360"
              height="315"
              src={ embed }
              title="YouTube video player"
            />
          )}
          <Recomended />
        </div>
      ))}
      <StartRecipeButton handleDoneRecipes={ handleDoneRecipes } />
    </div>
  );
}

export default RecipeDetails;
