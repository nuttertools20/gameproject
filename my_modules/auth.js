
module.exports = function(req, res, next) {
	// if (req.session && req.session.user.nick && req.session.user.admin)
 //    return next();
 if (req.session && req.session.user) {	
   	return next();
   }  
  else	
   res.redirect("/autorization");   
    // return res.sendStatus(401);  
}