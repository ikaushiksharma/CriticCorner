const errorHandler = (err, req, res, next) => {
    res.status(500).json({ error: err.message || err });
  };
  
module.exports=errorHandler