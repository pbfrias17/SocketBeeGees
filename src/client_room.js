import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import Room from './views/routeComponents/Room';

const app = document.getElementById('app');
const store = createStore(reducer);

ReactDOM.render(
	<Provider store={store}>
		<Room />
	</Provider>, 
	app
);
