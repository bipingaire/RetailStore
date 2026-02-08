
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model Sale
 * 
 */
export type Sale = $Result.DefaultSelection<Prisma.$SalePayload>
/**
 * Model SaleItem
 * 
 */
export type SaleItem = $Result.DefaultSelection<Prisma.$SaleItemPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Vendor
 * 
 */
export type Vendor = $Result.DefaultSelection<Prisma.$VendorPayload>
/**
 * Model PurchaseOrder
 * 
 */
export type PurchaseOrder = $Result.DefaultSelection<Prisma.$PurchaseOrderPayload>
/**
 * Model PurchaseOrderItem
 * 
 */
export type PurchaseOrderItem = $Result.DefaultSelection<Prisma.$PurchaseOrderItemPayload>
/**
 * Model StockMovement
 * 
 */
export type StockMovement = $Result.DefaultSelection<Prisma.$StockMovementPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model Campaign
 * 
 */
export type Campaign = $Result.DefaultSelection<Prisma.$CampaignPayload>
/**
 * Model SocialAccount
 * 
 */
export type SocialAccount = $Result.DefaultSelection<Prisma.$SocialAccountPayload>
/**
 * Model Reconciliation
 * 
 */
export type Reconciliation = $Result.DefaultSelection<Prisma.$ReconciliationPayload>
/**
 * Model Settings
 * 
 */
export type Settings = $Result.DefaultSelection<Prisma.$SettingsPayload>
/**
 * Model POSItemMapping
 * 
 */
export type POSItemMapping = $Result.DefaultSelection<Prisma.$POSItemMappingPayload>
/**
 * Model ProductBatch
 * 
 */
