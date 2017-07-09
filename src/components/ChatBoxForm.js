import io from 'socket.io-client';
import * as SocketEvent from '../socket/SocketEvents';
import React from 'react';

class ChatBoxForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      textValue: '',
      roomNumber: 123,
    };

    this.handleTextInputChange = this.handleTextInputChange.bind(this);

    this.placeholder = 'Type here to chat with other BeeGee-ers in the room';

    this.socket = io.connect('http://localhost:3000');
    var { name, pin, roomNumber } = this.state;
    this.socket.emit(SocketEvent.USER_JOINROOM, { name, pin, roomNumber });

    this.socket.on(SocketEvent.SERVER_BROADCASTCHAT, (data) => {
      console.log('Receieved chat: ' + data.message);
      alert(data.message);
    });
  };

  handleTextInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div>
        <textarea cols='100' rows='4' placeholder={this.placeholder}
          name='textValue' value={this.state.textValue} onChange={this.handleTextInputChange}>
        </textarea> <br />
        <button onClick={this.props.handleChatSend}>Send</button>
      </div>
    );
  };
}

export default ChatBoxForm;
