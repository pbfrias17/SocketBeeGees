import io from 'socket.io-client';
import * as SocketEvent from '../socket/SocketEvents';
import React from 'react';
import ChatBoxForm from '../components/ChatBoxForm';

class RoomView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChatSend = this.handleChatSend.bind(this);
  };

  componentWillMount(props) {
    // var socket = io.connect('http://localhost:3000');
    // var { name, pin, roomNumber } = this.state;
    // socket.emit(SocketEvent.USER_JOINROOM, { name, pin, roomNumber });
  }

  handleChatSend(event) {
    this.socket.emit('USER_SENDCHAT', { clientId: 'dummyId', roomNumber: 123, message: this.state.textValue });
    this.state.textValue = '';
  };

  render() {
    return (
      <ChatBoxForm onSend={this.handleChatSend} />
    );
  };
}

export default RoomView;
