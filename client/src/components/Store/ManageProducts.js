import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Button, Col, Row, Container, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FormGroup, Label, Input } from 'reactstrap';
import { MDBCol, MDBFormInline, MDBBtn } from "mdbreact";
import ProductCard from './ProductCard';
import * as Cookies from "js-cookie";
import S3FileUpload from 'react-s3';
import s3 from '../../config/s3config';
import base from '../../config/baseUrl';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
}

class ManageProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageUrl: "",
            brand: "",
            unit: "PIECE",
            price: "",
            description: "",
            products: [],
            stores: [],
            selectedStores: [],
            searchName: "",
            searchID: 0,
            searchSKU: 0,
            show: false
        }
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.searchByID = this.searchByID.bind(this);
        this.searchByName = this.searchByName.bind(this);
        this.searchBySKU = this.searchBySKU.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    componentDidMount() {
        axios.get(base.serverURI + '/store', { "headers": headers })
            .then(res => {
                this.setState({ stores: res.data });
            }).catch((err) => {
                alert(err.response.data.message);
            });

        axios.get(base.serverURI + '/product/all', { "headers": headers })
            .then(res => {
                this.setState({ products: res.data });
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    removeProduct(sku) {
        console.log("REMOVING PRODUCT: " + sku);
        axios.delete(base.serverURI + '/product/' + sku, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    alert('Removed product!');
                    this.setState({ products: this.state.products.filter(prod => prod.sku !== sku) });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    editProduct(data) {
        var products = [...this.state.products];
        var index = products.findIndex(obj => obj.sku === data.sku);
        if (data.name !== "") {
            products[index].name = data.name;
        }
        if (data.imageUrl !== "") {
            products[index].imageUrl = data.imageUrl;
        }
        if (data.brand !== "") {
            products[index].brand = data.brand;
        }
        if (data.price !== "") {
            products[index].price = data.price;
        }
        if (data.unit !== "") {
            products[index].unit = data.unit;
        }
        if (data.description !== "") {
            products[index].description = data.description;
        }
        if (data.stores !== "") {
            products[index].stores = data.stores;
        }

        let storeIDs = [];
        data.stores.forEach(element => {
            storeIDs.push(element.id);
        });

        const updatedProductData = {
            sku: data.sku,
            name: products[index].name,
            imageUrl: products[index].imageUrl,
            brand: products[index].brand,
            price: products[index].price,
            unit: products[index].unit,
            description: products[index].description,
            stores: storeIDs
        }

        console.log(JSON.stringify(updatedProductData));

        axios.put(base.serverURI + '/product', updatedProductData, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    console.log('UPDATED PRODUCT: ' + JSON.stringify(updatedProductData));
                    this.setState({ products });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }


    handleAddProduct = (e) => {
        e.preventDefault();
        this.setState({ show: false });
        const newProduct = {
            name: this.state.name,
            imageUrl: this.state.imageUrl,
            brand: this.state.brand,
            unit: this.state.unit,
            price: this.state.price,
            description: this.state.description,
            stores: this.state.selectedStores
        };

        console.log(JSON.stringify(newProduct));
        this.persistProductData(newProduct);
    }

    persistProductData = (data) => {
        axios.post(base.serverURI + '/product', data, { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    const newProducts = [...this.state.products, res.data];
                    this.setState({ products: newProducts });
                }
            }).catch((err) => {
                alert(err.response.data.message);
            });
    }

    handleOptionChange = (e) => {
        let opts = [], opt;
        for (let i = 0, len = e.target.options.length; i < len; i++) {
            opt = e.target.options[i];
            let optID = this.state.stores.find(x => x.name === opt.value).id;
            if (opt.selected) {
                opts.push(optID);
            }
        }
        this.state.selectedStores = opts;
    }

    loadOptions(i) {
        return <option>{i.name}</option>
    }

    searchByID() {
        axios.get(base.serverURI + '/store/' + this.state.searchID,
            { "headers": headers })
            .then(res => {
                let prods = [];
                if (res.status === 200) {
                    res.data.product.forEach(element => {
                        prods.push(element);
                    });
                    this.setState({ products: prods });
                }
            }).catch((err) => {
                this.setState({ products: [] });
            });
    }

    searchByName() {
        axios.get(base.serverURI + '/product/name=' + this.state.searchName,
            { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ products: res.data });
                }
            }).catch((err) => {
                this.setState({ products: [] });
            });
    }

    searchBySKU() {
        axios.get(base.serverURI + '/product/sku=' + this.state.searchSKU,
            { "headers": headers })
            .then(res => {
                if (res.status === 200) {
                    let prod = [];
                    prod.push(res.data);
                    this.setState({ products: prod });
                }
            }).catch((err) => {
                this.setState({ products: [] });
            });
    }

    uploadImage = (e) => {
        S3FileUpload
            .uploadFile(e.target.files[0], s3.config)
            .then(data => this.setState({ imageUrl: data.location }))
            .catch(err => alert(err))
    }

    render() {
        let productCards = this.state.products.map((prod) => {
            return (
                <Col sm="4">
                    <ProductCard key={prod.id} removeProduct={this.removeProduct} editProduct={this.editProduct} prod={prod} />
                </Col>
            )
        });
        return (
            <div>
                <MDBCol md="12">
                    <MDBFormInline className="md-form mr-auto mb-4">
                        <input className="form-control mr-sm-2" type="number" name="searchID" onChange={this.handleChange} placeholder="Store ID" aria-label="Search" />
                        <MDBBtn gradient="aqua" rounded size="sm" onClick={this.searchByID} className="mr-auto">
                            Search By ID
                        </MDBBtn>
                        <input className="form-control mr-sm-2" type="text" name="searchName" onChange={this.handleChange} placeholder="Product Name" aria-label="Search" />
                        <MDBBtn outline color="warning" rounded size="sm" onClick={this.searchByName} className="mr-auto">
                            Search By Name
                        </MDBBtn>
                        <input className="form-control mr-sm-2" type="number" name="searchSKU" onChange={this.handleChange} placeholder="Product SKU" aria-label="Search" />
                        <MDBBtn color="unique" rounded size="sm" onClick={this.searchBySKU} className="mr-auto">
                            Search by SKU
                        </MDBBtn>
                    </MDBFormInline>
                </MDBCol>
                <div className="form-div">
                    <h2>Manage Products</h2>
                    <Button variant="primary" onClick={() => this.setState({ show: true })}>
                        Create new product
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
                                Create new product
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.handleAddProduct}>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        name="name"
                                        placeholder="Product Name"
                                        onChange={this.handleChange}
                                        required />
                                </Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>Brand</Form.Label>
                                        <Form.Control
                                            name="brand"
                                            onChange={this.handleChange} />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Unit</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="unit"
                                            defaultValue="pc"
                                            onChange={this.handleChange}
                                            required>
                                            <option>PIECE</option>
                                            <option>POUND</option>
                                            <option>OZ</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            aria-label="Amount USD"
                                            name="price"
                                            onChange={this.handleChange}
                                            required />
                                    </InputGroup>
                                </Form.Row>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows="3"
                                        name="description"
                                        onChange={this.handleChange}
                                        required />
                                </Form.Group>
                                <FormGroup>
                                    <Label for="exampleSelectMulti">Select Store(s)</Label>
                                    <Input
                                        type="select"
                                        name="selectMulti"
                                        id="exampleSelectMulti"
                                        multiple
                                        onChange={this.handleOptionChange}
                                        value={this.state.selectValue}
                                        required>
                                        {this.state.stores.map(this.loadOptions)}
                                    </Input>
                                </FormGroup>
                                <div>
                                    <form>
                                        <div class="form-group">
                                            <label for="exampleFormControlFile1">Upload an image</label>
                                            <input type="file" class="form-control-file" id="exampleFormControlFile1" onChange={this.uploadImage} />
                                        </div>
                                    </form>
                                </div>
                                <Button variant="primary" type="submit">
                                    Add
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
                <Container fluid>
                    <Row>
                        {productCards}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ManageProducts;