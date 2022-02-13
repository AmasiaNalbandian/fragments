// tests/unit/memory-db.js
const MemoryDB = require('../../src/model/data/memory/index');

describe('memory-db index', () => {
  // let db;

  beforeEach(() => {
    // const data = new MemoryDB();
    // const metadata = new MemoryDB();
  });

  test('writeFragment() returns nothing', async () => {
    let fragment = { ownerId: '', id: '' };
    const result = await MemoryDB.writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('writeFragment() returns something', async () => {
    let fragment = { ownerId: '123', id: '123' };
    const result = await MemoryDB.writeFragment(fragment);
    expect(result).toBe(undefined);
  });
});
