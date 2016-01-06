var React = require('react');


var NoteItem = React.createClass({
  render: function() {
    return (
      <li className="list-group-item">
        <a href="#" className="control-btn glyphicon glyphicon-remove" alt="Delete note"></a>
        <a href="#" className="control-btn glyphicon glyphicon-edit" alt="Edit note"></a>
        <span className="title">{this.props.note.title}</span>
        <span className="note">{this.props.note.content}</span>
      </li>
    );
  }
});

module.exports = NoteItem;