module.exports = function(req, res, next) {

    // console.log("id is " + req.user.id + ";");
    User.findOne({ id: req.user.id, roleGroup: "admin" }, function(err, user) {

        if (err) { return res.forbidden(); }
        if (!user) {
            return res.forbidden();
        }

        next();
    });
}