import React, { Component } from 'react';
import axios from 'axios';
import { Col, Row, Container } from 'react-bootstrap';
import { MDBCol, MDBFormInline, MDBBtn } from "mdbreact";
import GetStoreProductCard from './StoreProductCard';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class GetStoreProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageUrl: "",
            brand: "",
            unit: "",
            price: "",
            description: "",
            products: [],
            searchName: "",
            quantity: 0,
            storeid: 0,
            show: false
        }
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchByName = this.searchByName.bind(this);
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    checkIfProductExists(sku) {
        const products = localStorage.getItem('products');
        let productExists = false;
        if (products) {
            const productsData = JSON.parse(products)
            productExists = productsData.find(prod => prod.sku === sku)
        }
        return productExists
    }

    handleAddProduct = (sku, quantity) => {
        let localStorageProduct = this.state.products.find((prod) => {
            return prod.sku === sku;
        });

        const localContent = localStorage.getItem('products');
        let products;
        if (localContent === null) {
            products = [];
        } else {
            products = JSON.parse(localContent);
        }

        let productExists = this.checkIfProductExists(sku);
        if (productExists) {
            alert('Product is already in Cart!');
        } else {
            if (products.length > 0 && products[0].storeid != this.state.storeid) {
                alert('CONFLICTING STORE! You already have items from another store in your cart...');
            } else {
                localStorageProduct.quantity = quantity;
                localStorageProduct.storeid = this.state.storeid;
                console.log(localStorageProduct);
                products.push(localStorageProduct);
                localStorage.setItem('products', JSON.stringify(products));
            }
        }
    }

    searchByName() {
        axios.get(base.serverURI+'/store/search?name=' + this.state.searchName,
            { "headers": headers })
            .then(res => {
                console.log(JSON.stringify(res.data));
                if (res.status === 200) {
                    let prods = [];
                    res.data.forEach(element => {
                        element.product.forEach(ele => {
                            prods.push(ele);
                        });
                    });
                    this.setState({ products: prods, storeid: res.data[0].id });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    render() {
        let storeProductCards = this.state.products.map((prod) => {
            return (
                <Col sm="4">
                    <GetStoreProductCard key={prod.sku} handleAddProduct={this.handleAddProduct} prod={prod} />
                </Col>
            )
        });
        return (
            <div>
                <MDBCol md="12">
                    <MDBFormInline className="md-form mr-auto mb-4">
                        <input className="form-control mr-sm-2" type="text" name="searchName" onChange={this.handleChange} placeholder="Store name" aria-label="Search" />
                        <MDBBtn outline color="warning" rounded size="sm" onClick={this.searchByName} className="mr-auto">
                            Search Store
                        </MDBBtn>
                    </MDBFormInline>
                </MDBCol>
                <Container fluid>
                    <Row>
                        {storeProductCards}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default GetStoreProducts;