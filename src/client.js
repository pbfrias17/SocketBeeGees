import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import * as SocketEvent from './socket/SocketEvents.js';
import reducer from './reducers/reducer';
import io from 'socket.io-client';
import Routes from '../routes';
import { Router, Route, browserHistory } from 'react-router';
import HomePage from './components/HomePage';
import JoinRoomForm from './components/JoinRoomForm';
import ChatBoxForm from './components/ChatBoxForm';
//import Layout from "./components/Layout";

//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const app = document.getElementById('app');

const store = createStore(reducer, applyMiddleware(thunk));

var socket;

var Connect = () => {
	socket = io.connect('http://localhost:3000');
	socket.on(SocketEvent.ROOMJOIN_SUCCESS, (data) => {
		alert(data.message);
	});
};

var EmitLobby = () => {
	socket.emit('clientMessage', { message: 'sup beh' });
};

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory} routes={Routes} />
	</Provider>, 
	app
);
