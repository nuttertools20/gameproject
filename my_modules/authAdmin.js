module.exports = function(req, res, next) {
	if (req.session && req.session.user.nick && req.session.user.admin)
    return next();
  else
    return res.sendStatus(401);
};