const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // const token = req.headers.authorization;
    // if (token) {
      //     next();
      // } else {
        //     throw 'Invalid token';
        // }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'hsC0hyDhU80V16JKyKVN9LH7M2uXye8dYKWaita2XBwkdbE7FIV1u6uAmDMJPTwR');
    const userId = decodedToken.userId;
    next();
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};