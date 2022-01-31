// src/routes/api/get.js
// Our response handlers
const response = require('../../response');
/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working
  res.status(200).json(
    response.createSuccessResponse({
      status: 'ok',
      fragments: [],
    })
  );
};
