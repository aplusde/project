import React, { Component } from 'react'; // ONLY COMPONENT
import Form from './components/Form'
import logo from './logo.svg';
import './App.css';
import Button from './components/Button';
import { connect } from 'react-redux'

class App extends Component {
  state = {
    name: ''
  }
  HandleChangeName = (e) => {
    const value = e.target.value
    this.setState({
      name: value
    }, () => console.log(this.state))
  }
  Handlealert = (name) => {
    return alert(name)
  }
  render() {
    console.log('nodeList', this.props) /*{
      nodesList:[...],
      userr:[...]
    } */
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            TEST MY FIRST  REACT
          </a>

          <Form handleChange={this.HandleChangeName} /> {/*this is component*/}
          <Button name={this.state.name} handlealert={this.Handlealert} /> {/*this is component*/}
        </header>
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  /*
  state = {
    nodeList:[],
  }
   */
  console.log('state', store)
  return {
    nodesList: store.nodesList,
    user: store.user
  }
}

export default connect(mapStoreToProps, null)(App)
//(store)=>  App(mapStateToProps(store))