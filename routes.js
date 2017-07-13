import React from 'react';
import { Route, IndexRoute } from 'react-router';
import HomePage from './src/components/HomePage';
import JoinRoomView from './src/views/JoinRoomView';
import RoomView from './src/views/RoomView';

const routes = (
  <Route path='/' component={HomePage}>
    <Route path='join' component={JoinRoomView} />
    <Route path="room" component={RoomView} />
  </Route>
);

export default routes;
