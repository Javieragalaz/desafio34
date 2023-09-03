const report = async (req,res,next) => {
    const params = req.params;
    const url = req.url;
    const body = req.body

    next()

    console.log(` ${new Date()} - ${url} - ${body.email} `, params);
}


module.exports = { report }
