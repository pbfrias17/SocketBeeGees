import io from 'socket.io-client';
import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as SocketEvent from '../socket/SocketEvents';
import { UpdateUser } from '../actions';
import JoinRoomForm from '../components/JoinRoomForm';


class JoinRoomView extends React.Component {
  constructor(props) {
    super(props);
  };

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
        Join A Room: <br/>
        <JoinRoomForm handleSubmit={this.attemptRoomJoin.bind(this)} />
      </div>
    );
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    UpdateUser: (userData) => dispatch(UpdateUser(userData)),
  };
};

export default connect(null, mapDispatchToProps)(JoinRoomView);