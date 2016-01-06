var presetData = [
  [4,4],[4,5],[4,13],[4,14],[4,22],
  [9,7],[9,8],[9,11],[9,15],[9,16],[9,19],
  [17,7],[17,12],[17,17],[17,21],
  [22,4],[22,5],[22,10],[22,11],[22,16],[22,21],[22,22]
];
var rowGuides = [
  [7,3,1,1,7],
  [1,1,2,2,1,1],
  [1,3,1,3,1,1,3,1],
  [1,3,1,1,6,1,3,1],
  [1,3,1,5,2,1,3,1],
  [1,1,2,1,1],
  [7,1,1,1,1,1,7],
  [3,3],
  [1,2,3,1,1,3,1,1,2],
  [1,1,3,2,1,1],
  [4,1,4,2,1,2],
  [1,1,1,1,1,4,1,3],
  [2,1,1,1,2,5],
  [3,2,2,6,3,1],
  [1,9,1,1,2,1],
  [2,1,2,2,3,1],
  [3,1,1,1,1,5,1],
  [1,2,2,5],
  [7,1,2,1,1,1,3],
  [1,1,2,1,2,2,1],
  [1,3,1,4,5,1],
  [1,3,1,3,10,2],
  [1,3,1,1,6,6],
  [1,1,2,1,1,2],
  [7,2,1,2,5]
];
var columnGuides = [
  [7,2,1,1,7],
  [1,1,2,2,1,1],
  [1,3,1,3,1,3,1,3,1],
  [1,3,1,1,5,1,3,1],
  [1,3,1,1,4,1,3,1],
  [1,1,1,2,1,1],
  [7,1,1,1,1,1,7],
  [1,1,3],
  [2,1,2,1,8,2,1],
  [2,2,1,2,1,1,1,2],
  [1,7,3,2,1],
  [1,2,3,1,1,1,1,1],
  [4,1,1,2,6],
  [3,3,1,1,1,3,1],
  [1,2,5,2,2],
  [2,2,1,1,1,1,1,2,1],
  [1,3,3,2,1,8,1],
  [6,2,1],
  [7,1,4,1,1,3],
  [1,1,1,1,4],
  [1,3,1,3,7,1],
  [1,3,1,1,1,2,1,1,4],
  [1,3,1,4,3,3],
  [1,1,2,2,2,6,1],
  [7,1,3,2,1,1]
];


var Cell = React.createClass({
  setActive: function() {
    if (this.props.cellData.cell.disabled) return;
    this.props.onCellChanged({
      value: !this.props.cellData.cell.value,
      cellIndex: this.props.cellData.cellIndex
    });
  },
  render: function() {
    var disabled = this.props.cellData.cell.disabled,
        value = this.props.cellData.cell.value,
        field;
    if (disabled) {
      field = <input type="checkbox" disabled="disabled" checked={value} />
    }
    else {
      field = <input type="checkbox" onClick={this.setActive} checked={value} />
    }
    return (
      <label className={'custom-check' + (value ? ' active' : '') + (disabled ? ' preset' : '')}>
        {field}
      </label>
    );
  }
});

var Row = React.createClass({
  cellChanged: function(cellData) {
    cellData.rowIndex = this.props.rowData.rowIndex;
    this.props.onRowChanged(cellData);
  },
  render: function() {
    var cells = [],
        i;
    for (i = 0; i < 25; i++) {
      cells.push(<Cell key={i} onCellChanged={this.cellChanged} cellData={{
        cell: this.props.rowData.row[i],
        cellIndex: i
      }} />);
    }
    return (
      <li className="clearfix">{cells}</li>
    );
  }
});

var QuizGrid = React.createClass({
  getInitialState: function() {
    var emptyData = [],
        i,j,r,c;
    for (i = 0; i < 25; i++) {
      emptyData.push([]);
      for (j = 0; j < 25; j++) {
        emptyData[i].push({value: false, disabled: false});
      }
    }
    for (i = 0; i < presetData.length; i++) {
      r = presetData[i][0] - 1;
      c = presetData[i][1] - 1;
      emptyData[r][c] = {value: true, disabled: true};
    }
    return {gridData: emptyData};
  },
  componentDidMount: function() {
    if (typeof(localStorage[this.props.storageName]) != 'undefined') {
      this.setState({gridData: JSON.parse(localStorage[this.props.storageName])});
    }
    else {
      localStorage.setItem(this.props.storageName, JSON.stringify(this.state.gridData));
    }
  },
  componentWillUpdate: function(nextProps,nextState) {
    localStorage.setItem(this.props.storageName, JSON.stringify(nextState.gridData));
  },
  rowChanged: function(cellData) {
    var changedGrid = this.state.gridData;
    changedGrid[cellData.rowIndex][cellData.cellIndex].value = cellData.value;
    this.setState({gridData: changedGrid});
  },
  render: function() {
    var rows = [],
        i;
    for (i = 0; i < 25; i++) {
      rows.push(<Row key={i} onRowChanged={this.rowChanged} rowData={{
        row: this.state.gridData[i],
        rowIndex: i
      }} />);
    }
    return (
      <ul className="quiz-grid">
        {rows}
      </ul>
    );
  }
});

var GuideCell = React.createClass({
  render: function () {
    return (
      <span className="guide-cell">{this.props.value}</span>
    );
  }
});

var RowGuides = React.createClass({
  getInitialState: function() {
    return {rowGuides: this.props.guides};
  },
  componentDidMount: function(e) {
    this.props.rowsMounted($('#row-guides-list').outerWidth());
  },
  render: function () {
    var rows = [],
        cells,
        r = this.state.rowGuides,
        i,j;
    for (i = 0; i < r.length; i++) {
      cells = [];
      for (j = 0; j < r[i].length; j++) {
        cells.push(<GuideCell key={'c'+j} value={r[i][j]} />);
      }
      rows.push(<li key={'r'+i}>{cells}</li>);
    }
    return (
      <ul id="row-guides-list" className="row-guides">
        {rows}
      </ul>
    );
  }
});

var ColumnGuides = React.createClass({
  getInitialState: function() {
    return {columnGuides: this.props.guides};
  },
  render: function () {
    var styles,
        columns = [],
        cells,
        c = this.state.columnGuides,
        i,j;
    for (i = 0; i < c.length; i++) {
      cells = [];
      for (j = 0; j < c[i].length; j++) {
        cells.push(<GuideCell key={'c'+j} value={c[i][j]} />);
      }
      columns.push(<li key={'cl'+i}>{cells}</li>);
    }
    styles = {
      paddingLeft: this.props.columnShift+'px'
    };
    return (
      <ul className="column-guides" style={styles}>
        {columns}
      </ul>
    );
  }
});

var ButtonsBlock = React.createClass({
  render: function() {
    return (
      <ul className="buttons-block">
        <li><button type="button" className="btn btn-info">Finish</button></li>
        <li><button type="button" className="btn btn-danger">Reset the quiz</button></li>
      </ul>
    );
  }
});

var Quiz = React.createClass({
  getInitialState: function() {
    return {columnShift: 0};
  },
  setColumnShift: function(width) {
    this.setState({columnShift: width});
  },
  render: function() {
    return (
      <div className="quiz-holder clearfix">
        <ColumnGuides guides={columnGuides} columnShift={this.state.columnShift} />
        <RowGuides guides={rowGuides} rowsMounted={this.setColumnShift} />
        <QuizGrid storageName="react-quiz" />
        <ButtonsBlock />
      </div>
    );
  }
});


ReactDOM.render(
  <Quiz />,
  document.getElementById('quiz')
);