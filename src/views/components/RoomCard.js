import React from 'react';

class RoomCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    window.location = '/room?id=' + this.props.room.roomNumber;
  }

  render() {
    return (
      <div className='panel panel-info clickable' style={style.container} onClick={this.handleClick}>
        <div className='panel-heading' style={style.heading}>
          <div className='panel-heading'>#{this.props.room.roomNumber}</div>
        </div>
        <div className='panel-body' style={style.body}>
          MARVEL LEGENDARY
        </div>
        <div className='panel-footer' style={style.footer}>
          {this.props.room.userCount} player{this.props.room.userCount > 1 ? 's' : ''}
        </div>
      </div>
    )
  }
}

const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', 
    width: 130,
    height: 220
  },
  heading: {
    flex: 1
  },
  body: {
    flex: 3,
  },
  footer: {
    flex: 1
  }
};

export default RoomCard;