export type ProductBatch = $Result.DefaultSelection<Prisma.$ProductBatchPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs>;

  /**
   * `prisma.sale`: Exposes CRUD operations for the **Sale** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sales
    * const sales = await prisma.sale.findMany()
    * ```
    */
  get sale(): Prisma.SaleDelegate<ExtArgs>;

  /**
   * `prisma.saleItem`: Exposes CRUD operations for the **SaleItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SaleItems
    * const saleItems = await prisma.saleItem.findMany()
    * ```
    */
  get saleItem(): Prisma.SaleItemDelegate<ExtArgs>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs>;

  /**
   * `prisma.vendor`: Exposes CRUD operations for the **Vendor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vendors
    * const vendors = await prisma.vendor.findMany()
    * ```
    */
  get vendor(): Prisma.VendorDelegate<ExtArgs>;

  /**
   * `prisma.purchaseOrder`: Exposes CRUD operations for the **PurchaseOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseOrders
    * const purchaseOrders = await prisma.purchaseOrder.findMany()
    * ```
    */
  get purchaseOrder(): Prisma.PurchaseOrderDelegate<ExtArgs>;

  /**
   * `prisma.purchaseOrderItem`: Exposes CRUD operations for the **PurchaseOrderItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseOrderItems
    * const purchaseOrderItems = await prisma.purchaseOrderItem.findMany()
    * ```
    */
  get purchaseOrderItem(): Prisma.PurchaseOrderItemDelegate<ExtArgs>;

  /**
   * `prisma.stockMovement`: Exposes CRUD operations for the **StockMovement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockMovements
    * const stockMovements = await prisma.stockMovement.findMany()
    * ```
    */
  get stockMovement(): Prisma.StockMovementDelegate<ExtArgs>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs>;

  /**
   * `prisma.campaign`: Exposes CRUD operations for the **Campaign** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Campaigns
    * const campaigns = await prisma.campaign.findMany()
    * ```
    */
  get campaign(): Prisma.CampaignDelegate<ExtArgs>;

  /**
   * `prisma.socialAccount`: Exposes CRUD operations for the **SocialAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SocialAccounts
    * const socialAccounts = await prisma.socialAccount.findMany()
    * ```
    */
  get socialAccount(): Prisma.SocialAccountDelegate<ExtArgs>;

  /**
   * `prisma.reconciliation`: Exposes CRUD operations for the **Reconciliation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reconciliations
    * const reconciliations = await prisma.reconciliation.findMany()
    * ```
    */
  get reconciliation(): Prisma.ReconciliationDelegate<ExtArgs>;

  /**
   * `prisma.settings`: Exposes CRUD operations for the **Settings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.settings.findMany()
    * ```
    */
  get settings(): Prisma.SettingsDelegate<ExtArgs>;

  /**
   * `prisma.pOSItemMapping`: Exposes CRUD operations for the **POSItemMapping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more POSItemMappings
    * const pOSItemMappings = await prisma.pOSItemMapping.findMany()
    * ```
    */
  get pOSItemMapping(): Prisma.POSItemMappingDelegate<ExtArgs>;

  /**
   * `prisma.productBatch`: Exposes CRUD operations for the **ProductBatch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductBatches
    * const productBatches = await prisma.productBatch.findMany()
    * ```
    */
  get productBatch(): Prisma.ProductBatchDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Product: 'Product',
    Sale: 'Sale',
    SaleItem: 'SaleItem',
    Customer: 'Customer',
    Vendor: 'Vendor',
    PurchaseOrder: 'PurchaseOrder',
    PurchaseOrderItem: 'PurchaseOrderItem',
    StockMovement: 'StockMovement',
    Invoice: 'Invoice',
    Campaign: 'Campaign',
    SocialAccount: 'SocialAccount',
    Reconciliation: 'Reconciliation',
    Settings: 'Settings',
    POSItemMapping: 'POSItemMapping',
    ProductBatch: 'ProductBatch'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "product" | "sale" | "saleItem" | "customer" | "vendor" | "purchaseOrder" | "purchaseOrderItem" | "stockMovement" | "invoice" | "campaign" | "socialAccount" | "reconciliation" | "settings" | "pOSItemMapping" | "productBatch"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      Sale: {
        payload: Prisma.$SalePayload<ExtArgs>
        fields: Prisma.SaleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SaleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SaleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          findFirst: {
            args: Prisma.SaleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SaleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          findMany: {
            args: Prisma.SaleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>[]
          }
          create: {
            args: Prisma.SaleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          createMany: {
            args: Prisma.SaleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SaleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>[]
          }
          delete: {
            args: Prisma.SaleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          update: {
            args: Prisma.SaleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          deleteMany: {
            args: Prisma.SaleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SaleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SaleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalePayload>
          }
          aggregate: {
            args: Prisma.SaleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSale>
          }
          groupBy: {
            args: Prisma.SaleGroupByArgs<ExtArgs>
            result: $Utils.Optional<SaleGroupByOutputType>[]
          }
          count: {
            args: Prisma.SaleCountArgs<ExtArgs>
            result: $Utils.Optional<SaleCountAggregateOutputType> | number
          }
        }
      }
      SaleItem: {
        payload: Prisma.$SaleItemPayload<ExtArgs>
        fields: Prisma.SaleItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SaleItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SaleItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          findFirst: {
            args: Prisma.SaleItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SaleItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          findMany: {
            args: Prisma.SaleItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>[]
          }
          create: {
            args: Prisma.SaleItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          createMany: {
            args: Prisma.SaleItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SaleItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>[]
          }
          delete: {
            args: Prisma.SaleItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          update: {
            args: Prisma.SaleItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          deleteMany: {
            args: Prisma.SaleItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SaleItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SaleItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaleItemPayload>
          }
          aggregate: {
            args: Prisma.SaleItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSaleItem>
          }
          groupBy: {
            args: Prisma.SaleItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<SaleItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.SaleItemCountArgs<ExtArgs>
            result: $Utils.Optional<SaleItemCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Vendor: {
        payload: Prisma.$VendorPayload<ExtArgs>
        fields: Prisma.VendorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findFirst: {
            args: Prisma.VendorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findMany: {
            args: Prisma.VendorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          create: {
            args: Prisma.VendorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          createMany: {
            args: Prisma.VendorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VendorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          delete: {
            args: Prisma.VendorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          update: {
            args: Prisma.VendorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          deleteMany: {
            args: Prisma.VendorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VendorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          aggregate: {
            args: Prisma.VendorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendor>
          }
          groupBy: {
            args: Prisma.VendorGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorCountArgs<ExtArgs>
            result: $Utils.Optional<VendorCountAggregateOutputType> | number
          }
        }
      }
      PurchaseOrder: {
        payload: Prisma.$PurchaseOrderPayload<ExtArgs>
        fields: Prisma.PurchaseOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          findFirst: {
            args: Prisma.PurchaseOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          findMany: {
            args: Prisma.PurchaseOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>[]
          }
          create: {
            args: Prisma.PurchaseOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          createMany: {
            args: Prisma.PurchaseOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PurchaseOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>[]
          }
          delete: {
            args: Prisma.PurchaseOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          update: {
            args: Prisma.PurchaseOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>
          }
          aggregate: {
            args: Prisma.PurchaseOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseOrder>
          }
          groupBy: {
            args: Prisma.PurchaseOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseOrderCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderCountAggregateOutputType> | number
          }
        }
      }
      PurchaseOrderItem: {
        payload: Prisma.$PurchaseOrderItemPayload<ExtArgs>
        fields: Prisma.PurchaseOrderItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseOrderItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseOrderItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          findFirst: {
            args: Prisma.PurchaseOrderItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseOrderItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          findMany: {
            args: Prisma.PurchaseOrderItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>[]
          }
          create: {
            args: Prisma.PurchaseOrderItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          createMany: {
            args: Prisma.PurchaseOrderItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PurchaseOrderItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>[]
          }
          delete: {
            args: Prisma.PurchaseOrderItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          update: {
            args: Prisma.PurchaseOrderItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseOrderItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseOrderItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseOrderItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderItemPayload>
          }
          aggregate: {
            args: Prisma.PurchaseOrderItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseOrderItem>
          }
          groupBy: {
            args: Prisma.PurchaseOrderItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseOrderItemCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderItemCountAggregateOutputType> | number
          }
        }
      }
      StockMovement: {
        payload: Prisma.$StockMovementPayload<ExtArgs>
        fields: Prisma.StockMovementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockMovementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockMovementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          findFirst: {
            args: Prisma.StockMovementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockMovementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          findMany: {
            args: Prisma.StockMovementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          create: {
            args: Prisma.StockMovementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          createMany: {
            args: Prisma.StockMovementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StockMovementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>[]
          }
          delete: {
            args: Prisma.StockMovementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          update: {
            args: Prisma.StockMovementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          deleteMany: {
            args: Prisma.StockMovementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockMovementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StockMovementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockMovementPayload>
          }
          aggregate: {
            args: Prisma.StockMovementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockMovement>
          }
          groupBy: {
            args: Prisma.StockMovementGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockMovementGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockMovementCountArgs<ExtArgs>
            result: $Utils.Optional<StockMovementCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      Campaign: {
        payload: Prisma.$CampaignPayload<ExtArgs>
        fields: Prisma.CampaignFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CampaignFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CampaignFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          findFirst: {
            args: Prisma.CampaignFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CampaignFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          findMany: {
            args: Prisma.CampaignFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          create: {
            args: Prisma.CampaignCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          createMany: {
            args: Prisma.CampaignCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CampaignCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          delete: {
            args: Prisma.CampaignDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          update: {
            args: Prisma.CampaignUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          deleteMany: {
            args: Prisma.CampaignDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CampaignUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CampaignUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          aggregate: {
            args: Prisma.CampaignAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCampaign>
          }
          groupBy: {
            args: Prisma.CampaignGroupByArgs<ExtArgs>
            result: $Utils.Optional<CampaignGroupByOutputType>[]
          }
          count: {
            args: Prisma.CampaignCountArgs<ExtArgs>
            result: $Utils.Optional<CampaignCountAggregateOutputType> | number
          }
        }
      }
      SocialAccount: {
        payload: Prisma.$SocialAccountPayload<ExtArgs>
        fields: Prisma.SocialAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SocialAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SocialAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload>
          }
          findFirst: {
            args: Prisma.SocialAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SocialAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload>
          }
          findMany: {
            args: Prisma.SocialAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload>[]
          }
          create: {
            args: Prisma.SocialAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload>
          }
          createMany: {
            args: Prisma.SocialAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SocialAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload>[]
          }
          delete: {
            args: Prisma.SocialAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload>
          }
          update: {
            args: Prisma.SocialAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload>
          }
          deleteMany: {
            args: Prisma.SocialAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SocialAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SocialAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialAccountPayload>
          }
          aggregate: {
            args: Prisma.SocialAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSocialAccount>
          }
          groupBy: {
            args: Prisma.SocialAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<SocialAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.SocialAccountCountArgs<ExtArgs>
            result: $Utils.Optional<SocialAccountCountAggregateOutputType> | number
          }
        }
      }
      Reconciliation: {
        payload: Prisma.$ReconciliationPayload<ExtArgs>
        fields: Prisma.ReconciliationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReconciliationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReconciliationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          findFirst: {
            args: Prisma.ReconciliationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReconciliationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          findMany: {
            args: Prisma.ReconciliationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>[]
          }
          create: {
            args: Prisma.ReconciliationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          createMany: {
            args: Prisma.ReconciliationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReconciliationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>[]
          }
          delete: {
            args: Prisma.ReconciliationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          update: {
            args: Prisma.ReconciliationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          deleteMany: {
            args: Prisma.ReconciliationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReconciliationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReconciliationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReconciliationPayload>
          }
          aggregate: {
            args: Prisma.ReconciliationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReconciliation>
          }
          groupBy: {
            args: Prisma.ReconciliationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReconciliationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReconciliationCountArgs<ExtArgs>
            result: $Utils.Optional<ReconciliationCountAggregateOutputType> | number
          }
        }
      }
      Settings: {
        payload: Prisma.$SettingsPayload<ExtArgs>
        fields: Prisma.SettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findFirst: {
            args: Prisma.SettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findMany: {
            args: Prisma.SettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          create: {
            args: Prisma.SettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          createMany: {
            args: Prisma.SettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          delete: {
            args: Prisma.SettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          update: {
            args: Prisma.SettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          deleteMany: {
            args: Prisma.SettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          aggregate: {
            args: Prisma.SettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSettings>
          }
          groupBy: {
            args: Prisma.SettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingsCountArgs<ExtArgs>
            result: $Utils.Optional<SettingsCountAggregateOutputType> | number
          }
        }
      }
      POSItemMapping: {
        payload: Prisma.$POSItemMappingPayload<ExtArgs>
        fields: Prisma.POSItemMappingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.POSItemMappingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.POSItemMappingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload>
          }
          findFirst: {
            args: Prisma.POSItemMappingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.POSItemMappingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload>
          }
          findMany: {
            args: Prisma.POSItemMappingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload>[]
          }
          create: {
            args: Prisma.POSItemMappingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload>
          }
          createMany: {
            args: Prisma.POSItemMappingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.POSItemMappingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload>[]
          }
          delete: {
            args: Prisma.POSItemMappingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload>
          }
          update: {
            args: Prisma.POSItemMappingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload>
          }
          deleteMany: {
            args: Prisma.POSItemMappingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.POSItemMappingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.POSItemMappingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$POSItemMappingPayload>
          }
          aggregate: {
            args: Prisma.POSItemMappingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePOSItemMapping>
          }
          groupBy: {
            args: Prisma.POSItemMappingGroupByArgs<ExtArgs>
            result: $Utils.Optional<POSItemMappingGroupByOutputType>[]
          }
          count: {
            args: Prisma.POSItemMappingCountArgs<ExtArgs>
            result: $Utils.Optional<POSItemMappingCountAggregateOutputType> | number
          }
        }
      }
      ProductBatch: {
        payload: Prisma.$ProductBatchPayload<ExtArgs>
        fields: Prisma.ProductBatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductBatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductBatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload>
          }
          findFirst: {
            args: Prisma.ProductBatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductBatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload>
          }
          findMany: {
            args: Prisma.ProductBatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload>[]
          }
          create: {
            args: Prisma.ProductBatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload>
          }
          createMany: {
            args: Prisma.ProductBatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductBatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload>[]
          }
          delete: {
            args: Prisma.ProductBatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload>
          }
          update: {
            args: Prisma.ProductBatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload>
          }
          deleteMany: {
            args: Prisma.ProductBatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductBatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductBatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductBatchPayload>
          }
          aggregate: {
            args: Prisma.ProductBatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductBatch>
          }
          groupBy: {
            args: Prisma.ProductBatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductBatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductBatchCountArgs<ExtArgs>
            result: $Utils.Optional<ProductBatchCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    Sales: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Sales?: boolean | UserCountOutputTypeCountSalesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    SaleItems: number
    StockMovements: number
    PurchaseOrderItems: number
    Batches: number
    POSItemMappings: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    SaleItems?: boolean | ProductCountOutputTypeCountSaleItemsArgs
    StockMovements?: boolean | ProductCountOutputTypeCountStockMovementsArgs
    PurchaseOrderItems?: boolean | ProductCountOutputTypeCountPurchaseOrderItemsArgs
    Batches?: boolean | ProductCountOutputTypeCountBatchesArgs
    POSItemMappings?: boolean | ProductCountOutputTypeCountPOSItemMappingsArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountSaleItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountStockMovementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountPurchaseOrderItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountBatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductBatchWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountPOSItemMappingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: POSItemMappingWhereInput
  }


  /**
   * Count Type SaleCountOutputType
   */

  export type SaleCountOutputType = {
    items: number
  }

  export type SaleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | SaleCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * SaleCountOutputType without action
   */
  export type SaleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleCountOutputType
     */
    select?: SaleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SaleCountOutputType without action
   */
  export type SaleCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleItemWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    Sales: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Sales?: boolean | CustomerCountOutputTypeCountSalesArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
  }


  /**
   * Count Type VendorCountOutputType
   */

  export type VendorCountOutputType = {
    PurchaseOrders: number
  }

  export type VendorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    PurchaseOrders?: boolean | VendorCountOutputTypeCountPurchaseOrdersArgs
  }

  // Custom InputTypes
  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorCountOutputType
     */
    select?: VendorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountPurchaseOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderWhereInput
  }


  /**
   * Count Type PurchaseOrderCountOutputType
   */

  export type PurchaseOrderCountOutputType = {
    items: number
  }

  export type PurchaseOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | PurchaseOrderCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * PurchaseOrderCountOutputType without action
   */
  export type PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderCountOutputType
     */
    select?: PurchaseOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PurchaseOrderCountOutputType without action
   */
  export type PurchaseOrderCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderItemWhereInput
  }


  /**
   * Count Type ReconciliationCountOutputType
   */

  export type ReconciliationCountOutputType = {
    adjustments: number
  }

  export type ReconciliationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    adjustments?: boolean | ReconciliationCountOutputTypeCountAdjustmentsArgs
  }

  // Custom InputTypes
  /**
   * ReconciliationCountOutputType without action
   */
  export type ReconciliationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationCountOutputType
     */
    select?: ReconciliationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReconciliationCountOutputType without action
   */
  export type ReconciliationCountOutputTypeCountAdjustmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    name: string | null
    role: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    role: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    name: string | null
    role: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Sales?: boolean | User$SalesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Sales?: boolean | User$SalesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      Sales: Prisma.$SalePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      name: string | null
      role: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Sales<T extends User$SalesArgs<ExtArgs> = {}>(args?: Subset<T, User$SalesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.Sales
   */
  export type User$SalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    cursor?: SaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    price: Decimal | null
    costPrice: Decimal | null
    stock: number | null
    reorderLevel: number | null
  }

  export type ProductSumAggregateOutputType = {
    price: Decimal | null
    costPrice: Decimal | null
    stock: number | null
    reorderLevel: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    name: string | null
    sku: string | null
    category: string | null
    description: string | null
    price: Decimal | null
    costPrice: Decimal | null
    stock: number | null
    reorderLevel: number | null
    imageUrl: string | null
    barcode: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    name: string | null
    sku: string | null
    category: string | null
    description: string | null
    price: Decimal | null
    costPrice: Decimal | null
    stock: number | null
    reorderLevel: number | null
    imageUrl: string | null
    barcode: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    sku: number
    category: number
    description: number
    price: number
    costPrice: number
    stock: number
    reorderLevel: number
    imageUrl: number
    barcode: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    price?: true
    costPrice?: true
    stock?: true
    reorderLevel?: true
  }

  export type ProductSumAggregateInputType = {
    price?: true
    costPrice?: true
    stock?: true
    reorderLevel?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    sku?: true
    category?: true
    description?: true
    price?: true
    costPrice?: true
    stock?: true
    reorderLevel?: true
    imageUrl?: true
    barcode?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    sku?: true
    category?: true
    description?: true
    price?: true
    costPrice?: true
    stock?: true
    reorderLevel?: true
    imageUrl?: true
    barcode?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    sku?: true
    category?: true
    description?: true
    price?: true
    costPrice?: true
    stock?: true
    reorderLevel?: true
    imageUrl?: true
    barcode?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    name: string
    sku: string
    category: string | null
    description: string | null
    price: Decimal
    costPrice: Decimal
    stock: number
    reorderLevel: number
    imageUrl: string | null
    barcode: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    price?: boolean
    costPrice?: boolean
    stock?: boolean
    reorderLevel?: boolean
    imageUrl?: boolean
    barcode?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    SaleItems?: boolean | Product$SaleItemsArgs<ExtArgs>
    StockMovements?: boolean | Product$StockMovementsArgs<ExtArgs>
    PurchaseOrderItems?: boolean | Product$PurchaseOrderItemsArgs<ExtArgs>
    Batches?: boolean | Product$BatchesArgs<ExtArgs>
    POSItemMappings?: boolean | Product$POSItemMappingsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    price?: boolean
    costPrice?: boolean
    stock?: boolean
    reorderLevel?: boolean
    imageUrl?: boolean
    barcode?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    name?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    price?: boolean
    costPrice?: boolean
    stock?: boolean
    reorderLevel?: boolean
    imageUrl?: boolean
    barcode?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    SaleItems?: boolean | Product$SaleItemsArgs<ExtArgs>
    StockMovements?: boolean | Product$StockMovementsArgs<ExtArgs>
    PurchaseOrderItems?: boolean | Product$PurchaseOrderItemsArgs<ExtArgs>
    Batches?: boolean | Product$BatchesArgs<ExtArgs>
    POSItemMappings?: boolean | Product$POSItemMappingsArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      SaleItems: Prisma.$SaleItemPayload<ExtArgs>[]
      StockMovements: Prisma.$StockMovementPayload<ExtArgs>[]
      PurchaseOrderItems: Prisma.$PurchaseOrderItemPayload<ExtArgs>[]
      Batches: Prisma.$ProductBatchPayload<ExtArgs>[]
      POSItemMappings: Prisma.$POSItemMappingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      sku: string
      category: string | null
      description: string | null
      price: Prisma.Decimal
      costPrice: Prisma.Decimal
      stock: number
      reorderLevel: number
      imageUrl: string | null
      barcode: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    SaleItems<T extends Product$SaleItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$SaleItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findMany"> | Null>
    StockMovements<T extends Product$StockMovementsArgs<ExtArgs> = {}>(args?: Subset<T, Product$StockMovementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany"> | Null>
    PurchaseOrderItems<T extends Product$PurchaseOrderItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$PurchaseOrderItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findMany"> | Null>
    Batches<T extends Product$BatchesArgs<ExtArgs> = {}>(args?: Subset<T, Product$BatchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "findMany"> | Null>
    POSItemMappings<T extends Product$POSItemMappingsArgs<ExtArgs> = {}>(args?: Subset<T, Product$POSItemMappingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */ 
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly sku: FieldRef<"Product", 'String'>
    readonly category: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly price: FieldRef<"Product", 'Decimal'>
    readonly costPrice: FieldRef<"Product", 'Decimal'>
    readonly stock: FieldRef<"Product", 'Int'>
    readonly reorderLevel: FieldRef<"Product", 'Int'>
    readonly imageUrl: FieldRef<"Product", 'String'>
    readonly barcode: FieldRef<"Product", 'String'>
    readonly isActive: FieldRef<"Product", 'Boolean'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
  }

  /**
   * Product.SaleItems
   */
  export type Product$SaleItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    where?: SaleItemWhereInput
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    cursor?: SaleItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * Product.StockMovements
   */
  export type Product$StockMovementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    cursor?: StockMovementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * Product.PurchaseOrderItems
   */
  export type Product$PurchaseOrderItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    where?: PurchaseOrderItemWhereInput
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    cursor?: PurchaseOrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * Product.Batches
   */
  export type Product$BatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    where?: ProductBatchWhereInput
    orderBy?: ProductBatchOrderByWithRelationInput | ProductBatchOrderByWithRelationInput[]
    cursor?: ProductBatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductBatchScalarFieldEnum | ProductBatchScalarFieldEnum[]
  }

  /**
   * Product.POSItemMappings
   */
  export type Product$POSItemMappingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    where?: POSItemMappingWhereInput
    orderBy?: POSItemMappingOrderByWithRelationInput | POSItemMappingOrderByWithRelationInput[]
    cursor?: POSItemMappingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: POSItemMappingScalarFieldEnum | POSItemMappingScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model Sale
   */

  export type AggregateSale = {
    _count: SaleCountAggregateOutputType | null
    _avg: SaleAvgAggregateOutputType | null
    _sum: SaleSumAggregateOutputType | null
    _min: SaleMinAggregateOutputType | null
    _max: SaleMaxAggregateOutputType | null
  }

  export type SaleAvgAggregateOutputType = {
    subtotal: Decimal | null
    tax: Decimal | null
    discount: Decimal | null
    total: Decimal | null
  }

  export type SaleSumAggregateOutputType = {
    subtotal: Decimal | null
    tax: Decimal | null
    discount: Decimal | null
    total: Decimal | null
  }

  export type SaleMinAggregateOutputType = {
    id: string | null
    saleNumber: string | null
    subtotal: Decimal | null
    tax: Decimal | null
    discount: Decimal | null
    total: Decimal | null
    status: string | null
    createdAt: Date | null
    userId: string | null
    customerId: string | null
  }

  export type SaleMaxAggregateOutputType = {
    id: string | null
    saleNumber: string | null
    subtotal: Decimal | null
    tax: Decimal | null
    discount: Decimal | null
    total: Decimal | null
    status: string | null
    createdAt: Date | null
    userId: string | null
    customerId: string | null
  }

  export type SaleCountAggregateOutputType = {
    id: number
    saleNumber: number
    subtotal: number
    tax: number
    discount: number
    total: number
    status: number
    createdAt: number
    userId: number
    customerId: number
    _all: number
  }


  export type SaleAvgAggregateInputType = {
    subtotal?: true
    tax?: true
    discount?: true
    total?: true
  }

  export type SaleSumAggregateInputType = {
    subtotal?: true
    tax?: true
    discount?: true
    total?: true
  }

  export type SaleMinAggregateInputType = {
    id?: true
    saleNumber?: true
    subtotal?: true
    tax?: true
    discount?: true
    total?: true
    status?: true
    createdAt?: true
    userId?: true
    customerId?: true
  }

  export type SaleMaxAggregateInputType = {
    id?: true
    saleNumber?: true
    subtotal?: true
    tax?: true
    discount?: true
    total?: true
    status?: true
    createdAt?: true
    userId?: true
    customerId?: true
  }

  export type SaleCountAggregateInputType = {
    id?: true
    saleNumber?: true
    subtotal?: true
    tax?: true
    discount?: true
    total?: true
    status?: true
    createdAt?: true
    userId?: true
    customerId?: true
    _all?: true
  }

  export type SaleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sale to aggregate.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sales
    **/
    _count?: true | SaleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SaleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SaleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SaleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SaleMaxAggregateInputType
  }

  export type GetSaleAggregateType<T extends SaleAggregateArgs> = {
        [P in keyof T & keyof AggregateSale]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSale[P]>
      : GetScalarType<T[P], AggregateSale[P]>
  }




  export type SaleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithAggregationInput | SaleOrderByWithAggregationInput[]
    by: SaleScalarFieldEnum[] | SaleScalarFieldEnum
    having?: SaleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SaleCountAggregateInputType | true
    _avg?: SaleAvgAggregateInputType
    _sum?: SaleSumAggregateInputType
    _min?: SaleMinAggregateInputType
    _max?: SaleMaxAggregateInputType
  }

  export type SaleGroupByOutputType = {
    id: string
    saleNumber: string
    subtotal: Decimal
    tax: Decimal
    discount: Decimal
    total: Decimal
    status: string
    createdAt: Date
    userId: string
    customerId: string | null
    _count: SaleCountAggregateOutputType | null
    _avg: SaleAvgAggregateOutputType | null
    _sum: SaleSumAggregateOutputType | null
    _min: SaleMinAggregateOutputType | null
    _max: SaleMaxAggregateOutputType | null
  }

  type GetSaleGroupByPayload<T extends SaleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SaleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SaleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SaleGroupByOutputType[P]>
            : GetScalarType<T[P], SaleGroupByOutputType[P]>
        }
      >
    >


  export type SaleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleNumber?: boolean
    subtotal?: boolean
    tax?: boolean
    discount?: boolean
    total?: boolean
    status?: boolean
    createdAt?: boolean
    userId?: boolean
    customerId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    customer?: boolean | Sale$customerArgs<ExtArgs>
    items?: boolean | Sale$itemsArgs<ExtArgs>
    Invoice?: boolean | Sale$InvoiceArgs<ExtArgs>
    _count?: boolean | SaleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sale"]>

  export type SaleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleNumber?: boolean
    subtotal?: boolean
    tax?: boolean
    discount?: boolean
    total?: boolean
    status?: boolean
    createdAt?: boolean
    userId?: boolean
    customerId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    customer?: boolean | Sale$customerArgs<ExtArgs>
  }, ExtArgs["result"]["sale"]>

  export type SaleSelectScalar = {
    id?: boolean
    saleNumber?: boolean
    subtotal?: boolean
    tax?: boolean
    discount?: boolean
    total?: boolean
    status?: boolean
    createdAt?: boolean
    userId?: boolean
    customerId?: boolean
  }

  export type SaleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    customer?: boolean | Sale$customerArgs<ExtArgs>
    items?: boolean | Sale$itemsArgs<ExtArgs>
    Invoice?: boolean | Sale$InvoiceArgs<ExtArgs>
    _count?: boolean | SaleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SaleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    customer?: boolean | Sale$customerArgs<ExtArgs>
  }

  export type $SalePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sale"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      customer: Prisma.$CustomerPayload<ExtArgs> | null
      items: Prisma.$SaleItemPayload<ExtArgs>[]
      Invoice: Prisma.$InvoicePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      saleNumber: string
      subtotal: Prisma.Decimal
      tax: Prisma.Decimal
      discount: Prisma.Decimal
      total: Prisma.Decimal
      status: string
      createdAt: Date
      userId: string
      customerId: string | null
    }, ExtArgs["result"]["sale"]>
    composites: {}
  }

  type SaleGetPayload<S extends boolean | null | undefined | SaleDefaultArgs> = $Result.GetResult<Prisma.$SalePayload, S>

  type SaleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SaleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SaleCountAggregateInputType | true
    }

  export interface SaleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sale'], meta: { name: 'Sale' } }
    /**
     * Find zero or one Sale that matches the filter.
     * @param {SaleFindUniqueArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SaleFindUniqueArgs>(args: SelectSubset<T, SaleFindUniqueArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Sale that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SaleFindUniqueOrThrowArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SaleFindUniqueOrThrowArgs>(args: SelectSubset<T, SaleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Sale that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindFirstArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SaleFindFirstArgs>(args?: SelectSubset<T, SaleFindFirstArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Sale that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindFirstOrThrowArgs} args - Arguments to find a Sale
     * @example
     * // Get one Sale
     * const sale = await prisma.sale.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SaleFindFirstOrThrowArgs>(args?: SelectSubset<T, SaleFindFirstOrThrowArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sales that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sales
     * const sales = await prisma.sale.findMany()
     * 
     * // Get first 10 Sales
     * const sales = await prisma.sale.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saleWithIdOnly = await prisma.sale.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SaleFindManyArgs>(args?: SelectSubset<T, SaleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Sale.
     * @param {SaleCreateArgs} args - Arguments to create a Sale.
     * @example
     * // Create one Sale
     * const Sale = await prisma.sale.create({
     *   data: {
     *     // ... data to create a Sale
     *   }
     * })
     * 
     */
    create<T extends SaleCreateArgs>(args: SelectSubset<T, SaleCreateArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sales.
     * @param {SaleCreateManyArgs} args - Arguments to create many Sales.
     * @example
     * // Create many Sales
     * const sale = await prisma.sale.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SaleCreateManyArgs>(args?: SelectSubset<T, SaleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sales and returns the data saved in the database.
     * @param {SaleCreateManyAndReturnArgs} args - Arguments to create many Sales.
     * @example
     * // Create many Sales
     * const sale = await prisma.sale.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sales and only return the `id`
     * const saleWithIdOnly = await prisma.sale.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SaleCreateManyAndReturnArgs>(args?: SelectSubset<T, SaleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Sale.
     * @param {SaleDeleteArgs} args - Arguments to delete one Sale.
     * @example
     * // Delete one Sale
     * const Sale = await prisma.sale.delete({
     *   where: {
     *     // ... filter to delete one Sale
     *   }
     * })
     * 
     */
    delete<T extends SaleDeleteArgs>(args: SelectSubset<T, SaleDeleteArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Sale.
     * @param {SaleUpdateArgs} args - Arguments to update one Sale.
     * @example
     * // Update one Sale
     * const sale = await prisma.sale.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SaleUpdateArgs>(args: SelectSubset<T, SaleUpdateArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sales.
     * @param {SaleDeleteManyArgs} args - Arguments to filter Sales to delete.
     * @example
     * // Delete a few Sales
     * const { count } = await prisma.sale.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SaleDeleteManyArgs>(args?: SelectSubset<T, SaleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sales
     * const sale = await prisma.sale.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SaleUpdateManyArgs>(args: SelectSubset<T, SaleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Sale.
     * @param {SaleUpsertArgs} args - Arguments to update or create a Sale.
     * @example
     * // Update or create a Sale
     * const sale = await prisma.sale.upsert({
     *   create: {
     *     // ... data to create a Sale
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sale we want to update
     *   }
     * })
     */
    upsert<T extends SaleUpsertArgs>(args: SelectSubset<T, SaleUpsertArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleCountArgs} args - Arguments to filter Sales to count.
     * @example
     * // Count the number of Sales
     * const count = await prisma.sale.count({
     *   where: {
     *     // ... the filter for the Sales we want to count
     *   }
     * })
    **/
    count<T extends SaleCountArgs>(
      args?: Subset<T, SaleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SaleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SaleAggregateArgs>(args: Subset<T, SaleAggregateArgs>): Prisma.PrismaPromise<GetSaleAggregateType<T>>

    /**
     * Group by Sale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SaleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SaleGroupByArgs['orderBy'] }
        : { orderBy?: SaleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SaleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sale model
   */
  readonly fields: SaleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sale.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SaleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    customer<T extends Sale$customerArgs<ExtArgs> = {}>(args?: Subset<T, Sale$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    items<T extends Sale$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Sale$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findMany"> | Null>
    Invoice<T extends Sale$InvoiceArgs<ExtArgs> = {}>(args?: Subset<T, Sale$InvoiceArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sale model
   */ 
  interface SaleFieldRefs {
    readonly id: FieldRef<"Sale", 'String'>
    readonly saleNumber: FieldRef<"Sale", 'String'>
    readonly subtotal: FieldRef<"Sale", 'Decimal'>
    readonly tax: FieldRef<"Sale", 'Decimal'>
    readonly discount: FieldRef<"Sale", 'Decimal'>
    readonly total: FieldRef<"Sale", 'Decimal'>
    readonly status: FieldRef<"Sale", 'String'>
    readonly createdAt: FieldRef<"Sale", 'DateTime'>
    readonly userId: FieldRef<"Sale", 'String'>
    readonly customerId: FieldRef<"Sale", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Sale findUnique
   */
  export type SaleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale findUniqueOrThrow
   */
  export type SaleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale findFirst
   */
  export type SaleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sales.
     */
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale findFirstOrThrow
   */
  export type SaleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sale to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sales.
     */
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale findMany
   */
  export type SaleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter, which Sales to fetch.
     */
    where?: SaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sales to fetch.
     */
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sales.
     */
    cursor?: SaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sales.
     */
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Sale create
   */
  export type SaleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The data needed to create a Sale.
     */
    data: XOR<SaleCreateInput, SaleUncheckedCreateInput>
  }

  /**
   * Sale createMany
   */
  export type SaleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sales.
     */
    data: SaleCreateManyInput | SaleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sale createManyAndReturn
   */
  export type SaleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Sales.
     */
    data: SaleCreateManyInput | SaleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sale update
   */
  export type SaleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The data needed to update a Sale.
     */
    data: XOR<SaleUpdateInput, SaleUncheckedUpdateInput>
    /**
     * Choose, which Sale to update.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale updateMany
   */
  export type SaleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sales.
     */
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyInput>
    /**
     * Filter which Sales to update
     */
    where?: SaleWhereInput
  }

  /**
   * Sale upsert
   */
  export type SaleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * The filter to search for the Sale to update in case it exists.
     */
    where: SaleWhereUniqueInput
    /**
     * In case the Sale found by the `where` argument doesn't exist, create a new Sale with this data.
     */
    create: XOR<SaleCreateInput, SaleUncheckedCreateInput>
    /**
     * In case the Sale was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SaleUpdateInput, SaleUncheckedUpdateInput>
  }

  /**
   * Sale delete
   */
  export type SaleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    /**
     * Filter which Sale to delete.
     */
    where: SaleWhereUniqueInput
  }

  /**
   * Sale deleteMany
   */
  export type SaleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sales to delete
     */
    where?: SaleWhereInput
  }

  /**
   * Sale.customer
   */
  export type Sale$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Sale.items
   */
  export type Sale$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    where?: SaleItemWhereInput
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    cursor?: SaleItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * Sale.Invoice
   */
  export type Sale$InvoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
  }

  /**
   * Sale without action
   */
  export type SaleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
  }


  /**
   * Model SaleItem
   */

  export type AggregateSaleItem = {
    _count: SaleItemCountAggregateOutputType | null
    _avg: SaleItemAvgAggregateOutputType | null
    _sum: SaleItemSumAggregateOutputType | null
    _min: SaleItemMinAggregateOutputType | null
    _max: SaleItemMaxAggregateOutputType | null
  }

  export type SaleItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: Decimal | null
    subtotal: Decimal | null
  }

  export type SaleItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: Decimal | null
    subtotal: Decimal | null
  }

  export type SaleItemMinAggregateOutputType = {
    id: string | null
    saleId: string | null
    productId: string | null
    quantity: number | null
    unitPrice: Decimal | null
    subtotal: Decimal | null
  }

  export type SaleItemMaxAggregateOutputType = {
    id: string | null
    saleId: string | null
    productId: string | null
    quantity: number | null
    unitPrice: Decimal | null
    subtotal: Decimal | null
  }

  export type SaleItemCountAggregateOutputType = {
    id: number
    saleId: number
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
    _all: number
  }


  export type SaleItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    subtotal?: true
  }

  export type SaleItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    subtotal?: true
  }

  export type SaleItemMinAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    subtotal?: true
  }

  export type SaleItemMaxAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    subtotal?: true
  }

  export type SaleItemCountAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    quantity?: true
    unitPrice?: true
    subtotal?: true
    _all?: true
  }

  export type SaleItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SaleItem to aggregate.
     */
    where?: SaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaleItems to fetch.
     */
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SaleItems
    **/
    _count?: true | SaleItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SaleItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SaleItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SaleItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SaleItemMaxAggregateInputType
  }

  export type GetSaleItemAggregateType<T extends SaleItemAggregateArgs> = {
        [P in keyof T & keyof AggregateSaleItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSaleItem[P]>
      : GetScalarType<T[P], AggregateSaleItem[P]>
  }




  export type SaleItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaleItemWhereInput
    orderBy?: SaleItemOrderByWithAggregationInput | SaleItemOrderByWithAggregationInput[]
    by: SaleItemScalarFieldEnum[] | SaleItemScalarFieldEnum
    having?: SaleItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SaleItemCountAggregateInputType | true
    _avg?: SaleItemAvgAggregateInputType
    _sum?: SaleItemSumAggregateInputType
    _min?: SaleItemMinAggregateInputType
    _max?: SaleItemMaxAggregateInputType
  }

  export type SaleItemGroupByOutputType = {
    id: string
    saleId: string
    productId: string
    quantity: number
    unitPrice: Decimal
    subtotal: Decimal
    _count: SaleItemCountAggregateOutputType | null
    _avg: SaleItemAvgAggregateOutputType | null
    _sum: SaleItemSumAggregateOutputType | null
    _min: SaleItemMinAggregateOutputType | null
    _max: SaleItemMaxAggregateOutputType | null
  }

  type GetSaleItemGroupByPayload<T extends SaleItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SaleItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SaleItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SaleItemGroupByOutputType[P]>
            : GetScalarType<T[P], SaleItemGroupByOutputType[P]>
        }
      >
    >


  export type SaleItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    subtotal?: boolean
    sale?: boolean | SaleDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["saleItem"]>

  export type SaleItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    subtotal?: boolean
    sale?: boolean | SaleDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["saleItem"]>

  export type SaleItemSelectScalar = {
    id?: boolean
    saleId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPrice?: boolean
    subtotal?: boolean
  }

  export type SaleItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | SaleDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type SaleItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | SaleDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $SaleItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SaleItem"
    objects: {
      sale: Prisma.$SalePayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      saleId: string
      productId: string
      quantity: number
      unitPrice: Prisma.Decimal
      subtotal: Prisma.Decimal
    }, ExtArgs["result"]["saleItem"]>
    composites: {}
  }

  type SaleItemGetPayload<S extends boolean | null | undefined | SaleItemDefaultArgs> = $Result.GetResult<Prisma.$SaleItemPayload, S>

  type SaleItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SaleItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SaleItemCountAggregateInputType | true
    }

  export interface SaleItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SaleItem'], meta: { name: 'SaleItem' } }
    /**
     * Find zero or one SaleItem that matches the filter.
     * @param {SaleItemFindUniqueArgs} args - Arguments to find a SaleItem
     * @example
     * // Get one SaleItem
     * const saleItem = await prisma.saleItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SaleItemFindUniqueArgs>(args: SelectSubset<T, SaleItemFindUniqueArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SaleItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SaleItemFindUniqueOrThrowArgs} args - Arguments to find a SaleItem
     * @example
     * // Get one SaleItem
     * const saleItem = await prisma.saleItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SaleItemFindUniqueOrThrowArgs>(args: SelectSubset<T, SaleItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SaleItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemFindFirstArgs} args - Arguments to find a SaleItem
     * @example
     * // Get one SaleItem
     * const saleItem = await prisma.saleItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SaleItemFindFirstArgs>(args?: SelectSubset<T, SaleItemFindFirstArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SaleItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemFindFirstOrThrowArgs} args - Arguments to find a SaleItem
     * @example
     * // Get one SaleItem
     * const saleItem = await prisma.saleItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SaleItemFindFirstOrThrowArgs>(args?: SelectSubset<T, SaleItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SaleItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SaleItems
     * const saleItems = await prisma.saleItem.findMany()
     * 
     * // Get first 10 SaleItems
     * const saleItems = await prisma.saleItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saleItemWithIdOnly = await prisma.saleItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SaleItemFindManyArgs>(args?: SelectSubset<T, SaleItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SaleItem.
     * @param {SaleItemCreateArgs} args - Arguments to create a SaleItem.
     * @example
     * // Create one SaleItem
     * const SaleItem = await prisma.saleItem.create({
     *   data: {
     *     // ... data to create a SaleItem
     *   }
     * })
     * 
     */
    create<T extends SaleItemCreateArgs>(args: SelectSubset<T, SaleItemCreateArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SaleItems.
     * @param {SaleItemCreateManyArgs} args - Arguments to create many SaleItems.
     * @example
     * // Create many SaleItems
     * const saleItem = await prisma.saleItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SaleItemCreateManyArgs>(args?: SelectSubset<T, SaleItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SaleItems and returns the data saved in the database.
     * @param {SaleItemCreateManyAndReturnArgs} args - Arguments to create many SaleItems.
     * @example
     * // Create many SaleItems
     * const saleItem = await prisma.saleItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SaleItems and only return the `id`
     * const saleItemWithIdOnly = await prisma.saleItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SaleItemCreateManyAndReturnArgs>(args?: SelectSubset<T, SaleItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SaleItem.
     * @param {SaleItemDeleteArgs} args - Arguments to delete one SaleItem.
     * @example
     * // Delete one SaleItem
     * const SaleItem = await prisma.saleItem.delete({
     *   where: {
     *     // ... filter to delete one SaleItem
     *   }
     * })
     * 
     */
    delete<T extends SaleItemDeleteArgs>(args: SelectSubset<T, SaleItemDeleteArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SaleItem.
     * @param {SaleItemUpdateArgs} args - Arguments to update one SaleItem.
     * @example
     * // Update one SaleItem
     * const saleItem = await prisma.saleItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SaleItemUpdateArgs>(args: SelectSubset<T, SaleItemUpdateArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SaleItems.
     * @param {SaleItemDeleteManyArgs} args - Arguments to filter SaleItems to delete.
     * @example
     * // Delete a few SaleItems
     * const { count } = await prisma.saleItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SaleItemDeleteManyArgs>(args?: SelectSubset<T, SaleItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SaleItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SaleItems
     * const saleItem = await prisma.saleItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SaleItemUpdateManyArgs>(args: SelectSubset<T, SaleItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SaleItem.
     * @param {SaleItemUpsertArgs} args - Arguments to update or create a SaleItem.
     * @example
     * // Update or create a SaleItem
     * const saleItem = await prisma.saleItem.upsert({
     *   create: {
     *     // ... data to create a SaleItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SaleItem we want to update
     *   }
     * })
     */
    upsert<T extends SaleItemUpsertArgs>(args: SelectSubset<T, SaleItemUpsertArgs<ExtArgs>>): Prisma__SaleItemClient<$Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SaleItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemCountArgs} args - Arguments to filter SaleItems to count.
     * @example
     * // Count the number of SaleItems
     * const count = await prisma.saleItem.count({
     *   where: {
     *     // ... the filter for the SaleItems we want to count
     *   }
     * })
    **/
    count<T extends SaleItemCountArgs>(
      args?: Subset<T, SaleItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SaleItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SaleItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SaleItemAggregateArgs>(args: Subset<T, SaleItemAggregateArgs>): Prisma.PrismaPromise<GetSaleItemAggregateType<T>>

    /**
     * Group by SaleItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaleItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SaleItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SaleItemGroupByArgs['orderBy'] }
        : { orderBy?: SaleItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SaleItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SaleItem model
   */
  readonly fields: SaleItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SaleItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SaleItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends SaleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SaleDefaultArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SaleItem model
   */ 
  interface SaleItemFieldRefs {
    readonly id: FieldRef<"SaleItem", 'String'>
    readonly saleId: FieldRef<"SaleItem", 'String'>
    readonly productId: FieldRef<"SaleItem", 'String'>
    readonly quantity: FieldRef<"SaleItem", 'Int'>
    readonly unitPrice: FieldRef<"SaleItem", 'Decimal'>
    readonly subtotal: FieldRef<"SaleItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * SaleItem findUnique
   */
  export type SaleItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItem to fetch.
     */
    where: SaleItemWhereUniqueInput
  }

  /**
   * SaleItem findUniqueOrThrow
   */
  export type SaleItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItem to fetch.
     */
    where: SaleItemWhereUniqueInput
  }

  /**
   * SaleItem findFirst
   */
  export type SaleItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItem to fetch.
     */
    where?: SaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaleItems to fetch.
     */
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SaleItems.
     */
    cursor?: SaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SaleItems.
     */
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * SaleItem findFirstOrThrow
   */
  export type SaleItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItem to fetch.
     */
    where?: SaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaleItems to fetch.
     */
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SaleItems.
     */
    cursor?: SaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SaleItems.
     */
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * SaleItem findMany
   */
  export type SaleItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter, which SaleItems to fetch.
     */
    where?: SaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaleItems to fetch.
     */
    orderBy?: SaleItemOrderByWithRelationInput | SaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SaleItems.
     */
    cursor?: SaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaleItems.
     */
    skip?: number
    distinct?: SaleItemScalarFieldEnum | SaleItemScalarFieldEnum[]
  }

  /**
   * SaleItem create
   */
  export type SaleItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * The data needed to create a SaleItem.
     */
    data: XOR<SaleItemCreateInput, SaleItemUncheckedCreateInput>
  }

  /**
   * SaleItem createMany
   */
  export type SaleItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SaleItems.
     */
    data: SaleItemCreateManyInput | SaleItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SaleItem createManyAndReturn
   */
  export type SaleItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SaleItems.
     */
    data: SaleItemCreateManyInput | SaleItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SaleItem update
   */
  export type SaleItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * The data needed to update a SaleItem.
     */
    data: XOR<SaleItemUpdateInput, SaleItemUncheckedUpdateInput>
    /**
     * Choose, which SaleItem to update.
     */
    where: SaleItemWhereUniqueInput
  }

  /**
   * SaleItem updateMany
   */
  export type SaleItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SaleItems.
     */
    data: XOR<SaleItemUpdateManyMutationInput, SaleItemUncheckedUpdateManyInput>
    /**
     * Filter which SaleItems to update
     */
    where?: SaleItemWhereInput
  }

  /**
   * SaleItem upsert
   */
  export type SaleItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * The filter to search for the SaleItem to update in case it exists.
     */
    where: SaleItemWhereUniqueInput
    /**
     * In case the SaleItem found by the `where` argument doesn't exist, create a new SaleItem with this data.
     */
    create: XOR<SaleItemCreateInput, SaleItemUncheckedCreateInput>
    /**
     * In case the SaleItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SaleItemUpdateInput, SaleItemUncheckedUpdateInput>
  }

  /**
   * SaleItem delete
   */
  export type SaleItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
    /**
     * Filter which SaleItem to delete.
     */
    where: SaleItemWhereUniqueInput
  }

  /**
   * SaleItem deleteMany
   */
  export type SaleItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SaleItems to delete
     */
    where?: SaleItemWhereInput
  }

  /**
   * SaleItem without action
   */
  export type SaleItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaleItem
     */
    select?: SaleItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleItemInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerAvgAggregateOutputType = {
    loyaltyPoints: number | null
  }

  export type CustomerSumAggregateOutputType = {
    loyaltyPoints: number | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    loyaltyPoints: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    loyaltyPoints: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    loyaltyPoints: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerAvgAggregateInputType = {
    loyaltyPoints?: true
  }

  export type CustomerSumAggregateInputType = {
    loyaltyPoints?: true
  }

  export type CustomerMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    loyaltyPoints?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    loyaltyPoints?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    loyaltyPoints?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _avg?: CustomerAvgAggregateInputType
    _sum?: CustomerSumAggregateInputType
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    name: string
    email: string | null
    phone: string | null
    loyaltyPoints: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    loyaltyPoints?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    Sales?: boolean | Customer$SalesArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    loyaltyPoints?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    loyaltyPoints?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Sales?: boolean | Customer$SalesArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      Sales: Prisma.$SalePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string | null
      phone: string | null
      loyaltyPoints: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Sales<T extends Customer$SalesArgs<ExtArgs> = {}>(args?: Subset<T, Customer$SalesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */ 
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly loyaltyPoints: FieldRef<"Customer", 'Int'>
    readonly isActive: FieldRef<"Customer", 'Boolean'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer.Sales
   */
  export type Customer$SalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sale
     */
    select?: SaleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaleInclude<ExtArgs> | null
    where?: SaleWhereInput
    orderBy?: SaleOrderByWithRelationInput | SaleOrderByWithRelationInput[]
    cursor?: SaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaleScalarFieldEnum | SaleScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Vendor
   */

  export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  export type VendorMinAggregateOutputType = {
    id: string | null
    name: string | null
    contactPerson: string | null
    email: string | null
    phone: string | null
    address: string | null
    isActive: boolean | null
  }

  export type VendorMaxAggregateOutputType = {
    id: string | null
    name: string | null
    contactPerson: string | null
    email: string | null
    phone: string | null
    address: string | null
    isActive: boolean | null
  }

  export type VendorCountAggregateOutputType = {
    id: number
    name: number
    contactPerson: number
    email: number
    phone: number
    address: number
    isActive: number
    _all: number
  }


  export type VendorMinAggregateInputType = {
    id?: true
    name?: true
    contactPerson?: true
    email?: true
    phone?: true
    address?: true
    isActive?: true
  }

  export type VendorMaxAggregateInputType = {
    id?: true
    name?: true
    contactPerson?: true
    email?: true
    phone?: true
    address?: true
    isActive?: true
  }

  export type VendorCountAggregateInputType = {
    id?: true
    name?: true
    contactPerson?: true
    email?: true
    phone?: true
    address?: true
    isActive?: true
    _all?: true
  }

  export type VendorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendor to aggregate.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vendors
    **/
    _count?: true | VendorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorMaxAggregateInputType
  }

  export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
        [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendor[P]>
      : GetScalarType<T[P], AggregateVendor[P]>
  }




  export type VendorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorWhereInput
    orderBy?: VendorOrderByWithAggregationInput | VendorOrderByWithAggregationInput[]
    by: VendorScalarFieldEnum[] | VendorScalarFieldEnum
    having?: VendorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorCountAggregateInputType | true
    _min?: VendorMinAggregateInputType
    _max?: VendorMaxAggregateInputType
  }

  export type VendorGroupByOutputType = {
    id: string
    name: string
    contactPerson: string | null
    email: string | null
    phone: string | null
    address: string | null
    isActive: boolean
    _count: VendorCountAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  type GetVendorGroupByPayload<T extends VendorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorGroupByOutputType[P]>
            : GetScalarType<T[P], VendorGroupByOutputType[P]>
        }
      >
    >


  export type VendorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    contactPerson?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    isActive?: boolean
    PurchaseOrders?: boolean | Vendor$PurchaseOrdersArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    contactPerson?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectScalar = {
    id?: boolean
    name?: boolean
    contactPerson?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    isActive?: boolean
  }

  export type VendorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    PurchaseOrders?: boolean | Vendor$PurchaseOrdersArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VendorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VendorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vendor"
    objects: {
      PurchaseOrders: Prisma.$PurchaseOrderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      contactPerson: string | null
      email: string | null
      phone: string | null
      address: string | null
      isActive: boolean
    }, ExtArgs["result"]["vendor"]>
    composites: {}
  }

  type VendorGetPayload<S extends boolean | null | undefined | VendorDefaultArgs> = $Result.GetResult<Prisma.$VendorPayload, S>

  type VendorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VendorCountAggregateInputType | true
    }

  export interface VendorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vendor'], meta: { name: 'Vendor' } }
    /**
     * Find zero or one Vendor that matches the filter.
     * @param {VendorFindUniqueArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorFindUniqueArgs>(args: SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Vendor that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VendorFindUniqueOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Vendor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorFindFirstArgs>(args?: SelectSubset<T, VendorFindFirstArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Vendor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Vendors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vendors
     * const vendors = await prisma.vendor.findMany()
     * 
     * // Get first 10 Vendors
     * const vendors = await prisma.vendor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorWithIdOnly = await prisma.vendor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorFindManyArgs>(args?: SelectSubset<T, VendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Vendor.
     * @param {VendorCreateArgs} args - Arguments to create a Vendor.
     * @example
     * // Create one Vendor
     * const Vendor = await prisma.vendor.create({
     *   data: {
     *     // ... data to create a Vendor
     *   }
     * })
     * 
     */
    create<T extends VendorCreateArgs>(args: SelectSubset<T, VendorCreateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Vendors.
     * @param {VendorCreateManyArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorCreateManyArgs>(args?: SelectSubset<T, VendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vendors and returns the data saved in the database.
     * @param {VendorCreateManyAndReturnArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vendors and only return the `id`
     * const vendorWithIdOnly = await prisma.vendor.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VendorCreateManyAndReturnArgs>(args?: SelectSubset<T, VendorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Vendor.
     * @param {VendorDeleteArgs} args - Arguments to delete one Vendor.
     * @example
     * // Delete one Vendor
     * const Vendor = await prisma.vendor.delete({
     *   where: {
     *     // ... filter to delete one Vendor
     *   }
     * })
     * 
     */
    delete<T extends VendorDeleteArgs>(args: SelectSubset<T, VendorDeleteArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Vendor.
     * @param {VendorUpdateArgs} args - Arguments to update one Vendor.
     * @example
     * // Update one Vendor
     * const vendor = await prisma.vendor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorUpdateArgs>(args: SelectSubset<T, VendorUpdateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Vendors.
     * @param {VendorDeleteManyArgs} args - Arguments to filter Vendors to delete.
     * @example
     * // Delete a few Vendors
     * const { count } = await prisma.vendor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorDeleteManyArgs>(args?: SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorUpdateManyArgs>(args: SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Vendor.
     * @param {VendorUpsertArgs} args - Arguments to update or create a Vendor.
     * @example
     * // Update or create a Vendor
     * const vendor = await prisma.vendor.upsert({
     *   create: {
     *     // ... data to create a Vendor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vendor we want to update
     *   }
     * })
     */
    upsert<T extends VendorUpsertArgs>(args: SelectSubset<T, VendorUpsertArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorCountArgs} args - Arguments to filter Vendors to count.
     * @example
     * // Count the number of Vendors
     * const count = await prisma.vendor.count({
     *   where: {
     *     // ... the filter for the Vendors we want to count
     *   }
     * })
    **/
    count<T extends VendorCountArgs>(
      args?: Subset<T, VendorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VendorAggregateArgs>(args: Subset<T, VendorAggregateArgs>): Prisma.PrismaPromise<GetVendorAggregateType<T>>

    /**
     * Group by Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VendorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorGroupByArgs['orderBy'] }
        : { orderBy?: VendorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vendor model
   */
  readonly fields: VendorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vendor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    PurchaseOrders<T extends Vendor$PurchaseOrdersArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$PurchaseOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vendor model
   */ 
  interface VendorFieldRefs {
    readonly id: FieldRef<"Vendor", 'String'>
    readonly name: FieldRef<"Vendor", 'String'>
    readonly contactPerson: FieldRef<"Vendor", 'String'>
    readonly email: FieldRef<"Vendor", 'String'>
    readonly phone: FieldRef<"Vendor", 'String'>
    readonly address: FieldRef<"Vendor", 'String'>
    readonly isActive: FieldRef<"Vendor", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Vendor findUnique
   */
  export type VendorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findUniqueOrThrow
   */
  export type VendorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findFirst
   */
  export type VendorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findFirstOrThrow
   */
  export type VendorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findMany
   */
  export type VendorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendors to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor create
   */
  export type VendorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to create a Vendor.
     */
    data: XOR<VendorCreateInput, VendorUncheckedCreateInput>
  }

  /**
   * Vendor createMany
   */
  export type VendorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vendor createManyAndReturn
   */
  export type VendorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vendor update
   */
  export type VendorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to update a Vendor.
     */
    data: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
    /**
     * Choose, which Vendor to update.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor updateMany
   */
  export type VendorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput
  }

  /**
   * Vendor upsert
   */
  export type VendorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The filter to search for the Vendor to update in case it exists.
     */
    where: VendorWhereUniqueInput
    /**
     * In case the Vendor found by the `where` argument doesn't exist, create a new Vendor with this data.
     */
    create: XOR<VendorCreateInput, VendorUncheckedCreateInput>
    /**
     * In case the Vendor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
  }

  /**
   * Vendor delete
   */
  export type VendorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter which Vendor to delete.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor deleteMany
   */
  export type VendorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendors to delete
     */
    where?: VendorWhereInput
  }

  /**
   * Vendor.PurchaseOrders
   */
  export type Vendor$PurchaseOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    where?: PurchaseOrderWhereInput
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    cursor?: PurchaseOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * Vendor without action
   */
  export type VendorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseOrder
   */

  export type AggregatePurchaseOrder = {
    _count: PurchaseOrderCountAggregateOutputType | null
    _avg: PurchaseOrderAvgAggregateOutputType | null
    _sum: PurchaseOrderSumAggregateOutputType | null
    _min: PurchaseOrderMinAggregateOutputType | null
    _max: PurchaseOrderMaxAggregateOutputType | null
  }

  export type PurchaseOrderAvgAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type PurchaseOrderSumAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type PurchaseOrderMinAggregateOutputType = {
    id: string | null
    poNumber: string | null
    vendorId: string | null
    status: string | null
    totalAmount: Decimal | null
    orderDate: Date | null
    receivedDate: Date | null
  }

  export type PurchaseOrderMaxAggregateOutputType = {
    id: string | null
    poNumber: string | null
    vendorId: string | null
    status: string | null
    totalAmount: Decimal | null
    orderDate: Date | null
    receivedDate: Date | null
  }

  export type PurchaseOrderCountAggregateOutputType = {
    id: number
    poNumber: number
    vendorId: number
    status: number
    totalAmount: number
    orderDate: number
    receivedDate: number
    _all: number
  }


  export type PurchaseOrderAvgAggregateInputType = {
    totalAmount?: true
  }

  export type PurchaseOrderSumAggregateInputType = {
    totalAmount?: true
  }

  export type PurchaseOrderMinAggregateInputType = {
    id?: true
    poNumber?: true
    vendorId?: true
    status?: true
    totalAmount?: true
    orderDate?: true
    receivedDate?: true
  }

  export type PurchaseOrderMaxAggregateInputType = {
    id?: true
    poNumber?: true
    vendorId?: true
    status?: true
    totalAmount?: true
    orderDate?: true
    receivedDate?: true
  }

  export type PurchaseOrderCountAggregateInputType = {
    id?: true
    poNumber?: true
    vendorId?: true
    status?: true
    totalAmount?: true
    orderDate?: true
    receivedDate?: true
    _all?: true
  }

  export type PurchaseOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrder to aggregate.
     */
    where?: PurchaseOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrders to fetch.
     */
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseOrders
    **/
    _count?: true | PurchaseOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseOrderMaxAggregateInputType
  }

  export type GetPurchaseOrderAggregateType<T extends PurchaseOrderAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseOrder[P]>
      : GetScalarType<T[P], AggregatePurchaseOrder[P]>
  }




  export type PurchaseOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderWhereInput
    orderBy?: PurchaseOrderOrderByWithAggregationInput | PurchaseOrderOrderByWithAggregationInput[]
    by: PurchaseOrderScalarFieldEnum[] | PurchaseOrderScalarFieldEnum
    having?: PurchaseOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseOrderCountAggregateInputType | true
    _avg?: PurchaseOrderAvgAggregateInputType
    _sum?: PurchaseOrderSumAggregateInputType
    _min?: PurchaseOrderMinAggregateInputType
    _max?: PurchaseOrderMaxAggregateInputType
  }

  export type PurchaseOrderGroupByOutputType = {
    id: string
    poNumber: string
    vendorId: string
    status: string
    totalAmount: Decimal
    orderDate: Date
    receivedDate: Date | null
    _count: PurchaseOrderCountAggregateOutputType | null
    _avg: PurchaseOrderAvgAggregateOutputType | null
    _sum: PurchaseOrderSumAggregateOutputType | null
    _min: PurchaseOrderMinAggregateOutputType | null
    _max: PurchaseOrderMaxAggregateOutputType | null
  }

  type GetPurchaseOrderGroupByPayload<T extends PurchaseOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseOrderGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseOrderGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    poNumber?: boolean
    vendorId?: boolean
    status?: boolean
    totalAmount?: boolean
    orderDate?: boolean
    receivedDate?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    items?: boolean | PurchaseOrder$itemsArgs<ExtArgs>
    _count?: boolean | PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseOrder"]>

  export type PurchaseOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    poNumber?: boolean
    vendorId?: boolean
    status?: boolean
    totalAmount?: boolean
    orderDate?: boolean
    receivedDate?: boolean
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseOrder"]>

  export type PurchaseOrderSelectScalar = {
    id?: boolean
    poNumber?: boolean
    vendorId?: boolean
    status?: boolean
    totalAmount?: boolean
    orderDate?: boolean
    receivedDate?: boolean
  }

  export type PurchaseOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    items?: boolean | PurchaseOrder$itemsArgs<ExtArgs>
    _count?: boolean | PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PurchaseOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
  }

  export type $PurchaseOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseOrder"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>
      items: Prisma.$PurchaseOrderItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      poNumber: string
      vendorId: string
      status: string
      totalAmount: Prisma.Decimal
      orderDate: Date
      receivedDate: Date | null
    }, ExtArgs["result"]["purchaseOrder"]>
    composites: {}
  }

  type PurchaseOrderGetPayload<S extends boolean | null | undefined | PurchaseOrderDefaultArgs> = $Result.GetResult<Prisma.$PurchaseOrderPayload, S>

  type PurchaseOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PurchaseOrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PurchaseOrderCountAggregateInputType | true
    }

  export interface PurchaseOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseOrder'], meta: { name: 'PurchaseOrder' } }
    /**
     * Find zero or one PurchaseOrder that matches the filter.
     * @param {PurchaseOrderFindUniqueArgs} args - Arguments to find a PurchaseOrder
     * @example
     * // Get one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseOrderFindUniqueArgs>(args: SelectSubset<T, PurchaseOrderFindUniqueArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PurchaseOrder that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PurchaseOrderFindUniqueOrThrowArgs} args - Arguments to find a PurchaseOrder
     * @example
     * // Get one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PurchaseOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderFindFirstArgs} args - Arguments to find a PurchaseOrder
     * @example
     * // Get one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseOrderFindFirstArgs>(args?: SelectSubset<T, PurchaseOrderFindFirstArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PurchaseOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderFindFirstOrThrowArgs} args - Arguments to find a PurchaseOrder
     * @example
     * // Get one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PurchaseOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseOrders
     * const purchaseOrders = await prisma.purchaseOrder.findMany()
     * 
     * // Get first 10 PurchaseOrders
     * const purchaseOrders = await prisma.purchaseOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseOrderWithIdOnly = await prisma.purchaseOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseOrderFindManyArgs>(args?: SelectSubset<T, PurchaseOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PurchaseOrder.
     * @param {PurchaseOrderCreateArgs} args - Arguments to create a PurchaseOrder.
     * @example
     * // Create one PurchaseOrder
     * const PurchaseOrder = await prisma.purchaseOrder.create({
     *   data: {
     *     // ... data to create a PurchaseOrder
     *   }
     * })
     * 
     */
    create<T extends PurchaseOrderCreateArgs>(args: SelectSubset<T, PurchaseOrderCreateArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PurchaseOrders.
     * @param {PurchaseOrderCreateManyArgs} args - Arguments to create many PurchaseOrders.
     * @example
     * // Create many PurchaseOrders
     * const purchaseOrder = await prisma.purchaseOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseOrderCreateManyArgs>(args?: SelectSubset<T, PurchaseOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PurchaseOrders and returns the data saved in the database.
     * @param {PurchaseOrderCreateManyAndReturnArgs} args - Arguments to create many PurchaseOrders.
     * @example
     * // Create many PurchaseOrders
     * const purchaseOrder = await prisma.purchaseOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PurchaseOrders and only return the `id`
     * const purchaseOrderWithIdOnly = await prisma.purchaseOrder.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PurchaseOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, PurchaseOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PurchaseOrder.
     * @param {PurchaseOrderDeleteArgs} args - Arguments to delete one PurchaseOrder.
     * @example
     * // Delete one PurchaseOrder
     * const PurchaseOrder = await prisma.purchaseOrder.delete({
     *   where: {
     *     // ... filter to delete one PurchaseOrder
     *   }
     * })
     * 
     */
    delete<T extends PurchaseOrderDeleteArgs>(args: SelectSubset<T, PurchaseOrderDeleteArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PurchaseOrder.
     * @param {PurchaseOrderUpdateArgs} args - Arguments to update one PurchaseOrder.
     * @example
     * // Update one PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseOrderUpdateArgs>(args: SelectSubset<T, PurchaseOrderUpdateArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PurchaseOrders.
     * @param {PurchaseOrderDeleteManyArgs} args - Arguments to filter PurchaseOrders to delete.
     * @example
     * // Delete a few PurchaseOrders
     * const { count } = await prisma.purchaseOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseOrderDeleteManyArgs>(args?: SelectSubset<T, PurchaseOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseOrders
     * const purchaseOrder = await prisma.purchaseOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseOrderUpdateManyArgs>(args: SelectSubset<T, PurchaseOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PurchaseOrder.
     * @param {PurchaseOrderUpsertArgs} args - Arguments to update or create a PurchaseOrder.
     * @example
     * // Update or create a PurchaseOrder
     * const purchaseOrder = await prisma.purchaseOrder.upsert({
     *   create: {
     *     // ... data to create a PurchaseOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseOrder we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseOrderUpsertArgs>(args: SelectSubset<T, PurchaseOrderUpsertArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PurchaseOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderCountArgs} args - Arguments to filter PurchaseOrders to count.
     * @example
     * // Count the number of PurchaseOrders
     * const count = await prisma.purchaseOrder.count({
     *   where: {
     *     // ... the filter for the PurchaseOrders we want to count
     *   }
     * })
    **/
    count<T extends PurchaseOrderCountArgs>(
      args?: Subset<T, PurchaseOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseOrderAggregateArgs>(args: Subset<T, PurchaseOrderAggregateArgs>): Prisma.PrismaPromise<GetPurchaseOrderAggregateType<T>>

    /**
     * Group by PurchaseOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseOrderGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseOrder model
   */
  readonly fields: PurchaseOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    items<T extends PurchaseOrder$itemsArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseOrder$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseOrder model
   */ 
  interface PurchaseOrderFieldRefs {
    readonly id: FieldRef<"PurchaseOrder", 'String'>
    readonly poNumber: FieldRef<"PurchaseOrder", 'String'>
    readonly vendorId: FieldRef<"PurchaseOrder", 'String'>
    readonly status: FieldRef<"PurchaseOrder", 'String'>
    readonly totalAmount: FieldRef<"PurchaseOrder", 'Decimal'>
    readonly orderDate: FieldRef<"PurchaseOrder", 'DateTime'>
    readonly receivedDate: FieldRef<"PurchaseOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseOrder findUnique
   */
  export type PurchaseOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrder to fetch.
     */
    where: PurchaseOrderWhereUniqueInput
  }

  /**
   * PurchaseOrder findUniqueOrThrow
   */
  export type PurchaseOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrder to fetch.
     */
    where: PurchaseOrderWhereUniqueInput
  }

  /**
   * PurchaseOrder findFirst
   */
  export type PurchaseOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrder to fetch.
     */
    where?: PurchaseOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrders to fetch.
     */
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrders.
     */
    cursor?: PurchaseOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrders.
     */
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * PurchaseOrder findFirstOrThrow
   */
  export type PurchaseOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrder to fetch.
     */
    where?: PurchaseOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrders to fetch.
     */
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrders.
     */
    cursor?: PurchaseOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrders.
     */
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * PurchaseOrder findMany
   */
  export type PurchaseOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrders to fetch.
     */
    where?: PurchaseOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrders to fetch.
     */
    orderBy?: PurchaseOrderOrderByWithRelationInput | PurchaseOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseOrders.
     */
    cursor?: PurchaseOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrders.
     */
    skip?: number
    distinct?: PurchaseOrderScalarFieldEnum | PurchaseOrderScalarFieldEnum[]
  }

  /**
   * PurchaseOrder create
   */
  export type PurchaseOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a PurchaseOrder.
     */
    data: XOR<PurchaseOrderCreateInput, PurchaseOrderUncheckedCreateInput>
  }

  /**
   * PurchaseOrder createMany
   */
  export type PurchaseOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseOrders.
     */
    data: PurchaseOrderCreateManyInput | PurchaseOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchaseOrder createManyAndReturn
   */
  export type PurchaseOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PurchaseOrders.
     */
    data: PurchaseOrderCreateManyInput | PurchaseOrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PurchaseOrder update
   */
  export type PurchaseOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a PurchaseOrder.
     */
    data: XOR<PurchaseOrderUpdateInput, PurchaseOrderUncheckedUpdateInput>
    /**
     * Choose, which PurchaseOrder to update.
     */
    where: PurchaseOrderWhereUniqueInput
  }

  /**
   * PurchaseOrder updateMany
   */
  export type PurchaseOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseOrders.
     */
    data: XOR<PurchaseOrderUpdateManyMutationInput, PurchaseOrderUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseOrders to update
     */
    where?: PurchaseOrderWhereInput
  }

  /**
   * PurchaseOrder upsert
   */
  export type PurchaseOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the PurchaseOrder to update in case it exists.
     */
    where: PurchaseOrderWhereUniqueInput
    /**
     * In case the PurchaseOrder found by the `where` argument doesn't exist, create a new PurchaseOrder with this data.
     */
    create: XOR<PurchaseOrderCreateInput, PurchaseOrderUncheckedCreateInput>
    /**
     * In case the PurchaseOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseOrderUpdateInput, PurchaseOrderUncheckedUpdateInput>
  }

  /**
   * PurchaseOrder delete
   */
  export type PurchaseOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
    /**
     * Filter which PurchaseOrder to delete.
     */
    where: PurchaseOrderWhereUniqueInput
  }

  /**
   * PurchaseOrder deleteMany
   */
  export type PurchaseOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrders to delete
     */
    where?: PurchaseOrderWhereInput
  }

  /**
   * PurchaseOrder.items
   */
  export type PurchaseOrder$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    where?: PurchaseOrderItemWhereInput
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    cursor?: PurchaseOrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * PurchaseOrder without action
   */
  export type PurchaseOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrder
     */
    select?: PurchaseOrderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseOrderItem
   */

  export type AggregatePurchaseOrderItem = {
    _count: PurchaseOrderItemCountAggregateOutputType | null
    _avg: PurchaseOrderItemAvgAggregateOutputType | null
    _sum: PurchaseOrderItemSumAggregateOutputType | null
    _min: PurchaseOrderItemMinAggregateOutputType | null
    _max: PurchaseOrderItemMaxAggregateOutputType | null
  }

  export type PurchaseOrderItemAvgAggregateOutputType = {
    quantity: number | null
    unitCost: Decimal | null
    totalCost: Decimal | null
  }

  export type PurchaseOrderItemSumAggregateOutputType = {
    quantity: number | null
    unitCost: Decimal | null
    totalCost: Decimal | null
  }

  export type PurchaseOrderItemMinAggregateOutputType = {
    id: string | null
    purchaseOrderId: string | null
    productId: string | null
    quantity: number | null
    unitCost: Decimal | null
    totalCost: Decimal | null
  }

  export type PurchaseOrderItemMaxAggregateOutputType = {
    id: string | null
    purchaseOrderId: string | null
    productId: string | null
    quantity: number | null
    unitCost: Decimal | null
    totalCost: Decimal | null
  }

  export type PurchaseOrderItemCountAggregateOutputType = {
    id: number
    purchaseOrderId: number
    productId: number
    quantity: number
    unitCost: number
    totalCost: number
    _all: number
  }


  export type PurchaseOrderItemAvgAggregateInputType = {
    quantity?: true
    unitCost?: true
    totalCost?: true
  }

  export type PurchaseOrderItemSumAggregateInputType = {
    quantity?: true
    unitCost?: true
    totalCost?: true
  }

  export type PurchaseOrderItemMinAggregateInputType = {
    id?: true
    purchaseOrderId?: true
    productId?: true
    quantity?: true
    unitCost?: true
    totalCost?: true
  }

  export type PurchaseOrderItemMaxAggregateInputType = {
    id?: true
    purchaseOrderId?: true
    productId?: true
    quantity?: true
    unitCost?: true
    totalCost?: true
  }

  export type PurchaseOrderItemCountAggregateInputType = {
    id?: true
    purchaseOrderId?: true
    productId?: true
    quantity?: true
    unitCost?: true
    totalCost?: true
    _all?: true
  }

  export type PurchaseOrderItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrderItem to aggregate.
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderItems to fetch.
     */
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseOrderItems
    **/
    _count?: true | PurchaseOrderItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseOrderItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseOrderItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseOrderItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseOrderItemMaxAggregateInputType
  }

  export type GetPurchaseOrderItemAggregateType<T extends PurchaseOrderItemAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseOrderItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseOrderItem[P]>
      : GetScalarType<T[P], AggregatePurchaseOrderItem[P]>
  }




  export type PurchaseOrderItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderItemWhereInput
    orderBy?: PurchaseOrderItemOrderByWithAggregationInput | PurchaseOrderItemOrderByWithAggregationInput[]
    by: PurchaseOrderItemScalarFieldEnum[] | PurchaseOrderItemScalarFieldEnum
    having?: PurchaseOrderItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseOrderItemCountAggregateInputType | true
    _avg?: PurchaseOrderItemAvgAggregateInputType
    _sum?: PurchaseOrderItemSumAggregateInputType
    _min?: PurchaseOrderItemMinAggregateInputType
    _max?: PurchaseOrderItemMaxAggregateInputType
  }

  export type PurchaseOrderItemGroupByOutputType = {
    id: string
    purchaseOrderId: string
    productId: string
    quantity: number
    unitCost: Decimal
    totalCost: Decimal
    _count: PurchaseOrderItemCountAggregateOutputType | null
    _avg: PurchaseOrderItemAvgAggregateOutputType | null
    _sum: PurchaseOrderItemSumAggregateOutputType | null
    _min: PurchaseOrderItemMinAggregateOutputType | null
    _max: PurchaseOrderItemMaxAggregateOutputType | null
  }

  type GetPurchaseOrderItemGroupByPayload<T extends PurchaseOrderItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseOrderItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseOrderItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseOrderItemGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseOrderItemGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseOrderItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    purchaseOrderId?: boolean
    productId?: boolean
    quantity?: boolean
    unitCost?: boolean
    totalCost?: boolean
    purchaseOrder?: boolean | PurchaseOrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseOrderItem"]>

  export type PurchaseOrderItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    purchaseOrderId?: boolean
    productId?: boolean
    quantity?: boolean
    unitCost?: boolean
    totalCost?: boolean
    purchaseOrder?: boolean | PurchaseOrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseOrderItem"]>

  export type PurchaseOrderItemSelectScalar = {
    id?: boolean
    purchaseOrderId?: boolean
    productId?: boolean
    quantity?: boolean
    unitCost?: boolean
    totalCost?: boolean
  }

  export type PurchaseOrderItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchaseOrder?: boolean | PurchaseOrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type PurchaseOrderItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchaseOrder?: boolean | PurchaseOrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $PurchaseOrderItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseOrderItem"
    objects: {
      purchaseOrder: Prisma.$PurchaseOrderPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      purchaseOrderId: string
      productId: string
      quantity: number
      unitCost: Prisma.Decimal
      totalCost: Prisma.Decimal
    }, ExtArgs["result"]["purchaseOrderItem"]>
    composites: {}
  }

  type PurchaseOrderItemGetPayload<S extends boolean | null | undefined | PurchaseOrderItemDefaultArgs> = $Result.GetResult<Prisma.$PurchaseOrderItemPayload, S>

  type PurchaseOrderItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PurchaseOrderItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PurchaseOrderItemCountAggregateInputType | true
    }

  export interface PurchaseOrderItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseOrderItem'], meta: { name: 'PurchaseOrderItem' } }
    /**
     * Find zero or one PurchaseOrderItem that matches the filter.
     * @param {PurchaseOrderItemFindUniqueArgs} args - Arguments to find a PurchaseOrderItem
     * @example
     * // Get one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseOrderItemFindUniqueArgs>(args: SelectSubset<T, PurchaseOrderItemFindUniqueArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PurchaseOrderItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PurchaseOrderItemFindUniqueOrThrowArgs} args - Arguments to find a PurchaseOrderItem
     * @example
     * // Get one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseOrderItemFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseOrderItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PurchaseOrderItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemFindFirstArgs} args - Arguments to find a PurchaseOrderItem
     * @example
     * // Get one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseOrderItemFindFirstArgs>(args?: SelectSubset<T, PurchaseOrderItemFindFirstArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PurchaseOrderItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemFindFirstOrThrowArgs} args - Arguments to find a PurchaseOrderItem
     * @example
     * // Get one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseOrderItemFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseOrderItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PurchaseOrderItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseOrderItems
     * const purchaseOrderItems = await prisma.purchaseOrderItem.findMany()
     * 
     * // Get first 10 PurchaseOrderItems
     * const purchaseOrderItems = await prisma.purchaseOrderItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseOrderItemWithIdOnly = await prisma.purchaseOrderItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseOrderItemFindManyArgs>(args?: SelectSubset<T, PurchaseOrderItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PurchaseOrderItem.
     * @param {PurchaseOrderItemCreateArgs} args - Arguments to create a PurchaseOrderItem.
     * @example
     * // Create one PurchaseOrderItem
     * const PurchaseOrderItem = await prisma.purchaseOrderItem.create({
     *   data: {
     *     // ... data to create a PurchaseOrderItem
     *   }
     * })
     * 
     */
    create<T extends PurchaseOrderItemCreateArgs>(args: SelectSubset<T, PurchaseOrderItemCreateArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PurchaseOrderItems.
     * @param {PurchaseOrderItemCreateManyArgs} args - Arguments to create many PurchaseOrderItems.
     * @example
     * // Create many PurchaseOrderItems
     * const purchaseOrderItem = await prisma.purchaseOrderItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseOrderItemCreateManyArgs>(args?: SelectSubset<T, PurchaseOrderItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PurchaseOrderItems and returns the data saved in the database.
     * @param {PurchaseOrderItemCreateManyAndReturnArgs} args - Arguments to create many PurchaseOrderItems.
     * @example
     * // Create many PurchaseOrderItems
     * const purchaseOrderItem = await prisma.purchaseOrderItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PurchaseOrderItems and only return the `id`
     * const purchaseOrderItemWithIdOnly = await prisma.purchaseOrderItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PurchaseOrderItemCreateManyAndReturnArgs>(args?: SelectSubset<T, PurchaseOrderItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PurchaseOrderItem.
     * @param {PurchaseOrderItemDeleteArgs} args - Arguments to delete one PurchaseOrderItem.
     * @example
     * // Delete one PurchaseOrderItem
     * const PurchaseOrderItem = await prisma.purchaseOrderItem.delete({
     *   where: {
     *     // ... filter to delete one PurchaseOrderItem
     *   }
     * })
     * 
     */
    delete<T extends PurchaseOrderItemDeleteArgs>(args: SelectSubset<T, PurchaseOrderItemDeleteArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PurchaseOrderItem.
     * @param {PurchaseOrderItemUpdateArgs} args - Arguments to update one PurchaseOrderItem.
     * @example
     * // Update one PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseOrderItemUpdateArgs>(args: SelectSubset<T, PurchaseOrderItemUpdateArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PurchaseOrderItems.
     * @param {PurchaseOrderItemDeleteManyArgs} args - Arguments to filter PurchaseOrderItems to delete.
     * @example
     * // Delete a few PurchaseOrderItems
     * const { count } = await prisma.purchaseOrderItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseOrderItemDeleteManyArgs>(args?: SelectSubset<T, PurchaseOrderItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseOrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseOrderItems
     * const purchaseOrderItem = await prisma.purchaseOrderItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseOrderItemUpdateManyArgs>(args: SelectSubset<T, PurchaseOrderItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PurchaseOrderItem.
     * @param {PurchaseOrderItemUpsertArgs} args - Arguments to update or create a PurchaseOrderItem.
     * @example
     * // Update or create a PurchaseOrderItem
     * const purchaseOrderItem = await prisma.purchaseOrderItem.upsert({
     *   create: {
     *     // ... data to create a PurchaseOrderItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseOrderItem we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseOrderItemUpsertArgs>(args: SelectSubset<T, PurchaseOrderItemUpsertArgs<ExtArgs>>): Prisma__PurchaseOrderItemClient<$Result.GetResult<Prisma.$PurchaseOrderItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PurchaseOrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemCountArgs} args - Arguments to filter PurchaseOrderItems to count.
     * @example
     * // Count the number of PurchaseOrderItems
     * const count = await prisma.purchaseOrderItem.count({
     *   where: {
     *     // ... the filter for the PurchaseOrderItems we want to count
     *   }
     * })
    **/
    count<T extends PurchaseOrderItemCountArgs>(
      args?: Subset<T, PurchaseOrderItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseOrderItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseOrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseOrderItemAggregateArgs>(args: Subset<T, PurchaseOrderItemAggregateArgs>): Prisma.PrismaPromise<GetPurchaseOrderItemAggregateType<T>>

    /**
     * Group by PurchaseOrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseOrderItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseOrderItemGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseOrderItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseOrderItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseOrderItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseOrderItem model
   */
  readonly fields: PurchaseOrderItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseOrderItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseOrderItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    purchaseOrder<T extends PurchaseOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseOrderDefaultArgs<ExtArgs>>): Prisma__PurchaseOrderClient<$Result.GetResult<Prisma.$PurchaseOrderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseOrderItem model
   */ 
  interface PurchaseOrderItemFieldRefs {
    readonly id: FieldRef<"PurchaseOrderItem", 'String'>
    readonly purchaseOrderId: FieldRef<"PurchaseOrderItem", 'String'>
    readonly productId: FieldRef<"PurchaseOrderItem", 'String'>
    readonly quantity: FieldRef<"PurchaseOrderItem", 'Int'>
    readonly unitCost: FieldRef<"PurchaseOrderItem", 'Decimal'>
    readonly totalCost: FieldRef<"PurchaseOrderItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseOrderItem findUnique
   */
  export type PurchaseOrderItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItem to fetch.
     */
    where: PurchaseOrderItemWhereUniqueInput
  }

  /**
   * PurchaseOrderItem findUniqueOrThrow
   */
  export type PurchaseOrderItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItem to fetch.
     */
    where: PurchaseOrderItemWhereUniqueInput
  }

  /**
   * PurchaseOrderItem findFirst
   */
  export type PurchaseOrderItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItem to fetch.
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderItems to fetch.
     */
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrderItems.
     */
    cursor?: PurchaseOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrderItems.
     */
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * PurchaseOrderItem findFirstOrThrow
   */
  export type PurchaseOrderItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItem to fetch.
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderItems to fetch.
     */
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrderItems.
     */
    cursor?: PurchaseOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrderItems.
     */
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * PurchaseOrderItem findMany
   */
  export type PurchaseOrderItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderItems to fetch.
     */
    where?: PurchaseOrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderItems to fetch.
     */
    orderBy?: PurchaseOrderItemOrderByWithRelationInput | PurchaseOrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseOrderItems.
     */
    cursor?: PurchaseOrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderItems.
     */
    skip?: number
    distinct?: PurchaseOrderItemScalarFieldEnum | PurchaseOrderItemScalarFieldEnum[]
  }

  /**
   * PurchaseOrderItem create
   */
  export type PurchaseOrderItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * The data needed to create a PurchaseOrderItem.
     */
    data: XOR<PurchaseOrderItemCreateInput, PurchaseOrderItemUncheckedCreateInput>
  }

  /**
   * PurchaseOrderItem createMany
   */
  export type PurchaseOrderItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseOrderItems.
     */
    data: PurchaseOrderItemCreateManyInput | PurchaseOrderItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchaseOrderItem createManyAndReturn
   */
  export type PurchaseOrderItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PurchaseOrderItems.
     */
    data: PurchaseOrderItemCreateManyInput | PurchaseOrderItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PurchaseOrderItem update
   */
  export type PurchaseOrderItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * The data needed to update a PurchaseOrderItem.
     */
    data: XOR<PurchaseOrderItemUpdateInput, PurchaseOrderItemUncheckedUpdateInput>
    /**
     * Choose, which PurchaseOrderItem to update.
     */
    where: PurchaseOrderItemWhereUniqueInput
  }

  /**
   * PurchaseOrderItem updateMany
   */
  export type PurchaseOrderItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseOrderItems.
     */
    data: XOR<PurchaseOrderItemUpdateManyMutationInput, PurchaseOrderItemUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseOrderItems to update
     */
    where?: PurchaseOrderItemWhereInput
  }

  /**
   * PurchaseOrderItem upsert
   */
  export type PurchaseOrderItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * The filter to search for the PurchaseOrderItem to update in case it exists.
     */
    where: PurchaseOrderItemWhereUniqueInput
    /**
     * In case the PurchaseOrderItem found by the `where` argument doesn't exist, create a new PurchaseOrderItem with this data.
     */
    create: XOR<PurchaseOrderItemCreateInput, PurchaseOrderItemUncheckedCreateInput>
    /**
     * In case the PurchaseOrderItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseOrderItemUpdateInput, PurchaseOrderItemUncheckedUpdateInput>
  }

  /**
   * PurchaseOrderItem delete
   */
  export type PurchaseOrderItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
    /**
     * Filter which PurchaseOrderItem to delete.
     */
    where: PurchaseOrderItemWhereUniqueInput
  }

  /**
   * PurchaseOrderItem deleteMany
   */
  export type PurchaseOrderItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrderItems to delete
     */
    where?: PurchaseOrderItemWhereInput
  }

  /**
   * PurchaseOrderItem without action
   */
  export type PurchaseOrderItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderItem
     */
    select?: PurchaseOrderItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseOrderItemInclude<ExtArgs> | null
  }


  /**
   * Model StockMovement
   */

  export type AggregateStockMovement = {
    _count: StockMovementCountAggregateOutputType | null
    _avg: StockMovementAvgAggregateOutputType | null
    _sum: StockMovementSumAggregateOutputType | null
    _min: StockMovementMinAggregateOutputType | null
    _max: StockMovementMaxAggregateOutputType | null
  }

  export type StockMovementAvgAggregateOutputType = {
    quantity: number | null
  }

  export type StockMovementSumAggregateOutputType = {
    quantity: number | null
  }

  export type StockMovementMinAggregateOutputType = {
    id: string | null
    productId: string | null
    type: string | null
    quantity: number | null
    description: string | null
    createdAt: Date | null
    reconciliationId: string | null
  }

  export type StockMovementMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    type: string | null
    quantity: number | null
    description: string | null
    createdAt: Date | null
    reconciliationId: string | null
  }

  export type StockMovementCountAggregateOutputType = {
    id: number
    productId: number
    type: number
    quantity: number
    description: number
    createdAt: number
    reconciliationId: number
    _all: number
  }


  export type StockMovementAvgAggregateInputType = {
    quantity?: true
  }

  export type StockMovementSumAggregateInputType = {
    quantity?: true
  }

  export type StockMovementMinAggregateInputType = {
    id?: true
    productId?: true
    type?: true
    quantity?: true
    description?: true
    createdAt?: true
    reconciliationId?: true
  }

  export type StockMovementMaxAggregateInputType = {
    id?: true
    productId?: true
    type?: true
    quantity?: true
    description?: true
    createdAt?: true
    reconciliationId?: true
  }

  export type StockMovementCountAggregateInputType = {
    id?: true
    productId?: true
    type?: true
    quantity?: true
    description?: true
    createdAt?: true
    reconciliationId?: true
    _all?: true
  }

  export type StockMovementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockMovement to aggregate.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockMovements
    **/
    _count?: true | StockMovementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockMovementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockMovementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockMovementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockMovementMaxAggregateInputType
  }

  export type GetStockMovementAggregateType<T extends StockMovementAggregateArgs> = {
        [P in keyof T & keyof AggregateStockMovement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockMovement[P]>
      : GetScalarType<T[P], AggregateStockMovement[P]>
  }




  export type StockMovementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithAggregationInput | StockMovementOrderByWithAggregationInput[]
    by: StockMovementScalarFieldEnum[] | StockMovementScalarFieldEnum
    having?: StockMovementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockMovementCountAggregateInputType | true
    _avg?: StockMovementAvgAggregateInputType
    _sum?: StockMovementSumAggregateInputType
    _min?: StockMovementMinAggregateInputType
    _max?: StockMovementMaxAggregateInputType
  }

  export type StockMovementGroupByOutputType = {
    id: string
    productId: string
    type: string
    quantity: number
    description: string | null
    createdAt: Date
    reconciliationId: string | null
    _count: StockMovementCountAggregateOutputType | null
    _avg: StockMovementAvgAggregateOutputType | null
    _sum: StockMovementSumAggregateOutputType | null
    _min: StockMovementMinAggregateOutputType | null
    _max: StockMovementMaxAggregateOutputType | null
  }

  type GetStockMovementGroupByPayload<T extends StockMovementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockMovementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockMovementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockMovementGroupByOutputType[P]>
            : GetScalarType<T[P], StockMovementGroupByOutputType[P]>
        }
      >
    >


  export type StockMovementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    type?: boolean
    quantity?: boolean
    description?: boolean
    createdAt?: boolean
    reconciliationId?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    reconciliation?: boolean | StockMovement$reconciliationArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>

  export type StockMovementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    type?: boolean
    quantity?: boolean
    description?: boolean
    createdAt?: boolean
    reconciliationId?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    reconciliation?: boolean | StockMovement$reconciliationArgs<ExtArgs>
  }, ExtArgs["result"]["stockMovement"]>

  export type StockMovementSelectScalar = {
    id?: boolean
    productId?: boolean
    type?: boolean
    quantity?: boolean
    description?: boolean
    createdAt?: boolean
    reconciliationId?: boolean
  }

  export type StockMovementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    reconciliation?: boolean | StockMovement$reconciliationArgs<ExtArgs>
  }
  export type StockMovementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    reconciliation?: boolean | StockMovement$reconciliationArgs<ExtArgs>
  }

  export type $StockMovementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockMovement"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
      reconciliation: Prisma.$ReconciliationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      type: string
      quantity: number
      description: string | null
      createdAt: Date
      reconciliationId: string | null
    }, ExtArgs["result"]["stockMovement"]>
    composites: {}
  }

  type StockMovementGetPayload<S extends boolean | null | undefined | StockMovementDefaultArgs> = $Result.GetResult<Prisma.$StockMovementPayload, S>

  type StockMovementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StockMovementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StockMovementCountAggregateInputType | true
    }

  export interface StockMovementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockMovement'], meta: { name: 'StockMovement' } }
    /**
     * Find zero or one StockMovement that matches the filter.
     * @param {StockMovementFindUniqueArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockMovementFindUniqueArgs>(args: SelectSubset<T, StockMovementFindUniqueArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StockMovement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StockMovementFindUniqueOrThrowArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockMovementFindUniqueOrThrowArgs>(args: SelectSubset<T, StockMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StockMovement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindFirstArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockMovementFindFirstArgs>(args?: SelectSubset<T, StockMovementFindFirstArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StockMovement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindFirstOrThrowArgs} args - Arguments to find a StockMovement
     * @example
     * // Get one StockMovement
     * const stockMovement = await prisma.stockMovement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockMovementFindFirstOrThrowArgs>(args?: SelectSubset<T, StockMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StockMovements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockMovements
     * const stockMovements = await prisma.stockMovement.findMany()
     * 
     * // Get first 10 StockMovements
     * const stockMovements = await prisma.stockMovement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockMovementFindManyArgs>(args?: SelectSubset<T, StockMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StockMovement.
     * @param {StockMovementCreateArgs} args - Arguments to create a StockMovement.
     * @example
     * // Create one StockMovement
     * const StockMovement = await prisma.stockMovement.create({
     *   data: {
     *     // ... data to create a StockMovement
     *   }
     * })
     * 
     */
    create<T extends StockMovementCreateArgs>(args: SelectSubset<T, StockMovementCreateArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StockMovements.
     * @param {StockMovementCreateManyArgs} args - Arguments to create many StockMovements.
     * @example
     * // Create many StockMovements
     * const stockMovement = await prisma.stockMovement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockMovementCreateManyArgs>(args?: SelectSubset<T, StockMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StockMovements and returns the data saved in the database.
     * @param {StockMovementCreateManyAndReturnArgs} args - Arguments to create many StockMovements.
     * @example
     * // Create many StockMovements
     * const stockMovement = await prisma.stockMovement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StockMovements and only return the `id`
     * const stockMovementWithIdOnly = await prisma.stockMovement.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StockMovementCreateManyAndReturnArgs>(args?: SelectSubset<T, StockMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StockMovement.
     * @param {StockMovementDeleteArgs} args - Arguments to delete one StockMovement.
     * @example
     * // Delete one StockMovement
     * const StockMovement = await prisma.stockMovement.delete({
     *   where: {
     *     // ... filter to delete one StockMovement
     *   }
     * })
     * 
     */
    delete<T extends StockMovementDeleteArgs>(args: SelectSubset<T, StockMovementDeleteArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StockMovement.
     * @param {StockMovementUpdateArgs} args - Arguments to update one StockMovement.
     * @example
     * // Update one StockMovement
     * const stockMovement = await prisma.stockMovement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockMovementUpdateArgs>(args: SelectSubset<T, StockMovementUpdateArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StockMovements.
     * @param {StockMovementDeleteManyArgs} args - Arguments to filter StockMovements to delete.
     * @example
     * // Delete a few StockMovements
     * const { count } = await prisma.stockMovement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockMovementDeleteManyArgs>(args?: SelectSubset<T, StockMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockMovements
     * const stockMovement = await prisma.stockMovement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockMovementUpdateManyArgs>(args: SelectSubset<T, StockMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StockMovement.
     * @param {StockMovementUpsertArgs} args - Arguments to update or create a StockMovement.
     * @example
     * // Update or create a StockMovement
     * const stockMovement = await prisma.stockMovement.upsert({
     *   create: {
     *     // ... data to create a StockMovement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockMovement we want to update
     *   }
     * })
     */
    upsert<T extends StockMovementUpsertArgs>(args: SelectSubset<T, StockMovementUpsertArgs<ExtArgs>>): Prisma__StockMovementClient<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StockMovements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementCountArgs} args - Arguments to filter StockMovements to count.
     * @example
     * // Count the number of StockMovements
     * const count = await prisma.stockMovement.count({
     *   where: {
     *     // ... the filter for the StockMovements we want to count
     *   }
     * })
    **/
    count<T extends StockMovementCountArgs>(
      args?: Subset<T, StockMovementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockMovementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StockMovementAggregateArgs>(args: Subset<T, StockMovementAggregateArgs>): Prisma.PrismaPromise<GetStockMovementAggregateType<T>>

    /**
     * Group by StockMovement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockMovementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StockMovementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockMovementGroupByArgs['orderBy'] }
        : { orderBy?: StockMovementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StockMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockMovement model
   */
  readonly fields: StockMovementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockMovement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockMovementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    reconciliation<T extends StockMovement$reconciliationArgs<ExtArgs> = {}>(args?: Subset<T, StockMovement$reconciliationArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StockMovement model
   */ 
  interface StockMovementFieldRefs {
    readonly id: FieldRef<"StockMovement", 'String'>
    readonly productId: FieldRef<"StockMovement", 'String'>
    readonly type: FieldRef<"StockMovement", 'String'>
    readonly quantity: FieldRef<"StockMovement", 'Int'>
    readonly description: FieldRef<"StockMovement", 'String'>
    readonly createdAt: FieldRef<"StockMovement", 'DateTime'>
    readonly reconciliationId: FieldRef<"StockMovement", 'String'>
  }
    

  // Custom InputTypes
  /**
   * StockMovement findUnique
   */
  export type StockMovementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement findUniqueOrThrow
   */
  export type StockMovementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement findFirst
   */
  export type StockMovementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement findFirstOrThrow
   */
  export type StockMovementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovement to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockMovements.
     */
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement findMany
   */
  export type StockMovementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter, which StockMovements to fetch.
     */
    where?: StockMovementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockMovements to fetch.
     */
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockMovements.
     */
    cursor?: StockMovementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockMovements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockMovements.
     */
    skip?: number
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * StockMovement create
   */
  export type StockMovementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The data needed to create a StockMovement.
     */
    data: XOR<StockMovementCreateInput, StockMovementUncheckedCreateInput>
  }

  /**
   * StockMovement createMany
   */
  export type StockMovementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockMovements.
     */
    data: StockMovementCreateManyInput | StockMovementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockMovement createManyAndReturn
   */
  export type StockMovementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StockMovements.
     */
    data: StockMovementCreateManyInput | StockMovementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockMovement update
   */
  export type StockMovementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The data needed to update a StockMovement.
     */
    data: XOR<StockMovementUpdateInput, StockMovementUncheckedUpdateInput>
    /**
     * Choose, which StockMovement to update.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement updateMany
   */
  export type StockMovementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockMovements.
     */
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyInput>
    /**
     * Filter which StockMovements to update
     */
    where?: StockMovementWhereInput
  }

  /**
   * StockMovement upsert
   */
  export type StockMovementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * The filter to search for the StockMovement to update in case it exists.
     */
    where: StockMovementWhereUniqueInput
    /**
     * In case the StockMovement found by the `where` argument doesn't exist, create a new StockMovement with this data.
     */
    create: XOR<StockMovementCreateInput, StockMovementUncheckedCreateInput>
    /**
     * In case the StockMovement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockMovementUpdateInput, StockMovementUncheckedUpdateInput>
  }

  /**
   * StockMovement delete
   */
  export type StockMovementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    /**
     * Filter which StockMovement to delete.
     */
    where: StockMovementWhereUniqueInput
  }

  /**
   * StockMovement deleteMany
   */
  export type StockMovementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockMovements to delete
     */
    where?: StockMovementWhereInput
  }

  /**
   * StockMovement.reconciliation
   */
  export type StockMovement$reconciliationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    where?: ReconciliationWhereInput
  }

  /**
   * StockMovement without action
   */
  export type StockMovementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    invoiceNumber: string | null
    saleId: string | null
    pdfUrl: string | null
    createdAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    invoiceNumber: string | null
    saleId: string | null
    pdfUrl: string | null
    createdAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    invoiceNumber: number
    saleId: number
    pdfUrl: number
    createdAt: number
    _all: number
  }


  export type InvoiceMinAggregateInputType = {
    id?: true
    invoiceNumber?: true
    saleId?: true
    pdfUrl?: true
    createdAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    invoiceNumber?: true
    saleId?: true
    pdfUrl?: true
    createdAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    invoiceNumber?: true
    saleId?: true
    pdfUrl?: true
    createdAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    invoiceNumber: string
    saleId: string
    pdfUrl: string | null
    createdAt: Date
    _count: InvoiceCountAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    saleId?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    sale?: boolean | SaleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    saleId?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    sale?: boolean | SaleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    invoiceNumber?: boolean
    saleId?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
  }

  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | SaleDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | SaleDefaultArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      sale: Prisma.$SalePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceNumber: string
      saleId: string
      pdfUrl: string | null
      createdAt: Date
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends SaleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SaleDefaultArgs<ExtArgs>>): Prisma__SaleClient<$Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */ 
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly invoiceNumber: FieldRef<"Invoice", 'String'>
    readonly saleId: FieldRef<"Invoice", 'String'>
    readonly pdfUrl: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model Campaign
   */

  export type AggregateCampaign = {
    _count: CampaignCountAggregateOutputType | null
    _avg: CampaignAvgAggregateOutputType | null
    _sum: CampaignSumAggregateOutputType | null
    _min: CampaignMinAggregateOutputType | null
    _max: CampaignMaxAggregateOutputType | null
  }

  export type CampaignAvgAggregateOutputType = {
    budget: Decimal | null
  }

  export type CampaignSumAggregateOutputType = {
    budget: Decimal | null
  }

  export type CampaignMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    status: string | null
    startDate: Date | null
    endDate: Date | null
    budget: Decimal | null
    createdAt: Date | null
  }

  export type CampaignMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    status: string | null
    startDate: Date | null
    endDate: Date | null
    budget: Decimal | null
    createdAt: Date | null
  }

  export type CampaignCountAggregateOutputType = {
    id: number
    name: number
    type: number
    status: number
    startDate: number
    endDate: number
    budget: number
    createdAt: number
    _all: number
  }


  export type CampaignAvgAggregateInputType = {
    budget?: true
  }

  export type CampaignSumAggregateInputType = {
    budget?: true
  }

  export type CampaignMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    status?: true
    startDate?: true
    endDate?: true
    budget?: true
    createdAt?: true
  }

  export type CampaignMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    status?: true
    startDate?: true
    endDate?: true
    budget?: true
    createdAt?: true
  }

  export type CampaignCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    status?: true
    startDate?: true
    endDate?: true
    budget?: true
    createdAt?: true
    _all?: true
  }

  export type CampaignAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Campaign to aggregate.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Campaigns
    **/
    _count?: true | CampaignCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CampaignAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CampaignSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CampaignMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CampaignMaxAggregateInputType
  }

  export type GetCampaignAggregateType<T extends CampaignAggregateArgs> = {
        [P in keyof T & keyof AggregateCampaign]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCampaign[P]>
      : GetScalarType<T[P], AggregateCampaign[P]>
  }




  export type CampaignGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignWhereInput
    orderBy?: CampaignOrderByWithAggregationInput | CampaignOrderByWithAggregationInput[]
    by: CampaignScalarFieldEnum[] | CampaignScalarFieldEnum
    having?: CampaignScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CampaignCountAggregateInputType | true
    _avg?: CampaignAvgAggregateInputType
    _sum?: CampaignSumAggregateInputType
    _min?: CampaignMinAggregateInputType
    _max?: CampaignMaxAggregateInputType
  }

  export type CampaignGroupByOutputType = {
    id: string
    name: string
    type: string
    status: string
    startDate: Date | null
    endDate: Date | null
    budget: Decimal | null
    createdAt: Date
    _count: CampaignCountAggregateOutputType | null
    _avg: CampaignAvgAggregateOutputType | null
    _sum: CampaignSumAggregateOutputType | null
    _min: CampaignMinAggregateOutputType | null
    _max: CampaignMaxAggregateOutputType | null
  }

  type GetCampaignGroupByPayload<T extends CampaignGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CampaignGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CampaignGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CampaignGroupByOutputType[P]>
            : GetScalarType<T[P], CampaignGroupByOutputType[P]>
        }
      >
    >


  export type CampaignSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    budget?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    budget?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    budget?: boolean
    createdAt?: boolean
  }


  export type $CampaignPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Campaign"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      status: string
      startDate: Date | null
      endDate: Date | null
      budget: Prisma.Decimal | null
      createdAt: Date
    }, ExtArgs["result"]["campaign"]>
    composites: {}
  }

  type CampaignGetPayload<S extends boolean | null | undefined | CampaignDefaultArgs> = $Result.GetResult<Prisma.$CampaignPayload, S>

  type CampaignCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CampaignFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CampaignCountAggregateInputType | true
    }

  export interface CampaignDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Campaign'], meta: { name: 'Campaign' } }
    /**
     * Find zero or one Campaign that matches the filter.
     * @param {CampaignFindUniqueArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CampaignFindUniqueArgs>(args: SelectSubset<T, CampaignFindUniqueArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Campaign that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CampaignFindUniqueOrThrowArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CampaignFindUniqueOrThrowArgs>(args: SelectSubset<T, CampaignFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Campaign that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindFirstArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CampaignFindFirstArgs>(args?: SelectSubset<T, CampaignFindFirstArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Campaign that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindFirstOrThrowArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CampaignFindFirstOrThrowArgs>(args?: SelectSubset<T, CampaignFindFirstOrThrowArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Campaigns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Campaigns
     * const campaigns = await prisma.campaign.findMany()
     * 
     * // Get first 10 Campaigns
     * const campaigns = await prisma.campaign.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const campaignWithIdOnly = await prisma.campaign.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CampaignFindManyArgs>(args?: SelectSubset<T, CampaignFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Campaign.
     * @param {CampaignCreateArgs} args - Arguments to create a Campaign.
     * @example
     * // Create one Campaign
     * const Campaign = await prisma.campaign.create({
     *   data: {
     *     // ... data to create a Campaign
     *   }
     * })
     * 
     */
    create<T extends CampaignCreateArgs>(args: SelectSubset<T, CampaignCreateArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Campaigns.
     * @param {CampaignCreateManyArgs} args - Arguments to create many Campaigns.
     * @example
     * // Create many Campaigns
     * const campaign = await prisma.campaign.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CampaignCreateManyArgs>(args?: SelectSubset<T, CampaignCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Campaigns and returns the data saved in the database.
     * @param {CampaignCreateManyAndReturnArgs} args - Arguments to create many Campaigns.
     * @example
     * // Create many Campaigns
     * const campaign = await prisma.campaign.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Campaigns and only return the `id`
     * const campaignWithIdOnly = await prisma.campaign.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CampaignCreateManyAndReturnArgs>(args?: SelectSubset<T, CampaignCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Campaign.
     * @param {CampaignDeleteArgs} args - Arguments to delete one Campaign.
     * @example
     * // Delete one Campaign
     * const Campaign = await prisma.campaign.delete({
     *   where: {
     *     // ... filter to delete one Campaign
     *   }
     * })
     * 
     */
    delete<T extends CampaignDeleteArgs>(args: SelectSubset<T, CampaignDeleteArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Campaign.
     * @param {CampaignUpdateArgs} args - Arguments to update one Campaign.
     * @example
     * // Update one Campaign
     * const campaign = await prisma.campaign.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CampaignUpdateArgs>(args: SelectSubset<T, CampaignUpdateArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Campaigns.
     * @param {CampaignDeleteManyArgs} args - Arguments to filter Campaigns to delete.
     * @example
     * // Delete a few Campaigns
     * const { count } = await prisma.campaign.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CampaignDeleteManyArgs>(args?: SelectSubset<T, CampaignDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Campaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Campaigns
     * const campaign = await prisma.campaign.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CampaignUpdateManyArgs>(args: SelectSubset<T, CampaignUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Campaign.
     * @param {CampaignUpsertArgs} args - Arguments to update or create a Campaign.
     * @example
     * // Update or create a Campaign
     * const campaign = await prisma.campaign.upsert({
     *   create: {
     *     // ... data to create a Campaign
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Campaign we want to update
     *   }
     * })
     */
    upsert<T extends CampaignUpsertArgs>(args: SelectSubset<T, CampaignUpsertArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Campaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignCountArgs} args - Arguments to filter Campaigns to count.
     * @example
     * // Count the number of Campaigns
     * const count = await prisma.campaign.count({
     *   where: {
     *     // ... the filter for the Campaigns we want to count
     *   }
     * })
    **/
    count<T extends CampaignCountArgs>(
      args?: Subset<T, CampaignCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CampaignCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Campaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CampaignAggregateArgs>(args: Subset<T, CampaignAggregateArgs>): Prisma.PrismaPromise<GetCampaignAggregateType<T>>

    /**
     * Group by Campaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CampaignGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CampaignGroupByArgs['orderBy'] }
        : { orderBy?: CampaignGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CampaignGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCampaignGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Campaign model
   */
  readonly fields: CampaignFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Campaign.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CampaignClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Campaign model
   */ 
  interface CampaignFieldRefs {
    readonly id: FieldRef<"Campaign", 'String'>
    readonly name: FieldRef<"Campaign", 'String'>
    readonly type: FieldRef<"Campaign", 'String'>
    readonly status: FieldRef<"Campaign", 'String'>
    readonly startDate: FieldRef<"Campaign", 'DateTime'>
    readonly endDate: FieldRef<"Campaign", 'DateTime'>
    readonly budget: FieldRef<"Campaign", 'Decimal'>
    readonly createdAt: FieldRef<"Campaign", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Campaign findUnique
   */
  export type CampaignFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign findUniqueOrThrow
   */
  export type CampaignFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign findFirst
   */
  export type CampaignFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign findFirstOrThrow
   */
  export type CampaignFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign findMany
   */
  export type CampaignFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Filter, which Campaigns to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign create
   */
  export type CampaignCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * The data needed to create a Campaign.
     */
    data: XOR<CampaignCreateInput, CampaignUncheckedCreateInput>
  }

  /**
   * Campaign createMany
   */
  export type CampaignCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Campaigns.
     */
    data: CampaignCreateManyInput | CampaignCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Campaign createManyAndReturn
   */
  export type CampaignCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Campaigns.
     */
    data: CampaignCreateManyInput | CampaignCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Campaign update
   */
  export type CampaignUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * The data needed to update a Campaign.
     */
    data: XOR<CampaignUpdateInput, CampaignUncheckedUpdateInput>
    /**
     * Choose, which Campaign to update.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign updateMany
   */
  export type CampaignUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Campaigns.
     */
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyInput>
    /**
     * Filter which Campaigns to update
     */
    where?: CampaignWhereInput
  }

  /**
   * Campaign upsert
   */
  export type CampaignUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * The filter to search for the Campaign to update in case it exists.
     */
    where: CampaignWhereUniqueInput
    /**
     * In case the Campaign found by the `where` argument doesn't exist, create a new Campaign with this data.
     */
    create: XOR<CampaignCreateInput, CampaignUncheckedCreateInput>
    /**
     * In case the Campaign was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CampaignUpdateInput, CampaignUncheckedUpdateInput>
  }

  /**
   * Campaign delete
   */
  export type CampaignDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Filter which Campaign to delete.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign deleteMany
   */
  export type CampaignDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Campaigns to delete
     */
    where?: CampaignWhereInput
  }

  /**
   * Campaign without action
   */
  export type CampaignDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
  }


  /**
   * Model SocialAccount
   */

  export type AggregateSocialAccount = {
    _count: SocialAccountCountAggregateOutputType | null
    _min: SocialAccountMinAggregateOutputType | null
    _max: SocialAccountMaxAggregateOutputType | null
  }

  export type SocialAccountMinAggregateOutputType = {
    id: string | null
    platform: string | null
    accountId: string | null
    accessToken: string | null
    isConnected: boolean | null
  }

  export type SocialAccountMaxAggregateOutputType = {
    id: string | null
    platform: string | null
    accountId: string | null
    accessToken: string | null
    isConnected: boolean | null
  }

  export type SocialAccountCountAggregateOutputType = {
    id: number
    platform: number
    accountId: number
    accessToken: number
    isConnected: number
    _all: number
  }


  export type SocialAccountMinAggregateInputType = {
    id?: true
    platform?: true
    accountId?: true
    accessToken?: true
    isConnected?: true
  }

  export type SocialAccountMaxAggregateInputType = {
    id?: true
    platform?: true
    accountId?: true
    accessToken?: true
    isConnected?: true
  }

  export type SocialAccountCountAggregateInputType = {
    id?: true
    platform?: true
    accountId?: true
    accessToken?: true
    isConnected?: true
    _all?: true
  }

  export type SocialAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SocialAccount to aggregate.
     */
    where?: SocialAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialAccounts to fetch.
     */
    orderBy?: SocialAccountOrderByWithRelationInput | SocialAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SocialAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SocialAccounts
    **/
    _count?: true | SocialAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SocialAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SocialAccountMaxAggregateInputType
  }

  export type GetSocialAccountAggregateType<T extends SocialAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateSocialAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSocialAccount[P]>
      : GetScalarType<T[P], AggregateSocialAccount[P]>
  }




  export type SocialAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SocialAccountWhereInput
    orderBy?: SocialAccountOrderByWithAggregationInput | SocialAccountOrderByWithAggregationInput[]
    by: SocialAccountScalarFieldEnum[] | SocialAccountScalarFieldEnum
    having?: SocialAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SocialAccountCountAggregateInputType | true
    _min?: SocialAccountMinAggregateInputType
    _max?: SocialAccountMaxAggregateInputType
  }

  export type SocialAccountGroupByOutputType = {
    id: string
    platform: string
    accountId: string
    accessToken: string | null
    isConnected: boolean
    _count: SocialAccountCountAggregateOutputType | null
    _min: SocialAccountMinAggregateOutputType | null
    _max: SocialAccountMaxAggregateOutputType | null
  }

  type GetSocialAccountGroupByPayload<T extends SocialAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SocialAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SocialAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SocialAccountGroupByOutputType[P]>
            : GetScalarType<T[P], SocialAccountGroupByOutputType[P]>
        }
      >
    >


  export type SocialAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    platform?: boolean
    accountId?: boolean
    accessToken?: boolean
    isConnected?: boolean
  }, ExtArgs["result"]["socialAccount"]>

  export type SocialAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    platform?: boolean
    accountId?: boolean
    accessToken?: boolean
    isConnected?: boolean
  }, ExtArgs["result"]["socialAccount"]>

  export type SocialAccountSelectScalar = {
    id?: boolean
    platform?: boolean
    accountId?: boolean
    accessToken?: boolean
    isConnected?: boolean
  }


  export type $SocialAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SocialAccount"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      platform: string
      accountId: string
      accessToken: string | null
      isConnected: boolean
    }, ExtArgs["result"]["socialAccount"]>
    composites: {}
  }

  type SocialAccountGetPayload<S extends boolean | null | undefined | SocialAccountDefaultArgs> = $Result.GetResult<Prisma.$SocialAccountPayload, S>

  type SocialAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SocialAccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SocialAccountCountAggregateInputType | true
    }

  export interface SocialAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SocialAccount'], meta: { name: 'SocialAccount' } }
    /**
     * Find zero or one SocialAccount that matches the filter.
     * @param {SocialAccountFindUniqueArgs} args - Arguments to find a SocialAccount
     * @example
     * // Get one SocialAccount
     * const socialAccount = await prisma.socialAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SocialAccountFindUniqueArgs>(args: SelectSubset<T, SocialAccountFindUniqueArgs<ExtArgs>>): Prisma__SocialAccountClient<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SocialAccount that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SocialAccountFindUniqueOrThrowArgs} args - Arguments to find a SocialAccount
     * @example
     * // Get one SocialAccount
     * const socialAccount = await prisma.socialAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SocialAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, SocialAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SocialAccountClient<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SocialAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialAccountFindFirstArgs} args - Arguments to find a SocialAccount
     * @example
     * // Get one SocialAccount
     * const socialAccount = await prisma.socialAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SocialAccountFindFirstArgs>(args?: SelectSubset<T, SocialAccountFindFirstArgs<ExtArgs>>): Prisma__SocialAccountClient<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SocialAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialAccountFindFirstOrThrowArgs} args - Arguments to find a SocialAccount
     * @example
     * // Get one SocialAccount
     * const socialAccount = await prisma.socialAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SocialAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, SocialAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__SocialAccountClient<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SocialAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SocialAccounts
     * const socialAccounts = await prisma.socialAccount.findMany()
     * 
     * // Get first 10 SocialAccounts
     * const socialAccounts = await prisma.socialAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const socialAccountWithIdOnly = await prisma.socialAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SocialAccountFindManyArgs>(args?: SelectSubset<T, SocialAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SocialAccount.
     * @param {SocialAccountCreateArgs} args - Arguments to create a SocialAccount.
     * @example
     * // Create one SocialAccount
     * const SocialAccount = await prisma.socialAccount.create({
     *   data: {
     *     // ... data to create a SocialAccount
     *   }
     * })
     * 
     */
    create<T extends SocialAccountCreateArgs>(args: SelectSubset<T, SocialAccountCreateArgs<ExtArgs>>): Prisma__SocialAccountClient<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SocialAccounts.
     * @param {SocialAccountCreateManyArgs} args - Arguments to create many SocialAccounts.
     * @example
     * // Create many SocialAccounts
     * const socialAccount = await prisma.socialAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SocialAccountCreateManyArgs>(args?: SelectSubset<T, SocialAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SocialAccounts and returns the data saved in the database.
     * @param {SocialAccountCreateManyAndReturnArgs} args - Arguments to create many SocialAccounts.
     * @example
     * // Create many SocialAccounts
     * const socialAccount = await prisma.socialAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SocialAccounts and only return the `id`
     * const socialAccountWithIdOnly = await prisma.socialAccount.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SocialAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, SocialAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SocialAccount.
     * @param {SocialAccountDeleteArgs} args - Arguments to delete one SocialAccount.
     * @example
     * // Delete one SocialAccount
     * const SocialAccount = await prisma.socialAccount.delete({
     *   where: {
     *     // ... filter to delete one SocialAccount
     *   }
     * })
     * 
     */
    delete<T extends SocialAccountDeleteArgs>(args: SelectSubset<T, SocialAccountDeleteArgs<ExtArgs>>): Prisma__SocialAccountClient<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SocialAccount.
     * @param {SocialAccountUpdateArgs} args - Arguments to update one SocialAccount.
     * @example
     * // Update one SocialAccount
     * const socialAccount = await prisma.socialAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SocialAccountUpdateArgs>(args: SelectSubset<T, SocialAccountUpdateArgs<ExtArgs>>): Prisma__SocialAccountClient<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SocialAccounts.
     * @param {SocialAccountDeleteManyArgs} args - Arguments to filter SocialAccounts to delete.
     * @example
     * // Delete a few SocialAccounts
     * const { count } = await prisma.socialAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SocialAccountDeleteManyArgs>(args?: SelectSubset<T, SocialAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SocialAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SocialAccounts
     * const socialAccount = await prisma.socialAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SocialAccountUpdateManyArgs>(args: SelectSubset<T, SocialAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SocialAccount.
     * @param {SocialAccountUpsertArgs} args - Arguments to update or create a SocialAccount.
     * @example
     * // Update or create a SocialAccount
     * const socialAccount = await prisma.socialAccount.upsert({
     *   create: {
     *     // ... data to create a SocialAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SocialAccount we want to update
     *   }
     * })
     */
    upsert<T extends SocialAccountUpsertArgs>(args: SelectSubset<T, SocialAccountUpsertArgs<ExtArgs>>): Prisma__SocialAccountClient<$Result.GetResult<Prisma.$SocialAccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SocialAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialAccountCountArgs} args - Arguments to filter SocialAccounts to count.
     * @example
     * // Count the number of SocialAccounts
     * const count = await prisma.socialAccount.count({
     *   where: {
     *     // ... the filter for the SocialAccounts we want to count
     *   }
     * })
    **/
    count<T extends SocialAccountCountArgs>(
      args?: Subset<T, SocialAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SocialAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SocialAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SocialAccountAggregateArgs>(args: Subset<T, SocialAccountAggregateArgs>): Prisma.PrismaPromise<GetSocialAccountAggregateType<T>>

    /**
     * Group by SocialAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SocialAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SocialAccountGroupByArgs['orderBy'] }
        : { orderBy?: SocialAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SocialAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSocialAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SocialAccount model
   */
  readonly fields: SocialAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SocialAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SocialAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SocialAccount model
   */ 
  interface SocialAccountFieldRefs {
    readonly id: FieldRef<"SocialAccount", 'String'>
    readonly platform: FieldRef<"SocialAccount", 'String'>
    readonly accountId: FieldRef<"SocialAccount", 'String'>
    readonly accessToken: FieldRef<"SocialAccount", 'String'>
    readonly isConnected: FieldRef<"SocialAccount", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * SocialAccount findUnique
   */
  export type SocialAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * Filter, which SocialAccount to fetch.
     */
    where: SocialAccountWhereUniqueInput
  }

  /**
   * SocialAccount findUniqueOrThrow
   */
  export type SocialAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * Filter, which SocialAccount to fetch.
     */
    where: SocialAccountWhereUniqueInput
  }

  /**
   * SocialAccount findFirst
   */
  export type SocialAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * Filter, which SocialAccount to fetch.
     */
    where?: SocialAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialAccounts to fetch.
     */
    orderBy?: SocialAccountOrderByWithRelationInput | SocialAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SocialAccounts.
     */
    cursor?: SocialAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialAccounts.
     */
    distinct?: SocialAccountScalarFieldEnum | SocialAccountScalarFieldEnum[]
  }

  /**
   * SocialAccount findFirstOrThrow
   */
  export type SocialAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * Filter, which SocialAccount to fetch.
     */
    where?: SocialAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialAccounts to fetch.
     */
    orderBy?: SocialAccountOrderByWithRelationInput | SocialAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SocialAccounts.
     */
    cursor?: SocialAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialAccounts.
     */
    distinct?: SocialAccountScalarFieldEnum | SocialAccountScalarFieldEnum[]
  }

  /**
   * SocialAccount findMany
   */
  export type SocialAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * Filter, which SocialAccounts to fetch.
     */
    where?: SocialAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialAccounts to fetch.
     */
    orderBy?: SocialAccountOrderByWithRelationInput | SocialAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SocialAccounts.
     */
    cursor?: SocialAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialAccounts.
     */
    skip?: number
    distinct?: SocialAccountScalarFieldEnum | SocialAccountScalarFieldEnum[]
  }

  /**
   * SocialAccount create
   */
  export type SocialAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * The data needed to create a SocialAccount.
     */
    data: XOR<SocialAccountCreateInput, SocialAccountUncheckedCreateInput>
  }

  /**
   * SocialAccount createMany
   */
  export type SocialAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SocialAccounts.
     */
    data: SocialAccountCreateManyInput | SocialAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SocialAccount createManyAndReturn
   */
  export type SocialAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SocialAccounts.
     */
    data: SocialAccountCreateManyInput | SocialAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SocialAccount update
   */
  export type SocialAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * The data needed to update a SocialAccount.
     */
    data: XOR<SocialAccountUpdateInput, SocialAccountUncheckedUpdateInput>
    /**
     * Choose, which SocialAccount to update.
     */
    where: SocialAccountWhereUniqueInput
  }

  /**
   * SocialAccount updateMany
   */
  export type SocialAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SocialAccounts.
     */
    data: XOR<SocialAccountUpdateManyMutationInput, SocialAccountUncheckedUpdateManyInput>
    /**
     * Filter which SocialAccounts to update
     */
    where?: SocialAccountWhereInput
  }

  /**
   * SocialAccount upsert
   */
  export type SocialAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * The filter to search for the SocialAccount to update in case it exists.
     */
    where: SocialAccountWhereUniqueInput
    /**
     * In case the SocialAccount found by the `where` argument doesn't exist, create a new SocialAccount with this data.
     */
    create: XOR<SocialAccountCreateInput, SocialAccountUncheckedCreateInput>
    /**
     * In case the SocialAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SocialAccountUpdateInput, SocialAccountUncheckedUpdateInput>
  }

  /**
   * SocialAccount delete
   */
  export type SocialAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
    /**
     * Filter which SocialAccount to delete.
     */
    where: SocialAccountWhereUniqueInput
  }

  /**
   * SocialAccount deleteMany
   */
  export type SocialAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SocialAccounts to delete
     */
    where?: SocialAccountWhereInput
  }

  /**
   * SocialAccount without action
   */
  export type SocialAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialAccount
     */
    select?: SocialAccountSelect<ExtArgs> | null
  }


  /**
   * Model Reconciliation
   */

  export type AggregateReconciliation = {
    _count: ReconciliationCountAggregateOutputType | null
    _min: ReconciliationMinAggregateOutputType | null
    _max: ReconciliationMaxAggregateOutputType | null
  }

  export type ReconciliationMinAggregateOutputType = {
    id: string | null
    date: Date | null
    status: string | null
    notes: string | null
  }

  export type ReconciliationMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    status: string | null
    notes: string | null
  }

  export type ReconciliationCountAggregateOutputType = {
    id: number
    date: number
    status: number
    notes: number
    _all: number
  }


  export type ReconciliationMinAggregateInputType = {
    id?: true
    date?: true
    status?: true
    notes?: true
  }

  export type ReconciliationMaxAggregateInputType = {
    id?: true
    date?: true
    status?: true
    notes?: true
  }

  export type ReconciliationCountAggregateInputType = {
    id?: true
    date?: true
    status?: true
    notes?: true
    _all?: true
  }

  export type ReconciliationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reconciliation to aggregate.
     */
    where?: ReconciliationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reconciliations to fetch.
     */
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReconciliationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reconciliations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reconciliations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reconciliations
    **/
    _count?: true | ReconciliationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReconciliationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReconciliationMaxAggregateInputType
  }

  export type GetReconciliationAggregateType<T extends ReconciliationAggregateArgs> = {
        [P in keyof T & keyof AggregateReconciliation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReconciliation[P]>
      : GetScalarType<T[P], AggregateReconciliation[P]>
  }




  export type ReconciliationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReconciliationWhereInput
    orderBy?: ReconciliationOrderByWithAggregationInput | ReconciliationOrderByWithAggregationInput[]
    by: ReconciliationScalarFieldEnum[] | ReconciliationScalarFieldEnum
    having?: ReconciliationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReconciliationCountAggregateInputType | true
    _min?: ReconciliationMinAggregateInputType
    _max?: ReconciliationMaxAggregateInputType
  }

  export type ReconciliationGroupByOutputType = {
    id: string
    date: Date
    status: string
    notes: string | null
    _count: ReconciliationCountAggregateOutputType | null
    _min: ReconciliationMinAggregateOutputType | null
    _max: ReconciliationMaxAggregateOutputType | null
  }

  type GetReconciliationGroupByPayload<T extends ReconciliationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReconciliationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReconciliationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReconciliationGroupByOutputType[P]>
            : GetScalarType<T[P], ReconciliationGroupByOutputType[P]>
        }
      >
    >


  export type ReconciliationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    status?: boolean
    notes?: boolean
    adjustments?: boolean | Reconciliation$adjustmentsArgs<ExtArgs>
    _count?: boolean | ReconciliationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reconciliation"]>

  export type ReconciliationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    status?: boolean
    notes?: boolean
  }, ExtArgs["result"]["reconciliation"]>

  export type ReconciliationSelectScalar = {
    id?: boolean
    date?: boolean
    status?: boolean
    notes?: boolean
  }

  export type ReconciliationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    adjustments?: boolean | Reconciliation$adjustmentsArgs<ExtArgs>
    _count?: boolean | ReconciliationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReconciliationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ReconciliationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reconciliation"
    objects: {
      adjustments: Prisma.$StockMovementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      status: string
      notes: string | null
    }, ExtArgs["result"]["reconciliation"]>
    composites: {}
  }

  type ReconciliationGetPayload<S extends boolean | null | undefined | ReconciliationDefaultArgs> = $Result.GetResult<Prisma.$ReconciliationPayload, S>

  type ReconciliationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReconciliationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReconciliationCountAggregateInputType | true
    }

  export interface ReconciliationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reconciliation'], meta: { name: 'Reconciliation' } }
    /**
     * Find zero or one Reconciliation that matches the filter.
     * @param {ReconciliationFindUniqueArgs} args - Arguments to find a Reconciliation
     * @example
     * // Get one Reconciliation
     * const reconciliation = await prisma.reconciliation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReconciliationFindUniqueArgs>(args: SelectSubset<T, ReconciliationFindUniqueArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Reconciliation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReconciliationFindUniqueOrThrowArgs} args - Arguments to find a Reconciliation
     * @example
     * // Get one Reconciliation
     * const reconciliation = await prisma.reconciliation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReconciliationFindUniqueOrThrowArgs>(args: SelectSubset<T, ReconciliationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Reconciliation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationFindFirstArgs} args - Arguments to find a Reconciliation
     * @example
     * // Get one Reconciliation
     * const reconciliation = await prisma.reconciliation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReconciliationFindFirstArgs>(args?: SelectSubset<T, ReconciliationFindFirstArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Reconciliation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationFindFirstOrThrowArgs} args - Arguments to find a Reconciliation
     * @example
     * // Get one Reconciliation
     * const reconciliation = await prisma.reconciliation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReconciliationFindFirstOrThrowArgs>(args?: SelectSubset<T, ReconciliationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reconciliations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reconciliations
     * const reconciliations = await prisma.reconciliation.findMany()
     * 
     * // Get first 10 Reconciliations
     * const reconciliations = await prisma.reconciliation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reconciliationWithIdOnly = await prisma.reconciliation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReconciliationFindManyArgs>(args?: SelectSubset<T, ReconciliationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Reconciliation.
     * @param {ReconciliationCreateArgs} args - Arguments to create a Reconciliation.
     * @example
     * // Create one Reconciliation
     * const Reconciliation = await prisma.reconciliation.create({
     *   data: {
     *     // ... data to create a Reconciliation
     *   }
     * })
     * 
     */
    create<T extends ReconciliationCreateArgs>(args: SelectSubset<T, ReconciliationCreateArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reconciliations.
     * @param {ReconciliationCreateManyArgs} args - Arguments to create many Reconciliations.
     * @example
     * // Create many Reconciliations
     * const reconciliation = await prisma.reconciliation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReconciliationCreateManyArgs>(args?: SelectSubset<T, ReconciliationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reconciliations and returns the data saved in the database.
     * @param {ReconciliationCreateManyAndReturnArgs} args - Arguments to create many Reconciliations.
     * @example
     * // Create many Reconciliations
     * const reconciliation = await prisma.reconciliation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reconciliations and only return the `id`
     * const reconciliationWithIdOnly = await prisma.reconciliation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReconciliationCreateManyAndReturnArgs>(args?: SelectSubset<T, ReconciliationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Reconciliation.
     * @param {ReconciliationDeleteArgs} args - Arguments to delete one Reconciliation.
     * @example
     * // Delete one Reconciliation
     * const Reconciliation = await prisma.reconciliation.delete({
     *   where: {
     *     // ... filter to delete one Reconciliation
     *   }
     * })
     * 
     */
    delete<T extends ReconciliationDeleteArgs>(args: SelectSubset<T, ReconciliationDeleteArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Reconciliation.
     * @param {ReconciliationUpdateArgs} args - Arguments to update one Reconciliation.
     * @example
     * // Update one Reconciliation
     * const reconciliation = await prisma.reconciliation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReconciliationUpdateArgs>(args: SelectSubset<T, ReconciliationUpdateArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reconciliations.
     * @param {ReconciliationDeleteManyArgs} args - Arguments to filter Reconciliations to delete.
     * @example
     * // Delete a few Reconciliations
     * const { count } = await prisma.reconciliation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReconciliationDeleteManyArgs>(args?: SelectSubset<T, ReconciliationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reconciliations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reconciliations
     * const reconciliation = await prisma.reconciliation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReconciliationUpdateManyArgs>(args: SelectSubset<T, ReconciliationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reconciliation.
     * @param {ReconciliationUpsertArgs} args - Arguments to update or create a Reconciliation.
     * @example
     * // Update or create a Reconciliation
     * const reconciliation = await prisma.reconciliation.upsert({
     *   create: {
     *     // ... data to create a Reconciliation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reconciliation we want to update
     *   }
     * })
     */
    upsert<T extends ReconciliationUpsertArgs>(args: SelectSubset<T, ReconciliationUpsertArgs<ExtArgs>>): Prisma__ReconciliationClient<$Result.GetResult<Prisma.$ReconciliationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reconciliations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationCountArgs} args - Arguments to filter Reconciliations to count.
     * @example
     * // Count the number of Reconciliations
     * const count = await prisma.reconciliation.count({
     *   where: {
     *     // ... the filter for the Reconciliations we want to count
     *   }
     * })
    **/
    count<T extends ReconciliationCountArgs>(
      args?: Subset<T, ReconciliationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReconciliationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reconciliation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReconciliationAggregateArgs>(args: Subset<T, ReconciliationAggregateArgs>): Prisma.PrismaPromise<GetReconciliationAggregateType<T>>

    /**
     * Group by Reconciliation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReconciliationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReconciliationGroupByArgs['orderBy'] }
        : { orderBy?: ReconciliationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReconciliationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReconciliationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reconciliation model
   */
  readonly fields: ReconciliationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reconciliation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReconciliationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    adjustments<T extends Reconciliation$adjustmentsArgs<ExtArgs> = {}>(args?: Subset<T, Reconciliation$adjustmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reconciliation model
   */ 
  interface ReconciliationFieldRefs {
    readonly id: FieldRef<"Reconciliation", 'String'>
    readonly date: FieldRef<"Reconciliation", 'DateTime'>
    readonly status: FieldRef<"Reconciliation", 'String'>
    readonly notes: FieldRef<"Reconciliation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Reconciliation findUnique
   */
  export type ReconciliationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliation to fetch.
     */
    where: ReconciliationWhereUniqueInput
  }

  /**
   * Reconciliation findUniqueOrThrow
   */
  export type ReconciliationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliation to fetch.
     */
    where: ReconciliationWhereUniqueInput
  }

  /**
   * Reconciliation findFirst
   */
  export type ReconciliationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliation to fetch.
     */
    where?: ReconciliationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reconciliations to fetch.
     */
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reconciliations.
     */
    cursor?: ReconciliationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reconciliations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reconciliations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reconciliations.
     */
    distinct?: ReconciliationScalarFieldEnum | ReconciliationScalarFieldEnum[]
  }

  /**
   * Reconciliation findFirstOrThrow
   */
  export type ReconciliationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliation to fetch.
     */
    where?: ReconciliationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reconciliations to fetch.
     */
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reconciliations.
     */
    cursor?: ReconciliationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reconciliations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reconciliations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reconciliations.
     */
    distinct?: ReconciliationScalarFieldEnum | ReconciliationScalarFieldEnum[]
  }

  /**
   * Reconciliation findMany
   */
  export type ReconciliationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter, which Reconciliations to fetch.
     */
    where?: ReconciliationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reconciliations to fetch.
     */
    orderBy?: ReconciliationOrderByWithRelationInput | ReconciliationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reconciliations.
     */
    cursor?: ReconciliationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reconciliations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reconciliations.
     */
    skip?: number
    distinct?: ReconciliationScalarFieldEnum | ReconciliationScalarFieldEnum[]
  }

  /**
   * Reconciliation create
   */
  export type ReconciliationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * The data needed to create a Reconciliation.
     */
    data?: XOR<ReconciliationCreateInput, ReconciliationUncheckedCreateInput>
  }

  /**
   * Reconciliation createMany
   */
  export type ReconciliationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reconciliations.
     */
    data: ReconciliationCreateManyInput | ReconciliationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reconciliation createManyAndReturn
   */
  export type ReconciliationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reconciliations.
     */
    data: ReconciliationCreateManyInput | ReconciliationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reconciliation update
   */
  export type ReconciliationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * The data needed to update a Reconciliation.
     */
    data: XOR<ReconciliationUpdateInput, ReconciliationUncheckedUpdateInput>
    /**
     * Choose, which Reconciliation to update.
     */
    where: ReconciliationWhereUniqueInput
  }

  /**
   * Reconciliation updateMany
   */
  export type ReconciliationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reconciliations.
     */
    data: XOR<ReconciliationUpdateManyMutationInput, ReconciliationUncheckedUpdateManyInput>
    /**
     * Filter which Reconciliations to update
     */
    where?: ReconciliationWhereInput
  }

  /**
   * Reconciliation upsert
   */
  export type ReconciliationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * The filter to search for the Reconciliation to update in case it exists.
     */
    where: ReconciliationWhereUniqueInput
    /**
     * In case the Reconciliation found by the `where` argument doesn't exist, create a new Reconciliation with this data.
     */
    create: XOR<ReconciliationCreateInput, ReconciliationUncheckedCreateInput>
    /**
     * In case the Reconciliation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReconciliationUpdateInput, ReconciliationUncheckedUpdateInput>
  }

  /**
   * Reconciliation delete
   */
  export type ReconciliationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
    /**
     * Filter which Reconciliation to delete.
     */
    where: ReconciliationWhereUniqueInput
  }

  /**
   * Reconciliation deleteMany
   */
  export type ReconciliationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reconciliations to delete
     */
    where?: ReconciliationWhereInput
  }

  /**
   * Reconciliation.adjustments
   */
  export type Reconciliation$adjustmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockMovement
     */
    select?: StockMovementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockMovementInclude<ExtArgs> | null
    where?: StockMovementWhereInput
    orderBy?: StockMovementOrderByWithRelationInput | StockMovementOrderByWithRelationInput[]
    cursor?: StockMovementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockMovementScalarFieldEnum | StockMovementScalarFieldEnum[]
  }

  /**
   * Reconciliation without action
   */
  export type ReconciliationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reconciliation
     */
    select?: ReconciliationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReconciliationInclude<ExtArgs> | null
  }


  /**
   * Model Settings
   */

  export type AggregateSettings = {
    _count: SettingsCountAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  export type SettingsMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
  }

  export type SettingsMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
  }

  export type SettingsCountAggregateOutputType = {
    id: number
    key: number
    value: number
    _all: number
  }


  export type SettingsMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
  }

  export type SettingsMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
  }

  export type SettingsCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    _all?: true
  }

  export type SettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to aggregate.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingsMaxAggregateInputType
  }

  export type GetSettingsAggregateType<T extends SettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSettings[P]>
      : GetScalarType<T[P], AggregateSettings[P]>
  }




  export type SettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingsWhereInput
    orderBy?: SettingsOrderByWithAggregationInput | SettingsOrderByWithAggregationInput[]
    by: SettingsScalarFieldEnum[] | SettingsScalarFieldEnum
    having?: SettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingsCountAggregateInputType | true
    _min?: SettingsMinAggregateInputType
    _max?: SettingsMaxAggregateInputType
  }

  export type SettingsGroupByOutputType = {
    id: string
    key: string
    value: string
    _count: SettingsCountAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  type GetSettingsGroupByPayload<T extends SettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingsGroupByOutputType[P]>
            : GetScalarType<T[P], SettingsGroupByOutputType[P]>
        }
      >
    >


  export type SettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
  }


  export type $SettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Settings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
    }, ExtArgs["result"]["settings"]>
    composites: {}
  }

  type SettingsGetPayload<S extends boolean | null | undefined | SettingsDefaultArgs> = $Result.GetResult<Prisma.$SettingsPayload, S>

  type SettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SettingsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SettingsCountAggregateInputType | true
    }

  export interface SettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Settings'], meta: { name: 'Settings' } }
    /**
     * Find zero or one Settings that matches the filter.
     * @param {SettingsFindUniqueArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingsFindUniqueArgs>(args: SelectSubset<T, SettingsFindUniqueArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Settings that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SettingsFindUniqueOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingsFindFirstArgs>(args?: SelectSubset<T, SettingsFindFirstArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Settings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.settings.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.settings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingsWithIdOnly = await prisma.settings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingsFindManyArgs>(args?: SelectSubset<T, SettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Settings.
     * @param {SettingsCreateArgs} args - Arguments to create a Settings.
     * @example
     * // Create one Settings
     * const Settings = await prisma.settings.create({
     *   data: {
     *     // ... data to create a Settings
     *   }
     * })
     * 
     */
    create<T extends SettingsCreateArgs>(args: SelectSubset<T, SettingsCreateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Settings.
     * @param {SettingsCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingsCreateManyArgs>(args?: SelectSubset<T, SettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingsCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `id`
     * const settingsWithIdOnly = await prisma.settings.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Settings.
     * @param {SettingsDeleteArgs} args - Arguments to delete one Settings.
     * @example
     * // Delete one Settings
     * const Settings = await prisma.settings.delete({
     *   where: {
     *     // ... filter to delete one Settings
     *   }
     * })
     * 
     */
    delete<T extends SettingsDeleteArgs>(args: SelectSubset<T, SettingsDeleteArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Settings.
     * @param {SettingsUpdateArgs} args - Arguments to update one Settings.
     * @example
     * // Update one Settings
     * const settings = await prisma.settings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingsUpdateArgs>(args: SelectSubset<T, SettingsUpdateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Settings.
     * @param {SettingsDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.settings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingsDeleteManyArgs>(args?: SelectSubset<T, SettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const settings = await prisma.settings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingsUpdateManyArgs>(args: SelectSubset<T, SettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Settings.
     * @param {SettingsUpsertArgs} args - Arguments to update or create a Settings.
     * @example
     * // Update or create a Settings
     * const settings = await prisma.settings.upsert({
     *   create: {
     *     // ... data to create a Settings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Settings we want to update
     *   }
     * })
     */
    upsert<T extends SettingsUpsertArgs>(args: SelectSubset<T, SettingsUpsertArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.settings.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingsCountArgs>(
      args?: Subset<T, SettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SettingsAggregateArgs>(args: Subset<T, SettingsAggregateArgs>): Prisma.PrismaPromise<GetSettingsAggregateType<T>>

    /**
     * Group by Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingsGroupByArgs['orderBy'] }
        : { orderBy?: SettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Settings model
   */
  readonly fields: SettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Settings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Settings model
   */ 
  interface SettingsFieldRefs {
    readonly id: FieldRef<"Settings", 'String'>
    readonly key: FieldRef<"Settings", 'String'>
    readonly value: FieldRef<"Settings", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Settings findUnique
   */
  export type SettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findUniqueOrThrow
   */
  export type SettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findFirst
   */
  export type SettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findFirstOrThrow
   */
  export type SettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findMany
   */
  export type SettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings create
   */
  export type SettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * The data needed to create a Settings.
     */
    data: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
  }

  /**
   * Settings createMany
   */
  export type SettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Settings createManyAndReturn
   */
  export type SettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Settings update
   */
  export type SettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * The data needed to update a Settings.
     */
    data: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
    /**
     * Choose, which Settings to update.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings updateMany
   */
  export type SettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingsUpdateManyMutationInput, SettingsUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingsWhereInput
  }

  /**
   * Settings upsert
   */
  export type SettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * The filter to search for the Settings to update in case it exists.
     */
    where: SettingsWhereUniqueInput
    /**
     * In case the Settings found by the `where` argument doesn't exist, create a new Settings with this data.
     */
    create: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
    /**
     * In case the Settings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
  }

  /**
   * Settings delete
   */
  export type SettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Filter which Settings to delete.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings deleteMany
   */
  export type SettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingsWhereInput
  }

  /**
   * Settings without action
   */
  export type SettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
  }


  /**
   * Model POSItemMapping
   */

  export type AggregatePOSItemMapping = {
    _count: POSItemMappingCountAggregateOutputType | null
    _avg: POSItemMappingAvgAggregateOutputType | null
    _sum: POSItemMappingSumAggregateOutputType | null
    _min: POSItemMappingMinAggregateOutputType | null
    _max: POSItemMappingMaxAggregateOutputType | null
  }

  export type POSItemMappingAvgAggregateOutputType = {
    lastSoldPrice: Decimal | null
    confidenceScore: Decimal | null
  }

  export type POSItemMappingSumAggregateOutputType = {
    lastSoldPrice: Decimal | null
    confidenceScore: Decimal | null
  }

  export type POSItemMappingMinAggregateOutputType = {
    id: string | null
    posItemName: string | null
    matchedInventoryId: string | null
    lastSoldPrice: Decimal | null
    confidenceScore: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
    tenantId: string | null
  }

  export type POSItemMappingMaxAggregateOutputType = {
    id: string | null
    posItemName: string | null
    matchedInventoryId: string | null
    lastSoldPrice: Decimal | null
    confidenceScore: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
    tenantId: string | null
  }

  export type POSItemMappingCountAggregateOutputType = {
    id: number
    posItemName: number
    matchedInventoryId: number
    lastSoldPrice: number
    confidenceScore: number
    createdAt: number
    updatedAt: number
    tenantId: number
    _all: number
  }


  export type POSItemMappingAvgAggregateInputType = {
    lastSoldPrice?: true
    confidenceScore?: true
  }

  export type POSItemMappingSumAggregateInputType = {
    lastSoldPrice?: true
    confidenceScore?: true
  }

  export type POSItemMappingMinAggregateInputType = {
    id?: true
    posItemName?: true
    matchedInventoryId?: true
    lastSoldPrice?: true
    confidenceScore?: true
    createdAt?: true
    updatedAt?: true
    tenantId?: true
  }

  export type POSItemMappingMaxAggregateInputType = {
    id?: true
    posItemName?: true
    matchedInventoryId?: true
    lastSoldPrice?: true
    confidenceScore?: true
    createdAt?: true
    updatedAt?: true
    tenantId?: true
  }

  export type POSItemMappingCountAggregateInputType = {
    id?: true
    posItemName?: true
    matchedInventoryId?: true
    lastSoldPrice?: true
    confidenceScore?: true
    createdAt?: true
    updatedAt?: true
    tenantId?: true
    _all?: true
  }

  export type POSItemMappingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which POSItemMapping to aggregate.
     */
    where?: POSItemMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of POSItemMappings to fetch.
     */
    orderBy?: POSItemMappingOrderByWithRelationInput | POSItemMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: POSItemMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` POSItemMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` POSItemMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned POSItemMappings
    **/
    _count?: true | POSItemMappingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: POSItemMappingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: POSItemMappingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: POSItemMappingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: POSItemMappingMaxAggregateInputType
  }

  export type GetPOSItemMappingAggregateType<T extends POSItemMappingAggregateArgs> = {
        [P in keyof T & keyof AggregatePOSItemMapping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePOSItemMapping[P]>
      : GetScalarType<T[P], AggregatePOSItemMapping[P]>
  }




  export type POSItemMappingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: POSItemMappingWhereInput
    orderBy?: POSItemMappingOrderByWithAggregationInput | POSItemMappingOrderByWithAggregationInput[]
    by: POSItemMappingScalarFieldEnum[] | POSItemMappingScalarFieldEnum
    having?: POSItemMappingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: POSItemMappingCountAggregateInputType | true
    _avg?: POSItemMappingAvgAggregateInputType
    _sum?: POSItemMappingSumAggregateInputType
    _min?: POSItemMappingMinAggregateInputType
    _max?: POSItemMappingMaxAggregateInputType
  }

  export type POSItemMappingGroupByOutputType = {
    id: string
    posItemName: string
    matchedInventoryId: string
    lastSoldPrice: Decimal
    confidenceScore: Decimal | null
    createdAt: Date
    updatedAt: Date
    tenantId: string
    _count: POSItemMappingCountAggregateOutputType | null
    _avg: POSItemMappingAvgAggregateOutputType | null
    _sum: POSItemMappingSumAggregateOutputType | null
    _min: POSItemMappingMinAggregateOutputType | null
    _max: POSItemMappingMaxAggregateOutputType | null
  }

  type GetPOSItemMappingGroupByPayload<T extends POSItemMappingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<POSItemMappingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof POSItemMappingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], POSItemMappingGroupByOutputType[P]>
            : GetScalarType<T[P], POSItemMappingGroupByOutputType[P]>
        }
      >
    >


  export type POSItemMappingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    posItemName?: boolean
    matchedInventoryId?: boolean
    lastSoldPrice?: boolean
    confidenceScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenantId?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pOSItemMapping"]>

  export type POSItemMappingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    posItemName?: boolean
    matchedInventoryId?: boolean
    lastSoldPrice?: boolean
    confidenceScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenantId?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pOSItemMapping"]>

  export type POSItemMappingSelectScalar = {
    id?: boolean
    posItemName?: boolean
    matchedInventoryId?: boolean
    lastSoldPrice?: boolean
    confidenceScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenantId?: boolean
  }

  export type POSItemMappingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type POSItemMappingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $POSItemMappingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "POSItemMapping"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      posItemName: string
      matchedInventoryId: string
      lastSoldPrice: Prisma.Decimal
      confidenceScore: Prisma.Decimal | null
      createdAt: Date
      updatedAt: Date
      tenantId: string
    }, ExtArgs["result"]["pOSItemMapping"]>
    composites: {}
  }

  type POSItemMappingGetPayload<S extends boolean | null | undefined | POSItemMappingDefaultArgs> = $Result.GetResult<Prisma.$POSItemMappingPayload, S>

  type POSItemMappingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<POSItemMappingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: POSItemMappingCountAggregateInputType | true
    }

  export interface POSItemMappingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['POSItemMapping'], meta: { name: 'POSItemMapping' } }
    /**
     * Find zero or one POSItemMapping that matches the filter.
     * @param {POSItemMappingFindUniqueArgs} args - Arguments to find a POSItemMapping
     * @example
     * // Get one POSItemMapping
     * const pOSItemMapping = await prisma.pOSItemMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends POSItemMappingFindUniqueArgs>(args: SelectSubset<T, POSItemMappingFindUniqueArgs<ExtArgs>>): Prisma__POSItemMappingClient<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one POSItemMapping that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {POSItemMappingFindUniqueOrThrowArgs} args - Arguments to find a POSItemMapping
     * @example
     * // Get one POSItemMapping
     * const pOSItemMapping = await prisma.pOSItemMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends POSItemMappingFindUniqueOrThrowArgs>(args: SelectSubset<T, POSItemMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__POSItemMappingClient<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first POSItemMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {POSItemMappingFindFirstArgs} args - Arguments to find a POSItemMapping
     * @example
     * // Get one POSItemMapping
     * const pOSItemMapping = await prisma.pOSItemMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends POSItemMappingFindFirstArgs>(args?: SelectSubset<T, POSItemMappingFindFirstArgs<ExtArgs>>): Prisma__POSItemMappingClient<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first POSItemMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {POSItemMappingFindFirstOrThrowArgs} args - Arguments to find a POSItemMapping
     * @example
     * // Get one POSItemMapping
     * const pOSItemMapping = await prisma.pOSItemMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends POSItemMappingFindFirstOrThrowArgs>(args?: SelectSubset<T, POSItemMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma__POSItemMappingClient<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more POSItemMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {POSItemMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all POSItemMappings
     * const pOSItemMappings = await prisma.pOSItemMapping.findMany()
     * 
     * // Get first 10 POSItemMappings
     * const pOSItemMappings = await prisma.pOSItemMapping.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pOSItemMappingWithIdOnly = await prisma.pOSItemMapping.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends POSItemMappingFindManyArgs>(args?: SelectSubset<T, POSItemMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a POSItemMapping.
     * @param {POSItemMappingCreateArgs} args - Arguments to create a POSItemMapping.
     * @example
     * // Create one POSItemMapping
     * const POSItemMapping = await prisma.pOSItemMapping.create({
     *   data: {
     *     // ... data to create a POSItemMapping
     *   }
     * })
     * 
     */
    create<T extends POSItemMappingCreateArgs>(args: SelectSubset<T, POSItemMappingCreateArgs<ExtArgs>>): Prisma__POSItemMappingClient<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many POSItemMappings.
     * @param {POSItemMappingCreateManyArgs} args - Arguments to create many POSItemMappings.
     * @example
     * // Create many POSItemMappings
     * const pOSItemMapping = await prisma.pOSItemMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends POSItemMappingCreateManyArgs>(args?: SelectSubset<T, POSItemMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many POSItemMappings and returns the data saved in the database.
     * @param {POSItemMappingCreateManyAndReturnArgs} args - Arguments to create many POSItemMappings.
     * @example
     * // Create many POSItemMappings
     * const pOSItemMapping = await prisma.pOSItemMapping.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many POSItemMappings and only return the `id`
     * const pOSItemMappingWithIdOnly = await prisma.pOSItemMapping.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends POSItemMappingCreateManyAndReturnArgs>(args?: SelectSubset<T, POSItemMappingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a POSItemMapping.
     * @param {POSItemMappingDeleteArgs} args - Arguments to delete one POSItemMapping.
     * @example
     * // Delete one POSItemMapping
     * const POSItemMapping = await prisma.pOSItemMapping.delete({
     *   where: {
     *     // ... filter to delete one POSItemMapping
     *   }
     * })
     * 
     */
    delete<T extends POSItemMappingDeleteArgs>(args: SelectSubset<T, POSItemMappingDeleteArgs<ExtArgs>>): Prisma__POSItemMappingClient<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one POSItemMapping.
     * @param {POSItemMappingUpdateArgs} args - Arguments to update one POSItemMapping.
     * @example
     * // Update one POSItemMapping
     * const pOSItemMapping = await prisma.pOSItemMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends POSItemMappingUpdateArgs>(args: SelectSubset<T, POSItemMappingUpdateArgs<ExtArgs>>): Prisma__POSItemMappingClient<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more POSItemMappings.
     * @param {POSItemMappingDeleteManyArgs} args - Arguments to filter POSItemMappings to delete.
     * @example
     * // Delete a few POSItemMappings
     * const { count } = await prisma.pOSItemMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends POSItemMappingDeleteManyArgs>(args?: SelectSubset<T, POSItemMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more POSItemMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {POSItemMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many POSItemMappings
     * const pOSItemMapping = await prisma.pOSItemMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends POSItemMappingUpdateManyArgs>(args: SelectSubset<T, POSItemMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one POSItemMapping.
     * @param {POSItemMappingUpsertArgs} args - Arguments to update or create a POSItemMapping.
     * @example
     * // Update or create a POSItemMapping
     * const pOSItemMapping = await prisma.pOSItemMapping.upsert({
     *   create: {
     *     // ... data to create a POSItemMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the POSItemMapping we want to update
     *   }
     * })
     */
    upsert<T extends POSItemMappingUpsertArgs>(args: SelectSubset<T, POSItemMappingUpsertArgs<ExtArgs>>): Prisma__POSItemMappingClient<$Result.GetResult<Prisma.$POSItemMappingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of POSItemMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {POSItemMappingCountArgs} args - Arguments to filter POSItemMappings to count.
     * @example
     * // Count the number of POSItemMappings
     * const count = await prisma.pOSItemMapping.count({
     *   where: {
     *     // ... the filter for the POSItemMappings we want to count
     *   }
     * })
    **/
    count<T extends POSItemMappingCountArgs>(
      args?: Subset<T, POSItemMappingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], POSItemMappingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a POSItemMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {POSItemMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends POSItemMappingAggregateArgs>(args: Subset<T, POSItemMappingAggregateArgs>): Prisma.PrismaPromise<GetPOSItemMappingAggregateType<T>>

    /**
     * Group by POSItemMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {POSItemMappingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends POSItemMappingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: POSItemMappingGroupByArgs['orderBy'] }
        : { orderBy?: POSItemMappingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, POSItemMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPOSItemMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the POSItemMapping model
   */
  readonly fields: POSItemMappingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for POSItemMapping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__POSItemMappingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the POSItemMapping model
   */ 
  interface POSItemMappingFieldRefs {
    readonly id: FieldRef<"POSItemMapping", 'String'>
    readonly posItemName: FieldRef<"POSItemMapping", 'String'>
    readonly matchedInventoryId: FieldRef<"POSItemMapping", 'String'>
    readonly lastSoldPrice: FieldRef<"POSItemMapping", 'Decimal'>
    readonly confidenceScore: FieldRef<"POSItemMapping", 'Decimal'>
    readonly createdAt: FieldRef<"POSItemMapping", 'DateTime'>
    readonly updatedAt: FieldRef<"POSItemMapping", 'DateTime'>
    readonly tenantId: FieldRef<"POSItemMapping", 'String'>
  }
    

  // Custom InputTypes
  /**
   * POSItemMapping findUnique
   */
  export type POSItemMappingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * Filter, which POSItemMapping to fetch.
     */
    where: POSItemMappingWhereUniqueInput
  }

  /**
   * POSItemMapping findUniqueOrThrow
   */
  export type POSItemMappingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * Filter, which POSItemMapping to fetch.
     */
    where: POSItemMappingWhereUniqueInput
  }

  /**
   * POSItemMapping findFirst
   */
  export type POSItemMappingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * Filter, which POSItemMapping to fetch.
     */
    where?: POSItemMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of POSItemMappings to fetch.
     */
    orderBy?: POSItemMappingOrderByWithRelationInput | POSItemMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for POSItemMappings.
     */
    cursor?: POSItemMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` POSItemMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` POSItemMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of POSItemMappings.
     */
    distinct?: POSItemMappingScalarFieldEnum | POSItemMappingScalarFieldEnum[]
  }

  /**
   * POSItemMapping findFirstOrThrow
   */
  export type POSItemMappingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * Filter, which POSItemMapping to fetch.
     */
    where?: POSItemMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of POSItemMappings to fetch.
     */
    orderBy?: POSItemMappingOrderByWithRelationInput | POSItemMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for POSItemMappings.
     */
    cursor?: POSItemMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` POSItemMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` POSItemMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of POSItemMappings.
     */
    distinct?: POSItemMappingScalarFieldEnum | POSItemMappingScalarFieldEnum[]
  }

  /**
   * POSItemMapping findMany
   */
  export type POSItemMappingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * Filter, which POSItemMappings to fetch.
     */
    where?: POSItemMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of POSItemMappings to fetch.
     */
    orderBy?: POSItemMappingOrderByWithRelationInput | POSItemMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing POSItemMappings.
     */
    cursor?: POSItemMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` POSItemMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` POSItemMappings.
     */
    skip?: number
    distinct?: POSItemMappingScalarFieldEnum | POSItemMappingScalarFieldEnum[]
  }

  /**
   * POSItemMapping create
   */
  export type POSItemMappingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * The data needed to create a POSItemMapping.
     */
    data: XOR<POSItemMappingCreateInput, POSItemMappingUncheckedCreateInput>
  }

  /**
   * POSItemMapping createMany
   */
  export type POSItemMappingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many POSItemMappings.
     */
    data: POSItemMappingCreateManyInput | POSItemMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * POSItemMapping createManyAndReturn
   */
  export type POSItemMappingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many POSItemMappings.
     */
    data: POSItemMappingCreateManyInput | POSItemMappingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * POSItemMapping update
   */
  export type POSItemMappingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * The data needed to update a POSItemMapping.
     */
    data: XOR<POSItemMappingUpdateInput, POSItemMappingUncheckedUpdateInput>
    /**
     * Choose, which POSItemMapping to update.
     */
    where: POSItemMappingWhereUniqueInput
  }

  /**
   * POSItemMapping updateMany
   */
  export type POSItemMappingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update POSItemMappings.
     */
    data: XOR<POSItemMappingUpdateManyMutationInput, POSItemMappingUncheckedUpdateManyInput>
    /**
     * Filter which POSItemMappings to update
     */
    where?: POSItemMappingWhereInput
  }

  /**
   * POSItemMapping upsert
   */
  export type POSItemMappingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * The filter to search for the POSItemMapping to update in case it exists.
     */
    where: POSItemMappingWhereUniqueInput
    /**
     * In case the POSItemMapping found by the `where` argument doesn't exist, create a new POSItemMapping with this data.
     */
    create: XOR<POSItemMappingCreateInput, POSItemMappingUncheckedCreateInput>
    /**
     * In case the POSItemMapping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<POSItemMappingUpdateInput, POSItemMappingUncheckedUpdateInput>
  }

  /**
   * POSItemMapping delete
   */
  export type POSItemMappingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
    /**
     * Filter which POSItemMapping to delete.
     */
    where: POSItemMappingWhereUniqueInput
  }

  /**
   * POSItemMapping deleteMany
   */
  export type POSItemMappingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which POSItemMappings to delete
     */
    where?: POSItemMappingWhereInput
  }

  /**
   * POSItemMapping without action
   */
  export type POSItemMappingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the POSItemMapping
     */
    select?: POSItemMappingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: POSItemMappingInclude<ExtArgs> | null
  }


  /**
   * Model ProductBatch
   */

  export type AggregateProductBatch = {
    _count: ProductBatchCountAggregateOutputType | null
    _avg: ProductBatchAvgAggregateOutputType | null
    _sum: ProductBatchSumAggregateOutputType | null
    _min: ProductBatchMinAggregateOutputType | null
    _max: ProductBatchMaxAggregateOutputType | null
  }

  export type ProductBatchAvgAggregateOutputType = {
    quantity: number | null
  }

  export type ProductBatchSumAggregateOutputType = {
    quantity: number | null
  }

  export type ProductBatchMinAggregateOutputType = {
    id: string | null
    productId: string | null
    sku: string | null
    quantity: number | null
    expiryDate: Date | null
    receivedDate: Date | null
  }

  export type ProductBatchMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    sku: string | null
    quantity: number | null
    expiryDate: Date | null
    receivedDate: Date | null
  }

  export type ProductBatchCountAggregateOutputType = {
    id: number
    productId: number
    sku: number
    quantity: number
    expiryDate: number
    receivedDate: number
    _all: number
  }


  export type ProductBatchAvgAggregateInputType = {
    quantity?: true
  }

  export type ProductBatchSumAggregateInputType = {
    quantity?: true
  }

  export type ProductBatchMinAggregateInputType = {
    id?: true
    productId?: true
    sku?: true
    quantity?: true
    expiryDate?: true
    receivedDate?: true
  }

  export type ProductBatchMaxAggregateInputType = {
    id?: true
    productId?: true
    sku?: true
    quantity?: true
    expiryDate?: true
    receivedDate?: true
  }

  export type ProductBatchCountAggregateInputType = {
    id?: true
    productId?: true
    sku?: true
    quantity?: true
    expiryDate?: true
    receivedDate?: true
    _all?: true
  }

  export type ProductBatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductBatch to aggregate.
     */
    where?: ProductBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductBatches to fetch.
     */
    orderBy?: ProductBatchOrderByWithRelationInput | ProductBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductBatches
    **/
    _count?: true | ProductBatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductBatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductBatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductBatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductBatchMaxAggregateInputType
  }

  export type GetProductBatchAggregateType<T extends ProductBatchAggregateArgs> = {
        [P in keyof T & keyof AggregateProductBatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductBatch[P]>
      : GetScalarType<T[P], AggregateProductBatch[P]>
  }




  export type ProductBatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductBatchWhereInput
    orderBy?: ProductBatchOrderByWithAggregationInput | ProductBatchOrderByWithAggregationInput[]
    by: ProductBatchScalarFieldEnum[] | ProductBatchScalarFieldEnum
    having?: ProductBatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductBatchCountAggregateInputType | true
    _avg?: ProductBatchAvgAggregateInputType
    _sum?: ProductBatchSumAggregateInputType
    _min?: ProductBatchMinAggregateInputType
    _max?: ProductBatchMaxAggregateInputType
  }

  export type ProductBatchGroupByOutputType = {
    id: string
    productId: string
    sku: string
    quantity: number
    expiryDate: Date
    receivedDate: Date
    _count: ProductBatchCountAggregateOutputType | null
    _avg: ProductBatchAvgAggregateOutputType | null
    _sum: ProductBatchSumAggregateOutputType | null
    _min: ProductBatchMinAggregateOutputType | null
    _max: ProductBatchMaxAggregateOutputType | null
  }

  type GetProductBatchGroupByPayload<T extends ProductBatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductBatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductBatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductBatchGroupByOutputType[P]>
            : GetScalarType<T[P], ProductBatchGroupByOutputType[P]>
        }
      >
    >


  export type ProductBatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    sku?: boolean
    quantity?: boolean
    expiryDate?: boolean
    receivedDate?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productBatch"]>

  export type ProductBatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    sku?: boolean
    quantity?: boolean
    expiryDate?: boolean
    receivedDate?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productBatch"]>

  export type ProductBatchSelectScalar = {
    id?: boolean
    productId?: boolean
    sku?: boolean
    quantity?: boolean
    expiryDate?: boolean
    receivedDate?: boolean
  }

  export type ProductBatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductBatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductBatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductBatch"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      sku: string
      quantity: number
      expiryDate: Date
      receivedDate: Date
    }, ExtArgs["result"]["productBatch"]>
    composites: {}
  }

  type ProductBatchGetPayload<S extends boolean | null | undefined | ProductBatchDefaultArgs> = $Result.GetResult<Prisma.$ProductBatchPayload, S>

  type ProductBatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductBatchFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductBatchCountAggregateInputType | true
    }

  export interface ProductBatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductBatch'], meta: { name: 'ProductBatch' } }
    /**
     * Find zero or one ProductBatch that matches the filter.
     * @param {ProductBatchFindUniqueArgs} args - Arguments to find a ProductBatch
     * @example
     * // Get one ProductBatch
     * const productBatch = await prisma.productBatch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductBatchFindUniqueArgs>(args: SelectSubset<T, ProductBatchFindUniqueArgs<ExtArgs>>): Prisma__ProductBatchClient<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProductBatch that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductBatchFindUniqueOrThrowArgs} args - Arguments to find a ProductBatch
     * @example
     * // Get one ProductBatch
     * const productBatch = await prisma.productBatch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductBatchFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductBatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductBatchClient<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProductBatch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductBatchFindFirstArgs} args - Arguments to find a ProductBatch
     * @example
     * // Get one ProductBatch
     * const productBatch = await prisma.productBatch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductBatchFindFirstArgs>(args?: SelectSubset<T, ProductBatchFindFirstArgs<ExtArgs>>): Prisma__ProductBatchClient<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProductBatch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductBatchFindFirstOrThrowArgs} args - Arguments to find a ProductBatch
     * @example
     * // Get one ProductBatch
     * const productBatch = await prisma.productBatch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductBatchFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductBatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductBatchClient<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProductBatches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductBatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductBatches
     * const productBatches = await prisma.productBatch.findMany()
     * 
     * // Get first 10 ProductBatches
     * const productBatches = await prisma.productBatch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productBatchWithIdOnly = await prisma.productBatch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductBatchFindManyArgs>(args?: SelectSubset<T, ProductBatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProductBatch.
     * @param {ProductBatchCreateArgs} args - Arguments to create a ProductBatch.
     * @example
     * // Create one ProductBatch
     * const ProductBatch = await prisma.productBatch.create({
     *   data: {
     *     // ... data to create a ProductBatch
     *   }
     * })
     * 
     */
    create<T extends ProductBatchCreateArgs>(args: SelectSubset<T, ProductBatchCreateArgs<ExtArgs>>): Prisma__ProductBatchClient<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProductBatches.
     * @param {ProductBatchCreateManyArgs} args - Arguments to create many ProductBatches.
     * @example
     * // Create many ProductBatches
     * const productBatch = await prisma.productBatch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductBatchCreateManyArgs>(args?: SelectSubset<T, ProductBatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductBatches and returns the data saved in the database.
     * @param {ProductBatchCreateManyAndReturnArgs} args - Arguments to create many ProductBatches.
     * @example
     * // Create many ProductBatches
     * const productBatch = await prisma.productBatch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductBatches and only return the `id`
     * const productBatchWithIdOnly = await prisma.productBatch.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductBatchCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductBatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProductBatch.
     * @param {ProductBatchDeleteArgs} args - Arguments to delete one ProductBatch.
     * @example
     * // Delete one ProductBatch
     * const ProductBatch = await prisma.productBatch.delete({
     *   where: {
     *     // ... filter to delete one ProductBatch
     *   }
     * })
     * 
     */
    delete<T extends ProductBatchDeleteArgs>(args: SelectSubset<T, ProductBatchDeleteArgs<ExtArgs>>): Prisma__ProductBatchClient<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProductBatch.
     * @param {ProductBatchUpdateArgs} args - Arguments to update one ProductBatch.
     * @example
     * // Update one ProductBatch
     * const productBatch = await prisma.productBatch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductBatchUpdateArgs>(args: SelectSubset<T, ProductBatchUpdateArgs<ExtArgs>>): Prisma__ProductBatchClient<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProductBatches.
     * @param {ProductBatchDeleteManyArgs} args - Arguments to filter ProductBatches to delete.
     * @example
     * // Delete a few ProductBatches
     * const { count } = await prisma.productBatch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductBatchDeleteManyArgs>(args?: SelectSubset<T, ProductBatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductBatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductBatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductBatches
     * const productBatch = await prisma.productBatch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductBatchUpdateManyArgs>(args: SelectSubset<T, ProductBatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProductBatch.
     * @param {ProductBatchUpsertArgs} args - Arguments to update or create a ProductBatch.
     * @example
     * // Update or create a ProductBatch
     * const productBatch = await prisma.productBatch.upsert({
     *   create: {
     *     // ... data to create a ProductBatch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductBatch we want to update
     *   }
     * })
     */
    upsert<T extends ProductBatchUpsertArgs>(args: SelectSubset<T, ProductBatchUpsertArgs<ExtArgs>>): Prisma__ProductBatchClient<$Result.GetResult<Prisma.$ProductBatchPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProductBatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductBatchCountArgs} args - Arguments to filter ProductBatches to count.
     * @example
     * // Count the number of ProductBatches
     * const count = await prisma.productBatch.count({
     *   where: {
     *     // ... the filter for the ProductBatches we want to count
     *   }
     * })
    **/
    count<T extends ProductBatchCountArgs>(
      args?: Subset<T, ProductBatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductBatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductBatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductBatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductBatchAggregateArgs>(args: Subset<T, ProductBatchAggregateArgs>): Prisma.PrismaPromise<GetProductBatchAggregateType<T>>

    /**
     * Group by ProductBatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductBatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductBatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductBatchGroupByArgs['orderBy'] }
        : { orderBy?: ProductBatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductBatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductBatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductBatch model
   */
  readonly fields: ProductBatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductBatch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductBatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductBatch model
   */ 
  interface ProductBatchFieldRefs {
    readonly id: FieldRef<"ProductBatch", 'String'>
    readonly productId: FieldRef<"ProductBatch", 'String'>
    readonly sku: FieldRef<"ProductBatch", 'String'>
    readonly quantity: FieldRef<"ProductBatch", 'Int'>
    readonly expiryDate: FieldRef<"ProductBatch", 'DateTime'>
    readonly receivedDate: FieldRef<"ProductBatch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductBatch findUnique
   */
  export type ProductBatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * Filter, which ProductBatch to fetch.
     */
    where: ProductBatchWhereUniqueInput
  }

  /**
   * ProductBatch findUniqueOrThrow
   */
  export type ProductBatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * Filter, which ProductBatch to fetch.
     */
    where: ProductBatchWhereUniqueInput
  }

  /**
   * ProductBatch findFirst
   */
  export type ProductBatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * Filter, which ProductBatch to fetch.
     */
    where?: ProductBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductBatches to fetch.
     */
    orderBy?: ProductBatchOrderByWithRelationInput | ProductBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductBatches.
     */
    cursor?: ProductBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductBatches.
     */
    distinct?: ProductBatchScalarFieldEnum | ProductBatchScalarFieldEnum[]
  }

  /**
   * ProductBatch findFirstOrThrow
   */
  export type ProductBatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * Filter, which ProductBatch to fetch.
     */
    where?: ProductBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductBatches to fetch.
     */
    orderBy?: ProductBatchOrderByWithRelationInput | ProductBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductBatches.
     */
    cursor?: ProductBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductBatches.
     */
    distinct?: ProductBatchScalarFieldEnum | ProductBatchScalarFieldEnum[]
  }

  /**
   * ProductBatch findMany
   */
  export type ProductBatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * Filter, which ProductBatches to fetch.
     */
    where?: ProductBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductBatches to fetch.
     */
    orderBy?: ProductBatchOrderByWithRelationInput | ProductBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductBatches.
     */
    cursor?: ProductBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductBatches.
     */
    skip?: number
    distinct?: ProductBatchScalarFieldEnum | ProductBatchScalarFieldEnum[]
  }

  /**
   * ProductBatch create
   */
  export type ProductBatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductBatch.
     */
    data: XOR<ProductBatchCreateInput, ProductBatchUncheckedCreateInput>
  }

  /**
   * ProductBatch createMany
   */
  export type ProductBatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductBatches.
     */
    data: ProductBatchCreateManyInput | ProductBatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductBatch createManyAndReturn
   */
  export type ProductBatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProductBatches.
     */
    data: ProductBatchCreateManyInput | ProductBatchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductBatch update
   */
  export type ProductBatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductBatch.
     */
    data: XOR<ProductBatchUpdateInput, ProductBatchUncheckedUpdateInput>
    /**
     * Choose, which ProductBatch to update.
     */
    where: ProductBatchWhereUniqueInput
  }

  /**
   * ProductBatch updateMany
   */
  export type ProductBatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductBatches.
     */
    data: XOR<ProductBatchUpdateManyMutationInput, ProductBatchUncheckedUpdateManyInput>
    /**
     * Filter which ProductBatches to update
     */
    where?: ProductBatchWhereInput
  }

  /**
   * ProductBatch upsert
   */
  export type ProductBatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductBatch to update in case it exists.
     */
    where: ProductBatchWhereUniqueInput
    /**
     * In case the ProductBatch found by the `where` argument doesn't exist, create a new ProductBatch with this data.
     */
    create: XOR<ProductBatchCreateInput, ProductBatchUncheckedCreateInput>
    /**
     * In case the ProductBatch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductBatchUpdateInput, ProductBatchUncheckedUpdateInput>
  }

  /**
   * ProductBatch delete
   */
  export type ProductBatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
    /**
     * Filter which ProductBatch to delete.
     */
    where: ProductBatchWhereUniqueInput
  }

  /**
   * ProductBatch deleteMany
   */
  export type ProductBatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductBatches to delete
     */
    where?: ProductBatchWhereInput
  }

  /**
   * ProductBatch without action
   */
  export type ProductBatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductBatch
     */
    select?: ProductBatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductBatchInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProductScalarFieldEnum: {
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
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const SaleScalarFieldEnum: {
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

  export type SaleScalarFieldEnum = (typeof SaleScalarFieldEnum)[keyof typeof SaleScalarFieldEnum]


  export const SaleItemScalarFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    productId: 'productId',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    subtotal: 'subtotal'
  };

  export type SaleItemScalarFieldEnum = (typeof SaleItemScalarFieldEnum)[keyof typeof SaleItemScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    loyaltyPoints: 'loyaltyPoints',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const VendorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    contactPerson: 'contactPerson',
    email: 'email',
    phone: 'phone',
    address: 'address',
    isActive: 'isActive'
  };

  export type VendorScalarFieldEnum = (typeof VendorScalarFieldEnum)[keyof typeof VendorScalarFieldEnum]


  export const PurchaseOrderScalarFieldEnum: {
    id: 'id',
    poNumber: 'poNumber',
    vendorId: 'vendorId',
    status: 'status',
    totalAmount: 'totalAmount',
    orderDate: 'orderDate',
    receivedDate: 'receivedDate'
  };

  export type PurchaseOrderScalarFieldEnum = (typeof PurchaseOrderScalarFieldEnum)[keyof typeof PurchaseOrderScalarFieldEnum]


  export const PurchaseOrderItemScalarFieldEnum: {
    id: 'id',
    purchaseOrderId: 'purchaseOrderId',
    productId: 'productId',
    quantity: 'quantity',
    unitCost: 'unitCost',
    totalCost: 'totalCost'
  };

  export type PurchaseOrderItemScalarFieldEnum = (typeof PurchaseOrderItemScalarFieldEnum)[keyof typeof PurchaseOrderItemScalarFieldEnum]


  export const StockMovementScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    type: 'type',
    quantity: 'quantity',
    description: 'description',
    createdAt: 'createdAt',
    reconciliationId: 'reconciliationId'
  };

  export type StockMovementScalarFieldEnum = (typeof StockMovementScalarFieldEnum)[keyof typeof StockMovementScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    invoiceNumber: 'invoiceNumber',
    saleId: 'saleId',
    pdfUrl: 'pdfUrl',
    createdAt: 'createdAt'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const CampaignScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate',
    budget: 'budget',
    createdAt: 'createdAt'
  };

  export type CampaignScalarFieldEnum = (typeof CampaignScalarFieldEnum)[keyof typeof CampaignScalarFieldEnum]


  export const SocialAccountScalarFieldEnum: {
    id: 'id',
    platform: 'platform',
    accountId: 'accountId',
    accessToken: 'accessToken',
    isConnected: 'isConnected'
  };

  export type SocialAccountScalarFieldEnum = (typeof SocialAccountScalarFieldEnum)[keyof typeof SocialAccountScalarFieldEnum]


  export const ReconciliationScalarFieldEnum: {
    id: 'id',
    date: 'date',
    status: 'status',
    notes: 'notes'
  };

  export type ReconciliationScalarFieldEnum = (typeof ReconciliationScalarFieldEnum)[keyof typeof ReconciliationScalarFieldEnum]


  export const SettingsScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value'
  };

  export type SettingsScalarFieldEnum = (typeof SettingsScalarFieldEnum)[keyof typeof SettingsScalarFieldEnum]


  export const POSItemMappingScalarFieldEnum: {
    id: 'id',
    posItemName: 'posItemName',
    matchedInventoryId: 'matchedInventoryId',
    lastSoldPrice: 'lastSoldPrice',
    confidenceScore: 'confidenceScore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    tenantId: 'tenantId'
  };

  export type POSItemMappingScalarFieldEnum = (typeof POSItemMappingScalarFieldEnum)[keyof typeof POSItemMappingScalarFieldEnum]


  export const ProductBatchScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    sku: 'sku',
    quantity: 'quantity',
    expiryDate: 'expiryDate',
    receivedDate: 'receivedDate'
  };

  export type ProductBatchScalarFieldEnum = (typeof ProductBatchScalarFieldEnum)[keyof typeof ProductBatchScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    Sales?: SaleListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Sales?: SaleOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    Sales?: SaleListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    sku?: StringFilter<"Product"> | string
    category?: StringNullableFilter<"Product"> | string | null
    description?: StringNullableFilter<"Product"> | string | null
    price?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    stock?: IntFilter<"Product"> | number
    reorderLevel?: IntFilter<"Product"> | number
    imageUrl?: StringNullableFilter<"Product"> | string | null
    barcode?: StringNullableFilter<"Product"> | string | null
    isActive?: BoolFilter<"Product"> | boolean
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    SaleItems?: SaleItemListRelationFilter
    StockMovements?: StockMovementListRelationFilter
    PurchaseOrderItems?: PurchaseOrderItemListRelationFilter
    Batches?: ProductBatchListRelationFilter
    POSItemMappings?: POSItemMappingListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    costPrice?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    barcode?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    SaleItems?: SaleItemOrderByRelationAggregateInput
    StockMovements?: StockMovementOrderByRelationAggregateInput
    PurchaseOrderItems?: PurchaseOrderItemOrderByRelationAggregateInput
    Batches?: ProductBatchOrderByRelationAggregateInput
    POSItemMappings?: POSItemMappingOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sku?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    category?: StringNullableFilter<"Product"> | string | null
    description?: StringNullableFilter<"Product"> | string | null
    price?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    stock?: IntFilter<"Product"> | number
    reorderLevel?: IntFilter<"Product"> | number
    imageUrl?: StringNullableFilter<"Product"> | string | null
    barcode?: StringNullableFilter<"Product"> | string | null
    isActive?: BoolFilter<"Product"> | boolean
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    SaleItems?: SaleItemListRelationFilter
    StockMovements?: StockMovementListRelationFilter
    PurchaseOrderItems?: PurchaseOrderItemListRelationFilter
    Batches?: ProductBatchListRelationFilter
    POSItemMappings?: POSItemMappingListRelationFilter
  }, "id" | "sku">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    costPrice?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    barcode?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    sku?: StringWithAggregatesFilter<"Product"> | string
    category?: StringNullableWithAggregatesFilter<"Product"> | string | null
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    price?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    stock?: IntWithAggregatesFilter<"Product"> | number
    reorderLevel?: IntWithAggregatesFilter<"Product"> | number
    imageUrl?: StringNullableWithAggregatesFilter<"Product"> | string | null
    barcode?: StringNullableWithAggregatesFilter<"Product"> | string | null
    isActive?: BoolWithAggregatesFilter<"Product"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type SaleWhereInput = {
    AND?: SaleWhereInput | SaleWhereInput[]
    OR?: SaleWhereInput[]
    NOT?: SaleWhereInput | SaleWhereInput[]
    id?: StringFilter<"Sale"> | string
    saleNumber?: StringFilter<"Sale"> | string
    subtotal?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Sale"> | string
    createdAt?: DateTimeFilter<"Sale"> | Date | string
    userId?: StringFilter<"Sale"> | string
    customerId?: StringNullableFilter<"Sale"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    items?: SaleItemListRelationFilter
    Invoice?: XOR<InvoiceNullableRelationFilter, InvoiceWhereInput> | null
  }

  export type SaleOrderByWithRelationInput = {
    id?: SortOrder
    saleNumber?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
    customerId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    items?: SaleItemOrderByRelationAggregateInput
    Invoice?: InvoiceOrderByWithRelationInput
  }

  export type SaleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    saleNumber?: string
    AND?: SaleWhereInput | SaleWhereInput[]
    OR?: SaleWhereInput[]
    NOT?: SaleWhereInput | SaleWhereInput[]
    subtotal?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Sale"> | string
    createdAt?: DateTimeFilter<"Sale"> | Date | string
    userId?: StringFilter<"Sale"> | string
    customerId?: StringNullableFilter<"Sale"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    items?: SaleItemListRelationFilter
    Invoice?: XOR<InvoiceNullableRelationFilter, InvoiceWhereInput> | null
  }, "id" | "saleNumber">

  export type SaleOrderByWithAggregationInput = {
    id?: SortOrder
    saleNumber?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
    customerId?: SortOrderInput | SortOrder
    _count?: SaleCountOrderByAggregateInput
    _avg?: SaleAvgOrderByAggregateInput
    _max?: SaleMaxOrderByAggregateInput
    _min?: SaleMinOrderByAggregateInput
    _sum?: SaleSumOrderByAggregateInput
  }

  export type SaleScalarWhereWithAggregatesInput = {
    AND?: SaleScalarWhereWithAggregatesInput | SaleScalarWhereWithAggregatesInput[]
    OR?: SaleScalarWhereWithAggregatesInput[]
    NOT?: SaleScalarWhereWithAggregatesInput | SaleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Sale"> | string
    saleNumber?: StringWithAggregatesFilter<"Sale"> | string
    subtotal?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    total?: DecimalWithAggregatesFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"Sale"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Sale"> | Date | string
    userId?: StringWithAggregatesFilter<"Sale"> | string
    customerId?: StringNullableWithAggregatesFilter<"Sale"> | string | null
  }

  export type SaleItemWhereInput = {
    AND?: SaleItemWhereInput | SaleItemWhereInput[]
    OR?: SaleItemWhereInput[]
    NOT?: SaleItemWhereInput | SaleItemWhereInput[]
    id?: StringFilter<"SaleItem"> | string
    saleId?: StringFilter<"SaleItem"> | string
    productId?: StringFilter<"SaleItem"> | string
    quantity?: IntFilter<"SaleItem"> | number
    unitPrice?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    sale?: XOR<SaleRelationFilter, SaleWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }

  export type SaleItemOrderByWithRelationInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
    sale?: SaleOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type SaleItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SaleItemWhereInput | SaleItemWhereInput[]
    OR?: SaleItemWhereInput[]
    NOT?: SaleItemWhereInput | SaleItemWhereInput[]
    saleId?: StringFilter<"SaleItem"> | string
    productId?: StringFilter<"SaleItem"> | string
    quantity?: IntFilter<"SaleItem"> | number
    unitPrice?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    sale?: XOR<SaleRelationFilter, SaleWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }, "id">

  export type SaleItemOrderByWithAggregationInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
    _count?: SaleItemCountOrderByAggregateInput
    _avg?: SaleItemAvgOrderByAggregateInput
    _max?: SaleItemMaxOrderByAggregateInput
    _min?: SaleItemMinOrderByAggregateInput
    _sum?: SaleItemSumOrderByAggregateInput
  }

  export type SaleItemScalarWhereWithAggregatesInput = {
    AND?: SaleItemScalarWhereWithAggregatesInput | SaleItemScalarWhereWithAggregatesInput[]
    OR?: SaleItemScalarWhereWithAggregatesInput[]
    NOT?: SaleItemScalarWhereWithAggregatesInput | SaleItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SaleItem"> | string
    saleId?: StringWithAggregatesFilter<"SaleItem"> | string
    productId?: StringWithAggregatesFilter<"SaleItem"> | string
    quantity?: IntWithAggregatesFilter<"SaleItem"> | number
    unitPrice?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalWithAggregatesFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    loyaltyPoints?: IntFilter<"Customer"> | number
    isActive?: BoolFilter<"Customer"> | boolean
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    Sales?: SaleListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    loyaltyPoints?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    Sales?: SaleOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    name?: StringFilter<"Customer"> | string
    loyaltyPoints?: IntFilter<"Customer"> | number
    isActive?: BoolFilter<"Customer"> | boolean
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    Sales?: SaleListRelationFilter
  }, "id" | "email" | "phone">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    loyaltyPoints?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _avg?: CustomerAvgOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
    _sum?: CustomerSumOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    name?: StringWithAggregatesFilter<"Customer"> | string
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    loyaltyPoints?: IntWithAggregatesFilter<"Customer"> | number
    isActive?: BoolWithAggregatesFilter<"Customer"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type VendorWhereInput = {
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    id?: StringFilter<"Vendor"> | string
    name?: StringFilter<"Vendor"> | string
    contactPerson?: StringNullableFilter<"Vendor"> | string | null
    email?: StringNullableFilter<"Vendor"> | string | null
    phone?: StringNullableFilter<"Vendor"> | string | null
    address?: StringNullableFilter<"Vendor"> | string | null
    isActive?: BoolFilter<"Vendor"> | boolean
    PurchaseOrders?: PurchaseOrderListRelationFilter
  }

  export type VendorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    isActive?: SortOrder
    PurchaseOrders?: PurchaseOrderOrderByRelationAggregateInput
  }

  export type VendorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    name?: StringFilter<"Vendor"> | string
    contactPerson?: StringNullableFilter<"Vendor"> | string | null
    email?: StringNullableFilter<"Vendor"> | string | null
    phone?: StringNullableFilter<"Vendor"> | string | null
    address?: StringNullableFilter<"Vendor"> | string | null
    isActive?: BoolFilter<"Vendor"> | boolean
    PurchaseOrders?: PurchaseOrderListRelationFilter
  }, "id">

  export type VendorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: VendorCountOrderByAggregateInput
    _max?: VendorMaxOrderByAggregateInput
    _min?: VendorMinOrderByAggregateInput
  }

  export type VendorScalarWhereWithAggregatesInput = {
    AND?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    OR?: VendorScalarWhereWithAggregatesInput[]
    NOT?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vendor"> | string
    name?: StringWithAggregatesFilter<"Vendor"> | string
    contactPerson?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    email?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    address?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    isActive?: BoolWithAggregatesFilter<"Vendor"> | boolean
  }

  export type PurchaseOrderWhereInput = {
    AND?: PurchaseOrderWhereInput | PurchaseOrderWhereInput[]
    OR?: PurchaseOrderWhereInput[]
    NOT?: PurchaseOrderWhereInput | PurchaseOrderWhereInput[]
    id?: StringFilter<"PurchaseOrder"> | string
    poNumber?: StringFilter<"PurchaseOrder"> | string
    vendorId?: StringFilter<"PurchaseOrder"> | string
    status?: StringFilter<"PurchaseOrder"> | string
    totalAmount?: DecimalFilter<"PurchaseOrder"> | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFilter<"PurchaseOrder"> | Date | string
    receivedDate?: DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null
    vendor?: XOR<VendorRelationFilter, VendorWhereInput>
    items?: PurchaseOrderItemListRelationFilter
  }

  export type PurchaseOrderOrderByWithRelationInput = {
    id?: SortOrder
    poNumber?: SortOrder
    vendorId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    orderDate?: SortOrder
    receivedDate?: SortOrderInput | SortOrder
    vendor?: VendorOrderByWithRelationInput
    items?: PurchaseOrderItemOrderByRelationAggregateInput
  }

  export type PurchaseOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    poNumber?: string
    AND?: PurchaseOrderWhereInput | PurchaseOrderWhereInput[]
    OR?: PurchaseOrderWhereInput[]
    NOT?: PurchaseOrderWhereInput | PurchaseOrderWhereInput[]
    vendorId?: StringFilter<"PurchaseOrder"> | string
    status?: StringFilter<"PurchaseOrder"> | string
    totalAmount?: DecimalFilter<"PurchaseOrder"> | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFilter<"PurchaseOrder"> | Date | string
    receivedDate?: DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null
    vendor?: XOR<VendorRelationFilter, VendorWhereInput>
    items?: PurchaseOrderItemListRelationFilter
  }, "id" | "poNumber">

  export type PurchaseOrderOrderByWithAggregationInput = {
    id?: SortOrder
    poNumber?: SortOrder
    vendorId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    orderDate?: SortOrder
    receivedDate?: SortOrderInput | SortOrder
    _count?: PurchaseOrderCountOrderByAggregateInput
    _avg?: PurchaseOrderAvgOrderByAggregateInput
    _max?: PurchaseOrderMaxOrderByAggregateInput
    _min?: PurchaseOrderMinOrderByAggregateInput
    _sum?: PurchaseOrderSumOrderByAggregateInput
  }

  export type PurchaseOrderScalarWhereWithAggregatesInput = {
    AND?: PurchaseOrderScalarWhereWithAggregatesInput | PurchaseOrderScalarWhereWithAggregatesInput[]
    OR?: PurchaseOrderScalarWhereWithAggregatesInput[]
    NOT?: PurchaseOrderScalarWhereWithAggregatesInput | PurchaseOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PurchaseOrder"> | string
    poNumber?: StringWithAggregatesFilter<"PurchaseOrder"> | string
    vendorId?: StringWithAggregatesFilter<"PurchaseOrder"> | string
    status?: StringWithAggregatesFilter<"PurchaseOrder"> | string
    totalAmount?: DecimalWithAggregatesFilter<"PurchaseOrder"> | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeWithAggregatesFilter<"PurchaseOrder"> | Date | string
    receivedDate?: DateTimeNullableWithAggregatesFilter<"PurchaseOrder"> | Date | string | null
  }

  export type PurchaseOrderItemWhereInput = {
    AND?: PurchaseOrderItemWhereInput | PurchaseOrderItemWhereInput[]
    OR?: PurchaseOrderItemWhereInput[]
    NOT?: PurchaseOrderItemWhereInput | PurchaseOrderItemWhereInput[]
    id?: StringFilter<"PurchaseOrderItem"> | string
    purchaseOrderId?: StringFilter<"PurchaseOrderItem"> | string
    productId?: StringFilter<"PurchaseOrderItem"> | string
    quantity?: IntFilter<"PurchaseOrderItem"> | number
    unitCost?: DecimalFilter<"PurchaseOrderItem"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"PurchaseOrderItem"> | Decimal | DecimalJsLike | number | string
    purchaseOrder?: XOR<PurchaseOrderRelationFilter, PurchaseOrderWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }

  export type PurchaseOrderItemOrderByWithRelationInput = {
    id?: SortOrder
    purchaseOrderId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    totalCost?: SortOrder
    purchaseOrder?: PurchaseOrderOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type PurchaseOrderItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PurchaseOrderItemWhereInput | PurchaseOrderItemWhereInput[]
    OR?: PurchaseOrderItemWhereInput[]
    NOT?: PurchaseOrderItemWhereInput | PurchaseOrderItemWhereInput[]
    purchaseOrderId?: StringFilter<"PurchaseOrderItem"> | string
    productId?: StringFilter<"PurchaseOrderItem"> | string
    quantity?: IntFilter<"PurchaseOrderItem"> | number
    unitCost?: DecimalFilter<"PurchaseOrderItem"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"PurchaseOrderItem"> | Decimal | DecimalJsLike | number | string
    purchaseOrder?: XOR<PurchaseOrderRelationFilter, PurchaseOrderWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }, "id">

  export type PurchaseOrderItemOrderByWithAggregationInput = {
    id?: SortOrder
    purchaseOrderId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    totalCost?: SortOrder
    _count?: PurchaseOrderItemCountOrderByAggregateInput
    _avg?: PurchaseOrderItemAvgOrderByAggregateInput
    _max?: PurchaseOrderItemMaxOrderByAggregateInput
    _min?: PurchaseOrderItemMinOrderByAggregateInput
    _sum?: PurchaseOrderItemSumOrderByAggregateInput
  }

  export type PurchaseOrderItemScalarWhereWithAggregatesInput = {
    AND?: PurchaseOrderItemScalarWhereWithAggregatesInput | PurchaseOrderItemScalarWhereWithAggregatesInput[]
    OR?: PurchaseOrderItemScalarWhereWithAggregatesInput[]
    NOT?: PurchaseOrderItemScalarWhereWithAggregatesInput | PurchaseOrderItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PurchaseOrderItem"> | string
    purchaseOrderId?: StringWithAggregatesFilter<"PurchaseOrderItem"> | string
    productId?: StringWithAggregatesFilter<"PurchaseOrderItem"> | string
    quantity?: IntWithAggregatesFilter<"PurchaseOrderItem"> | number
    unitCost?: DecimalWithAggregatesFilter<"PurchaseOrderItem"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalWithAggregatesFilter<"PurchaseOrderItem"> | Decimal | DecimalJsLike | number | string
  }

  export type StockMovementWhereInput = {
    AND?: StockMovementWhereInput | StockMovementWhereInput[]
    OR?: StockMovementWhereInput[]
    NOT?: StockMovementWhereInput | StockMovementWhereInput[]
    id?: StringFilter<"StockMovement"> | string
    productId?: StringFilter<"StockMovement"> | string
    type?: StringFilter<"StockMovement"> | string
    quantity?: IntFilter<"StockMovement"> | number
    description?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    reconciliationId?: StringNullableFilter<"StockMovement"> | string | null
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    reconciliation?: XOR<ReconciliationNullableRelationFilter, ReconciliationWhereInput> | null
  }

  export type StockMovementOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    reconciliationId?: SortOrderInput | SortOrder
    product?: ProductOrderByWithRelationInput
    reconciliation?: ReconciliationOrderByWithRelationInput
  }

  export type StockMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StockMovementWhereInput | StockMovementWhereInput[]
    OR?: StockMovementWhereInput[]
    NOT?: StockMovementWhereInput | StockMovementWhereInput[]
    productId?: StringFilter<"StockMovement"> | string
    type?: StringFilter<"StockMovement"> | string
    quantity?: IntFilter<"StockMovement"> | number
    description?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    reconciliationId?: StringNullableFilter<"StockMovement"> | string | null
    product?: XOR<ProductRelationFilter, ProductWhereInput>
    reconciliation?: XOR<ReconciliationNullableRelationFilter, ReconciliationWhereInput> | null
  }, "id">

  export type StockMovementOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    reconciliationId?: SortOrderInput | SortOrder
    _count?: StockMovementCountOrderByAggregateInput
    _avg?: StockMovementAvgOrderByAggregateInput
    _max?: StockMovementMaxOrderByAggregateInput
    _min?: StockMovementMinOrderByAggregateInput
    _sum?: StockMovementSumOrderByAggregateInput
  }

  export type StockMovementScalarWhereWithAggregatesInput = {
    AND?: StockMovementScalarWhereWithAggregatesInput | StockMovementScalarWhereWithAggregatesInput[]
    OR?: StockMovementScalarWhereWithAggregatesInput[]
    NOT?: StockMovementScalarWhereWithAggregatesInput | StockMovementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StockMovement"> | string
    productId?: StringWithAggregatesFilter<"StockMovement"> | string
    type?: StringWithAggregatesFilter<"StockMovement"> | string
    quantity?: IntWithAggregatesFilter<"StockMovement"> | number
    description?: StringNullableWithAggregatesFilter<"StockMovement"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StockMovement"> | Date | string
    reconciliationId?: StringNullableWithAggregatesFilter<"StockMovement"> | string | null
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    invoiceNumber?: StringFilter<"Invoice"> | string
    saleId?: StringFilter<"Invoice"> | string
    pdfUrl?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    sale?: XOR<SaleRelationFilter, SaleWhereInput>
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    saleId?: SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    sale?: SaleOrderByWithRelationInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    invoiceNumber?: string
    saleId?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    pdfUrl?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    sale?: XOR<SaleRelationFilter, SaleWhereInput>
  }, "id" | "invoiceNumber" | "saleId">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    saleId?: SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    invoiceNumber?: StringWithAggregatesFilter<"Invoice"> | string
    saleId?: StringWithAggregatesFilter<"Invoice"> | string
    pdfUrl?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
  }

  export type CampaignWhereInput = {
    AND?: CampaignWhereInput | CampaignWhereInput[]
    OR?: CampaignWhereInput[]
    NOT?: CampaignWhereInput | CampaignWhereInput[]
    id?: StringFilter<"Campaign"> | string
    name?: StringFilter<"Campaign"> | string
    type?: StringFilter<"Campaign"> | string
    status?: StringFilter<"Campaign"> | string
    startDate?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    budget?: DecimalNullableFilter<"Campaign"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Campaign"> | Date | string
  }

  export type CampaignOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    budget?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type CampaignWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CampaignWhereInput | CampaignWhereInput[]
    OR?: CampaignWhereInput[]
    NOT?: CampaignWhereInput | CampaignWhereInput[]
    name?: StringFilter<"Campaign"> | string
    type?: StringFilter<"Campaign"> | string
    status?: StringFilter<"Campaign"> | string
    startDate?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    budget?: DecimalNullableFilter<"Campaign"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"Campaign"> | Date | string
  }, "id">

  export type CampaignOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    budget?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CampaignCountOrderByAggregateInput
    _avg?: CampaignAvgOrderByAggregateInput
    _max?: CampaignMaxOrderByAggregateInput
    _min?: CampaignMinOrderByAggregateInput
    _sum?: CampaignSumOrderByAggregateInput
  }

  export type CampaignScalarWhereWithAggregatesInput = {
    AND?: CampaignScalarWhereWithAggregatesInput | CampaignScalarWhereWithAggregatesInput[]
    OR?: CampaignScalarWhereWithAggregatesInput[]
    NOT?: CampaignScalarWhereWithAggregatesInput | CampaignScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Campaign"> | string
    name?: StringWithAggregatesFilter<"Campaign"> | string
    type?: StringWithAggregatesFilter<"Campaign"> | string
    status?: StringWithAggregatesFilter<"Campaign"> | string
    startDate?: DateTimeNullableWithAggregatesFilter<"Campaign"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Campaign"> | Date | string | null
    budget?: DecimalNullableWithAggregatesFilter<"Campaign"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Campaign"> | Date | string
  }

  export type SocialAccountWhereInput = {
    AND?: SocialAccountWhereInput | SocialAccountWhereInput[]
    OR?: SocialAccountWhereInput[]
    NOT?: SocialAccountWhereInput | SocialAccountWhereInput[]
    id?: StringFilter<"SocialAccount"> | string
    platform?: StringFilter<"SocialAccount"> | string
    accountId?: StringFilter<"SocialAccount"> | string
    accessToken?: StringNullableFilter<"SocialAccount"> | string | null
    isConnected?: BoolFilter<"SocialAccount"> | boolean
  }

  export type SocialAccountOrderByWithRelationInput = {
    id?: SortOrder
    platform?: SortOrder
    accountId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    isConnected?: SortOrder
  }

  export type SocialAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SocialAccountWhereInput | SocialAccountWhereInput[]
    OR?: SocialAccountWhereInput[]
    NOT?: SocialAccountWhereInput | SocialAccountWhereInput[]
    platform?: StringFilter<"SocialAccount"> | string
    accountId?: StringFilter<"SocialAccount"> | string
    accessToken?: StringNullableFilter<"SocialAccount"> | string | null
    isConnected?: BoolFilter<"SocialAccount"> | boolean
  }, "id">

  export type SocialAccountOrderByWithAggregationInput = {
    id?: SortOrder
    platform?: SortOrder
    accountId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    isConnected?: SortOrder
    _count?: SocialAccountCountOrderByAggregateInput
    _max?: SocialAccountMaxOrderByAggregateInput
    _min?: SocialAccountMinOrderByAggregateInput
  }

  export type SocialAccountScalarWhereWithAggregatesInput = {
    AND?: SocialAccountScalarWhereWithAggregatesInput | SocialAccountScalarWhereWithAggregatesInput[]
    OR?: SocialAccountScalarWhereWithAggregatesInput[]
    NOT?: SocialAccountScalarWhereWithAggregatesInput | SocialAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SocialAccount"> | string
    platform?: StringWithAggregatesFilter<"SocialAccount"> | string
    accountId?: StringWithAggregatesFilter<"SocialAccount"> | string
    accessToken?: StringNullableWithAggregatesFilter<"SocialAccount"> | string | null
    isConnected?: BoolWithAggregatesFilter<"SocialAccount"> | boolean
  }

  export type ReconciliationWhereInput = {
    AND?: ReconciliationWhereInput | ReconciliationWhereInput[]
    OR?: ReconciliationWhereInput[]
    NOT?: ReconciliationWhereInput | ReconciliationWhereInput[]
    id?: StringFilter<"Reconciliation"> | string
    date?: DateTimeFilter<"Reconciliation"> | Date | string
    status?: StringFilter<"Reconciliation"> | string
    notes?: StringNullableFilter<"Reconciliation"> | string | null
    adjustments?: StockMovementListRelationFilter
  }

  export type ReconciliationOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    adjustments?: StockMovementOrderByRelationAggregateInput
  }

  export type ReconciliationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReconciliationWhereInput | ReconciliationWhereInput[]
    OR?: ReconciliationWhereInput[]
    NOT?: ReconciliationWhereInput | ReconciliationWhereInput[]
    date?: DateTimeFilter<"Reconciliation"> | Date | string
    status?: StringFilter<"Reconciliation"> | string
    notes?: StringNullableFilter<"Reconciliation"> | string | null
    adjustments?: StockMovementListRelationFilter
  }, "id">

  export type ReconciliationOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    _count?: ReconciliationCountOrderByAggregateInput
    _max?: ReconciliationMaxOrderByAggregateInput
    _min?: ReconciliationMinOrderByAggregateInput
  }

  export type ReconciliationScalarWhereWithAggregatesInput = {
    AND?: ReconciliationScalarWhereWithAggregatesInput | ReconciliationScalarWhereWithAggregatesInput[]
    OR?: ReconciliationScalarWhereWithAggregatesInput[]
    NOT?: ReconciliationScalarWhereWithAggregatesInput | ReconciliationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reconciliation"> | string
    date?: DateTimeWithAggregatesFilter<"Reconciliation"> | Date | string
    status?: StringWithAggregatesFilter<"Reconciliation"> | string
    notes?: StringNullableWithAggregatesFilter<"Reconciliation"> | string | null
  }

  export type SettingsWhereInput = {
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    id?: StringFilter<"Settings"> | string
    key?: StringFilter<"Settings"> | string
    value?: StringFilter<"Settings"> | string
  }

  export type SettingsOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    value?: StringFilter<"Settings"> | string
  }, "id" | "key">

  export type SettingsOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    _count?: SettingsCountOrderByAggregateInput
    _max?: SettingsMaxOrderByAggregateInput
    _min?: SettingsMinOrderByAggregateInput
  }

  export type SettingsScalarWhereWithAggregatesInput = {
    AND?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    OR?: SettingsScalarWhereWithAggregatesInput[]
    NOT?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Settings"> | string
    key?: StringWithAggregatesFilter<"Settings"> | string
    value?: StringWithAggregatesFilter<"Settings"> | string
  }

  export type POSItemMappingWhereInput = {
    AND?: POSItemMappingWhereInput | POSItemMappingWhereInput[]
    OR?: POSItemMappingWhereInput[]
    NOT?: POSItemMappingWhereInput | POSItemMappingWhereInput[]
    id?: StringFilter<"POSItemMapping"> | string
    posItemName?: StringFilter<"POSItemMapping"> | string
    matchedInventoryId?: StringFilter<"POSItemMapping"> | string
    lastSoldPrice?: DecimalFilter<"POSItemMapping"> | Decimal | DecimalJsLike | number | string
    confidenceScore?: DecimalNullableFilter<"POSItemMapping"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"POSItemMapping"> | Date | string
    updatedAt?: DateTimeFilter<"POSItemMapping"> | Date | string
    tenantId?: StringFilter<"POSItemMapping"> | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }

  export type POSItemMappingOrderByWithRelationInput = {
    id?: SortOrder
    posItemName?: SortOrder
    matchedInventoryId?: SortOrder
    lastSoldPrice?: SortOrder
    confidenceScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type POSItemMappingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    posItemName?: string
    AND?: POSItemMappingWhereInput | POSItemMappingWhereInput[]
    OR?: POSItemMappingWhereInput[]
    NOT?: POSItemMappingWhereInput | POSItemMappingWhereInput[]
    matchedInventoryId?: StringFilter<"POSItemMapping"> | string
    lastSoldPrice?: DecimalFilter<"POSItemMapping"> | Decimal | DecimalJsLike | number | string
    confidenceScore?: DecimalNullableFilter<"POSItemMapping"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"POSItemMapping"> | Date | string
    updatedAt?: DateTimeFilter<"POSItemMapping"> | Date | string
    tenantId?: StringFilter<"POSItemMapping"> | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }, "id" | "posItemName">

  export type POSItemMappingOrderByWithAggregationInput = {
    id?: SortOrder
    posItemName?: SortOrder
    matchedInventoryId?: SortOrder
    lastSoldPrice?: SortOrder
    confidenceScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
    _count?: POSItemMappingCountOrderByAggregateInput
    _avg?: POSItemMappingAvgOrderByAggregateInput
    _max?: POSItemMappingMaxOrderByAggregateInput
    _min?: POSItemMappingMinOrderByAggregateInput
    _sum?: POSItemMappingSumOrderByAggregateInput
  }

  export type POSItemMappingScalarWhereWithAggregatesInput = {
    AND?: POSItemMappingScalarWhereWithAggregatesInput | POSItemMappingScalarWhereWithAggregatesInput[]
    OR?: POSItemMappingScalarWhereWithAggregatesInput[]
    NOT?: POSItemMappingScalarWhereWithAggregatesInput | POSItemMappingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"POSItemMapping"> | string
    posItemName?: StringWithAggregatesFilter<"POSItemMapping"> | string
    matchedInventoryId?: StringWithAggregatesFilter<"POSItemMapping"> | string
    lastSoldPrice?: DecimalWithAggregatesFilter<"POSItemMapping"> | Decimal | DecimalJsLike | number | string
    confidenceScore?: DecimalNullableWithAggregatesFilter<"POSItemMapping"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeWithAggregatesFilter<"POSItemMapping"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"POSItemMapping"> | Date | string
    tenantId?: StringWithAggregatesFilter<"POSItemMapping"> | string
  }

  export type ProductBatchWhereInput = {
    AND?: ProductBatchWhereInput | ProductBatchWhereInput[]
    OR?: ProductBatchWhereInput[]
    NOT?: ProductBatchWhereInput | ProductBatchWhereInput[]
    id?: StringFilter<"ProductBatch"> | string
    productId?: StringFilter<"ProductBatch"> | string
    sku?: StringFilter<"ProductBatch"> | string
    quantity?: IntFilter<"ProductBatch"> | number
    expiryDate?: DateTimeFilter<"ProductBatch"> | Date | string
    receivedDate?: DateTimeFilter<"ProductBatch"> | Date | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }

  export type ProductBatchOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    expiryDate?: SortOrder
    receivedDate?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type ProductBatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductBatchWhereInput | ProductBatchWhereInput[]
    OR?: ProductBatchWhereInput[]
    NOT?: ProductBatchWhereInput | ProductBatchWhereInput[]
    productId?: StringFilter<"ProductBatch"> | string
    sku?: StringFilter<"ProductBatch"> | string
    quantity?: IntFilter<"ProductBatch"> | number
    expiryDate?: DateTimeFilter<"ProductBatch"> | Date | string
    receivedDate?: DateTimeFilter<"ProductBatch"> | Date | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }, "id">

  export type ProductBatchOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    expiryDate?: SortOrder
    receivedDate?: SortOrder
    _count?: ProductBatchCountOrderByAggregateInput
    _avg?: ProductBatchAvgOrderByAggregateInput
    _max?: ProductBatchMaxOrderByAggregateInput
    _min?: ProductBatchMinOrderByAggregateInput
    _sum?: ProductBatchSumOrderByAggregateInput
  }

  export type ProductBatchScalarWhereWithAggregatesInput = {
    AND?: ProductBatchScalarWhereWithAggregatesInput | ProductBatchScalarWhereWithAggregatesInput[]
    OR?: ProductBatchScalarWhereWithAggregatesInput[]
    NOT?: ProductBatchScalarWhereWithAggregatesInput | ProductBatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductBatch"> | string
    productId?: StringWithAggregatesFilter<"ProductBatch"> | string
    sku?: StringWithAggregatesFilter<"ProductBatch"> | string
    quantity?: IntWithAggregatesFilter<"ProductBatch"> | number
    expiryDate?: DateTimeWithAggregatesFilter<"ProductBatch"> | Date | string
    receivedDate?: DateTimeWithAggregatesFilter<"ProductBatch"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    Sales?: SaleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    Sales?: SaleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Sales?: SaleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Sales?: SaleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemCreateNestedManyWithoutProductInput
    StockMovements?: StockMovementCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemCreateNestedManyWithoutProductInput
    Batches?: ProductBatchCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemUncheckedCreateNestedManyWithoutProductInput
    StockMovements?: StockMovementUncheckedCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedCreateNestedManyWithoutProductInput
    Batches?: ProductBatchUncheckedCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUpdateManyWithoutProductNestedInput
    StockMovements?: StockMovementUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUncheckedUpdateManyWithoutProductNestedInput
    StockMovements?: StockMovementUncheckedUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUncheckedUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleCreateInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSalesInput
    customer?: CustomerCreateNestedOneWithoutSalesInput
    items?: SaleItemCreateNestedManyWithoutSaleInput
    Invoice?: InvoiceCreateNestedOneWithoutSaleInput
  }

  export type SaleUncheckedCreateInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    userId: string
    customerId?: string | null
    items?: SaleItemUncheckedCreateNestedManyWithoutSaleInput
    Invoice?: InvoiceUncheckedCreateNestedOneWithoutSaleInput
  }

  export type SaleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSalesNestedInput
    customer?: CustomerUpdateOneWithoutSalesNestedInput
    items?: SaleItemUpdateManyWithoutSaleNestedInput
    Invoice?: InvoiceUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    items?: SaleItemUncheckedUpdateManyWithoutSaleNestedInput
    Invoice?: InvoiceUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type SaleCreateManyInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    userId: string
    customerId?: string | null
  }

  export type SaleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SaleItemCreateInput = {
    id?: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
    sale: SaleCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutSaleItemsInput
  }

  export type SaleItemUncheckedCreateInput = {
    id?: string
    saleId: string
    productId: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sale?: SaleUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutSaleItemsNestedInput
  }

  export type SaleItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemCreateManyInput = {
    id?: string
    saleId: string
    productId: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type CustomerCreateInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    loyaltyPoints?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    Sales?: SaleCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    loyaltyPoints?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    Sales?: SaleUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyPoints?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Sales?: SaleUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyPoints?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Sales?: SaleUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    loyaltyPoints?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyPoints?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyPoints?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorCreateInput = {
    id?: string
    name: string
    contactPerson?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    isActive?: boolean
    PurchaseOrders?: PurchaseOrderCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateInput = {
    id?: string
    name: string
    contactPerson?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    isActive?: boolean
    PurchaseOrders?: PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    PurchaseOrders?: PurchaseOrderUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    PurchaseOrders?: PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type VendorCreateManyInput = {
    id?: string
    name: string
    contactPerson?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    isActive?: boolean
  }

  export type VendorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VendorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PurchaseOrderCreateInput = {
    id?: string
    poNumber: string
    status?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    orderDate?: Date | string
    receivedDate?: Date | string | null
    vendor: VendorCreateNestedOneWithoutPurchaseOrdersInput
    items?: PurchaseOrderItemCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUncheckedCreateInput = {
    id?: string
    poNumber: string
    vendorId: string
    status?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    orderDate?: Date | string
    receivedDate?: Date | string | null
    items?: PurchaseOrderItemUncheckedCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendor?: VendorUpdateOneRequiredWithoutPurchaseOrdersNestedInput
    items?: PurchaseOrderItemUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    items?: PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderCreateManyInput = {
    id?: string
    poNumber: string
    vendorId: string
    status?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    orderDate?: Date | string
    receivedDate?: Date | string | null
  }

  export type PurchaseOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PurchaseOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PurchaseOrderItemCreateInput = {
    id?: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    purchaseOrder: PurchaseOrderCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutPurchaseOrderItemsInput
  }

  export type PurchaseOrderItemUncheckedCreateInput = {
    id?: string
    purchaseOrderId: string
    productId: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchaseOrder?: PurchaseOrderUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutPurchaseOrderItemsNestedInput
  }

  export type PurchaseOrderItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    purchaseOrderId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemCreateManyInput = {
    id?: string
    purchaseOrderId: string
    productId: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    purchaseOrderId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type StockMovementCreateInput = {
    id?: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutStockMovementsInput
    reconciliation?: ReconciliationCreateNestedOneWithoutAdjustmentsInput
  }

  export type StockMovementUncheckedCreateInput = {
    id?: string
    productId: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
    reconciliationId?: string | null
  }

  export type StockMovementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutStockMovementsNestedInput
    reconciliation?: ReconciliationUpdateOneWithoutAdjustmentsNestedInput
  }

  export type StockMovementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconciliationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StockMovementCreateManyInput = {
    id?: string
    productId: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
    reconciliationId?: string | null
  }

  export type StockMovementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconciliationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceCreateInput = {
    id?: string
    invoiceNumber: string
    pdfUrl?: string | null
    createdAt?: Date | string
    sale: SaleCreateNestedOneWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    invoiceNumber: string
    saleId: string
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sale?: SaleUpdateOneRequiredWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyInput = {
    id?: string
    invoiceNumber: string
    saleId: string
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignCreateInput = {
    id?: string
    name: string
    type: string
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
  }

  export type CampaignUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
  }

  export type CampaignUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignCreateManyInput = {
    id?: string
    name: string
    type: string
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    budget?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
  }

  export type CampaignUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialAccountCreateInput = {
    id?: string
    platform: string
    accountId: string
    accessToken?: string | null
    isConnected?: boolean
  }

  export type SocialAccountUncheckedCreateInput = {
    id?: string
    platform: string
    accountId: string
    accessToken?: string | null
    isConnected?: boolean
  }

  export type SocialAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SocialAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SocialAccountCreateManyInput = {
    id?: string
    platform: string
    accountId: string
    accessToken?: string | null
    isConnected?: boolean
  }

  export type SocialAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SocialAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ReconciliationCreateInput = {
    id?: string
    date?: Date | string
    status?: string
    notes?: string | null
    adjustments?: StockMovementCreateNestedManyWithoutReconciliationInput
  }

  export type ReconciliationUncheckedCreateInput = {
    id?: string
    date?: Date | string
    status?: string
    notes?: string | null
    adjustments?: StockMovementUncheckedCreateNestedManyWithoutReconciliationInput
  }

  export type ReconciliationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adjustments?: StockMovementUpdateManyWithoutReconciliationNestedInput
  }

  export type ReconciliationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    adjustments?: StockMovementUncheckedUpdateManyWithoutReconciliationNestedInput
  }

  export type ReconciliationCreateManyInput = {
    id?: string
    date?: Date | string
    status?: string
    notes?: string | null
  }

  export type ReconciliationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReconciliationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SettingsCreateInput = {
    id?: string
    key: string
    value: string
  }

  export type SettingsUncheckedCreateInput = {
    id?: string
    key: string
    value: string
  }

  export type SettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingsCreateManyInput = {
    id?: string
    key: string
    value: string
  }

  export type SettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type POSItemMappingCreateInput = {
    id?: string
    posItemName: string
    lastSoldPrice: Decimal | DecimalJsLike | number | string
    confidenceScore?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
    product: ProductCreateNestedOneWithoutPOSItemMappingsInput
  }

  export type POSItemMappingUncheckedCreateInput = {
    id?: string
    posItemName: string
    matchedInventoryId: string
    lastSoldPrice: Decimal | DecimalJsLike | number | string
    confidenceScore?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
  }

  export type POSItemMappingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    posItemName?: StringFieldUpdateOperationsInput | string
    lastSoldPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    confidenceScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    product?: ProductUpdateOneRequiredWithoutPOSItemMappingsNestedInput
  }

  export type POSItemMappingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    posItemName?: StringFieldUpdateOperationsInput | string
    matchedInventoryId?: StringFieldUpdateOperationsInput | string
    lastSoldPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    confidenceScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type POSItemMappingCreateManyInput = {
    id?: string
    posItemName: string
    matchedInventoryId: string
    lastSoldPrice: Decimal | DecimalJsLike | number | string
    confidenceScore?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
  }

  export type POSItemMappingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    posItemName?: StringFieldUpdateOperationsInput | string
    lastSoldPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    confidenceScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type POSItemMappingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    posItemName?: StringFieldUpdateOperationsInput | string
    matchedInventoryId?: StringFieldUpdateOperationsInput | string
    lastSoldPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    confidenceScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type ProductBatchCreateInput = {
    id?: string
    sku: string
    quantity: number
    expiryDate: Date | string
    receivedDate?: Date | string
    product: ProductCreateNestedOneWithoutBatchesInput
  }

  export type ProductBatchUncheckedCreateInput = {
    id?: string
    productId: string
    sku: string
    quantity: number
    expiryDate: Date | string
    receivedDate?: Date | string
  }

  export type ProductBatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutBatchesNestedInput
  }

  export type ProductBatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductBatchCreateManyInput = {
    id?: string
    productId: string
    sku: string
    quantity: number
    expiryDate: Date | string
    receivedDate?: Date | string
  }

  export type ProductBatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductBatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SaleListRelationFilter = {
    every?: SaleWhereInput
    some?: SaleWhereInput
    none?: SaleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SaleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SaleItemListRelationFilter = {
    every?: SaleItemWhereInput
    some?: SaleItemWhereInput
    none?: SaleItemWhereInput
  }

  export type StockMovementListRelationFilter = {
    every?: StockMovementWhereInput
    some?: StockMovementWhereInput
    none?: StockMovementWhereInput
  }

  export type PurchaseOrderItemListRelationFilter = {
    every?: PurchaseOrderItemWhereInput
    some?: PurchaseOrderItemWhereInput
    none?: PurchaseOrderItemWhereInput
  }

  export type ProductBatchListRelationFilter = {
    every?: ProductBatchWhereInput
    some?: ProductBatchWhereInput
    none?: ProductBatchWhereInput
  }

  export type POSItemMappingListRelationFilter = {
    every?: POSItemMappingWhereInput
    some?: POSItemMappingWhereInput
    none?: POSItemMappingWhereInput
  }

  export type SaleItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StockMovementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PurchaseOrderItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductBatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type POSItemMappingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    price?: SortOrder
    costPrice?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    imageUrl?: SortOrder
    barcode?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    price?: SortOrder
    costPrice?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    price?: SortOrder
    costPrice?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    imageUrl?: SortOrder
    barcode?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    price?: SortOrder
    costPrice?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
    imageUrl?: SortOrder
    barcode?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    price?: SortOrder
    costPrice?: SortOrder
    stock?: SortOrder
    reorderLevel?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CustomerNullableRelationFilter = {
    is?: CustomerWhereInput | null
    isNot?: CustomerWhereInput | null
  }

  export type InvoiceNullableRelationFilter = {
    is?: InvoiceWhereInput | null
    isNot?: InvoiceWhereInput | null
  }

  export type SaleCountOrderByAggregateInput = {
    id?: SortOrder
    saleNumber?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
    customerId?: SortOrder
  }

  export type SaleAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    total?: SortOrder
  }

  export type SaleMaxOrderByAggregateInput = {
    id?: SortOrder
    saleNumber?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
    customerId?: SortOrder
  }

  export type SaleMinOrderByAggregateInput = {
    id?: SortOrder
    saleNumber?: SortOrder
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
    customerId?: SortOrder
  }

  export type SaleSumOrderByAggregateInput = {
    subtotal?: SortOrder
    tax?: SortOrder
    discount?: SortOrder
    total?: SortOrder
  }

  export type SaleRelationFilter = {
    is?: SaleWhereInput
    isNot?: SaleWhereInput
  }

  export type ProductRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type SaleItemCountOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type SaleItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type SaleItemMaxOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type SaleItemMinOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type SaleItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    subtotal?: SortOrder
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    loyaltyPoints?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerAvgOrderByAggregateInput = {
    loyaltyPoints?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    loyaltyPoints?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    loyaltyPoints?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerSumOrderByAggregateInput = {
    loyaltyPoints?: SortOrder
  }

  export type PurchaseOrderListRelationFilter = {
    every?: PurchaseOrderWhereInput
    some?: PurchaseOrderWhereInput
    none?: PurchaseOrderWhereInput
  }

  export type PurchaseOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VendorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
  }

  export type VendorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
  }

  export type VendorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type VendorRelationFilter = {
    is?: VendorWhereInput
    isNot?: VendorWhereInput
  }

  export type PurchaseOrderCountOrderByAggregateInput = {
    id?: SortOrder
    poNumber?: SortOrder
    vendorId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    orderDate?: SortOrder
    receivedDate?: SortOrder
  }

  export type PurchaseOrderAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type PurchaseOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    poNumber?: SortOrder
    vendorId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    orderDate?: SortOrder
    receivedDate?: SortOrder
  }

  export type PurchaseOrderMinOrderByAggregateInput = {
    id?: SortOrder
    poNumber?: SortOrder
    vendorId?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    orderDate?: SortOrder
    receivedDate?: SortOrder
  }

  export type PurchaseOrderSumOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PurchaseOrderRelationFilter = {
    is?: PurchaseOrderWhereInput
    isNot?: PurchaseOrderWhereInput
  }

  export type PurchaseOrderItemCountOrderByAggregateInput = {
    id?: SortOrder
    purchaseOrderId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    totalCost?: SortOrder
  }

  export type PurchaseOrderItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitCost?: SortOrder
    totalCost?: SortOrder
  }

  export type PurchaseOrderItemMaxOrderByAggregateInput = {
    id?: SortOrder
    purchaseOrderId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    totalCost?: SortOrder
  }

  export type PurchaseOrderItemMinOrderByAggregateInput = {
    id?: SortOrder
    purchaseOrderId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitCost?: SortOrder
    totalCost?: SortOrder
  }

  export type PurchaseOrderItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitCost?: SortOrder
    totalCost?: SortOrder
  }

  export type ReconciliationNullableRelationFilter = {
    is?: ReconciliationWhereInput | null
    isNot?: ReconciliationWhereInput | null
  }

  export type StockMovementCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    reconciliationId?: SortOrder
  }

  export type StockMovementAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type StockMovementMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    reconciliationId?: SortOrder
  }

  export type StockMovementMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    type?: SortOrder
    quantity?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    reconciliationId?: SortOrder
  }

  export type StockMovementSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    saleId?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    saleId?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    saleId?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type CampaignCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    budget?: SortOrder
    createdAt?: SortOrder
  }

  export type CampaignAvgOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type CampaignMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    budget?: SortOrder
    createdAt?: SortOrder
  }

  export type CampaignMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    budget?: SortOrder
    createdAt?: SortOrder
  }

  export type CampaignSumOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type SocialAccountCountOrderByAggregateInput = {
    id?: SortOrder
    platform?: SortOrder
    accountId?: SortOrder
    accessToken?: SortOrder
    isConnected?: SortOrder
  }

  export type SocialAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    platform?: SortOrder
    accountId?: SortOrder
    accessToken?: SortOrder
    isConnected?: SortOrder
  }

  export type SocialAccountMinOrderByAggregateInput = {
    id?: SortOrder
    platform?: SortOrder
    accountId?: SortOrder
    accessToken?: SortOrder
    isConnected?: SortOrder
  }

  export type ReconciliationCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    status?: SortOrder
    notes?: SortOrder
  }

  export type ReconciliationMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    status?: SortOrder
    notes?: SortOrder
  }

  export type ReconciliationMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    status?: SortOrder
    notes?: SortOrder
  }

  export type SettingsCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingsMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type POSItemMappingCountOrderByAggregateInput = {
    id?: SortOrder
    posItemName?: SortOrder
    matchedInventoryId?: SortOrder
    lastSoldPrice?: SortOrder
    confidenceScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
  }

  export type POSItemMappingAvgOrderByAggregateInput = {
    lastSoldPrice?: SortOrder
    confidenceScore?: SortOrder
  }

  export type POSItemMappingMaxOrderByAggregateInput = {
    id?: SortOrder
    posItemName?: SortOrder
    matchedInventoryId?: SortOrder
    lastSoldPrice?: SortOrder
    confidenceScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
  }

  export type POSItemMappingMinOrderByAggregateInput = {
    id?: SortOrder
    posItemName?: SortOrder
    matchedInventoryId?: SortOrder
    lastSoldPrice?: SortOrder
    confidenceScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantId?: SortOrder
  }

  export type POSItemMappingSumOrderByAggregateInput = {
    lastSoldPrice?: SortOrder
    confidenceScore?: SortOrder
  }

  export type ProductBatchCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    expiryDate?: SortOrder
    receivedDate?: SortOrder
  }

  export type ProductBatchAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type ProductBatchMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    expiryDate?: SortOrder
    receivedDate?: SortOrder
  }

  export type ProductBatchMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    expiryDate?: SortOrder
    receivedDate?: SortOrder
  }

  export type ProductBatchSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type SaleCreateNestedManyWithoutUserInput = {
    create?: XOR<SaleCreateWithoutUserInput, SaleUncheckedCreateWithoutUserInput> | SaleCreateWithoutUserInput[] | SaleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutUserInput | SaleCreateOrConnectWithoutUserInput[]
    createMany?: SaleCreateManyUserInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type SaleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SaleCreateWithoutUserInput, SaleUncheckedCreateWithoutUserInput> | SaleCreateWithoutUserInput[] | SaleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutUserInput | SaleCreateOrConnectWithoutUserInput[]
    createMany?: SaleCreateManyUserInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SaleUpdateManyWithoutUserNestedInput = {
    create?: XOR<SaleCreateWithoutUserInput, SaleUncheckedCreateWithoutUserInput> | SaleCreateWithoutUserInput[] | SaleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutUserInput | SaleCreateOrConnectWithoutUserInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutUserInput | SaleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SaleCreateManyUserInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutUserInput | SaleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutUserInput | SaleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type SaleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SaleCreateWithoutUserInput, SaleUncheckedCreateWithoutUserInput> | SaleCreateWithoutUserInput[] | SaleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutUserInput | SaleCreateOrConnectWithoutUserInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutUserInput | SaleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SaleCreateManyUserInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutUserInput | SaleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutUserInput | SaleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type SaleItemCreateNestedManyWithoutProductInput = {
    create?: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput> | SaleItemCreateWithoutProductInput[] | SaleItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutProductInput | SaleItemCreateOrConnectWithoutProductInput[]
    createMany?: SaleItemCreateManyProductInputEnvelope
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
  }

  export type StockMovementCreateNestedManyWithoutProductInput = {
    create?: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput> | StockMovementCreateWithoutProductInput[] | StockMovementUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutProductInput | StockMovementCreateOrConnectWithoutProductInput[]
    createMany?: StockMovementCreateManyProductInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type PurchaseOrderItemCreateNestedManyWithoutProductInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutProductInput, PurchaseOrderItemUncheckedCreateWithoutProductInput> | PurchaseOrderItemCreateWithoutProductInput[] | PurchaseOrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutProductInput | PurchaseOrderItemCreateOrConnectWithoutProductInput[]
    createMany?: PurchaseOrderItemCreateManyProductInputEnvelope
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
  }

  export type ProductBatchCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductBatchCreateWithoutProductInput, ProductBatchUncheckedCreateWithoutProductInput> | ProductBatchCreateWithoutProductInput[] | ProductBatchUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductBatchCreateOrConnectWithoutProductInput | ProductBatchCreateOrConnectWithoutProductInput[]
    createMany?: ProductBatchCreateManyProductInputEnvelope
    connect?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
  }

  export type POSItemMappingCreateNestedManyWithoutProductInput = {
    create?: XOR<POSItemMappingCreateWithoutProductInput, POSItemMappingUncheckedCreateWithoutProductInput> | POSItemMappingCreateWithoutProductInput[] | POSItemMappingUncheckedCreateWithoutProductInput[]
    connectOrCreate?: POSItemMappingCreateOrConnectWithoutProductInput | POSItemMappingCreateOrConnectWithoutProductInput[]
    createMany?: POSItemMappingCreateManyProductInputEnvelope
    connect?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
  }

  export type SaleItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput> | SaleItemCreateWithoutProductInput[] | SaleItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutProductInput | SaleItemCreateOrConnectWithoutProductInput[]
    createMany?: SaleItemCreateManyProductInputEnvelope
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
  }

  export type StockMovementUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput> | StockMovementCreateWithoutProductInput[] | StockMovementUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutProductInput | StockMovementCreateOrConnectWithoutProductInput[]
    createMany?: StockMovementCreateManyProductInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type PurchaseOrderItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutProductInput, PurchaseOrderItemUncheckedCreateWithoutProductInput> | PurchaseOrderItemCreateWithoutProductInput[] | PurchaseOrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutProductInput | PurchaseOrderItemCreateOrConnectWithoutProductInput[]
    createMany?: PurchaseOrderItemCreateManyProductInputEnvelope
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
  }

  export type ProductBatchUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductBatchCreateWithoutProductInput, ProductBatchUncheckedCreateWithoutProductInput> | ProductBatchCreateWithoutProductInput[] | ProductBatchUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductBatchCreateOrConnectWithoutProductInput | ProductBatchCreateOrConnectWithoutProductInput[]
    createMany?: ProductBatchCreateManyProductInputEnvelope
    connect?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
  }

  export type POSItemMappingUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<POSItemMappingCreateWithoutProductInput, POSItemMappingUncheckedCreateWithoutProductInput> | POSItemMappingCreateWithoutProductInput[] | POSItemMappingUncheckedCreateWithoutProductInput[]
    connectOrCreate?: POSItemMappingCreateOrConnectWithoutProductInput | POSItemMappingCreateOrConnectWithoutProductInput[]
    createMany?: POSItemMappingCreateManyProductInputEnvelope
    connect?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SaleItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput> | SaleItemCreateWithoutProductInput[] | SaleItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutProductInput | SaleItemCreateOrConnectWithoutProductInput[]
    upsert?: SaleItemUpsertWithWhereUniqueWithoutProductInput | SaleItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: SaleItemCreateManyProductInputEnvelope
    set?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    disconnect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    delete?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    update?: SaleItemUpdateWithWhereUniqueWithoutProductInput | SaleItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: SaleItemUpdateManyWithWhereWithoutProductInput | SaleItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
  }

  export type StockMovementUpdateManyWithoutProductNestedInput = {
    create?: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput> | StockMovementCreateWithoutProductInput[] | StockMovementUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutProductInput | StockMovementCreateOrConnectWithoutProductInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutProductInput | StockMovementUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: StockMovementCreateManyProductInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutProductInput | StockMovementUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutProductInput | StockMovementUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type PurchaseOrderItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutProductInput, PurchaseOrderItemUncheckedCreateWithoutProductInput> | PurchaseOrderItemCreateWithoutProductInput[] | PurchaseOrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutProductInput | PurchaseOrderItemCreateOrConnectWithoutProductInput[]
    upsert?: PurchaseOrderItemUpsertWithWhereUniqueWithoutProductInput | PurchaseOrderItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PurchaseOrderItemCreateManyProductInputEnvelope
    set?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    disconnect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    delete?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    update?: PurchaseOrderItemUpdateWithWhereUniqueWithoutProductInput | PurchaseOrderItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PurchaseOrderItemUpdateManyWithWhereWithoutProductInput | PurchaseOrderItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
  }

  export type ProductBatchUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductBatchCreateWithoutProductInput, ProductBatchUncheckedCreateWithoutProductInput> | ProductBatchCreateWithoutProductInput[] | ProductBatchUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductBatchCreateOrConnectWithoutProductInput | ProductBatchCreateOrConnectWithoutProductInput[]
    upsert?: ProductBatchUpsertWithWhereUniqueWithoutProductInput | ProductBatchUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductBatchCreateManyProductInputEnvelope
    set?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
    disconnect?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
    delete?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
    connect?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
    update?: ProductBatchUpdateWithWhereUniqueWithoutProductInput | ProductBatchUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductBatchUpdateManyWithWhereWithoutProductInput | ProductBatchUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductBatchScalarWhereInput | ProductBatchScalarWhereInput[]
  }

  export type POSItemMappingUpdateManyWithoutProductNestedInput = {
    create?: XOR<POSItemMappingCreateWithoutProductInput, POSItemMappingUncheckedCreateWithoutProductInput> | POSItemMappingCreateWithoutProductInput[] | POSItemMappingUncheckedCreateWithoutProductInput[]
    connectOrCreate?: POSItemMappingCreateOrConnectWithoutProductInput | POSItemMappingCreateOrConnectWithoutProductInput[]
    upsert?: POSItemMappingUpsertWithWhereUniqueWithoutProductInput | POSItemMappingUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: POSItemMappingCreateManyProductInputEnvelope
    set?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
    disconnect?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
    delete?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
    connect?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
    update?: POSItemMappingUpdateWithWhereUniqueWithoutProductInput | POSItemMappingUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: POSItemMappingUpdateManyWithWhereWithoutProductInput | POSItemMappingUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: POSItemMappingScalarWhereInput | POSItemMappingScalarWhereInput[]
  }

  export type SaleItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput> | SaleItemCreateWithoutProductInput[] | SaleItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutProductInput | SaleItemCreateOrConnectWithoutProductInput[]
    upsert?: SaleItemUpsertWithWhereUniqueWithoutProductInput | SaleItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: SaleItemCreateManyProductInputEnvelope
    set?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    disconnect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    delete?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    update?: SaleItemUpdateWithWhereUniqueWithoutProductInput | SaleItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: SaleItemUpdateManyWithWhereWithoutProductInput | SaleItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
  }

  export type StockMovementUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput> | StockMovementCreateWithoutProductInput[] | StockMovementUncheckedCreateWithoutProductInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutProductInput | StockMovementCreateOrConnectWithoutProductInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutProductInput | StockMovementUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: StockMovementCreateManyProductInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutProductInput | StockMovementUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutProductInput | StockMovementUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type PurchaseOrderItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutProductInput, PurchaseOrderItemUncheckedCreateWithoutProductInput> | PurchaseOrderItemCreateWithoutProductInput[] | PurchaseOrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutProductInput | PurchaseOrderItemCreateOrConnectWithoutProductInput[]
    upsert?: PurchaseOrderItemUpsertWithWhereUniqueWithoutProductInput | PurchaseOrderItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PurchaseOrderItemCreateManyProductInputEnvelope
    set?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    disconnect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    delete?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    update?: PurchaseOrderItemUpdateWithWhereUniqueWithoutProductInput | PurchaseOrderItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PurchaseOrderItemUpdateManyWithWhereWithoutProductInput | PurchaseOrderItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
  }

  export type ProductBatchUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductBatchCreateWithoutProductInput, ProductBatchUncheckedCreateWithoutProductInput> | ProductBatchCreateWithoutProductInput[] | ProductBatchUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductBatchCreateOrConnectWithoutProductInput | ProductBatchCreateOrConnectWithoutProductInput[]
    upsert?: ProductBatchUpsertWithWhereUniqueWithoutProductInput | ProductBatchUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductBatchCreateManyProductInputEnvelope
    set?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
    disconnect?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
    delete?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
    connect?: ProductBatchWhereUniqueInput | ProductBatchWhereUniqueInput[]
    update?: ProductBatchUpdateWithWhereUniqueWithoutProductInput | ProductBatchUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductBatchUpdateManyWithWhereWithoutProductInput | ProductBatchUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductBatchScalarWhereInput | ProductBatchScalarWhereInput[]
  }

  export type POSItemMappingUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<POSItemMappingCreateWithoutProductInput, POSItemMappingUncheckedCreateWithoutProductInput> | POSItemMappingCreateWithoutProductInput[] | POSItemMappingUncheckedCreateWithoutProductInput[]
    connectOrCreate?: POSItemMappingCreateOrConnectWithoutProductInput | POSItemMappingCreateOrConnectWithoutProductInput[]
    upsert?: POSItemMappingUpsertWithWhereUniqueWithoutProductInput | POSItemMappingUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: POSItemMappingCreateManyProductInputEnvelope
    set?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
    disconnect?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
    delete?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
    connect?: POSItemMappingWhereUniqueInput | POSItemMappingWhereUniqueInput[]
    update?: POSItemMappingUpdateWithWhereUniqueWithoutProductInput | POSItemMappingUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: POSItemMappingUpdateManyWithWhereWithoutProductInput | POSItemMappingUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: POSItemMappingScalarWhereInput | POSItemMappingScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSalesInput = {
    create?: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSalesInput
    connect?: UserWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutSalesInput = {
    create?: XOR<CustomerCreateWithoutSalesInput, CustomerUncheckedCreateWithoutSalesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutSalesInput
    connect?: CustomerWhereUniqueInput
  }

  export type SaleItemCreateNestedManyWithoutSaleInput = {
    create?: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput> | SaleItemCreateWithoutSaleInput[] | SaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutSaleInput | SaleItemCreateOrConnectWithoutSaleInput[]
    createMany?: SaleItemCreateManySaleInputEnvelope
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
  }

  export type InvoiceCreateNestedOneWithoutSaleInput = {
    create?: XOR<InvoiceCreateWithoutSaleInput, InvoiceUncheckedCreateWithoutSaleInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutSaleInput
    connect?: InvoiceWhereUniqueInput
  }

  export type SaleItemUncheckedCreateNestedManyWithoutSaleInput = {
    create?: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput> | SaleItemCreateWithoutSaleInput[] | SaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutSaleInput | SaleItemCreateOrConnectWithoutSaleInput[]
    createMany?: SaleItemCreateManySaleInputEnvelope
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedOneWithoutSaleInput = {
    create?: XOR<InvoiceCreateWithoutSaleInput, InvoiceUncheckedCreateWithoutSaleInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutSaleInput
    connect?: InvoiceWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSalesNestedInput = {
    create?: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSalesInput
    upsert?: UserUpsertWithoutSalesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSalesInput, UserUpdateWithoutSalesInput>, UserUncheckedUpdateWithoutSalesInput>
  }

  export type CustomerUpdateOneWithoutSalesNestedInput = {
    create?: XOR<CustomerCreateWithoutSalesInput, CustomerUncheckedCreateWithoutSalesInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutSalesInput
    upsert?: CustomerUpsertWithoutSalesInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutSalesInput, CustomerUpdateWithoutSalesInput>, CustomerUncheckedUpdateWithoutSalesInput>
  }

  export type SaleItemUpdateManyWithoutSaleNestedInput = {
    create?: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput> | SaleItemCreateWithoutSaleInput[] | SaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutSaleInput | SaleItemCreateOrConnectWithoutSaleInput[]
    upsert?: SaleItemUpsertWithWhereUniqueWithoutSaleInput | SaleItemUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: SaleItemCreateManySaleInputEnvelope
    set?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    disconnect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    delete?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    update?: SaleItemUpdateWithWhereUniqueWithoutSaleInput | SaleItemUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: SaleItemUpdateManyWithWhereWithoutSaleInput | SaleItemUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
  }

  export type InvoiceUpdateOneWithoutSaleNestedInput = {
    create?: XOR<InvoiceCreateWithoutSaleInput, InvoiceUncheckedCreateWithoutSaleInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutSaleInput
    upsert?: InvoiceUpsertWithoutSaleInput
    disconnect?: InvoiceWhereInput | boolean
    delete?: InvoiceWhereInput | boolean
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutSaleInput, InvoiceUpdateWithoutSaleInput>, InvoiceUncheckedUpdateWithoutSaleInput>
  }

  export type SaleItemUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput> | SaleItemCreateWithoutSaleInput[] | SaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: SaleItemCreateOrConnectWithoutSaleInput | SaleItemCreateOrConnectWithoutSaleInput[]
    upsert?: SaleItemUpsertWithWhereUniqueWithoutSaleInput | SaleItemUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: SaleItemCreateManySaleInputEnvelope
    set?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    disconnect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    delete?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    connect?: SaleItemWhereUniqueInput | SaleItemWhereUniqueInput[]
    update?: SaleItemUpdateWithWhereUniqueWithoutSaleInput | SaleItemUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: SaleItemUpdateManyWithWhereWithoutSaleInput | SaleItemUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateOneWithoutSaleNestedInput = {
    create?: XOR<InvoiceCreateWithoutSaleInput, InvoiceUncheckedCreateWithoutSaleInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutSaleInput
    upsert?: InvoiceUpsertWithoutSaleInput
    disconnect?: InvoiceWhereInput | boolean
    delete?: InvoiceWhereInput | boolean
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutSaleInput, InvoiceUpdateWithoutSaleInput>, InvoiceUncheckedUpdateWithoutSaleInput>
  }

  export type SaleCreateNestedOneWithoutItemsInput = {
    create?: XOR<SaleCreateWithoutItemsInput, SaleUncheckedCreateWithoutItemsInput>
    connectOrCreate?: SaleCreateOrConnectWithoutItemsInput
    connect?: SaleWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutSaleItemsInput = {
    create?: XOR<ProductCreateWithoutSaleItemsInput, ProductUncheckedCreateWithoutSaleItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSaleItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type SaleUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<SaleCreateWithoutItemsInput, SaleUncheckedCreateWithoutItemsInput>
    connectOrCreate?: SaleCreateOrConnectWithoutItemsInput
    upsert?: SaleUpsertWithoutItemsInput
    connect?: SaleWhereUniqueInput
    update?: XOR<XOR<SaleUpdateToOneWithWhereWithoutItemsInput, SaleUpdateWithoutItemsInput>, SaleUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutSaleItemsNestedInput = {
    create?: XOR<ProductCreateWithoutSaleItemsInput, ProductUncheckedCreateWithoutSaleItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSaleItemsInput
    upsert?: ProductUpsertWithoutSaleItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutSaleItemsInput, ProductUpdateWithoutSaleItemsInput>, ProductUncheckedUpdateWithoutSaleItemsInput>
  }

  export type SaleCreateNestedManyWithoutCustomerInput = {
    create?: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput> | SaleCreateWithoutCustomerInput[] | SaleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutCustomerInput | SaleCreateOrConnectWithoutCustomerInput[]
    createMany?: SaleCreateManyCustomerInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type SaleUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput> | SaleCreateWithoutCustomerInput[] | SaleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutCustomerInput | SaleCreateOrConnectWithoutCustomerInput[]
    createMany?: SaleCreateManyCustomerInputEnvelope
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
  }

  export type SaleUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput> | SaleCreateWithoutCustomerInput[] | SaleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutCustomerInput | SaleCreateOrConnectWithoutCustomerInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutCustomerInput | SaleUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: SaleCreateManyCustomerInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutCustomerInput | SaleUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutCustomerInput | SaleUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type SaleUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput> | SaleCreateWithoutCustomerInput[] | SaleUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: SaleCreateOrConnectWithoutCustomerInput | SaleCreateOrConnectWithoutCustomerInput[]
    upsert?: SaleUpsertWithWhereUniqueWithoutCustomerInput | SaleUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: SaleCreateManyCustomerInputEnvelope
    set?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    disconnect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    delete?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    connect?: SaleWhereUniqueInput | SaleWhereUniqueInput[]
    update?: SaleUpdateWithWhereUniqueWithoutCustomerInput | SaleUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: SaleUpdateManyWithWhereWithoutCustomerInput | SaleUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: SaleScalarWhereInput | SaleScalarWhereInput[]
  }

  export type PurchaseOrderCreateNestedManyWithoutVendorInput = {
    create?: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput> | PurchaseOrderCreateWithoutVendorInput[] | PurchaseOrderUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutVendorInput | PurchaseOrderCreateOrConnectWithoutVendorInput[]
    createMany?: PurchaseOrderCreateManyVendorInputEnvelope
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
  }

  export type PurchaseOrderUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput> | PurchaseOrderCreateWithoutVendorInput[] | PurchaseOrderUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutVendorInput | PurchaseOrderCreateOrConnectWithoutVendorInput[]
    createMany?: PurchaseOrderCreateManyVendorInputEnvelope
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
  }

  export type PurchaseOrderUpdateManyWithoutVendorNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput> | PurchaseOrderCreateWithoutVendorInput[] | PurchaseOrderUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutVendorInput | PurchaseOrderCreateOrConnectWithoutVendorInput[]
    upsert?: PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput | PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: PurchaseOrderCreateManyVendorInputEnvelope
    set?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    disconnect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    delete?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    update?: PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput | PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: PurchaseOrderUpdateManyWithWhereWithoutVendorInput | PurchaseOrderUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
  }

  export type PurchaseOrderUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput> | PurchaseOrderCreateWithoutVendorInput[] | PurchaseOrderUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutVendorInput | PurchaseOrderCreateOrConnectWithoutVendorInput[]
    upsert?: PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput | PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: PurchaseOrderCreateManyVendorInputEnvelope
    set?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    disconnect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    delete?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    connect?: PurchaseOrderWhereUniqueInput | PurchaseOrderWhereUniqueInput[]
    update?: PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput | PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: PurchaseOrderUpdateManyWithWhereWithoutVendorInput | PurchaseOrderUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
  }

  export type VendorCreateNestedOneWithoutPurchaseOrdersInput = {
    create?: XOR<VendorCreateWithoutPurchaseOrdersInput, VendorUncheckedCreateWithoutPurchaseOrdersInput>
    connectOrCreate?: VendorCreateOrConnectWithoutPurchaseOrdersInput
    connect?: VendorWhereUniqueInput
  }

  export type PurchaseOrderItemCreateNestedManyWithoutPurchaseOrderInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput> | PurchaseOrderItemCreateWithoutPurchaseOrderInput[] | PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput | PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput[]
    createMany?: PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
  }

  export type PurchaseOrderItemUncheckedCreateNestedManyWithoutPurchaseOrderInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput> | PurchaseOrderItemCreateWithoutPurchaseOrderInput[] | PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput | PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput[]
    createMany?: PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type VendorUpdateOneRequiredWithoutPurchaseOrdersNestedInput = {
    create?: XOR<VendorCreateWithoutPurchaseOrdersInput, VendorUncheckedCreateWithoutPurchaseOrdersInput>
    connectOrCreate?: VendorCreateOrConnectWithoutPurchaseOrdersInput
    upsert?: VendorUpsertWithoutPurchaseOrdersInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutPurchaseOrdersInput, VendorUpdateWithoutPurchaseOrdersInput>, VendorUncheckedUpdateWithoutPurchaseOrdersInput>
  }

  export type PurchaseOrderItemUpdateManyWithoutPurchaseOrderNestedInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput> | PurchaseOrderItemCreateWithoutPurchaseOrderInput[] | PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput | PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput[]
    upsert?: PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput | PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput[]
    createMany?: PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope
    set?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    disconnect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    delete?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    update?: PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput | PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput[]
    updateMany?: PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput | PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput[]
    deleteMany?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
  }

  export type PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderNestedInput = {
    create?: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput> | PurchaseOrderItemCreateWithoutPurchaseOrderInput[] | PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[]
    connectOrCreate?: PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput | PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput[]
    upsert?: PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput | PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput[]
    createMany?: PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope
    set?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    disconnect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    delete?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    connect?: PurchaseOrderItemWhereUniqueInput | PurchaseOrderItemWhereUniqueInput[]
    update?: PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput | PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput[]
    updateMany?: PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput | PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput[]
    deleteMany?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
  }

  export type PurchaseOrderCreateNestedOneWithoutItemsInput = {
    create?: XOR<PurchaseOrderCreateWithoutItemsInput, PurchaseOrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutItemsInput
    connect?: PurchaseOrderWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutPurchaseOrderItemsInput = {
    create?: XOR<ProductCreateWithoutPurchaseOrderItemsInput, ProductUncheckedCreateWithoutPurchaseOrderItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPurchaseOrderItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type PurchaseOrderUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<PurchaseOrderCreateWithoutItemsInput, PurchaseOrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: PurchaseOrderCreateOrConnectWithoutItemsInput
    upsert?: PurchaseOrderUpsertWithoutItemsInput
    connect?: PurchaseOrderWhereUniqueInput
    update?: XOR<XOR<PurchaseOrderUpdateToOneWithWhereWithoutItemsInput, PurchaseOrderUpdateWithoutItemsInput>, PurchaseOrderUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutPurchaseOrderItemsNestedInput = {
    create?: XOR<ProductCreateWithoutPurchaseOrderItemsInput, ProductUncheckedCreateWithoutPurchaseOrderItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPurchaseOrderItemsInput
    upsert?: ProductUpsertWithoutPurchaseOrderItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutPurchaseOrderItemsInput, ProductUpdateWithoutPurchaseOrderItemsInput>, ProductUncheckedUpdateWithoutPurchaseOrderItemsInput>
  }

  export type ProductCreateNestedOneWithoutStockMovementsInput = {
    create?: XOR<ProductCreateWithoutStockMovementsInput, ProductUncheckedCreateWithoutStockMovementsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutStockMovementsInput
    connect?: ProductWhereUniqueInput
  }

  export type ReconciliationCreateNestedOneWithoutAdjustmentsInput = {
    create?: XOR<ReconciliationCreateWithoutAdjustmentsInput, ReconciliationUncheckedCreateWithoutAdjustmentsInput>
    connectOrCreate?: ReconciliationCreateOrConnectWithoutAdjustmentsInput
    connect?: ReconciliationWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutStockMovementsNestedInput = {
    create?: XOR<ProductCreateWithoutStockMovementsInput, ProductUncheckedCreateWithoutStockMovementsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutStockMovementsInput
    upsert?: ProductUpsertWithoutStockMovementsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutStockMovementsInput, ProductUpdateWithoutStockMovementsInput>, ProductUncheckedUpdateWithoutStockMovementsInput>
  }

  export type ReconciliationUpdateOneWithoutAdjustmentsNestedInput = {
    create?: XOR<ReconciliationCreateWithoutAdjustmentsInput, ReconciliationUncheckedCreateWithoutAdjustmentsInput>
    connectOrCreate?: ReconciliationCreateOrConnectWithoutAdjustmentsInput
    upsert?: ReconciliationUpsertWithoutAdjustmentsInput
    disconnect?: ReconciliationWhereInput | boolean
    delete?: ReconciliationWhereInput | boolean
    connect?: ReconciliationWhereUniqueInput
    update?: XOR<XOR<ReconciliationUpdateToOneWithWhereWithoutAdjustmentsInput, ReconciliationUpdateWithoutAdjustmentsInput>, ReconciliationUncheckedUpdateWithoutAdjustmentsInput>
  }

  export type SaleCreateNestedOneWithoutInvoiceInput = {
    create?: XOR<SaleCreateWithoutInvoiceInput, SaleUncheckedCreateWithoutInvoiceInput>
    connectOrCreate?: SaleCreateOrConnectWithoutInvoiceInput
    connect?: SaleWhereUniqueInput
  }

  export type SaleUpdateOneRequiredWithoutInvoiceNestedInput = {
    create?: XOR<SaleCreateWithoutInvoiceInput, SaleUncheckedCreateWithoutInvoiceInput>
    connectOrCreate?: SaleCreateOrConnectWithoutInvoiceInput
    upsert?: SaleUpsertWithoutInvoiceInput
    connect?: SaleWhereUniqueInput
    update?: XOR<XOR<SaleUpdateToOneWithWhereWithoutInvoiceInput, SaleUpdateWithoutInvoiceInput>, SaleUncheckedUpdateWithoutInvoiceInput>
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type StockMovementCreateNestedManyWithoutReconciliationInput = {
    create?: XOR<StockMovementCreateWithoutReconciliationInput, StockMovementUncheckedCreateWithoutReconciliationInput> | StockMovementCreateWithoutReconciliationInput[] | StockMovementUncheckedCreateWithoutReconciliationInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutReconciliationInput | StockMovementCreateOrConnectWithoutReconciliationInput[]
    createMany?: StockMovementCreateManyReconciliationInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type StockMovementUncheckedCreateNestedManyWithoutReconciliationInput = {
    create?: XOR<StockMovementCreateWithoutReconciliationInput, StockMovementUncheckedCreateWithoutReconciliationInput> | StockMovementCreateWithoutReconciliationInput[] | StockMovementUncheckedCreateWithoutReconciliationInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutReconciliationInput | StockMovementCreateOrConnectWithoutReconciliationInput[]
    createMany?: StockMovementCreateManyReconciliationInputEnvelope
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
  }

  export type StockMovementUpdateManyWithoutReconciliationNestedInput = {
    create?: XOR<StockMovementCreateWithoutReconciliationInput, StockMovementUncheckedCreateWithoutReconciliationInput> | StockMovementCreateWithoutReconciliationInput[] | StockMovementUncheckedCreateWithoutReconciliationInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutReconciliationInput | StockMovementCreateOrConnectWithoutReconciliationInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutReconciliationInput | StockMovementUpsertWithWhereUniqueWithoutReconciliationInput[]
    createMany?: StockMovementCreateManyReconciliationInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutReconciliationInput | StockMovementUpdateWithWhereUniqueWithoutReconciliationInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutReconciliationInput | StockMovementUpdateManyWithWhereWithoutReconciliationInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type StockMovementUncheckedUpdateManyWithoutReconciliationNestedInput = {
    create?: XOR<StockMovementCreateWithoutReconciliationInput, StockMovementUncheckedCreateWithoutReconciliationInput> | StockMovementCreateWithoutReconciliationInput[] | StockMovementUncheckedCreateWithoutReconciliationInput[]
    connectOrCreate?: StockMovementCreateOrConnectWithoutReconciliationInput | StockMovementCreateOrConnectWithoutReconciliationInput[]
    upsert?: StockMovementUpsertWithWhereUniqueWithoutReconciliationInput | StockMovementUpsertWithWhereUniqueWithoutReconciliationInput[]
    createMany?: StockMovementCreateManyReconciliationInputEnvelope
    set?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    disconnect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    delete?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    connect?: StockMovementWhereUniqueInput | StockMovementWhereUniqueInput[]
    update?: StockMovementUpdateWithWhereUniqueWithoutReconciliationInput | StockMovementUpdateWithWhereUniqueWithoutReconciliationInput[]
    updateMany?: StockMovementUpdateManyWithWhereWithoutReconciliationInput | StockMovementUpdateManyWithWhereWithoutReconciliationInput[]
    deleteMany?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutPOSItemMappingsInput = {
    create?: XOR<ProductCreateWithoutPOSItemMappingsInput, ProductUncheckedCreateWithoutPOSItemMappingsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPOSItemMappingsInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutPOSItemMappingsNestedInput = {
    create?: XOR<ProductCreateWithoutPOSItemMappingsInput, ProductUncheckedCreateWithoutPOSItemMappingsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPOSItemMappingsInput
    upsert?: ProductUpsertWithoutPOSItemMappingsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutPOSItemMappingsInput, ProductUpdateWithoutPOSItemMappingsInput>, ProductUncheckedUpdateWithoutPOSItemMappingsInput>
  }

  export type ProductCreateNestedOneWithoutBatchesInput = {
    create?: XOR<ProductCreateWithoutBatchesInput, ProductUncheckedCreateWithoutBatchesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutBatchesInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutBatchesNestedInput = {
    create?: XOR<ProductCreateWithoutBatchesInput, ProductUncheckedCreateWithoutBatchesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutBatchesInput
    upsert?: ProductUpsertWithoutBatchesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutBatchesInput, ProductUpdateWithoutBatchesInput>, ProductUncheckedUpdateWithoutBatchesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type SaleCreateWithoutUserInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    customer?: CustomerCreateNestedOneWithoutSalesInput
    items?: SaleItemCreateNestedManyWithoutSaleInput
    Invoice?: InvoiceCreateNestedOneWithoutSaleInput
  }

  export type SaleUncheckedCreateWithoutUserInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    customerId?: string | null
    items?: SaleItemUncheckedCreateNestedManyWithoutSaleInput
    Invoice?: InvoiceUncheckedCreateNestedOneWithoutSaleInput
  }

  export type SaleCreateOrConnectWithoutUserInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutUserInput, SaleUncheckedCreateWithoutUserInput>
  }

  export type SaleCreateManyUserInputEnvelope = {
    data: SaleCreateManyUserInput | SaleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SaleUpsertWithWhereUniqueWithoutUserInput = {
    where: SaleWhereUniqueInput
    update: XOR<SaleUpdateWithoutUserInput, SaleUncheckedUpdateWithoutUserInput>
    create: XOR<SaleCreateWithoutUserInput, SaleUncheckedCreateWithoutUserInput>
  }

  export type SaleUpdateWithWhereUniqueWithoutUserInput = {
    where: SaleWhereUniqueInput
    data: XOR<SaleUpdateWithoutUserInput, SaleUncheckedUpdateWithoutUserInput>
  }

  export type SaleUpdateManyWithWhereWithoutUserInput = {
    where: SaleScalarWhereInput
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyWithoutUserInput>
  }

  export type SaleScalarWhereInput = {
    AND?: SaleScalarWhereInput | SaleScalarWhereInput[]
    OR?: SaleScalarWhereInput[]
    NOT?: SaleScalarWhereInput | SaleScalarWhereInput[]
    id?: StringFilter<"Sale"> | string
    saleNumber?: StringFilter<"Sale"> | string
    subtotal?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    discount?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"Sale"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Sale"> | string
    createdAt?: DateTimeFilter<"Sale"> | Date | string
    userId?: StringFilter<"Sale"> | string
    customerId?: StringNullableFilter<"Sale"> | string | null
  }

  export type SaleItemCreateWithoutProductInput = {
    id?: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
    sale: SaleCreateNestedOneWithoutItemsInput
  }

  export type SaleItemUncheckedCreateWithoutProductInput = {
    id?: string
    saleId: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemCreateOrConnectWithoutProductInput = {
    where: SaleItemWhereUniqueInput
    create: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput>
  }

  export type SaleItemCreateManyProductInputEnvelope = {
    data: SaleItemCreateManyProductInput | SaleItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type StockMovementCreateWithoutProductInput = {
    id?: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
    reconciliation?: ReconciliationCreateNestedOneWithoutAdjustmentsInput
  }

  export type StockMovementUncheckedCreateWithoutProductInput = {
    id?: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
    reconciliationId?: string | null
  }

  export type StockMovementCreateOrConnectWithoutProductInput = {
    where: StockMovementWhereUniqueInput
    create: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput>
  }

  export type StockMovementCreateManyProductInputEnvelope = {
    data: StockMovementCreateManyProductInput | StockMovementCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type PurchaseOrderItemCreateWithoutProductInput = {
    id?: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    purchaseOrder: PurchaseOrderCreateNestedOneWithoutItemsInput
  }

  export type PurchaseOrderItemUncheckedCreateWithoutProductInput = {
    id?: string
    purchaseOrderId: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemCreateOrConnectWithoutProductInput = {
    where: PurchaseOrderItemWhereUniqueInput
    create: XOR<PurchaseOrderItemCreateWithoutProductInput, PurchaseOrderItemUncheckedCreateWithoutProductInput>
  }

  export type PurchaseOrderItemCreateManyProductInputEnvelope = {
    data: PurchaseOrderItemCreateManyProductInput | PurchaseOrderItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type ProductBatchCreateWithoutProductInput = {
    id?: string
    sku: string
    quantity: number
    expiryDate: Date | string
    receivedDate?: Date | string
  }

  export type ProductBatchUncheckedCreateWithoutProductInput = {
    id?: string
    sku: string
    quantity: number
    expiryDate: Date | string
    receivedDate?: Date | string
  }

  export type ProductBatchCreateOrConnectWithoutProductInput = {
    where: ProductBatchWhereUniqueInput
    create: XOR<ProductBatchCreateWithoutProductInput, ProductBatchUncheckedCreateWithoutProductInput>
  }

  export type ProductBatchCreateManyProductInputEnvelope = {
    data: ProductBatchCreateManyProductInput | ProductBatchCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type POSItemMappingCreateWithoutProductInput = {
    id?: string
    posItemName: string
    lastSoldPrice: Decimal | DecimalJsLike | number | string
    confidenceScore?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
  }

  export type POSItemMappingUncheckedCreateWithoutProductInput = {
    id?: string
    posItemName: string
    lastSoldPrice: Decimal | DecimalJsLike | number | string
    confidenceScore?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
  }

  export type POSItemMappingCreateOrConnectWithoutProductInput = {
    where: POSItemMappingWhereUniqueInput
    create: XOR<POSItemMappingCreateWithoutProductInput, POSItemMappingUncheckedCreateWithoutProductInput>
  }

  export type POSItemMappingCreateManyProductInputEnvelope = {
    data: POSItemMappingCreateManyProductInput | POSItemMappingCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type SaleItemUpsertWithWhereUniqueWithoutProductInput = {
    where: SaleItemWhereUniqueInput
    update: XOR<SaleItemUpdateWithoutProductInput, SaleItemUncheckedUpdateWithoutProductInput>
    create: XOR<SaleItemCreateWithoutProductInput, SaleItemUncheckedCreateWithoutProductInput>
  }

  export type SaleItemUpdateWithWhereUniqueWithoutProductInput = {
    where: SaleItemWhereUniqueInput
    data: XOR<SaleItemUpdateWithoutProductInput, SaleItemUncheckedUpdateWithoutProductInput>
  }

  export type SaleItemUpdateManyWithWhereWithoutProductInput = {
    where: SaleItemScalarWhereInput
    data: XOR<SaleItemUpdateManyMutationInput, SaleItemUncheckedUpdateManyWithoutProductInput>
  }

  export type SaleItemScalarWhereInput = {
    AND?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
    OR?: SaleItemScalarWhereInput[]
    NOT?: SaleItemScalarWhereInput | SaleItemScalarWhereInput[]
    id?: StringFilter<"SaleItem"> | string
    saleId?: StringFilter<"SaleItem"> | string
    productId?: StringFilter<"SaleItem"> | string
    quantity?: IntFilter<"SaleItem"> | number
    unitPrice?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFilter<"SaleItem"> | Decimal | DecimalJsLike | number | string
  }

  export type StockMovementUpsertWithWhereUniqueWithoutProductInput = {
    where: StockMovementWhereUniqueInput
    update: XOR<StockMovementUpdateWithoutProductInput, StockMovementUncheckedUpdateWithoutProductInput>
    create: XOR<StockMovementCreateWithoutProductInput, StockMovementUncheckedCreateWithoutProductInput>
  }

  export type StockMovementUpdateWithWhereUniqueWithoutProductInput = {
    where: StockMovementWhereUniqueInput
    data: XOR<StockMovementUpdateWithoutProductInput, StockMovementUncheckedUpdateWithoutProductInput>
  }

  export type StockMovementUpdateManyWithWhereWithoutProductInput = {
    where: StockMovementScalarWhereInput
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyWithoutProductInput>
  }

  export type StockMovementScalarWhereInput = {
    AND?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
    OR?: StockMovementScalarWhereInput[]
    NOT?: StockMovementScalarWhereInput | StockMovementScalarWhereInput[]
    id?: StringFilter<"StockMovement"> | string
    productId?: StringFilter<"StockMovement"> | string
    type?: StringFilter<"StockMovement"> | string
    quantity?: IntFilter<"StockMovement"> | number
    description?: StringNullableFilter<"StockMovement"> | string | null
    createdAt?: DateTimeFilter<"StockMovement"> | Date | string
    reconciliationId?: StringNullableFilter<"StockMovement"> | string | null
  }

  export type PurchaseOrderItemUpsertWithWhereUniqueWithoutProductInput = {
    where: PurchaseOrderItemWhereUniqueInput
    update: XOR<PurchaseOrderItemUpdateWithoutProductInput, PurchaseOrderItemUncheckedUpdateWithoutProductInput>
    create: XOR<PurchaseOrderItemCreateWithoutProductInput, PurchaseOrderItemUncheckedCreateWithoutProductInput>
  }

  export type PurchaseOrderItemUpdateWithWhereUniqueWithoutProductInput = {
    where: PurchaseOrderItemWhereUniqueInput
    data: XOR<PurchaseOrderItemUpdateWithoutProductInput, PurchaseOrderItemUncheckedUpdateWithoutProductInput>
  }

  export type PurchaseOrderItemUpdateManyWithWhereWithoutProductInput = {
    where: PurchaseOrderItemScalarWhereInput
    data: XOR<PurchaseOrderItemUpdateManyMutationInput, PurchaseOrderItemUncheckedUpdateManyWithoutProductInput>
  }

  export type PurchaseOrderItemScalarWhereInput = {
    AND?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
    OR?: PurchaseOrderItemScalarWhereInput[]
    NOT?: PurchaseOrderItemScalarWhereInput | PurchaseOrderItemScalarWhereInput[]
    id?: StringFilter<"PurchaseOrderItem"> | string
    purchaseOrderId?: StringFilter<"PurchaseOrderItem"> | string
    productId?: StringFilter<"PurchaseOrderItem"> | string
    quantity?: IntFilter<"PurchaseOrderItem"> | number
    unitCost?: DecimalFilter<"PurchaseOrderItem"> | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFilter<"PurchaseOrderItem"> | Decimal | DecimalJsLike | number | string
  }

  export type ProductBatchUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductBatchWhereUniqueInput
    update: XOR<ProductBatchUpdateWithoutProductInput, ProductBatchUncheckedUpdateWithoutProductInput>
    create: XOR<ProductBatchCreateWithoutProductInput, ProductBatchUncheckedCreateWithoutProductInput>
  }

  export type ProductBatchUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductBatchWhereUniqueInput
    data: XOR<ProductBatchUpdateWithoutProductInput, ProductBatchUncheckedUpdateWithoutProductInput>
  }

  export type ProductBatchUpdateManyWithWhereWithoutProductInput = {
    where: ProductBatchScalarWhereInput
    data: XOR<ProductBatchUpdateManyMutationInput, ProductBatchUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductBatchScalarWhereInput = {
    AND?: ProductBatchScalarWhereInput | ProductBatchScalarWhereInput[]
    OR?: ProductBatchScalarWhereInput[]
    NOT?: ProductBatchScalarWhereInput | ProductBatchScalarWhereInput[]
    id?: StringFilter<"ProductBatch"> | string
    productId?: StringFilter<"ProductBatch"> | string
    sku?: StringFilter<"ProductBatch"> | string
    quantity?: IntFilter<"ProductBatch"> | number
    expiryDate?: DateTimeFilter<"ProductBatch"> | Date | string
    receivedDate?: DateTimeFilter<"ProductBatch"> | Date | string
  }

  export type POSItemMappingUpsertWithWhereUniqueWithoutProductInput = {
    where: POSItemMappingWhereUniqueInput
    update: XOR<POSItemMappingUpdateWithoutProductInput, POSItemMappingUncheckedUpdateWithoutProductInput>
    create: XOR<POSItemMappingCreateWithoutProductInput, POSItemMappingUncheckedCreateWithoutProductInput>
  }

  export type POSItemMappingUpdateWithWhereUniqueWithoutProductInput = {
    where: POSItemMappingWhereUniqueInput
    data: XOR<POSItemMappingUpdateWithoutProductInput, POSItemMappingUncheckedUpdateWithoutProductInput>
  }

  export type POSItemMappingUpdateManyWithWhereWithoutProductInput = {
    where: POSItemMappingScalarWhereInput
    data: XOR<POSItemMappingUpdateManyMutationInput, POSItemMappingUncheckedUpdateManyWithoutProductInput>
  }

  export type POSItemMappingScalarWhereInput = {
    AND?: POSItemMappingScalarWhereInput | POSItemMappingScalarWhereInput[]
    OR?: POSItemMappingScalarWhereInput[]
    NOT?: POSItemMappingScalarWhereInput | POSItemMappingScalarWhereInput[]
    id?: StringFilter<"POSItemMapping"> | string
    posItemName?: StringFilter<"POSItemMapping"> | string
    matchedInventoryId?: StringFilter<"POSItemMapping"> | string
    lastSoldPrice?: DecimalFilter<"POSItemMapping"> | Decimal | DecimalJsLike | number | string
    confidenceScore?: DecimalNullableFilter<"POSItemMapping"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"POSItemMapping"> | Date | string
    updatedAt?: DateTimeFilter<"POSItemMapping"> | Date | string
    tenantId?: StringFilter<"POSItemMapping"> | string
  }

  export type UserCreateWithoutSalesInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutSalesInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutSalesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
  }

  export type CustomerCreateWithoutSalesInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    loyaltyPoints?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUncheckedCreateWithoutSalesInput = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    loyaltyPoints?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateOrConnectWithoutSalesInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutSalesInput, CustomerUncheckedCreateWithoutSalesInput>
  }

  export type SaleItemCreateWithoutSaleInput = {
    id?: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
    product: ProductCreateNestedOneWithoutSaleItemsInput
  }

  export type SaleItemUncheckedCreateWithoutSaleInput = {
    id?: string
    productId: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemCreateOrConnectWithoutSaleInput = {
    where: SaleItemWhereUniqueInput
    create: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput>
  }

  export type SaleItemCreateManySaleInputEnvelope = {
    data: SaleItemCreateManySaleInput | SaleItemCreateManySaleInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceCreateWithoutSaleInput = {
    id?: string
    invoiceNumber: string
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type InvoiceUncheckedCreateWithoutSaleInput = {
    id?: string
    invoiceNumber: string
    pdfUrl?: string | null
    createdAt?: Date | string
  }

  export type InvoiceCreateOrConnectWithoutSaleInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutSaleInput, InvoiceUncheckedCreateWithoutSaleInput>
  }

  export type UserUpsertWithoutSalesInput = {
    update: XOR<UserUpdateWithoutSalesInput, UserUncheckedUpdateWithoutSalesInput>
    create: XOR<UserCreateWithoutSalesInput, UserUncheckedCreateWithoutSalesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSalesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSalesInput, UserUncheckedUpdateWithoutSalesInput>
  }

  export type UserUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUpsertWithoutSalesInput = {
    update: XOR<CustomerUpdateWithoutSalesInput, CustomerUncheckedUpdateWithoutSalesInput>
    create: XOR<CustomerCreateWithoutSalesInput, CustomerUncheckedCreateWithoutSalesInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutSalesInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutSalesInput, CustomerUncheckedUpdateWithoutSalesInput>
  }

  export type CustomerUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyPoints?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyPoints?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleItemUpsertWithWhereUniqueWithoutSaleInput = {
    where: SaleItemWhereUniqueInput
    update: XOR<SaleItemUpdateWithoutSaleInput, SaleItemUncheckedUpdateWithoutSaleInput>
    create: XOR<SaleItemCreateWithoutSaleInput, SaleItemUncheckedCreateWithoutSaleInput>
  }

  export type SaleItemUpdateWithWhereUniqueWithoutSaleInput = {
    where: SaleItemWhereUniqueInput
    data: XOR<SaleItemUpdateWithoutSaleInput, SaleItemUncheckedUpdateWithoutSaleInput>
  }

  export type SaleItemUpdateManyWithWhereWithoutSaleInput = {
    where: SaleItemScalarWhereInput
    data: XOR<SaleItemUpdateManyMutationInput, SaleItemUncheckedUpdateManyWithoutSaleInput>
  }

  export type InvoiceUpsertWithoutSaleInput = {
    update: XOR<InvoiceUpdateWithoutSaleInput, InvoiceUncheckedUpdateWithoutSaleInput>
    create: XOR<InvoiceCreateWithoutSaleInput, InvoiceUncheckedCreateWithoutSaleInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutSaleInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutSaleInput, InvoiceUncheckedUpdateWithoutSaleInput>
  }

  export type InvoiceUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaleCreateWithoutItemsInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSalesInput
    customer?: CustomerCreateNestedOneWithoutSalesInput
    Invoice?: InvoiceCreateNestedOneWithoutSaleInput
  }

  export type SaleUncheckedCreateWithoutItemsInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    userId: string
    customerId?: string | null
    Invoice?: InvoiceUncheckedCreateNestedOneWithoutSaleInput
  }

  export type SaleCreateOrConnectWithoutItemsInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutItemsInput, SaleUncheckedCreateWithoutItemsInput>
  }

  export type ProductCreateWithoutSaleItemsInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    StockMovements?: StockMovementCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemCreateNestedManyWithoutProductInput
    Batches?: ProductBatchCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutSaleItemsInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    StockMovements?: StockMovementUncheckedCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedCreateNestedManyWithoutProductInput
    Batches?: ProductBatchUncheckedCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutSaleItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutSaleItemsInput, ProductUncheckedCreateWithoutSaleItemsInput>
  }

  export type SaleUpsertWithoutItemsInput = {
    update: XOR<SaleUpdateWithoutItemsInput, SaleUncheckedUpdateWithoutItemsInput>
    create: XOR<SaleCreateWithoutItemsInput, SaleUncheckedCreateWithoutItemsInput>
    where?: SaleWhereInput
  }

  export type SaleUpdateToOneWithWhereWithoutItemsInput = {
    where?: SaleWhereInput
    data: XOR<SaleUpdateWithoutItemsInput, SaleUncheckedUpdateWithoutItemsInput>
  }

  export type SaleUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSalesNestedInput
    customer?: CustomerUpdateOneWithoutSalesNestedInput
    Invoice?: InvoiceUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    Invoice?: InvoiceUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type ProductUpsertWithoutSaleItemsInput = {
    update: XOR<ProductUpdateWithoutSaleItemsInput, ProductUncheckedUpdateWithoutSaleItemsInput>
    create: XOR<ProductCreateWithoutSaleItemsInput, ProductUncheckedCreateWithoutSaleItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutSaleItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutSaleItemsInput, ProductUncheckedUpdateWithoutSaleItemsInput>
  }

  export type ProductUpdateWithoutSaleItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    StockMovements?: StockMovementUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutSaleItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    StockMovements?: StockMovementUncheckedUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUncheckedUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUncheckedUpdateManyWithoutProductNestedInput
  }

  export type SaleCreateWithoutCustomerInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSalesInput
    items?: SaleItemCreateNestedManyWithoutSaleInput
    Invoice?: InvoiceCreateNestedOneWithoutSaleInput
  }

  export type SaleUncheckedCreateWithoutCustomerInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    userId: string
    items?: SaleItemUncheckedCreateNestedManyWithoutSaleInput
    Invoice?: InvoiceUncheckedCreateNestedOneWithoutSaleInput
  }

  export type SaleCreateOrConnectWithoutCustomerInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput>
  }

  export type SaleCreateManyCustomerInputEnvelope = {
    data: SaleCreateManyCustomerInput | SaleCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type SaleUpsertWithWhereUniqueWithoutCustomerInput = {
    where: SaleWhereUniqueInput
    update: XOR<SaleUpdateWithoutCustomerInput, SaleUncheckedUpdateWithoutCustomerInput>
    create: XOR<SaleCreateWithoutCustomerInput, SaleUncheckedCreateWithoutCustomerInput>
  }

  export type SaleUpdateWithWhereUniqueWithoutCustomerInput = {
    where: SaleWhereUniqueInput
    data: XOR<SaleUpdateWithoutCustomerInput, SaleUncheckedUpdateWithoutCustomerInput>
  }

  export type SaleUpdateManyWithWhereWithoutCustomerInput = {
    where: SaleScalarWhereInput
    data: XOR<SaleUpdateManyMutationInput, SaleUncheckedUpdateManyWithoutCustomerInput>
  }

  export type PurchaseOrderCreateWithoutVendorInput = {
    id?: string
    poNumber: string
    status?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    orderDate?: Date | string
    receivedDate?: Date | string | null
    items?: PurchaseOrderItemCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderUncheckedCreateWithoutVendorInput = {
    id?: string
    poNumber: string
    status?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    orderDate?: Date | string
    receivedDate?: Date | string | null
    items?: PurchaseOrderItemUncheckedCreateNestedManyWithoutPurchaseOrderInput
  }

  export type PurchaseOrderCreateOrConnectWithoutVendorInput = {
    where: PurchaseOrderWhereUniqueInput
    create: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput>
  }

  export type PurchaseOrderCreateManyVendorInputEnvelope = {
    data: PurchaseOrderCreateManyVendorInput | PurchaseOrderCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type PurchaseOrderUpsertWithWhereUniqueWithoutVendorInput = {
    where: PurchaseOrderWhereUniqueInput
    update: XOR<PurchaseOrderUpdateWithoutVendorInput, PurchaseOrderUncheckedUpdateWithoutVendorInput>
    create: XOR<PurchaseOrderCreateWithoutVendorInput, PurchaseOrderUncheckedCreateWithoutVendorInput>
  }

  export type PurchaseOrderUpdateWithWhereUniqueWithoutVendorInput = {
    where: PurchaseOrderWhereUniqueInput
    data: XOR<PurchaseOrderUpdateWithoutVendorInput, PurchaseOrderUncheckedUpdateWithoutVendorInput>
  }

  export type PurchaseOrderUpdateManyWithWhereWithoutVendorInput = {
    where: PurchaseOrderScalarWhereInput
    data: XOR<PurchaseOrderUpdateManyMutationInput, PurchaseOrderUncheckedUpdateManyWithoutVendorInput>
  }

  export type PurchaseOrderScalarWhereInput = {
    AND?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
    OR?: PurchaseOrderScalarWhereInput[]
    NOT?: PurchaseOrderScalarWhereInput | PurchaseOrderScalarWhereInput[]
    id?: StringFilter<"PurchaseOrder"> | string
    poNumber?: StringFilter<"PurchaseOrder"> | string
    vendorId?: StringFilter<"PurchaseOrder"> | string
    status?: StringFilter<"PurchaseOrder"> | string
    totalAmount?: DecimalFilter<"PurchaseOrder"> | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFilter<"PurchaseOrder"> | Date | string
    receivedDate?: DateTimeNullableFilter<"PurchaseOrder"> | Date | string | null
  }

  export type VendorCreateWithoutPurchaseOrdersInput = {
    id?: string
    name: string
    contactPerson?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    isActive?: boolean
  }

  export type VendorUncheckedCreateWithoutPurchaseOrdersInput = {
    id?: string
    name: string
    contactPerson?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    isActive?: boolean
  }

  export type VendorCreateOrConnectWithoutPurchaseOrdersInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutPurchaseOrdersInput, VendorUncheckedCreateWithoutPurchaseOrdersInput>
  }

  export type PurchaseOrderItemCreateWithoutPurchaseOrderInput = {
    id?: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
    product: ProductCreateNestedOneWithoutPurchaseOrderItemsInput
  }

  export type PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput = {
    id?: string
    productId: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemCreateOrConnectWithoutPurchaseOrderInput = {
    where: PurchaseOrderItemWhereUniqueInput
    create: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemCreateManyPurchaseOrderInputEnvelope = {
    data: PurchaseOrderItemCreateManyPurchaseOrderInput | PurchaseOrderItemCreateManyPurchaseOrderInput[]
    skipDuplicates?: boolean
  }

  export type VendorUpsertWithoutPurchaseOrdersInput = {
    update: XOR<VendorUpdateWithoutPurchaseOrdersInput, VendorUncheckedUpdateWithoutPurchaseOrdersInput>
    create: XOR<VendorCreateWithoutPurchaseOrdersInput, VendorUncheckedCreateWithoutPurchaseOrdersInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutPurchaseOrdersInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutPurchaseOrdersInput, VendorUncheckedUpdateWithoutPurchaseOrdersInput>
  }

  export type VendorUpdateWithoutPurchaseOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VendorUncheckedUpdateWithoutPurchaseOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PurchaseOrderItemUpsertWithWhereUniqueWithoutPurchaseOrderInput = {
    where: PurchaseOrderItemWhereUniqueInput
    update: XOR<PurchaseOrderItemUpdateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedUpdateWithoutPurchaseOrderInput>
    create: XOR<PurchaseOrderItemCreateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemUpdateWithWhereUniqueWithoutPurchaseOrderInput = {
    where: PurchaseOrderItemWhereUniqueInput
    data: XOR<PurchaseOrderItemUpdateWithoutPurchaseOrderInput, PurchaseOrderItemUncheckedUpdateWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderItemUpdateManyWithWhereWithoutPurchaseOrderInput = {
    where: PurchaseOrderItemScalarWhereInput
    data: XOR<PurchaseOrderItemUpdateManyMutationInput, PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderInput>
  }

  export type PurchaseOrderCreateWithoutItemsInput = {
    id?: string
    poNumber: string
    status?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    orderDate?: Date | string
    receivedDate?: Date | string | null
    vendor: VendorCreateNestedOneWithoutPurchaseOrdersInput
  }

  export type PurchaseOrderUncheckedCreateWithoutItemsInput = {
    id?: string
    poNumber: string
    vendorId: string
    status?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    orderDate?: Date | string
    receivedDate?: Date | string | null
  }

  export type PurchaseOrderCreateOrConnectWithoutItemsInput = {
    where: PurchaseOrderWhereUniqueInput
    create: XOR<PurchaseOrderCreateWithoutItemsInput, PurchaseOrderUncheckedCreateWithoutItemsInput>
  }

  export type ProductCreateWithoutPurchaseOrderItemsInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemCreateNestedManyWithoutProductInput
    StockMovements?: StockMovementCreateNestedManyWithoutProductInput
    Batches?: ProductBatchCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutPurchaseOrderItemsInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemUncheckedCreateNestedManyWithoutProductInput
    StockMovements?: StockMovementUncheckedCreateNestedManyWithoutProductInput
    Batches?: ProductBatchUncheckedCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutPurchaseOrderItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutPurchaseOrderItemsInput, ProductUncheckedCreateWithoutPurchaseOrderItemsInput>
  }

  export type PurchaseOrderUpsertWithoutItemsInput = {
    update: XOR<PurchaseOrderUpdateWithoutItemsInput, PurchaseOrderUncheckedUpdateWithoutItemsInput>
    create: XOR<PurchaseOrderCreateWithoutItemsInput, PurchaseOrderUncheckedCreateWithoutItemsInput>
    where?: PurchaseOrderWhereInput
  }

  export type PurchaseOrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: PurchaseOrderWhereInput
    data: XOR<PurchaseOrderUpdateWithoutItemsInput, PurchaseOrderUncheckedUpdateWithoutItemsInput>
  }

  export type PurchaseOrderUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vendor?: VendorUpdateOneRequiredWithoutPurchaseOrdersNestedInput
  }

  export type PurchaseOrderUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProductUpsertWithoutPurchaseOrderItemsInput = {
    update: XOR<ProductUpdateWithoutPurchaseOrderItemsInput, ProductUncheckedUpdateWithoutPurchaseOrderItemsInput>
    create: XOR<ProductCreateWithoutPurchaseOrderItemsInput, ProductUncheckedCreateWithoutPurchaseOrderItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutPurchaseOrderItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutPurchaseOrderItemsInput, ProductUncheckedUpdateWithoutPurchaseOrderItemsInput>
  }

  export type ProductUpdateWithoutPurchaseOrderItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUpdateManyWithoutProductNestedInput
    StockMovements?: StockMovementUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutPurchaseOrderItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUncheckedUpdateManyWithoutProductNestedInput
    StockMovements?: StockMovementUncheckedUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUncheckedUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateWithoutStockMovementsInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemCreateNestedManyWithoutProductInput
    Batches?: ProductBatchCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutStockMovementsInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemUncheckedCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedCreateNestedManyWithoutProductInput
    Batches?: ProductBatchUncheckedCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutStockMovementsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutStockMovementsInput, ProductUncheckedCreateWithoutStockMovementsInput>
  }

  export type ReconciliationCreateWithoutAdjustmentsInput = {
    id?: string
    date?: Date | string
    status?: string
    notes?: string | null
  }

  export type ReconciliationUncheckedCreateWithoutAdjustmentsInput = {
    id?: string
    date?: Date | string
    status?: string
    notes?: string | null
  }

  export type ReconciliationCreateOrConnectWithoutAdjustmentsInput = {
    where: ReconciliationWhereUniqueInput
    create: XOR<ReconciliationCreateWithoutAdjustmentsInput, ReconciliationUncheckedCreateWithoutAdjustmentsInput>
  }

  export type ProductUpsertWithoutStockMovementsInput = {
    update: XOR<ProductUpdateWithoutStockMovementsInput, ProductUncheckedUpdateWithoutStockMovementsInput>
    create: XOR<ProductCreateWithoutStockMovementsInput, ProductUncheckedCreateWithoutStockMovementsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutStockMovementsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutStockMovementsInput, ProductUncheckedUpdateWithoutStockMovementsInput>
  }

  export type ProductUpdateWithoutStockMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutStockMovementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUncheckedUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUncheckedUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ReconciliationUpsertWithoutAdjustmentsInput = {
    update: XOR<ReconciliationUpdateWithoutAdjustmentsInput, ReconciliationUncheckedUpdateWithoutAdjustmentsInput>
    create: XOR<ReconciliationCreateWithoutAdjustmentsInput, ReconciliationUncheckedCreateWithoutAdjustmentsInput>
    where?: ReconciliationWhereInput
  }

  export type ReconciliationUpdateToOneWithWhereWithoutAdjustmentsInput = {
    where?: ReconciliationWhereInput
    data: XOR<ReconciliationUpdateWithoutAdjustmentsInput, ReconciliationUncheckedUpdateWithoutAdjustmentsInput>
  }

  export type ReconciliationUpdateWithoutAdjustmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReconciliationUncheckedUpdateWithoutAdjustmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SaleCreateWithoutInvoiceInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSalesInput
    customer?: CustomerCreateNestedOneWithoutSalesInput
    items?: SaleItemCreateNestedManyWithoutSaleInput
  }

  export type SaleUncheckedCreateWithoutInvoiceInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    userId: string
    customerId?: string | null
    items?: SaleItemUncheckedCreateNestedManyWithoutSaleInput
  }

  export type SaleCreateOrConnectWithoutInvoiceInput = {
    where: SaleWhereUniqueInput
    create: XOR<SaleCreateWithoutInvoiceInput, SaleUncheckedCreateWithoutInvoiceInput>
  }

  export type SaleUpsertWithoutInvoiceInput = {
    update: XOR<SaleUpdateWithoutInvoiceInput, SaleUncheckedUpdateWithoutInvoiceInput>
    create: XOR<SaleCreateWithoutInvoiceInput, SaleUncheckedCreateWithoutInvoiceInput>
    where?: SaleWhereInput
  }

  export type SaleUpdateToOneWithWhereWithoutInvoiceInput = {
    where?: SaleWhereInput
    data: XOR<SaleUpdateWithoutInvoiceInput, SaleUncheckedUpdateWithoutInvoiceInput>
  }

  export type SaleUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSalesNestedInput
    customer?: CustomerUpdateOneWithoutSalesNestedInput
    items?: SaleItemUpdateManyWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    items?: SaleItemUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type StockMovementCreateWithoutReconciliationInput = {
    id?: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutStockMovementsInput
  }

  export type StockMovementUncheckedCreateWithoutReconciliationInput = {
    id?: string
    productId: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
  }

  export type StockMovementCreateOrConnectWithoutReconciliationInput = {
    where: StockMovementWhereUniqueInput
    create: XOR<StockMovementCreateWithoutReconciliationInput, StockMovementUncheckedCreateWithoutReconciliationInput>
  }

  export type StockMovementCreateManyReconciliationInputEnvelope = {
    data: StockMovementCreateManyReconciliationInput | StockMovementCreateManyReconciliationInput[]
    skipDuplicates?: boolean
  }

  export type StockMovementUpsertWithWhereUniqueWithoutReconciliationInput = {
    where: StockMovementWhereUniqueInput
    update: XOR<StockMovementUpdateWithoutReconciliationInput, StockMovementUncheckedUpdateWithoutReconciliationInput>
    create: XOR<StockMovementCreateWithoutReconciliationInput, StockMovementUncheckedCreateWithoutReconciliationInput>
  }

  export type StockMovementUpdateWithWhereUniqueWithoutReconciliationInput = {
    where: StockMovementWhereUniqueInput
    data: XOR<StockMovementUpdateWithoutReconciliationInput, StockMovementUncheckedUpdateWithoutReconciliationInput>
  }

  export type StockMovementUpdateManyWithWhereWithoutReconciliationInput = {
    where: StockMovementScalarWhereInput
    data: XOR<StockMovementUpdateManyMutationInput, StockMovementUncheckedUpdateManyWithoutReconciliationInput>
  }

  export type ProductCreateWithoutPOSItemMappingsInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemCreateNestedManyWithoutProductInput
    StockMovements?: StockMovementCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemCreateNestedManyWithoutProductInput
    Batches?: ProductBatchCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutPOSItemMappingsInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemUncheckedCreateNestedManyWithoutProductInput
    StockMovements?: StockMovementUncheckedCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedCreateNestedManyWithoutProductInput
    Batches?: ProductBatchUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutPOSItemMappingsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutPOSItemMappingsInput, ProductUncheckedCreateWithoutPOSItemMappingsInput>
  }

  export type ProductUpsertWithoutPOSItemMappingsInput = {
    update: XOR<ProductUpdateWithoutPOSItemMappingsInput, ProductUncheckedUpdateWithoutPOSItemMappingsInput>
    create: XOR<ProductCreateWithoutPOSItemMappingsInput, ProductUncheckedCreateWithoutPOSItemMappingsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutPOSItemMappingsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutPOSItemMappingsInput, ProductUncheckedUpdateWithoutPOSItemMappingsInput>
  }

  export type ProductUpdateWithoutPOSItemMappingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUpdateManyWithoutProductNestedInput
    StockMovements?: StockMovementUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutPOSItemMappingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUncheckedUpdateManyWithoutProductNestedInput
    StockMovements?: StockMovementUncheckedUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedUpdateManyWithoutProductNestedInput
    Batches?: ProductBatchUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateWithoutBatchesInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemCreateNestedManyWithoutProductInput
    StockMovements?: StockMovementCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutBatchesInput = {
    id?: string
    name: string
    sku: string
    category?: string | null
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    costPrice: Decimal | DecimalJsLike | number | string
    stock?: number
    reorderLevel?: number
    imageUrl?: string | null
    barcode?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SaleItems?: SaleItemUncheckedCreateNestedManyWithoutProductInput
    StockMovements?: StockMovementUncheckedCreateNestedManyWithoutProductInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedCreateNestedManyWithoutProductInput
    POSItemMappings?: POSItemMappingUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutBatchesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutBatchesInput, ProductUncheckedCreateWithoutBatchesInput>
  }

  export type ProductUpsertWithoutBatchesInput = {
    update: XOR<ProductUpdateWithoutBatchesInput, ProductUncheckedUpdateWithoutBatchesInput>
    create: XOR<ProductCreateWithoutBatchesInput, ProductUncheckedCreateWithoutBatchesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutBatchesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutBatchesInput, ProductUncheckedUpdateWithoutBatchesInput>
  }

  export type ProductUpdateWithoutBatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUpdateManyWithoutProductNestedInput
    StockMovements?: StockMovementUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutBatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    costPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SaleItems?: SaleItemUncheckedUpdateManyWithoutProductNestedInput
    StockMovements?: StockMovementUncheckedUpdateManyWithoutProductNestedInput
    PurchaseOrderItems?: PurchaseOrderItemUncheckedUpdateManyWithoutProductNestedInput
    POSItemMappings?: POSItemMappingUncheckedUpdateManyWithoutProductNestedInput
  }

  export type SaleCreateManyUserInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    customerId?: string | null
  }

  export type SaleUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneWithoutSalesNestedInput
    items?: SaleItemUpdateManyWithoutSaleNestedInput
    Invoice?: InvoiceUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    items?: SaleItemUncheckedUpdateManyWithoutSaleNestedInput
    Invoice?: InvoiceUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SaleItemCreateManyProductInput = {
    id?: string
    saleId: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type StockMovementCreateManyProductInput = {
    id?: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
    reconciliationId?: string | null
  }

  export type PurchaseOrderItemCreateManyProductInput = {
    id?: string
    purchaseOrderId: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
  }

  export type ProductBatchCreateManyProductInput = {
    id?: string
    sku: string
    quantity: number
    expiryDate: Date | string
    receivedDate?: Date | string
  }

  export type POSItemMappingCreateManyProductInput = {
    id?: string
    posItemName: string
    lastSoldPrice: Decimal | DecimalJsLike | number | string
    confidenceScore?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId: string
  }

  export type SaleItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sale?: SaleUpdateOneRequiredWithoutItemsNestedInput
  }

  export type SaleItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type StockMovementUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconciliation?: ReconciliationUpdateOneWithoutAdjustmentsNestedInput
  }

  export type StockMovementUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconciliationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StockMovementUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconciliationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PurchaseOrderItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchaseOrder?: PurchaseOrderUpdateOneRequiredWithoutItemsNestedInput
  }

  export type PurchaseOrderItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    purchaseOrderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    purchaseOrderId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProductBatchUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductBatchUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductBatchUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type POSItemMappingUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    posItemName?: StringFieldUpdateOperationsInput | string
    lastSoldPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    confidenceScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type POSItemMappingUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    posItemName?: StringFieldUpdateOperationsInput | string
    lastSoldPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    confidenceScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type POSItemMappingUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    posItemName?: StringFieldUpdateOperationsInput | string
    lastSoldPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    confidenceScore?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type SaleItemCreateManySaleInput = {
    id?: string
    productId: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    subtotal: Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    product?: ProductUpdateOneRequiredWithoutSaleItemsNestedInput
  }

  export type SaleItemUncheckedUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleItemUncheckedUpdateManyWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type SaleCreateManyCustomerInput = {
    id?: string
    saleNumber: string
    subtotal: Decimal | DecimalJsLike | number | string
    tax: Decimal | DecimalJsLike | number | string
    discount: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    userId: string
  }

  export type SaleUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSalesNestedInput
    items?: SaleItemUpdateManyWithoutSaleNestedInput
    Invoice?: InvoiceUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    items?: SaleItemUncheckedUpdateManyWithoutSaleNestedInput
    Invoice?: InvoiceUncheckedUpdateOneWithoutSaleNestedInput
  }

  export type SaleUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleNumber?: StringFieldUpdateOperationsInput | string
    subtotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    discount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PurchaseOrderCreateManyVendorInput = {
    id?: string
    poNumber: string
    status?: string
    totalAmount: Decimal | DecimalJsLike | number | string
    orderDate?: Date | string
    receivedDate?: Date | string | null
  }

  export type PurchaseOrderUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    items?: PurchaseOrderItemUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    items?: PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderNestedInput
  }

  export type PurchaseOrderUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    poNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    orderDate?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PurchaseOrderItemCreateManyPurchaseOrderInput = {
    id?: string
    productId: string
    quantity: number
    unitCost: Decimal | DecimalJsLike | number | string
    totalCost: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    product?: ProductUpdateOneRequiredWithoutPurchaseOrderItemsNestedInput
  }

  export type PurchaseOrderItemUncheckedUpdateWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseOrderItemUncheckedUpdateManyWithoutPurchaseOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type StockMovementCreateManyReconciliationInput = {
    id?: string
    productId: string
    type: string
    quantity: number
    description?: string | null
    createdAt?: Date | string
  }

  export type StockMovementUpdateWithoutReconciliationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutStockMovementsNestedInput
  }

  export type StockMovementUncheckedUpdateWithoutReconciliationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockMovementUncheckedUpdateManyWithoutReconciliationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductCountOutputTypeDefaultArgs instead
     */
    export type ProductCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SaleCountOutputTypeDefaultArgs instead
     */
    export type SaleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SaleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerCountOutputTypeDefaultArgs instead
     */
    export type CustomerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VendorCountOutputTypeDefaultArgs instead
     */
    export type VendorCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VendorCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PurchaseOrderCountOutputTypeDefaultArgs instead
     */
    export type PurchaseOrderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PurchaseOrderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReconciliationCountOutputTypeDefaultArgs instead
     */
    export type ReconciliationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReconciliationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductDefaultArgs instead
     */
    export type ProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SaleDefaultArgs instead
     */
    export type SaleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SaleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SaleItemDefaultArgs instead
     */
    export type SaleItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SaleItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerDefaultArgs instead
     */
    export type CustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VendorDefaultArgs instead
     */
    export type VendorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VendorDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PurchaseOrderDefaultArgs instead
     */
    export type PurchaseOrderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PurchaseOrderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PurchaseOrderItemDefaultArgs instead
     */
    export type PurchaseOrderItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PurchaseOrderItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StockMovementDefaultArgs instead
     */
    export type StockMovementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StockMovementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceDefaultArgs instead
     */
    export type InvoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CampaignDefaultArgs instead
     */
    export type CampaignArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CampaignDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SocialAccountDefaultArgs instead
     */
    export type SocialAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SocialAccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReconciliationDefaultArgs instead
     */
    export type ReconciliationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReconciliationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SettingsDefaultArgs instead
     */
    export type SettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SettingsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use POSItemMappingDefaultArgs instead
     */
    export type POSItemMappingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = POSItemMappingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductBatchDefaultArgs instead
     */
    export type ProductBatchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductBatchDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}