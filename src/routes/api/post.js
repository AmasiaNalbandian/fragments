// src/routes/api/post.js

// Our response handlers
const logger = require('../../logger');
const response = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = (req, res) => {
  logger.info(`Received new request: ${req}`);

  // req.body is the data, and rawBody returns either Buffer or {}
  // Check if we have buffer, otherwise we can't save this, and create error response.
  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(
      response.createErrorResponse({
        status: 'error',
        error: {
          message: 'Body requires correct data that is supported.',
          code: 415,
        },
      })
    );
  }

  // Use fragments class to create and save a new fragment and the data.
  const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
  async function save() {
    logger.info(`API - Post.js: Attempting to save new fragment ${fragment} `);
    await fragment.save();
    await fragment.setData(req.body);
    logger.debug(`size after save: ${fragment.size}`);
  }
  save().then(() => {
    res.setHeader('Content-Type', fragment.type);
    res.setHeader('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);

    res.status(201).json(
      response.createSuccessResponse({
        status: 'ok',
        fragment: fragment,
      })
    );
  });
};
