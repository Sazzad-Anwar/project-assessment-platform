module.exports = function hasPermission(role) {
  return (req, res, next) => {
    if (role.includes(req.user.role)) {
      next();
    } else {
      res
        .status(403)
        .json({ message: `You don't have permission to access this resource` });
    }
  };
};
