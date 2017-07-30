import io from 'socket.io-client';
import React from 'react';
import { connect } from 'react-redux';
import * as SocketEvent from '../../socket/SocketEvents';
import ChatBoxForm from '../components/ChatBoxForm';
import { UpdateUser, SetRoomInfo } from '../../actions';

class Room extends React.Component {
  constructor(props) {
    super(props);
    
    this.room = JSON.parse(window.room);
    this.user = window.user ? JSON.parse(window.user) : null;

    this.handleChatSend = this.handleChatSend.bind(this);
  };

  componentWillMount(props) {
    this.props.updateUser(this.user);
    this.props.setRoomInfo(this.room);
    this.socket = io.connect('http://localhost:3000');

    this.socket.emit(SocketEvent.USER_JOINROOM, this.room.roomNumber);

    this.socket.on(SocketEvent.SERVER_BROADCASTROOMUPDATE, (room) => {
      console.log('another user joined');
      console.log(room);
      this.props.setRoomInfo(room);
    });
    this.socket.on(SocketEvent.SERVER_BROADCASTCHAT, (data) => {
      console.log(data.sender.username + ' said: ' + data.message);
    });
    this.socket.on('disconnect', (reason) => {
      console.log('client disconnected');
      console.log(reason);
    });
  }

  handleChatSend(message) {
    this.socket.emit(SocketEvent.USER_SENDCHAT, { sender: this.props.user, roomNumber: this.props.room.roomNumber, message });
  };

  displayUsers() {
    return this.props.room.users.map((user, i) => 
      <li key={i}>{user.username}</li>
    );
  };

  render() {
    return (
      <div>
        <h4>Welcome to room {this.props.room.roomNumber}</h4>
        <br />
        <ul>{this.displayUsers()}</ul>
        <ChatBoxForm onSend={(message) => this.handleChatSend(message)} />
      </div>
    );
  };
};

const mapStateToProps = (state) => {
  return { 
    room: state.room,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => (
  { 
    updateUser: (user) => dispatch(UpdateUser(user)),
    setRoomInfo: (room) => dispatch(SetRoomInfo(room)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Room);
