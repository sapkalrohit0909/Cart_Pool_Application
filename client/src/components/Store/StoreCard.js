import React, { Component } from 'react';
import {
    Card, CardImg, CardTitle, CardBody, CardText,
    Button, Form, FormGroup, Label, Input,
    Modal, ModalFooter, ModalHeader, ModalBody
} from 'reactstrap';

class StoreCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            fade: true,
            name: "",
            street: this.props.store.address.street,
            city: this.props.store.address.city,
            state: this.props.store.address.state,
            zip: this.props.store.address.zip
        }
        this.toggle = this.toggle.bind(this);
        this.updateStore = this.updateStore.bind(this);
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

    updateStore() {
        this.setState({
            modal: !this.state.modal,
            fade: !this.state.fade
        });

        const updateStore = {
            id: this.props.store.id,
            name: this.state.name,
            address: {
                street: this.state.street,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip
            }
        }
        this.props.editStore(updateStore);
    }

    render() {
        let { id, name, address } = this.props.store;
        return (
            <div>
                <Card style={{ width: '20rem' }}>
                    <CardImg src="https://image.freepik.com/free-vector/store-icon_24911-1362.jpg" alt="Card Image Cap" />
                    <CardBody>
                        <CardTitle>{name}</CardTitle>
                        <CardText>{address.street}, {address.city}, {address.state} {address.zip}</CardText>
                        <Button color="primary" onClick={this.toggle}>Edit</Button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle}
                            fade={this.state.fade}
                            className={this.props.className}>
                            <ModalHeader toggle={this.toggle}>Edit Store</ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="exampleName">Store Name</Label>
                                        <Input
                                            name="name"
                                            placeholder="Pie Bakery"
                                            onChange={this.handleChange}
                                            defaultValue={name}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleName">Address</Label>
                                        <Input
                                            name="street"
                                            placeholder="1234 Main St"
                                            onChange={this.handleChange}
                                            defaultValue={address.street}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleName">City</Label>
                                        <Input
                                            name="city"
                                            placeholder="San Francisco"
                                            onChange={this.handleChange}
                                            defaultValue={address.city}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleName">State</Label>
                                        <Input
                                            name="state"
                                            placeholder="California"
                                            onChange={this.handleChange}
                                            defaultValue={address.state} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleNumber">ZipCode</Label>
                                        <Input
                                            type="number"
                                            name="zip"
                                            placeholder="94012"
                                            onChange={this.handleChange}
                                            defaultValue={address.zip}
                                            maxLength="5"
                                        />
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.updateStore}>Update</Button>{' '}
                            </ModalFooter>
                        </Modal>
                        <Button color="danger" onClick={() => this.props.removeStore(id)}>Delete</Button>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default StoreCard;