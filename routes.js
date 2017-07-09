import React from 'react';
import { Route, IndexRoute } from 'react-router';
import HomePage from './src/components/HomePage';
import JoinRoomForm from './src/components/JoinRoomForm';
import RoomView from './src/views/RoomView';

const routes = (
  <Route path='/' component={HomePage}>
    <Route path='join' component={JoinRoomForm} />
    <Route path="room/:roomId" component={RoomView} />
  </Route>
);

export default routes;
