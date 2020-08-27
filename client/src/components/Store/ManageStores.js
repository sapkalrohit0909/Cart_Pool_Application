import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Button, Col, Row, Container, Form } from 'react-bootstrap';
import StoreCard from './StoreCard';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class ManageStores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            stores: [],
            show: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAddStore = this.handleAddStore.bind(this);
        this.editStore = this.editStore.bind(this);
        this.removeStore = this.removeStore.bind(this);
    }

    componentDidMount() {
        axios.get(base.serverURI + '/store', { "headers": headers })
            .then(res => {
                this.setState({ stores: res.data });
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    removeStore(id) {
        console.log("REMOVED STORE: " + id);
        axios.delete(base.serverURI + '/store/' + id, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ stores: this.state.stores.filter(store => store.id !== id) });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    editStore(data) {
        var stores = [...this.state.stores];
        var index = stores.findIndex(obj => obj.id === data.id);

        if (data.name !== "") {
            stores[index].name = data.name;
        }
        if (data.address.street !== "") {
            stores[index].address.street = data.address.street;
        }
        if (data.address.city !== "") {
            stores[index].address.city = data.address.city;
        }
        if (data.address.state !== "") {
            stores[index].address.state = data.address.state;
        }
        if (data.address.zip !== "") {
            stores[index].address.zip = data.address.zip;
        }

        const updatedStoreData = {
            id: data.id,
            name: stores[index].name,
            address: {
                street: stores[index].address.street,
                city: stores[index].address.city,
                state: stores[index].address.state,
                zip: stores[index].address.zip
            }
        }

        console.log(JSON.stringify(updatedStoreData));

        axios.put(base.serverURI + '/store', updatedStoreData, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ stores });
                    console.log('UPDATED STORE: ' + JSON.stringify(updatedStoreData));
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleAddStore = (e) => {
        e.preventDefault();
        this.setState({ show: false });

        const newStore = {
            name: this.state.name,
            address: {
                street: this.state.street,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip
            }
        };
        this.persistStoreData(newStore);
    }

    persistStoreData = (data) => {
        axios.post(base.serverURI + '/store', data, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    const newStores = [...this.state.stores, res.data];
                    this.setState({ stores: newStores });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    render() {
        let storeCards = this.state.stores.map((store) => {
            return (
                <Col sm="4">
                    <StoreCard key={store.id} removeStore={this.removeStore} editStore={this.editStore} store={store} />
                </Col>
            )
        });
        return (
            <div>
                <h2>Manage Store</h2>
                <Button variant="primary" onClick={() => this.setState({ show: true })}>
                    Create new store
                </Button>
                <br></br>
                <Modal
                    show={this.state.show}
                    onHide={() => this.setState({ show: false })}
                    dialogClassName="modal-90w"
                    style={{ width: '50%', position: 'fixed', left: '25%' }}
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Create new store
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleAddStore}>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    placeholder="Store name"
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    name="street"
                                    placeholder="1234 Main St"
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        name="city"
                                        placeholder="San Francisco"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        name="state"
                                        placeholder="CA"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="zip"
                                        maxLength="5"
                                        placeholder="12345"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Container fluid>
                    <Row>
                        {storeCards}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ManageStores;