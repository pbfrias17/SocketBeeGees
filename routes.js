import React from 'react';
import { Route, IndexRoute } from 'react-router';
import HomePage from './src/components/HomePage';
import JoinRoomForm from './src/components/JoinRoomForm';
import ChatBoxForm from './src/components/ChatBoxForm';

const routes = (
  <Route path='/' component={HomePage}>
    <Route path='join' component={JoinRoomForm} />
    <Route path="room/:roomId" component={ChatBoxForm} />
  </Route>
);

export default routes;
