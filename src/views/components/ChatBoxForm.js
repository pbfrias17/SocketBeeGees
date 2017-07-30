import io from 'socket.io-client';
import * as SocketEvent from '../../socket/SocketEvents';
import React from 'react';

class ChatBoxForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatText: '',
    };

    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.placeholder = 'Type here to chat with other BeeGee-ers in the room';
  };

  handleTextInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  };

  handleSend() {
    console.log('hit send');
    console.log(this.props.onSend(this.state.chatText));
    this.setState({ chatText: '' });
  }

  render() {
    return (
      <div>
        <textarea cols='100' rows='4' placeholder={this.placeholder}
          name='chatText' value={this.state.chatText} onChange={this.handleTextInputChange}>
        </textarea> <br />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  };
}

export default ChatBoxForm;
