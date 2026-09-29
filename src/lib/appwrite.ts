import { Client, Databases, Account, Storage } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6ab18c59003e3b3e274a';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'print_os_db';

export const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = {
  endpoint,
  projectId,
  databaseId,
  collections: {
    invoices: 'invoices',
    deliveryChalans: 'delivery_chalans',
    clients: 'clients',
    jobCards: 'job_cards',
    suppliers: 'suppliers',
    purchaseBills: 'purchase_bills',
    payments: 'payments',
    cashTransactions: 'cash_transactions',
    expenses: 'expenses',
    godownStock: 'godown_stock',
    notifications: 'notifications',
  },
};

export interface AppwriteHealthResult {
  connected: boolean;
  projectConnected: boolean;
  databaseStatus: 'ready' | 'database_not_found' | 'collection_not_found' | 'unauthorized' | 'pending';
  endpoint: string;
  projectId: string;
  databaseId: string;
  message: string;
  error?: string;
}

/**
 * Checks if Appwrite credentials are valid and tests real database connectivity
 */
export async function checkAppwriteHealth(): Promise<AppwriteHealthResult> {
  try {
    if (!endpoint || !projectId) {
      return {
        connected: false,
        projectConnected: false,
        databaseStatus: 'pending',
        endpoint,
        projectId,
        databaseId,
        message: 'Missing Project ID or Endpoint in environment configuration.',
        error: 'Missing credentials',
      };
    }

    // 1. Check if database exists by querying a test collection
    try {
      await databases.listDocuments(databaseId, 'invoices');
      return {
        connected: true,
        projectConnected: true,
        databaseStatus: 'ready',
        endpoint,
        projectId,
        databaseId,
        message: 'Successfully connected! Database and invoices collection are live.',
      };
    } catch (dbErr: unknown) {
      const err = dbErr as { type?: string; message?: string; code?: number };
      const errType = err?.type || '';
      const errMsg = err?.message || '';

      if (errType === 'database_not_found') {
        return {
          connected: true, // Project is connected!
          projectConnected: true,
          databaseStatus: 'database_not_found',
          endpoint,
          projectId,
          databaseId,
          message: `Connected to Appwrite Project "${projectId}"! However, Database "${databaseId}" has not been created in your Appwrite Console yet.`,
        };
      } else if (errType === 'collection_not_found') {
        return {
          connected: true,
          projectConnected: true,
          databaseStatus: 'collection_not_found',
          endpoint,
          projectId,
          databaseId,
          message: `Connected to Database "${databaseId}"! Collection "invoices" needs to be created in your Appwrite Console.`,
        };
      } else if (errType === 'user_unauthorized' || err?.code === 401) {
        return {
          connected: true,
          projectConnected: true,
          databaseStatus: 'unauthorized',
          endpoint,
          projectId,
          databaseId,
          message: `Connected to Database "${databaseId}"! Please ensure collection permissions include role "Any" (Create, Read, Update, Delete).`,
        };
      } else {
        return {
          connected: true,
          projectConnected: true,
          databaseStatus: 'pending',
          endpoint,
          projectId,
          databaseId,
          message: `Connected to Appwrite Cloud. Status: ${errMsg}`,
        };
      }
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      projectConnected: false,
      databaseStatus: 'pending',
      endpoint,
      projectId,
      databaseId,
      message: 'Network error connecting to Appwrite Cloud.',
      error: errorMsg,
    };
  }
}
