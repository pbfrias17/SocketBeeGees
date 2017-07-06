import io from 'socket.io-client';
import * as SocketEvent from '../socket/SocketEvents';
import React from 'react';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <div>
        <h1>Be Legendary!</h1>
        <img src="http://ecx.images-amazon.com/images/I/81n8CQrtjfL._SL1500_.jpg" height="500" width="750" />
        <br />
        {this.props.children}
      </div>
    );
  };
}

export default HomePage;
