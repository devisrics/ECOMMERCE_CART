import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slices/productSlice";
import { toast } from "react-toastify";

export default function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);

  const { id: productId } = useParams();
  const { loading, isProductUpdated, error, product } = useSelector(state => state.productState);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = [
    "Electronics", "Mobile Phones", "Laptops", "Accessories", "Headphones",
    "Food", "Books", "Clothes/Shoes", "Beauty/Health", "Sports", "Outdoor", "Home"
  ];

  // Handle image selection
  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview(prev => [...prev, reader.result]);
          setImages(prev => [...prev, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Clear selected images
  const clearImagesHandler = () => {
    setImages([]);
    setImagesPreview([]);
    setImagesCleared(true);
  };

  // Handle form submit
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("seller", seller);
    formData.append("category", category);
    images.forEach(image => formData.append("images", image));
    formData.append("imagesCleared", imagesCleared);

    dispatch(updateProduct(productId, formData));
  };

  // Fetch product and handle notifications
  useEffect(() => {
    if (isProductUpdated) {
      toast.success("Product Updated Successfully!", { position: "bottom-center" });
      dispatch(clearProductUpdated());
      navigate("/admin/products");
    }

    if (error) {
      toast.error(error, { position: "bottom-center" });
      dispatch(clearError());
    }

    dispatch(getProduct(productId));
  }, [dispatch, productId, isProductUpdated, error, navigate]);

  // Set form fields when product loads
  useEffect(() => {
    if (product._id) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setSeller(product.seller);
      setCategory(product.category);

      const imageUrls = product.images?.map(img => img.image) || [];
      setImagesPreview(imageUrls);
    }
  }, [product]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <Fragment>
          <div className="wrapper my-5">
            <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
              <h1 className="mb-4">Update Product</h1>

              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input type="text" id="name_field" className="form-control" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="price_field">Price</label>
                <input type="text" id="price_field" className="form-control" value={price} onChange={e => setPrice(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="description_field">Description</label>
                <textarea id="description_field" className="form-control" rows="8" value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="category_field">Category</label>
                <select id="category_field" className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock_field">Stock</label>
                <input type="number" id="stock_field" className="form-control" value={stock} onChange={e => setStock(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="seller_field">Seller Name</label>
                <input type="text" id="seller_field" className="form-control" value={seller} onChange={e => setSeller(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Images</label>
                <div className="custom-file">
                  <input type="file" id="customFile" className="custom-file-input" multiple onChange={onImagesChange} />
                  <label className="custom-file-label" htmlFor="customFile">Choose Images</label>
                </div>

                {imagesPreview.length > 0 && (
                  <span className="mr-2" onClick={clearImagesHandler} style={{ cursor: "pointer" }}>
                    <i className="fa fa-trash"></i>
                  </span>
                )}
                {imagesPreview.map((img, idx) => (
                  <img key={idx} src={img} alt={`Preview ${idx}`} width="55" height="52" className="mt-3 mr-2" />
                ))}
              </div>

              <button type="submit" className="btn btn-block py-3" disabled={loading}>UPDATE</button>
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
