'use client';

import { useCallback, useEffect, useState } from 'react';
import { CalculationResult, EstimatorState } from '@/types/estimator';
import { PaperSupplier, PurchaseBill, StockItem } from '@/types/inventory';
import { appwriteService } from '@/lib/appwriteService';

const INITIAL_SUPPLIERS: PaperSupplier[] = [
  { id: 'sup-001', name: 'Karim Paper Mart', company: 'Karim Paper Mart Ltd.', contactPerson: 'Md. Karim', phone: '+880 1711-000111', email: 'sales@karimpaper.example', address: 'Bangshal, Dhaka', paperSpecialties: ['Art Paper', 'Art Card', 'Duplex Board'], balance: 0, rating: 5 },
  { id: 'sup-002', name: 'Mita Trading', company: 'Mita Trading House', contactPerson: 'Mita Saha', phone: '+880 1811-000222', email: 'orders@mitatrading.example', address: 'Nawabpur, Dhaka', paperSpecialties: ['Offset Paper', 'Newsprint'], balance: 0, rating: 4 },
];

const INITIAL_STOCK: StockItem[] = [
  { id: 'stock-001', godownId: 'main', godownName: 'Main Godown', paperType: 'Art Paper (আর্ট পেপার)', gsm: 150, fullSheetSize: '23 × 36 inch', reamsAvailable: 14, sheetsAvailable: 7000, averageUnitCost: 3500, minThresholdReams: 5, lastRestocked: '28 Sep 2026' },
  { id: 'stock-002', godownId: 'main', godownName: 'Main Godown', paperType: 'Art Card (আর্ট কার্ড)', gsm: 300, fullSheetSize: '20 × 30 inch', reamsAvailable: 3, sheetsAvailable: 1500, averageUnitCost: 4800, minThresholdReams: 4, lastRestocked: '24 Sep 2026' },
];

