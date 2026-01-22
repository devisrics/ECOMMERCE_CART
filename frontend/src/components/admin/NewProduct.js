import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { createNewProduct } from "../../actions/productActions";
import { clearError, clearProductCreated } from "../../slices/productSlice";
import { toast } from "react-toastify";

export default function NewProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const { loading, isProductCreated, error } = useSelector(state => state.productState || {});
    const categories = [
        'Electronics','Mobile Phones','Laptops','Accessories','Headphones','Food','Books',
        'Clothes/Shoes','Beauty/Health','Sports','Outdoor','Home'
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, file]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', parseInt(stock, 10));
        formData.append('description', description);
        formData.append('seller', seller);
        formData.append('category', category);
        images.forEach(image => formData.append('images', image));

        dispatch(createNewProduct(formData));
    };

    useEffect(() => {
        if (isProductCreated) {
            toast.success('Product Created Successfully!', {
                position: 'bottom-center',
                onOpen: () => dispatch(clearProductCreated())
            });
            navigate('/admin/products');
        }

        if (error) {
            toast.error(error, {
                position: 'bottom-center',
                onOpen: () => dispatch(clearError())
            });
        }
    }, [isProductCreated, error, dispatch, navigate]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <div className="wrapper my-5"> 
                    <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
                        <h1 className="mb-4">New Product</h1>

                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price_field">Price</label>
                            <input
                                type="text"
                                id="price_field"
                                className="form-control"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description_field">Description</label>
                            <textarea
                                className="form-control"
                                id="description_field"
                                rows="8"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category_field">Category</label>
                            <select
                                id="category_field"
                                className="form-control"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="">Select</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock_field">Stock</label>
                            <input
                                type="number"
                                id="stock_field"
                                className="form-control"
                                value={stock}
                                onChange={e => setStock(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="seller_field">Seller Name</label>
                            <input
                                type="text"
                                id="seller_field"
                                className="form-control"
                                value={seller}
                                onChange={e => setSeller(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Images</label>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    id="customFile"
                                    className="custom-file-input"
                                    multiple
                                    onChange={onImagesChange}
                                />
                                <label className="custom-file-label" htmlFor="customFile">Choose Images</label>
                            </div>
                            <div className="mt-2">
                                {imagesPreview.map(image => (
                                    <img
                                        key={image}
                                        src={image}
                                        alt="Preview"
                                        width="55"
                                        height="52"
                                        className="mr-2 mt-2"
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-block py-3"
                            id="login_button"
                            disabled={loading}
                        >
                            CREATE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
