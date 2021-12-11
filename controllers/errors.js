exports.get404Page = (req,res)=>{
    res.status(404).render("404", {docTitle: "Page Not Found", path: "/"})
}

exports.get500Page = (req,res)=>{
    res.status(500).render("500", {docTitle: "Error", path: "/"})
}