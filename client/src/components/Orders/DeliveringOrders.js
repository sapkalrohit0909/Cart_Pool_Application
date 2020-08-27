import React, { Component } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Progress } from 'reactstrap';
import { Modal, Button } from 'react-bootstrap';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class DeliveringOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contributionStatus: 0,
            orders: [],
            show: false
        }
    }

    componentDidMount() {

        axios.get(base.serverURI+'/user/me', { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ contributionStatus: res.data.credit });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });

        axios.get(base.serverURI+'/order/user/to/deliver', { "headers": headers })
            .then(res => {
                if (res.status === 200 && res.data.length >= 1) {
                    console.log(res.data);
                    let ords = [];
                    for (var i = 0; i < res.data.length; i++) {
                        var obj = {};
                        obj.id = res.data[i].id;
                        obj.store = res.data[i].store.name;
                        obj.owner = res.data[i].owner.name;
                        obj.orderDetails = res.data[i].orderDetail;
                        obj.createdDate = res.data[i].createdDate;
                        obj.street = res.data[i].owner.address.street;
                        obj.city = res.data[i].owner.address.city;
                        obj.state = res.data[i].owner.address.state;
                        obj.zip = res.data[i].owner.address.zip;
                        ords.push(obj);
                    }
                    this.setState({ orders: ords });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleDelivery(id) {
        axios.get(base.serverURI+'/order/deliver/' + id, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ orders: this.state.orders.filter(ord => ord.id !== id) });
                    alert('Marked!');
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    render() {
        let contributionBar = null;
        if (this.state.contributionStatus <= -6) {
            contributionBar = <Progress color="danger" value="100" />;
        } else if (this.state.contributionStatus <= -4) {
            contributionBar = <Progress color="warning" value="100" />;
        } else {
            contributionBar = <Progress color="success" value="100" />;
        }
        return (
            <div>
                <div>
                    Contribution Credit: {this.state.contributionStatus} {contributionBar}
                </div>
                <h1>Delivering Orders</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Confirm</th>
                            <th>Order ID</th>
                            <th>Store</th>
                            <th>Owner</th>
                            <th>Created Date</th>
                            <th>Order Details</th>
                        </tr>
                    </thead>
                    {
                        this.state.orders.map(ord => (
                            <tbody>
                                <td>
                                    <button
                                        type="button"
                                        class="btn btn-lg btn-primary"
                                        onClick={this.handleDelivery.bind(this, ord.id)}
                                    >
                                        Mark as Delivered
                                </button>
                                </td>
                                <td>{ord.id}</td>
                                <td>{ord.store}</td>
                                <td>{ord.owner}</td>
                                <td>{ord.createdDate}</td>
                                <td>
                                    <Button variant="primary" onClick={() => this.setState({ show: true })}>
                                        View
                                </Button>
                                </td>
                                <Modal size="lg"
                                    show={this.state.show}
                                    onHide={() => this.setState({ show: false })}
                                    dialogClassName="modal-90w"
                                    style={{ width: '50%', position: 'fixed', left: '25%' }}
                                    aria-labelledby="example-custom-modal-styling-title"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title id="example-custom-modal-styling-title">
                                            Order Details
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Product ID</th>
                                                    <th>Name</th>
                                                    <th>Price Per Unit</th>
                                                    <th>Quantity</th>
                                                    <th>Brand</th>
                                                    <th>Address</th>
                                                </tr>
                                            </thead>
                                            {
                                                ord.orderDetails.map(d => (
                                                    <tbody>
                                                        <td>{d.product.sku}</td>
                                                        <td>{d.product.name}</td>
                                                        <td>${d.product.price}/{d.product.unit}</td>
                                                        <td>{d.quantity}</td>
                                                        <td>{d.product.brand}</td>
                                                        <td>{ord.street},{ord.city},{ord.state},{ord.zip}</td>
                                                    </tbody>
                                                ))
                                            }
                                        </Table>
                                    </Modal.Body>
                                </Modal>
                            </tbody>
                        ))
                    }
                </Table>
            </div>
        )
    }
}

export default DeliveringOrders;