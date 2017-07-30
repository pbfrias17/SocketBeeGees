import React from 'react';
import axios from 'axios';

class FormGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = { formError: null };
    this.props.forms.forEach(form => {
      this.state[form.name] = form.type === 'number' ? NaN : '';
    });

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleInputChange(event) {
    const name = event.target.name;
    const value = (event.target.type === "number") ? parseInt(event.target.value) : event.target.value;
 
    this.setState({
      [name]: value
    });
  };

  handleSubmit(event) {
    var errorCaught = false;
    this.props.forms.forEach(form => {
      if (form.required && !errorCaught) {
        if ((form.type === 'number' && Number.isNaN(this.state[form.name])) 
            || (form.type !== 'number' && this.state[form.name] === '')) {
          this.setState({ formError: 'Missing required information.' })
          errorCaught = true;
          event.preventDefault();
        }
      }
    });
  }

  renderFormError() {
    if (this.state.formError) {
      return <div className='alert alert-danger'>{this.state.formError}</div>;
    }
  }

  renderForms() {
    return this.props.forms.map((form, i) =>
      <div key={i} >
        <input
          id={form.name}
          name={form.name}
          placeholder={form.placeholder}
          type={form.type}
          value={this.state[form.name]}
          onChange={this.handleInputChange} />
        <br />
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>{this.props.groupLabel}</h3>
        <form onSubmit={this.handleSubmit} action={this.props.formAction} method='POST'>
          {this.renderFormError()}
          {this.renderForms()}
          <button>{this.props.submitText}</button>
        </form>
      </div>
    );
  };
}

export default FormGroup;
