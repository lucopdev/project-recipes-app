import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import {
  fetchCategories,
  fetchFullRecipe,
} from '../../services/fetchs_functions';
import FilterButton from '../filterButtons/FilterButton';

function Recipes({ data }) {
  const [categories, setCategories] = useState([]);
  const [prevTarget, setPrevTarget] = useState('');
  const history = useHistory();
  const {
    apiType,
    isClicked,
    isFiltered,
    setApiType,
    setApiData,
    apiCategory,
    setIsFiltered,
  } = useContext(AppContext);

  useEffect(() => {
    const runFetch = async () => {
      if (history.location.pathname === '/meals') {
        if (!isFiltered) {
          const resultRecipe = await fetchFullRecipe('Meal');
          const resultCat = await fetchCategories('meals');
          setApiType('Meal');
          setApiData(resultRecipe);
          setCategories(resultCat);
        } else {
          const resultCat = await fetchCategories('meals');
          setApiType('Meal');
          setCategories(resultCat);
        }
      }
      if (history.location.pathname === '/drinks') {
        if (!isFiltered) {
          const resultRecipe = await fetchFullRecipe('Drink');
          const resultCat = await fetchCategories('drinks');
          setApiType('Drink');
          setApiData(resultRecipe);
          setCategories(resultCat);
        } else {
          const resultCat = await fetchCategories('drinks');
          setApiType('Drink');
          setCategories(resultCat);
        }
      }
    };
    runFetch();
  }, [
    history.location.pathname,
    setApiType,
    setApiData,
    apiCategory,
    isFiltered,
  ]);

  const handleAll = () => {
    setIsFiltered(false);
  };

  const handleClick = (target) => {
    if (prevTarget !== target.innerText) {
      setIsFiltered(true);
      setPrevTarget(target.innerText);
    } else {
      setIsFiltered(false);
      setPrevTarget(target.innerText);
    }
  };

  const limit = 12;
  const catLimit = 5;

  return (
    <div className="foods-body">
      <div className="foods-filters">
        <button
          className="filter-button"
          data-testid="All-category-filter"
          onClick={ handleAll }
        >
          All
        </button>
        {categories.slice(0, catLimit).map((category, index) => (
          <FilterButton
            key={ index }
            className={ isFiltered ? 'filter-button-on' : 'filter-button' }
            innerText={ category.strCategory }
            categoryName={ category.strCategory }
            action={ handleClick }
          />
        ))}
      </div>
      <div className="foods-container">
        {!isClicked && data?.slice(0, limit).map((recipe, index) => (
          <Link
            className="foods-link"
            to={ `/${apiType.toLowerCase()}s/${recipe[`id${apiType}`]}` }
            key={ index }
          >
            <div
              className="foods-board"
              data-testid={ `${index}-recipe-card` }
            >
              <img
                className="foods-img"
                data-testid={ `${index}-card-img` }
                height="150"
                width="150"
                src={ recipe[`str${apiType}Thumb`] }
                alt={ recipe[`str${apiType}`] }
              />
              <p
                className="foods-card-p"
                data-testid={ `${index}-card-name` }
              >
                {recipe[`str${apiType}`]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

Recipes.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Recipes;
