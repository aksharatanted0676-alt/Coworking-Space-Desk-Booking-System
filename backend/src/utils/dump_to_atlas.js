const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/coworking_space';
const ATLAS_URI = process.env.ATLAS_URI;

async function migrateDatabase() {
  if (!ATLAS_URI) {
    throw new Error('ATLAS_URI environment variable is required.');
  }

  console.log('=== STARTING DATABASE MIGRATION TO MONGODB ATLAS ===\n');

  let localConn, atlasConn;

  try {
    console.log('1. Connecting to Local MongoDB (coworking_space)...');
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('   ✅ Connected to Local MongoDB.');

    console.log('2. Connecting to MongoDB Atlas Cluster (coworking_space)...');
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('   ✅ Connected to MongoDB Atlas Cluster.');

    const localDb = localConn.db;
    const atlasDb = atlasConn.db;

    const collections = await localDb.listCollections().toArray();
    console.log(`\nFound ${collections.length} collection(s) in local database:`, collections.map(c => c.name));

    for (const collInfo of collections) {
      const collName = collInfo.name;
      if (collName.startsWith('system.')) continue;

      console.log(`\n--- Migrating Collection: [${collName}] ---`);
      const localColl = localDb.collection(collName);
      const atlasColl = atlasDb.collection(collName);

      const docs = await localColl.find({}).toArray();
      console.log(`   Found ${docs.length} document(s) in local [${collName}].`);

      if (docs.length > 0) {
        // Clear destination collection to avoid duplicate _id conflicts
        await atlasColl.deleteMany({});
        const insertRes = await atlasColl.insertMany(docs);
        console.log(`   ✅ Successfully inserted ${insertRes.insertedCount} document(s) into MongoDB Atlas [${collName}].`);
      } else {
        console.log(`   ℹ️ [${collName}] has no documents.`);
      }

      // Verify count in Atlas
      const atlasCount = await atlasColl.countDocuments();
      console.log(`   🔍 Verification in Atlas: ${atlasCount} document(s) confirmed.`);
    }

    console.log('\n=== MIGRATION SUMMARY ON ATLAS ===');
    const atlasCollections = await atlasDb.listCollections().toArray();
    for (const c of atlasCollections) {
      const count = await atlasDb.collection(c.name).countDocuments();
      console.log(`- Collection '${c.name}': ${count} document(s) active on MongoDB Atlas`);
    }

    console.log('\n🎉 ALL LOCAL DATA SUCCESSFULLY DUMPED & MIGRATED TO MONGODB ATLAS!');

  } catch (err) {
    console.error('❌ Migration Error:', err);
  } finally {
    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();
  }
}

migrateDatabase();
