
var Cell = React.createClass({
  getInitialState: function() {
    return {active: false};
  },
  setActive: function() {
    this.setState({active: !this.state.active});
  },
  render: function() {
    return (
      <label className={'custom-check' + (this.state.active ? ' active' : '')}>
        <input type="checkbox" onClick={this.setActive} />
      </label>
    );
  }
});

var Row = React.createClass({
  render: function() {
    var cells = [],
        i;
    for (i = 0; i < 25; i++) {
      cells.push(<Cell key={i} />);
    }
    return (
      <li className="clearfix">{cells}</li>
    );
  }
});

var QuizGrid = React.createClass({
  render: function() {
    var rows = [],
        i;
    for (i = 0; i < 25; i++) {
      rows.push(<Row key={i} />);
    }
    return (
      <ul className="quiz-grid">
        {rows}
      </ul>
    );
  }
});


ReactDOM.render(
  <QuizGrid />,
  document.getElementById('quiz')
);