import { connect } from 'react-redux';
import React from 'react';
import RoomCard from './RoomCard';

class JoinRoomForm extends React.Component {
  constructor(props) {
    super(props);
  };

  renderRooms() {
    return this.props.rooms.map(((room, i) =>
      <RoomCard key={i} room={room} />
    ));
  }

  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">REJOIN A ROOM</h3>
        </div>
        <div className="panel-body">
          Active Rooms: <br/>
          {this.renderRooms()}
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => ( 
  { user: state.user, }
);

export default connect(mapStateToProps, null)(JoinRoomForm);
