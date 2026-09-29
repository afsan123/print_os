import { databases, APPWRITE_CONFIG } from './appwrite';
import { Permission, Query, Role } from 'appwrite';
import { SalesInvoice, DeliveryChalan, ClientPaymentRecord } from '@/types/sales';
import { ClientRecord } from '@/types/estimator';
import { ProductionJob, ProductionStage } from '@/types/production';
import { PaperSupplier, PurchaseBill, StockItem } from '@/types/inventory';
import { CashBookEntry, ExpenseRecord } from '@/types/finance';
import { PrintOSNotification, NotificationCategory, NotificationPriority } from '@/types/notification';
import { NavItemKey } from '@/components/layout/Sidebar';

/**
 * Appwrite Service Layer
 * Supports seamless hybrid operation: attempts cloud persistence if Appwrite database/collections
 * exist, and gracefully catches errors with fallback to local state.
 */

export const appwriteService = {
  async documentPermissions(): Promise<string[] | undefined> {
    try {
      const { account } = await import('./appwrite');
      const user = await account.get();
      if (user?.$id) {
        return [
          Permission.read(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ];
      }
      return undefined;
    } catch {
      return undefined;
    }
  },

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
        clientCompany: doc.clientCompany || '',
        clientPhone: doc.clientPhone || '',
        clientAddress: doc.clientAddress || '',
        clientBin: doc.clientBin || '',
        jobTitle: doc.jobTitle,
        quantity: doc.quantity || 1,
        unitRate: doc.unitRate || 0,
        subtotal: doc.subtotal || 0,
        taxRate: doc.taxRate || 0,
        taxAmount: doc.taxAmount || 0,
        totalAmount: doc.totalAmount || 0,
        advancePaid: doc.advancePaid || 0,
        dueAmount: doc.dueAmount || 0,
        paymentStatus: doc.paymentStatus || 'unpaid',
        invoiceDate: doc.invoiceDate || '',
        dueDate: doc.dueDate || '',
        items: JSON.parse(doc.itemsJson || '[]'),
        notes: doc.notes || '',
        createdAt: doc.$createdAt,
      }));
    } catch {
      return null;
    }
  },

  async saveInvoice(inv: SalesInvoice): Promise<boolean> {
    const data = {
      jobId: inv.jobId || '',
      clientName: inv.clientName,
      clientCompany: inv.clientCompany || '',
      clientPhone: inv.clientPhone || '',
      clientAddress: inv.clientAddress || '',
      clientBin: inv.clientBin || '',
      jobTitle: inv.jobTitle,
      quantity: inv.quantity,
      unitRate: inv.unitRate,
      subtotal: inv.subtotal,
      taxRate: inv.taxRate || 0,
      taxAmount: inv.taxAmount || 0,
      totalAmount: inv.totalAmount,
      advancePaid: inv.advancePaid || 0,
      dueAmount: inv.dueAmount || 0,
      paymentStatus: inv.paymentStatus,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate || '',
      itemsJson: JSON.stringify(inv.items || []),
      notes: inv.notes || '',
    };

    try {
      const permissions = await this.documentPermissions();
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.invoices,
          inv.id,
          data,
          permissions
        );
      } catch (err: unknown) {
        const error = err as { code?: number; type?: string };
        if (error?.code === 409 || error?.type === 'document_already_exists') {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.invoices,
            inv.id,
            data
          );
        } else {
          throw err;
        }
      }
      return true;
    } catch (e) {
      console.warn('Appwrite saveInvoice notice:', e);
      return false;
    }
  },

  async deleteInvoice(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.invoices,
        id
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
        invoiceId: doc.invoiceId || '',
        clientName: doc.clientName,
        deliveryAddress: doc.deliveryAddress,
        jobTitle: doc.jobTitle,
        totalOrderQuantity: doc.totalOrderQuantity,
        previouslyDelivered: doc.previouslyDelivered || 0,
        deliveredQuantity: doc.deliveredQuantity,
        remainingBalance: doc.remainingBalance || 0,
        packageCount: doc.packageCount || 1,
        packageDescription: doc.packageDescription || '',
        transportMode: doc.transportMode || 'client_pickup',
        vehicleNumber: doc.vehicleNumber || '',
        driverName: doc.driverName || '',
        driverPhone: doc.driverPhone || '',
        deliveryDate: doc.deliveryDate,
        status: doc.status,
        receivedBy: doc.receivedBy || '',
        receiverPhone: doc.receiverPhone || '',
        createdAt: doc.$createdAt,
      }));
    } catch {
      return null;
    }
  },

  async saveChalan(ch: DeliveryChalan): Promise<boolean> {
    const data = {
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
    };

    try {
      const permissions = await this.documentPermissions();
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.deliveryChalans,
          ch.id,
          data,
          permissions
        );
      } catch (err: unknown) {
        const error = err as { code?: number; type?: string };
        if (error?.code === 409 || error?.type === 'document_already_exists') {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.deliveryChalans,
            ch.id,
            data
          );
        } else {
          throw err;
        }
      }
      return true;
    } catch (e) {
      console.warn('Appwrite saveChalan notice:', e);
      return false;
    }
  },

  async updateChalanStatus(
    id: string,
    status: DeliveryChalan['status'],
    receivedBy?: string,
    receiverPhone?: string
  ): Promise<boolean> {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.deliveryChalans,
        id,
        {
          status,
          receivedBy: receivedBy || '',
          receiverPhone: receiverPhone || '',
        }
      );
      return true;
    } catch {
      return false;
    }
  },

  // --- CLIENTS ---
  async fetchClients(): Promise<ClientRecord[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.clients,
        [Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        company: doc.company || '',
        phone: doc.phone || '',
        email: doc.email || '',
        address: doc.address || '',
        balance: doc.outstandingDue || 0,
        bin: doc.bin || '',
        createdAt: doc.$createdAt,
      }));
    } catch {
      return null;
    }
  },

  async saveClient(client: ClientRecord): Promise<boolean> {
    const data = {
      name: client.name,
      company: client.company || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      bin: client.bin || '',
      totalOrders: 0,
      totalSpent: 0,
      outstandingDue: client.balance || 0,
    };
    try {
      const permissions = await this.documentPermissions();
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.clients,
        client.id,
        data,
        permissions
      );
      return true;
    } catch (e) {
      console.warn('Appwrite saveClient notice:', e);
      return false;
    }
  },

  // --- JOB CARDS / PRODUCTION ---
  async fetchJobCards(): Promise<ProductionJob[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.jobCards,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        jobTitle: doc.jobTitle,
        client: doc.client,
        category: doc.category || 'General',
        quantity: doc.quantity,
        dueDate: doc.dueDate || '',
        priority: doc.priority || 'normal',
        currentStage: doc.currentStage as ProductionStage,
        assignedMachineId: doc.assignedMachineId || '',
        paperSpec: doc.paperSpec || '',
        colors: doc.colors || '4 Color (CMYK)',
        platesCount: doc.platesCount || 4,
        printBill: doc.printBill !== undefined ? Number(doc.printBill) : undefined,
        hasLamination: !!doc.hasLamination,
        laminationType: doc.laminationType || '',
        hasDieCutting: !!doc.hasDieCutting,
        hasBinding: !!doc.hasBinding,
        bindingType: doc.bindingType || '',
        hasCustomFinishing: !!doc.hasCustomFinishing,
        customFinishingSummary: doc.customFinishingSummary || '',
        customFinishingsJson: doc.customFinishingsJson || '',
        notes: doc.notes || '',
        targetImpressions: doc.targetImpressions || doc.quantity,
        currentImpressions: doc.currentImpressions || 0,
        operatorStamp: doc.operatorStamp || '',
        createdAt: doc.$createdAt,
        lastUpdated: doc.$updatedAt,
      }));
    } catch {
      return null;
    }
  },

  async saveJobCard(job: ProductionJob): Promise<boolean> {
    const data = {
      jobTitle: job.jobTitle,
      client: job.client,
      category: job.category || 'General',
      quantity: job.quantity,
      dueDate: job.dueDate || '',
      priority: job.priority || 'normal',
      currentStage: job.currentStage,
      assignedMachineId: job.assignedMachineId || '',
      paperSpec: job.paperSpec || '',
      colors: job.colors || '',
      platesCount: job.platesCount || 4,
      printBill: job.printBill || 0,
      hasLamination: job.hasLamination,
      laminationType: job.laminationType || '',
      hasDieCutting: job.hasDieCutting,
      hasBinding: job.hasBinding,
      bindingType: job.bindingType || '',
      hasCustomFinishing: !!job.hasCustomFinishing,
      customFinishingSummary: job.customFinishingSummary || '',
      customFinishingsJson: job.customFinishingsJson || '',
      notes: job.notes || '',
      targetImpressions: job.targetImpressions || job.quantity,
      currentImpressions: job.currentImpressions || 0,
      operatorStamp: job.operatorStamp || '',
    };
    try {
      const permissions = await this.documentPermissions();
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.jobCards,
          job.id,
          data,
          permissions
        );
      } catch (err: unknown) {
        const error = err as { code?: number; type?: string };
        if (error?.code === 409 || error?.type === 'document_already_exists') {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.jobCards,
            job.id,
            data
          );
        } else {
          throw err;
        }
      }
      return true;
    } catch (e) {
      console.warn('Appwrite saveJobCard notice:', e);
      return false;
    }
  },

  async updateJobCardStage(
    jobId: string,
    currentStage: ProductionStage,
    operatorStamp?: string
  ): Promise<boolean> {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.jobCards,
        jobId,
        {
          currentStage,
          ...(operatorStamp ? { operatorStamp } : {}),
        }
      );
      return true;
    } catch {
      return false;
    }
  },

  // --- SUPPLIERS & PROCUREMENT ---
  async fetchSuppliers(): Promise<PaperSupplier[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.suppliers,
        [Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        company: doc.company,
        contactPerson: doc.contactPerson || '',
        phone: doc.phone || '',
        email: doc.email || '',
        address: doc.address || '',
        bin: doc.bin || '',
        paperSpecialties: doc.paperSpecialties ? doc.paperSpecialties.split(',') : [],
        balance: doc.balance || 0,
        rating: doc.rating || 5,
      }));
    } catch {
      return null;
    }
  },

  async saveSupplier(supplier: PaperSupplier): Promise<boolean> {
    const data = {
      name: supplier.name,
      company: supplier.company,
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone,
      email: supplier.email || '',
      address: supplier.address || '',
      bin: supplier.bin || '',
      paperSpecialties: supplier.paperSpecialties.join(','),
      balance: supplier.balance || 0,
      rating: supplier.rating || 5,
    };
    try {
      const permissions = await this.documentPermissions();
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.suppliers,
        supplier.id,
        data,
        permissions
      );
      return true;
    } catch (e) {
      console.warn('Appwrite saveSupplier notice:', e);
      return false;
    }
  },

  // --- PURCHASE BILLS ---
  async fetchPurchaseBills(): Promise<PurchaseBill[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.purchaseBills,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        supplierId: doc.supplierId,
        supplierName: doc.supplierName,
        linkedJobId: doc.linkedJobId || '',
        linkedJobTitle: doc.linkedJobTitle || '',
        paperType: doc.paperType,
        gsm: doc.gsm || 150,
        fullSheetSize: doc.fullSheetSize || '',
        reams: doc.reams || 0,
        sheets: doc.sheets || 0,
        ratePerReam: doc.ratePerReam || 0,
        totalAmount: doc.totalAmount,
        paidAmount: doc.paidAmount || 0,
        paymentStatus: doc.paymentStatus || 'due',
        paymentMethod: doc.paymentMethod || 'Cash',
        procurementType: doc.procurementType || 'direct_job',
        purchaseDate: doc.purchaseDate,
        notes: doc.notes || '',
      }));
    } catch {
      return null;
    }
  },

  async savePurchaseBill(bill: PurchaseBill): Promise<boolean> {
    const data = {
      supplierId: bill.supplierId,
      supplierName: bill.supplierName,
      linkedJobId: bill.linkedJobId || '',
      linkedJobTitle: bill.linkedJobTitle || '',
      paperType: bill.paperType,
      gsm: bill.gsm,
      fullSheetSize: bill.fullSheetSize,
      reams: bill.reams,
      sheets: bill.sheets,
      ratePerReam: bill.ratePerReam,
      totalAmount: bill.totalAmount,
      paidAmount: bill.paidAmount,
      paymentStatus: bill.paymentStatus,
      paymentMethod: bill.paymentMethod,
      procurementType: bill.procurementType,
      purchaseDate: bill.purchaseDate,
      notes: bill.notes || '',
    };
    try {
      const permissions = await this.documentPermissions();
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.purchaseBills,
        bill.id,
        data,
        permissions
      );
      return true;
    } catch (e) {
      console.warn('Appwrite savePurchaseBill notice:', e);
      return false;
    }
  },

  // --- CLIENT PAYMENTS ---
  async fetchPayments(): Promise<ClientPaymentRecord[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.payments,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        clientId: doc.clientId || '',
        clientName: doc.clientName,
        invoiceId: doc.invoiceId,
        amount: doc.amount,
        paymentMethod: doc.paymentMethod || 'cash',
        referenceNumber: doc.referenceNumber || '',
        bankName: doc.bankName || '',
        chequeDate: doc.chequeDate || '',
        paymentDate: doc.paymentDate,
        notes: doc.notes || '',
        recordedBy: doc.recordedBy || 'Staff',
        createdAt: doc.$createdAt,
      }));
    } catch {
      return null;
    }
  },

  async savePayment(payment: ClientPaymentRecord): Promise<boolean> {
    const data = {
      clientId: payment.clientId || '',
      clientName: payment.clientName,
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      referenceNumber: payment.referenceNumber || '',
      bankName: payment.bankName || '',
      chequeDate: payment.chequeDate || '',
      paymentDate: payment.paymentDate,
      notes: payment.notes || '',
      recordedBy: payment.recordedBy,
    };
    try {
      const permissions = await this.documentPermissions();
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.payments,
        payment.id,
        data,
        permissions
      );
      return true;
    } catch (e) {
      console.warn('Appwrite savePayment notice:', e);
      return false;
    }
  },

  // --- CASH BOOK ---
  async fetchCashTransactions(): Promise<CashBookEntry[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.cashTransactions,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        date: doc.date,
        type: doc.type,
        category: doc.category,
        particulars: doc.particulars,
        voucherNo: doc.voucherNo || '',
        linkedJobId: doc.linkedJobId || '',
        amount: doc.amount,
        balanceAfter: doc.balanceAfter || 0,
        recordedBy: doc.recordedBy || 'Cashier',
        createdAt: doc.$createdAt,
      }));
    } catch {
      return null;
    }
  },

  async saveCashTransaction(entry: CashBookEntry): Promise<boolean> {
    const data = {
      date: entry.date,
      type: entry.type,
      category: entry.category,
      particulars: entry.particulars,
      voucherNo: entry.voucherNo || '',
      linkedJobId: entry.linkedJobId || '',
      amount: entry.amount,
      balanceAfter: entry.balanceAfter,
      recordedBy: entry.recordedBy,
    };
    try {
      const permissions = await this.documentPermissions();
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.cashTransactions,
        entry.id,
        data,
        permissions
      );
      return true;
    } catch (e) {
      console.warn('Appwrite saveCashTransaction notice:', e);
      return false;
    }
  },

  // --- EXPENSES ---
  async fetchExpenses(): Promise<ExpenseRecord[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.expenses,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        date: doc.date,
        category: doc.category,
        title: doc.title,
        description: doc.description || '',
        amount: doc.amount,
        paymentMethod: doc.paymentMethod || 'cash',
        receiptNo: doc.receiptNo || '',
        paidTo: doc.paidTo,
        approvedBy: doc.approvedBy || 'Owner',
        createdAt: doc.$createdAt,
      }));
    } catch {
      return null;
    }
  },

  async saveExpense(expense: ExpenseRecord): Promise<boolean> {
    const data = {
      date: expense.date,
      category: expense.category,
      title: expense.title,
      description: expense.description || '',
      amount: expense.amount,
      paymentMethod: expense.paymentMethod,
      receiptNo: expense.receiptNo || '',
      paidTo: expense.paidTo,
      approvedBy: expense.approvedBy,
    };
    try {
      const permissions = await this.documentPermissions();
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.expenses,
        expense.id,
        data,
        permissions
      );
      return true;
    } catch (e) {
      console.warn('Appwrite saveExpense notice:', e);
      return false;
    }
  },

  // --- GODOWN STOCK & WAREHOUSE INVENTORY ---
  async fetchStockItems(): Promise<StockItem[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.godownStock,
        [Query.orderDesc('$createdAt'), Query.limit(150)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        godownId: doc.godownId || 'main',
        godownName: doc.godownName || 'Main Godown',
        paperType: doc.paperType,
        gsm: doc.gsm || 150,
        fullSheetSize: doc.fullSheetSize || '',
        reamsAvailable: doc.reamsAvailable || 0,
        sheetsAvailable: doc.sheetsAvailable || 0,
        averageUnitCost: doc.averageUnitCost || 0,
        minThresholdReams: doc.minThresholdReams || 3,
        lastRestocked: doc.lastRestocked || '',
        brandOrMill: doc.brandOrMill || undefined,
        rackLocation: doc.rackLocation || undefined,
        notes: doc.notes || undefined,
      }));
    } catch {
      return null;
    }
  },

  async saveStockItem(item: StockItem): Promise<boolean> {
    const data = {
      godownId: item.godownId,
      godownName: item.godownName,
      paperType: item.paperType,
      gsm: item.gsm,
      fullSheetSize: item.fullSheetSize,
      reamsAvailable: item.reamsAvailable,
      sheetsAvailable: item.sheetsAvailable,
      averageUnitCost: item.averageUnitCost,
      minThresholdReams: item.minThresholdReams,
      lastRestocked: item.lastRestocked,
      brandOrMill: item.brandOrMill || '',
      rackLocation: item.rackLocation || '',
      notes: item.notes || '',
    };
    try {
      const permissions = await this.documentPermissions();
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.godownStock,
          item.id,
          data,
          permissions
        );
      } catch (err: unknown) {
        const error = err as { code?: number; type?: string };
        if (error?.code === 409 || error?.type === 'document_already_exists') {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.godownStock,
            item.id,
            data
          );
        } else {
          throw err;
        }
      }
      return true;
    } catch (e) {
      console.warn('Appwrite saveStockItem notice:', e);
      return false;
    }
  },

  async deleteStockItem(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.godownStock,
        id
      );
      return true;
    } catch {
      return false;
    }
  },

  // --- NOTIFICATIONS ---
  async fetchNotifications(): Promise<PrintOSNotification[] | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.notifications,
        [Query.orderDesc('$createdAt'), Query.limit(50)]
      );
      return response.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        message: doc.message,
        category: doc.category as NotificationCategory,
        priority: doc.priority as NotificationPriority,
        timestamp: doc.timestamp || doc.$createdAt,
        read: !!doc.read,
        targetTab: doc.targetTab as NavItemKey | undefined,
        actionText: doc.actionText || '',
        entityId: doc.entityId || '',
      }));
    } catch {
      return null;
    }
  },

  async saveNotification(n: PrintOSNotification): Promise<boolean> {
    const data = {
      title: n.title,
      message: n.message,
      category: n.category,
      priority: n.priority,
      timestamp: n.timestamp,
      read: n.read,
      targetTab: n.targetTab || '',
      actionText: n.actionText || '',
      entityId: n.entityId || '',
    };
    try {
      const permissions = await this.documentPermissions();
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.notifications,
          n.id,
          data,
          permissions
        );
      } catch (err: unknown) {
        const error = err as { code?: number; type?: string };
        if (error?.code === 409 || error?.type === 'document_already_exists') {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.notifications,
            n.id,
            data
          );
        } else {
          throw err;
        }
      }
      return true;
    } catch (e) {
      console.warn('Appwrite saveNotification notice:', e);
      return false;
    }
  },
};
