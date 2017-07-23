import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import RoomView from './views/RoomView';

const app = document.getElementById('app');
const store = createStore(reducer);

ReactDOM.render(
	<Provider store={store}>
		<RoomView />
	</Provider>, 
	app
);
