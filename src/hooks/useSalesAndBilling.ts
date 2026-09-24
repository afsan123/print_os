'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  SalesInvoice,
  DeliveryChalan,
  ClientPaymentRecord,
  DebtorSummary,
  ClientPaymentMethod,
  ChalanStatus,
  TransportMode,
} from '@/types/sales';
import { checkAppwriteHealth } from '@/lib/appwrite';
import { appwriteService } from '@/lib/appwriteService';

// New users start with a clean workspace — no demo data
const INITIAL_INVOICES: SalesInvoice[] = [];
const INITIAL_CHALANS: DeliveryChalan[] = [];
const INITIAL_PAYMENTS: ClientPaymentRecord[] = [];

export function useSalesAndBilling() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>(INITIAL_INVOICES);
  const [deliveryChalans, setDeliveryChalans] = useState<DeliveryChalan[]>(INITIAL_CHALANS);
  const [paymentRecords, setPaymentRecords] = useState<ClientPaymentRecord[]>(INITIAL_PAYMENTS);

  // Modals & Active Selections
  const [activeInvoiceForPayment, setActiveInvoiceForPayment] = useState<SalesInvoice | null>(null);
  const [activeChalanForPrint, setActiveChalanForPrint] = useState<DeliveryChalan | null>(null);
  const [activeInvoiceForPrint, setActiveInvoiceForPrint] = useState<SalesInvoice | null>(null);
  const [isNewChalanModalOpen, setIsNewChalanModalOpen] = useState(false);
  const [activeJobForChalan, setActiveJobForChalan] = useState<{
    jobId: string;
    clientName: string;
    jobTitle: string;
    totalQuantity: number;
    deliveredQuantity: number;
  } | null>(null);
  const [activeClientForStatement, setActiveClientForStatement] = useState<string | null>(null);

  // Appwrite Health State
  const [appwriteStatus, setAppwriteStatus] = useState<{
    checked: boolean;
    connected: boolean;
    endpoint: string;
    projectId: string;
    databaseId: string;
  }>({
    checked: false,
    connected: false,
    endpoint: '',
    projectId: '',
    databaseId: '',
  });

  // Verify Appwrite connection and hydrate cloud records on load
  useEffect(() => {
    checkAppwriteHealth().then((res) => {
      setAppwriteStatus({
        checked: true,
        connected: res.connected,
        endpoint: res.endpoint,
        projectId: res.projectId,
        databaseId: res.databaseId,
      });

      if (res.connected && res.databaseStatus === 'ready') {
        appwriteService.fetchInvoices().then((cloudInvs) => {
          if (cloudInvs && cloudInvs.length > 0) {
            setInvoices((prev) => {
              const ids = new Set(cloudInvs.map((c) => c.id));
              const nonCloud = prev.filter((p) => !ids.has(p.id));
              return [...cloudInvs, ...nonCloud];
            });
          }
        });

        appwriteService.fetchChalans().then((cloudChalans) => {
          if (cloudChalans && cloudChalans.length > 0) {
            setDeliveryChalans((prev) => {
              const ids = new Set(cloudChalans.map((c) => c.id));
              const nonCloud = prev.filter((p) => !ids.has(p.id));
              return [...cloudChalans, ...nonCloud];
            });
          }
        });
      }
    });
  }, []);

  // Record Client Payment
  const recordClientPayment = (
    invoiceId: string,
    amount: number,
    paymentMethod: ClientPaymentMethod,
    referenceNumber?: string,
    bankName?: string,
    chequeDate?: string,
    notes?: string
  ) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const newAdvance = inv.advancePaid + amount;
    const newDue = Math.max(0, inv.totalAmount - newAdvance);
    const newStatus: SalesInvoice['paymentStatus'] =
      newDue <= 0 ? 'paid' : newAdvance > 0 ? 'partial' : 'unpaid';

    setInvoices((prev) =>
      prev.map((item) =>
        item.id === invoiceId
          ? {
              ...item,
              advancePaid: newAdvance,
              dueAmount: newDue,
              paymentStatus: newStatus,
            }
          : item
      )
    );

    const paymentEntry: ClientPaymentRecord = {
      id: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: inv.clientName,
      invoiceId,
      amount,
      paymentMethod,
      referenceNumber,
      bankName,
      chequeDate,
      paymentDate: new Date().toISOString().split('T')[0],
      notes,
      recordedBy: 'Accounts / PrintOS Cashier',
      createdAt: new Date().toISOString(),
    };

    setPaymentRecords((prev) => [paymentEntry, ...prev]);
    setActiveInvoiceForPayment(null);
  };

  // Create Delivery Chalan
  const createDeliveryChalan = (data: {
    jobId: string;
    invoiceId?: string;
    clientName: string;
    deliveryAddress: string;
    jobTitle: string;
    totalOrderQuantity: number;
    previouslyDelivered: number;
    deliveredQuantity: number;
    packageCount: number;
    packageDescription: string;
    transportMode: TransportMode;
    vehicleNumber?: string;
    driverName?: string;
    driverPhone?: string;
    deliveryDate?: string;
  }) => {
    const chalanId = `CH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const gatePassNo = `GP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const remaining = Math.max(
      0,
      data.totalOrderQuantity - (data.previouslyDelivered + data.deliveredQuantity)
    );

    const newChalan: DeliveryChalan = {
      id: chalanId,
      gatePassNo,
      jobId: data.jobId,
      invoiceId: data.invoiceId,
      clientName: data.clientName,
      deliveryAddress: data.deliveryAddress,
      jobTitle: data.jobTitle,
      totalOrderQuantity: data.totalOrderQuantity,
      previouslyDelivered: data.previouslyDelivered,
      deliveredQuantity: data.deliveredQuantity,
      remainingBalance: remaining,
      packageCount: data.packageCount,
      packageDescription: data.packageDescription,
      transportMode: data.transportMode,
      vehicleNumber: data.vehicleNumber,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      deliveryDate: data.deliveryDate || new Date().toISOString().split('T')[0],
      status: 'dispatched',
      createdAt: new Date().toISOString(),
    };

    setDeliveryChalans((prev) => [newChalan, ...prev]);
    // Try background sync to Appwrite
    appwriteService.saveChalan(newChalan).catch(() => {});
    setIsNewChalanModalOpen(false);
    return newChalan;
  };

  // Update Chalan Status
  const updateChalanStatus = (
    chalanId: string,
    status: ChalanStatus,
    receivedBy?: string,
    receiverPhone?: string
  ) => {
    setDeliveryChalans((prev) =>
      prev.map((c) =>
        c.id === chalanId
          ? {
              ...c,
              status,
              receivedBy: receivedBy || c.receivedBy,
              receiverPhone: receiverPhone || c.receiverPhone,
            }
          : c
      )
    );
  };

  // Create Invoice from Job or Estimator
  const createInvoiceFromJob = (data: {
    jobId?: string;
    clientName: string;
    clientCompany?: string;
    clientPhone: string;
    clientAddress: string;
    clientBin?: string;
    jobTitle: string;
    quantity: number;
    unitRate: number;
    subtotal: number;
    taxRate?: number;
    advancePaid?: number;
    notes?: string;
  }): SalesInvoice => {
    const invId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const taxRate = data.taxRate || 0;
    const taxAmount = (data.subtotal * taxRate) / 100;
    const totalAmount = data.subtotal + taxAmount;
    const advancePaid = data.advancePaid || 0;
    const dueAmount = Math.max(0, totalAmount - advancePaid);
    const paymentStatus: SalesInvoice['paymentStatus'] =
      dueAmount <= 0 ? 'paid' : advancePaid > 0 ? 'partial' : 'unpaid';

    const newInvoice: SalesInvoice = {
      id: invId,
      jobId: data.jobId,
      clientName: data.clientName,
      clientCompany: data.clientCompany,
      clientPhone: data.clientPhone,
      clientAddress: data.clientAddress,
      clientBin: data.clientBin,
      jobTitle: data.jobTitle,
      quantity: data.quantity,
      unitRate: data.unitRate,
      subtotal: data.subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      advancePaid,
      dueAmount,
      paymentStatus,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          description: data.jobTitle,
          quantity: data.quantity,
          unit: 'Pcs',
          unitRate: data.unitRate,
          total: data.subtotal,
        },
      ],
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // If advance paid, record payment
    if (advancePaid > 0) {
      const payRecord: ClientPaymentRecord = {
        id: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: data.clientName,
        invoiceId: invId,
        amount: advancePaid,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: 'Initial booking advance',
        recordedBy: 'PrintOS Auto',
        createdAt: new Date().toISOString(),
      };
      setPaymentRecords((prev) => [payRecord, ...prev]);
    }

    // Try background sync to Appwrite
    appwriteService.saveInvoice(newInvoice).catch(() => {});
    return newInvoice;
  };

  // Derived Debtors Summary
  const debtors = useMemo<DebtorSummary[]>(() => {
    const map = new Map<string, DebtorSummary>();

    invoices.forEach((inv) => {
      const existing = map.get(inv.clientName) || {
        clientName: inv.clientName,
        company: inv.clientCompany || inv.clientName,
        phone: inv.clientPhone,
        totalInvoiced: 0,
        totalCollected: 0,
        outstandingBalance: 0,
        agingCategory: '0-15 days',
        creditLimit: 100000,
        status: 'healthy',
      };

      existing.totalInvoiced += inv.totalAmount;
      existing.totalCollected += inv.advancePaid;
      existing.outstandingBalance += inv.dueAmount;

      // Aging calculation
      const daysOld = Math.floor(
        (Date.now() - new Date(inv.invoiceDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (inv.dueAmount > 0) {
        if (daysOld > 60) {
          existing.agingCategory = '60+ days overdue';
          existing.status = 'critical';
        } else if (daysOld > 30 && existing.agingCategory !== '60+ days overdue') {
          existing.agingCategory = '31-60 days';
          existing.status = 'warning';
        } else if (daysOld > 15 && existing.status === 'healthy') {
          existing.agingCategory = '16-30 days';
        }
      }

      map.set(inv.clientName, existing);
    });

    return Array.from(map.values());
  }, [invoices]);

  return {
    invoices,
    deliveryChalans,
    paymentRecords,
    debtors,
    appwriteStatus,
    activeInvoiceForPayment,
    setActiveInvoiceForPayment,
    activeChalanForPrint,
    setActiveChalanForPrint,
    activeInvoiceForPrint,
    setActiveInvoiceForPrint,
    isNewChalanModalOpen,
    setIsNewChalanModalOpen,
    activeJobForChalan,
    setActiveJobForChalan,
    activeClientForStatement,
    setActiveClientForStatement,
    recordClientPayment,
    createDeliveryChalan,
    updateChalanStatus,
    createInvoiceFromJob,
  };
}
