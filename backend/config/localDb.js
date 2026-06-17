const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content || "[]");
  } catch (e) {
    console.error(`Error reading database collection ${collection}:`, e.message);
    return [];
  }
};

const writeData = (collection, data) => {
  try {
    const filePath = getFilePath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error(`Error writing database collection ${collection}:`, e.message);
  }
};

const db = {
  find: (collection, query = {}) => {
    const data = readData(collection);
    return data.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },
  
  findOne: (collection, query = {}) => {
    const data = readData(collection);
    return data.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },
  
  create: (collection, doc) => {
    const data = readData(collection);
    const newDoc = {
      _id: doc._id || Math.random().toString(36).substring(2, 11),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString()
    };
    data.push(newDoc);
    writeData(collection, data);
    return newDoc;
  },
  
  updateOne: (collection, query, update) => {
    const data = readData(collection);
    const idx = data.findIndex(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    
    if (idx === -1) return null;
    
    data[idx] = {
      ...data[idx],
      ...update,
      updatedAt: new Date().toISOString()
    };
    writeData(collection, data);
    return data[idx];
  },

  upsert: (collection, query, doc) => {
    const existing = db.findOne(collection, query);
    if (existing) {
      return db.updateOne(collection, query, { ...existing, ...doc });
    } else {
      return db.create(collection, { ...query, ...doc });
    }
  }
};

console.log("Local filesystem database initialized successfully at: " + DATA_DIR);

module.exports = db;
