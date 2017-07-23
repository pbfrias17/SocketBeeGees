import io from 'socket.io-client';
import React from 'react';
import { connect } from 'react-redux';
import * as SocketEvent from '../socket/SocketEvents';
import ChatBoxForm from '../components/ChatBoxForm';
import { SetUserInfo, SetRoomInfo } from '../actions';

class RoomView extends React.Component {
  constructor(props) {
    super(props);
    this.roomNumber = window.roomNumber;
    this.userId = window.userId;
    this.handleChatSend = this.handleChatSend.bind(this);
  };

  componentWillMount(props) {
    this.socket = io.connect('http://localhost:3000');
    // this.socket.emit(SocketEvent.USER_GETROOM, { roomNumber: this.roomNumber }, (room) => {
    //   this.props.SetRoomInfo(room); 
    // });
    this.socket.on(SocketEvent.SERVER_BROADCASTROOMUPDATE, (room) => {
      console.log('another user joined');
      this.props.SetRoomInfo(room);
    });
    this.socket.on(SocketEvent.SERVER_BROADCASTCHAT, (data) => {
      console.log(data.sender.username + ' said: ' + data.message);
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
        {/*YOU ARE: {this.props.user.username} <br/>*/}
        {/*Users:<br/>
        <ul>
          {this.displayUsers()}
        </ul>*/}
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

export default connect(mapStateToProps, { SetRoomInfo })(RoomView);
