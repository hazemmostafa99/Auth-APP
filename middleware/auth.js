const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  console.log("authHeader", authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied No token provided login to continue",
    });
  }

  // decode user data
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("decodedToken", decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({
      message: error.message,
    });
  }
};

module.exports = authMiddleware;
