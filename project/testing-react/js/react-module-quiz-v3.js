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
  rowChanged: function(cellData) {
    this.props.onUpdateData('autosave', cellData);
  },
  render: function() {
    var rows = [],
        i;
    for (i = 0; i < 25; i++) {
      rows.push(<Row key={i} onRowChanged={this.rowChanged} rowData={{
        row: this.props.gridData[i],
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
  componentDidMount: function(e) {
    this.props.onRowsMounted(ReactDOM.findDOMNode(this).getBoundingClientRect().width);
  },
  render: function () {
    var rows = [],
        cells,
        r = this.props.guides,
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
  render: function () {
    var styles,
        columns = [],
        cells,
        c = this.props.guides,
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
  save: function() {
    this.props.onUpdateData('save');
  },
  restore: function() {
    this.props.onUpdateData('restore');
  },
  reset: function() {
    this.props.onUpdateData('reset');
  },
  checkResults: function() {
    this.props.onCheckResults();
  },
  setFinish: function() {
    this.props.onSetFinish();
  },
  render: function() {
    var textFinish,
        btnFinishClasses;
    if (this.props.quizFinished) {
      textFinish = 'Continue to resolve the quiz';
      btnFinishClasses = 'btn btn-success';
    }
    else {
      textFinish = 'Mark as finished';
      btnFinishClasses = 'btn btn-warning';
    }
    return (
      <ul className="buttons-block">
        <li><button type="button" className="btn btn-success" onClick={this.save}>Save</button></li>
        <li><button type="button" className="btn btn-primary" onClick={this.restore}>Restore saved</button></li>
        <li className="btn-reset"><button type="button" className="btn btn-danger" onClick={this.reset}>Reset the quiz</button></li>
        <li><button type="button" className="btn btn-info" onClick={this.checkResults}>Check results in console</button></li>
        <li><button type="button" className={btnFinishClasses} onClick={this.setFinish}>{textFinish}</button></li>
      </ul>
    );
  }
});

var Quiz = React.createClass({
  getDefaultProps: function() {
    return {
      storageName: 'react-quiz',
      storageNameSaved: 'react-quiz-saved'
    }
  },
  initData: function() {
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
    return emptyData;
  },
  getInitialState: function() {
    return {
      rowGuides: rowGuides,
      columnGuides: columnGuides,
      gridData: this.initData(),
      columnShift: 0,
      unsavedQuizChanges: false,
      quizFinished: false
    };
  },
  componentDidMount: function() {
    this.updateData('load');
  },
  updateData: function(type, data) {
    var changedGrid = this.state.gridData;
    if (type == 'autosave') {
      changedGrid[data.rowIndex][data.cellIndex].value = data.value;
      this.setState({gridData: changedGrid});
      localStorage.setItem(this.props.storageName, JSON.stringify(changedGrid));
    }
    else if (type == 'save') {
      localStorage.setItem(this.props.storageNameSaved, JSON.stringify(this.state.gridData));
    }
    else if (type == 'restore') {
      this.setState({gridData: JSON.parse(localStorage[this.props.storageNameSaved])});
    }
    else if (type == 'reset') {
      this.setState({gridData: this.initData()});
      localStorage.setItem(this.props.storageName, JSON.stringify(this.initData()));
      localStorage.setItem(this.props.storageNameSaved, localStorage[this.props.storageName]);
    }
    else if (type == 'load') {
      if (typeof localStorage[this.props.storageName] != 'undefined') {
        this.setState({gridData: JSON.parse(localStorage[this.props.storageName])});
      }
      else {
        localStorage.setItem(this.props.storageName, JSON.stringify(this.state.gridData));
      }
      localStorage.setItem(this.props.storageNameSaved, localStorage[this.props.storageName]);
    }
  },
  checkResults: function() {
    var i,j,
        rCounter = 0,
        cCounter = 0,
        dCounter = 0,
        rg = this.state.rowGuides,
        cg = this.state.columnGuides,
        d = this.state.gridData,
        comp = [['row guides', 'actual data']],
        temp;
    for (i = 0; i < rg.length; i++) {
      temp = 0;
      for (j = 0; j < rg[i].length; j++) {
        rCounter += rg[i][j];
        temp += rg[i][j];
      }
      comp[i+1] = [];
      comp[i+1].push(temp);
    }
    for (i = 0; i < cg.length; i++) {
      for (j = 0; j < cg[i].length; j++) {
        cCounter += cg[i][j];
      }
    }
    for (i = 0; i < d.length; i++) {
      temp = 0;
      for (j = 0; j < d[i].length; j++) {
        if (d[i][j].value) {
          dCounter++;
          temp++;
        }
      }
      comp[i+1].push(temp);
    }
    console.log('row-guides     > ' + rCounter);
    console.log('column-guides  > ' + cCounter);
    console.log('data           > ' + dCounter);
    console.log(comp);
  },
  setFinish: function() {
    var value = this.state.quizFinished;
    this.setState({quizFinished: !value});
  },
  setColumnShift: function(width) {
    this.setState({columnShift: width});
  },
  render: function() {
    var markFinished = this.state.quizFinished ? ' quiz-finished' : '';
    return (
      <div className={"quiz-holder clearfix" + markFinished}>
        <ColumnGuides guides={this.state.columnGuides} columnShift={this.state.columnShift} />
        <RowGuides guides={this.state.rowGuides} onRowsMounted={this.setColumnShift} />
        <QuizGrid gridData={this.state.gridData} onUpdateData={this.updateData} />
        <ButtonsBlock
          onUpdateData={this.updateData}
          onCheckResults={this.checkResults}
          onSetFinish={this.setFinish}
          quizFinished={this.state.quizFinished}
        />
      </div>
    );
  }
});


ReactDOM.render(
  <Quiz />,
  document.getElementById('quiz')
);


/*
   _
FFABBC - wrong

FFAEBC

1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
A B C D E F G H I J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z

            G     J  J                  Q                         Z
        E                  M              R                 X     Z


18+9+15+20+19
21+14+6+9+24+5+4


26 7 10 10 17 = 70
ZGJJQ
5 26 18 24 13 = 86
EZRXM

/\|\
\
|
\

\/\/


26 7 10 10 17   5 26 18 24 13

 7  3 0  7 > 14 > 21 18 6 15
21 18 6 15


STARLET

SONNET

SAFFRON

SHALLOT

TORRENT

SUGGEST


*/
