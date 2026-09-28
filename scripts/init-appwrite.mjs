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
  console.log(`1. Go to https://cloud.appwrite.io/console/project-${projectId}/overview/keys`);
  console.log('2. Click "Create API Key" or edit existing key');
  console.log('3. Name it "PrintOS Admin" and check:');
  console.log('   - Databases (read, write)');
  console.log('   - Collections (read, write)');
  console.log('   - Documents (read, write)');
  console.log('   - Attributes (read, write)');
  console.log('   - Indexes (read, write)');
  console.log('4. Copy the secret key and run this script!\n');
  process.exit(0);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function run() {
  let setupFailed = false;
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
    {
      id: 'invoices',
      name: 'Invoices',
      attributes: [
        ['string', 'jobId', 64, false],
        ['string', 'clientName', 255, true],
        ['string', 'clientCompany', 255, false],
        ['string', 'clientPhone', 64, false],
        ['string', 'clientAddress', 2000, false],
        ['string', 'clientBin', 64, false],
        ['string', 'jobTitle', 255, true],
        ['float', 'quantity', null, true],
        ['float', 'unitRate', null, true],
        ['float', 'subtotal', null, true],
        ['float', 'taxRate', null, false],
        ['float', 'taxAmount', null, false],
        ['float', 'totalAmount', null, true],
        ['float', 'advancePaid', null, false],
        ['float', 'dueAmount', null, false],
        ['string', 'paymentStatus', 32, true],
        ['string', 'invoiceDate', 32, true],
        ['string', 'dueDate', 32, false],
        ['string', 'itemsJson', 8192, false],
        ['string', 'notes', 4000, false],
      ],
    },
    {
      id: 'delivery_chalans',
      name: 'Delivery Chalans',
      attributes: [
        ['string', 'gatePassNo', 64, true],
        ['string', 'jobId', 64, true],
        ['string', 'invoiceId', 64, false],
        ['string', 'clientName', 255, true],
        ['string', 'deliveryAddress', 2000, false],
        ['string', 'jobTitle', 255, true],
        ['float', 'totalOrderQuantity', null, true],
        ['float', 'previouslyDelivered', null, false],
        ['float', 'deliveredQuantity', null, true],
        ['float', 'remainingBalance', null, false],
        ['integer', 'packageCount', null, false],
        ['string', 'packageDescription', 2000, false],
        ['string', 'transportMode', 64, false],
        ['string', 'vehicleNumber', 128, false],
        ['string', 'driverName', 255, false],
        ['string', 'driverPhone', 64, false],
        ['string', 'deliveryDate', 32, true],
        ['string', 'status', 32, true],
        ['string', 'receivedBy', 255, false],
        ['string', 'receiverPhone', 64, false],
      ],
    },
    {
      id: 'clients',
      name: 'Clients',
      attributes: [
        ['string', 'name', 255, true],
        ['string', 'company', 255, false],
        ['string', 'phone', 64, true],
        ['string', 'email', 255, false],
        ['string', 'address', 2000, false],
        ['string', 'bin', 64, false],
        ['integer', 'totalOrders', null, false],
        ['float', 'totalSpent', null, false],
        ['float', 'outstandingDue', null, false],
        ['string', 'notes', 2000, false],
      ],
    },
    {
      id: 'job_cards',
      name: 'Job Cards',
      attributes: [
        ['string', 'jobTitle', 255, true],
        ['string', 'client', 255, true],
        ['string', 'category', 128, false],
        ['integer', 'quantity', null, true],
        ['string', 'dueDate', 64, false],
        ['string', 'priority', 32, false],
        ['string', 'currentStage', 32, true],
        ['string', 'assignedMachineId', 64, false],
        ['string', 'paperSpec', 255, false],
        ['string', 'colors', 128, false],
        ['integer', 'platesCount', null, false],
        ['boolean', 'hasLamination', null, false],
        ['string', 'laminationType', 128, false],
        ['boolean', 'hasDieCutting', null, false],
        ['boolean', 'hasBinding', null, false],
        ['string', 'bindingType', 128, false],
        ['string', 'notes', 2000, false],
        ['integer', 'targetImpressions', null, false],
        ['integer', 'currentImpressions', null, false],
        ['string', 'operatorStamp', 128, false],
      ],
    },
    {
      id: 'suppliers',
      name: 'Suppliers',
      attributes: [
        ['string', 'name', 255, true],
        ['string', 'company', 255, true],
        ['string', 'contactPerson', 255, false],
        ['string', 'phone', 64, true],
        ['string', 'email', 255, false],
        ['string', 'address', 2000, false],
        ['string', 'bin', 64, false],
        ['string', 'paperSpecialties', 2000, false],
        ['float', 'balance', null, false],
        ['float', 'rating', null, false],
      ],
    },
    {
      id: 'purchase_bills',
      name: 'Purchase Bills',
      attributes: [
        ['string', 'supplierId', 64, true],
        ['string', 'supplierName', 255, true],
        ['string', 'linkedJobId', 64, false],
        ['string', 'linkedJobTitle', 255, false],
        ['string', 'paperType', 128, true],
        ['integer', 'gsm', null, false],
        ['string', 'fullSheetSize', 64, false],
        ['float', 'reams', null, false],
        ['integer', 'sheets', null, false],
        ['float', 'ratePerReam', null, false],
        ['float', 'totalAmount', null, true],
        ['float', 'paidAmount', null, false],
        ['string', 'paymentStatus', 32, true],
        ['string', 'paymentMethod', 64, false],
        ['string', 'procurementType', 32, false],
        ['string', 'purchaseDate', 64, true],
        ['string', 'notes', 2000, false],
      ],
    },
    {
      id: 'payments',
      name: 'Client Payments',
      attributes: [
        ['string', 'clientId', 64, false],
        ['string', 'clientName', 255, true],
        ['string', 'invoiceId', 64, true],
        ['float', 'amount', null, true],
        ['string', 'paymentMethod', 32, true],
        ['string', 'referenceNumber', 128, false],
        ['string', 'bankName', 255, false],
        ['string', 'chequeDate', 64, false],
        ['string', 'paymentDate', 64, true],
        ['string', 'notes', 2000, false],
        ['string', 'recordedBy', 255, false],
      ],
    },
    {
      id: 'cash_transactions',
      name: 'Cash Transactions',
      attributes: [
        ['string', 'date', 64, true],
        ['string', 'type', 32, true],
        ['string', 'category', 64, true],
        ['string', 'particulars', 2000, true],
        ['string', 'voucherNo', 128, false],
        ['string', 'linkedJobId', 64, false],
        ['float', 'amount', null, true],
        ['float', 'balanceAfter', null, false],
        ['string', 'recordedBy', 255, false],
      ],
    },
    {
      id: 'expenses',
      name: 'Expenses',
      attributes: [
        ['string', 'date', 64, true],
        ['string', 'category', 64, true],
        ['string', 'title', 255, true],
        ['string', 'description', 2000, false],
        ['float', 'amount', null, true],
        ['string', 'paymentMethod', 32, true],
        ['string', 'receiptNo', 128, false],
        ['string', 'paidTo', 255, true],
        ['string', 'approvedBy', 255, false],
      ],
    },
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
        await databases.createCollection(databaseId, col.id, col.name, permissions, false);
        console.log(`✓ Collection "${col.id}" created with full access permissions.`);
      } else {
        console.error(`Error with collection ${col.id}:`, err.message);
        setupFailed = true;
        continue;
      }
    }

    for (const [kind, key, size, required] of col.attributes) {
      try {
        if (kind === 'string') await databases.createStringAttribute(databaseId, col.id, key, size || 255, !!required);
        if (kind === 'integer') await databases.createIntegerAttribute(databaseId, col.id, key, !!required);
        if (kind === 'float') await databases.createFloatAttribute(databaseId, col.id, key, !!required);
        if (kind === 'boolean') await databases.createBooleanAttribute(databaseId, col.id, key, !!required);
        console.log(`  ✓ Attribute "${col.id}.${key}" (${kind}) ready.`);
      } catch (err) {
        if (err?.type === 'attribute_already_exists' || err?.code === 409) {
          // Already exists, ignore
        } else {
          console.error(`  ✗ Attribute "${col.id}.${key}" failed:`, err?.message || 'Unknown error');
          setupFailed = true;
        }
      }
    }
  }

  if (setupFailed) {
    console.log('\n⚠️ Some collections or attributes could not be configured.');
    console.log('Please ensure your Appwrite API Key has the following scopes enabled in Appwrite Console:');
    console.log(' - Collections (read, write)');
    console.log(' - Documents (read, write)');
    console.log(' - Attributes (read, write)');
    console.log(' - Databases (read, write)');
    console.log(`Console URL: https://cloud.appwrite.io/console/project-${projectId}/overview/keys\n`);
  } else {
    console.log('\n🎉 ALL PRINTOS APPWRITE COLLECTIONS AND ATTRIBUTES ARE READY & CONFIGURED!\n');
  }
}

run().catch((err) => {
  console.error('\n❌ Setup error:', err.message);
  process.exit(1);
});
