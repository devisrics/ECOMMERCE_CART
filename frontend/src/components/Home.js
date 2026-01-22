import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.productsState
  );

  const [currentPage, setCurrentPage] = useState(1);

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-center" });
      return;
    }

    // Fetch products for current page
    dispatch(getProducts(null, null, null, null, currentPage));
  }, [dispatch, error, currentPage]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Buy Best Products" />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products && products.length > 0 ? (
                products.map((product) => <Product col={3} key={product._id} product={product} />)
              ) : (
                <p className="text-center">No products found.</p>
              )}
            </div>
          </section>

          {productsCount > resPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText="Next"
                firstPageText="First"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
