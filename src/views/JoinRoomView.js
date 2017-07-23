import io from 'socket.io-client';
import React from 'react';
import * as SocketEvent from '../socket/SocketEvents';
import JoinRoomForm from '../components/JoinRoomForm';


class JoinRoomView extends React.Component {
  constructor(props) {
    super(props);
    this.userId = window.userId;
  };

  componentWillMount(props) {

  }

  attemptRoomJoin(formData) {
    var { username, pin, roomNumber } = formData;
    var socket = io.connect('http://localhost:3000');
    socket.emit(SocketEvent.USER_JOINREQUEST, { username, pin, roomNumber }, (res) => {
      if (res.success) {
        socket.emit(SocketEvent.USER_JOINROOM, { user: formData });
        browserHistory.push('/room?id=' + res.roomNumber);
      }
    });
  };

  render() {
    return (
      <div>
        Join a Room by Room Number: <br/>
        <JoinRoomForm handleSubmit={this.attemptRoomJoin.bind(this)} />
      </div>
    );
  };
};

export default JoinRoomView;