import React from 'react';
import FormGroup from './FormGroup';

class CreateRoomForm extends React.Component {
  constructor(props) {
    super(props);

    this.createRoomForms = [
      {
        name: 'roomNumber',
        placeholder: 'Room Number',
        type: 'number',
        required: true
      },
      { 
        name: 'pin',
        placeholder: 'PIN (if room will be private)',
        type: 'password',
      },
    ];
  };

  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">CREATE A ROOM</h3>
        </div>
        <div className="panel-body">
          <FormGroup
            formAction='/create'
            forms={this.createRoomForms}
            submitText="Create" />
        </div>
      </div>
    );
  };
}

export default CreateRoomForm;
