var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');
var CreateForm = require('../components/CreateForm');
var NotesList = require('../components/NotesList');

var Validation = require('../components/Validation');

var assign = require('object-assign');
var assignDeep = require('object-assign-deep');

function getMainSectionState() {
  return {
    notes: AppStore.getAllNotes(),
    formState: {
      title: '',
      content: '',
      errors: {}
    }
  }
}

var MainSection = React.createClass({
  getInitialState: function() {
    return getMainSectionState();
  },
  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChangeField: function(field) {
    this.setState({formState: assign({}, this.state.formState, {[field.name]: field.value})});
  },
  _onCreateNote: function(note) {
    note.errors = Validation.note(note);
    if (note.errors.validationError) {
      this.setState({formState: note});
    }
    else {
      //delete note.errors;
      AppActions.createNote(note);
      //this.setState({formState: note});
    }
    //console.log(' > ', note);
    //console.log('>> ', this.state.formState);
  },
  _onChange: function() {
    //console.log(11);
    this.setState(getMainSectionState());
  },
  render: function() {
    console.log('Main Section render state > ', this.state);
    return (
      <div className="main-section">
        <h1 className="text-center">Testing FLUX</h1>
        <div className="container">
          <h2>New note creation page</h2>
          <div className="row">
            <div className="col-xs-6">
              <CreateForm
                onCreateNote={this._onCreateNote}
                formState={this.state.formState}
                onChangeField={this._onChangeField}
              />
            </div>
            <div className="col-xs-6">
              <NotesList notes={this.state.notes} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MainSection;