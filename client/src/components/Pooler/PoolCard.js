import React, { Component } from 'react';
//import axios from 'axios';
import {
    Card, CardImg, CardText, CardTitle, Button, CardBody, Col,
    Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody
} from 'reactstrap';
import * as Cookies from "js-cookie";
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class PoolCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            fade: true,
            hasReferral: "No",
            referralName: ""
            //isLeader: false
        }

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

    handleJoin() {
        this.props.handleJoinPool(this.props.pool.name, this.state.referralName);
        this.state.referralName = "";
    }

    render() {
        let enterReferral = null;
        if (this.state.hasReferral !== "No") {
            enterReferral = <FormGroup row>
                <Label for="exampleEmail" sm={2}>Referral</Label>
                <Col sm={10}>
                    <Input name="referralName" placeholder="name" onChange={this.handleChange} />
                </Col>
            </FormGroup>;
        }

        let { uuid, name, neighbourhood, description, zipcode } = this.props.pool;
        return (
            <div>
                <Card style={{ width: '20rem' }}>
                    <CardImg top width="100%" src="https://www.creativefabrica.com/wp-content/uploads/2019/04/Swimming-pool-icon-by-hellopixelzstudio-580x386.jpg" alt="Card image cap" />
                    <CardBody>
                        <CardTitle><strong>Name</strong>: {name}</CardTitle>
                        <CardText><strong>Neighborhood</strong>: {neighbourhood}</CardText>
                        <CardText><strong>Description</strong>: {description}</CardText>
                        <CardText><strong>Zipcode</strong>: {zipcode}</CardText>
                        <Button color="primary" onClick={this.toggle}>Join</Button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle}
                            fade={this.state.fade}
                            className={this.props.className}>
                            <ModalHeader toggle={this.toggle}>Request Approval</ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="exampleSelect">Do you have reference?</Label>
                                        <Input type="select" name="hasReferral" id="exampleSelect" onChange={this.handleChange}>
                                            <option>No</option>
                                            <option>Yes</option>
                                        </Input>
                                    </FormGroup>
                                </Form>
                                {enterReferral}
                            </ModalBody>
                            <Button color="primary" onClick={() => this.handleJoin()}>Request</Button>
                        </Modal>
                        <Button color="danger" onClick={() => this.props.removePool(uuid)}>Delete</Button>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default PoolCard;