const isAdminUser = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      message: "Access denied Admin rights required",
    });
  }
  next();
};
module.exports = isAdminUser;
