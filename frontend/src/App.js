import './App.css';
import { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import store from './store';
import { loadUser } from './actions/userActions';

// Layouts
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Loader from './components/layouts/Loader';

// Pages / Components
import Home from './components/Home';
import ProductDetail from './components/product/ProductDetail';
import ProductSearch from './components/product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import UserOrders from './components/order/UserOrders';
import OrderDetail from './components/order/OrderDetail';

// Admin
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import UpdateOrder from './components/admin/UpdateOrder';
import UserList from './components/admin/UserList';
import UpdateUser from './components/admin/UpdateUser';
import ReviewList from './components/admin/ReviewList';

// Routes
import ProtectedRoute from './components/route/ProtectedRoute';

axios.defaults.withCredentials = true;

function App() {
  const [stripeApiKey, setStripeApiKey] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function initApp() {
      try {
        // Load authenticated user
        await store.dispatch(loadUser());
        
        // Get Stripe API key only if user is authenticated
        const { data } = await axios.get('/api/v1/stripeapi');
        setStripeApiKey(data.stripeApiKey);
      } catch (err) {
        console.log('Stripe key not loaded or user not logged in');
      } finally {
        setLoadingUser(false);
      }
    }

    initApp();
  }, []);

  if (loadingUser) return <Loader />;

  return (
    <Router>
      <HelmetProvider>
        <Header />
        <ToastContainer theme='dark' />
        <div className='container container-fluid mt-4'>
          <Routes>

            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/search/:keyword' element={<ProductSearch />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/password/forgot' element={<ForgotPassword />} />
            <Route path='/password/reset/:token' element={<ResetPassword />} />
            <Route path='/cart' element={<Cart />} />

            {/* Protected User Routes */}
            <Route path='/myprofile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
            <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
            <Route path='/shipping' element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
            <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
            <Route path='/order/success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path='/orders' element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
            <Route path='/order/:id' element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

            {/* Stripe Payment */}
            {stripeApiKey && (
              <Route
                path='/payment'
                element={
                  <ProtectedRoute>
                    <Elements stripe={loadStripe(stripeApiKey)}>
                      <Payment />
                    </Elements>
                  </ProtectedRoute>
                }
              />
            )}

            {/* Admin Routes */}
            <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
            <Route path='/admin/products' element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
            <Route path='/admin/products/create' element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
            <Route path='/admin/product/:id' element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
            <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} />
            <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true}><UpdateOrder /></ProtectedRoute>} />
            <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><UserList /></ProtectedRoute>} />
            <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
            <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true}><ReviewList /></ProtectedRoute>} />

          </Routes>
        </div>
        <Footer />
      </HelmetProvider>
    </Router>
  );
}

export default App;
