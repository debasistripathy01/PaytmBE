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
        
    }
}



