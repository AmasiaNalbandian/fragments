// src/routes/api/get.js
// Our response handlers
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = (req, res) => {
  logger.debug(`GET v1/fragments - getMetadataByID: Fragment ID detected: ${req.params.id}`);

  getFragmentById(req.user, req.params.id)
    .then((fragment) => {
      res.status(200).json(
        response.createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    })
    .catch(() => {
      res.status(404).json(
        response.createErrorResponse({
          message: `The fragment with id: ${req.params.id} does not exist.`,
          code: 404,
        })
      );
    });
};

async function getFragmentById(user, fragmentId) {
  logger.info(`API - get.js: Attempting to get fragment by fragment id`);
  let fragment = Fragment;

  fragment = await Fragment.byId(user, fragmentId);
  // const fragmentData = await Fragment.ge
  // Check if it is null to figure out if we throw error or not.
  if (fragment) {
    logger.debug(`API - get.js: getFragmentById - Fragment is not null.`);
    return new Fragment(fragment);
  } else {
    logger.debug(`API - get.js: getFragmentById - Fragment is null.`);
    throw new Error(`Fragment not found.`);
  }
}
