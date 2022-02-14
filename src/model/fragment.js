// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data/memory/index');
// const { P } = require('pino');
const logger = require('../../src/logger');
// const { json } = require('express/lib/response');
// TODO: come back and write better logs with pino
// Supported formats - list of the formats as global
const supportedFormats = ['text/plain'];

class Fragment {
  constructor({ id = nanoid(), ownerId, created, updated, type, size = 0 }) {
    if (Math.sign(size) < 0 || !Number.isInteger(size)) {
      throw new Error(`Size must be a positive number, got size=${size}`);
    }

    if (!type.includes('text/plain')) {
      throw new Error(`Type is not supported, must be plain/text but got ${type}`);
    }

    if (!ownerId) {
      throw new Error(`Missing parameter: ownerId, received ${ownerId}`);
    }

    this.id = id;
    this.ownerId = ownerId;
    // If we don't receive a date(created = null), then we set the date.
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
    logger.debug(`Fragment.js - Constructor - type:  ${this.type}`);
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    try {
      var fragments = await listFragments(ownerId, expand);
      logger.info(`Fragments.js - By User - Returned fragments: ${JSON.stringify(fragments)}`);
    } catch (e) {
      logger.error(`There was an error fetching fragments byUser: ${e}`);
    }
    return fragments;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    try {
      var fragmentById = await readFragment(ownerId, id);
    } catch (e) {
      logger.error(`Fragment.js - byId - ${e}`);
    }
    return new Fragment(fragmentById);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    // TODO
    try {
      var deleteFragments = deleteFragment(ownerId, id);
    } catch (e) {
      logger.error('Fragment.js - delete: There was an error deleting the fragment');
    }
    return deleteFragments;
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    logger.debug(`Fragment.js - Save() - Time before update: ${this.updated}`);
    this.updated = new Date().toISOString();
    logger.debug(
      `Fragment.js - Save() - Time after update: ${this.updated} time now: ${new Date()}`
    );
    let fragment = {
      id: this.id,
      ownerId: this.ownerId,
      created: this.created,
      updated: this.updated,
      type: this.type,
      size: this.size,
    };
    try {
      var f = writeFragment(fragment);
      logger.debug(
        `Fragment.js - Constructor - saved new fragment:  ${fragment.id} for owner: ${this.ownerId} at ${this.updated}`
      );
    } catch (e) {
      logger.error(`Fragment.js - Constructor - Could not create new fragment`);
      throw e;
    }
    return f;
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    try {
      var f = readFragmentData(this.ownerId, this.id);
    } catch (e) {
      logger.error(
        `Fragment.js - getData() - Could not fetch data for the fragment with id: ${this.id}`
      );
    }
    return f;
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    if (!Buffer.isBuffer(data)) {
      throw new Error(`Data must be of buffer type`);
    }
    this.updated = new Date().toISOString();
    this.size = Buffer.byteLength(data);

    try {
      this.save();
      var f = writeFragmentData(this.ownerId, this.id, data);
    } catch (e) {
      logger.error(`There was an error setting data: ${e}`);
    }
    return f;
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * @returns {boolean} true if type is text/plain
   */
  get isText() {
    // TODO
    const isText = this.type.includes('text/plain');
    logger.info(`Fragment.js - isText - type:  ${isText}`);

    return isText;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return supportedFormats;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // Change this to getFormats to see if its one of those, and then return (as we update the types supported)
    let isSupported = value.includes('text/plain');
    logger.info(
      `Fragment - isSupportType - Value of ${value} ${isSupported ? 'is' : 'is not'} supported.`
    );
    return isSupported;
  }
}

module.exports.Fragment = Fragment;
