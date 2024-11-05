const checkSessionMiddleware = (req, res, next) => {
  if (!req.session.user) {
    if (req.cookies.eg) {
      req.session.user = {
        id: req.cookies.eg,
      };
    } else {
      return res.redirect("/admin/index");
    }
  }
  next();
};

module.exports = checkSessionMiddleware;
