import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createReview, getProduct } from "../../actions/productActions";
import { addCartItem } from "../../actions/cartActions";
import { clearReviewSubmitted, clearError, clearProduct } from "../../slices/productSlice";

import Loader from '../layouts/Loader';
import MetaData from "../layouts/MetaData";
import { Carousel, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";
import ProductReview from "./ProductReview";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { loading, product = {}, isReviewSubmitted, error } = useSelector(state => state.productState);
  const { user } = useSelector(state => state.authState);

  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  // --- Quantity Handlers ---
  const increaseQty = () => {
    if (product.stock === 0 || quantity >= product.stock) return;
    setQuantity(prev => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity(prev => prev - 1);
  };

  // --- Modal Handlers ---
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // --- Review Submission ---
  const reviewHandler = () => {
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    formData.append('productId', id);
    dispatch(createReview(formData));
  };

  // --- Effect for fetching product and handling review submission/error ---
  useEffect(() => {
    if (isReviewSubmitted) {
      handleClose();
      toast.success('Review Submitted successfully', {
        position: 'bottom-center',
        onOpen: () => dispatch(clearReviewSubmitted())
      });
    }

    if (error) {
      toast.error(error, {
        position: 'bottom-center',
        onOpen: () => dispatch(clearError())
      });
      return;
    }

    if (!product._id || isReviewSubmitted) {
      dispatch(getProduct(id));
    }

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id, isReviewSubmitted, error, product._id]);

  return (
    <Fragment>
      {loading ? <Loader /> :
        <Fragment>
          <MetaData title={product.name} />

          <div className="row f-flex justify-content-around">
            {/* Product Images */}
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images?.map(image => (
                  <Carousel.Item key={image._id}>
                    <img
                      className="d-block w-100"
                      src={image.image}
                      alt={product.name}
                      height="500"
                      width="500"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>

            {/* Product Info */}
            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product # {product._id}</p>
              <hr />

              {/* Rating */}
              <div className="rating-outer">
                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
              </div>
              <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
              <hr />

              {/* Price & Quantity */}
              <p id="product_price">${product.price}</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                id="cart_btn"
                disabled={product.stock === 0}
                onClick={() => {
                  dispatch(addCartItem(product._id, quantity));
                  toast.success('Cart Item Added!', { position: 'bottom-center' });
                }}
                className="btn btn-primary d-inline ml-4"
              >
                Add to Cart
              </button>
              <hr />

              {/* Stock Status */}
              <p>Status: <span className={product.stock > 0 ? 'greenColor' : 'redColor'} id="stock_status">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span></p>
              <hr />

              {/* Description */}
              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

              {/* Review Button */}
              {user ?
                <button onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4">
                  Submit Your Review
                </button>
                : <div className="alert alert-danger mt-5">Login to Post Review</div>
              }

              {/* Review Modal */}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Submit Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ul className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <li
                        key={star}
                        value={star}
                        className={`star ${star <= rating ? 'orange' : ''}`}
                        onClick={() => setRating(star)}
                      >
                        <i className="fa fa-star"></i>
                      </li>
                    ))}
                  </ul>

                  <textarea
                    onChange={e => setComment(e.target.value)}
                    name="review"
                    id="review"
                    className="form-control mt-3"
                  />

                  <button
                    disabled={loading}
                    onClick={reviewHandler}
                    className="btn my-3 float-right review-btn px-4 text-white"
                  >
                    Submit
                  </button>
                </Modal.Body>
              </Modal>
            </div>
          </div>

          {/* Product Reviews */}
          {product.reviews?.length > 0 && <ProductReview reviews={product.reviews} />}
        </Fragment>
      }
    </Fragment>
  );
}
