import React, { Component } from 'react';
import { Modal, Button, Col, Row, Container, Form } from 'react-bootstrap';

class Manage extends Component {
    constructor(props) {
        super(props);
        this.handleStores = this.handleStores.bind(this);
        this.handleProducts = this.handleProducts.bind(this);
    }
    
    handleStores() {
        this.props.history.push('/stores');
    }

    handleProducts() {
        this.props.history.push('/products');
    }

    render() {
        return (
            <div>
                <Button variant="primary" type="submit" onClick={this.handleStores}>
                    Manage Store
                </Button>
                <Button variant="primary" type="submit" onClick={this.handleProducts}>
                    Manage Product
                </Button>
            </div>
        );
    }
}

export default Manage;