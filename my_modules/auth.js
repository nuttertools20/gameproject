module.exports = function(req, res, next) {
  if (true || req.session && req.session.nick){
    return next();
  }else{
    return res.sendStatus(401);
	}
};