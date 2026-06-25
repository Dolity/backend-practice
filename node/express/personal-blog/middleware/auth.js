export const requireAuth = (req, res, next) => {
  if (req.session?.admin) return next();
  res.redirect("/admin/login");
};
