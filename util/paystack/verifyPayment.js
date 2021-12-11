const axios = require('axios').default
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY 
exports.verifyPayment = async reference => {
    // Verify payment with paystack
    //  https://api.paystack.co/transaction/verify/:reference
    // "Authorization: Bearer YOUR_SECRET_KEY"
    // -X GET
    try {
        
        const resData = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        })
        return resData.data
    } catch (error) {
        console.log(err)
    }

}