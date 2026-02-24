
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  sku: 'sku',
  category: 'category',
  description: 'description',
  price: 'price',
  costPrice: 'costPrice',
  stock: 'stock',
  reorderLevel: 'reorderLevel',
  imageUrl: 'imageUrl',
  barcode: 'barcode',
  isActive: 'isActive',
  isSellable: 'isSellable',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  parentId: 'parentId',
  unitsPerParent: 'unitsPerParent'
};

exports.Prisma.SaleScalarFieldEnum = {
  id: 'id',
  saleNumber: 'saleNumber',
  subtotal: 'subtotal',
  tax: 'tax',
  discount: 'discount',
  total: 'total',
  status: 'status',
  createdAt: 'createdAt',
  userId: 'userId',
  customerId: 'customerId'
};

exports.Prisma.SaleItemScalarFieldEnum = {
  id: 'id',
  saleId: 'saleId',
  productId: 'productId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  subtotal: 'subtotal'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  loyaltyPoints: 'loyaltyPoints',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  contactPerson: 'contactPerson',
  email: 'email',
  phone: 'phone',
  address: 'address',
  isActive: 'isActive'
};

exports.Prisma.PurchaseOrderItemScalarFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  productId: 'productId',
  quantity: 'quantity',
  unitCost: 'unitCost',
  totalCost: 'totalCost'
};

exports.Prisma.StockMovementScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  type: 'type',
  quantity: 'quantity',
  description: 'description',
  createdAt: 'createdAt',
  reconciliationId: 'reconciliationId'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  saleId: 'saleId',
  pdfUrl: 'pdfUrl',
  createdAt: 'createdAt'
};

exports.Prisma.CampaignScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  budget: 'budget',
  createdAt: 'createdAt'
};

exports.Prisma.PromotionScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  batchId: 'batchId',
  title: 'title',
  discountType: 'discountType',
  discountValue: 'discountValue',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt'
};

exports.Prisma.CampaignProductScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  productId: 'productId',
  highlightLabel: 'highlightLabel',
  createdAt: 'createdAt'
};

exports.Prisma.SocialAccountScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  accountId: 'accountId',
  accessToken: 'accessToken',
  isConnected: 'isConnected'
};

exports.Prisma.ReconciliationScalarFieldEnum = {
  id: 'id',
  date: 'date',
  status: 'status',
  notes: 'notes'
};

exports.Prisma.SettingsScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value'
};

exports.Prisma.POSItemMappingScalarFieldEnum = {
  id: 'id',
  posItemName: 'posItemName',
  matchedInventoryId: 'matchedInventoryId',
  lastSoldPrice: 'lastSoldPrice',
  confidenceScore: 'confidenceScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tenantId: 'tenantId'
};

exports.Prisma.ProductBatchScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  sku: 'sku',
  quantity: 'quantity',
  expiryDate: 'expiryDate',
  receivedDate: 'receivedDate'
};

exports.Prisma.VendorInvoiceScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  invoiceNumber: 'invoiceNumber',
  invoiceDate: 'invoiceDate',
  totalAmount: 'totalAmount',
  fileUrl: 'fileUrl',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendorInvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  productId: 'productId',
  quantity: 'quantity',
  unitCost: 'unitCost',
  totalCost: 'totalCost'
};

exports.Prisma.AuditSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  status: 'status',
  notes: 'notes'
};

exports.Prisma.AuditCountScalarFieldEnum = {
  id: 'id',
  auditSessionId: 'auditSessionId',
  productId: 'productId',
  systemQuantity: 'systemQuantity',
  countedQuantity: 'countedQuantity',
  variance: 'variance',
  varianceReason: 'varianceReason',
  createdAt: 'createdAt'
};

exports.Prisma.InventoryAdjustmentScalarFieldEnum = {
  id: 'id',
  auditSessionId: 'auditSessionId',
  productId: 'productId',
  quantityChange: 'quantityChange',
  reason: 'reason',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.PurchaseOrderScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  orderNumber: 'orderNumber',
  orderDate: 'orderDate',
  status: 'status',
  totalAmount: 'totalAmount',
  notes: 'notes',
  sentAt: 'sentAt',
  receivedAt: 'receivedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProfitReportScalarFieldEnum = {
  id: 'id',
  period: 'period',
  startDate: 'startDate',
  endDate: 'endDate',
  revenue: 'revenue',
  cogs: 'cogs',
  grossProfit: 'grossProfit',
  grossMargin: 'grossMargin',
  expenses: 'expenses',
  netProfit: 'netProfit',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.ExpenseScalarFieldEnum = {
  id: 'id',
  category: 'category',
  amount: 'amount',
  description: 'description',
  expenseDate: 'expenseDate',
  createdAt: 'createdAt'
};

exports.Prisma.ZReportScalarFieldEnum = {
  id: 'id',
  reportDate: 'reportDate',
  reportNumber: 'reportNumber',
  totalSales: 'totalSales',
  totalTax: 'totalTax',
  fileUrl: 'fileUrl',
  status: 'status',
  processedAt: 'processedAt',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  User: 'User',
  Product: 'Product',
  Sale: 'Sale',
  SaleItem: 'SaleItem',
  Customer: 'Customer',
  Vendor: 'Vendor',
  PurchaseOrderItem: 'PurchaseOrderItem',
  StockMovement: 'StockMovement',
  Invoice: 'Invoice',
  Campaign: 'Campaign',
  Promotion: 'Promotion',
  CampaignProduct: 'CampaignProduct',
  SocialAccount: 'SocialAccount',
  Reconciliation: 'Reconciliation',
  Settings: 'Settings',
  POSItemMapping: 'POSItemMapping',
  ProductBatch: 'ProductBatch',
  VendorInvoice: 'VendorInvoice',
  VendorInvoiceItem: 'VendorInvoiceItem',
  AuditSession: 'AuditSession',
  AuditCount: 'AuditCount',
  InventoryAdjustment: 'InventoryAdjustment',
  PurchaseOrder: 'PurchaseOrder',
  ProfitReport: 'ProfitReport',
  Expense: 'Expense',
  ZReport: 'ZReport'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
