import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Button, Col, Row, Container, Form } from 'react-bootstrap';
import PoolCard from './PoolCard';
import { MDBCol, MDBFormInline, MDBBtn } from "mdbreact";
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class ManagePools extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            name: "",
            neighbourhood: "",
            description: "",
            zipcode: "",
            pools: [],
            searchNeighbor: "",
            searchName: "",
            searchZip: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleCreatePool = this.handleCreatePool.bind(this);
        this.handleJoinPool = this.handleJoinPool.bind(this);
        this.removePool = this.removePool.bind(this);
    }

    searchPoolByName() {
        this.searchByCategory('name', this.state.searchName);
    }

    searchPoolByZipCode() {
        this.searchByCategory('zipcode', this.state.searchZip);
    }

    searchPoolByNeighborHood() {
        this.searchByCategory('neighborhood', this.state.searchNeighbor);
    }

    searchByCategory(category, content) {
        axios.get(base.serverURI+'/pool?' + category + '=' + content, { "headers": headers })
            .then(res => {
                if (res.status === 200 && res.data.some(el => !!el)) {
                    console.log(res.data);
                    this.setState({ pools: res.data });
                } else {
                    this.setState({ pools: [] });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    handleJoinPool(name, referral) {
        console.log(referral);
        if (referral !== "") {
            axios.post(base.serverURI+"/pool/joinpool/" + name + "?refree=" + referral, {}, { "headers": headers })
                .then(res => {
                    if (res.status === 200) {
                        alert('Request sent!');
                    }
                }).catch((err) => {
                    alert(err.response.data.message);
                });
        } else {
            this.joinPoolWithoutReferral(name);
        }
    }

    joinPoolWithoutReferral(name) {
        axios.post(base.serverURI+'/pool/joinpool/' + name, {}, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    alert('Request sent!');
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleCreatePool = (e) => {
        e.preventDefault();
        this.setState({ show: false });

        const newPool = {
            name: this.state.name,
            neighbourhood: this.state.neighbourhood,
            description: this.state.description,
            zipcode: this.state.zipcode
        }
        this.persistPoolData(newPool);
    }

    persistPoolData = (data) => {
        console.log(headers);
        axios.post(base.serverURI+'/pool/create', data, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    alert('Pool: ' + res.data.name + ' created successfully!');
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    removePool(id) {
        axios.delete(base.serverURI+'/pool/delete', { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    alert('Removed Pool!');
                    this.setState({ pools: this.state.pools.filter(pool => pool.uuid !== id) });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    render() {
        let poolCards = this.state.pools.map((pool) => {
            return (
                <Col sm="4">
                    <PoolCard key={pool.id} removePool={this.removePool} handleJoinPool={this.handleJoinPool} pool={pool} />
                </Col>
            )
        });
        return (
            <div>
                <MDBCol md="12">
                    <MDBFormInline className="md-form mr-auto mb-4">
                        <input className="form-control mr-sm-2" type="text" name="searchName" onChange={this.handleChange} placeholder="Pool Name" aria-label="Search" />
                        <MDBBtn gradient="aqua" rounded size="sm" onClick={this.searchPoolByName.bind(this)} className="mr-auto">
                            Search By Name
                        </MDBBtn>
                        <input className="form-control mr-sm-2" type="text" name="searchZip" onChange={this.handleChange} placeholder="Pool Zip" aria-label="Search" />
                        <MDBBtn outline color="warning" rounded size="sm" onClick={this.searchPoolByZipCode.bind(this)} className="mr-auto">
                            Search By Zip
                        </MDBBtn>
                        <input className="form-control mr-sm-2" type="text" name="searchNeighbor" onChange={this.handleChange} placeholder="Pool Neighborhood" aria-label="Search" />
                        <MDBBtn color="unique" rounded size="sm" onClick={this.searchPoolByNeighborHood.bind(this)} className="mr-auto">
                            Search by Neighborhood
                        </MDBBtn>
                    </MDBFormInline>
                </MDBCol>
                <h2>Manage Pool</h2>
                <Button variant="primary" onClick={() => this.setState({ show: true })}>
                    Create new pool
                </Button>
                <Button variant="primary" onClick={() => this.props.history.push('/mypool')}>
                    View My Pool
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
                            New Pool
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    placeholder="Pool name"
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Neighbourhood</Form.Label>
                                <Form.Control
                                    name="neighbourhood"
                                    placeholder="1234 Main St"
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        name="zipcode"
                                        placeholder="12345"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        name="description"
                                        placeholder="best pool ever"
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Button variant="primary" type="submit" onClick={this.handleCreatePool}>
                                Create
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Container fluid>
                    <Row>
                        {poolCards}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ManagePools;
