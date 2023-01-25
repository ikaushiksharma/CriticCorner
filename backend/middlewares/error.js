const errorHandler = (err, req, res, next) => {
    res.status(500).json({ errro: err.message || err });
  };
  
module.exports=errorHandler