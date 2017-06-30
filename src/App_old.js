import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './App.css';

// navbar and side navbar
// create, read, update camper, campers
// CRUD groups
// Add component or something for setting hidden columns
// look at remote
// How to ensure the data is fresh
// hmm delete multiple rows?
// name
// age
// balance
// paid
// awards

class App extends Component {
  state = {
    items: []
  }
  componentWillMount(){
    fetch('http://localhost:5000/camper')
      .then( res => res.json() )
      //.then(data => this.setState({items: data._items}))
      .then(data => {
        console.log('DATA', data);
        this.setState({items: data._items});
      })
  }
  onAfterInsertRow(row) {
    // console.log(row)
    fetch('http://localhost:5000/camper', {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        fullname: row.fullname,
        group_id: row.group_id
      })
    })
    console.log(this.state.items)
  }

  onAfterDeleteRow(row) {
      console.log(row[0])
      fetch('http://localhost:5000/camper'+'/'+row[0], {
        method: 'DELETE',
        mode: 'cors',
        headers: new Headers({
        }),
        body: JSON.stringify({
        })
      })
  }

  onBeforeSaveCell(row, cellName, cellValue) {
    return true
  }

  onAfterSaveCell(row, cellName, cellValue) {
    // console.log(row["_id"], cellName, cellValue)
    var obj = {}
    obj[cellName] = cellValue
    fetch('http://localhost:5000/camper'+'/'+row["_id"], {
      method: 'PATCH',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(obj)
    })
  }

  render() {
    const selectRow = {
      mode: 'checkbox',
      showOnlySelected: true
    };
    const options = {
      toolBar: this.createCustomToolBar,
      afterInsertRow: this.onAfterInsertRow,
      afterDeleteRow: this.onAfterDeleteRow
    };
    const cellEditProp = {
      mode: 'dbclick',
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
    };
    return (
      <BootstrapTable data={ this.state.items }
       options={ options }
       selectRow={ selectRow }
       cellEdit={ cellEditProp }
       insertRow
       deleteRow
       exportCSV
       pagination
       striped
       hover>
      <TableHeaderColumn isKey dataField='_id' dataSort={ true }
                         editable={false}
                         autoValue={true}>Camper ID</TableHeaderColumn>
      <TableHeaderColumn dataField='fullname' dataSort={ true }
       filter={ { type: 'TextFilter', delay: 1000 } }>
       Camper Name</TableHeaderColumn>
      <TableHeaderColumn dataField='group_id'>Group</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default App;
