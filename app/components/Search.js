var React = require('react');
//search bar
var Search = React.createClass({

  getInitialState() {
    return { value: '' };
  },

  handleChange(event) {
    this.setState({value: event.target.value});
  },

  handleSubmit(event){

    event.preventDefault();

    // When the form is submitted, call the onSearch callback that is passed to the component

    this.props.onSearch(this.state.value, null, true);

    // Unfocus the text input field
    this.getDOMNode().querySelector('input').blur();
  },

  render() {

    return (
      //https://facebook.github.io/react/docs/forms.html
      <form id="geocoding_form" className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <div className="col-xs-12 col-md-6 col-md-offset-3">
            <div className="input-group">
              <div className="styled-select">
              <label>Crime Categories</label>
                <select onChange={this.props.onFilter}>
                    <option value="default">Choose a filter</option>
                    <option value="Assault">Assault</option>
                    <option value="Theft/Larceny">Theft/Larceny</option>
                    <option value="Burglary">Burglary</option>
                    <option value="Vandalism">Vandalism</option>
                    <option value="Drugs/Alcohol Violations">Drugs/Alcohol Violations</option>
                    <option value="Motor Vehicle Theft">Motor Vehicle Theft</option>
                </select>
              </div>
            
          
            </div>
          </div>
        </div>
      </form>
    );

  }
});

module.exports = Search;
