const crypt = require('../lib/crypt');
const util = require('util');
const crypto = require('crypto')

const paramsToString = (params, flag)=>{
    let data = "";
    let tempKeys = Object.keys(params);
    tempKeys.sort((a, b)=> {return a[0]-b[0]});
    tempKeys.forEach((key)=>{
        let n = params[key].includes("REFUND");
        let m = params[key].includes("|");
        if(n==true){
            params[key] = "";
        }
        if(m==true){
            params[key] = "";
        }
        if(key !== "CHECKSUMHASH"){
            if(params[key]===null){
                params[key]=""
            }
            if(!flag || params.indexOf(key) !== -1){
                data += params[key] + "|";
            }
        }
    })
    return data
}


const genCheckSum = (params, key, cb)=>{
    let data = paramsToString(params);
    crypt.randomBytes(16, (err, salt)=>{
        if(err){
            console.log("Error while generating the Hash value")
        }
        let sha256 = crypto
        .createHash('sha256')
        .update(data+salt)
        .digest("hex")
        let check_sum = sha256+salt;
        let encrypted = crypt.encrypt(check_sum, key)
        cb(undefined, encrypted) // This is the callback I'll get once Crypt is done
    });
}

const verifyCheckSum = (params, key, checkSumHash )=>{
    let data = paramsToString(params, false);
    if(typeof checkSumHash !== undefined){
        checkSumHash  = checkSumHash.replace("\n", "");
        checkSumHash = checkSumHash.replace("\r", "");
        let temp = decodeURIComponent(checkSumHash);
        let checksum = crypto.publicDecrypt(temp, key)
        let salt = checksum.substr(0, checksum.length - 4);
        let sha256 = checksum.substr(0, checksum - 4);
        let hash = crypto.createHash("sha256").update(params+"|"+salt).digest("hex")

        if(hash === sha256){
            return true;
        }
        else{
            util.log("Checksum is not matching");
            return false
        }
    }

    const verifyCheckSumSignature = (params, key, checksum)=>{
        
    }
}


// const crypto = require('crypto');

// class PaytmChecksum {
//     static async encrypt(input, key) {
//         const cipher = crypto.createCipheriv('aes-128-cbc', key, PaytmChecksum.iv);
//         let encrypted = cipher.update(input, 'binary', 'base64');
//         encrypted += cipher.final('base64');
//         return encrypted;
//     }

//     static async decrypt(encrypted, key) {
//         const decipher = crypto.createDecipheriv('aes-128-cbc', key, PaytmChecksum.iv);
//         let decrypted = decipher.update(encrypted, 'base64', 'binary');
//         try {
//             decrypted += decipher.final('binary');
//         } catch (e) {
//             console.log(e);
//         }
//         return decrypted;
//     }

//     static async generateSignature(params, key) {
//         if (typeof params !== "object" && typeof params !== "string") {
//             const error = "string or object expected, " + (typeof params) + " given.";
//             return Promise.reject(error);
//         }
//         if (typeof params !== "string") {
//             params = PaytmChecksum.getStringByParams(params);
//         }
//         return PaytmChecksum.generateSignatureByString(params, key);
//     }

//     static async verifySignature(params, key, checksum) {
//         if (typeof params !== "object" && typeof params !== "string") {
//             const error = "string or object expected, " + (typeof params) + " given.";
//             return Promise.reject(error);
//         }
//         if (params.hasOwnProperty("CHECKSUMHASH")) {
//             delete params.CHECKSUMHASH;
//         }
//         if (typeof params !== "string") {
//             params = PaytmChecksum.getStringByParams(params);
//         }
//         return PaytmChecksum.verifySignatureByString(params, key, checksum);
//     }

//     static async generateSignatureByString(params, key) {
//         const salt = await PaytmChecksum.generateRandomString(4);
//         return PaytmChecksum.calculateChecksum(params, key, salt);
//     }

//     static async verifySignatureByString(params, key, checksum) {
//         const paytm_hash = await PaytmChecksum.decrypt(checksum, key);
//         const salt = paytm_hash.substr(paytm_hash.length - 4);
//         return (paytm_hash === PaytmChecksum.calculateHash(params, salt));
//     }

//     static async generateRandomString(length) {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes((length * 3.0) / 4.0, (err, buf) => {
//                 if (!err) {
//                     const salt = buf.toString("base64");
//                     resolve(salt);
//                 } else {
//                     console.log("error occurred in generateRandomString: " + err);
//                     reject(err);
//                 }
//             });
//         });
//     }

//     static getStringByParams(params) {
//         const data = {};
//         Object.keys(params).sort().forEach(function (key) {
//             data[key] = (params[key] !== null && params[key].toLowerCase() !== "null") ? params[key] : "";
//         });
//         return Object.values(data).join('|');
//     }

//     static calculateHash(params, salt) {
//         const finalString = params + "|" + salt;
//         return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
//     }

//     static calculateChecksum(params, key, salt) {
//         const hashString = PaytmChecksum.calculateHash(params, salt);
//         return PaytmChecksum.encrypt(hashString, key);
//     }
// }
// PaytmChecksum.iv = '@@@@&&&&####$$$$';

// module.exports = PaytmChecksum;

