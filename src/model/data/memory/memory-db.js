//src/model/data/memory/memory-db.js
const logger = require('../../../logger');
const validateKey = (key) => typeof key === 'string';

class MemoryDB {
  constructor() {
    this.db = {};
  }

  /**
   * Gets a value for the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns Promise<any>
   */
  get(primaryKey, secondaryKey) {
    logger.info(`memory-db - GET - Primary Key: ${primaryKey}, and Secondary Key: ${secondaryKey}`);

    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }

    const db = this.db;
    const value = db[primaryKey] && db[primaryKey][secondaryKey];
    return Promise.resolve(value);
  }

  /**
   * Puts a value into the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @param value anything you would like to be stored
   * @returns Promise
   */
  put(primaryKey, secondaryKey, value) {
    logger.info(`memory-db - PUT - Primary Key: ${primaryKey}, and Secondary Key: ${secondaryKey}`);

    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }

    const db = this.db;
    // Make sure the `primaryKey` exists, or create
    db[primaryKey] = db[primaryKey] || {};
    // Add the `value` to the `secondaryKey`
    db[primaryKey][secondaryKey] = value;
    return Promise.resolve();
  }

  /**
   * Queries the list of values (i.e., secondaryKeys) for the given primaryKey.
   * Always returns an Array, even if no items are found.
   * @param {string} primaryKey
   * @returns Promise<any[]>
   */
  query(primaryKey) {
    logger.info(`memory-db - QUERY - Primary Key: ${primaryKey}`);

    if (!validateKey(primaryKey)) {
      throw new Error(`primaryKey string is required, got primaryKey=${primaryKey}`);
    }

    // No matter what, we always return an array (even if empty)
    const db = this.db;
    const values = (db[primaryKey] && Object.values(db[primaryKey])) || [];
    return Promise.resolve([].concat(values));
  }

  /**
   * Deletes the value with the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns Promise<any[]>
   */
  async del(primaryKey, secondaryKey) {
    logger.info(`memory-db - DEL - Primary Key: ${primaryKey}, and Secondary Key: ${secondaryKey}`);

    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }

    // Throw if trying to delete a key that doesn't exist
    if (!(await this.get(primaryKey, secondaryKey))) {
      throw new Error(
        `missing entry for primaryKey=${primaryKey} and secondaryKey=${secondaryKey}`
      );
    }

    const db = this.db;
    delete db[primaryKey][secondaryKey];
    return Promise.resolve();
  }
}

module.exports = MemoryDB;
