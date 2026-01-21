const catchAsyncError = require('../middlewares/catchAsyncError')
const Order=require('../models/orderModel')
const Product=require('../models/productModel')
const ErrorHandler=require('../utils/errorHandler')

// Create New Order - api/v1/order/new
exports.newOrder = catchAsyncError( async(req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
    orderItems,
    shippingInfo: {
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,       
        country: shippingInfo.country,
        phoneNumber: shippingInfo.phoneNo, 
        postalCode: shippingInfo.postalCode
    },
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id
});


    res.status(200).json({
        success:true,
        order
    })
})


// Get single Order- api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id).populate('user','name email')
    if(!order){
        return next(new ErrorHandler(`order Not Found with this id ${req.params.id}`,404))
    }
    res.status(201).json({
        success: true,
        order
    })
})

// Get Loggedin User Orders - /api/v1/myorders
exports.myOrders = catchAsyncError(async (req,res,next) =>{
    const orders = await Order.find({user: req.user.id})
    res.status(201).json({
        success: true,
        orders
    })
})


// Admin: Get All orders - /api/v1/orders
exports.orders=catchAsyncError(async(req,res,next)=>{
   const orders = await Order.find()
   
   let totalamount=0
   orders.forEach(order =>{
    totalamount +=order.totalPrice
   })

   res.status(200).json({
    success:true,
    totalamount,
    orders
   })
})

// Admin: Update order/Order Status -api/v1/order/:id
exports.updateOrder = catchAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id)

    if(order.orderStatus == 'Delivered'){
        return next(new ErrorHandler('Order has been already delievered!',400))
    }

    // Updating the product stock of each order item
    order.orderItems.forEach(async orderitem =>{
        await updateStock(orderitem.product,orderitem.quantity)
    })

    order.orderStatus = req.body.orderStatus
    order.deliveredAt = Date.now()
    await order.save()

    res.status(200).json({
        success:true,
    })
})

async function updateStock (productid,quantity){
    const product=await Product.findById(productid)
    product.stock=product.stock-quantity
    product.save({validateBeforeSave:false})
}

// Admin: Delete Order - /api/v1/order/:id
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
   const order = await Order.findById(req.params.id)
   if(!order){
    return next(new ErrorHandler(`order Not Found with this id ${req.params.id}`,404))
   }
   await Order.findByIdAndDelete(req.params.id)
   res.status(200).json({
    success:true
   })
})