import { databases, APPWRITE_CONFIG } from './appwrite';
import { ID, Query } from 'appwrite';
import { SalesInvoice, DeliveryChalan, ClientPaymentRecord } from '@/types/sales';

/**
 * Appwrite Service Layer
 * Supports seamless hybrid operation: attempts cloud persistence if Appwrite database/collections
 * exist, and gracefully catches errors with fallback to local state.
 */

export const appwriteService = {
  // --- INVOICES ---
  async fetchInvoices(): Promise<SalesInvoice[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.invoices,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        jobId: doc.jobId,
        clientName: doc.clientName,
        clientCompany: doc.clientCompany,
        clientPhone: doc.clientPhone,
        clientAddress: doc.clientAddress,
        clientBin: doc.clientBin,
        jobTitle: doc.jobTitle,
        quantity: doc.quantity,
        unitRate: doc.unitRate,
        subtotal: doc.subtotal,
        taxRate: doc.taxRate,
        taxAmount: doc.taxAmount,
        totalAmount: doc.totalAmount,
        advancePaid: doc.advancePaid,
        dueAmount: doc.dueAmount,
        paymentStatus: doc.paymentStatus,
        invoiceDate: doc.invoiceDate,
        dueDate: doc.dueDate,
        items: JSON.parse(doc.itemsJson || '[]'),
        notes: doc.notes,
        createdAt: doc.$createdAt,
      }));
    } catch {
      return null;
    }
  },

  async saveInvoice(inv: SalesInvoice): Promise<boolean> {
    try {
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.invoices,
        ID.unique(),
        {
          jobId: inv.jobId || '',
          clientName: inv.clientName,
          clientCompany: inv.clientCompany || '',
          clientPhone: inv.clientPhone,
          clientAddress: inv.clientAddress,
          clientBin: inv.clientBin || '',
          jobTitle: inv.jobTitle,
          quantity: inv.quantity,
          unitRate: inv.unitRate,
          subtotal: inv.subtotal,
          taxRate: inv.taxRate,
          taxAmount: inv.taxAmount,
          totalAmount: inv.totalAmount,
          advancePaid: inv.advancePaid,
          dueAmount: inv.dueAmount,
          paymentStatus: inv.paymentStatus,
          invoiceDate: inv.invoiceDate,
          dueDate: inv.dueDate,
          itemsJson: JSON.stringify(inv.items),
          notes: inv.notes || '',
        }
      );
      return true;
    } catch {
      return false;
    }
  },

  // --- DELIVERY CHALANS ---
  async fetchChalans(): Promise<DeliveryChalan[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.deliveryChalans,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        gatePassNo: doc.gatePassNo,
        jobId: doc.jobId,
        invoiceId: doc.invoiceId,
        clientName: doc.clientName,
        deliveryAddress: doc.deliveryAddress,
        jobTitle: doc.jobTitle,
        totalOrderQuantity: doc.totalOrderQuantity,
        previouslyDelivered: doc.previouslyDelivered,
        deliveredQuantity: doc.deliveredQuantity,
        remainingBalance: doc.remainingBalance,
        packageCount: doc.packageCount,
        packageDescription: doc.packageDescription,
        transportMode: doc.transportMode,
        vehicleNumber: doc.vehicleNumber,
        driverName: doc.driverName,
        driverPhone: doc.driverPhone,
        deliveryDate: doc.deliveryDate,
        status: doc.status,
        receivedBy: doc.receivedBy,
        receiverPhone: doc.receiverPhone,
        createdAt: doc.$createdAt,
      }));
    } catch {
      return null;
    }
  },

  async saveChalan(ch: DeliveryChalan): Promise<boolean> {
    try {
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.deliveryChalans,
        ID.unique(),
        {
          gatePassNo: ch.gatePassNo,
          jobId: ch.jobId,
          invoiceId: ch.invoiceId || '',
          clientName: ch.clientName,
          deliveryAddress: ch.deliveryAddress,
          jobTitle: ch.jobTitle,
          totalOrderQuantity: ch.totalOrderQuantity,
          previouslyDelivered: ch.previouslyDelivered,
          deliveredQuantity: ch.deliveredQuantity,
          remainingBalance: ch.remainingBalance,
          packageCount: ch.packageCount,
          packageDescription: ch.packageDescription,
          transportMode: ch.transportMode,
          vehicleNumber: ch.vehicleNumber || '',
          driverName: ch.driverName || '',
          driverPhone: ch.driverPhone || '',
          deliveryDate: ch.deliveryDate,
          status: ch.status,
        }
      );
      return true;
    } catch {
      return false;
    }
  },
};
