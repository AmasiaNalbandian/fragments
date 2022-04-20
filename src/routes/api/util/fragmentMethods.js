// src/routes/api/util/fragmentMethods.js

const logger = require('../../../logger');
const { Fragment } = require('../../../model/fragment');

/**
 * Reusable method to save both metadata and data for a fragment.
 * @param {*} req - contains all content from request
 * @returns {Fragment} - Fragment Object with new Fragment details
 */
module.exports.saveFragment = async (req) => {
  const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
  logger.debug(`API - fragmentMethods.js: Received ${JSON.stringify(fragment)} `);

  await fragment.save();
  await fragment.setData(req.body);
  logger.debug(`size after save: ${fragment.size}`);
  return fragment;
};

/**
 *
 * @param {*} user
 * @param {*} fragmentId
 */
module.exports.deleteFragment = async (user, fragmentId) => {
  let fragment = Fragment;

  fragment = await Fragment.delete(user, fragmentId);
  return fragment;
};
