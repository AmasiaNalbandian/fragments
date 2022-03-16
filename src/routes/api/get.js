// src/routes/api/get.js
// Our response handlers
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = (req, res) => {
  logger.info(`GET v1/fragments request received`);

  // Check if there is an :id in the params - this is the get fragment by id route
  if (req.params.id) {
    logger.debug(`GET v1/fragments - Fragment ID detected: ${req.params.id}`);
    getFragmentById(req.user, req.params.id)
      .then((fragment) => {
        res.status(200).json(
          response.createSuccessResponse({
            status: 'ok',
            fragment: fragment.toString(),
          })
        );
      })
      .catch((e) => {
        res.status(404).json(
          response.createErrorResponse({
            message: `The fragment with id: ${req.params.id} does not exist: ${e}`,
            code: 404,
          })
        );
      });
  } else {
    // Route without id, returns getByUser
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
            message: `Something went wrong trying to get fragments for user by id: ${e}`,
            code: 400,
          })
        );
      });
  }
};

async function getFragmentByUserId(user, expand) {
  logger.info(`API - get.js>getFragmentByUserId: Attempting to get fragments by user`);
  let fragments = await Fragment.byUser(user, expand);
  logger.info(`API - get.js>getFragmentByUserId: Returned fragments: ${JSON.stringify(fragments)}`);

  return fragments;
}

async function getFragmentById(user, fragmentId) {
  logger.info(`API - get.js: Attempting to get fragment by fragment id`);
  let fragment = new Fragment(await Fragment.byId(user, fragmentId));

  if (fragment) {
    logger.debug(`API - get.js: getFragmentById - Fragment is not null.`);
    return fragment.getData();
  } else {
    logger.debug(`API - get.js: getFragmentById - Fragment is null.`);
    throw new Error(`Fragment not found.`);
  }
}
