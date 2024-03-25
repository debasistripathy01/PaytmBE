const bodyParser = require('body-parser');
const express = require('express')
require('dotenv').config();
const cors = require('cors');
const Router = express.Router()
const app = express();
app.use(bodyParser.json())


app.get('/orders', async()=>{
    // initPayment Transaction API that will send me the Token
})

app.post('/order-data', async()=>{
    // Post the paytm data
})



app.listen(process.env.PORT,()=>{
    
    try{
        console.log("Listening to port", process.env.PORT)
    }catch(error){

        console.log("Error starting nodejs app")
    }
})