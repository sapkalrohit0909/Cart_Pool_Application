import React, { Component } from 'react';
import {
    Card, CardImg, CardTitle, CardBody,
    Button, Form, FormGroup, Label, Input,
    Modal, ModalFooter, ModalHeader, ModalBody
} from 'reactstrap';
import S3FileUpload from 'react-s3';
import s3 from '../../config/s3config';

class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            fade: true,
            name: this.props.prod.name,
            imageUrl: this.props.prod.imageUrl,
            brand: this.props.prod.brand,
            unit: "PIECE",
            price: this.props.prod.price,
            description: this.props.prod.description
        };

        this.toggle = this.toggle.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
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

    updateProduct() {
        this.toggle();

        const updatedProduct = {
            sku: this.props.prod.sku,
            name: this.state.name,
            imageUrl: this.state.imageUrl,
            brand: this.state.brand,
            unit: this.state.unit,
            price: this.state.price,
            description: this.state.description,
            stores: this.props.prod.stores
        }
        this.props.editProduct(updatedProduct);
    }

    uploadImage = (e) => {
        S3FileUpload
            .uploadFile(e.target.files[0], s3.config)
            .then(data => this.setState({ imageUrl: data.location }))
            .catch(err => alert(err))
    }

    render() {
        let { name, imageUrl, description, sku, unit, price } = this.props.prod;
        return (
            <div>
                <Card style={{ width: '20rem' }}>
                    <CardImg src={imageUrl} alt="Card Image Cap" />
                    <CardBody>
                        <CardTitle><strong>Product Name:</strong> {name}</CardTitle>
                        <CardTitle><strong>Price:</strong> (${price} / {unit})</CardTitle>
                        <CardTitle><strong>SKU:</strong> {sku}</CardTitle>
                        <CardTitle><strong>Description:</strong> {description}</CardTitle>
                        <Button color="primary" onClick={this.toggle}>Edit</Button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle}
                            fade={this.state.fade}
                            className={this.props.className}>
                            <ModalHeader toggle={this.toggle}>Edit Product</ModalHeader>
                            <ModalBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="exampleName">Product Name</Label>
                                        <Input
                                            name="name"
                                            placeholder="name"
                                            defaultValue={name}
                                            onChange={this.handleChange} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleSelect">Unit</Label>
                                        <Input
                                            type="select"
                                            name="unit"
                                            onChange={this.handleChange}
                                            defaultValue={unit}>
                                            <option>PIECE</option>
                                            <option>POUND</option>
                                            <option>OZ</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleNumber">Price</Label>
                                        <Input
                                            name="price"
                                            placeholder="$$$"
                                            onChange={this.handleChange}
                                            defaultValue={price}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">Description</Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            placeholder="description"
                                            onChange={this.handleChange}
                                            defaultValue={description} />
                                    </FormGroup>
                                </Form>
                                <div>
                                    <form>
                                        <div class="form-group">
                                            <label for="exampleFormControlFile1">Upload an image</label>
                                            <input type="file" class="form-control-file" id="exampleFormControlFile1" onChange={this.uploadImage} />
                                        </div>
                                    </form>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.updateProduct}>Update</Button>{' '}
                            </ModalFooter>
                        </Modal>
                        <Button color="danger" onClick={() => this.props.removeProduct(sku)}>Delete</Button>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default ProductCard;