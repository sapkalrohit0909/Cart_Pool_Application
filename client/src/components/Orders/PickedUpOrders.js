import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Modal } from 'react-bootstrap';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class PickedUpOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            show: false,
            orderID: 0
        }
    }

    componentDidMount() {
        axios.get(base.serverURI+'/order/user/to/pickup', { "headers": headers })
            .then(res => {
                if (res.status === 200 && res.data.length >= 1) {
                    console.log(res.data);
                    let ords = [];
                    for (var i = 0; i < res.data.length; i++) {
                        var obj = {};
                        obj.id = res.data[i].id;
                        obj.store = res.data[i].store.name;
                        obj.owner = res.data[i].owner.name;
                        ords.push(obj);
                    }
                    this.setState({ orders: ords });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleScan(id) {
        this.setState({ show: true, orderID: id });
    }

    scanOrder(id) {
        axios.patch(base.serverURI+'/order/checkout/' + id, {}, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ orders: this.state.orders.filter(ord => ord.id !== id), show: false });
                    alert('ORDER ID SCANNED: ' + id);
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    renderOrders() {
        return (
            this.state.orders.map((ord, ind) => (
                <tbody>
                    <td>
                        <Button variant="primary" onClick={this.handleScan.bind(this, ord.id)}>
                            Scan
                        </Button>
                    </td>
                    <td>{ord.id}</td>
                    <td>{ord.store}</td>
                    <td>{ord.owner}</td>
                </tbody>
            ))
        )
    }

    render() {
        return (
            <div>
                <h1>Pick Up Orders</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Scan QR</th>
                            <th>Order ID</th>
                            <th>Store</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <Modal
                        show={this.state.show}
                        onHide={() => this.setState({ show: false })}
                        dialogClassName="modal-90w"
                        style={{ width: '50%', position: 'fixed', left: '25%' }}
                        aria-labelledby="example-custom-modal-styling-title"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-custom-modal-styling-title">
                                Scan Your Order
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <img src="https://store-images.s-microsoft.com/image/apps.33967.13510798887182917.246b0a3d-c3cc-46fc-9cea-021069d15c09.392bf5f5-ade4-4b36-aa63-bb15d5c3817a" alt="QR Code" width="300" height="300"></img>
                        </Modal.Body>
                        <Button variant="primary" onClick={this.scanOrder.bind(this, this.state.orderID)}>
                            Scan
                        </Button>
                    </Modal>
                    {this.renderOrders()}
                </Table>
            </div>
        )
    }
}

export default PickedUpOrders;