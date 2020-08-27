import React, { Component } from 'react';
import {
    Card, CardImg, CardTitle, CardBody,
    Button, Form, FormGroup, Label, Input,
    Modal, ModalFooter, ModalHeader, ModalBody
} from 'reactstrap';

class StoreProductCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            fade: true,
            quantity: 0
        };
        this.toggle = this.toggle.bind(this);
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

    handleAdd(id, quantity) {
        this.toggle();
        if (quantity < 1) {
            alert('Invalid quantity!');
        } else {
            this.props.handleAddProduct(id, quantity);
        }
    }

    render() {
        let { name, imageUrl, description, brand, sku, unit, price } = this.props.prod;
        return (
            <div>
                <Card>
                    <CardImg src={imageUrl} alt="Card Image Cap" />
                    <CardBody>
                        <CardTitle><strong>Product Name:</strong> {name}</CardTitle>
                        <CardTitle><strong>Price:</strong> (${price} / {unit})</CardTitle>
                        <CardTitle><strong>SKU:</strong> {sku}</CardTitle>
                        <CardTitle><strong>Description:</strong> {description}</CardTitle>
                        <Button color="primary" onClick={this.toggle}>Add to Cart</Button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle}
                            fade={this.state.fade}
                            className={this.props.className}>
                            <ModalHeader toggle={this.toggle}>Edit Product</ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="exampleSelect">Quantity</Label>
                                        <Input
                                            type="number"
                                            name="quantity"
                                            onChange={this.handleChange}
                                        >
                                        </Input>
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={() => this.handleAdd(sku, this.state.quantity)}>Add</Button>
                            </ModalFooter>
                        </Modal>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default StoreProductCard;