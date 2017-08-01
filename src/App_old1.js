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
    items: [],
    // groupIdColHidden: false
    hiddenColumns: {
      fullname: false,
      group_id: false
    }
  }
  componentWillMount(){
    this.getData();
    this.interval =  window.setInterval(()=>{
      this.getData();
    }, 5000)
  }
  componentWillUnmount(){
    window.clearInterval(this.interval);
  }


  getData(){
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
    .then(res => res.json())
    .then(data => {
      console.log('RESPONSE', data)
      let items = this.state.items.slice(0);
      items.push({
				_id: data._id, fullname:row.fullname, group_id:row.group_id
			});
			this.setState({ items });
    })
    console.log(this.state.items)
  }

  onAfterDeleteRow(rowKeys) {
      console.log(rowKeys[0])
      fetch('http://localhost:5000/camper/'+rowKeys[0], {
        method: 'DELETE',
        mode: 'cors',
        // headers: new Headers({
        // }),
        // body: JSON.stringify({
        // })
      })

      .then(data => {
        console.log('DELETE', data.ok);
        let items = this.state.items.slice(0);
        if(data.ok){
          items = items.filter( item => !rowKeys.includes(item._id) )
        }
        this.setState({ items })

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
    .then(data => {
      console.log('EDIT', data)
      let items = this.state.items.slice(0);
      if(data.ok){
        //items = items.filter( item => !rowKeys.includes(item._id) )
        let i=0, l=items.length;
        for(;i<l;i++) if(items[i]._id===row._id) break;
        items[i][cellName] = cellValue;
      }
      this.setState({ items })
    })
  }

  toggleColumn(colId, e){
    e.preventDefault();
    let hiddenColumns = Object.assign({}, this.state.hiddenColumns );
    hiddenColumns[colId] = !hiddenColumns[colId];
    this.setState({ hiddenColumns })
  }
  // toggleGroupIdColumn(e){
  //   e.preventDefault();
  //   this.setState({ groupIdColHidden: !this.state.groupIdColHidden })
  // }

  render() {
    const selectRow = {
      mode: 'checkbox',
      showOnlySelected: true
    };
    const options = {
      toolBar: this.createCustomToolBar,
      afterInsertRow: this.onAfterInsertRow.bind(this),
      afterDeleteRow: this.onAfterDeleteRow.bind(this)
    };
    const cellEditProp = {
      mode: 'dbclick',
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell.bind(this), // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell.bind(this)  // a hook for after saving cell
    };
    return (
      <div>
        {/*<div className="btn btn-default" onClick={this.toggleGroupIdColumn.bind(this)}>
        {this.state.groupIdColHidden ? 'Show': 'Hide'} GroupId Column</div>
        <div>*/}

        <BootstrapTable data={ this.state.items }
         options={ options }
         selectRow={ selectRow }
         cellEdit={ cellEditProp }
         insertRow
         deleteRow
         exportCSV

         striped
         hover>
        <TableHeaderColumn isKey dataField='_id' dataSort={ true }
                           editable={false}
                           autoValue={true}>Camper ID</TableHeaderColumn>

        <TableHeaderColumn dataField='fullname' dataSort={ true }
         filter={ { type: 'TextFilter', delay: 1000 } }>
           Camper Name
           <div className="btn btn-default" onClick={this.toggleColumn.bind(this, 'fullname')}>
             {this.state.hiddenColumns.group_id ? 'Show': 'Hide'}</div>
         </TableHeaderColumn>

        <TableHeaderColumn dataField='group_id' hidden={this.state.groupIdColHidden}>
          Group
          <div className="btn btn-default" onClick={this.toggleColumn.bind(this, 'group_id')}>
            {this.state.hiddenColumns.group_id ? 'Show': 'Hide'}</div>
        </TableHeaderColumn>

        </BootstrapTable>
      </div>
    );
  }
}

export default App;
