var React = require('react');
var NoteItem = require('../components/NoteItem');


var NotesList = React.createClass({
  render: function() {
    var i,
        notesData = this.props.notes,
        notes = [];
    for (i = 0; i < notesData.length; i++) {
      notes.push(<NoteItem key={notesData[i].id} note={notesData[i]} />);
    }
    return (
      <ul className="list-group notes-list">
        {notes}
      </ul>
    );
  }
});

module.exports = NotesList;