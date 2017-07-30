import React from 'react';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderUserNav() {
    if (this.props.user) {
      return (
        <ul className='nav navbar-nav navbar-right'>
          <li><p className='navbar-text'><b>{this.props.user.username}</b></p></li>
          <li><p className='navbar-text'> | </p></li>
          <li><a href='/logout'> Logout </a></li>
        </ul>
      );
    } else {
      return (
        <ul className='nav navbar-nav navbar-right'>
          <li><a href='/register'>Create Account</a></li>
          <li><p className='navbar-text'> | </p></li>
          <li>      
            <form className="navbar-form" action='/login' method='POST'>
              <div className="form-group">
                <input type="text" className="form-control" name='username' placeholder="username" />
                <input type='password' className='form-control' name='password' placeholder='password' />
              </div>
              <button type="submit" className="btn btn-default">Login</button>
            </form>
          </li>
        </ul>
      );
    }
  }

  render() {
    return (
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className='collapse navbar-collapse'>
            <ul className='nav navbar-nav'>
              <li><a href='/'><span className='glyphicon glyphicon-home'></span></a></li>
              <li><p className='navbar-brand'>SocketBeeGees</p></li>
              <li><p className='navbar-text'> | </p></li>
              <li><p className='navbar-text'>Board Games with Socket.io</p></li>
            </ul>
            {this.renderUserNav()}
          </div>
        </div>
      </nav>
    );
  }
};

export default NavBar;