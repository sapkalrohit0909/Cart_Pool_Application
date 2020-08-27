import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class PickUpOption extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.handlePickUpByOthers = this.handlePickUpByOthers.bind(this);
        this.handlePickUpByOneSelf = this.handlePickUpByOneSelf.bind(this);
    }

    handlePickUpByOneSelf() {
        this.props.history.push('/pickup');
    }

    handlePickUpByOthers() {
        this.props.history.push('/order');
    }

    render() {
        return (
            <div>
                <Button variant="primary" type="submit" onClick={this.handlePickUpByOthers}>
                    Pick Up By Others
                </Button>
                <Button variant="primary" type="submit" onClick={this.handlePickUpByOneSelf}>
                    Pick Up By Myself
                </Button>
            </div>
        );
    }
}

export default PickUpOption;