import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = ( props ) => {
  // Mi propuesta para devolver el array de <BurgerIngredients />
  // let ingredients = [];
  // if(props.ingredients) {
  //   Object.keys(props.ingredients).forEach(function(key) {
  //     for(let i = 0; i<props.ingredients[key]; i++) {
  //       ingredients.push(<BurgerIngredient type={key} />);
  //     }
  //   });
  // }

  // Solución del curso
  let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        return <BurgerIngredient key={igKey + i} type={igKey} />
      });
    })
    .reduce((arr, el) => { // reduce((total, actual)), valor inicial)
      return arr.concat(el);
    }, []);

  if(transformedIngredients.length === 0) {
    transformedIngredients = <p>Please add some ingredients!</p>;
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
}

export default burger;