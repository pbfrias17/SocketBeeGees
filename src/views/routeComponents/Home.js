import io from 'socket.io-client';
import React from 'react';
import axios from 'axios';
import * as SocketEvent from '../../socket/SocketEvents';
import { connect } from 'react-redux';
import FormGroup from '../components/FormGroup';
import RouteComponentBase from './RouteComponentBase';
import JoinRoomForm from '../components/JoinRoomForm';
import SearchRoomForm from '../components/SearchRoomForm';
import CreateRoomForm from '../components/CreateRoomForm';
import AccountRegisterForm from '../components/AccountRegisterForm';
import { UpdateUser } from '../../actions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoadingRooms: true,
      activeRooms: new Array(),
    }

    this.user = window.user ? JSON.parse(window.user) : null;
  };

  componentWillMount(props) {
    this.props.updateUser(this.user);
  }

  componentDidMount() {
    if (this.user && this.user.roomNumber) {
      axios.get('/api/room?id=' + this.user.roomNumber)
        .then((res) => {
          if (res.data.success) {
            this.setState({ activeRooms: this.state.activeRooms.concat([res.data]) });
          }
        })
        .catch((err) => {
          console.log('ERR on GET /api/room?id=' + this.user.roomNumber);
        });
    }
  }

  renderRoomForm() {
    console.log(this.state.activeRooms);
    if (this.user) {
      if (this.user.roomNumber) {
        return <JoinRoomForm rooms={this.state.activeRooms} />;
      } else {
        return (
          <div style={{display: 'flex'}}>
            <CreateRoomForm />
            <SearchRoomForm />
          </div>
        );
      }
    } else {
      return <AccountRegisterForm />;
    }
  }

  render() {
    return (
      <RouteComponentBase hasNavBar={true}>
        {this.renderRoomForm()}
      </RouteComponentBase>
    );
  };
};

const mapStateToProps = (state) => (
  { user: state.user }
);

const mapDispatchToProps = (dispatch) => (
  { updateUser: (user) => dispatch(UpdateUser(user)) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);