// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

const contentType = require('content-type');

const { Fragment } = require('./../../model/fragment');

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

/** ROUTES */
// GET Routes
router.get('/fragments', require('./get'));
router.get('/fragments/:id', require('./getDataById'));
router.get('/fragments/:id/info', require('./getMetadataById'));

// DELETE route:
router.delete('/fragments/:id', require('./deleteById'));

// POST route, use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
router.post('/fragments', rawBody(), require('./post'));

// PUT route, use rawBody() to return Buffer object or {} at req.body
router.put('/fragments/:id', rawBody(), require('./updateById'));
module.exports = router;
