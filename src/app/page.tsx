'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sidebar, NavItemKey } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { EstimatorHeader } from '@/components/estimator/EstimatorHeader';
import { EstimatorForm } from '@/components/estimator/EstimatorForm';
import { JobCardModal } from '@/components/modals/JobCardModal';
import { WhatsAppQuoteModal } from '@/components/modals/WhatsAppQuoteModal';
import { NewClientModal } from '@/components/modals/NewClientModal';
import { TemplatePickerModal } from '@/components/modals/TemplatePickerModal';
import { CommandPalette } from '@/components/modals/CommandPalette';
import { ERPViews } from '@/components/views/ERPViews';
import { ProductionQueueView } from '@/components/production/ProductionQueueView';
import { JobCardsView } from '@/components/production/JobCardsView';
import { SuppliersListView } from '@/components/inventory/SuppliersListView';
import { PurchaseBillsView } from '@/components/inventory/PurchaseBillsView';
import { GodownInventoryView } from '@/components/inventory/GodownInventoryView';
import { DirectPurchaseModal } from '@/components/inventory/DirectPurchaseModal';
import { InvoicesListView } from '@/components/sales/InvoicesListView';
import { SalesReportView } from '@/components/sales/SalesReportView';
import { ClientsView } from '@/components/clients/ClientsView';
import { DeliveryChalansView } from '@/components/sales/DeliveryChalansView';
import { DebtorsLedgerView } from '@/components/sales/DebtorsLedgerView';
import { AppSettingsView } from '@/components/settings/AppSettingsView';
import { RecordPaymentModal } from '@/components/sales/RecordPaymentModal';
import { NewChalanModal } from '@/components/sales/NewChalanModal';
import { ChalanPrintModal } from '@/components/sales/ChalanPrintModal';
import { ClientStatementModal } from '@/components/sales/ClientStatementModal';
import { CashBookView } from '@/components/finance/CashBookView';
import { ExpensesView } from '@/components/finance/ExpensesView';
import { ProfitLossView } from '@/components/finance/ProfitLossView';
import { CashEntryModal } from '@/components/finance/CashEntryModal';
import { LogExpenseModal } from '@/components/finance/LogExpenseModal';
import { PayrollView } from '@/components/payroll/PayrollView';
import { PaySalaryModal } from '@/components/payroll/PaySalaryModal';
import { PaySlipModal } from '@/components/payroll/PaySlipModal';
import { AddEditStaffModal } from '@/components/payroll/AddEditStaffModal';
import { DeleteStaffModal } from '@/components/payroll/DeleteStaffModal';
import { StaffMember } from '@/types/payroll';
import { usePrintEstimator } from '@/hooks/usePrintEstimator';
import { useProductionQueue } from '@/hooks/useProductionQueue';
import { useInventoryProcurement } from '@/hooks/useInventoryProcurement';
import { useSalesAndBilling } from '@/hooks/useSalesAndBilling';
import { useFinance } from '@/hooks/useFinance';
import { usePayroll } from '@/hooks/usePayroll';
import { INITIAL_CLIENTS } from '@/lib/constants';
import { ClientRecord, PrintTemplate } from '@/types/estimator';
import { ProductionJob } from '@/types/production';
import { CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { OnboardingWizard } from '@/components/auth/OnboardingWizard';
import { appwriteService } from '@/lib/appwriteService';

export default function PrintOSPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<NavItemKey>('estimator');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [clients, setClients] = useState<ClientRecord[]>(INITIAL_CLIENTS);

  // Hydrate clients from Appwrite Cloud
  useEffect(() => {
    appwriteService.fetchClients().then((cloudClients) => {
      if (cloudClients && cloudClients.length > 0) {
        setClients((prev) => {
          const ids = new Set(cloudClients.map((c) => c.id));
          return [...cloudClients, ...prev.filter((p) => !ids.has(p.id))];
        });
      }
    });
  }, []);

  // Modals state
  const [jobCardModalOpen, setJobCardModalOpen] = useState(false);
  const [activeJobForDocket, setActiveJobForDocket] = useState<ProductionJob | undefined>(undefined);
  const [advanceForDocket, setAdvanceForDocket] = useState<number>(0);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateSavingMode, setTemplateSavingMode] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 4000);
  }, []);

  useEffect(() => () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  }, []);

  const navigateTo = useCallback((tab: NavItemKey) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const tabTitles: Record<NavItemKey, string> = {
      dashboard: 'Dashboard', estimator: 'Smart Estimator', job_cards: 'Job Cards',
      production_queue: 'Production Queue', invoices: 'Invoices', delivery_chalans: 'Delivery Chalans',
      clients: 'Clients', suppliers: 'Suppliers', purchase_bills: 'Purchase Bills',
      inventory: 'Godown Paper Stock',
      cash_book: 'Cash Book', transactions: 'Transactions', expenses: 'Expenses', payroll: 'Payroll',
      profit_loss: 'Profit & Loss', debtors: 'Debtors', sales_reports: 'Sales Reports', settings: 'Settings',
    };
    document.title = `${tabTitles[activeTab]} | PrintOS`;
  }, [activeTab]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  // Centralized Estimator Hook
  const {
    state,
    calculations,
    updateJobSpecs,
    updatePaperConfig,
    updatePressConfig,
    updateFinishingConfig,
    updateAdditionalExpenses,
    setProfitMargin,
    resetToDefault,
    loadTemplate,
    saveCustomTemplate,
    savedTemplates,
  } = usePrintEstimator();

  // Centralized Phase 2 Production Queue Hook
  const productionQueue = useProductionQueue();

  // Centralized Phase 3 Procurement & On-Demand Inventory Hook
  const procurement = useInventoryProcurement();

  // Centralized Phase 4 Sales, Invoicing & Appwrite Hook
  const sales = useSalesAndBilling();

  // Centralized Phase 5 Finance, Cash Book & P&L Hook
  const finance = useFinance(sales.invoices, procurement.purchaseBills);

  // Centralized Press Payroll & Labor Hook
  const payroll = usePayroll();

  // Handlers
  const handleReset = () => {
    resetToDefault();
    showToast('Estimator reset to default values.');
  };

  const handleOpenSaveTemplate = () => {
    setTemplateSavingMode(true);
    setTemplateModalOpen(true);
  };

  const handleOpenBrowseTemplates = () => {
    setTemplateSavingMode(false);
    setTemplateModalOpen(true);
  };

  const handleSelectTemplate = (tpl: PrintTemplate) => {
    loadTemplate(tpl);
    showToast(`Loaded preset: "${tpl.name}"`);
  };

  const handleSaveCurrentAsTemplate = (name: string, description: string) => {
    saveCustomTemplate(name, description);
    showToast(`Template "${name}" successfully saved!`);
  };

  const handleAddClient = (newClient: ClientRecord) => {
    setClients((prev) => [newClient, ...prev]);
    updateJobSpecs({ client: newClient.name });
    appwriteService.saveClient(newClient).catch(() => {});
    showToast(`Client "${newClient.name}" added and selected.`);
    addNotification({
      title: 'New Client Onboarded',
      message: `Client "${newClient.name}" (${newClient.company || 'Dhaka'}) added to CRM directory.`,
      category: 'finance',
      priority: 'low',
      targetTab: 'clients',
      actionText: 'View Client',
      entityId: newClient.id,
    });
  };

  const handleCreateInvoiceAndJobCard = (customAdvance?: number) => {
    setActiveJobForDocket(undefined);
    setAdvanceForDocket(typeof customAdvance === 'number' ? customAdvance : 0);
    // Trigger confetti celebration with PrintOS brand & CMYK colors!
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#1D5DFF', '#23A8FF', '#FF008C', '#FFD400', '#00C8FF', '#10B981'],
    });
    setJobCardModalOpen(true);
    addNotification({
      title: 'Job Docket Generated',
      message: `Job Card created for "${state.jobSpecs.jobTitle}" (${state.jobSpecs.client}) • Qty: ${state.jobSpecs.targetQuantity.toLocaleString()} pcs`,
      category: 'production',
      priority: 'normal',
      targetTab: 'job_cards',
      actionText: 'View Job Card',
    });
  };

  const handleStartJobForClient = (clientName: string) => {
    updateJobSpecs({ client: clientName });
    navigateTo('estimator');
    showToast(`Smart Estimator opened for client "${clientName}"`);
  };

  // Auth Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071A3D] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#23A8FF] via-[#1D5DFF] to-[#071A3D] shadow-xl shadow-[#071A3D]/70 animate-pulse ring-1 ring-white/20">
            <div className="relative w-6 h-6">
              <span className="absolute inset-0 block rounded-sm bg-[#00C8FF] -rotate-12 opacity-95" />
              <span className="absolute inset-0 block rounded-sm bg-[#FF008C] -rotate-6 opacity-95" />
              <span className="absolute inset-0 block rounded-sm bg-[#FFD400] rotate-3 opacity-95" />
              <span className="absolute inset-0 block rounded-sm bg-white shadow-sm flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#1D5DFF]" />
              </span>
            </div>
          </div>
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-bold text-[#D8E3FF]">PrintOS ক্লাউড ইআরপি লোড হচ্ছে...</h2>
            <p className="text-xs text-[#23A8FF] font-mono">Verifying Session & Secure Cloud Services</p>
          </div>
        </div>
      </div>
    );
  }

  // Authentication Guard
  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] dark:bg-[#071A3D] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span role="status" aria-live="polite">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-1 rounded p-0.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={navigateTo}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isInventoryEnabled={procurement.isInventoryEnabled}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <TopNav
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onNavigateTab={(tab) => navigateTo(tab as NavItemKey)}
          breadcrumbSection={
            activeTab === 'estimator' || activeTab === 'job_cards' || activeTab === 'production_queue'
              ? 'Jobs & Estimates'
              : 'Enterprise'
          }
          breadcrumbPage={
            activeTab === 'estimator'
              ? 'Smart Estimator'
              : activeTab.replace('_', ' ').toUpperCase()
          }
        />

        {/* Canvas Body - Expansive layout utilizing widescreen space */}
        <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 focus:outline-none">
          {activeTab === 'estimator' ? (
            <>
              {/* Page Banner Header */}
              <EstimatorHeader
                onSaveTemplate={handleOpenSaveTemplate}
                onReset={handleReset}
                onCreateInvoiceAndJobCard={handleCreateInvoiceAndJobCard}
                onOpenTemplatesModal={handleOpenBrowseTemplates}
              />

              {/* 2-Column Work Grid */}
              <EstimatorForm
                state={state}
                calculations={calculations}
                clients={clients}
                onUpdateJobSpecs={updateJobSpecs}
                onUpdatePaperConfig={updatePaperConfig}
                onUpdatePressConfig={updatePressConfig}
                onUpdateFinishingConfig={updateFinishingConfig}
                onUpdateAdditionalExpenses={updateAdditionalExpenses}
                onProfitMarginChange={setProfitMargin}
                onOpenNewClientModal={() => setNewClientModalOpen(true)}
                onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)}
                onCreateInvoiceAndJobCard={handleCreateInvoiceAndJobCard}
              />
            </>
          ) : activeTab === 'job_cards' ? (
            <JobCardsView
              jobs={productionQueue.jobs}
              onOpenJobDocket={(j) => {
                setActiveJobForDocket(j);
                setAdvanceForDocket(0);
                setJobCardModalOpen(true);
              }}
              onAdvanceStage={productionQueue.advanceStage}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'production_queue' ? (
            <ProductionQueueView
              jobs={productionQueue.jobs}
              filteredJobs={productionQueue.filteredJobs}
              machines={productionQueue.machines}
              searchQuery={productionQueue.searchQuery}
              onSearchChange={productionQueue.setSearchQuery}
              filterMachine={productionQueue.filterMachine}
              onFilterMachineChange={productionQueue.setFilterMachine}
              filterPriority={productionQueue.filterPriority}
              onFilterPriorityChange={productionQueue.setFilterPriority}
              showLiveTelemetry={productionQueue.showLiveTelemetry}
              onToggleTelemetry={() =>
                productionQueue.setShowLiveTelemetry((prev) => !prev)
              }
              isBarcodeScannerOpen={productionQueue.isBarcodeScannerOpen}
              onOpenBarcodeScanner={() =>
                productionQueue.setIsBarcodeScannerOpen(true)
              }
              onCloseBarcodeScanner={() =>
                productionQueue.setIsBarcodeScannerOpen(false)
              }
              onAdvanceStage={productionQueue.advanceStage}
              onRollbackStage={productionQueue.rollbackStage}
              onMoveJobToStage={productionQueue.moveJobToStage}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'suppliers' ? (
            <SuppliersListView
              suppliers={procurement.suppliers}
              purchaseBills={procurement.purchaseBills}
              onAddSupplier={procurement.addSupplier}
              onRecordPayment={procurement.recordBillPayment}
              onCreatePurchaseBill={procurement.createPurchaseBill}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'purchase_bills' ? (
            <PurchaseBillsView
              bills={procurement.purchaseBills}
              isInventoryEnabled={procurement.isInventoryEnabled}
              onToggleInventory={procurement.toggleInventoryMode}
              stockItems={procurement.stockItems}
              onRecordPayment={procurement.recordBillPayment}
              onGoToEstimator={() => navigateTo('estimator')}
              onNavigateToInventory={() => navigateTo('inventory')}
            />
          ) : activeTab === 'inventory' ? (
            <GodownInventoryView
              stockItems={procurement.stockItems}
              isInventoryEnabled={procurement.isInventoryEnabled}
              onToggleInventory={procurement.toggleInventoryMode}
              onAddStock={(item) => {
                procurement.addStockItem(item);
                showToast(`Paper "${item.paperType}" added to inventory.`);
                addNotification({
                  title: 'Paper Stock Added',
                  message: `${item.reamsAvailable} reams of ${item.paperType} (${item.fullSheetSize}) added to ${item.godownName}`,
                  category: 'inventory',
                  priority: 'normal',
                  targetTab: 'inventory',
                  actionText: 'Manage Stock',
                  entityId: item.godownId,
                });
              }}
              onAdjustStock={(stockId, type, reams, sheets, reason) => {
                procurement.adjustStock(stockId, type, reams, sheets, reason);
                showToast(`Stock ${type === 'in' ? 'received (+)' : 'issued (-)'} successfully.`);
                addNotification({
                  title: type === 'in' ? 'Stock Intake Recorded' : 'Stock Issued to Press',
                  message: `${reams} reams ${sheets > 0 ? `${sheets} sheets` : ''} (${reason})`,
                  category: 'inventory',
                  priority: 'normal',
                  targetTab: 'inventory',
                  actionText: 'Check Godown',
                });
              }}
              onDeleteStock={(stockId) => {
                procurement.deleteStockItem(stockId);
                showToast('Paper stock item removed.');
              }}
              onNavigateToPurchaseBills={() => navigateTo('purchase_bills')}
            />
          ) : activeTab === 'invoices' ? (
            <InvoicesListView
              invoices={sales.invoices}
              onOpenPaymentModal={(inv) => sales.setActiveInvoiceForPayment(inv)}
              onOpenPrintModal={(inv) => sales.setActiveInvoiceForPayment(inv)}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'delivery_chalans' ? (
            <DeliveryChalansView
              chalans={sales.deliveryChalans}
              onOpenNewChalanModal={() => sales.setIsNewChalanModalOpen(true)}
              onOpenPrintModal={(chalan) => sales.setActiveChalanForPrint(chalan)}
              onUpdateStatus={sales.updateChalanStatus}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'debtors' ? (
            <DebtorsLedgerView
              debtors={sales.debtors}
              onOpenPaymentForClient={(clientName) => {
                const inv = sales.invoices.find(
                  (i) => i.clientName === clientName && i.dueAmount > 0
                );
                if (inv) {
                  sales.setActiveInvoiceForPayment(inv);
                } else {
                  showToast(`No outstanding due invoices for ${clientName}`);
                }
              }}
              onOpenStatementModal={(clientName) =>
                sales.setActiveClientForStatement(clientName)
              }
            />
          ) : activeTab === 'cash_book' ? (
            <CashBookView
              cashEntries={finance.cashEntries}
              openingBalance={finance.openingBalance}
              closingBalance={finance.closingBalance}
              todayInflows={finance.todayInflows}
              todayOutflows={finance.todayOutflows}
              onOpenCashEntryModal={() => finance.setIsCashEntryModalOpen(true)}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'expenses' ? (
            <ExpensesView
              expenses={finance.expenses}
              onOpenLogExpenseModal={() => finance.setIsLogExpenseModalOpen(true)}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'sales_reports' ? (
            <SalesReportView
              invoices={sales.invoices}
              paymentRecords={sales.paymentRecords}
              onOpenPaymentModal={(inv) => sales.setActiveInvoiceForPayment(inv)}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'profit_loss' ? (
            <ProfitLossView
              metrics={finance.profitLossMetrics}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'payroll' ? (
            <PayrollView
              staff={payroll.staff}
              metrics={payroll.metrics}
              onOpenPayModal={(m) => payroll.setActiveStaffForPay(m)}
              onOpenSlipModal={(m) => payroll.setActiveStaffForSlip(m)}
              onOpenAddStaffModal={() => {
                payroll.setStaffToEdit(null);
                payroll.setIsAddStaffModalOpen(true);
              }}
              onEditStaff={(m) => {
                payroll.setStaffToEdit(m);
                payroll.setIsAddStaffModalOpen(true);
              }}
              onRequestDeleteStaff={(m) => payroll.setStaffToDelete(m)}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : activeTab === 'settings' ? (
            <AppSettingsView
              appwriteStatus={sales.appwriteStatus}
              onRefreshConnection={() =>
                showToast('ক্লাউড সিঙ্ক্রোনাইজেশন যাচাই সম্পন্ন হয়েছে।')
              }
              isInventoryEnabled={procurement.isInventoryEnabled}
              onToggleInventory={procurement.toggleInventoryMode}
              onNavigateToInventory={() => navigateTo('inventory')}
            />
          ) : activeTab === 'clients' ? (
            <ClientsView
              clients={clients}
              invoices={sales.invoices}
              paymentRecords={sales.paymentRecords}
              productionJobs={productionQueue.jobs}
              chalans={sales.deliveryChalans}
              onOpenNewClientModal={() => setNewClientModalOpen(true)}
              onOpenPaymentForInvoice={(inv) => sales.setActiveInvoiceForPayment(inv)}
              onOpenStatementModal={(clientName) =>
                sales.setActiveClientForStatement(clientName)
              }
              onStartJobForClient={handleStartJobForClient}
              onGoToEstimator={() => navigateTo('estimator')}
            />
          ) : (
            <ERPViews
              activeTab={activeTab}
              onGoToEstimator={() => navigateTo('estimator')}
              clients={clients}
              isInventoryEnabled={procurement.isInventoryEnabled}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <JobCardModal
        key={`${activeJobForDocket?.id ?? state.jobSpecs.client}-${state.jobSpecs.jobTitle}-${advanceForDocket}`}
        isOpen={jobCardModalOpen}
        onClose={() => {
          setJobCardModalOpen(false);
          setActiveJobForDocket(undefined);
        }}
        state={state}
        calc={calculations}
        job={activeJobForDocket}
        initialAdvance={advanceForDocket}
        onSendToProductionQueue={(st, cl) => {
          const newJob = productionQueue.addJobFromEstimator(st, cl);
          showToast(`Job "${newJob.jobTitle}" (${newJob.id}) scheduled in Pre-Press Queue!`);
          addNotification({
            title: 'Job Queued in Pre-Press',
            message: `Job #${newJob.id} ("${newJob.jobTitle}") scheduled for CTP plates & offset printing.`,
            category: 'production',
            priority: 'normal',
            targetTab: 'production_queue',
            actionText: 'View Queue',
            entityId: newJob.id,
          });
          navigateTo('production_queue');
        }}
        onBuyPaperForJob={(st, cl, jId) => {
          procurement.openDirectPurchaseForJob(st, cl, jId);
          setJobCardModalOpen(false);
        }}
        onCreateInvoice={(st, cl, jId, advancePaid) => {
          const finalAdvance = typeof advancePaid === 'number' ? advancePaid : advanceForDocket;
          const newInv = sales.createInvoiceFromJob({
            jobId: jId,
            clientName: st.jobSpecs.client,
            clientPhone: '+880 1711-234567',
            clientAddress: 'Tejgaon I/A, Dhaka-1208',
            jobTitle: st.jobSpecs.jobTitle,
            quantity: st.jobSpecs.targetQuantity,
            unitRate: cl.perPieceCost,
            subtotal: cl.finalSellingPrice,
            taxRate: 5,
            advancePaid: finalAdvance,
            notes: 'Created from Smart Estimator Job Card',
          });
          const dueMsg = newInv.dueAmount > 0 ? ` (Due: ৳${newInv.dueAmount.toLocaleString()})` : ' (Fully Paid)';
          showToast(`Commercial Sales Invoice ${newInv.id} created! Advance: ৳${finalAdvance.toLocaleString()}${dueMsg}`);
          addNotification({
            title: 'Sales Invoice Created',
            message: `Invoice #${newInv.id} for "${newInv.clientName}" created • Total: ৳${newInv.totalAmount.toLocaleString()} • Advance: ৳${finalAdvance.toLocaleString()}`,
            category: 'finance',
            priority: 'normal',
            targetTab: 'invoices',
            actionText: 'View Invoice',
            entityId: newInv.id,
          });
          navigateTo('invoices');
        }}
      />

      <DirectPurchaseModal
        isOpen={procurement.isDirectPurchaseModalOpen}
        onClose={() => procurement.setIsDirectPurchaseModalOpen(false)}
        jobData={procurement.activeJobForPurchase}
        suppliers={procurement.suppliers}
        onCreateBill={procurement.createPurchaseBill}
        onSuccessToast={showToast}
      />

      <RecordPaymentModal
        isOpen={!!sales.activeInvoiceForPayment}
        onClose={() => sales.setActiveInvoiceForPayment(null)}
        invoice={sales.activeInvoiceForPayment}
        onRecordPayment={sales.recordClientPayment}
        onSuccessToast={showToast}
      />

      <NewChalanModal
        isOpen={sales.isNewChalanModalOpen}
        onClose={() => {
          sales.setIsNewChalanModalOpen(false);
          sales.setActiveJobForChalan(null);
        }}
        initialJobData={sales.activeJobForChalan}
        onCreateChalan={sales.createDeliveryChalan}
        onSuccessToast={showToast}
      />

      <ChalanPrintModal
        isOpen={!!sales.activeChalanForPrint}
        onClose={() => sales.setActiveChalanForPrint(null)}
        chalan={sales.activeChalanForPrint}
      />

      <ClientStatementModal
        isOpen={!!sales.activeClientForStatement}
        onClose={() => sales.setActiveClientForStatement(null)}
        clientName={sales.activeClientForStatement}
        invoices={sales.invoices}
        payments={sales.paymentRecords}
      />

      <CashEntryModal
        isOpen={finance.isCashEntryModalOpen}
        onClose={() => finance.setIsCashEntryModalOpen(false)}
        onAddEntry={finance.addCashEntry}
        onSuccessToast={showToast}
      />

      <LogExpenseModal
        isOpen={finance.isLogExpenseModalOpen}
        onClose={() => finance.setIsLogExpenseModalOpen(false)}
        onAddExpense={finance.addExpense}
        onSuccessToast={showToast}
      />

      <WhatsAppQuoteModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        state={state}
        calc={calculations}
      />

      <NewClientModal
        isOpen={newClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
        onAddClient={handleAddClient}
      />

      <TemplatePickerModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        templates={savedTemplates}
        onSelectTemplate={handleSelectTemplate}
        onSaveCurrentAsTemplate={handleSaveCurrentAsTemplate}
        isSavingMode={templateSavingMode}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        clients={clients}
        templates={savedTemplates}
        onSelectClient={(cName) => {
          updateJobSpecs({ client: cName });
          showToast(`Client "${cName}" selected.`);
        }}
        onSelectTemplate={handleSelectTemplate}
          onNavigate={navigateTo}
      />

      <PaySalaryModal
        isOpen={!!payroll.activeStaffForPay}
        onClose={() => payroll.setActiveStaffForPay(null)}
        staff={payroll.activeStaffForPay}
        onDisburseSalary={(payload) => {
          payroll.recordSalaryPayment(payload);
          addNotification({
            title: 'Staff Salary Disbursed',
            message: `৳ ${payload.amount.toLocaleString()} paid to ${payroll.activeStaffForPay?.name} (${payroll.activeStaffForPay?.roleLabel}) via ${payload.paymentMethod.toUpperCase()}`,
            category: 'payroll',
            priority: 'normal',
            targetTab: 'payroll',
            actionText: 'View Payroll',
            entityId: payroll.activeStaffForPay?.id,
          });
          // If paid via cash, automatically record in Factory Cash Book
          if (payload.paymentMethod === 'cash') {
            finance.addCashEntry({
              type: 'outflow',
              amount: payload.amount,
              particulars: `Staff Salary: ${payroll.activeStaffForPay?.name} (${payroll.activeStaffForPay?.roleLabel})`,
              category: 'worker_food',
              voucherNo: `VCH-SAL-${Date.now().toString().slice(-4)}`,
              date: payload.paymentDate,
            });
          }
        }}
        onSuccessToast={showToast}
      />

      <PaySlipModal
        isOpen={!!payroll.activeStaffForSlip}
        onClose={() => payroll.setActiveStaffForSlip(null)}
        staff={payroll.activeStaffForSlip}
      />

      <AddEditStaffModal
        isOpen={payroll.isAddStaffModalOpen}
        onClose={() => {
          payroll.setIsAddStaffModalOpen(false);
          payroll.setStaffToEdit(null);
        }}
        staffToEdit={payroll.staffToEdit}
        onSaveStaff={(data) => {
          if (data.id) {
            payroll.updateStaff(data as StaffMember);
          } else {
            payroll.addStaff(data);
          }
        }}
        onSuccessToast={showToast}
      />

      <DeleteStaffModal
        isOpen={!!payroll.staffToDelete}
        onClose={() => payroll.setStaffToDelete(null)}
        staff={payroll.staffToDelete}
        onConfirmDelete={(id) => payroll.removeStaff(id)}
        onSuccessToast={showToast}
      />

      {/* New User Onboarding Wizard Modal */}
      {user?.pressProfile?.onboardingCompleted === false && <OnboardingWizard />}
    </div>
  );
}
