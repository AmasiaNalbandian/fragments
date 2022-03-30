// src/routes/api/get.js
// Our response handlers
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');
var md = require('markdown-it')();

module.exports = (req, res) => {
  logger.debug(`GET v1/fragments - Fragment ID detected: ${req.params.id}`);
  // Check for extension in id param
  // https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript
  // Need to use: https://nodejs.org/api/path.html#pathextnamepath, as .ext does not support .json
  // and nanoid does not produce id with '.'
  const ext = path.extname(req.params.id);
  const id = req.params.id.replace(ext, '');
  logger.debug(`GET v1/fragments - byId: received extension of ${ext} and id of ${id}`);
  getFragmentById(req.user, id)
    .then((fragment) => {
      const { metadata, data } = fragment;
      // If extension is provided, and is NOT supported, res415
      if (ext.length && !metadata.formats.includes(ext)) {
        logger.info(
          `GET v1/fragments - byId: Invalid extension ${ext}. This file type supports:`,
          metadata.formats
        );
        res.status(415).json(
          response.createErrorResponse({
            code: 415,
            message: `Requested extension of ${ext} is not supported for this fragment.`,
          })
        );
      } else {
        res.setHeader(
          'Content-Type',
          ext.length ? metadata.mimeTypeByExtension(ext) : metadata.mimeType
        );

        let isConvertedSupportType = ext === '.html' && metadata.mimeType === 'text/markdown';
        logger.debug(
          `isConverted: ${isConvertedSupportType}, fragment mimtype: ${metadata.mimeType}`
        );
        res.status(200).json(
          response.createSuccessResponse({
            status: 'ok',
            code: 200,
            fragment: isConvertedSupportType ? md.render(data.toString()) : data.toString(),
          })
        );
      }
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
  logger.info(`API - get.js: Attempting to get fragment by fragment id: ${fragmentId}`);
  let metadata = new Fragment(await Fragment.byId(user, fragmentId));

  if (metadata) {
    logger.debug(`API - get.js: getFragmentById - Fragment is not null.`);
    const data = await metadata.getData();
    return { metadata, data };
  } else {
    logger.debug(`API - get.js: getFragmentById - Fragment is null.`);
    throw new Error(`Fragment not found.`);
  }
}
