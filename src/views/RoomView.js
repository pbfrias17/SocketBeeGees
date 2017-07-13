import io from 'socket.io-client';
import React from 'react';
import { connect } from 'react-redux';
import * as SocketEvent from '../socket/SocketEvents';
import ChatBoxForm from '../components/ChatBoxForm';
import { SetRoomInfo } from '../actions';

class RoomView extends React.Component {
  constructor(props) {
    super(props);

    this.user = this.props.client;

    this.handleChatSend = this.handleChatSend.bind(this);
  };

  componentWillMount(props) {
    this.socket = io.connect('http://localhost:3000');
    this.socket.emit(SocketEvent.USER_ENTERROOM, { roomNumber: this.props.location.query.id }, (room) => {
      this.props.SetRoomInfo(room);
      console.log('Current room has ' + this.props.room.users.length + ' users');  
    });
    this.socket.on(SocketEvent.SERVER_BROADCASTROOMUPDATE, (room) => {
      console.log('another user joined');
      this.props.SetRoomInfo(room);
    });
    this.socket.on(SocketEvent.SERVER_BROADCASTCHAT, (data) => {
      console.log(data.sender + ' said: ' + data.message);
    });
  }

  shouldComponentUpdate(oldProps, newProps) {
    console.log('old props: ' + oldProps);
    console.log('new props: ' + newProps);    
    return true;
  }

  handleChatSend(message) {
    console.log('roomview sending...');
    this.socket.emit(SocketEvent.USER_SENDCHAT, { sender: 'dummyId', roomNumber: this.props.room.roomNumber, message });
  };

  displayUsers() {
    return this.props.room.users.map((user, i) => 
      <li key={i}>{user.username}</li>
    );
  };

  render() {
    return (
      <div>
        Users:<br/>
        <ul>
          {this.displayUsers()}
        </ul>
        <ChatBoxForm onSend={(message) => this.handleChatSend(message)} />
      </div>
    );
  };
};

const mapStateToProps = (state) => {
  return { room: state.room };
};

export default connect(mapStateToProps, { SetRoomInfo })(RoomView);
