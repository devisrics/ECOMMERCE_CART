import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getReviews } from "../../actions/productActions";
import { clearError, clearReviewDeleted } from "../../slices/productSlice";
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "./Sidebar";

export default function ReviewList() {
    const { reviews = [], loading = true, error, isReviewDeleted } = useSelector(state => state.productState);
    const [productId, setProductId] = useState("");
    const [deletingReviewId, setDeletingReviewId] = useState(null);
    const dispatch = useDispatch();

    const setReviews = () => ({
        columns: [
            { label: 'ID', field: 'id', sort: 'asc' },
            { label: 'Rating', field: 'rating', sort: 'asc' },
            { label: 'User', field: 'user', sort: 'asc' },
            { label: 'Comment', field: 'comment', sort: 'asc' },
            { label: 'Actions', field: 'actions', sort: 'asc' },
        ],
        rows: reviews.map(review => ({
            id: review._id,
            rating: review.rating,
            user: review.user.name,
            comment: review.comment,
            actions: (
                <Fragment>
                    <Button
                        onClick={() => deleteHandler(review._id)}
                        className="btn btn-danger py-1 px-2 ml-2"
                        disabled={deletingReviewId === review._id}
                    >
                        <i className="fa fa-trash"></i>
                    </Button>
                </Fragment>
            )
        }))
    });

    const deleteHandler = (id) => {
        setDeletingReviewId(id);
        dispatch(deleteReview(productId, id));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!productId) return toast.error("Please enter a product ID.", { position: "bottom-center" });
        dispatch(getReviews(productId));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "bottom-center", onOpen: () => dispatch(clearError()) });
            return;
        }

        if (isReviewDeleted) {
            toast.success("Review Deleted Successfully!", {
                position: "bottom-center",
                onOpen: () => dispatch(clearReviewDeleted())
            });
            setDeletingReviewId(null);
            if (productId) dispatch(getReviews(productId));
        }
    }, [dispatch, error, isReviewDeleted, productId]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Review List</h1>
                <div className="row justify-content-center mt-5">
                    <div className="col-5">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>Product ID</label>
                                <input
                                    type="text"
                                    onChange={e => setProductId(e.target.value)}
                                    value={productId}
                                    className="form-control"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary btn-block py-2"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setReviews()}
                            bordered
                            striped
                            hover
                            className="px-3"
                        />
                    }
                </Fragment>
            </div>
        </div>
    );
}
