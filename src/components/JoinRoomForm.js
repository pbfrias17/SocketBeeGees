import React from 'react';

class JoinRoomForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      pin: '',
      roomNumber: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  };

  handleInputChange(event) {
    const name = event.target.name;
    const value = (event.target.type === "number") ? parseInt(event.target.value) : event.target.value;
 
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div>
        <label>
          Name:
          <input name="username" type="text" value={this.state.name} onChange={this.handleInputChange} />
        </label><br />
        <label>
          PIN:
          <input name="pin" type="number" value={this.state.pin} onChange={this.handleInputChange} />
        </label><br />
        <label>
          Room Number:
          <input name="roomNumber" type="number" value={this.state.roomNumber} onChange={this.handleInputChange} />
        </label><br />
        <button onClick={() => this.props.handleSubmit(this.state)}>Join</button>
      </div>
    );
  };
}

export default JoinRoomForm;