export function useInventoryProcurement() {
  const [suppliers, setSuppliers] = useState<PaperSupplier[]>(INITIAL_SUPPLIERS);
  const [purchaseBills, setPurchaseBills] = useState<PurchaseBill[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK);
  const [isInventoryEnabled, setIsInventoryEnabled] = useState(false);
  const [isDirectPurchaseModalOpen, setIsDirectPurchaseModalOpen] = useState(false);
  const [activeJobForPurchase, setActiveJobForPurchase] = useState<{ jobTitle: string; client: string; category: string; paperType: string; gsm: number; fullSheetSize: string; reams: number; sheets: number; ratePerReam: number; jobId?: string } | null>(null);

  // Initialize optional inventory preference from localStorage (Default: OFF for small press)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('printos_inventory_enabled');
      if (stored !== null) {
        setIsInventoryEnabled(stored === 'true');
      }
    } catch {
      // Ignore in SSR
    }
  }, []);

  const setInventoryEnabled = useCallback((enabled: boolean) => {
    setIsInventoryEnabled(enabled);
    try {
      localStorage.setItem('printos_inventory_enabled', String(enabled));
    } catch {
      // Ignore
    }
  }, []);

  const toggleInventoryMode = useCallback(() => {
    setIsInventoryEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('printos_inventory_enabled', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Cloud hydration
  useEffect(() => {
    appwriteService.fetchSuppliers().then((cloudSuppliers) => {
      if (cloudSuppliers && cloudSuppliers.length > 0) {
        setSuppliers((prev) => {
          const ids = new Set(cloudSuppliers.map((s) => s.id));
          return [...cloudSuppliers, ...prev.filter((p) => !ids.has(p.id))];
        });
      }
    });

    appwriteService.fetchPurchaseBills().then((cloudBills) => {
      if (cloudBills && cloudBills.length > 0) {
        setPurchaseBills((prev) => {
          const ids = new Set(cloudBills.map((b) => b.id));
          return [...cloudBills, ...prev.filter((p) => !ids.has(p.id))];
        });
      }
    });

    appwriteService.fetchStockItems().then((cloudStock) => {
      if (cloudStock && cloudStock.length > 0) {
        setStockItems((prev) => {
          const ids = new Set(cloudStock.map((s) => s.id));
          return [...cloudStock, ...prev.filter((p) => !ids.has(p.id))];
        });
      }
    });
  }, []);

  const addSupplier = useCallback((supplier: Omit<PaperSupplier, 'id'>) => {
    const newSupplier: PaperSupplier = {
      ...supplier,
      id: `sup-${String(suppliers.length + 1).padStart(3, '0')}`,
    };
    setSuppliers((current) => [...current, newSupplier]);
    appwriteService.saveSupplier(newSupplier).catch(() => {});
  }, [suppliers.length]);

  const createPurchaseBill = useCallback((billData: Omit<PurchaseBill, 'id'>) => {
    const bill: PurchaseBill = { ...billData, id: `PB-2026-${String(purchaseBills.length + 1).padStart(4, '0')}` };
    setPurchaseBills((current) => [bill, ...current]);
    if (bill.procurementType === 'godown_stock') {
      setStockItems((current) => current.map((item) => item.paperType === bill.paperType && item.gsm === bill.gsm && item.fullSheetSize === bill.fullSheetSize ? { ...item, reamsAvailable: item.reamsAvailable + bill.reams, sheetsAvailable: item.sheetsAvailable + bill.sheets, lastRestocked: bill.purchaseDate } : item));
    }
    appwriteService.savePurchaseBill(bill).catch(() => {});
    return bill;
  }, [purchaseBills.length]);

  const recordBillPayment = useCallback((billId: string, amount: number) => {
    setPurchaseBills((current) => current.map((bill) => {
      if (bill.id !== billId) return bill;
      const paidAmount = Math.min(bill.totalAmount, bill.paidAmount + Math.max(0, amount));
      return { ...bill, paidAmount, paymentStatus: paidAmount >= bill.totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'due' };
    }));
  }, []);

  const openDirectPurchaseForJob = useCallback((state: EstimatorState, calc: CalculationResult, jobId?: string) => {
    setActiveJobForPurchase({ jobTitle: state.jobSpecs.jobTitle, client: state.jobSpecs.client, category: state.jobSpecs.category, paperType: state.paperConfig.paperType, gsm: state.paperConfig.gsm, fullSheetSize: state.paperConfig.fullSheetSize, reams: calc.totalReamsRequired, sheets: calc.totalSheetsRequired, ratePerReam: state.paperConfig.pricePerReam, jobId });
    setIsDirectPurchaseModalOpen(true);
  }, []);

  // Hydrate custom godown stock from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('printos_godown_stock');
      if (stored) {
        setStockItems(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const persistStock = (items: StockItem[]) => {
    setStockItems(items);
    try {
      localStorage.setItem('printos_godown_stock', JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  const addStockItem = useCallback((itemData: Omit<StockItem, 'id' | 'sheetsAvailable'> & { sheetsAvailable?: number }) => {
    const newItem: StockItem = {
      ...itemData,
      id: `stock-${Date.now().toString().slice(-4)}`,
      sheetsAvailable: itemData.sheetsAvailable ?? Math.round(itemData.reamsAvailable * 500),
      lastRestocked: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    persistStock([newItem, ...stockItems]);
    appwriteService.saveStockItem(newItem).catch(() => {});
    return newItem;
  }, [stockItems]);

  const adjustStock = useCallback((
    stockId: string,
    type: 'in' | 'out',
    reamsChange: number,
    sheetsChange: number = 0,
    reason: string = ''
  ) => {
    const totalSheetsChange = Math.round(reamsChange * 500) + sheetsChange;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const updated = stockItems.map((item) => {
      if (item.id !== stockId) return item;
      const currentTotalSheets = Math.round(item.reamsAvailable * 500) + (item.sheetsAvailable % 500);
      const newTotalSheets = type === 'in'
        ? currentTotalSheets + totalSheetsChange
        : Math.max(0, currentTotalSheets - totalSheetsChange);

      const newReams = +(newTotalSheets / 500).toFixed(2);
      return {
        ...item,
        reamsAvailable: newReams,
        sheetsAvailable: newTotalSheets,
        lastRestocked: type === 'in' ? nowStr : item.lastRestocked,
      };
    });

    persistStock(updated);
    const adjusted = updated.find((i) => i.id === stockId);
    if (adjusted) {
      appwriteService.saveStockItem(adjusted).catch(() => {});
    }
  }, [stockItems]);

  const updateStockItem = useCallback((stockId: string, updates: Partial<StockItem>) => {
    const updated = stockItems.map((item) => (item.id === stockId ? { ...item, ...updates } : item));
    persistStock(updated);
    const target = updated.find((i) => i.id === stockId);
    if (target) {
      appwriteService.saveStockItem(target).catch(() => {});
    }
  }, [stockItems]);

  const deleteStockItem = useCallback((stockId: string) => {
    persistStock(stockItems.filter((item) => item.id !== stockId));
    appwriteService.deleteStockItem(stockId).catch(() => {});
  }, [stockItems]);

  return {
    suppliers,
    purchaseBills,
    stockItems,
    isInventoryEnabled,
    toggleInventoryMode,
    setInventoryEnabled,
    addStockItem,
    adjustStock,
    updateStockItem,
    deleteStockItem,
    addSupplier,
    createPurchaseBill,
    recordBillPayment,
    openDirectPurchaseForJob,
    isDirectPurchaseModalOpen,
    setIsDirectPurchaseModalOpen,
    activeJobForPurchase,
  };
}
