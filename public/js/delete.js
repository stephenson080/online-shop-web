const deleteProduct = (btn) =>{
    const productId = btn.parentNode.querySelector('[name=productId]').value
    console.log(productId)
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value
    const product = btn.closest('article')

    fetch("/admin/product/" + productId, {
        method: "DELETE",
        headers: {
            "csrf-token": csrfToken
        }
    })
    .then(result=>{
        return result.json()
    })
    .then(data=>{
        console.log(data)
        product.parentNode.removeChild(product)
    })
    .catch(err=>{
        console.log(err)
    })
}