var React = require('react');

var CreateForm = React.createClass({
  _handleChangeTitle: function(e) {
    this.props.onChangeField({name: 'title', value: e.target.value});
  },
  _handleChangeContent: function(e) {
    this.props.onChangeField({name: 'content', value: e.target.value});
  },
  _onCreateNote: function() {
    this.props.onCreateNote({
      title: this.props.formState.title,
      content: this.props.formState.content
    });
  },
  render: function() {
    var errorNodes = {},
        errors = this.props.formState.errors,
        i;
    for (prop in errors) {
      errorNodes[prop] = <span className="error-text">{errors[prop]}</span>;
    }
    return (
      <form>
        <ul>
          <li className="form-group">
            <input
              type="text"
              name="title"
              className="form-control"
              onChange={this._handleChangeTitle}
              value={this.props.formState.title}
              placeholder="Title"
            />
            {errorNodes.title}
          </li>
          <li className="form-group">
            <textarea
              name="content"
              className="form-control"
              onChange={this._handleChangeContent}
              value={this.props.formState.content}
              placeholder="Note content">
            </textarea>
            {errorNodes.content}
          </li>
          <li>
            <button type="button" onClick={this._onCreateNote} className="btn btn-primary">Create note</button>
          </li>
        </ul>
      </form>
    );
  }
});

module.exports = CreateForm;