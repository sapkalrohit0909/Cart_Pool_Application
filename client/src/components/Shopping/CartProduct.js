import React, { Component } from 'react';
import {
    Card, CardImg, CardTitle, CardBody,
    Button, Form, FormGroup, Label, Input,
    Modal, ModalHeader, ModalBody
} from 'reactstrap';

class CartProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            fade: true,
            quantity: 0
        };

        this.toggle = this.toggle.bind(this);
        this.editProd = this.editProd.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            fade: !this.state.fade
        });
    }

    editProd(sku, quantity) {
    	 if(quantity < 1) {
    	 	alert('Invalid quantity!');
    	 } else {
    	 	this.setState({
            modal: !this.state.modal,
            fade: !this.state.fade
        	});
        	this.props.editProduct(sku, quantity);
    	 }
    }

    render() {
        let { name, imageUrl, description, brand, quantity, sku, unit, price } = this.props.prod;
        return (
            <div>
                <Card style={{ width: '20rem' }}>
                    <CardImg src={imageUrl} alt="Card Image Cap" />
                    <CardBody>
                        <CardTitle><strong>Product Name:</strong> {name}</CardTitle>
                        <CardTitle><strong>SKU:</strong> {sku}</CardTitle>
                        <CardTitle><strong>Price:</strong> (${price} / {unit})</CardTitle>
                        <CardTitle><strong>Brand:</strong> {brand}</CardTitle>
                        <CardTitle><strong>Quantity:</strong> {quantity}</CardTitle>
                        <CardTitle><strong>Description:</strong> {description}</CardTitle>
                        <Button color="primary" onClick={this.toggle}>Edit</Button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle}
                            fade={this.state.fade}
                            className={this.props.className}>
                            <ModalHeader toggle={this.toggle}>Edit Product</ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="exampleNumber">Quantity</Label>
                                        <Input
                                            name="quantity"
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                            <Button color="primary" onClick={() => this.editProd(sku, this.state.quantity)}>Edit Quantity</Button>
                        </Modal>
                        <Button color="danger" onClick={() => this.props.removeProduct(sku)}>Delete</Button>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default CartProduct;