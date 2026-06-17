const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readCollection = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    console.log(`\n❌ Collection '${collection}' does not exist or has no records yet.`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
  } catch (e) {
    console.log(`\n❌ Error parsing collection '${collection}': ${e.message}`);
    return null;
  }
};

const args = process.argv.slice(2);
const collection = args[0];

if (!collection) {
  console.log("\n🔍 MentorAI Local Database Query Tool");
  console.log("=====================================");
  console.log("Usage: node scratch/query.js <collection_name> [query_key] [query_val]");
  console.log("\nAvailable collections:");
  console.log("  - users");
  console.log("  - skills");
  console.log("  - gamification");
  console.log("  - interviews");
  console.log("  - predictions");
  process.exit(0);
}

let data = readCollection(collection);
if (!data) process.exit(0);

const queryKey = args[1];
const queryVal = args[2];

if (queryKey && queryVal) {
  console.log(`\nFiltering ${collection} where '${queryKey}' is '${queryVal}'...`);
  data = data.filter(item => String(item[queryKey]).toLowerCase() === String(queryVal).toLowerCase());
}

if (data.length === 0) {
  console.log(`\nEmpty result set for collection '${collection}'.`);
} else {
  console.log(`\n📋 Query Results for table: '${collection}' (${data.length} records)`);
  console.table(data);
}
