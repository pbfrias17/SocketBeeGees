import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import Home from './views/routeComponents/Home';

const app = document.getElementById('app');
const store = createStore(reducer);

ReactDOM.render(
	<Provider store={store}>
	  <Home />
	</Provider>, 
	app
);
