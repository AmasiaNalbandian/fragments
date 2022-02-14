// src/routes/api/get.js
// Our response handlers
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  async function getFragments() {
    logger.info(`API - get.js: Attempting to get fragments by user`);
    var fragments = await Fragment.byUser(req.user, req.query?.expand);
    return fragments;
  }
  logger.debug(`GET v1/fragments - Query: ${req.query.expand}`);
  getFragments()
    .then((fragments) => {
      res.status(200).json(
        response.createSuccessResponse({
          status: 'ok',
          fragments: fragments,
        })
      );
    })
    .catch((e) => {
      res.status(400).json(
        response.createErrorResponse({
          status: 'error',
          error: {
            message: 'Something went wrong trying to get fragments for user by id',
            code: 404,
          },
        })
      );
    });
};
