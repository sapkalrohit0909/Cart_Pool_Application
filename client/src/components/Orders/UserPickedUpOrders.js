import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class UserPickedUpOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        }
    }

    componentDidMount() {
        axios.get(base.serverURI+'/order/user/of/pickup', { "headers": headers })
            .then(res => {
                if (res.status === 200 && res.data.length >= 1) {
                    console.log(res.data);
                    let ords = [];
                    for (var i = 0; i < res.data.length; i++) {
                        var obj = {};
                        obj.id = res.data[i].id;
                        obj.store = res.data[i].store.name;
                        obj.picker = res.data[i].picker.name;
                        obj.createdDate = res.data[i].createdDate;
                        ords.push(obj);
                    }
                    this.setState({ orders: ords });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    renderOrders() {
        return (
            this.state.orders.map((ord) => (
                <tbody>
                    <td>{ord.id}</td>
                    <td>{ord.store}</td>
                    <td>{ord.picker}</td>
                    <td>{ord.createdDate}</td>
                </tbody>
            ))
        )
    }

    render() {
        return (
            <div>
                <h1>User Picked Up Orders</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Store</th>
                            <th>Picker</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    {this.renderOrders()}
                </Table>
            </div>
        )
    }
}

export default UserPickedUpOrders;