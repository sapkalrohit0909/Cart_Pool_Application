import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class ManageOrder extends Component {
    constructor(props) {
        super(props);
        this.handleDeliveringOrders = this.handleDeliveringOrders.bind(this);
        this.handleOrdersInDelivery = this.handleOrdersInDelivery.bind(this);
        this.handlePendingUserOrders = this.handlePendingUserOrders.bind(this);
        this.handleUserPickedUpOrders = this.handleUserPickedUpOrders.bind(this);
        this.handlePickedUpOrders = this.handlePickedUpOrders.bind(this);
    }

    componentDidMount() {
        axios.get(base.serverURI +'/user/me', { "headers": headers })
            .then(res => {
                if (res.status === 200 && res.data.credit < 0) {
                    alert('Warning! Your contribution credit is: ' + res.data.credit);
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleDeliveringOrders() {
        this.props.history.push('/delivering-orders');
    }

    handleOrdersInDelivery() {
        this.props.history.push('/orders-in-delivery');
    }

    handlePendingUserOrders() {
        this.props.history.push('/pending-user-orders');
    }

    handleUserPickedUpOrders() {
        this.props.history.push('/user-picked-up-orders');
    }

    handlePickedUpOrders() {
        this.props.history.push('/picked-up-orders');
    }

    render() {
        return (
            <div>
                <Button variant="primary" type="submit" onClick={this.handlePendingUserOrders}>
                    Pending User Orders
                </Button>
                <Button variant="primary" type="submit" onClick={this.handleUserPickedUpOrders}>
                    User Picked Up Orders
                </Button>
                <Button variant="primary" type="submit" onClick={this.handleOrdersInDelivery}>
                    User Orders In Delivery
                </Button>
                <Button variant="primary" type="submit" onClick={this.handlePickedUpOrders}>
                    Picked Up Orders
                </Button>
                <Button variant="primary" type="submit" onClick={this.handleDeliveringOrders}>
                    Delivering Orders
                </Button>
            </div>
        );
    }
}

export default ManageOrder;