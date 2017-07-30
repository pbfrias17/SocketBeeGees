import React from 'react';

class FormGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.props.forms.forEach((form) => {
      this.state[form.name] = form.type === 'number' ? NaN : '';
    });

    this.handleInputChange = this.handleInputChange.bind(this);
  };

  handleInputChange(event) {
    const name = event.target.name;
    const value = (event.target.type === "number") ? parseInt(event.target.value) : event.target.value;
 
    this.setState({
      [name]: value
    });
  };

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
        <form action={this.props.formAction} method='post'>
          {this.renderForms()}
          <input type="submit" value={this.props.submitText} />
        </form>
      </div>
    );
  };
}

export default FormGroup;
