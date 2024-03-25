const checksum = require('../lib/checksum')
const config = require('../config')
const shortid = require('shortid');


const initPayment = (amount, )=>{
    return new Promise((resolve, reject)=>{
        let paytmPaymentObject = {
            ORDER_ID: shortid.generate(),
            CUST_ID: shortid.generate(),
            INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE_ID,
            
        }
    })
}