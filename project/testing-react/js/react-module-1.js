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



var SwitchButton = React.createClass({
  render: function() {
    return (
      <button className="btn-switch" onClick={this.props.innerClick}>{this.props.children}</button>
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
  //getInitialState: function() {
  //  return {
  //    inState:
  //  }
  //},
  testingDep: function() {
    console.log('from dep');
  },
  showFirstSet: function(e) {
    console.log(e);
    console.log('first set');
    this.testingDep();
  },
  render: function() {
    var listItems = this.props.data.map(function (item, index) {
      console.log(item);
      return (
        <Comment itemObj={item} key={index} />
      );
    });
    return (
      <div className="comment-box">
        Hello, world! I am a CommentBox.
        {listItems}
        <SwitchButton innerClick={this.showFirstSet}>Display the first set of data</SwitchButton>
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox data={listData} />,
  document.getElementById('content')
);