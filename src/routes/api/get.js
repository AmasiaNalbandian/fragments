// src/routes/api/get.js
// Our response handlers
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  logger.info(`GET v1/fragments request received`);

  // Check if there is an :id in the params - this is the get fragment by id route
  if (req.params.id) {
    logger.debug(`GET v1/fragments - Fragment ID detected: ${req.params.id}`);
    getFragmentById(req.user, req.params.id)
      .then((fragments) => {
        res.status(200).json(
          response.createSuccessResponse({
            status: 'ok',
            fragments: fragments,
          })
        );
      })
      .catch(() => {
        res.status(404).json(
          response.createErrorResponse({
            status: 'error',
            error: {
              message: `The fragment with id: ${req.params.id} does not exist.`,
              code: 404,
            },
          })
        );
      });
  } else {
    logger.debug(`GET v1/fragments - Query: ${req.query.expand ? 'expand' : 'no expand'}`);
    getFragmentByUserId(req.user, req.query?.expand)
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
              message: `Something went wrong trying to get fragments for user by id: ${e}`,
              code: 400,
            },
          })
        );
      });
  }
};

async function getFragmentByUserId(user, expand) {
  logger.info(`API - get.js: Attempting to get fragments by user`);
  let fragments = await Fragment.byUser(user, expand);
  return fragments;
}

async function getFragmentById(user, fragmentId) {
  logger.info(`API - get.js: Attempting to get fragment by fragment id`);
  let fragments = await Fragment.byId(user, fragmentId);
  return fragments;
}
