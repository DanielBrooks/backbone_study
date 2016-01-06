window.listData = [
  {
    name: 'First name',
    amount: 'three'
  },
  {
    name: 'Second name',
    amount: 'five'
  }
];
var listOne = [
  {
    name: 'First name from list one',
    amount: 'three for L1'
  },
  {
    name: 'Second name from list one',
    amount: 'five for L1'
  }
];
var listTwo = [
  {
    name: 'First name from list two',
    amount: 'three for L2'
  },
  {
    name: 'Second name from list two',
    amount: 'five for L2'
  }
];

// TO DO: enable ui sortable for a list

var SwitchButton = React.createClass({
  render: function() {
    return (
      <button className="btn-switch" onClick={this.props.buttonClick}>{this.props.children}</button>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="item-comment">
        <h3>{this.props.itemObj.name}</h3>
        <span>{this.props.itemObj.amount}</span>
      </div>
    );
  }
});

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.setState({data: listData});
  },
  showFirstSet: function() {
    console.log('first set');
    this.setState({data: listOne});
  },
  showSecondSet: function() {
    console.log('second set');
    this.setState({data: listTwo});
  },
  render: function() {
    var listItems = this.state.data.map(function (item, index) {
      console.log(item);
      return (
        <Comment itemObj={item} key={index} />
      );
    });
    return (
      <div className="comment-box">
        Hello, world! I am a CommentBox.
        {listItems}
        <SwitchButton buttonClick={this.showFirstSet}>Display the first set of data</SwitchButton>
        <SwitchButton buttonClick={this.showSecondSet}>Display the second set of data</SwitchButton>
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);