import React from 'react';
import FormGroup from './FormGroup';

class AccountRegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.accountRegisterForms = [
      {
        name: 'username',
        placeholder: 'username',
        type: 'text',
      },
      { 
        name: 'password',
        placeholder: 'password',
        type: 'password',
      },
      { 
        name: 'confirmPassword',
        placeholder: 'confirmPassword',
        type: 'password',
      }
    ];
  };

  render() {
    return (
      <div className="panel panel-primary">
          <div className='panel-heading'>Account Registration</div>
        <FormGroup
          formAction='/register'
          groupLabel="Create a new account:"
          forms={this.accountRegisterForms}
          submitText="Create Account" />
      </div>
    );
  };
}

export default AccountRegisterForm;
