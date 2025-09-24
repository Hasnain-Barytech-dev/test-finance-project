const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

const checkResourceAccess = async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  if (req.body && req.body.userId && req.body.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: Cannot create resources for other users' });
  }

  next();
};

module.exports = {
  authorize,
  checkResourceAccess
};