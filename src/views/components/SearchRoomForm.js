import React from 'react';
import FormGroup from './FormGroup';

class SearchRoomForm extends React.Component {
  constructor(props) {
    super(props);

    this.searchRoomForms = [
      {
        name: 'roomNumber',
        placeholder: 'Room Number',
        type: 'number',
      },
      { 
        name: 'pin',
        placeholder: 'PIN (if room is private)',
        type: 'password',
      },
    ];
  };

  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">SEARCH FOR A ROOM</h3>
        </div>
        <div className="panel-body">
          <FormGroup
            formAction='/join'
            forms={this.searchRoomForms}
            submitText="Join" />
        </div>
      </div>
    );
  };
}

export default SearchRoomForm;
