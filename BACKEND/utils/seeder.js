const products=require('../data/products.json')
const product=require('../models/productModel')
const dotenv=require('dotenv')
const ConnectDatabase=require('../config/database')

dotenv.config({path:'BACKEND/config/config.env'})
ConnectDatabase()

const seedProducts = async()=>{
    try{
    await product.deleteMany()
    console.log('products deleted');
    await product.insertMany(products)
    console.log('all products added');
    }
    catch(err){
        console.log(err.message);   
    }
    process.exit()
}

seedProducts()