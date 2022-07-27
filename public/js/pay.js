let csrfToken;
const pay = (btn) => {
    csrfToken = btn.parentNode.querySelector('[name=_csrf]').value
    const paystackPK = btn.parentNode.querySelector('[name=paystack-pk]').value
    const email = document.getElementById("email").value
    const amount = document.getElementById("amount").value
    let handler = PaystackPop.setup({
        currency: 'NGN',
        key: paystackPK, // Replace with your public key
        email: email,
        amount: Math.ceil(amount * 100),
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        // label: "Optional string that replaces customer email"
        onClose: function () {
            alert('Payment Cancelled');
        },
        callback: verify
    });
    handler.openIframe();
}

function verify(response) {
    let message = 'Payment complete!'
    const form = document.getElementById('verify-form')
    const btn = document.getElementById('verify-btn')
    form.action = `/verify-payment/${response.reference}`
    btn.disabled = false
    alert(message);
}