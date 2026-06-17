const localDb = require("./localDb");
const { createClient } = require("@supabase/supabase-js");

const isSupabaseConfigured = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY;
let supabase = null;

if (isSupabaseConfigured) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log("Hybrid DB: Supabase Cloud Database mode active.");
} else {
  console.log("Hybrid DB: Local Filesystem Database mode active.");
}

const getTable = (collection) => {
  const mapping = {
    users: "profiles",
    skills: "skills",
    interviews: "interviews",
    gamification: "gamification",
    predictions: "placement_predictions"
  };
  return mapping[collection] || collection;
};

const mapKey = (key) => {
  const mapping = {
    _id: "id",
    userId: "user_id",
    readinessScore: "readiness_score"
  };
  return mapping[key] || key;
};

const mapFieldsToDb = (collection, doc) => {
  const mapped = {};
  for (let key in doc) {
    if (key === "_id") mapped["id"] = doc[key];
    else if (key === "userId") mapped["user_id"] = doc[key];
    else if (key === "readinessScore") mapped["readiness_score"] = doc[key];
    else mapped[key] = doc[key];
  }
  return mapped;
};

const normalizeFields = (data) => {
  if (!data) return null;
  const norm = {};
  for (let key in data) {
    if (key === "id") norm["_id"] = data[key];
    else if (key === "user_id") norm["userId"] = data[key];
    else if (key === "readiness_score") norm["readinessScore"] = data[key];
    else norm[key] = data[key];
  }
  return norm;
};

const db = {
  find: async (collection, query = {}) => {
    if (isSupabaseConfigured) {
      const table = getTable(collection);
      let builder = supabase.from(table).select("*, profiles(*)");
      for (let key in query) {
        const dbKey = mapKey(key);
        builder = builder.eq(dbKey, query[key]);
      }
      const { data, error } = await builder;
      if (error) throw error;
      return (data || []).map(item => normalizeFields(item));
    } else {
      return localDb.find(collection, query);
    }
  },

  findOne: async (collection, query = {}) => {
    if (isSupabaseConfigured) {
      const table = getTable(collection);
      let builder = supabase.from(table).select("*");
      for (let key in query) {
        const dbKey = mapKey(key);
        builder = builder.eq(dbKey, query[key]);
      }
      const { data, error } = await builder.maybeSingle();
      if (error) throw error;
      return data ? normalizeFields(data) : null;
    } else {
      return localDb.findOne(collection, query);
    }
  },

  create: async (collection, doc) => {
    if (isSupabaseConfigured) {
      const table = getTable(collection);
      const dbDoc = mapFieldsToDb(collection, doc);
      const { data, error } = await supabase.from(table).insert(dbDoc).select().single();
      if (error) throw error;
      return normalizeFields(data);
    } else {
      return localDb.create(collection, doc);
    }
  },

  updateOne: async (collection, query, update) => {
    if (isSupabaseConfigured) {
      const table = getTable(collection);
      let builder = supabase.from(table).update(mapFieldsToDb(collection, update));
      for (let key in query) {
        const dbKey = mapKey(key);
        builder = builder.eq(dbKey, query[key]);
      }
      const { data, error } = await builder.select().single();
      if (error) throw error;
      return normalizeFields(data);
    } else {
      return localDb.updateOne(collection, query, update);
    }
  },

  upsert: async (collection, query, doc) => {
    if (isSupabaseConfigured) {
      const table = getTable(collection);
      const queryDb = mapFieldsToDb(collection, query);
      const updateDb = mapFieldsToDb(collection, doc);
      const conflictField = collection === "users" ? "id" : "user_id";
      const { data, error } = await supabase
        .from(table)
        .upsert({ ...queryDb, ...updateDb }, { onConflict: conflictField })
        .select()
        .single();
      if (error) throw error;
      return normalizeFields(data);
    } else {
      return localDb.upsert(collection, query, doc);
    }
  }
};

module.exports = db;
