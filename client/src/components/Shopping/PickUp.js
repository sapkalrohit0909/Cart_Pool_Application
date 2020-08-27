import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class PickUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            selectedOrders: []
        }
        this.handleOrderSelect = this.handleOrderSelect.bind(this);
        this.handlePickUp = this.handlePickUp.bind(this);
    }

    componentDidMount() {
        axios.get(base.serverURI + '/order/pool', { "headers": headers })
            .then(res => {
                if (res.status === 200 && res.data.length >= 1) {
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

    handlePickUp = (e) => {
        let pickups = this.state.selectedOrders.map(v => parseInt(v, 10));
        console.log(pickups);
        if (pickups.length > 10) {
            alert('Restricted to 10 orders!');
        } else {
            axios.post(base.serverURI + '/order/user/will/pickup', { "orderIds": pickups }, { "headers": headers })
                .then(res => {
                    if (res.status === 200) {
                        alert('Picked Up Orders!');
                        this.props.history.push('/order');
                    }
                }).catch((err) => {
                    alert(err.response.data.message);
                });
        }
    }

    handleOrderSelect = (e) => {
        var ordersArr = [...this.state.selectedOrders];
        const value = e.target.value
        const index = ordersArr.findIndex(id => id === value);
        if (index > -1) {
            ordersArr = [...ordersArr.slice(0, index), ...ordersArr.slice(index + 1)]
        } else {
            ordersArr.push(value);
        }
        this.setState({ selectedOrders: ordersArr });
    }

    renderOrders() {
        return (
            this.state.orders.map((ord, ind) => (
                <tbody>
                    <td>{ord.id}</td>
                    <td>{ord.store}</td>
                    <td>{ord.owner}</td>
                    <td>
                        <div key={ind} className="checks" >
                            <label>
                                <input type="checkbox" name={ord} value={ord.id}
                                    onChange={this.handleOrderSelect} />
                            </label>
                        </div>
                    </td>
                </tbody>
            ))
        )
    }

    render() {
        return (
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Store</th>
                            <th>Owner</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    {this.renderOrders()}
                </Table>
                <Button variant="primary" type="submit" onClick={this.handlePickUp}>
                    Pick Up Orders
                </Button>
            </div>
        )
    }
}

export default PickUp;