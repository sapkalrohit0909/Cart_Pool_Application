import React, { Component } from 'react';
import { Button, Col, Row, Container } from 'react-bootstrap';
import CartProduct from './CartProduct';
import axios from 'axios';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            storeid: 0,
            subTotal: 0,
            tax: 0,
            quantity: 0
        };
        this.removeProduct = this.removeProduct.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.updateSubTotal = this.updateSubTotal.bind(this);
    }

    componentDidMount() {
        let obj = JSON.parse(localStorage.getItem('products'));
        if (obj != null && obj != undefined) {
            let arr = [];
            if (obj.length >= 1) {
                for (var i in obj) {
                    arr.push(obj[i]);
                    this.state.subTotal += parseFloat(obj[i].price * obj[i].quantity);
                }
                this.setState({ products: arr, storeid: obj[0].storeid });
            }
        }
    }

    clearCart() {
        this.setState({ products: [], subTotal: 0 });
        localStorage.clear();
        this.props.history.push('/cart');
    }

    checkOut() {
        let prod = this.state.products;
        let prodsArr = [];
        for (var i = 0; i < prod.length; i++) {
            var obj = {}
            obj.productId = prod[i].sku;
            obj.quantity = parseInt(prod[i].quantity);
            prodsArr.push(obj);
        }

        const checkOutData = {
            products: prodsArr,
            storId: this.state.storeid
        }
        console.log(checkOutData);
        axios.post(base.serverURI +'/order/placeorder', checkOutData, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    alert('Order placed!');
                    localStorage.clear();
                    this.props.history.push('/pickup-option');
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    updateSubTotal() {
        let subTotal = 0;
        let productsArr = this.state.products;
        if (productsArr !== undefined || productsArr.length != 0) {
            for (var i = 0; i < productsArr.length; i++) {
                subTotal += parseFloat(productsArr[i].price * productsArr[i].quantity);
            }
            this.setState({ subTotal });
        }
    }

    removeProduct(sku) {
        var obj = JSON.parse(localStorage.getItem("products")) || {};
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].sku === sku) {
                obj.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("products", JSON.stringify(obj));
        this.setState({ products: this.state.products.filter(prod => prod.sku !== sku) },
            () => {
                this.updateSubTotal();
            });
    }

    editProduct(sku, quantity) {
        var obj = JSON.parse(localStorage.getItem("products")) || {};
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].sku === sku) {
                obj[i].quantity = quantity;
                break;
            }
        }
        localStorage.setItem("products", JSON.stringify(obj));
        var products = [...this.state.products];
        var index = products.findIndex(obj => obj.sku === sku);
        products[index].quantity = quantity;

        this.setState({ products }, () => {
            this.updateSubTotal();
        });
    }

    render() {
        let productCards = this.state.products.map((prod) => {
            return (
                <Col sm="4">
                    <CartProduct key={prod.sku} removeProduct={this.removeProduct} editProduct={this.editProduct} prod={prod} />
                </Col>
            )
        });
        let checkOutButton = <Button variant="primary" type="submit" disabled onClick={this.checkOut.bind(this)}>Checkout</Button>;
        if (this.state.products.length) {
            checkOutButton = <Button variant="primary" type="submit" enabled onClick={this.checkOut.bind(this)}>Checkout</Button>;
        }
        return (
            <div>
                <Button variant="danger" type="submit" onClick={this.clearCart.bind(this)}>
                    Clear Cart
                </Button>
                {checkOutButton}
                <strong>SubTotal: </strong>${this.state.subTotal} + <strong>Tax (9.75%):</strong> ${Math.floor(this.state.subTotal * .0975 * 100) / 100}
                <Container fluid>
                    <Row>
                        {productCards}
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Cart;