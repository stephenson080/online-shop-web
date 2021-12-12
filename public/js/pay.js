let csrfToken;
const pay = (btn) => {
    csrfToken = btn.parentNode.querySelector('[name=_csrf]').value
    const email = document.getElementById("email").value
    const amount = document.getElementById("amount").value
    console.log(amount, email, csrfToken)
    let handler = PaystackPop.setup({
        key: 'pk_test_fcf99343fc472d939ef5bbe6ddca897535f30027', // Replace with your public key
        email: email,
        amount: amount * 100,
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        // label: "Optional string that replaces customer email"
        onClose: function () {
            alert('Window closed.');
        },
        callback: verify
    });
    handler.openIframe();
}

function verify(response) {
    let message = 'Payment complete! Reference: ' + response.reference;

    alert(message);
    console.log(response.reference)
    const ref = {
        reference: response.reference
    }
    console.log(response.reference, 's')
}