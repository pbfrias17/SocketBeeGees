import React from 'react';
import { connect } from 'react-redux';
import NavBar from '../components/NavBar';

class RouteComponentBase extends React.Component {
  constructor(props) {
    super(props);
  }

  renderNavBar() {
    if (this.props.hasNavBar) {
      return <NavBar user={this.props.user}/>;
    } else {
      return '';
    }
  }

  render() {
    return (
      <div>
        {this.renderNavBar()}
        {this.props.children} 
      </div>
    );
  }
};

const mapStateToProps = (state) => (
  { user: state.user }
);

export default connect(mapStateToProps)(RouteComponentBase);