import React, { Component } from 'react';
import axios from 'axios';
import {
    Card, CardImg, CardText, CardTitle, CardBody, Button
} from 'reactstrap';
import * as Cookies from "js-cookie";
import base from '../../config/baseUrl';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class MyPool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poolDetails: {},
            isEmpty: true
        }
    }

    componentDidMount() {
        axios.get(base.serverURI+'/pool/mypool', { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    let obj = {};
                    let data = res.data;
                    obj.name = data.name;
                    obj.neighbourhood = data.neighbourhood;
                    obj.description = data.description;
                    obj.zip = data.zipcode;
                    obj.owner = data.owner.name;
                    this.setState({ poolDetails: obj, isEmpty: false });
                }
            }).catch((err) => {
                this.setState({ isEmpty: true });
                alert(err.response.data.message);
            });
    }

    leavePool() {
        axios.post(base.serverURI+'/pool/leavepool', {}, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    alert('You Left the Pool!');
                    this.props.history.push('/pools');
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    render() {
        let pool = this.state.poolDetails;
        let leaveButton = null;
        if (!this.state.isEmpty) {
            leaveButton =
                <Button variant="primary" type="submit" onClick={this.leavePool.bind(this)}>
                    Leave Pool
            </Button>
        }
        return (
            <div>
                <h1>Your Pool</h1>
                <Card style={{ width: '18rem' }}>
                    <CardImg src="https://www.creativefabrica.com/wp-content/uploads/2019/04/Swimming-pool-icon-by-hellopixelzstudio-580x386.jpg" alt="Card image cap" />
                    <CardBody>
                        <CardTitle><strong>Name</strong>: {pool.name}</CardTitle>
                        <CardText><strong>Neighborhood</strong>: {pool.neighbourhood}</CardText>
                        <CardText><strong>Description</strong>: {pool.description}</CardText>
                        <CardText><strong>Zipcode</strong>: {pool.zip}</CardText>
                        <CardText><strong>Owner</strong>: {pool.owner}</CardText>
                        {leaveButton}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default MyPool;