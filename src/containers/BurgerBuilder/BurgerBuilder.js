import React, {Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {

  // Constructor syntax
  // constructor(props) {
  //   super(props);
  //   this.state = {...};
  // }

  // Modern and shorter syntax of the constructor
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    this.setupIngredients();
  }

  setupIngredients() {
    axios.get('/ingredients.json')
      .then(response => {
        this.setState({
          ingredients: response.data
        });
      })
      .catch(error => {
        this.setState({error: true});
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients).map(key => {
      return ingredients[key];
    }).reduce((total, actual)=>{
      return total + actual;
    }, 0);

    this.setState({
      purchaseable: sum > 0
    });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;
    const newTotalPrice = this.state.totalPrice + INGREDIENT_PRICES[type];

    this.setState({ 
      ingredients: updatedIngredients,
      totalPrice: newTotalPrice 
    });

    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];

    if(oldCount <= 0) {
      return;
    }

    const updatedCount = oldCount - 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedCount;
    const newTotalPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

    this.setState({ 
      ingredients: updatedIngredients,
      totalPrice: newTotalPrice 
    });

    this.updatePurchaseState(updatedIngredients);
  }
 
  purchaseHandler = () => {
    this.setState({
      purchasing: !this.state.purchasing
    });
  }

  purchaseContinueHandler = () => {
    // alert('You continue!');
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Andrea Femirroja',
        address: {
          street: 'Culete 8, 4D',
          zipCode: '03300',
          country: 'Spain'
        },
        email: 'femi@femi.com'
      },
      deliveryMethod: 'fastest'
    };

    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(error => {
        this.setState({ loading: false, purchasing: false });
      });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;

    if(this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls 
            add={this.addIngredientHandler} 
            remove={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchaseable={this.state.purchaseable}
            orderClick={this.purchaseHandler} />
        </Aux>
      );

      orderSummary = (
        <OrderSummary 
          ingredients={this.state.ingredients}
          totalPrice={this.state.totalPrice}
          cancel={this.purchaseHandler}
          continue={this.purchaseContinueHandler} />
      );
    }

    if(this.state.loading) {
      orderSummary = <Spinner />;
    }

    return(
      <Aux>
        <Modal show={this.state.purchasing} clickBackdrop={this.purchaseHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);