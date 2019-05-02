import React, { Component } from 'react'; // ONLY COMPONENT
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Form from './pages/Form'
import Addnode from './pages/Addnode'
import ViewVariogram from './pages/ViewVariogram'
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
    console.log('nodeList', this.props)
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Route path="/" exact component={Form} />
          </header>
        </div>
      </Router>
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