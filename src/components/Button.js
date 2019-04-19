import React, { Component } from 'react'

class Button extends Component {
    componentWillMount() {
        console.log('render')
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false
    }
    componentWillReceiveProps(nextProps) {
        console.log('next', nextProps)
    }
    componentWillUpdate(a, b) {
        console.log('willupdate')
    }
    componentWillUnmount() {
        console.log('i gonna die')
    }
    render() {
        return (
            <div>
                <button onClick={() => this.props.handlealert(this.props.name)}>submit</button>
            </div>
        )
    }
}
export default Button