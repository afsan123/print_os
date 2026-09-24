import { Client, Databases, Permission, Role } from 'node-appwrite';
import fs from 'fs';

// Read .env.local if present
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  }
} catch {}

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6ab18c59003e3b3e274a';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'print_os_db';
const apiKey = process.env.APPWRITE_API_KEY || process.argv[2];

if (!apiKey) {
  console.log('\n-------------------------------------------------------------');
  console.log('Appwrite Database Auto-Setup Script');
  console.log('-------------------------------------------------------------');
  console.log('Endpoint   :', endpoint);
  console.log('Project ID :', projectId);
  console.log('Database ID:', databaseId);
  console.log('\nTo create the database and all collections automatically, provide an Appwrite API key:');
  console.log('Usage:');
  console.log('  APPWRITE_API_KEY=<your_api_key> node scripts/init-appwrite.mjs');
  console.log('Or:');
  console.log('  node scripts/init-appwrite.mjs <your_api_key>');
  console.log('\nHow to create an API Key in Appwrite Console:');
  console.log('1. Go to https://cloud.appwrite.io/console/project-6ab18c59003e3b3e274a/overview/keys');
  console.log('2. Click "Create API Key"');
  console.log('3. Name it "PrintOS Admin" and check "Databases", "Collections", "Documents", "Attributes" scopes');
  console.log('4. Copy the secret key and run this command!\n');
  process.exit(0);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function run() {
  console.log(`\nConnecting to Appwrite Cloud (${endpoint})...`);
  console.log(`Project: ${projectId}`);

  // 1. Create or ensure Database
  try {
    console.log(`Checking if database "${databaseId}" exists...`);
    await databases.get(databaseId);
    console.log(`✓ Database "${databaseId}" already exists!`);
  } catch (err) {
    if (err.type === 'database_not_found' || err.code === 404) {
      console.log(`Creating database "${databaseId}"...`);
      await databases.create(databaseId, 'PrintOS Enterprise DB');
      console.log(`✓ Database "${databaseId}" created successfully!`);
    } else {
      throw err;
    }
  }

  const collections = [
    { id: 'invoices', name: 'Invoices' },
    { id: 'delivery_chalans', name: 'Delivery Chalans' },
    { id: 'clients', name: 'Clients' },
    { id: 'job_cards', name: 'Job Cards' },
    { id: 'suppliers', name: 'Suppliers' },
    { id: 'purchase_bills', name: 'Purchase Bills' },
    { id: 'cash_transactions', name: 'Cash Transactions' },
    { id: 'expenses', name: 'Expenses' },
    { id: 'payments', name: 'Client Payments' },
  ];

  const permissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any()),
  ];

  for (const col of collections) {
    try {
      await databases.getCollection(databaseId, col.id);
      console.log(`✓ Collection "${col.id}" exists.`);
    } catch (err) {
      if (err.type === 'collection_not_found' || err.code === 404) {
        console.log(`Creating collection "${col.id}" (${col.name})...`);
        await databases.createCollection(databaseId, col.id, col.name, permissions);
        console.log(`✓ Collection "${col.id}" created with public permissions.`);
      } else {
        console.error(`Error with collection ${col.id}:`, err.message);
      }
    }
  }

  console.log('\n🎉 ALL PRINTOS APPWRITE COLLECTIONS ARE READY & CONFIGURED!\n');
}

run().catch((err) => {
  console.error('\n❌ Setup failed:', err.message);
  process.exit(1);
});
