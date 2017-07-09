import io from 'socket.io-client';
import * as SocketEvent from '../socket/SocketEvents';
import React from 'react';
import { browserHistory } from 'react-router';

class JoinRoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pin: '',
      roomNumber: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentWillMount(props) {

  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    var { name, pin, roomNumber } = this.state;
    var socket = io.connect('http://localhost:3000');
    socket.emit(SocketEvent.USER_JOINREQUEST, {name, pin, roomNumber});
    socket.on(SocketEvent.SERVER_JOINSUCCESS, (res) => {
      browserHistory.push('/room/' + res.roomNumber);
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} />
        </label><br />
        <label>
          PIN:
          <input name="pin" type="text" value={this.state.pin} onChange={this.handleInputChange} />
        </label><br />
        <label>
          Room Number:
          <input name="roomNumber" type="text" value={this.state.roomNumber} onChange={this.handleInputChange} />
        </label><br />
        <input type="submit" value="Join Room" />
      </form>
    );
  };
}

export default JoinRoomForm;
