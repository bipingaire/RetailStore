
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
 * Model RetailStoreTenant
 * 
 */
export type RetailStoreTenant = $Result.DefaultSelection<Prisma.$RetailStoreTenantPayload>
/**
 * Model GlobalProductMasterCatalog
 * 
 */
export type GlobalProductMasterCatalog = $Result.DefaultSelection<Prisma.$GlobalProductMasterCatalogPayload>
/**
 * Model RetailStoreInventoryItem
 * 
 */
export type RetailStoreInventoryItem = $Result.DefaultSelection<Prisma.$RetailStoreInventoryItemPayload>
/**
 * Model CustomerOrderHeader
 * 
 */
export type CustomerOrderHeader = $Result.DefaultSelection<Prisma.$CustomerOrderHeaderPayload>
/**
 * Model OrderLineItemDetail
 * 
 */
export type OrderLineItemDetail = $Result.DefaultSelection<Prisma.$OrderLineItemDetailPayload>
/**
 * Model RetailStoreCustomer
 * 
 */
export type RetailStoreCustomer = $Result.DefaultSelection<Prisma.$RetailStoreCustomerPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model VendorInvoices
 * 
 */
export type VendorInvoices = $Result.DefaultSelection<Prisma.$VendorInvoicesPayload>
/**
 * Model SuperAdminUser
 * 
 */
export type SuperAdminUser = $Result.DefaultSelection<Prisma.$SuperAdminUserPayload>

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
   * `prisma.retailStoreTenant`: Exposes CRUD operations for the **RetailStoreTenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RetailStoreTenants
    * const retailStoreTenants = await prisma.retailStoreTenant.findMany()
    * ```
    */
  get retailStoreTenant(): Prisma.RetailStoreTenantDelegate<ExtArgs>;

  /**
   * `prisma.globalProductMasterCatalog`: Exposes CRUD operations for the **GlobalProductMasterCatalog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GlobalProductMasterCatalogs
    * const globalProductMasterCatalogs = await prisma.globalProductMasterCatalog.findMany()
    * ```
    */
  get globalProductMasterCatalog(): Prisma.GlobalProductMasterCatalogDelegate<ExtArgs>;

  /**
   * `prisma.retailStoreInventoryItem`: Exposes CRUD operations for the **RetailStoreInventoryItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RetailStoreInventoryItems
    * const retailStoreInventoryItems = await prisma.retailStoreInventoryItem.findMany()
    * ```
    */
  get retailStoreInventoryItem(): Prisma.RetailStoreInventoryItemDelegate<ExtArgs>;

  /**
   * `prisma.customerOrderHeader`: Exposes CRUD operations for the **CustomerOrderHeader** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerOrderHeaders
    * const customerOrderHeaders = await prisma.customerOrderHeader.findMany()
    * ```
    */
  get customerOrderHeader(): Prisma.CustomerOrderHeaderDelegate<ExtArgs>;

  /**
   * `prisma.orderLineItemDetail`: Exposes CRUD operations for the **OrderLineItemDetail** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderLineItemDetails
    * const orderLineItemDetails = await prisma.orderLineItemDetail.findMany()
    * ```
    */
  get orderLineItemDetail(): Prisma.OrderLineItemDetailDelegate<ExtArgs>;

  /**
   * `prisma.retailStoreCustomer`: Exposes CRUD operations for the **RetailStoreCustomer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RetailStoreCustomers
    * const retailStoreCustomers = await prisma.retailStoreCustomer.findMany()
    * ```
    */
  get retailStoreCustomer(): Prisma.RetailStoreCustomerDelegate<ExtArgs>;

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
   * `prisma.vendorInvoices`: Exposes CRUD operations for the **VendorInvoices** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VendorInvoices
    * const vendorInvoices = await prisma.vendorInvoices.findMany()
    * ```
    */
  get vendorInvoices(): Prisma.VendorInvoicesDelegate<ExtArgs>;

  /**
   * `prisma.superAdminUser`: Exposes CRUD operations for the **SuperAdminUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SuperAdminUsers
    * const superAdminUsers = await prisma.superAdminUser.findMany()
    * ```
    */
  get superAdminUser(): Prisma.SuperAdminUserDelegate<ExtArgs>;
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
    RetailStoreTenant: 'RetailStoreTenant',
    GlobalProductMasterCatalog: 'GlobalProductMasterCatalog',
    RetailStoreInventoryItem: 'RetailStoreInventoryItem',
    CustomerOrderHeader: 'CustomerOrderHeader',
    OrderLineItemDetail: 'OrderLineItemDetail',
    RetailStoreCustomer: 'RetailStoreCustomer',
    Customer: 'Customer',
    VendorInvoices: 'VendorInvoices',
    SuperAdminUser: 'SuperAdminUser'
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
      modelProps: "user" | "retailStoreTenant" | "globalProductMasterCatalog" | "retailStoreInventoryItem" | "customerOrderHeader" | "orderLineItemDetail" | "retailStoreCustomer" | "customer" | "vendorInvoices" | "superAdminUser"
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
      RetailStoreTenant: {
        payload: Prisma.$RetailStoreTenantPayload<ExtArgs>
        fields: Prisma.RetailStoreTenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RetailStoreTenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RetailStoreTenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload>
          }
          findFirst: {
            args: Prisma.RetailStoreTenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RetailStoreTenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload>
          }
          findMany: {
            args: Prisma.RetailStoreTenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload>[]
          }
          create: {
            args: Prisma.RetailStoreTenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload>
          }
          createMany: {
            args: Prisma.RetailStoreTenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RetailStoreTenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload>[]
          }
          delete: {
            args: Prisma.RetailStoreTenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload>
          }
          update: {
            args: Prisma.RetailStoreTenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload>
          }
          deleteMany: {
            args: Prisma.RetailStoreTenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RetailStoreTenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RetailStoreTenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreTenantPayload>
          }
          aggregate: {
            args: Prisma.RetailStoreTenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetailStoreTenant>
          }
          groupBy: {
            args: Prisma.RetailStoreTenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<RetailStoreTenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.RetailStoreTenantCountArgs<ExtArgs>
            result: $Utils.Optional<RetailStoreTenantCountAggregateOutputType> | number
          }
        }
      }
      GlobalProductMasterCatalog: {
        payload: Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>
        fields: Prisma.GlobalProductMasterCatalogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GlobalProductMasterCatalogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GlobalProductMasterCatalogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload>
          }
          findFirst: {
            args: Prisma.GlobalProductMasterCatalogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GlobalProductMasterCatalogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload>
          }
          findMany: {
            args: Prisma.GlobalProductMasterCatalogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload>[]
          }
          create: {
            args: Prisma.GlobalProductMasterCatalogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload>
          }
          createMany: {
            args: Prisma.GlobalProductMasterCatalogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GlobalProductMasterCatalogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload>[]
          }
          delete: {
            args: Prisma.GlobalProductMasterCatalogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload>
          }
          update: {
            args: Prisma.GlobalProductMasterCatalogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload>
          }
          deleteMany: {
            args: Prisma.GlobalProductMasterCatalogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GlobalProductMasterCatalogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GlobalProductMasterCatalogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalProductMasterCatalogPayload>
          }
          aggregate: {
            args: Prisma.GlobalProductMasterCatalogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGlobalProductMasterCatalog>
          }
          groupBy: {
            args: Prisma.GlobalProductMasterCatalogGroupByArgs<ExtArgs>
            result: $Utils.Optional<GlobalProductMasterCatalogGroupByOutputType>[]
          }
          count: {
            args: Prisma.GlobalProductMasterCatalogCountArgs<ExtArgs>
            result: $Utils.Optional<GlobalProductMasterCatalogCountAggregateOutputType> | number
          }
        }
      }
      RetailStoreInventoryItem: {
        payload: Prisma.$RetailStoreInventoryItemPayload<ExtArgs>
        fields: Prisma.RetailStoreInventoryItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RetailStoreInventoryItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RetailStoreInventoryItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload>
          }
          findFirst: {
            args: Prisma.RetailStoreInventoryItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RetailStoreInventoryItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload>
          }
          findMany: {
            args: Prisma.RetailStoreInventoryItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload>[]
          }
          create: {
            args: Prisma.RetailStoreInventoryItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload>
          }
          createMany: {
            args: Prisma.RetailStoreInventoryItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RetailStoreInventoryItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload>[]
          }
          delete: {
            args: Prisma.RetailStoreInventoryItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload>
          }
          update: {
            args: Prisma.RetailStoreInventoryItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload>
          }
          deleteMany: {
            args: Prisma.RetailStoreInventoryItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RetailStoreInventoryItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RetailStoreInventoryItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreInventoryItemPayload>
          }
          aggregate: {
            args: Prisma.RetailStoreInventoryItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetailStoreInventoryItem>
          }
          groupBy: {
            args: Prisma.RetailStoreInventoryItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<RetailStoreInventoryItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.RetailStoreInventoryItemCountArgs<ExtArgs>
            result: $Utils.Optional<RetailStoreInventoryItemCountAggregateOutputType> | number
          }
        }
      }
      CustomerOrderHeader: {
        payload: Prisma.$CustomerOrderHeaderPayload<ExtArgs>
        fields: Prisma.CustomerOrderHeaderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerOrderHeaderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerOrderHeaderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload>
          }
          findFirst: {
            args: Prisma.CustomerOrderHeaderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerOrderHeaderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload>
          }
          findMany: {
            args: Prisma.CustomerOrderHeaderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload>[]
          }
          create: {
            args: Prisma.CustomerOrderHeaderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload>
          }
          createMany: {
            args: Prisma.CustomerOrderHeaderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerOrderHeaderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload>[]
          }
          delete: {
            args: Prisma.CustomerOrderHeaderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload>
          }
          update: {
            args: Prisma.CustomerOrderHeaderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload>
          }
          deleteMany: {
            args: Prisma.CustomerOrderHeaderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerOrderHeaderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerOrderHeaderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerOrderHeaderPayload>
          }
          aggregate: {
            args: Prisma.CustomerOrderHeaderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerOrderHeader>
          }
          groupBy: {
            args: Prisma.CustomerOrderHeaderGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerOrderHeaderGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerOrderHeaderCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerOrderHeaderCountAggregateOutputType> | number
          }
        }
      }
      OrderLineItemDetail: {
        payload: Prisma.$OrderLineItemDetailPayload<ExtArgs>
        fields: Prisma.OrderLineItemDetailFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderLineItemDetailFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderLineItemDetailFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload>
          }
          findFirst: {
            args: Prisma.OrderLineItemDetailFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderLineItemDetailFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload>
          }
          findMany: {
            args: Prisma.OrderLineItemDetailFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload>[]
          }
          create: {
            args: Prisma.OrderLineItemDetailCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload>
          }
          createMany: {
            args: Prisma.OrderLineItemDetailCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderLineItemDetailCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload>[]
          }
          delete: {
            args: Prisma.OrderLineItemDetailDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload>
          }
          update: {
            args: Prisma.OrderLineItemDetailUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload>
          }
          deleteMany: {
            args: Prisma.OrderLineItemDetailDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderLineItemDetailUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrderLineItemDetailUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderLineItemDetailPayload>
          }
          aggregate: {
            args: Prisma.OrderLineItemDetailAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderLineItemDetail>
          }
          groupBy: {
            args: Prisma.OrderLineItemDetailGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderLineItemDetailGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderLineItemDetailCountArgs<ExtArgs>
            result: $Utils.Optional<OrderLineItemDetailCountAggregateOutputType> | number
          }
        }
      }
      RetailStoreCustomer: {
        payload: Prisma.$RetailStoreCustomerPayload<ExtArgs>
        fields: Prisma.RetailStoreCustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RetailStoreCustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RetailStoreCustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload>
          }
          findFirst: {
            args: Prisma.RetailStoreCustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RetailStoreCustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload>
          }
          findMany: {
            args: Prisma.RetailStoreCustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload>[]
          }
          create: {
            args: Prisma.RetailStoreCustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload>
          }
          createMany: {
            args: Prisma.RetailStoreCustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RetailStoreCustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload>[]
          }
          delete: {
            args: Prisma.RetailStoreCustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload>
          }
          update: {
            args: Prisma.RetailStoreCustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload>
          }
          deleteMany: {
            args: Prisma.RetailStoreCustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RetailStoreCustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RetailStoreCustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetailStoreCustomerPayload>
          }
          aggregate: {
            args: Prisma.RetailStoreCustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetailStoreCustomer>
          }
          groupBy: {
            args: Prisma.RetailStoreCustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<RetailStoreCustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.RetailStoreCustomerCountArgs<ExtArgs>
            result: $Utils.Optional<RetailStoreCustomerCountAggregateOutputType> | number
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
      VendorInvoices: {
        payload: Prisma.$VendorInvoicesPayload<ExtArgs>
        fields: Prisma.VendorInvoicesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorInvoicesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorInvoicesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload>
          }
          findFirst: {
            args: Prisma.VendorInvoicesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorInvoicesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload>
          }
          findMany: {
            args: Prisma.VendorInvoicesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload>[]
          }
          create: {
            args: Prisma.VendorInvoicesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload>
          }
          createMany: {
            args: Prisma.VendorInvoicesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VendorInvoicesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload>[]
          }
          delete: {
            args: Prisma.VendorInvoicesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload>
          }
          update: {
            args: Prisma.VendorInvoicesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload>
          }
          deleteMany: {
            args: Prisma.VendorInvoicesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorInvoicesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VendorInvoicesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorInvoicesPayload>
          }
          aggregate: {
            args: Prisma.VendorInvoicesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendorInvoices>
          }
          groupBy: {
            args: Prisma.VendorInvoicesGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorInvoicesGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorInvoicesCountArgs<ExtArgs>
            result: $Utils.Optional<VendorInvoicesCountAggregateOutputType> | number
          }
        }
      }
      SuperAdminUser: {
        payload: Prisma.$SuperAdminUserPayload<ExtArgs>
        fields: Prisma.SuperAdminUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuperAdminUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuperAdminUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload>
          }
          findFirst: {
            args: Prisma.SuperAdminUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuperAdminUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload>
          }
          findMany: {
            args: Prisma.SuperAdminUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload>[]
          }
          create: {
            args: Prisma.SuperAdminUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload>
          }
          createMany: {
            args: Prisma.SuperAdminUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SuperAdminUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload>[]
          }
          delete: {
            args: Prisma.SuperAdminUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload>
          }
          update: {
            args: Prisma.SuperAdminUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload>
          }
          deleteMany: {
            args: Prisma.SuperAdminUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SuperAdminUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SuperAdminUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminUserPayload>
          }
          aggregate: {
            args: Prisma.SuperAdminUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSuperAdminUser>
          }
          groupBy: {
            args: Prisma.SuperAdminUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuperAdminUserCountArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminUserCountAggregateOutputType> | number
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
    RetailStoreTenants: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    RetailStoreTenants?: boolean | UserCountOutputTypeCountRetailStoreTenantsArgs
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
  export type UserCountOutputTypeCountRetailStoreTenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetailStoreTenantWhereInput
  }


  /**
   * Count Type RetailStoreTenantCountOutputType
   */

  export type RetailStoreTenantCountOutputType = {
    InventoryItems: number
    Orders: number
    VendorInvoices: number
    Customers: number
    Users: number
  }

  export type RetailStoreTenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    InventoryItems?: boolean | RetailStoreTenantCountOutputTypeCountInventoryItemsArgs
    Orders?: boolean | RetailStoreTenantCountOutputTypeCountOrdersArgs
    VendorInvoices?: boolean | RetailStoreTenantCountOutputTypeCountVendorInvoicesArgs
    Customers?: boolean | RetailStoreTenantCountOutputTypeCountCustomersArgs
    Users?: boolean | RetailStoreTenantCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * RetailStoreTenantCountOutputType without action
   */
  export type RetailStoreTenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenantCountOutputType
     */
    select?: RetailStoreTenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RetailStoreTenantCountOutputType without action
   */
  export type RetailStoreTenantCountOutputTypeCountInventoryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetailStoreInventoryItemWhereInput
  }

  /**
   * RetailStoreTenantCountOutputType without action
   */
  export type RetailStoreTenantCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerOrderHeaderWhereInput
  }

  /**
   * RetailStoreTenantCountOutputType without action
   */
  export type RetailStoreTenantCountOutputTypeCountVendorInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorInvoicesWhereInput
  }

  /**
   * RetailStoreTenantCountOutputType without action
   */
  export type RetailStoreTenantCountOutputTypeCountCustomersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
  }

  /**
   * RetailStoreTenantCountOutputType without action
   */
  export type RetailStoreTenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type GlobalProductMasterCatalogCountOutputType
   */

  export type GlobalProductMasterCatalogCountOutputType = {
    InventoryItems: number
  }

  export type GlobalProductMasterCatalogCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    InventoryItems?: boolean | GlobalProductMasterCatalogCountOutputTypeCountInventoryItemsArgs
  }

  // Custom InputTypes
  /**
   * GlobalProductMasterCatalogCountOutputType without action
   */
  export type GlobalProductMasterCatalogCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalogCountOutputType
     */
    select?: GlobalProductMasterCatalogCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GlobalProductMasterCatalogCountOutputType without action
   */
  export type GlobalProductMasterCatalogCountOutputTypeCountInventoryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetailStoreInventoryItemWhereInput
  }


  /**
   * Count Type RetailStoreInventoryItemCountOutputType
   */

  export type RetailStoreInventoryItemCountOutputType = {
    lineItems: number
  }

  export type RetailStoreInventoryItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | RetailStoreInventoryItemCountOutputTypeCountLineItemsArgs
  }

  // Custom InputTypes
  /**
   * RetailStoreInventoryItemCountOutputType without action
   */
  export type RetailStoreInventoryItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItemCountOutputType
     */
    select?: RetailStoreInventoryItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RetailStoreInventoryItemCountOutputType without action
   */
  export type RetailStoreInventoryItemCountOutputTypeCountLineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderLineItemDetailWhereInput
  }


  /**
   * Count Type CustomerOrderHeaderCountOutputType
   */

  export type CustomerOrderHeaderCountOutputType = {
    lineItems: number
  }

  export type CustomerOrderHeaderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | CustomerOrderHeaderCountOutputTypeCountLineItemsArgs
  }

  // Custom InputTypes
  /**
   * CustomerOrderHeaderCountOutputType without action
   */
  export type CustomerOrderHeaderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeaderCountOutputType
     */
    select?: CustomerOrderHeaderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerOrderHeaderCountOutputType without action
   */
  export type CustomerOrderHeaderCountOutputTypeCountLineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderLineItemDetailWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    orders: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | CustomerCountOutputTypeCountOrdersArgs
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
  export type CustomerCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerOrderHeaderWhereInput
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
    tenantId: string | null
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
    tenantId: string | null
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
    tenantId: number
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
    tenantId?: true
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
    tenantId?: true
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
    tenantId?: true
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
    tenantId: string | null
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
    tenantId?: boolean
    RetailStoreTenants?: boolean | User$RetailStoreTenantsArgs<ExtArgs>
    SuperAdminProfile?: boolean | User$SuperAdminProfileArgs<ExtArgs>
    tenant?: boolean | User$tenantArgs<ExtArgs>
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
    tenantId?: boolean
    tenant?: boolean | User$tenantArgs<ExtArgs>
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
    tenantId?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    RetailStoreTenants?: boolean | User$RetailStoreTenantsArgs<ExtArgs>
    SuperAdminProfile?: boolean | User$SuperAdminProfileArgs<ExtArgs>
    tenant?: boolean | User$tenantArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | User$tenantArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      RetailStoreTenants: Prisma.$RetailStoreTenantPayload<ExtArgs>[]
      SuperAdminProfile: Prisma.$SuperAdminUserPayload<ExtArgs> | null
      tenant: Prisma.$RetailStoreTenantPayload<ExtArgs> | null
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
      tenantId: string | null
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
    RetailStoreTenants<T extends User$RetailStoreTenantsArgs<ExtArgs> = {}>(args?: Subset<T, User$RetailStoreTenantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findMany"> | Null>
    SuperAdminProfile<T extends User$SuperAdminProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$SuperAdminProfileArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    tenant<T extends User$tenantArgs<ExtArgs> = {}>(args?: Subset<T, User$tenantArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
    readonly tenantId: FieldRef<"User", 'String'>
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
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
   * User.RetailStoreTenants
   */
  export type User$RetailStoreTenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    where?: RetailStoreTenantWhereInput
    orderBy?: RetailStoreTenantOrderByWithRelationInput | RetailStoreTenantOrderByWithRelationInput[]
    cursor?: RetailStoreTenantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RetailStoreTenantScalarFieldEnum | RetailStoreTenantScalarFieldEnum[]
  }

  /**
   * User.SuperAdminProfile
   */
  export type User$SuperAdminProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    where?: SuperAdminUserWhereInput
  }

  /**
   * User.tenant
   */
  export type User$tenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    where?: RetailStoreTenantWhereInput
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
   * Model RetailStoreTenant
   */

  export type AggregateRetailStoreTenant = {
    _count: RetailStoreTenantCountAggregateOutputType | null
    _min: RetailStoreTenantMinAggregateOutputType | null
    _max: RetailStoreTenantMaxAggregateOutputType | null
  }

  export type RetailStoreTenantMinAggregateOutputType = {
    tenantId: string | null
    storeName: string | null
    subdomain: string | null
    isActive: boolean | null
    ownerUserId: string | null
  }

  export type RetailStoreTenantMaxAggregateOutputType = {
    tenantId: string | null
    storeName: string | null
    subdomain: string | null
    isActive: boolean | null
    ownerUserId: string | null
  }

  export type RetailStoreTenantCountAggregateOutputType = {
    tenantId: number
    storeName: number
    subdomain: number
    isActive: number
    ownerUserId: number
    _all: number
  }


  export type RetailStoreTenantMinAggregateInputType = {
    tenantId?: true
    storeName?: true
    subdomain?: true
    isActive?: true
    ownerUserId?: true
  }

  export type RetailStoreTenantMaxAggregateInputType = {
    tenantId?: true
    storeName?: true
    subdomain?: true
    isActive?: true
    ownerUserId?: true
  }

  export type RetailStoreTenantCountAggregateInputType = {
    tenantId?: true
    storeName?: true
    subdomain?: true
    isActive?: true
    ownerUserId?: true
    _all?: true
  }

  export type RetailStoreTenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetailStoreTenant to aggregate.
     */
    where?: RetailStoreTenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreTenants to fetch.
     */
    orderBy?: RetailStoreTenantOrderByWithRelationInput | RetailStoreTenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RetailStoreTenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreTenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreTenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RetailStoreTenants
    **/
    _count?: true | RetailStoreTenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RetailStoreTenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RetailStoreTenantMaxAggregateInputType
  }

  export type GetRetailStoreTenantAggregateType<T extends RetailStoreTenantAggregateArgs> = {
        [P in keyof T & keyof AggregateRetailStoreTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetailStoreTenant[P]>
      : GetScalarType<T[P], AggregateRetailStoreTenant[P]>
  }




  export type RetailStoreTenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetailStoreTenantWhereInput
    orderBy?: RetailStoreTenantOrderByWithAggregationInput | RetailStoreTenantOrderByWithAggregationInput[]
    by: RetailStoreTenantScalarFieldEnum[] | RetailStoreTenantScalarFieldEnum
    having?: RetailStoreTenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RetailStoreTenantCountAggregateInputType | true
    _min?: RetailStoreTenantMinAggregateInputType
    _max?: RetailStoreTenantMaxAggregateInputType
  }

  export type RetailStoreTenantGroupByOutputType = {
    tenantId: string
    storeName: string
    subdomain: string | null
    isActive: boolean
    ownerUserId: string | null
    _count: RetailStoreTenantCountAggregateOutputType | null
    _min: RetailStoreTenantMinAggregateOutputType | null
    _max: RetailStoreTenantMaxAggregateOutputType | null
  }

  type GetRetailStoreTenantGroupByPayload<T extends RetailStoreTenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RetailStoreTenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RetailStoreTenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RetailStoreTenantGroupByOutputType[P]>
            : GetScalarType<T[P], RetailStoreTenantGroupByOutputType[P]>
        }
      >
    >


  export type RetailStoreTenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tenantId?: boolean
    storeName?: boolean
    subdomain?: boolean
    isActive?: boolean
    ownerUserId?: boolean
    owner?: boolean | RetailStoreTenant$ownerArgs<ExtArgs>
    InventoryItems?: boolean | RetailStoreTenant$InventoryItemsArgs<ExtArgs>
    Orders?: boolean | RetailStoreTenant$OrdersArgs<ExtArgs>
    VendorInvoices?: boolean | RetailStoreTenant$VendorInvoicesArgs<ExtArgs>
    Customers?: boolean | RetailStoreTenant$CustomersArgs<ExtArgs>
    Users?: boolean | RetailStoreTenant$UsersArgs<ExtArgs>
    _count?: boolean | RetailStoreTenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["retailStoreTenant"]>

  export type RetailStoreTenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tenantId?: boolean
    storeName?: boolean
    subdomain?: boolean
    isActive?: boolean
    ownerUserId?: boolean
    owner?: boolean | RetailStoreTenant$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["retailStoreTenant"]>

  export type RetailStoreTenantSelectScalar = {
    tenantId?: boolean
    storeName?: boolean
    subdomain?: boolean
    isActive?: boolean
    ownerUserId?: boolean
  }

  export type RetailStoreTenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | RetailStoreTenant$ownerArgs<ExtArgs>
    InventoryItems?: boolean | RetailStoreTenant$InventoryItemsArgs<ExtArgs>
    Orders?: boolean | RetailStoreTenant$OrdersArgs<ExtArgs>
    VendorInvoices?: boolean | RetailStoreTenant$VendorInvoicesArgs<ExtArgs>
    Customers?: boolean | RetailStoreTenant$CustomersArgs<ExtArgs>
    Users?: boolean | RetailStoreTenant$UsersArgs<ExtArgs>
    _count?: boolean | RetailStoreTenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RetailStoreTenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | RetailStoreTenant$ownerArgs<ExtArgs>
  }

  export type $RetailStoreTenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RetailStoreTenant"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs> | null
      InventoryItems: Prisma.$RetailStoreInventoryItemPayload<ExtArgs>[]
      Orders: Prisma.$CustomerOrderHeaderPayload<ExtArgs>[]
      VendorInvoices: Prisma.$VendorInvoicesPayload<ExtArgs>[]
      Customers: Prisma.$CustomerPayload<ExtArgs>[]
      Users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      tenantId: string
      storeName: string
      subdomain: string | null
      isActive: boolean
      ownerUserId: string | null
    }, ExtArgs["result"]["retailStoreTenant"]>
    composites: {}
  }

  type RetailStoreTenantGetPayload<S extends boolean | null | undefined | RetailStoreTenantDefaultArgs> = $Result.GetResult<Prisma.$RetailStoreTenantPayload, S>

  type RetailStoreTenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RetailStoreTenantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RetailStoreTenantCountAggregateInputType | true
    }

  export interface RetailStoreTenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RetailStoreTenant'], meta: { name: 'RetailStoreTenant' } }
    /**
     * Find zero or one RetailStoreTenant that matches the filter.
     * @param {RetailStoreTenantFindUniqueArgs} args - Arguments to find a RetailStoreTenant
     * @example
     * // Get one RetailStoreTenant
     * const retailStoreTenant = await prisma.retailStoreTenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RetailStoreTenantFindUniqueArgs>(args: SelectSubset<T, RetailStoreTenantFindUniqueArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RetailStoreTenant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RetailStoreTenantFindUniqueOrThrowArgs} args - Arguments to find a RetailStoreTenant
     * @example
     * // Get one RetailStoreTenant
     * const retailStoreTenant = await prisma.retailStoreTenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RetailStoreTenantFindUniqueOrThrowArgs>(args: SelectSubset<T, RetailStoreTenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RetailStoreTenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreTenantFindFirstArgs} args - Arguments to find a RetailStoreTenant
     * @example
     * // Get one RetailStoreTenant
     * const retailStoreTenant = await prisma.retailStoreTenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RetailStoreTenantFindFirstArgs>(args?: SelectSubset<T, RetailStoreTenantFindFirstArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RetailStoreTenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreTenantFindFirstOrThrowArgs} args - Arguments to find a RetailStoreTenant
     * @example
     * // Get one RetailStoreTenant
     * const retailStoreTenant = await prisma.retailStoreTenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RetailStoreTenantFindFirstOrThrowArgs>(args?: SelectSubset<T, RetailStoreTenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RetailStoreTenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreTenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RetailStoreTenants
     * const retailStoreTenants = await prisma.retailStoreTenant.findMany()
     * 
     * // Get first 10 RetailStoreTenants
     * const retailStoreTenants = await prisma.retailStoreTenant.findMany({ take: 10 })
     * 
     * // Only select the `tenantId`
     * const retailStoreTenantWithTenantIdOnly = await prisma.retailStoreTenant.findMany({ select: { tenantId: true } })
     * 
     */
    findMany<T extends RetailStoreTenantFindManyArgs>(args?: SelectSubset<T, RetailStoreTenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RetailStoreTenant.
     * @param {RetailStoreTenantCreateArgs} args - Arguments to create a RetailStoreTenant.
     * @example
     * // Create one RetailStoreTenant
     * const RetailStoreTenant = await prisma.retailStoreTenant.create({
     *   data: {
     *     // ... data to create a RetailStoreTenant
     *   }
     * })
     * 
     */
    create<T extends RetailStoreTenantCreateArgs>(args: SelectSubset<T, RetailStoreTenantCreateArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RetailStoreTenants.
     * @param {RetailStoreTenantCreateManyArgs} args - Arguments to create many RetailStoreTenants.
     * @example
     * // Create many RetailStoreTenants
     * const retailStoreTenant = await prisma.retailStoreTenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RetailStoreTenantCreateManyArgs>(args?: SelectSubset<T, RetailStoreTenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RetailStoreTenants and returns the data saved in the database.
     * @param {RetailStoreTenantCreateManyAndReturnArgs} args - Arguments to create many RetailStoreTenants.
     * @example
     * // Create many RetailStoreTenants
     * const retailStoreTenant = await prisma.retailStoreTenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RetailStoreTenants and only return the `tenantId`
     * const retailStoreTenantWithTenantIdOnly = await prisma.retailStoreTenant.createManyAndReturn({ 
     *   select: { tenantId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RetailStoreTenantCreateManyAndReturnArgs>(args?: SelectSubset<T, RetailStoreTenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RetailStoreTenant.
     * @param {RetailStoreTenantDeleteArgs} args - Arguments to delete one RetailStoreTenant.
     * @example
     * // Delete one RetailStoreTenant
     * const RetailStoreTenant = await prisma.retailStoreTenant.delete({
     *   where: {
     *     // ... filter to delete one RetailStoreTenant
     *   }
     * })
     * 
     */
    delete<T extends RetailStoreTenantDeleteArgs>(args: SelectSubset<T, RetailStoreTenantDeleteArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RetailStoreTenant.
     * @param {RetailStoreTenantUpdateArgs} args - Arguments to update one RetailStoreTenant.
     * @example
     * // Update one RetailStoreTenant
     * const retailStoreTenant = await prisma.retailStoreTenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RetailStoreTenantUpdateArgs>(args: SelectSubset<T, RetailStoreTenantUpdateArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RetailStoreTenants.
     * @param {RetailStoreTenantDeleteManyArgs} args - Arguments to filter RetailStoreTenants to delete.
     * @example
     * // Delete a few RetailStoreTenants
     * const { count } = await prisma.retailStoreTenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RetailStoreTenantDeleteManyArgs>(args?: SelectSubset<T, RetailStoreTenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RetailStoreTenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreTenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RetailStoreTenants
     * const retailStoreTenant = await prisma.retailStoreTenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RetailStoreTenantUpdateManyArgs>(args: SelectSubset<T, RetailStoreTenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RetailStoreTenant.
     * @param {RetailStoreTenantUpsertArgs} args - Arguments to update or create a RetailStoreTenant.
     * @example
     * // Update or create a RetailStoreTenant
     * const retailStoreTenant = await prisma.retailStoreTenant.upsert({
     *   create: {
     *     // ... data to create a RetailStoreTenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RetailStoreTenant we want to update
     *   }
     * })
     */
    upsert<T extends RetailStoreTenantUpsertArgs>(args: SelectSubset<T, RetailStoreTenantUpsertArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RetailStoreTenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreTenantCountArgs} args - Arguments to filter RetailStoreTenants to count.
     * @example
     * // Count the number of RetailStoreTenants
     * const count = await prisma.retailStoreTenant.count({
     *   where: {
     *     // ... the filter for the RetailStoreTenants we want to count
     *   }
     * })
    **/
    count<T extends RetailStoreTenantCountArgs>(
      args?: Subset<T, RetailStoreTenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RetailStoreTenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RetailStoreTenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreTenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RetailStoreTenantAggregateArgs>(args: Subset<T, RetailStoreTenantAggregateArgs>): Prisma.PrismaPromise<GetRetailStoreTenantAggregateType<T>>

    /**
     * Group by RetailStoreTenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreTenantGroupByArgs} args - Group by arguments.
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
      T extends RetailStoreTenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RetailStoreTenantGroupByArgs['orderBy'] }
        : { orderBy?: RetailStoreTenantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RetailStoreTenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetailStoreTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RetailStoreTenant model
   */
  readonly fields: RetailStoreTenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RetailStoreTenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RetailStoreTenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends RetailStoreTenant$ownerArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenant$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    InventoryItems<T extends RetailStoreTenant$InventoryItemsArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenant$InventoryItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "findMany"> | Null>
    Orders<T extends RetailStoreTenant$OrdersArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenant$OrdersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "findMany"> | Null>
    VendorInvoices<T extends RetailStoreTenant$VendorInvoicesArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenant$VendorInvoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "findMany"> | Null>
    Customers<T extends RetailStoreTenant$CustomersArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenant$CustomersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany"> | Null>
    Users<T extends RetailStoreTenant$UsersArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenant$UsersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the RetailStoreTenant model
   */ 
  interface RetailStoreTenantFieldRefs {
    readonly tenantId: FieldRef<"RetailStoreTenant", 'String'>
    readonly storeName: FieldRef<"RetailStoreTenant", 'String'>
    readonly subdomain: FieldRef<"RetailStoreTenant", 'String'>
    readonly isActive: FieldRef<"RetailStoreTenant", 'Boolean'>
    readonly ownerUserId: FieldRef<"RetailStoreTenant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RetailStoreTenant findUnique
   */
  export type RetailStoreTenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreTenant to fetch.
     */
    where: RetailStoreTenantWhereUniqueInput
  }

  /**
   * RetailStoreTenant findUniqueOrThrow
   */
  export type RetailStoreTenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreTenant to fetch.
     */
    where: RetailStoreTenantWhereUniqueInput
  }

  /**
   * RetailStoreTenant findFirst
   */
  export type RetailStoreTenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreTenant to fetch.
     */
    where?: RetailStoreTenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreTenants to fetch.
     */
    orderBy?: RetailStoreTenantOrderByWithRelationInput | RetailStoreTenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetailStoreTenants.
     */
    cursor?: RetailStoreTenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreTenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreTenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetailStoreTenants.
     */
    distinct?: RetailStoreTenantScalarFieldEnum | RetailStoreTenantScalarFieldEnum[]
  }

  /**
   * RetailStoreTenant findFirstOrThrow
   */
  export type RetailStoreTenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreTenant to fetch.
     */
    where?: RetailStoreTenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreTenants to fetch.
     */
    orderBy?: RetailStoreTenantOrderByWithRelationInput | RetailStoreTenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetailStoreTenants.
     */
    cursor?: RetailStoreTenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreTenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreTenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetailStoreTenants.
     */
    distinct?: RetailStoreTenantScalarFieldEnum | RetailStoreTenantScalarFieldEnum[]
  }

  /**
   * RetailStoreTenant findMany
   */
  export type RetailStoreTenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreTenants to fetch.
     */
    where?: RetailStoreTenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreTenants to fetch.
     */
    orderBy?: RetailStoreTenantOrderByWithRelationInput | RetailStoreTenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RetailStoreTenants.
     */
    cursor?: RetailStoreTenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreTenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreTenants.
     */
    skip?: number
    distinct?: RetailStoreTenantScalarFieldEnum | RetailStoreTenantScalarFieldEnum[]
  }

  /**
   * RetailStoreTenant create
   */
  export type RetailStoreTenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * The data needed to create a RetailStoreTenant.
     */
    data: XOR<RetailStoreTenantCreateInput, RetailStoreTenantUncheckedCreateInput>
  }

  /**
   * RetailStoreTenant createMany
   */
  export type RetailStoreTenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RetailStoreTenants.
     */
    data: RetailStoreTenantCreateManyInput | RetailStoreTenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetailStoreTenant createManyAndReturn
   */
  export type RetailStoreTenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RetailStoreTenants.
     */
    data: RetailStoreTenantCreateManyInput | RetailStoreTenantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RetailStoreTenant update
   */
  export type RetailStoreTenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * The data needed to update a RetailStoreTenant.
     */
    data: XOR<RetailStoreTenantUpdateInput, RetailStoreTenantUncheckedUpdateInput>
    /**
     * Choose, which RetailStoreTenant to update.
     */
    where: RetailStoreTenantWhereUniqueInput
  }

  /**
   * RetailStoreTenant updateMany
   */
  export type RetailStoreTenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RetailStoreTenants.
     */
    data: XOR<RetailStoreTenantUpdateManyMutationInput, RetailStoreTenantUncheckedUpdateManyInput>
    /**
     * Filter which RetailStoreTenants to update
     */
    where?: RetailStoreTenantWhereInput
  }

  /**
   * RetailStoreTenant upsert
   */
  export type RetailStoreTenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * The filter to search for the RetailStoreTenant to update in case it exists.
     */
    where: RetailStoreTenantWhereUniqueInput
    /**
     * In case the RetailStoreTenant found by the `where` argument doesn't exist, create a new RetailStoreTenant with this data.
     */
    create: XOR<RetailStoreTenantCreateInput, RetailStoreTenantUncheckedCreateInput>
    /**
     * In case the RetailStoreTenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RetailStoreTenantUpdateInput, RetailStoreTenantUncheckedUpdateInput>
  }

  /**
   * RetailStoreTenant delete
   */
  export type RetailStoreTenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    /**
     * Filter which RetailStoreTenant to delete.
     */
    where: RetailStoreTenantWhereUniqueInput
  }

  /**
   * RetailStoreTenant deleteMany
   */
  export type RetailStoreTenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetailStoreTenants to delete
     */
    where?: RetailStoreTenantWhereInput
  }

  /**
   * RetailStoreTenant.owner
   */
  export type RetailStoreTenant$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * RetailStoreTenant.InventoryItems
   */
  export type RetailStoreTenant$InventoryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    where?: RetailStoreInventoryItemWhereInput
    orderBy?: RetailStoreInventoryItemOrderByWithRelationInput | RetailStoreInventoryItemOrderByWithRelationInput[]
    cursor?: RetailStoreInventoryItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RetailStoreInventoryItemScalarFieldEnum | RetailStoreInventoryItemScalarFieldEnum[]
  }

  /**
   * RetailStoreTenant.Orders
   */
  export type RetailStoreTenant$OrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    where?: CustomerOrderHeaderWhereInput
    orderBy?: CustomerOrderHeaderOrderByWithRelationInput | CustomerOrderHeaderOrderByWithRelationInput[]
    cursor?: CustomerOrderHeaderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerOrderHeaderScalarFieldEnum | CustomerOrderHeaderScalarFieldEnum[]
  }

  /**
   * RetailStoreTenant.VendorInvoices
   */
  export type RetailStoreTenant$VendorInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    where?: VendorInvoicesWhereInput
    orderBy?: VendorInvoicesOrderByWithRelationInput | VendorInvoicesOrderByWithRelationInput[]
    cursor?: VendorInvoicesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VendorInvoicesScalarFieldEnum | VendorInvoicesScalarFieldEnum[]
  }

  /**
   * RetailStoreTenant.Customers
   */
  export type RetailStoreTenant$CustomersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    cursor?: CustomerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * RetailStoreTenant.Users
   */
  export type RetailStoreTenant$UsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * RetailStoreTenant without action
   */
  export type RetailStoreTenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
  }


  /**
   * Model GlobalProductMasterCatalog
   */

  export type AggregateGlobalProductMasterCatalog = {
    _count: GlobalProductMasterCatalogCountAggregateOutputType | null
    _min: GlobalProductMasterCatalogMinAggregateOutputType | null
    _max: GlobalProductMasterCatalogMaxAggregateOutputType | null
  }

  export type GlobalProductMasterCatalogMinAggregateOutputType = {
    productId: string | null
    productName: string | null
    sku: string | null
    category: string | null
    description: string | null
    imageUrl: string | null
    isActive: boolean | null
  }

  export type GlobalProductMasterCatalogMaxAggregateOutputType = {
    productId: string | null
    productName: string | null
    sku: string | null
    category: string | null
    description: string | null
    imageUrl: string | null
    isActive: boolean | null
  }

  export type GlobalProductMasterCatalogCountAggregateOutputType = {
    productId: number
    productName: number
    sku: number
    category: number
    description: number
    imageUrl: number
    isActive: number
    _all: number
  }


  export type GlobalProductMasterCatalogMinAggregateInputType = {
    productId?: true
    productName?: true
    sku?: true
    category?: true
    description?: true
    imageUrl?: true
    isActive?: true
  }

  export type GlobalProductMasterCatalogMaxAggregateInputType = {
    productId?: true
    productName?: true
    sku?: true
    category?: true
    description?: true
    imageUrl?: true
    isActive?: true
  }

  export type GlobalProductMasterCatalogCountAggregateInputType = {
    productId?: true
    productName?: true
    sku?: true
    category?: true
    description?: true
    imageUrl?: true
    isActive?: true
    _all?: true
  }

  export type GlobalProductMasterCatalogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalProductMasterCatalog to aggregate.
     */
    where?: GlobalProductMasterCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalProductMasterCatalogs to fetch.
     */
    orderBy?: GlobalProductMasterCatalogOrderByWithRelationInput | GlobalProductMasterCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GlobalProductMasterCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalProductMasterCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalProductMasterCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GlobalProductMasterCatalogs
    **/
    _count?: true | GlobalProductMasterCatalogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GlobalProductMasterCatalogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GlobalProductMasterCatalogMaxAggregateInputType
  }

  export type GetGlobalProductMasterCatalogAggregateType<T extends GlobalProductMasterCatalogAggregateArgs> = {
        [P in keyof T & keyof AggregateGlobalProductMasterCatalog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGlobalProductMasterCatalog[P]>
      : GetScalarType<T[P], AggregateGlobalProductMasterCatalog[P]>
  }




  export type GlobalProductMasterCatalogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GlobalProductMasterCatalogWhereInput
    orderBy?: GlobalProductMasterCatalogOrderByWithAggregationInput | GlobalProductMasterCatalogOrderByWithAggregationInput[]
    by: GlobalProductMasterCatalogScalarFieldEnum[] | GlobalProductMasterCatalogScalarFieldEnum
    having?: GlobalProductMasterCatalogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GlobalProductMasterCatalogCountAggregateInputType | true
    _min?: GlobalProductMasterCatalogMinAggregateInputType
    _max?: GlobalProductMasterCatalogMaxAggregateInputType
  }

  export type GlobalProductMasterCatalogGroupByOutputType = {
    productId: string
    productName: string
    sku: string | null
    category: string | null
    description: string | null
    imageUrl: string | null
    isActive: boolean
    _count: GlobalProductMasterCatalogCountAggregateOutputType | null
    _min: GlobalProductMasterCatalogMinAggregateOutputType | null
    _max: GlobalProductMasterCatalogMaxAggregateOutputType | null
  }

  type GetGlobalProductMasterCatalogGroupByPayload<T extends GlobalProductMasterCatalogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GlobalProductMasterCatalogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GlobalProductMasterCatalogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GlobalProductMasterCatalogGroupByOutputType[P]>
            : GetScalarType<T[P], GlobalProductMasterCatalogGroupByOutputType[P]>
        }
      >
    >


  export type GlobalProductMasterCatalogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    productId?: boolean
    productName?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    imageUrl?: boolean
    isActive?: boolean
    InventoryItems?: boolean | GlobalProductMasterCatalog$InventoryItemsArgs<ExtArgs>
    _count?: boolean | GlobalProductMasterCatalogCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["globalProductMasterCatalog"]>

  export type GlobalProductMasterCatalogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    productId?: boolean
    productName?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    imageUrl?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["globalProductMasterCatalog"]>

  export type GlobalProductMasterCatalogSelectScalar = {
    productId?: boolean
    productName?: boolean
    sku?: boolean
    category?: boolean
    description?: boolean
    imageUrl?: boolean
    isActive?: boolean
  }

  export type GlobalProductMasterCatalogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    InventoryItems?: boolean | GlobalProductMasterCatalog$InventoryItemsArgs<ExtArgs>
    _count?: boolean | GlobalProductMasterCatalogCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GlobalProductMasterCatalogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GlobalProductMasterCatalogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GlobalProductMasterCatalog"
    objects: {
      InventoryItems: Prisma.$RetailStoreInventoryItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      productId: string
      productName: string
      sku: string | null
      category: string | null
      description: string | null
      imageUrl: string | null
      isActive: boolean
    }, ExtArgs["result"]["globalProductMasterCatalog"]>
    composites: {}
  }

  type GlobalProductMasterCatalogGetPayload<S extends boolean | null | undefined | GlobalProductMasterCatalogDefaultArgs> = $Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload, S>

  type GlobalProductMasterCatalogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GlobalProductMasterCatalogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GlobalProductMasterCatalogCountAggregateInputType | true
    }

  export interface GlobalProductMasterCatalogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GlobalProductMasterCatalog'], meta: { name: 'GlobalProductMasterCatalog' } }
    /**
     * Find zero or one GlobalProductMasterCatalog that matches the filter.
     * @param {GlobalProductMasterCatalogFindUniqueArgs} args - Arguments to find a GlobalProductMasterCatalog
     * @example
     * // Get one GlobalProductMasterCatalog
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GlobalProductMasterCatalogFindUniqueArgs>(args: SelectSubset<T, GlobalProductMasterCatalogFindUniqueArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GlobalProductMasterCatalog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GlobalProductMasterCatalogFindUniqueOrThrowArgs} args - Arguments to find a GlobalProductMasterCatalog
     * @example
     * // Get one GlobalProductMasterCatalog
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GlobalProductMasterCatalogFindUniqueOrThrowArgs>(args: SelectSubset<T, GlobalProductMasterCatalogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GlobalProductMasterCatalog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalProductMasterCatalogFindFirstArgs} args - Arguments to find a GlobalProductMasterCatalog
     * @example
     * // Get one GlobalProductMasterCatalog
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GlobalProductMasterCatalogFindFirstArgs>(args?: SelectSubset<T, GlobalProductMasterCatalogFindFirstArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GlobalProductMasterCatalog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalProductMasterCatalogFindFirstOrThrowArgs} args - Arguments to find a GlobalProductMasterCatalog
     * @example
     * // Get one GlobalProductMasterCatalog
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GlobalProductMasterCatalogFindFirstOrThrowArgs>(args?: SelectSubset<T, GlobalProductMasterCatalogFindFirstOrThrowArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GlobalProductMasterCatalogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalProductMasterCatalogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GlobalProductMasterCatalogs
     * const globalProductMasterCatalogs = await prisma.globalProductMasterCatalog.findMany()
     * 
     * // Get first 10 GlobalProductMasterCatalogs
     * const globalProductMasterCatalogs = await prisma.globalProductMasterCatalog.findMany({ take: 10 })
     * 
     * // Only select the `productId`
     * const globalProductMasterCatalogWithProductIdOnly = await prisma.globalProductMasterCatalog.findMany({ select: { productId: true } })
     * 
     */
    findMany<T extends GlobalProductMasterCatalogFindManyArgs>(args?: SelectSubset<T, GlobalProductMasterCatalogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GlobalProductMasterCatalog.
     * @param {GlobalProductMasterCatalogCreateArgs} args - Arguments to create a GlobalProductMasterCatalog.
     * @example
     * // Create one GlobalProductMasterCatalog
     * const GlobalProductMasterCatalog = await prisma.globalProductMasterCatalog.create({
     *   data: {
     *     // ... data to create a GlobalProductMasterCatalog
     *   }
     * })
     * 
     */
    create<T extends GlobalProductMasterCatalogCreateArgs>(args: SelectSubset<T, GlobalProductMasterCatalogCreateArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GlobalProductMasterCatalogs.
     * @param {GlobalProductMasterCatalogCreateManyArgs} args - Arguments to create many GlobalProductMasterCatalogs.
     * @example
     * // Create many GlobalProductMasterCatalogs
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GlobalProductMasterCatalogCreateManyArgs>(args?: SelectSubset<T, GlobalProductMasterCatalogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GlobalProductMasterCatalogs and returns the data saved in the database.
     * @param {GlobalProductMasterCatalogCreateManyAndReturnArgs} args - Arguments to create many GlobalProductMasterCatalogs.
     * @example
     * // Create many GlobalProductMasterCatalogs
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GlobalProductMasterCatalogs and only return the `productId`
     * const globalProductMasterCatalogWithProductIdOnly = await prisma.globalProductMasterCatalog.createManyAndReturn({ 
     *   select: { productId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GlobalProductMasterCatalogCreateManyAndReturnArgs>(args?: SelectSubset<T, GlobalProductMasterCatalogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GlobalProductMasterCatalog.
     * @param {GlobalProductMasterCatalogDeleteArgs} args - Arguments to delete one GlobalProductMasterCatalog.
     * @example
     * // Delete one GlobalProductMasterCatalog
     * const GlobalProductMasterCatalog = await prisma.globalProductMasterCatalog.delete({
     *   where: {
     *     // ... filter to delete one GlobalProductMasterCatalog
     *   }
     * })
     * 
     */
    delete<T extends GlobalProductMasterCatalogDeleteArgs>(args: SelectSubset<T, GlobalProductMasterCatalogDeleteArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GlobalProductMasterCatalog.
     * @param {GlobalProductMasterCatalogUpdateArgs} args - Arguments to update one GlobalProductMasterCatalog.
     * @example
     * // Update one GlobalProductMasterCatalog
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GlobalProductMasterCatalogUpdateArgs>(args: SelectSubset<T, GlobalProductMasterCatalogUpdateArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GlobalProductMasterCatalogs.
     * @param {GlobalProductMasterCatalogDeleteManyArgs} args - Arguments to filter GlobalProductMasterCatalogs to delete.
     * @example
     * // Delete a few GlobalProductMasterCatalogs
     * const { count } = await prisma.globalProductMasterCatalog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GlobalProductMasterCatalogDeleteManyArgs>(args?: SelectSubset<T, GlobalProductMasterCatalogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GlobalProductMasterCatalogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalProductMasterCatalogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GlobalProductMasterCatalogs
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GlobalProductMasterCatalogUpdateManyArgs>(args: SelectSubset<T, GlobalProductMasterCatalogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GlobalProductMasterCatalog.
     * @param {GlobalProductMasterCatalogUpsertArgs} args - Arguments to update or create a GlobalProductMasterCatalog.
     * @example
     * // Update or create a GlobalProductMasterCatalog
     * const globalProductMasterCatalog = await prisma.globalProductMasterCatalog.upsert({
     *   create: {
     *     // ... data to create a GlobalProductMasterCatalog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GlobalProductMasterCatalog we want to update
     *   }
     * })
     */
    upsert<T extends GlobalProductMasterCatalogUpsertArgs>(args: SelectSubset<T, GlobalProductMasterCatalogUpsertArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GlobalProductMasterCatalogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalProductMasterCatalogCountArgs} args - Arguments to filter GlobalProductMasterCatalogs to count.
     * @example
     * // Count the number of GlobalProductMasterCatalogs
     * const count = await prisma.globalProductMasterCatalog.count({
     *   where: {
     *     // ... the filter for the GlobalProductMasterCatalogs we want to count
     *   }
     * })
    **/
    count<T extends GlobalProductMasterCatalogCountArgs>(
      args?: Subset<T, GlobalProductMasterCatalogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GlobalProductMasterCatalogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GlobalProductMasterCatalog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalProductMasterCatalogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GlobalProductMasterCatalogAggregateArgs>(args: Subset<T, GlobalProductMasterCatalogAggregateArgs>): Prisma.PrismaPromise<GetGlobalProductMasterCatalogAggregateType<T>>

    /**
     * Group by GlobalProductMasterCatalog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalProductMasterCatalogGroupByArgs} args - Group by arguments.
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
      T extends GlobalProductMasterCatalogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GlobalProductMasterCatalogGroupByArgs['orderBy'] }
        : { orderBy?: GlobalProductMasterCatalogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GlobalProductMasterCatalogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGlobalProductMasterCatalogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GlobalProductMasterCatalog model
   */
  readonly fields: GlobalProductMasterCatalogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GlobalProductMasterCatalog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GlobalProductMasterCatalogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    InventoryItems<T extends GlobalProductMasterCatalog$InventoryItemsArgs<ExtArgs> = {}>(args?: Subset<T, GlobalProductMasterCatalog$InventoryItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the GlobalProductMasterCatalog model
   */ 
  interface GlobalProductMasterCatalogFieldRefs {
    readonly productId: FieldRef<"GlobalProductMasterCatalog", 'String'>
    readonly productName: FieldRef<"GlobalProductMasterCatalog", 'String'>
    readonly sku: FieldRef<"GlobalProductMasterCatalog", 'String'>
    readonly category: FieldRef<"GlobalProductMasterCatalog", 'String'>
    readonly description: FieldRef<"GlobalProductMasterCatalog", 'String'>
    readonly imageUrl: FieldRef<"GlobalProductMasterCatalog", 'String'>
    readonly isActive: FieldRef<"GlobalProductMasterCatalog", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * GlobalProductMasterCatalog findUnique
   */
  export type GlobalProductMasterCatalogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * Filter, which GlobalProductMasterCatalog to fetch.
     */
    where: GlobalProductMasterCatalogWhereUniqueInput
  }

  /**
   * GlobalProductMasterCatalog findUniqueOrThrow
   */
  export type GlobalProductMasterCatalogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * Filter, which GlobalProductMasterCatalog to fetch.
     */
    where: GlobalProductMasterCatalogWhereUniqueInput
  }

  /**
   * GlobalProductMasterCatalog findFirst
   */
  export type GlobalProductMasterCatalogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * Filter, which GlobalProductMasterCatalog to fetch.
     */
    where?: GlobalProductMasterCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalProductMasterCatalogs to fetch.
     */
    orderBy?: GlobalProductMasterCatalogOrderByWithRelationInput | GlobalProductMasterCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalProductMasterCatalogs.
     */
    cursor?: GlobalProductMasterCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalProductMasterCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalProductMasterCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalProductMasterCatalogs.
     */
    distinct?: GlobalProductMasterCatalogScalarFieldEnum | GlobalProductMasterCatalogScalarFieldEnum[]
  }

  /**
   * GlobalProductMasterCatalog findFirstOrThrow
   */
  export type GlobalProductMasterCatalogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * Filter, which GlobalProductMasterCatalog to fetch.
     */
    where?: GlobalProductMasterCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalProductMasterCatalogs to fetch.
     */
    orderBy?: GlobalProductMasterCatalogOrderByWithRelationInput | GlobalProductMasterCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalProductMasterCatalogs.
     */
    cursor?: GlobalProductMasterCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalProductMasterCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalProductMasterCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalProductMasterCatalogs.
     */
    distinct?: GlobalProductMasterCatalogScalarFieldEnum | GlobalProductMasterCatalogScalarFieldEnum[]
  }

  /**
   * GlobalProductMasterCatalog findMany
   */
  export type GlobalProductMasterCatalogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * Filter, which GlobalProductMasterCatalogs to fetch.
     */
    where?: GlobalProductMasterCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalProductMasterCatalogs to fetch.
     */
    orderBy?: GlobalProductMasterCatalogOrderByWithRelationInput | GlobalProductMasterCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GlobalProductMasterCatalogs.
     */
    cursor?: GlobalProductMasterCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalProductMasterCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalProductMasterCatalogs.
     */
    skip?: number
    distinct?: GlobalProductMasterCatalogScalarFieldEnum | GlobalProductMasterCatalogScalarFieldEnum[]
  }

  /**
   * GlobalProductMasterCatalog create
   */
  export type GlobalProductMasterCatalogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * The data needed to create a GlobalProductMasterCatalog.
     */
    data: XOR<GlobalProductMasterCatalogCreateInput, GlobalProductMasterCatalogUncheckedCreateInput>
  }

  /**
   * GlobalProductMasterCatalog createMany
   */
  export type GlobalProductMasterCatalogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GlobalProductMasterCatalogs.
     */
    data: GlobalProductMasterCatalogCreateManyInput | GlobalProductMasterCatalogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GlobalProductMasterCatalog createManyAndReturn
   */
  export type GlobalProductMasterCatalogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GlobalProductMasterCatalogs.
     */
    data: GlobalProductMasterCatalogCreateManyInput | GlobalProductMasterCatalogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GlobalProductMasterCatalog update
   */
  export type GlobalProductMasterCatalogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * The data needed to update a GlobalProductMasterCatalog.
     */
    data: XOR<GlobalProductMasterCatalogUpdateInput, GlobalProductMasterCatalogUncheckedUpdateInput>
    /**
     * Choose, which GlobalProductMasterCatalog to update.
     */
    where: GlobalProductMasterCatalogWhereUniqueInput
  }

  /**
   * GlobalProductMasterCatalog updateMany
   */
  export type GlobalProductMasterCatalogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GlobalProductMasterCatalogs.
     */
    data: XOR<GlobalProductMasterCatalogUpdateManyMutationInput, GlobalProductMasterCatalogUncheckedUpdateManyInput>
    /**
     * Filter which GlobalProductMasterCatalogs to update
     */
    where?: GlobalProductMasterCatalogWhereInput
  }

  /**
   * GlobalProductMasterCatalog upsert
   */
  export type GlobalProductMasterCatalogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * The filter to search for the GlobalProductMasterCatalog to update in case it exists.
     */
    where: GlobalProductMasterCatalogWhereUniqueInput
    /**
     * In case the GlobalProductMasterCatalog found by the `where` argument doesn't exist, create a new GlobalProductMasterCatalog with this data.
     */
    create: XOR<GlobalProductMasterCatalogCreateInput, GlobalProductMasterCatalogUncheckedCreateInput>
    /**
     * In case the GlobalProductMasterCatalog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GlobalProductMasterCatalogUpdateInput, GlobalProductMasterCatalogUncheckedUpdateInput>
  }

  /**
   * GlobalProductMasterCatalog delete
   */
  export type GlobalProductMasterCatalogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    /**
     * Filter which GlobalProductMasterCatalog to delete.
     */
    where: GlobalProductMasterCatalogWhereUniqueInput
  }

  /**
   * GlobalProductMasterCatalog deleteMany
   */
  export type GlobalProductMasterCatalogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalProductMasterCatalogs to delete
     */
    where?: GlobalProductMasterCatalogWhereInput
  }

  /**
   * GlobalProductMasterCatalog.InventoryItems
   */
  export type GlobalProductMasterCatalog$InventoryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    where?: RetailStoreInventoryItemWhereInput
    orderBy?: RetailStoreInventoryItemOrderByWithRelationInput | RetailStoreInventoryItemOrderByWithRelationInput[]
    cursor?: RetailStoreInventoryItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RetailStoreInventoryItemScalarFieldEnum | RetailStoreInventoryItemScalarFieldEnum[]
  }

  /**
   * GlobalProductMasterCatalog without action
   */
  export type GlobalProductMasterCatalogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
  }


  /**
   * Model RetailStoreInventoryItem
   */

  export type AggregateRetailStoreInventoryItem = {
    _count: RetailStoreInventoryItemCountAggregateOutputType | null
    _avg: RetailStoreInventoryItemAvgAggregateOutputType | null
    _sum: RetailStoreInventoryItemSumAggregateOutputType | null
    _min: RetailStoreInventoryItemMinAggregateOutputType | null
    _max: RetailStoreInventoryItemMaxAggregateOutputType | null
  }

  export type RetailStoreInventoryItemAvgAggregateOutputType = {
    currentStock: number | null
    reorderLevel: number | null
    sellingPrice: Decimal | null
    costPrice: Decimal | null
  }

  export type RetailStoreInventoryItemSumAggregateOutputType = {
    currentStock: number | null
    reorderLevel: number | null
    sellingPrice: Decimal | null
    costPrice: Decimal | null
  }

  export type RetailStoreInventoryItemMinAggregateOutputType = {
    inventoryId: string | null
    tenantId: string | null
    globalProductId: string | null
    currentStock: number | null
    reorderLevel: number | null
    sellingPrice: Decimal | null
    costPrice: Decimal | null
    isActive: boolean | null
  }

  export type RetailStoreInventoryItemMaxAggregateOutputType = {
    inventoryId: string | null
    tenantId: string | null
    globalProductId: string | null
    currentStock: number | null
    reorderLevel: number | null
    sellingPrice: Decimal | null
    costPrice: Decimal | null
    isActive: boolean | null
  }

  export type RetailStoreInventoryItemCountAggregateOutputType = {
    inventoryId: number
    tenantId: number
    globalProductId: number
    currentStock: number
    reorderLevel: number
    sellingPrice: number
    costPrice: number
    isActive: number
    _all: number
  }


  export type RetailStoreInventoryItemAvgAggregateInputType = {
    currentStock?: true
    reorderLevel?: true
    sellingPrice?: true
    costPrice?: true
  }

  export type RetailStoreInventoryItemSumAggregateInputType = {
    currentStock?: true
    reorderLevel?: true
    sellingPrice?: true
    costPrice?: true
  }

  export type RetailStoreInventoryItemMinAggregateInputType = {
    inventoryId?: true
    tenantId?: true
    globalProductId?: true
    currentStock?: true
    reorderLevel?: true
    sellingPrice?: true
    costPrice?: true
    isActive?: true
  }

  export type RetailStoreInventoryItemMaxAggregateInputType = {
    inventoryId?: true
    tenantId?: true
    globalProductId?: true
    currentStock?: true
    reorderLevel?: true
    sellingPrice?: true
    costPrice?: true
    isActive?: true
  }

  export type RetailStoreInventoryItemCountAggregateInputType = {
    inventoryId?: true
    tenantId?: true
    globalProductId?: true
    currentStock?: true
    reorderLevel?: true
    sellingPrice?: true
    costPrice?: true
    isActive?: true
    _all?: true
  }

  export type RetailStoreInventoryItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetailStoreInventoryItem to aggregate.
     */
    where?: RetailStoreInventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreInventoryItems to fetch.
     */
    orderBy?: RetailStoreInventoryItemOrderByWithRelationInput | RetailStoreInventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RetailStoreInventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreInventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreInventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RetailStoreInventoryItems
    **/
    _count?: true | RetailStoreInventoryItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RetailStoreInventoryItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RetailStoreInventoryItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RetailStoreInventoryItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RetailStoreInventoryItemMaxAggregateInputType
  }

  export type GetRetailStoreInventoryItemAggregateType<T extends RetailStoreInventoryItemAggregateArgs> = {
        [P in keyof T & keyof AggregateRetailStoreInventoryItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetailStoreInventoryItem[P]>
      : GetScalarType<T[P], AggregateRetailStoreInventoryItem[P]>
  }




  export type RetailStoreInventoryItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetailStoreInventoryItemWhereInput
    orderBy?: RetailStoreInventoryItemOrderByWithAggregationInput | RetailStoreInventoryItemOrderByWithAggregationInput[]
    by: RetailStoreInventoryItemScalarFieldEnum[] | RetailStoreInventoryItemScalarFieldEnum
    having?: RetailStoreInventoryItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RetailStoreInventoryItemCountAggregateInputType | true
    _avg?: RetailStoreInventoryItemAvgAggregateInputType
    _sum?: RetailStoreInventoryItemSumAggregateInputType
    _min?: RetailStoreInventoryItemMinAggregateInputType
    _max?: RetailStoreInventoryItemMaxAggregateInputType
  }

  export type RetailStoreInventoryItemGroupByOutputType = {
    inventoryId: string
    tenantId: string
    globalProductId: string | null
    currentStock: number
    reorderLevel: number
    sellingPrice: Decimal | null
    costPrice: Decimal | null
    isActive: boolean
    _count: RetailStoreInventoryItemCountAggregateOutputType | null
    _avg: RetailStoreInventoryItemAvgAggregateOutputType | null
    _sum: RetailStoreInventoryItemSumAggregateOutputType | null
    _min: RetailStoreInventoryItemMinAggregateOutputType | null
    _max: RetailStoreInventoryItemMaxAggregateOutputType | null
  }

  type GetRetailStoreInventoryItemGroupByPayload<T extends RetailStoreInventoryItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RetailStoreInventoryItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RetailStoreInventoryItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RetailStoreInventoryItemGroupByOutputType[P]>
            : GetScalarType<T[P], RetailStoreInventoryItemGroupByOutputType[P]>
        }
      >
    >


  export type RetailStoreInventoryItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    inventoryId?: boolean
    tenantId?: boolean
    globalProductId?: boolean
    currentStock?: boolean
    reorderLevel?: boolean
    sellingPrice?: boolean
    costPrice?: boolean
    isActive?: boolean
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
    globalProduct?: boolean | RetailStoreInventoryItem$globalProductArgs<ExtArgs>
    lineItems?: boolean | RetailStoreInventoryItem$lineItemsArgs<ExtArgs>
    _count?: boolean | RetailStoreInventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["retailStoreInventoryItem"]>

  export type RetailStoreInventoryItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    inventoryId?: boolean
    tenantId?: boolean
    globalProductId?: boolean
    currentStock?: boolean
    reorderLevel?: boolean
    sellingPrice?: boolean
    costPrice?: boolean
    isActive?: boolean
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
    globalProduct?: boolean | RetailStoreInventoryItem$globalProductArgs<ExtArgs>
  }, ExtArgs["result"]["retailStoreInventoryItem"]>

  export type RetailStoreInventoryItemSelectScalar = {
    inventoryId?: boolean
    tenantId?: boolean
    globalProductId?: boolean
    currentStock?: boolean
    reorderLevel?: boolean
    sellingPrice?: boolean
    costPrice?: boolean
    isActive?: boolean
  }

  export type RetailStoreInventoryItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
    globalProduct?: boolean | RetailStoreInventoryItem$globalProductArgs<ExtArgs>
    lineItems?: boolean | RetailStoreInventoryItem$lineItemsArgs<ExtArgs>
    _count?: boolean | RetailStoreInventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RetailStoreInventoryItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
    globalProduct?: boolean | RetailStoreInventoryItem$globalProductArgs<ExtArgs>
  }

  export type $RetailStoreInventoryItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RetailStoreInventoryItem"
    objects: {
      tenant: Prisma.$RetailStoreTenantPayload<ExtArgs>
      globalProduct: Prisma.$GlobalProductMasterCatalogPayload<ExtArgs> | null
      lineItems: Prisma.$OrderLineItemDetailPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      inventoryId: string
      tenantId: string
      globalProductId: string | null
      currentStock: number
      reorderLevel: number
      sellingPrice: Prisma.Decimal | null
      costPrice: Prisma.Decimal | null
      isActive: boolean
    }, ExtArgs["result"]["retailStoreInventoryItem"]>
    composites: {}
  }

  type RetailStoreInventoryItemGetPayload<S extends boolean | null | undefined | RetailStoreInventoryItemDefaultArgs> = $Result.GetResult<Prisma.$RetailStoreInventoryItemPayload, S>

  type RetailStoreInventoryItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RetailStoreInventoryItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RetailStoreInventoryItemCountAggregateInputType | true
    }

  export interface RetailStoreInventoryItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RetailStoreInventoryItem'], meta: { name: 'RetailStoreInventoryItem' } }
    /**
     * Find zero or one RetailStoreInventoryItem that matches the filter.
     * @param {RetailStoreInventoryItemFindUniqueArgs} args - Arguments to find a RetailStoreInventoryItem
     * @example
     * // Get one RetailStoreInventoryItem
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RetailStoreInventoryItemFindUniqueArgs>(args: SelectSubset<T, RetailStoreInventoryItemFindUniqueArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RetailStoreInventoryItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RetailStoreInventoryItemFindUniqueOrThrowArgs} args - Arguments to find a RetailStoreInventoryItem
     * @example
     * // Get one RetailStoreInventoryItem
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RetailStoreInventoryItemFindUniqueOrThrowArgs>(args: SelectSubset<T, RetailStoreInventoryItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RetailStoreInventoryItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreInventoryItemFindFirstArgs} args - Arguments to find a RetailStoreInventoryItem
     * @example
     * // Get one RetailStoreInventoryItem
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RetailStoreInventoryItemFindFirstArgs>(args?: SelectSubset<T, RetailStoreInventoryItemFindFirstArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RetailStoreInventoryItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreInventoryItemFindFirstOrThrowArgs} args - Arguments to find a RetailStoreInventoryItem
     * @example
     * // Get one RetailStoreInventoryItem
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RetailStoreInventoryItemFindFirstOrThrowArgs>(args?: SelectSubset<T, RetailStoreInventoryItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RetailStoreInventoryItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreInventoryItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RetailStoreInventoryItems
     * const retailStoreInventoryItems = await prisma.retailStoreInventoryItem.findMany()
     * 
     * // Get first 10 RetailStoreInventoryItems
     * const retailStoreInventoryItems = await prisma.retailStoreInventoryItem.findMany({ take: 10 })
     * 
     * // Only select the `inventoryId`
     * const retailStoreInventoryItemWithInventoryIdOnly = await prisma.retailStoreInventoryItem.findMany({ select: { inventoryId: true } })
     * 
     */
    findMany<T extends RetailStoreInventoryItemFindManyArgs>(args?: SelectSubset<T, RetailStoreInventoryItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RetailStoreInventoryItem.
     * @param {RetailStoreInventoryItemCreateArgs} args - Arguments to create a RetailStoreInventoryItem.
     * @example
     * // Create one RetailStoreInventoryItem
     * const RetailStoreInventoryItem = await prisma.retailStoreInventoryItem.create({
     *   data: {
     *     // ... data to create a RetailStoreInventoryItem
     *   }
     * })
     * 
     */
    create<T extends RetailStoreInventoryItemCreateArgs>(args: SelectSubset<T, RetailStoreInventoryItemCreateArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RetailStoreInventoryItems.
     * @param {RetailStoreInventoryItemCreateManyArgs} args - Arguments to create many RetailStoreInventoryItems.
     * @example
     * // Create many RetailStoreInventoryItems
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RetailStoreInventoryItemCreateManyArgs>(args?: SelectSubset<T, RetailStoreInventoryItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RetailStoreInventoryItems and returns the data saved in the database.
     * @param {RetailStoreInventoryItemCreateManyAndReturnArgs} args - Arguments to create many RetailStoreInventoryItems.
     * @example
     * // Create many RetailStoreInventoryItems
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RetailStoreInventoryItems and only return the `inventoryId`
     * const retailStoreInventoryItemWithInventoryIdOnly = await prisma.retailStoreInventoryItem.createManyAndReturn({ 
     *   select: { inventoryId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RetailStoreInventoryItemCreateManyAndReturnArgs>(args?: SelectSubset<T, RetailStoreInventoryItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RetailStoreInventoryItem.
     * @param {RetailStoreInventoryItemDeleteArgs} args - Arguments to delete one RetailStoreInventoryItem.
     * @example
     * // Delete one RetailStoreInventoryItem
     * const RetailStoreInventoryItem = await prisma.retailStoreInventoryItem.delete({
     *   where: {
     *     // ... filter to delete one RetailStoreInventoryItem
     *   }
     * })
     * 
     */
    delete<T extends RetailStoreInventoryItemDeleteArgs>(args: SelectSubset<T, RetailStoreInventoryItemDeleteArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RetailStoreInventoryItem.
     * @param {RetailStoreInventoryItemUpdateArgs} args - Arguments to update one RetailStoreInventoryItem.
     * @example
     * // Update one RetailStoreInventoryItem
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RetailStoreInventoryItemUpdateArgs>(args: SelectSubset<T, RetailStoreInventoryItemUpdateArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RetailStoreInventoryItems.
     * @param {RetailStoreInventoryItemDeleteManyArgs} args - Arguments to filter RetailStoreInventoryItems to delete.
     * @example
     * // Delete a few RetailStoreInventoryItems
     * const { count } = await prisma.retailStoreInventoryItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RetailStoreInventoryItemDeleteManyArgs>(args?: SelectSubset<T, RetailStoreInventoryItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RetailStoreInventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreInventoryItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RetailStoreInventoryItems
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RetailStoreInventoryItemUpdateManyArgs>(args: SelectSubset<T, RetailStoreInventoryItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RetailStoreInventoryItem.
     * @param {RetailStoreInventoryItemUpsertArgs} args - Arguments to update or create a RetailStoreInventoryItem.
     * @example
     * // Update or create a RetailStoreInventoryItem
     * const retailStoreInventoryItem = await prisma.retailStoreInventoryItem.upsert({
     *   create: {
     *     // ... data to create a RetailStoreInventoryItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RetailStoreInventoryItem we want to update
     *   }
     * })
     */
    upsert<T extends RetailStoreInventoryItemUpsertArgs>(args: SelectSubset<T, RetailStoreInventoryItemUpsertArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RetailStoreInventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreInventoryItemCountArgs} args - Arguments to filter RetailStoreInventoryItems to count.
     * @example
     * // Count the number of RetailStoreInventoryItems
     * const count = await prisma.retailStoreInventoryItem.count({
     *   where: {
     *     // ... the filter for the RetailStoreInventoryItems we want to count
     *   }
     * })
    **/
    count<T extends RetailStoreInventoryItemCountArgs>(
      args?: Subset<T, RetailStoreInventoryItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RetailStoreInventoryItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RetailStoreInventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreInventoryItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RetailStoreInventoryItemAggregateArgs>(args: Subset<T, RetailStoreInventoryItemAggregateArgs>): Prisma.PrismaPromise<GetRetailStoreInventoryItemAggregateType<T>>

    /**
     * Group by RetailStoreInventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreInventoryItemGroupByArgs} args - Group by arguments.
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
      T extends RetailStoreInventoryItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RetailStoreInventoryItemGroupByArgs['orderBy'] }
        : { orderBy?: RetailStoreInventoryItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RetailStoreInventoryItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetailStoreInventoryItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RetailStoreInventoryItem model
   */
  readonly fields: RetailStoreInventoryItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RetailStoreInventoryItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RetailStoreInventoryItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends RetailStoreTenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenantDefaultArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    globalProduct<T extends RetailStoreInventoryItem$globalProductArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreInventoryItem$globalProductArgs<ExtArgs>>): Prisma__GlobalProductMasterCatalogClient<$Result.GetResult<Prisma.$GlobalProductMasterCatalogPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    lineItems<T extends RetailStoreInventoryItem$lineItemsArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreInventoryItem$lineItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the RetailStoreInventoryItem model
   */ 
  interface RetailStoreInventoryItemFieldRefs {
    readonly inventoryId: FieldRef<"RetailStoreInventoryItem", 'String'>
    readonly tenantId: FieldRef<"RetailStoreInventoryItem", 'String'>
    readonly globalProductId: FieldRef<"RetailStoreInventoryItem", 'String'>
    readonly currentStock: FieldRef<"RetailStoreInventoryItem", 'Int'>
    readonly reorderLevel: FieldRef<"RetailStoreInventoryItem", 'Int'>
    readonly sellingPrice: FieldRef<"RetailStoreInventoryItem", 'Decimal'>
    readonly costPrice: FieldRef<"RetailStoreInventoryItem", 'Decimal'>
    readonly isActive: FieldRef<"RetailStoreInventoryItem", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * RetailStoreInventoryItem findUnique
   */
  export type RetailStoreInventoryItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreInventoryItem to fetch.
     */
    where: RetailStoreInventoryItemWhereUniqueInput
  }

  /**
   * RetailStoreInventoryItem findUniqueOrThrow
   */
  export type RetailStoreInventoryItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreInventoryItem to fetch.
     */
    where: RetailStoreInventoryItemWhereUniqueInput
  }

  /**
   * RetailStoreInventoryItem findFirst
   */
  export type RetailStoreInventoryItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreInventoryItem to fetch.
     */
    where?: RetailStoreInventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreInventoryItems to fetch.
     */
    orderBy?: RetailStoreInventoryItemOrderByWithRelationInput | RetailStoreInventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetailStoreInventoryItems.
     */
    cursor?: RetailStoreInventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreInventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreInventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetailStoreInventoryItems.
     */
    distinct?: RetailStoreInventoryItemScalarFieldEnum | RetailStoreInventoryItemScalarFieldEnum[]
  }

  /**
   * RetailStoreInventoryItem findFirstOrThrow
   */
  export type RetailStoreInventoryItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreInventoryItem to fetch.
     */
    where?: RetailStoreInventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreInventoryItems to fetch.
     */
    orderBy?: RetailStoreInventoryItemOrderByWithRelationInput | RetailStoreInventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetailStoreInventoryItems.
     */
    cursor?: RetailStoreInventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreInventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreInventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetailStoreInventoryItems.
     */
    distinct?: RetailStoreInventoryItemScalarFieldEnum | RetailStoreInventoryItemScalarFieldEnum[]
  }

  /**
   * RetailStoreInventoryItem findMany
   */
  export type RetailStoreInventoryItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which RetailStoreInventoryItems to fetch.
     */
    where?: RetailStoreInventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreInventoryItems to fetch.
     */
    orderBy?: RetailStoreInventoryItemOrderByWithRelationInput | RetailStoreInventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RetailStoreInventoryItems.
     */
    cursor?: RetailStoreInventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreInventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreInventoryItems.
     */
    skip?: number
    distinct?: RetailStoreInventoryItemScalarFieldEnum | RetailStoreInventoryItemScalarFieldEnum[]
  }

  /**
   * RetailStoreInventoryItem create
   */
  export type RetailStoreInventoryItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * The data needed to create a RetailStoreInventoryItem.
     */
    data: XOR<RetailStoreInventoryItemCreateInput, RetailStoreInventoryItemUncheckedCreateInput>
  }

  /**
   * RetailStoreInventoryItem createMany
   */
  export type RetailStoreInventoryItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RetailStoreInventoryItems.
     */
    data: RetailStoreInventoryItemCreateManyInput | RetailStoreInventoryItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetailStoreInventoryItem createManyAndReturn
   */
  export type RetailStoreInventoryItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RetailStoreInventoryItems.
     */
    data: RetailStoreInventoryItemCreateManyInput | RetailStoreInventoryItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RetailStoreInventoryItem update
   */
  export type RetailStoreInventoryItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * The data needed to update a RetailStoreInventoryItem.
     */
    data: XOR<RetailStoreInventoryItemUpdateInput, RetailStoreInventoryItemUncheckedUpdateInput>
    /**
     * Choose, which RetailStoreInventoryItem to update.
     */
    where: RetailStoreInventoryItemWhereUniqueInput
  }

  /**
   * RetailStoreInventoryItem updateMany
   */
  export type RetailStoreInventoryItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RetailStoreInventoryItems.
     */
    data: XOR<RetailStoreInventoryItemUpdateManyMutationInput, RetailStoreInventoryItemUncheckedUpdateManyInput>
    /**
     * Filter which RetailStoreInventoryItems to update
     */
    where?: RetailStoreInventoryItemWhereInput
  }

  /**
   * RetailStoreInventoryItem upsert
   */
  export type RetailStoreInventoryItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * The filter to search for the RetailStoreInventoryItem to update in case it exists.
     */
    where: RetailStoreInventoryItemWhereUniqueInput
    /**
     * In case the RetailStoreInventoryItem found by the `where` argument doesn't exist, create a new RetailStoreInventoryItem with this data.
     */
    create: XOR<RetailStoreInventoryItemCreateInput, RetailStoreInventoryItemUncheckedCreateInput>
    /**
     * In case the RetailStoreInventoryItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RetailStoreInventoryItemUpdateInput, RetailStoreInventoryItemUncheckedUpdateInput>
  }

  /**
   * RetailStoreInventoryItem delete
   */
  export type RetailStoreInventoryItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    /**
     * Filter which RetailStoreInventoryItem to delete.
     */
    where: RetailStoreInventoryItemWhereUniqueInput
  }

  /**
   * RetailStoreInventoryItem deleteMany
   */
  export type RetailStoreInventoryItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetailStoreInventoryItems to delete
     */
    where?: RetailStoreInventoryItemWhereInput
  }

  /**
   * RetailStoreInventoryItem.globalProduct
   */
  export type RetailStoreInventoryItem$globalProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalProductMasterCatalog
     */
    select?: GlobalProductMasterCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalProductMasterCatalogInclude<ExtArgs> | null
    where?: GlobalProductMasterCatalogWhereInput
  }

  /**
   * RetailStoreInventoryItem.lineItems
   */
  export type RetailStoreInventoryItem$lineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    where?: OrderLineItemDetailWhereInput
    orderBy?: OrderLineItemDetailOrderByWithRelationInput | OrderLineItemDetailOrderByWithRelationInput[]
    cursor?: OrderLineItemDetailWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderLineItemDetailScalarFieldEnum | OrderLineItemDetailScalarFieldEnum[]
  }

  /**
   * RetailStoreInventoryItem without action
   */
  export type RetailStoreInventoryItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
  }


  /**
   * Model CustomerOrderHeader
   */

  export type AggregateCustomerOrderHeader = {
    _count: CustomerOrderHeaderCountAggregateOutputType | null
    _avg: CustomerOrderHeaderAvgAggregateOutputType | null
    _sum: CustomerOrderHeaderSumAggregateOutputType | null
    _min: CustomerOrderHeaderMinAggregateOutputType | null
    _max: CustomerOrderHeaderMaxAggregateOutputType | null
  }

  export type CustomerOrderHeaderAvgAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type CustomerOrderHeaderSumAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type CustomerOrderHeaderMinAggregateOutputType = {
    orderId: string | null
    tenantId: string | null
    customerId: string | null
    orderNumber: string | null
    totalAmount: Decimal | null
    status: string | null
    createdAt: Date | null
  }

  export type CustomerOrderHeaderMaxAggregateOutputType = {
    orderId: string | null
    tenantId: string | null
    customerId: string | null
    orderNumber: string | null
    totalAmount: Decimal | null
    status: string | null
    createdAt: Date | null
  }

  export type CustomerOrderHeaderCountAggregateOutputType = {
    orderId: number
    tenantId: number
    customerId: number
    orderNumber: number
    totalAmount: number
    status: number
    createdAt: number
    _all: number
  }


  export type CustomerOrderHeaderAvgAggregateInputType = {
    totalAmount?: true
  }

  export type CustomerOrderHeaderSumAggregateInputType = {
    totalAmount?: true
  }

  export type CustomerOrderHeaderMinAggregateInputType = {
    orderId?: true
    tenantId?: true
    customerId?: true
    orderNumber?: true
    totalAmount?: true
    status?: true
    createdAt?: true
  }

  export type CustomerOrderHeaderMaxAggregateInputType = {
    orderId?: true
    tenantId?: true
    customerId?: true
    orderNumber?: true
    totalAmount?: true
    status?: true
    createdAt?: true
  }

  export type CustomerOrderHeaderCountAggregateInputType = {
    orderId?: true
    tenantId?: true
    customerId?: true
    orderNumber?: true
    totalAmount?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type CustomerOrderHeaderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerOrderHeader to aggregate.
     */
    where?: CustomerOrderHeaderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerOrderHeaders to fetch.
     */
    orderBy?: CustomerOrderHeaderOrderByWithRelationInput | CustomerOrderHeaderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerOrderHeaderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerOrderHeaders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerOrderHeaders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerOrderHeaders
    **/
    _count?: true | CustomerOrderHeaderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerOrderHeaderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerOrderHeaderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerOrderHeaderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerOrderHeaderMaxAggregateInputType
  }

  export type GetCustomerOrderHeaderAggregateType<T extends CustomerOrderHeaderAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerOrderHeader]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerOrderHeader[P]>
      : GetScalarType<T[P], AggregateCustomerOrderHeader[P]>
  }




  export type CustomerOrderHeaderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerOrderHeaderWhereInput
    orderBy?: CustomerOrderHeaderOrderByWithAggregationInput | CustomerOrderHeaderOrderByWithAggregationInput[]
    by: CustomerOrderHeaderScalarFieldEnum[] | CustomerOrderHeaderScalarFieldEnum
    having?: CustomerOrderHeaderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerOrderHeaderCountAggregateInputType | true
    _avg?: CustomerOrderHeaderAvgAggregateInputType
    _sum?: CustomerOrderHeaderSumAggregateInputType
    _min?: CustomerOrderHeaderMinAggregateInputType
    _max?: CustomerOrderHeaderMaxAggregateInputType
  }

  export type CustomerOrderHeaderGroupByOutputType = {
    orderId: string
    tenantId: string
    customerId: string | null
    orderNumber: string | null
    totalAmount: Decimal
    status: string
    createdAt: Date
    _count: CustomerOrderHeaderCountAggregateOutputType | null
    _avg: CustomerOrderHeaderAvgAggregateOutputType | null
    _sum: CustomerOrderHeaderSumAggregateOutputType | null
    _min: CustomerOrderHeaderMinAggregateOutputType | null
    _max: CustomerOrderHeaderMaxAggregateOutputType | null
  }

  type GetCustomerOrderHeaderGroupByPayload<T extends CustomerOrderHeaderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerOrderHeaderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerOrderHeaderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerOrderHeaderGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerOrderHeaderGroupByOutputType[P]>
        }
      >
    >


  export type CustomerOrderHeaderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    orderId?: boolean
    tenantId?: boolean
    customerId?: boolean
    orderNumber?: boolean
    totalAmount?: boolean
    status?: boolean
    createdAt?: boolean
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
    customer?: boolean | CustomerOrderHeader$customerArgs<ExtArgs>
    lineItems?: boolean | CustomerOrderHeader$lineItemsArgs<ExtArgs>
    _count?: boolean | CustomerOrderHeaderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customerOrderHeader"]>

  export type CustomerOrderHeaderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    orderId?: boolean
    tenantId?: boolean
    customerId?: boolean
    orderNumber?: boolean
    totalAmount?: boolean
    status?: boolean
    createdAt?: boolean
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
    customer?: boolean | CustomerOrderHeader$customerArgs<ExtArgs>
  }, ExtArgs["result"]["customerOrderHeader"]>

  export type CustomerOrderHeaderSelectScalar = {
    orderId?: boolean
    tenantId?: boolean
    customerId?: boolean
    orderNumber?: boolean
    totalAmount?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type CustomerOrderHeaderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
    customer?: boolean | CustomerOrderHeader$customerArgs<ExtArgs>
    lineItems?: boolean | CustomerOrderHeader$lineItemsArgs<ExtArgs>
    _count?: boolean | CustomerOrderHeaderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerOrderHeaderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
    customer?: boolean | CustomerOrderHeader$customerArgs<ExtArgs>
  }

  export type $CustomerOrderHeaderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerOrderHeader"
    objects: {
      tenant: Prisma.$RetailStoreTenantPayload<ExtArgs>
      customer: Prisma.$CustomerPayload<ExtArgs> | null
      lineItems: Prisma.$OrderLineItemDetailPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      orderId: string
      tenantId: string
      customerId: string | null
      orderNumber: string | null
      totalAmount: Prisma.Decimal
      status: string
      createdAt: Date
    }, ExtArgs["result"]["customerOrderHeader"]>
    composites: {}
  }

  type CustomerOrderHeaderGetPayload<S extends boolean | null | undefined | CustomerOrderHeaderDefaultArgs> = $Result.GetResult<Prisma.$CustomerOrderHeaderPayload, S>

  type CustomerOrderHeaderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomerOrderHeaderFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomerOrderHeaderCountAggregateInputType | true
    }

  export interface CustomerOrderHeaderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerOrderHeader'], meta: { name: 'CustomerOrderHeader' } }
    /**
     * Find zero or one CustomerOrderHeader that matches the filter.
     * @param {CustomerOrderHeaderFindUniqueArgs} args - Arguments to find a CustomerOrderHeader
     * @example
     * // Get one CustomerOrderHeader
     * const customerOrderHeader = await prisma.customerOrderHeader.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerOrderHeaderFindUniqueArgs>(args: SelectSubset<T, CustomerOrderHeaderFindUniqueArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CustomerOrderHeader that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomerOrderHeaderFindUniqueOrThrowArgs} args - Arguments to find a CustomerOrderHeader
     * @example
     * // Get one CustomerOrderHeader
     * const customerOrderHeader = await prisma.customerOrderHeader.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerOrderHeaderFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerOrderHeaderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CustomerOrderHeader that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerOrderHeaderFindFirstArgs} args - Arguments to find a CustomerOrderHeader
     * @example
     * // Get one CustomerOrderHeader
     * const customerOrderHeader = await prisma.customerOrderHeader.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerOrderHeaderFindFirstArgs>(args?: SelectSubset<T, CustomerOrderHeaderFindFirstArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CustomerOrderHeader that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerOrderHeaderFindFirstOrThrowArgs} args - Arguments to find a CustomerOrderHeader
     * @example
     * // Get one CustomerOrderHeader
     * const customerOrderHeader = await prisma.customerOrderHeader.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerOrderHeaderFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerOrderHeaderFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CustomerOrderHeaders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerOrderHeaderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerOrderHeaders
     * const customerOrderHeaders = await prisma.customerOrderHeader.findMany()
     * 
     * // Get first 10 CustomerOrderHeaders
     * const customerOrderHeaders = await prisma.customerOrderHeader.findMany({ take: 10 })
     * 
     * // Only select the `orderId`
     * const customerOrderHeaderWithOrderIdOnly = await prisma.customerOrderHeader.findMany({ select: { orderId: true } })
     * 
     */
    findMany<T extends CustomerOrderHeaderFindManyArgs>(args?: SelectSubset<T, CustomerOrderHeaderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CustomerOrderHeader.
     * @param {CustomerOrderHeaderCreateArgs} args - Arguments to create a CustomerOrderHeader.
     * @example
     * // Create one CustomerOrderHeader
     * const CustomerOrderHeader = await prisma.customerOrderHeader.create({
     *   data: {
     *     // ... data to create a CustomerOrderHeader
     *   }
     * })
     * 
     */
    create<T extends CustomerOrderHeaderCreateArgs>(args: SelectSubset<T, CustomerOrderHeaderCreateArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CustomerOrderHeaders.
     * @param {CustomerOrderHeaderCreateManyArgs} args - Arguments to create many CustomerOrderHeaders.
     * @example
     * // Create many CustomerOrderHeaders
     * const customerOrderHeader = await prisma.customerOrderHeader.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerOrderHeaderCreateManyArgs>(args?: SelectSubset<T, CustomerOrderHeaderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomerOrderHeaders and returns the data saved in the database.
     * @param {CustomerOrderHeaderCreateManyAndReturnArgs} args - Arguments to create many CustomerOrderHeaders.
     * @example
     * // Create many CustomerOrderHeaders
     * const customerOrderHeader = await prisma.customerOrderHeader.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomerOrderHeaders and only return the `orderId`
     * const customerOrderHeaderWithOrderIdOnly = await prisma.customerOrderHeader.createManyAndReturn({ 
     *   select: { orderId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerOrderHeaderCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerOrderHeaderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CustomerOrderHeader.
     * @param {CustomerOrderHeaderDeleteArgs} args - Arguments to delete one CustomerOrderHeader.
     * @example
     * // Delete one CustomerOrderHeader
     * const CustomerOrderHeader = await prisma.customerOrderHeader.delete({
     *   where: {
     *     // ... filter to delete one CustomerOrderHeader
     *   }
     * })
     * 
     */
    delete<T extends CustomerOrderHeaderDeleteArgs>(args: SelectSubset<T, CustomerOrderHeaderDeleteArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CustomerOrderHeader.
     * @param {CustomerOrderHeaderUpdateArgs} args - Arguments to update one CustomerOrderHeader.
     * @example
     * // Update one CustomerOrderHeader
     * const customerOrderHeader = await prisma.customerOrderHeader.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerOrderHeaderUpdateArgs>(args: SelectSubset<T, CustomerOrderHeaderUpdateArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CustomerOrderHeaders.
     * @param {CustomerOrderHeaderDeleteManyArgs} args - Arguments to filter CustomerOrderHeaders to delete.
     * @example
     * // Delete a few CustomerOrderHeaders
     * const { count } = await prisma.customerOrderHeader.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerOrderHeaderDeleteManyArgs>(args?: SelectSubset<T, CustomerOrderHeaderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerOrderHeaders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerOrderHeaderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerOrderHeaders
     * const customerOrderHeader = await prisma.customerOrderHeader.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerOrderHeaderUpdateManyArgs>(args: SelectSubset<T, CustomerOrderHeaderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CustomerOrderHeader.
     * @param {CustomerOrderHeaderUpsertArgs} args - Arguments to update or create a CustomerOrderHeader.
     * @example
     * // Update or create a CustomerOrderHeader
     * const customerOrderHeader = await prisma.customerOrderHeader.upsert({
     *   create: {
     *     // ... data to create a CustomerOrderHeader
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerOrderHeader we want to update
     *   }
     * })
     */
    upsert<T extends CustomerOrderHeaderUpsertArgs>(args: SelectSubset<T, CustomerOrderHeaderUpsertArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CustomerOrderHeaders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerOrderHeaderCountArgs} args - Arguments to filter CustomerOrderHeaders to count.
     * @example
     * // Count the number of CustomerOrderHeaders
     * const count = await prisma.customerOrderHeader.count({
     *   where: {
     *     // ... the filter for the CustomerOrderHeaders we want to count
     *   }
     * })
    **/
    count<T extends CustomerOrderHeaderCountArgs>(
      args?: Subset<T, CustomerOrderHeaderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerOrderHeaderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerOrderHeader.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerOrderHeaderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomerOrderHeaderAggregateArgs>(args: Subset<T, CustomerOrderHeaderAggregateArgs>): Prisma.PrismaPromise<GetCustomerOrderHeaderAggregateType<T>>

    /**
     * Group by CustomerOrderHeader.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerOrderHeaderGroupByArgs} args - Group by arguments.
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
      T extends CustomerOrderHeaderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerOrderHeaderGroupByArgs['orderBy'] }
        : { orderBy?: CustomerOrderHeaderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CustomerOrderHeaderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerOrderHeaderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerOrderHeader model
   */
  readonly fields: CustomerOrderHeaderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerOrderHeader.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerOrderHeaderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends RetailStoreTenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenantDefaultArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    customer<T extends CustomerOrderHeader$customerArgs<ExtArgs> = {}>(args?: Subset<T, CustomerOrderHeader$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    lineItems<T extends CustomerOrderHeader$lineItemsArgs<ExtArgs> = {}>(args?: Subset<T, CustomerOrderHeader$lineItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the CustomerOrderHeader model
   */ 
  interface CustomerOrderHeaderFieldRefs {
    readonly orderId: FieldRef<"CustomerOrderHeader", 'String'>
    readonly tenantId: FieldRef<"CustomerOrderHeader", 'String'>
    readonly customerId: FieldRef<"CustomerOrderHeader", 'String'>
    readonly orderNumber: FieldRef<"CustomerOrderHeader", 'String'>
    readonly totalAmount: FieldRef<"CustomerOrderHeader", 'Decimal'>
    readonly status: FieldRef<"CustomerOrderHeader", 'String'>
    readonly createdAt: FieldRef<"CustomerOrderHeader", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomerOrderHeader findUnique
   */
  export type CustomerOrderHeaderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * Filter, which CustomerOrderHeader to fetch.
     */
    where: CustomerOrderHeaderWhereUniqueInput
  }

  /**
   * CustomerOrderHeader findUniqueOrThrow
   */
  export type CustomerOrderHeaderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * Filter, which CustomerOrderHeader to fetch.
     */
    where: CustomerOrderHeaderWhereUniqueInput
  }

  /**
   * CustomerOrderHeader findFirst
   */
  export type CustomerOrderHeaderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * Filter, which CustomerOrderHeader to fetch.
     */
    where?: CustomerOrderHeaderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerOrderHeaders to fetch.
     */
    orderBy?: CustomerOrderHeaderOrderByWithRelationInput | CustomerOrderHeaderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerOrderHeaders.
     */
    cursor?: CustomerOrderHeaderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerOrderHeaders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerOrderHeaders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerOrderHeaders.
     */
    distinct?: CustomerOrderHeaderScalarFieldEnum | CustomerOrderHeaderScalarFieldEnum[]
  }

  /**
   * CustomerOrderHeader findFirstOrThrow
   */
  export type CustomerOrderHeaderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * Filter, which CustomerOrderHeader to fetch.
     */
    where?: CustomerOrderHeaderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerOrderHeaders to fetch.
     */
    orderBy?: CustomerOrderHeaderOrderByWithRelationInput | CustomerOrderHeaderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerOrderHeaders.
     */
    cursor?: CustomerOrderHeaderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerOrderHeaders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerOrderHeaders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerOrderHeaders.
     */
    distinct?: CustomerOrderHeaderScalarFieldEnum | CustomerOrderHeaderScalarFieldEnum[]
  }

  /**
   * CustomerOrderHeader findMany
   */
  export type CustomerOrderHeaderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * Filter, which CustomerOrderHeaders to fetch.
     */
    where?: CustomerOrderHeaderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerOrderHeaders to fetch.
     */
    orderBy?: CustomerOrderHeaderOrderByWithRelationInput | CustomerOrderHeaderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerOrderHeaders.
     */
    cursor?: CustomerOrderHeaderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerOrderHeaders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerOrderHeaders.
     */
    skip?: number
    distinct?: CustomerOrderHeaderScalarFieldEnum | CustomerOrderHeaderScalarFieldEnum[]
  }

  /**
   * CustomerOrderHeader create
   */
  export type CustomerOrderHeaderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomerOrderHeader.
     */
    data: XOR<CustomerOrderHeaderCreateInput, CustomerOrderHeaderUncheckedCreateInput>
  }

  /**
   * CustomerOrderHeader createMany
   */
  export type CustomerOrderHeaderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerOrderHeaders.
     */
    data: CustomerOrderHeaderCreateManyInput | CustomerOrderHeaderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerOrderHeader createManyAndReturn
   */
  export type CustomerOrderHeaderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CustomerOrderHeaders.
     */
    data: CustomerOrderHeaderCreateManyInput | CustomerOrderHeaderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CustomerOrderHeader update
   */
  export type CustomerOrderHeaderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomerOrderHeader.
     */
    data: XOR<CustomerOrderHeaderUpdateInput, CustomerOrderHeaderUncheckedUpdateInput>
    /**
     * Choose, which CustomerOrderHeader to update.
     */
    where: CustomerOrderHeaderWhereUniqueInput
  }

  /**
   * CustomerOrderHeader updateMany
   */
  export type CustomerOrderHeaderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerOrderHeaders.
     */
    data: XOR<CustomerOrderHeaderUpdateManyMutationInput, CustomerOrderHeaderUncheckedUpdateManyInput>
    /**
     * Filter which CustomerOrderHeaders to update
     */
    where?: CustomerOrderHeaderWhereInput
  }

  /**
   * CustomerOrderHeader upsert
   */
  export type CustomerOrderHeaderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomerOrderHeader to update in case it exists.
     */
    where: CustomerOrderHeaderWhereUniqueInput
    /**
     * In case the CustomerOrderHeader found by the `where` argument doesn't exist, create a new CustomerOrderHeader with this data.
     */
    create: XOR<CustomerOrderHeaderCreateInput, CustomerOrderHeaderUncheckedCreateInput>
    /**
     * In case the CustomerOrderHeader was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerOrderHeaderUpdateInput, CustomerOrderHeaderUncheckedUpdateInput>
  }

  /**
   * CustomerOrderHeader delete
   */
  export type CustomerOrderHeaderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    /**
     * Filter which CustomerOrderHeader to delete.
     */
    where: CustomerOrderHeaderWhereUniqueInput
  }

  /**
   * CustomerOrderHeader deleteMany
   */
  export type CustomerOrderHeaderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerOrderHeaders to delete
     */
    where?: CustomerOrderHeaderWhereInput
  }

  /**
   * CustomerOrderHeader.customer
   */
  export type CustomerOrderHeader$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * CustomerOrderHeader.lineItems
   */
  export type CustomerOrderHeader$lineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    where?: OrderLineItemDetailWhereInput
    orderBy?: OrderLineItemDetailOrderByWithRelationInput | OrderLineItemDetailOrderByWithRelationInput[]
    cursor?: OrderLineItemDetailWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderLineItemDetailScalarFieldEnum | OrderLineItemDetailScalarFieldEnum[]
  }

  /**
   * CustomerOrderHeader without action
   */
  export type CustomerOrderHeaderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
  }


  /**
   * Model OrderLineItemDetail
   */

  export type AggregateOrderLineItemDetail = {
    _count: OrderLineItemDetailCountAggregateOutputType | null
    _avg: OrderLineItemDetailAvgAggregateOutputType | null
    _sum: OrderLineItemDetailSumAggregateOutputType | null
    _min: OrderLineItemDetailMinAggregateOutputType | null
    _max: OrderLineItemDetailMaxAggregateOutputType | null
  }

  export type OrderLineItemDetailAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: Decimal | null
    totalAmount: Decimal | null
  }

  export type OrderLineItemDetailSumAggregateOutputType = {
    quantity: number | null
    unitPrice: Decimal | null
    totalAmount: Decimal | null
  }

  export type OrderLineItemDetailMinAggregateOutputType = {
    lineItemId: string | null
    orderId: string | null
    inventoryId: string | null
    productName: string | null
    quantity: number | null
    unitPrice: Decimal | null
    totalAmount: Decimal | null
  }

  export type OrderLineItemDetailMaxAggregateOutputType = {
    lineItemId: string | null
    orderId: string | null
    inventoryId: string | null
    productName: string | null
    quantity: number | null
    unitPrice: Decimal | null
    totalAmount: Decimal | null
  }

  export type OrderLineItemDetailCountAggregateOutputType = {
    lineItemId: number
    orderId: number
    inventoryId: number
    productName: number
    quantity: number
    unitPrice: number
    totalAmount: number
    _all: number
  }


  export type OrderLineItemDetailAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    totalAmount?: true
  }

  export type OrderLineItemDetailSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    totalAmount?: true
  }

  export type OrderLineItemDetailMinAggregateInputType = {
    lineItemId?: true
    orderId?: true
    inventoryId?: true
    productName?: true
    quantity?: true
    unitPrice?: true
    totalAmount?: true
  }

  export type OrderLineItemDetailMaxAggregateInputType = {
    lineItemId?: true
    orderId?: true
    inventoryId?: true
    productName?: true
    quantity?: true
    unitPrice?: true
    totalAmount?: true
  }

  export type OrderLineItemDetailCountAggregateInputType = {
    lineItemId?: true
    orderId?: true
    inventoryId?: true
    productName?: true
    quantity?: true
    unitPrice?: true
    totalAmount?: true
    _all?: true
  }

  export type OrderLineItemDetailAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderLineItemDetail to aggregate.
     */
    where?: OrderLineItemDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderLineItemDetails to fetch.
     */
    orderBy?: OrderLineItemDetailOrderByWithRelationInput | OrderLineItemDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderLineItemDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderLineItemDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderLineItemDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderLineItemDetails
    **/
    _count?: true | OrderLineItemDetailCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderLineItemDetailAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderLineItemDetailSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderLineItemDetailMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderLineItemDetailMaxAggregateInputType
  }

  export type GetOrderLineItemDetailAggregateType<T extends OrderLineItemDetailAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderLineItemDetail]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderLineItemDetail[P]>
      : GetScalarType<T[P], AggregateOrderLineItemDetail[P]>
  }




  export type OrderLineItemDetailGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderLineItemDetailWhereInput
    orderBy?: OrderLineItemDetailOrderByWithAggregationInput | OrderLineItemDetailOrderByWithAggregationInput[]
    by: OrderLineItemDetailScalarFieldEnum[] | OrderLineItemDetailScalarFieldEnum
    having?: OrderLineItemDetailScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderLineItemDetailCountAggregateInputType | true
    _avg?: OrderLineItemDetailAvgAggregateInputType
    _sum?: OrderLineItemDetailSumAggregateInputType
    _min?: OrderLineItemDetailMinAggregateInputType
    _max?: OrderLineItemDetailMaxAggregateInputType
  }

  export type OrderLineItemDetailGroupByOutputType = {
    lineItemId: string
    orderId: string
    inventoryId: string | null
    productName: string
    quantity: number
    unitPrice: Decimal
    totalAmount: Decimal
    _count: OrderLineItemDetailCountAggregateOutputType | null
    _avg: OrderLineItemDetailAvgAggregateOutputType | null
    _sum: OrderLineItemDetailSumAggregateOutputType | null
    _min: OrderLineItemDetailMinAggregateOutputType | null
    _max: OrderLineItemDetailMaxAggregateOutputType | null
  }

  type GetOrderLineItemDetailGroupByPayload<T extends OrderLineItemDetailGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderLineItemDetailGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderLineItemDetailGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderLineItemDetailGroupByOutputType[P]>
            : GetScalarType<T[P], OrderLineItemDetailGroupByOutputType[P]>
        }
      >
    >


  export type OrderLineItemDetailSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    lineItemId?: boolean
    orderId?: boolean
    inventoryId?: boolean
    productName?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalAmount?: boolean
    order?: boolean | CustomerOrderHeaderDefaultArgs<ExtArgs>
    inventory?: boolean | OrderLineItemDetail$inventoryArgs<ExtArgs>
  }, ExtArgs["result"]["orderLineItemDetail"]>

  export type OrderLineItemDetailSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    lineItemId?: boolean
    orderId?: boolean
    inventoryId?: boolean
    productName?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalAmount?: boolean
    order?: boolean | CustomerOrderHeaderDefaultArgs<ExtArgs>
    inventory?: boolean | OrderLineItemDetail$inventoryArgs<ExtArgs>
  }, ExtArgs["result"]["orderLineItemDetail"]>

  export type OrderLineItemDetailSelectScalar = {
    lineItemId?: boolean
    orderId?: boolean
    inventoryId?: boolean
    productName?: boolean
    quantity?: boolean
    unitPrice?: boolean
    totalAmount?: boolean
  }

  export type OrderLineItemDetailInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | CustomerOrderHeaderDefaultArgs<ExtArgs>
    inventory?: boolean | OrderLineItemDetail$inventoryArgs<ExtArgs>
  }
  export type OrderLineItemDetailIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | CustomerOrderHeaderDefaultArgs<ExtArgs>
    inventory?: boolean | OrderLineItemDetail$inventoryArgs<ExtArgs>
  }

  export type $OrderLineItemDetailPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderLineItemDetail"
    objects: {
      order: Prisma.$CustomerOrderHeaderPayload<ExtArgs>
      inventory: Prisma.$RetailStoreInventoryItemPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      lineItemId: string
      orderId: string
      inventoryId: string | null
      productName: string
      quantity: number
      unitPrice: Prisma.Decimal
      totalAmount: Prisma.Decimal
    }, ExtArgs["result"]["orderLineItemDetail"]>
    composites: {}
  }

  type OrderLineItemDetailGetPayload<S extends boolean | null | undefined | OrderLineItemDetailDefaultArgs> = $Result.GetResult<Prisma.$OrderLineItemDetailPayload, S>

  type OrderLineItemDetailCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrderLineItemDetailFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrderLineItemDetailCountAggregateInputType | true
    }

  export interface OrderLineItemDetailDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderLineItemDetail'], meta: { name: 'OrderLineItemDetail' } }
    /**
     * Find zero or one OrderLineItemDetail that matches the filter.
     * @param {OrderLineItemDetailFindUniqueArgs} args - Arguments to find a OrderLineItemDetail
     * @example
     * // Get one OrderLineItemDetail
     * const orderLineItemDetail = await prisma.orderLineItemDetail.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderLineItemDetailFindUniqueArgs>(args: SelectSubset<T, OrderLineItemDetailFindUniqueArgs<ExtArgs>>): Prisma__OrderLineItemDetailClient<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OrderLineItemDetail that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrderLineItemDetailFindUniqueOrThrowArgs} args - Arguments to find a OrderLineItemDetail
     * @example
     * // Get one OrderLineItemDetail
     * const orderLineItemDetail = await prisma.orderLineItemDetail.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderLineItemDetailFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderLineItemDetailFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderLineItemDetailClient<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OrderLineItemDetail that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderLineItemDetailFindFirstArgs} args - Arguments to find a OrderLineItemDetail
     * @example
     * // Get one OrderLineItemDetail
     * const orderLineItemDetail = await prisma.orderLineItemDetail.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderLineItemDetailFindFirstArgs>(args?: SelectSubset<T, OrderLineItemDetailFindFirstArgs<ExtArgs>>): Prisma__OrderLineItemDetailClient<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OrderLineItemDetail that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderLineItemDetailFindFirstOrThrowArgs} args - Arguments to find a OrderLineItemDetail
     * @example
     * // Get one OrderLineItemDetail
     * const orderLineItemDetail = await prisma.orderLineItemDetail.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderLineItemDetailFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderLineItemDetailFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderLineItemDetailClient<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OrderLineItemDetails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderLineItemDetailFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderLineItemDetails
     * const orderLineItemDetails = await prisma.orderLineItemDetail.findMany()
     * 
     * // Get first 10 OrderLineItemDetails
     * const orderLineItemDetails = await prisma.orderLineItemDetail.findMany({ take: 10 })
     * 
     * // Only select the `lineItemId`
     * const orderLineItemDetailWithLineItemIdOnly = await prisma.orderLineItemDetail.findMany({ select: { lineItemId: true } })
     * 
     */
    findMany<T extends OrderLineItemDetailFindManyArgs>(args?: SelectSubset<T, OrderLineItemDetailFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OrderLineItemDetail.
     * @param {OrderLineItemDetailCreateArgs} args - Arguments to create a OrderLineItemDetail.
     * @example
     * // Create one OrderLineItemDetail
     * const OrderLineItemDetail = await prisma.orderLineItemDetail.create({
     *   data: {
     *     // ... data to create a OrderLineItemDetail
     *   }
     * })
     * 
     */
    create<T extends OrderLineItemDetailCreateArgs>(args: SelectSubset<T, OrderLineItemDetailCreateArgs<ExtArgs>>): Prisma__OrderLineItemDetailClient<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OrderLineItemDetails.
     * @param {OrderLineItemDetailCreateManyArgs} args - Arguments to create many OrderLineItemDetails.
     * @example
     * // Create many OrderLineItemDetails
     * const orderLineItemDetail = await prisma.orderLineItemDetail.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderLineItemDetailCreateManyArgs>(args?: SelectSubset<T, OrderLineItemDetailCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderLineItemDetails and returns the data saved in the database.
     * @param {OrderLineItemDetailCreateManyAndReturnArgs} args - Arguments to create many OrderLineItemDetails.
     * @example
     * // Create many OrderLineItemDetails
     * const orderLineItemDetail = await prisma.orderLineItemDetail.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderLineItemDetails and only return the `lineItemId`
     * const orderLineItemDetailWithLineItemIdOnly = await prisma.orderLineItemDetail.createManyAndReturn({ 
     *   select: { lineItemId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderLineItemDetailCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderLineItemDetailCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OrderLineItemDetail.
     * @param {OrderLineItemDetailDeleteArgs} args - Arguments to delete one OrderLineItemDetail.
     * @example
     * // Delete one OrderLineItemDetail
     * const OrderLineItemDetail = await prisma.orderLineItemDetail.delete({
     *   where: {
     *     // ... filter to delete one OrderLineItemDetail
     *   }
     * })
     * 
     */
    delete<T extends OrderLineItemDetailDeleteArgs>(args: SelectSubset<T, OrderLineItemDetailDeleteArgs<ExtArgs>>): Prisma__OrderLineItemDetailClient<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OrderLineItemDetail.
     * @param {OrderLineItemDetailUpdateArgs} args - Arguments to update one OrderLineItemDetail.
     * @example
     * // Update one OrderLineItemDetail
     * const orderLineItemDetail = await prisma.orderLineItemDetail.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderLineItemDetailUpdateArgs>(args: SelectSubset<T, OrderLineItemDetailUpdateArgs<ExtArgs>>): Prisma__OrderLineItemDetailClient<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OrderLineItemDetails.
     * @param {OrderLineItemDetailDeleteManyArgs} args - Arguments to filter OrderLineItemDetails to delete.
     * @example
     * // Delete a few OrderLineItemDetails
     * const { count } = await prisma.orderLineItemDetail.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderLineItemDetailDeleteManyArgs>(args?: SelectSubset<T, OrderLineItemDetailDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderLineItemDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderLineItemDetailUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderLineItemDetails
     * const orderLineItemDetail = await prisma.orderLineItemDetail.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderLineItemDetailUpdateManyArgs>(args: SelectSubset<T, OrderLineItemDetailUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OrderLineItemDetail.
     * @param {OrderLineItemDetailUpsertArgs} args - Arguments to update or create a OrderLineItemDetail.
     * @example
     * // Update or create a OrderLineItemDetail
     * const orderLineItemDetail = await prisma.orderLineItemDetail.upsert({
     *   create: {
     *     // ... data to create a OrderLineItemDetail
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderLineItemDetail we want to update
     *   }
     * })
     */
    upsert<T extends OrderLineItemDetailUpsertArgs>(args: SelectSubset<T, OrderLineItemDetailUpsertArgs<ExtArgs>>): Prisma__OrderLineItemDetailClient<$Result.GetResult<Prisma.$OrderLineItemDetailPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OrderLineItemDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderLineItemDetailCountArgs} args - Arguments to filter OrderLineItemDetails to count.
     * @example
     * // Count the number of OrderLineItemDetails
     * const count = await prisma.orderLineItemDetail.count({
     *   where: {
     *     // ... the filter for the OrderLineItemDetails we want to count
     *   }
     * })
    **/
    count<T extends OrderLineItemDetailCountArgs>(
      args?: Subset<T, OrderLineItemDetailCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderLineItemDetailCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderLineItemDetail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderLineItemDetailAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrderLineItemDetailAggregateArgs>(args: Subset<T, OrderLineItemDetailAggregateArgs>): Prisma.PrismaPromise<GetOrderLineItemDetailAggregateType<T>>

    /**
     * Group by OrderLineItemDetail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderLineItemDetailGroupByArgs} args - Group by arguments.
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
      T extends OrderLineItemDetailGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderLineItemDetailGroupByArgs['orderBy'] }
        : { orderBy?: OrderLineItemDetailGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OrderLineItemDetailGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderLineItemDetailGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderLineItemDetail model
   */
  readonly fields: OrderLineItemDetailFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderLineItemDetail.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderLineItemDetailClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends CustomerOrderHeaderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerOrderHeaderDefaultArgs<ExtArgs>>): Prisma__CustomerOrderHeaderClient<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    inventory<T extends OrderLineItemDetail$inventoryArgs<ExtArgs> = {}>(args?: Subset<T, OrderLineItemDetail$inventoryArgs<ExtArgs>>): Prisma__RetailStoreInventoryItemClient<$Result.GetResult<Prisma.$RetailStoreInventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the OrderLineItemDetail model
   */ 
  interface OrderLineItemDetailFieldRefs {
    readonly lineItemId: FieldRef<"OrderLineItemDetail", 'String'>
    readonly orderId: FieldRef<"OrderLineItemDetail", 'String'>
    readonly inventoryId: FieldRef<"OrderLineItemDetail", 'String'>
    readonly productName: FieldRef<"OrderLineItemDetail", 'String'>
    readonly quantity: FieldRef<"OrderLineItemDetail", 'Int'>
    readonly unitPrice: FieldRef<"OrderLineItemDetail", 'Decimal'>
    readonly totalAmount: FieldRef<"OrderLineItemDetail", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * OrderLineItemDetail findUnique
   */
  export type OrderLineItemDetailFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * Filter, which OrderLineItemDetail to fetch.
     */
    where: OrderLineItemDetailWhereUniqueInput
  }

  /**
   * OrderLineItemDetail findUniqueOrThrow
   */
  export type OrderLineItemDetailFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * Filter, which OrderLineItemDetail to fetch.
     */
    where: OrderLineItemDetailWhereUniqueInput
  }

  /**
   * OrderLineItemDetail findFirst
   */
  export type OrderLineItemDetailFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * Filter, which OrderLineItemDetail to fetch.
     */
    where?: OrderLineItemDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderLineItemDetails to fetch.
     */
    orderBy?: OrderLineItemDetailOrderByWithRelationInput | OrderLineItemDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderLineItemDetails.
     */
    cursor?: OrderLineItemDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderLineItemDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderLineItemDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderLineItemDetails.
     */
    distinct?: OrderLineItemDetailScalarFieldEnum | OrderLineItemDetailScalarFieldEnum[]
  }

  /**
   * OrderLineItemDetail findFirstOrThrow
   */
  export type OrderLineItemDetailFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * Filter, which OrderLineItemDetail to fetch.
     */
    where?: OrderLineItemDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderLineItemDetails to fetch.
     */
    orderBy?: OrderLineItemDetailOrderByWithRelationInput | OrderLineItemDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderLineItemDetails.
     */
    cursor?: OrderLineItemDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderLineItemDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderLineItemDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderLineItemDetails.
     */
    distinct?: OrderLineItemDetailScalarFieldEnum | OrderLineItemDetailScalarFieldEnum[]
  }

  /**
   * OrderLineItemDetail findMany
   */
  export type OrderLineItemDetailFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * Filter, which OrderLineItemDetails to fetch.
     */
    where?: OrderLineItemDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderLineItemDetails to fetch.
     */
    orderBy?: OrderLineItemDetailOrderByWithRelationInput | OrderLineItemDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderLineItemDetails.
     */
    cursor?: OrderLineItemDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderLineItemDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderLineItemDetails.
     */
    skip?: number
    distinct?: OrderLineItemDetailScalarFieldEnum | OrderLineItemDetailScalarFieldEnum[]
  }

  /**
   * OrderLineItemDetail create
   */
  export type OrderLineItemDetailCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderLineItemDetail.
     */
    data: XOR<OrderLineItemDetailCreateInput, OrderLineItemDetailUncheckedCreateInput>
  }

  /**
   * OrderLineItemDetail createMany
   */
  export type OrderLineItemDetailCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderLineItemDetails.
     */
    data: OrderLineItemDetailCreateManyInput | OrderLineItemDetailCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderLineItemDetail createManyAndReturn
   */
  export type OrderLineItemDetailCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OrderLineItemDetails.
     */
    data: OrderLineItemDetailCreateManyInput | OrderLineItemDetailCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderLineItemDetail update
   */
  export type OrderLineItemDetailUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderLineItemDetail.
     */
    data: XOR<OrderLineItemDetailUpdateInput, OrderLineItemDetailUncheckedUpdateInput>
    /**
     * Choose, which OrderLineItemDetail to update.
     */
    where: OrderLineItemDetailWhereUniqueInput
  }

  /**
   * OrderLineItemDetail updateMany
   */
  export type OrderLineItemDetailUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderLineItemDetails.
     */
    data: XOR<OrderLineItemDetailUpdateManyMutationInput, OrderLineItemDetailUncheckedUpdateManyInput>
    /**
     * Filter which OrderLineItemDetails to update
     */
    where?: OrderLineItemDetailWhereInput
  }

  /**
   * OrderLineItemDetail upsert
   */
  export type OrderLineItemDetailUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderLineItemDetail to update in case it exists.
     */
    where: OrderLineItemDetailWhereUniqueInput
    /**
     * In case the OrderLineItemDetail found by the `where` argument doesn't exist, create a new OrderLineItemDetail with this data.
     */
    create: XOR<OrderLineItemDetailCreateInput, OrderLineItemDetailUncheckedCreateInput>
    /**
     * In case the OrderLineItemDetail was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderLineItemDetailUpdateInput, OrderLineItemDetailUncheckedUpdateInput>
  }

  /**
   * OrderLineItemDetail delete
   */
  export type OrderLineItemDetailDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
    /**
     * Filter which OrderLineItemDetail to delete.
     */
    where: OrderLineItemDetailWhereUniqueInput
  }

  /**
   * OrderLineItemDetail deleteMany
   */
  export type OrderLineItemDetailDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderLineItemDetails to delete
     */
    where?: OrderLineItemDetailWhereInput
  }

  /**
   * OrderLineItemDetail.inventory
   */
  export type OrderLineItemDetail$inventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreInventoryItem
     */
    select?: RetailStoreInventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreInventoryItemInclude<ExtArgs> | null
    where?: RetailStoreInventoryItemWhereInput
  }

  /**
   * OrderLineItemDetail without action
   */
  export type OrderLineItemDetailDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderLineItemDetail
     */
    select?: OrderLineItemDetailSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderLineItemDetailInclude<ExtArgs> | null
  }


  /**
   * Model RetailStoreCustomer
   */

  export type AggregateRetailStoreCustomer = {
    _count: RetailStoreCustomerCountAggregateOutputType | null
    _avg: RetailStoreCustomerAvgAggregateOutputType | null
    _sum: RetailStoreCustomerSumAggregateOutputType | null
    _min: RetailStoreCustomerMinAggregateOutputType | null
    _max: RetailStoreCustomerMaxAggregateOutputType | null
  }

  export type RetailStoreCustomerAvgAggregateOutputType = {
    walletBalance: Decimal | null
    loyaltyPoints: number | null
  }

  export type RetailStoreCustomerSumAggregateOutputType = {
    walletBalance: Decimal | null
    loyaltyPoints: number | null
  }

  export type RetailStoreCustomerMinAggregateOutputType = {
    customerId: string | null
    userId: string | null
    walletBalance: Decimal | null
    loyaltyPoints: number | null
    createdAt: Date | null
  }

  export type RetailStoreCustomerMaxAggregateOutputType = {
    customerId: string | null
    userId: string | null
    walletBalance: Decimal | null
    loyaltyPoints: number | null
    createdAt: Date | null
  }

  export type RetailStoreCustomerCountAggregateOutputType = {
    customerId: number
    userId: number
    walletBalance: number
    loyaltyPoints: number
    createdAt: number
    _all: number
  }


  export type RetailStoreCustomerAvgAggregateInputType = {
    walletBalance?: true
    loyaltyPoints?: true
  }

  export type RetailStoreCustomerSumAggregateInputType = {
    walletBalance?: true
    loyaltyPoints?: true
  }

  export type RetailStoreCustomerMinAggregateInputType = {
    customerId?: true
    userId?: true
    walletBalance?: true
    loyaltyPoints?: true
    createdAt?: true
  }

  export type RetailStoreCustomerMaxAggregateInputType = {
    customerId?: true
    userId?: true
    walletBalance?: true
    loyaltyPoints?: true
    createdAt?: true
  }

  export type RetailStoreCustomerCountAggregateInputType = {
    customerId?: true
    userId?: true
    walletBalance?: true
    loyaltyPoints?: true
    createdAt?: true
    _all?: true
  }

  export type RetailStoreCustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetailStoreCustomer to aggregate.
     */
    where?: RetailStoreCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreCustomers to fetch.
     */
    orderBy?: RetailStoreCustomerOrderByWithRelationInput | RetailStoreCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RetailStoreCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RetailStoreCustomers
    **/
    _count?: true | RetailStoreCustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RetailStoreCustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RetailStoreCustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RetailStoreCustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RetailStoreCustomerMaxAggregateInputType
  }

  export type GetRetailStoreCustomerAggregateType<T extends RetailStoreCustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateRetailStoreCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetailStoreCustomer[P]>
      : GetScalarType<T[P], AggregateRetailStoreCustomer[P]>
  }




  export type RetailStoreCustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetailStoreCustomerWhereInput
    orderBy?: RetailStoreCustomerOrderByWithAggregationInput | RetailStoreCustomerOrderByWithAggregationInput[]
    by: RetailStoreCustomerScalarFieldEnum[] | RetailStoreCustomerScalarFieldEnum
    having?: RetailStoreCustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RetailStoreCustomerCountAggregateInputType | true
    _avg?: RetailStoreCustomerAvgAggregateInputType
    _sum?: RetailStoreCustomerSumAggregateInputType
    _min?: RetailStoreCustomerMinAggregateInputType
    _max?: RetailStoreCustomerMaxAggregateInputType
  }

  export type RetailStoreCustomerGroupByOutputType = {
    customerId: string
    userId: string | null
    walletBalance: Decimal | null
    loyaltyPoints: number | null
    createdAt: Date
    _count: RetailStoreCustomerCountAggregateOutputType | null
    _avg: RetailStoreCustomerAvgAggregateOutputType | null
    _sum: RetailStoreCustomerSumAggregateOutputType | null
    _min: RetailStoreCustomerMinAggregateOutputType | null
    _max: RetailStoreCustomerMaxAggregateOutputType | null
  }

  type GetRetailStoreCustomerGroupByPayload<T extends RetailStoreCustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RetailStoreCustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RetailStoreCustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RetailStoreCustomerGroupByOutputType[P]>
            : GetScalarType<T[P], RetailStoreCustomerGroupByOutputType[P]>
        }
      >
    >


  export type RetailStoreCustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    customerId?: boolean
    userId?: boolean
    walletBalance?: boolean
    loyaltyPoints?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["retailStoreCustomer"]>

  export type RetailStoreCustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    customerId?: boolean
    userId?: boolean
    walletBalance?: boolean
    loyaltyPoints?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["retailStoreCustomer"]>

  export type RetailStoreCustomerSelectScalar = {
    customerId?: boolean
    userId?: boolean
    walletBalance?: boolean
    loyaltyPoints?: boolean
    createdAt?: boolean
  }


  export type $RetailStoreCustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RetailStoreCustomer"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      customerId: string
      userId: string | null
      walletBalance: Prisma.Decimal | null
      loyaltyPoints: number | null
      createdAt: Date
    }, ExtArgs["result"]["retailStoreCustomer"]>
    composites: {}
  }

  type RetailStoreCustomerGetPayload<S extends boolean | null | undefined | RetailStoreCustomerDefaultArgs> = $Result.GetResult<Prisma.$RetailStoreCustomerPayload, S>

  type RetailStoreCustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RetailStoreCustomerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RetailStoreCustomerCountAggregateInputType | true
    }

  export interface RetailStoreCustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RetailStoreCustomer'], meta: { name: 'RetailStoreCustomer' } }
    /**
     * Find zero or one RetailStoreCustomer that matches the filter.
     * @param {RetailStoreCustomerFindUniqueArgs} args - Arguments to find a RetailStoreCustomer
     * @example
     * // Get one RetailStoreCustomer
     * const retailStoreCustomer = await prisma.retailStoreCustomer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RetailStoreCustomerFindUniqueArgs>(args: SelectSubset<T, RetailStoreCustomerFindUniqueArgs<ExtArgs>>): Prisma__RetailStoreCustomerClient<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RetailStoreCustomer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RetailStoreCustomerFindUniqueOrThrowArgs} args - Arguments to find a RetailStoreCustomer
     * @example
     * // Get one RetailStoreCustomer
     * const retailStoreCustomer = await prisma.retailStoreCustomer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RetailStoreCustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, RetailStoreCustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RetailStoreCustomerClient<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RetailStoreCustomer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreCustomerFindFirstArgs} args - Arguments to find a RetailStoreCustomer
     * @example
     * // Get one RetailStoreCustomer
     * const retailStoreCustomer = await prisma.retailStoreCustomer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RetailStoreCustomerFindFirstArgs>(args?: SelectSubset<T, RetailStoreCustomerFindFirstArgs<ExtArgs>>): Prisma__RetailStoreCustomerClient<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RetailStoreCustomer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreCustomerFindFirstOrThrowArgs} args - Arguments to find a RetailStoreCustomer
     * @example
     * // Get one RetailStoreCustomer
     * const retailStoreCustomer = await prisma.retailStoreCustomer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RetailStoreCustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, RetailStoreCustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__RetailStoreCustomerClient<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RetailStoreCustomers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreCustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RetailStoreCustomers
     * const retailStoreCustomers = await prisma.retailStoreCustomer.findMany()
     * 
     * // Get first 10 RetailStoreCustomers
     * const retailStoreCustomers = await prisma.retailStoreCustomer.findMany({ take: 10 })
     * 
     * // Only select the `customerId`
     * const retailStoreCustomerWithCustomerIdOnly = await prisma.retailStoreCustomer.findMany({ select: { customerId: true } })
     * 
     */
    findMany<T extends RetailStoreCustomerFindManyArgs>(args?: SelectSubset<T, RetailStoreCustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RetailStoreCustomer.
     * @param {RetailStoreCustomerCreateArgs} args - Arguments to create a RetailStoreCustomer.
     * @example
     * // Create one RetailStoreCustomer
     * const RetailStoreCustomer = await prisma.retailStoreCustomer.create({
     *   data: {
     *     // ... data to create a RetailStoreCustomer
     *   }
     * })
     * 
     */
    create<T extends RetailStoreCustomerCreateArgs>(args: SelectSubset<T, RetailStoreCustomerCreateArgs<ExtArgs>>): Prisma__RetailStoreCustomerClient<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RetailStoreCustomers.
     * @param {RetailStoreCustomerCreateManyArgs} args - Arguments to create many RetailStoreCustomers.
     * @example
     * // Create many RetailStoreCustomers
     * const retailStoreCustomer = await prisma.retailStoreCustomer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RetailStoreCustomerCreateManyArgs>(args?: SelectSubset<T, RetailStoreCustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RetailStoreCustomers and returns the data saved in the database.
     * @param {RetailStoreCustomerCreateManyAndReturnArgs} args - Arguments to create many RetailStoreCustomers.
     * @example
     * // Create many RetailStoreCustomers
     * const retailStoreCustomer = await prisma.retailStoreCustomer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RetailStoreCustomers and only return the `customerId`
     * const retailStoreCustomerWithCustomerIdOnly = await prisma.retailStoreCustomer.createManyAndReturn({ 
     *   select: { customerId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RetailStoreCustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, RetailStoreCustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RetailStoreCustomer.
     * @param {RetailStoreCustomerDeleteArgs} args - Arguments to delete one RetailStoreCustomer.
     * @example
     * // Delete one RetailStoreCustomer
     * const RetailStoreCustomer = await prisma.retailStoreCustomer.delete({
     *   where: {
     *     // ... filter to delete one RetailStoreCustomer
     *   }
     * })
     * 
     */
    delete<T extends RetailStoreCustomerDeleteArgs>(args: SelectSubset<T, RetailStoreCustomerDeleteArgs<ExtArgs>>): Prisma__RetailStoreCustomerClient<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RetailStoreCustomer.
     * @param {RetailStoreCustomerUpdateArgs} args - Arguments to update one RetailStoreCustomer.
     * @example
     * // Update one RetailStoreCustomer
     * const retailStoreCustomer = await prisma.retailStoreCustomer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RetailStoreCustomerUpdateArgs>(args: SelectSubset<T, RetailStoreCustomerUpdateArgs<ExtArgs>>): Prisma__RetailStoreCustomerClient<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RetailStoreCustomers.
     * @param {RetailStoreCustomerDeleteManyArgs} args - Arguments to filter RetailStoreCustomers to delete.
     * @example
     * // Delete a few RetailStoreCustomers
     * const { count } = await prisma.retailStoreCustomer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RetailStoreCustomerDeleteManyArgs>(args?: SelectSubset<T, RetailStoreCustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RetailStoreCustomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreCustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RetailStoreCustomers
     * const retailStoreCustomer = await prisma.retailStoreCustomer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RetailStoreCustomerUpdateManyArgs>(args: SelectSubset<T, RetailStoreCustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RetailStoreCustomer.
     * @param {RetailStoreCustomerUpsertArgs} args - Arguments to update or create a RetailStoreCustomer.
     * @example
     * // Update or create a RetailStoreCustomer
     * const retailStoreCustomer = await prisma.retailStoreCustomer.upsert({
     *   create: {
     *     // ... data to create a RetailStoreCustomer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RetailStoreCustomer we want to update
     *   }
     * })
     */
    upsert<T extends RetailStoreCustomerUpsertArgs>(args: SelectSubset<T, RetailStoreCustomerUpsertArgs<ExtArgs>>): Prisma__RetailStoreCustomerClient<$Result.GetResult<Prisma.$RetailStoreCustomerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RetailStoreCustomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreCustomerCountArgs} args - Arguments to filter RetailStoreCustomers to count.
     * @example
     * // Count the number of RetailStoreCustomers
     * const count = await prisma.retailStoreCustomer.count({
     *   where: {
     *     // ... the filter for the RetailStoreCustomers we want to count
     *   }
     * })
    **/
    count<T extends RetailStoreCustomerCountArgs>(
      args?: Subset<T, RetailStoreCustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RetailStoreCustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RetailStoreCustomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreCustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RetailStoreCustomerAggregateArgs>(args: Subset<T, RetailStoreCustomerAggregateArgs>): Prisma.PrismaPromise<GetRetailStoreCustomerAggregateType<T>>

    /**
     * Group by RetailStoreCustomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetailStoreCustomerGroupByArgs} args - Group by arguments.
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
      T extends RetailStoreCustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RetailStoreCustomerGroupByArgs['orderBy'] }
        : { orderBy?: RetailStoreCustomerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RetailStoreCustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetailStoreCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RetailStoreCustomer model
   */
  readonly fields: RetailStoreCustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RetailStoreCustomer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RetailStoreCustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the RetailStoreCustomer model
   */ 
  interface RetailStoreCustomerFieldRefs {
    readonly customerId: FieldRef<"RetailStoreCustomer", 'String'>
    readonly userId: FieldRef<"RetailStoreCustomer", 'String'>
    readonly walletBalance: FieldRef<"RetailStoreCustomer", 'Decimal'>
    readonly loyaltyPoints: FieldRef<"RetailStoreCustomer", 'Int'>
    readonly createdAt: FieldRef<"RetailStoreCustomer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RetailStoreCustomer findUnique
   */
  export type RetailStoreCustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * Filter, which RetailStoreCustomer to fetch.
     */
    where: RetailStoreCustomerWhereUniqueInput
  }

  /**
   * RetailStoreCustomer findUniqueOrThrow
   */
  export type RetailStoreCustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * Filter, which RetailStoreCustomer to fetch.
     */
    where: RetailStoreCustomerWhereUniqueInput
  }

  /**
   * RetailStoreCustomer findFirst
   */
  export type RetailStoreCustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * Filter, which RetailStoreCustomer to fetch.
     */
    where?: RetailStoreCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreCustomers to fetch.
     */
    orderBy?: RetailStoreCustomerOrderByWithRelationInput | RetailStoreCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetailStoreCustomers.
     */
    cursor?: RetailStoreCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetailStoreCustomers.
     */
    distinct?: RetailStoreCustomerScalarFieldEnum | RetailStoreCustomerScalarFieldEnum[]
  }

  /**
   * RetailStoreCustomer findFirstOrThrow
   */
  export type RetailStoreCustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * Filter, which RetailStoreCustomer to fetch.
     */
    where?: RetailStoreCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreCustomers to fetch.
     */
    orderBy?: RetailStoreCustomerOrderByWithRelationInput | RetailStoreCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetailStoreCustomers.
     */
    cursor?: RetailStoreCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetailStoreCustomers.
     */
    distinct?: RetailStoreCustomerScalarFieldEnum | RetailStoreCustomerScalarFieldEnum[]
  }

  /**
   * RetailStoreCustomer findMany
   */
  export type RetailStoreCustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * Filter, which RetailStoreCustomers to fetch.
     */
    where?: RetailStoreCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetailStoreCustomers to fetch.
     */
    orderBy?: RetailStoreCustomerOrderByWithRelationInput | RetailStoreCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RetailStoreCustomers.
     */
    cursor?: RetailStoreCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetailStoreCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetailStoreCustomers.
     */
    skip?: number
    distinct?: RetailStoreCustomerScalarFieldEnum | RetailStoreCustomerScalarFieldEnum[]
  }

  /**
   * RetailStoreCustomer create
   */
  export type RetailStoreCustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * The data needed to create a RetailStoreCustomer.
     */
    data?: XOR<RetailStoreCustomerCreateInput, RetailStoreCustomerUncheckedCreateInput>
  }

  /**
   * RetailStoreCustomer createMany
   */
  export type RetailStoreCustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RetailStoreCustomers.
     */
    data: RetailStoreCustomerCreateManyInput | RetailStoreCustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetailStoreCustomer createManyAndReturn
   */
  export type RetailStoreCustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RetailStoreCustomers.
     */
    data: RetailStoreCustomerCreateManyInput | RetailStoreCustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetailStoreCustomer update
   */
  export type RetailStoreCustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * The data needed to update a RetailStoreCustomer.
     */
    data: XOR<RetailStoreCustomerUpdateInput, RetailStoreCustomerUncheckedUpdateInput>
    /**
     * Choose, which RetailStoreCustomer to update.
     */
    where: RetailStoreCustomerWhereUniqueInput
  }

  /**
   * RetailStoreCustomer updateMany
   */
  export type RetailStoreCustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RetailStoreCustomers.
     */
    data: XOR<RetailStoreCustomerUpdateManyMutationInput, RetailStoreCustomerUncheckedUpdateManyInput>
    /**
     * Filter which RetailStoreCustomers to update
     */
    where?: RetailStoreCustomerWhereInput
  }

  /**
   * RetailStoreCustomer upsert
   */
  export type RetailStoreCustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * The filter to search for the RetailStoreCustomer to update in case it exists.
     */
    where: RetailStoreCustomerWhereUniqueInput
    /**
     * In case the RetailStoreCustomer found by the `where` argument doesn't exist, create a new RetailStoreCustomer with this data.
     */
    create: XOR<RetailStoreCustomerCreateInput, RetailStoreCustomerUncheckedCreateInput>
    /**
     * In case the RetailStoreCustomer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RetailStoreCustomerUpdateInput, RetailStoreCustomerUncheckedUpdateInput>
  }

  /**
   * RetailStoreCustomer delete
   */
  export type RetailStoreCustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
    /**
     * Filter which RetailStoreCustomer to delete.
     */
    where: RetailStoreCustomerWhereUniqueInput
  }

  /**
   * RetailStoreCustomer deleteMany
   */
  export type RetailStoreCustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetailStoreCustomers to delete
     */
    where?: RetailStoreCustomerWhereInput
  }

  /**
   * RetailStoreCustomer without action
   */
  export type RetailStoreCustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreCustomer
     */
    select?: RetailStoreCustomerSelect<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    fullName: string | null
    email: string | null
    phone: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    fullName: string | null
    email: string | null
    phone: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    tenantId: number
    fullName: number
    email: number
    phone: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerMinAggregateInputType = {
    id?: true
    tenantId?: true
    fullName?: true
    email?: true
    phone?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    tenantId?: true
    fullName?: true
    email?: true
    phone?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    tenantId?: true
    fullName?: true
    email?: true
    phone?: true
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
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    tenantId: string | null
    fullName: string | null
    email: string | null
    phone: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
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
    tenantId?: boolean
    fullName?: boolean
    email?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | Customer$tenantArgs<ExtArgs>
    orders?: boolean | Customer$ordersArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    fullName?: boolean
    email?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | Customer$tenantArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    tenantId?: boolean
    fullName?: boolean
    email?: boolean
    phone?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | Customer$tenantArgs<ExtArgs>
    orders?: boolean | Customer$ordersArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | Customer$tenantArgs<ExtArgs>
  }

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      tenant: Prisma.$RetailStoreTenantPayload<ExtArgs> | null
      orders: Prisma.$CustomerOrderHeaderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string | null
      fullName: string | null
      email: string | null
      phone: string | null
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
    tenant<T extends Customer$tenantArgs<ExtArgs> = {}>(args?: Subset<T, Customer$tenantArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    orders<T extends Customer$ordersArgs<ExtArgs> = {}>(args?: Subset<T, Customer$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerOrderHeaderPayload<ExtArgs>, T, "findMany"> | Null>
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
    readonly tenantId: FieldRef<"Customer", 'String'>
    readonly fullName: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
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
    data?: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerIncludeCreateManyAndReturn<ExtArgs> | null
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
   * Customer.tenant
   */
  export type Customer$tenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetailStoreTenant
     */
    select?: RetailStoreTenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetailStoreTenantInclude<ExtArgs> | null
    where?: RetailStoreTenantWhereInput
  }

  /**
   * Customer.orders
   */
  export type Customer$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerOrderHeader
     */
    select?: CustomerOrderHeaderSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerOrderHeaderInclude<ExtArgs> | null
    where?: CustomerOrderHeaderWhereInput
    orderBy?: CustomerOrderHeaderOrderByWithRelationInput | CustomerOrderHeaderOrderByWithRelationInput[]
    cursor?: CustomerOrderHeaderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerOrderHeaderScalarFieldEnum | CustomerOrderHeaderScalarFieldEnum[]
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
   * Model VendorInvoices
   */

  export type AggregateVendorInvoices = {
    _count: VendorInvoicesCountAggregateOutputType | null
    _avg: VendorInvoicesAvgAggregateOutputType | null
    _sum: VendorInvoicesSumAggregateOutputType | null
    _min: VendorInvoicesMinAggregateOutputType | null
    _max: VendorInvoicesMaxAggregateOutputType | null
  }

  export type VendorInvoicesAvgAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type VendorInvoicesSumAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type VendorInvoicesMinAggregateOutputType = {
    invoiceId: string | null
    tenantId: string | null
    vendorName: string | null
    invoiceDate: Date | null
    totalAmount: Decimal | null
    status: string | null
  }

  export type VendorInvoicesMaxAggregateOutputType = {
    invoiceId: string | null
    tenantId: string | null
    vendorName: string | null
    invoiceDate: Date | null
    totalAmount: Decimal | null
    status: string | null
  }

  export type VendorInvoicesCountAggregateOutputType = {
    invoiceId: number
    tenantId: number
    vendorName: number
    invoiceDate: number
    totalAmount: number
    status: number
    lineItems: number
    _all: number
  }


  export type VendorInvoicesAvgAggregateInputType = {
    totalAmount?: true
  }

  export type VendorInvoicesSumAggregateInputType = {
    totalAmount?: true
  }

  export type VendorInvoicesMinAggregateInputType = {
    invoiceId?: true
    tenantId?: true
    vendorName?: true
    invoiceDate?: true
    totalAmount?: true
    status?: true
  }

  export type VendorInvoicesMaxAggregateInputType = {
    invoiceId?: true
    tenantId?: true
    vendorName?: true
    invoiceDate?: true
    totalAmount?: true
    status?: true
  }

  export type VendorInvoicesCountAggregateInputType = {
    invoiceId?: true
    tenantId?: true
    vendorName?: true
    invoiceDate?: true
    totalAmount?: true
    status?: true
    lineItems?: true
    _all?: true
  }

  export type VendorInvoicesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VendorInvoices to aggregate.
     */
    where?: VendorInvoicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorInvoices to fetch.
     */
    orderBy?: VendorInvoicesOrderByWithRelationInput | VendorInvoicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorInvoicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VendorInvoices
    **/
    _count?: true | VendorInvoicesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VendorInvoicesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VendorInvoicesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorInvoicesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorInvoicesMaxAggregateInputType
  }

  export type GetVendorInvoicesAggregateType<T extends VendorInvoicesAggregateArgs> = {
        [P in keyof T & keyof AggregateVendorInvoices]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendorInvoices[P]>
      : GetScalarType<T[P], AggregateVendorInvoices[P]>
  }




  export type VendorInvoicesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorInvoicesWhereInput
    orderBy?: VendorInvoicesOrderByWithAggregationInput | VendorInvoicesOrderByWithAggregationInput[]
    by: VendorInvoicesScalarFieldEnum[] | VendorInvoicesScalarFieldEnum
    having?: VendorInvoicesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorInvoicesCountAggregateInputType | true
    _avg?: VendorInvoicesAvgAggregateInputType
    _sum?: VendorInvoicesSumAggregateInputType
    _min?: VendorInvoicesMinAggregateInputType
    _max?: VendorInvoicesMaxAggregateInputType
  }

  export type VendorInvoicesGroupByOutputType = {
    invoiceId: string
    tenantId: string
    vendorName: string
    invoiceDate: Date | null
    totalAmount: Decimal | null
    status: string
    lineItems: JsonValue | null
    _count: VendorInvoicesCountAggregateOutputType | null
    _avg: VendorInvoicesAvgAggregateOutputType | null
    _sum: VendorInvoicesSumAggregateOutputType | null
    _min: VendorInvoicesMinAggregateOutputType | null
    _max: VendorInvoicesMaxAggregateOutputType | null
  }

  type GetVendorInvoicesGroupByPayload<T extends VendorInvoicesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorInvoicesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorInvoicesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorInvoicesGroupByOutputType[P]>
            : GetScalarType<T[P], VendorInvoicesGroupByOutputType[P]>
        }
      >
    >


  export type VendorInvoicesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    invoiceId?: boolean
    tenantId?: boolean
    vendorName?: boolean
    invoiceDate?: boolean
    totalAmount?: boolean
    status?: boolean
    lineItems?: boolean
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendorInvoices"]>

  export type VendorInvoicesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    invoiceId?: boolean
    tenantId?: boolean
    vendorName?: boolean
    invoiceDate?: boolean
    totalAmount?: boolean
    status?: boolean
    lineItems?: boolean
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendorInvoices"]>

  export type VendorInvoicesSelectScalar = {
    invoiceId?: boolean
    tenantId?: boolean
    vendorName?: boolean
    invoiceDate?: boolean
    totalAmount?: boolean
    status?: boolean
    lineItems?: boolean
  }

  export type VendorInvoicesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
  }
  export type VendorInvoicesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | RetailStoreTenantDefaultArgs<ExtArgs>
  }

  export type $VendorInvoicesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VendorInvoices"
    objects: {
      tenant: Prisma.$RetailStoreTenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      invoiceId: string
      tenantId: string
      vendorName: string
      invoiceDate: Date | null
      totalAmount: Prisma.Decimal | null
      status: string
      lineItems: Prisma.JsonValue | null
    }, ExtArgs["result"]["vendorInvoices"]>
    composites: {}
  }

  type VendorInvoicesGetPayload<S extends boolean | null | undefined | VendorInvoicesDefaultArgs> = $Result.GetResult<Prisma.$VendorInvoicesPayload, S>

  type VendorInvoicesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VendorInvoicesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VendorInvoicesCountAggregateInputType | true
    }

  export interface VendorInvoicesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VendorInvoices'], meta: { name: 'VendorInvoices' } }
    /**
     * Find zero or one VendorInvoices that matches the filter.
     * @param {VendorInvoicesFindUniqueArgs} args - Arguments to find a VendorInvoices
     * @example
     * // Get one VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorInvoicesFindUniqueArgs>(args: SelectSubset<T, VendorInvoicesFindUniqueArgs<ExtArgs>>): Prisma__VendorInvoicesClient<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VendorInvoices that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VendorInvoicesFindUniqueOrThrowArgs} args - Arguments to find a VendorInvoices
     * @example
     * // Get one VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorInvoicesFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorInvoicesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorInvoicesClient<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VendorInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorInvoicesFindFirstArgs} args - Arguments to find a VendorInvoices
     * @example
     * // Get one VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorInvoicesFindFirstArgs>(args?: SelectSubset<T, VendorInvoicesFindFirstArgs<ExtArgs>>): Prisma__VendorInvoicesClient<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VendorInvoices that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorInvoicesFindFirstOrThrowArgs} args - Arguments to find a VendorInvoices
     * @example
     * // Get one VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorInvoicesFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorInvoicesFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorInvoicesClient<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VendorInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorInvoicesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.findMany()
     * 
     * // Get first 10 VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.findMany({ take: 10 })
     * 
     * // Only select the `invoiceId`
     * const vendorInvoicesWithInvoiceIdOnly = await prisma.vendorInvoices.findMany({ select: { invoiceId: true } })
     * 
     */
    findMany<T extends VendorInvoicesFindManyArgs>(args?: SelectSubset<T, VendorInvoicesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VendorInvoices.
     * @param {VendorInvoicesCreateArgs} args - Arguments to create a VendorInvoices.
     * @example
     * // Create one VendorInvoices
     * const VendorInvoices = await prisma.vendorInvoices.create({
     *   data: {
     *     // ... data to create a VendorInvoices
     *   }
     * })
     * 
     */
    create<T extends VendorInvoicesCreateArgs>(args: SelectSubset<T, VendorInvoicesCreateArgs<ExtArgs>>): Prisma__VendorInvoicesClient<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VendorInvoices.
     * @param {VendorInvoicesCreateManyArgs} args - Arguments to create many VendorInvoices.
     * @example
     * // Create many VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorInvoicesCreateManyArgs>(args?: SelectSubset<T, VendorInvoicesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VendorInvoices and returns the data saved in the database.
     * @param {VendorInvoicesCreateManyAndReturnArgs} args - Arguments to create many VendorInvoices.
     * @example
     * // Create many VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VendorInvoices and only return the `invoiceId`
     * const vendorInvoicesWithInvoiceIdOnly = await prisma.vendorInvoices.createManyAndReturn({ 
     *   select: { invoiceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VendorInvoicesCreateManyAndReturnArgs>(args?: SelectSubset<T, VendorInvoicesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VendorInvoices.
     * @param {VendorInvoicesDeleteArgs} args - Arguments to delete one VendorInvoices.
     * @example
     * // Delete one VendorInvoices
     * const VendorInvoices = await prisma.vendorInvoices.delete({
     *   where: {
     *     // ... filter to delete one VendorInvoices
     *   }
     * })
     * 
     */
    delete<T extends VendorInvoicesDeleteArgs>(args: SelectSubset<T, VendorInvoicesDeleteArgs<ExtArgs>>): Prisma__VendorInvoicesClient<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VendorInvoices.
     * @param {VendorInvoicesUpdateArgs} args - Arguments to update one VendorInvoices.
     * @example
     * // Update one VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorInvoicesUpdateArgs>(args: SelectSubset<T, VendorInvoicesUpdateArgs<ExtArgs>>): Prisma__VendorInvoicesClient<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VendorInvoices.
     * @param {VendorInvoicesDeleteManyArgs} args - Arguments to filter VendorInvoices to delete.
     * @example
     * // Delete a few VendorInvoices
     * const { count } = await prisma.vendorInvoices.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorInvoicesDeleteManyArgs>(args?: SelectSubset<T, VendorInvoicesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VendorInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorInvoicesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorInvoicesUpdateManyArgs>(args: SelectSubset<T, VendorInvoicesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VendorInvoices.
     * @param {VendorInvoicesUpsertArgs} args - Arguments to update or create a VendorInvoices.
     * @example
     * // Update or create a VendorInvoices
     * const vendorInvoices = await prisma.vendorInvoices.upsert({
     *   create: {
     *     // ... data to create a VendorInvoices
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VendorInvoices we want to update
     *   }
     * })
     */
    upsert<T extends VendorInvoicesUpsertArgs>(args: SelectSubset<T, VendorInvoicesUpsertArgs<ExtArgs>>): Prisma__VendorInvoicesClient<$Result.GetResult<Prisma.$VendorInvoicesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VendorInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorInvoicesCountArgs} args - Arguments to filter VendorInvoices to count.
     * @example
     * // Count the number of VendorInvoices
     * const count = await prisma.vendorInvoices.count({
     *   where: {
     *     // ... the filter for the VendorInvoices we want to count
     *   }
     * })
    **/
    count<T extends VendorInvoicesCountArgs>(
      args?: Subset<T, VendorInvoicesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorInvoicesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VendorInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorInvoicesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VendorInvoicesAggregateArgs>(args: Subset<T, VendorInvoicesAggregateArgs>): Prisma.PrismaPromise<GetVendorInvoicesAggregateType<T>>

    /**
     * Group by VendorInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorInvoicesGroupByArgs} args - Group by arguments.
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
      T extends VendorInvoicesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorInvoicesGroupByArgs['orderBy'] }
        : { orderBy?: VendorInvoicesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VendorInvoicesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorInvoicesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VendorInvoices model
   */
  readonly fields: VendorInvoicesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VendorInvoices.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorInvoicesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends RetailStoreTenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RetailStoreTenantDefaultArgs<ExtArgs>>): Prisma__RetailStoreTenantClient<$Result.GetResult<Prisma.$RetailStoreTenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the VendorInvoices model
   */ 
  interface VendorInvoicesFieldRefs {
    readonly invoiceId: FieldRef<"VendorInvoices", 'String'>
    readonly tenantId: FieldRef<"VendorInvoices", 'String'>
    readonly vendorName: FieldRef<"VendorInvoices", 'String'>
    readonly invoiceDate: FieldRef<"VendorInvoices", 'DateTime'>
    readonly totalAmount: FieldRef<"VendorInvoices", 'Decimal'>
    readonly status: FieldRef<"VendorInvoices", 'String'>
    readonly lineItems: FieldRef<"VendorInvoices", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * VendorInvoices findUnique
   */
  export type VendorInvoicesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * Filter, which VendorInvoices to fetch.
     */
    where: VendorInvoicesWhereUniqueInput
  }

  /**
   * VendorInvoices findUniqueOrThrow
   */
  export type VendorInvoicesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * Filter, which VendorInvoices to fetch.
     */
    where: VendorInvoicesWhereUniqueInput
  }

  /**
   * VendorInvoices findFirst
   */
  export type VendorInvoicesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * Filter, which VendorInvoices to fetch.
     */
    where?: VendorInvoicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorInvoices to fetch.
     */
    orderBy?: VendorInvoicesOrderByWithRelationInput | VendorInvoicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VendorInvoices.
     */
    cursor?: VendorInvoicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorInvoices.
     */
    distinct?: VendorInvoicesScalarFieldEnum | VendorInvoicesScalarFieldEnum[]
  }

  /**
   * VendorInvoices findFirstOrThrow
   */
  export type VendorInvoicesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * Filter, which VendorInvoices to fetch.
     */
    where?: VendorInvoicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorInvoices to fetch.
     */
    orderBy?: VendorInvoicesOrderByWithRelationInput | VendorInvoicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VendorInvoices.
     */
    cursor?: VendorInvoicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VendorInvoices.
     */
    distinct?: VendorInvoicesScalarFieldEnum | VendorInvoicesScalarFieldEnum[]
  }

  /**
   * VendorInvoices findMany
   */
  export type VendorInvoicesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * Filter, which VendorInvoices to fetch.
     */
    where?: VendorInvoicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VendorInvoices to fetch.
     */
    orderBy?: VendorInvoicesOrderByWithRelationInput | VendorInvoicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VendorInvoices.
     */
    cursor?: VendorInvoicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VendorInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VendorInvoices.
     */
    skip?: number
    distinct?: VendorInvoicesScalarFieldEnum | VendorInvoicesScalarFieldEnum[]
  }

  /**
   * VendorInvoices create
   */
  export type VendorInvoicesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * The data needed to create a VendorInvoices.
     */
    data: XOR<VendorInvoicesCreateInput, VendorInvoicesUncheckedCreateInput>
  }

  /**
   * VendorInvoices createMany
   */
  export type VendorInvoicesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VendorInvoices.
     */
    data: VendorInvoicesCreateManyInput | VendorInvoicesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VendorInvoices createManyAndReturn
   */
  export type VendorInvoicesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VendorInvoices.
     */
    data: VendorInvoicesCreateManyInput | VendorInvoicesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VendorInvoices update
   */
  export type VendorInvoicesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * The data needed to update a VendorInvoices.
     */
    data: XOR<VendorInvoicesUpdateInput, VendorInvoicesUncheckedUpdateInput>
    /**
     * Choose, which VendorInvoices to update.
     */
    where: VendorInvoicesWhereUniqueInput
  }

  /**
   * VendorInvoices updateMany
   */
  export type VendorInvoicesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VendorInvoices.
     */
    data: XOR<VendorInvoicesUpdateManyMutationInput, VendorInvoicesUncheckedUpdateManyInput>
    /**
     * Filter which VendorInvoices to update
     */
    where?: VendorInvoicesWhereInput
  }

  /**
   * VendorInvoices upsert
   */
  export type VendorInvoicesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * The filter to search for the VendorInvoices to update in case it exists.
     */
    where: VendorInvoicesWhereUniqueInput
    /**
     * In case the VendorInvoices found by the `where` argument doesn't exist, create a new VendorInvoices with this data.
     */
    create: XOR<VendorInvoicesCreateInput, VendorInvoicesUncheckedCreateInput>
    /**
     * In case the VendorInvoices was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorInvoicesUpdateInput, VendorInvoicesUncheckedUpdateInput>
  }

  /**
   * VendorInvoices delete
   */
  export type VendorInvoicesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
    /**
     * Filter which VendorInvoices to delete.
     */
    where: VendorInvoicesWhereUniqueInput
  }

  /**
   * VendorInvoices deleteMany
   */
  export type VendorInvoicesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VendorInvoices to delete
     */
    where?: VendorInvoicesWhereInput
  }

  /**
   * VendorInvoices without action
   */
  export type VendorInvoicesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorInvoices
     */
    select?: VendorInvoicesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInvoicesInclude<ExtArgs> | null
  }


  /**
   * Model SuperAdminUser
   */

  export type AggregateSuperAdminUser = {
    _count: SuperAdminUserCountAggregateOutputType | null
    _min: SuperAdminUserMinAggregateOutputType | null
    _max: SuperAdminUserMaxAggregateOutputType | null
  }

  export type SuperAdminUserMinAggregateOutputType = {
    id: string | null
    userId: string | null
  }

  export type SuperAdminUserMaxAggregateOutputType = {
    id: string | null
    userId: string | null
  }

  export type SuperAdminUserCountAggregateOutputType = {
    id: number
    userId: number
    _all: number
  }


  export type SuperAdminUserMinAggregateInputType = {
    id?: true
    userId?: true
  }

  export type SuperAdminUserMaxAggregateInputType = {
    id?: true
    userId?: true
  }

  export type SuperAdminUserCountAggregateInputType = {
    id?: true
    userId?: true
    _all?: true
  }

  export type SuperAdminUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdminUser to aggregate.
     */
    where?: SuperAdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdminUsers to fetch.
     */
    orderBy?: SuperAdminUserOrderByWithRelationInput | SuperAdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SuperAdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SuperAdminUsers
    **/
    _count?: true | SuperAdminUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SuperAdminUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SuperAdminUserMaxAggregateInputType
  }

  export type GetSuperAdminUserAggregateType<T extends SuperAdminUserAggregateArgs> = {
        [P in keyof T & keyof AggregateSuperAdminUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuperAdminUser[P]>
      : GetScalarType<T[P], AggregateSuperAdminUser[P]>
  }




  export type SuperAdminUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuperAdminUserWhereInput
    orderBy?: SuperAdminUserOrderByWithAggregationInput | SuperAdminUserOrderByWithAggregationInput[]
    by: SuperAdminUserScalarFieldEnum[] | SuperAdminUserScalarFieldEnum
    having?: SuperAdminUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuperAdminUserCountAggregateInputType | true
    _min?: SuperAdminUserMinAggregateInputType
    _max?: SuperAdminUserMaxAggregateInputType
  }

  export type SuperAdminUserGroupByOutputType = {
    id: string
    userId: string
    _count: SuperAdminUserCountAggregateOutputType | null
    _min: SuperAdminUserMinAggregateOutputType | null
    _max: SuperAdminUserMaxAggregateOutputType | null
  }

  type GetSuperAdminUserGroupByPayload<T extends SuperAdminUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuperAdminUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SuperAdminUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SuperAdminUserGroupByOutputType[P]>
            : GetScalarType<T[P], SuperAdminUserGroupByOutputType[P]>
        }
      >
    >


  export type SuperAdminUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["superAdminUser"]>

  export type SuperAdminUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["superAdminUser"]>

  export type SuperAdminUserSelectScalar = {
    id?: boolean
    userId?: boolean
  }

  export type SuperAdminUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SuperAdminUserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SuperAdminUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SuperAdminUser"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
    }, ExtArgs["result"]["superAdminUser"]>
    composites: {}
  }

  type SuperAdminUserGetPayload<S extends boolean | null | undefined | SuperAdminUserDefaultArgs> = $Result.GetResult<Prisma.$SuperAdminUserPayload, S>

  type SuperAdminUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SuperAdminUserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SuperAdminUserCountAggregateInputType | true
    }

  export interface SuperAdminUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuperAdminUser'], meta: { name: 'SuperAdminUser' } }
    /**
     * Find zero or one SuperAdminUser that matches the filter.
     * @param {SuperAdminUserFindUniqueArgs} args - Arguments to find a SuperAdminUser
     * @example
     * // Get one SuperAdminUser
     * const superAdminUser = await prisma.superAdminUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SuperAdminUserFindUniqueArgs>(args: SelectSubset<T, SuperAdminUserFindUniqueArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SuperAdminUser that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SuperAdminUserFindUniqueOrThrowArgs} args - Arguments to find a SuperAdminUser
     * @example
     * // Get one SuperAdminUser
     * const superAdminUser = await prisma.superAdminUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SuperAdminUserFindUniqueOrThrowArgs>(args: SelectSubset<T, SuperAdminUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SuperAdminUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUserFindFirstArgs} args - Arguments to find a SuperAdminUser
     * @example
     * // Get one SuperAdminUser
     * const superAdminUser = await prisma.superAdminUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SuperAdminUserFindFirstArgs>(args?: SelectSubset<T, SuperAdminUserFindFirstArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SuperAdminUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUserFindFirstOrThrowArgs} args - Arguments to find a SuperAdminUser
     * @example
     * // Get one SuperAdminUser
     * const superAdminUser = await prisma.superAdminUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SuperAdminUserFindFirstOrThrowArgs>(args?: SelectSubset<T, SuperAdminUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SuperAdminUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuperAdminUsers
     * const superAdminUsers = await prisma.superAdminUser.findMany()
     * 
     * // Get first 10 SuperAdminUsers
     * const superAdminUsers = await prisma.superAdminUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const superAdminUserWithIdOnly = await prisma.superAdminUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SuperAdminUserFindManyArgs>(args?: SelectSubset<T, SuperAdminUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SuperAdminUser.
     * @param {SuperAdminUserCreateArgs} args - Arguments to create a SuperAdminUser.
     * @example
     * // Create one SuperAdminUser
     * const SuperAdminUser = await prisma.superAdminUser.create({
     *   data: {
     *     // ... data to create a SuperAdminUser
     *   }
     * })
     * 
     */
    create<T extends SuperAdminUserCreateArgs>(args: SelectSubset<T, SuperAdminUserCreateArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SuperAdminUsers.
     * @param {SuperAdminUserCreateManyArgs} args - Arguments to create many SuperAdminUsers.
     * @example
     * // Create many SuperAdminUsers
     * const superAdminUser = await prisma.superAdminUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SuperAdminUserCreateManyArgs>(args?: SelectSubset<T, SuperAdminUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SuperAdminUsers and returns the data saved in the database.
     * @param {SuperAdminUserCreateManyAndReturnArgs} args - Arguments to create many SuperAdminUsers.
     * @example
     * // Create many SuperAdminUsers
     * const superAdminUser = await prisma.superAdminUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SuperAdminUsers and only return the `id`
     * const superAdminUserWithIdOnly = await prisma.superAdminUser.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SuperAdminUserCreateManyAndReturnArgs>(args?: SelectSubset<T, SuperAdminUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SuperAdminUser.
     * @param {SuperAdminUserDeleteArgs} args - Arguments to delete one SuperAdminUser.
     * @example
     * // Delete one SuperAdminUser
     * const SuperAdminUser = await prisma.superAdminUser.delete({
     *   where: {
     *     // ... filter to delete one SuperAdminUser
     *   }
     * })
     * 
     */
    delete<T extends SuperAdminUserDeleteArgs>(args: SelectSubset<T, SuperAdminUserDeleteArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SuperAdminUser.
     * @param {SuperAdminUserUpdateArgs} args - Arguments to update one SuperAdminUser.
     * @example
     * // Update one SuperAdminUser
     * const superAdminUser = await prisma.superAdminUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SuperAdminUserUpdateArgs>(args: SelectSubset<T, SuperAdminUserUpdateArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SuperAdminUsers.
     * @param {SuperAdminUserDeleteManyArgs} args - Arguments to filter SuperAdminUsers to delete.
     * @example
     * // Delete a few SuperAdminUsers
     * const { count } = await prisma.superAdminUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SuperAdminUserDeleteManyArgs>(args?: SelectSubset<T, SuperAdminUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuperAdminUsers
     * const superAdminUser = await prisma.superAdminUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SuperAdminUserUpdateManyArgs>(args: SelectSubset<T, SuperAdminUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SuperAdminUser.
     * @param {SuperAdminUserUpsertArgs} args - Arguments to update or create a SuperAdminUser.
     * @example
     * // Update or create a SuperAdminUser
     * const superAdminUser = await prisma.superAdminUser.upsert({
     *   create: {
     *     // ... data to create a SuperAdminUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuperAdminUser we want to update
     *   }
     * })
     */
    upsert<T extends SuperAdminUserUpsertArgs>(args: SelectSubset<T, SuperAdminUserUpsertArgs<ExtArgs>>): Prisma__SuperAdminUserClient<$Result.GetResult<Prisma.$SuperAdminUserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SuperAdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUserCountArgs} args - Arguments to filter SuperAdminUsers to count.
     * @example
     * // Count the number of SuperAdminUsers
     * const count = await prisma.superAdminUser.count({
     *   where: {
     *     // ... the filter for the SuperAdminUsers we want to count
     *   }
     * })
    **/
    count<T extends SuperAdminUserCountArgs>(
      args?: Subset<T, SuperAdminUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuperAdminUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuperAdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SuperAdminUserAggregateArgs>(args: Subset<T, SuperAdminUserAggregateArgs>): Prisma.PrismaPromise<GetSuperAdminUserAggregateType<T>>

    /**
     * Group by SuperAdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUserGroupByArgs} args - Group by arguments.
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
      T extends SuperAdminUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuperAdminUserGroupByArgs['orderBy'] }
        : { orderBy?: SuperAdminUserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SuperAdminUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuperAdminUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SuperAdminUser model
   */
  readonly fields: SuperAdminUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuperAdminUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuperAdminUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the SuperAdminUser model
   */ 
  interface SuperAdminUserFieldRefs {
    readonly id: FieldRef<"SuperAdminUser", 'String'>
    readonly userId: FieldRef<"SuperAdminUser", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SuperAdminUser findUnique
   */
  export type SuperAdminUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminUser to fetch.
     */
    where: SuperAdminUserWhereUniqueInput
  }

  /**
   * SuperAdminUser findUniqueOrThrow
   */
  export type SuperAdminUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminUser to fetch.
     */
    where: SuperAdminUserWhereUniqueInput
  }

  /**
   * SuperAdminUser findFirst
   */
  export type SuperAdminUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminUser to fetch.
     */
    where?: SuperAdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdminUsers to fetch.
     */
    orderBy?: SuperAdminUserOrderByWithRelationInput | SuperAdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdminUsers.
     */
    cursor?: SuperAdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdminUsers.
     */
    distinct?: SuperAdminUserScalarFieldEnum | SuperAdminUserScalarFieldEnum[]
  }

  /**
   * SuperAdminUser findFirstOrThrow
   */
  export type SuperAdminUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminUser to fetch.
     */
    where?: SuperAdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdminUsers to fetch.
     */
    orderBy?: SuperAdminUserOrderByWithRelationInput | SuperAdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdminUsers.
     */
    cursor?: SuperAdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdminUsers.
     */
    distinct?: SuperAdminUserScalarFieldEnum | SuperAdminUserScalarFieldEnum[]
  }

  /**
   * SuperAdminUser findMany
   */
  export type SuperAdminUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdminUsers to fetch.
     */
    where?: SuperAdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdminUsers to fetch.
     */
    orderBy?: SuperAdminUserOrderByWithRelationInput | SuperAdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SuperAdminUsers.
     */
    cursor?: SuperAdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdminUsers.
     */
    skip?: number
    distinct?: SuperAdminUserScalarFieldEnum | SuperAdminUserScalarFieldEnum[]
  }

  /**
   * SuperAdminUser create
   */
  export type SuperAdminUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * The data needed to create a SuperAdminUser.
     */
    data: XOR<SuperAdminUserCreateInput, SuperAdminUserUncheckedCreateInput>
  }

  /**
   * SuperAdminUser createMany
   */
  export type SuperAdminUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuperAdminUsers.
     */
    data: SuperAdminUserCreateManyInput | SuperAdminUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdminUser createManyAndReturn
   */
  export type SuperAdminUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SuperAdminUsers.
     */
    data: SuperAdminUserCreateManyInput | SuperAdminUserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SuperAdminUser update
   */
  export type SuperAdminUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * The data needed to update a SuperAdminUser.
     */
    data: XOR<SuperAdminUserUpdateInput, SuperAdminUserUncheckedUpdateInput>
    /**
     * Choose, which SuperAdminUser to update.
     */
    where: SuperAdminUserWhereUniqueInput
  }

  /**
   * SuperAdminUser updateMany
   */
  export type SuperAdminUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuperAdminUsers.
     */
    data: XOR<SuperAdminUserUpdateManyMutationInput, SuperAdminUserUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdminUsers to update
     */
    where?: SuperAdminUserWhereInput
  }

  /**
   * SuperAdminUser upsert
   */
  export type SuperAdminUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * The filter to search for the SuperAdminUser to update in case it exists.
     */
    where: SuperAdminUserWhereUniqueInput
    /**
     * In case the SuperAdminUser found by the `where` argument doesn't exist, create a new SuperAdminUser with this data.
     */
    create: XOR<SuperAdminUserCreateInput, SuperAdminUserUncheckedCreateInput>
    /**
     * In case the SuperAdminUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuperAdminUserUpdateInput, SuperAdminUserUncheckedUpdateInput>
  }

  /**
   * SuperAdminUser delete
   */
  export type SuperAdminUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
    /**
     * Filter which SuperAdminUser to delete.
     */
    where: SuperAdminUserWhereUniqueInput
  }

  /**
   * SuperAdminUser deleteMany
   */
  export type SuperAdminUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdminUsers to delete
     */
    where?: SuperAdminUserWhereInput
  }

  /**
   * SuperAdminUser without action
   */
  export type SuperAdminUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminUser
     */
    select?: SuperAdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminUserInclude<ExtArgs> | null
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
    updatedAt: 'updatedAt',
    tenantId: 'tenantId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RetailStoreTenantScalarFieldEnum: {
    tenantId: 'tenantId',
    storeName: 'storeName',
    subdomain: 'subdomain',
    isActive: 'isActive',
    ownerUserId: 'ownerUserId'
  };

  export type RetailStoreTenantScalarFieldEnum = (typeof RetailStoreTenantScalarFieldEnum)[keyof typeof RetailStoreTenantScalarFieldEnum]


  export const GlobalProductMasterCatalogScalarFieldEnum: {
    productId: 'productId',
    productName: 'productName',
    sku: 'sku',
    category: 'category',
    description: 'description',
    imageUrl: 'imageUrl',
    isActive: 'isActive'
  };

  export type GlobalProductMasterCatalogScalarFieldEnum = (typeof GlobalProductMasterCatalogScalarFieldEnum)[keyof typeof GlobalProductMasterCatalogScalarFieldEnum]


  export const RetailStoreInventoryItemScalarFieldEnum: {
    inventoryId: 'inventoryId',
    tenantId: 'tenantId',
    globalProductId: 'globalProductId',
    currentStock: 'currentStock',
    reorderLevel: 'reorderLevel',
    sellingPrice: 'sellingPrice',
    costPrice: 'costPrice',
    isActive: 'isActive'
  };

  export type RetailStoreInventoryItemScalarFieldEnum = (typeof RetailStoreInventoryItemScalarFieldEnum)[keyof typeof RetailStoreInventoryItemScalarFieldEnum]


  export const CustomerOrderHeaderScalarFieldEnum: {
    orderId: 'orderId',
    tenantId: 'tenantId',
    customerId: 'customerId',
    orderNumber: 'orderNumber',
    totalAmount: 'totalAmount',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type CustomerOrderHeaderScalarFieldEnum = (typeof CustomerOrderHeaderScalarFieldEnum)[keyof typeof CustomerOrderHeaderScalarFieldEnum]


  export const OrderLineItemDetailScalarFieldEnum: {
    lineItemId: 'lineItemId',
    orderId: 'orderId',
    inventoryId: 'inventoryId',
    productName: 'productName',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    totalAmount: 'totalAmount'
  };

  export type OrderLineItemDetailScalarFieldEnum = (typeof OrderLineItemDetailScalarFieldEnum)[keyof typeof OrderLineItemDetailScalarFieldEnum]


  export const RetailStoreCustomerScalarFieldEnum: {
    customerId: 'customerId',
    userId: 'userId',
    walletBalance: 'walletBalance',
    loyaltyPoints: 'loyaltyPoints',
    createdAt: 'createdAt'
  };

  export type RetailStoreCustomerScalarFieldEnum = (typeof RetailStoreCustomerScalarFieldEnum)[keyof typeof RetailStoreCustomerScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    fullName: 'fullName',
    email: 'email',
    phone: 'phone',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const VendorInvoicesScalarFieldEnum: {
    invoiceId: 'invoiceId',
    tenantId: 'tenantId',
    vendorName: 'vendorName',
    invoiceDate: 'invoiceDate',
    totalAmount: 'totalAmount',
    status: 'status',
    lineItems: 'lineItems'
  };

  export type VendorInvoicesScalarFieldEnum = (typeof VendorInvoicesScalarFieldEnum)[keyof typeof VendorInvoicesScalarFieldEnum]


  export const SuperAdminUserScalarFieldEnum: {
    id: 'id',
    userId: 'userId'
  };

  export type SuperAdminUserScalarFieldEnum = (typeof SuperAdminUserScalarFieldEnum)[keyof typeof SuperAdminUserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


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
    tenantId?: StringNullableFilter<"User"> | string | null
    RetailStoreTenants?: RetailStoreTenantListRelationFilter
    SuperAdminProfile?: XOR<SuperAdminUserNullableRelationFilter, SuperAdminUserWhereInput> | null
    tenant?: XOR<RetailStoreTenantNullableRelationFilter, RetailStoreTenantWhereInput> | null
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
    tenantId?: SortOrderInput | SortOrder
    RetailStoreTenants?: RetailStoreTenantOrderByRelationAggregateInput
    SuperAdminProfile?: SuperAdminUserOrderByWithRelationInput
    tenant?: RetailStoreTenantOrderByWithRelationInput
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
    tenantId?: StringNullableFilter<"User"> | string | null
    RetailStoreTenants?: RetailStoreTenantListRelationFilter
    SuperAdminProfile?: XOR<SuperAdminUserNullableRelationFilter, SuperAdminUserWhereInput> | null
    tenant?: XOR<RetailStoreTenantNullableRelationFilter, RetailStoreTenantWhereInput> | null
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
    tenantId?: SortOrderInput | SortOrder
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
    tenantId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type RetailStoreTenantWhereInput = {
    AND?: RetailStoreTenantWhereInput | RetailStoreTenantWhereInput[]
    OR?: RetailStoreTenantWhereInput[]
    NOT?: RetailStoreTenantWhereInput | RetailStoreTenantWhereInput[]
    tenantId?: StringFilter<"RetailStoreTenant"> | string
    storeName?: StringFilter<"RetailStoreTenant"> | string
    subdomain?: StringNullableFilter<"RetailStoreTenant"> | string | null
    isActive?: BoolFilter<"RetailStoreTenant"> | boolean
    ownerUserId?: StringNullableFilter<"RetailStoreTenant"> | string | null
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    InventoryItems?: RetailStoreInventoryItemListRelationFilter
    Orders?: CustomerOrderHeaderListRelationFilter
    VendorInvoices?: VendorInvoicesListRelationFilter
    Customers?: CustomerListRelationFilter
    Users?: UserListRelationFilter
  }

  export type RetailStoreTenantOrderByWithRelationInput = {
    tenantId?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrderInput | SortOrder
    isActive?: SortOrder
    ownerUserId?: SortOrderInput | SortOrder
    owner?: UserOrderByWithRelationInput
    InventoryItems?: RetailStoreInventoryItemOrderByRelationAggregateInput
    Orders?: CustomerOrderHeaderOrderByRelationAggregateInput
    VendorInvoices?: VendorInvoicesOrderByRelationAggregateInput
    Customers?: CustomerOrderByRelationAggregateInput
    Users?: UserOrderByRelationAggregateInput
  }

  export type RetailStoreTenantWhereUniqueInput = Prisma.AtLeast<{
    tenantId?: string
    subdomain?: string
    AND?: RetailStoreTenantWhereInput | RetailStoreTenantWhereInput[]
    OR?: RetailStoreTenantWhereInput[]
    NOT?: RetailStoreTenantWhereInput | RetailStoreTenantWhereInput[]
    storeName?: StringFilter<"RetailStoreTenant"> | string
    isActive?: BoolFilter<"RetailStoreTenant"> | boolean
    ownerUserId?: StringNullableFilter<"RetailStoreTenant"> | string | null
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    InventoryItems?: RetailStoreInventoryItemListRelationFilter
    Orders?: CustomerOrderHeaderListRelationFilter
    VendorInvoices?: VendorInvoicesListRelationFilter
    Customers?: CustomerListRelationFilter
    Users?: UserListRelationFilter
  }, "tenantId" | "subdomain">

  export type RetailStoreTenantOrderByWithAggregationInput = {
    tenantId?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrderInput | SortOrder
    isActive?: SortOrder
    ownerUserId?: SortOrderInput | SortOrder
    _count?: RetailStoreTenantCountOrderByAggregateInput
    _max?: RetailStoreTenantMaxOrderByAggregateInput
    _min?: RetailStoreTenantMinOrderByAggregateInput
  }

  export type RetailStoreTenantScalarWhereWithAggregatesInput = {
    AND?: RetailStoreTenantScalarWhereWithAggregatesInput | RetailStoreTenantScalarWhereWithAggregatesInput[]
    OR?: RetailStoreTenantScalarWhereWithAggregatesInput[]
    NOT?: RetailStoreTenantScalarWhereWithAggregatesInput | RetailStoreTenantScalarWhereWithAggregatesInput[]
    tenantId?: StringWithAggregatesFilter<"RetailStoreTenant"> | string
    storeName?: StringWithAggregatesFilter<"RetailStoreTenant"> | string
    subdomain?: StringNullableWithAggregatesFilter<"RetailStoreTenant"> | string | null
    isActive?: BoolWithAggregatesFilter<"RetailStoreTenant"> | boolean
    ownerUserId?: StringNullableWithAggregatesFilter<"RetailStoreTenant"> | string | null
  }

  export type GlobalProductMasterCatalogWhereInput = {
    AND?: GlobalProductMasterCatalogWhereInput | GlobalProductMasterCatalogWhereInput[]
    OR?: GlobalProductMasterCatalogWhereInput[]
    NOT?: GlobalProductMasterCatalogWhereInput | GlobalProductMasterCatalogWhereInput[]
    productId?: StringFilter<"GlobalProductMasterCatalog"> | string
    productName?: StringFilter<"GlobalProductMasterCatalog"> | string
    sku?: StringNullableFilter<"GlobalProductMasterCatalog"> | string | null
    category?: StringNullableFilter<"GlobalProductMasterCatalog"> | string | null
    description?: StringNullableFilter<"GlobalProductMasterCatalog"> | string | null
    imageUrl?: StringNullableFilter<"GlobalProductMasterCatalog"> | string | null
    isActive?: BoolFilter<"GlobalProductMasterCatalog"> | boolean
    InventoryItems?: RetailStoreInventoryItemListRelationFilter
  }

  export type GlobalProductMasterCatalogOrderByWithRelationInput = {
    productId?: SortOrder
    productName?: SortOrder
    sku?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    InventoryItems?: RetailStoreInventoryItemOrderByRelationAggregateInput
  }

  export type GlobalProductMasterCatalogWhereUniqueInput = Prisma.AtLeast<{
    productId?: string
    sku?: string
    AND?: GlobalProductMasterCatalogWhereInput | GlobalProductMasterCatalogWhereInput[]
    OR?: GlobalProductMasterCatalogWhereInput[]
    NOT?: GlobalProductMasterCatalogWhereInput | GlobalProductMasterCatalogWhereInput[]
    productName?: StringFilter<"GlobalProductMasterCatalog"> | string
    category?: StringNullableFilter<"GlobalProductMasterCatalog"> | string | null
    description?: StringNullableFilter<"GlobalProductMasterCatalog"> | string | null
    imageUrl?: StringNullableFilter<"GlobalProductMasterCatalog"> | string | null
    isActive?: BoolFilter<"GlobalProductMasterCatalog"> | boolean
    InventoryItems?: RetailStoreInventoryItemListRelationFilter
  }, "productId" | "sku">

  export type GlobalProductMasterCatalogOrderByWithAggregationInput = {
    productId?: SortOrder
    productName?: SortOrder
    sku?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: GlobalProductMasterCatalogCountOrderByAggregateInput
    _max?: GlobalProductMasterCatalogMaxOrderByAggregateInput
    _min?: GlobalProductMasterCatalogMinOrderByAggregateInput
  }

  export type GlobalProductMasterCatalogScalarWhereWithAggregatesInput = {
    AND?: GlobalProductMasterCatalogScalarWhereWithAggregatesInput | GlobalProductMasterCatalogScalarWhereWithAggregatesInput[]
    OR?: GlobalProductMasterCatalogScalarWhereWithAggregatesInput[]
    NOT?: GlobalProductMasterCatalogScalarWhereWithAggregatesInput | GlobalProductMasterCatalogScalarWhereWithAggregatesInput[]
    productId?: StringWithAggregatesFilter<"GlobalProductMasterCatalog"> | string
    productName?: StringWithAggregatesFilter<"GlobalProductMasterCatalog"> | string
    sku?: StringNullableWithAggregatesFilter<"GlobalProductMasterCatalog"> | string | null
    category?: StringNullableWithAggregatesFilter<"GlobalProductMasterCatalog"> | string | null
    description?: StringNullableWithAggregatesFilter<"GlobalProductMasterCatalog"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"GlobalProductMasterCatalog"> | string | null
    isActive?: BoolWithAggregatesFilter<"GlobalProductMasterCatalog"> | boolean
  }

  export type RetailStoreInventoryItemWhereInput = {
    AND?: RetailStoreInventoryItemWhereInput | RetailStoreInventoryItemWhereInput[]
    OR?: RetailStoreInventoryItemWhereInput[]
    NOT?: RetailStoreInventoryItemWhereInput | RetailStoreInventoryItemWhereInput[]
    inventoryId?: StringFilter<"RetailStoreInventoryItem"> | string
    tenantId?: StringFilter<"RetailStoreInventoryItem"> | string
    globalProductId?: StringNullableFilter<"RetailStoreInventoryItem"> | string | null
    currentStock?: IntFilter<"RetailStoreInventoryItem"> | number
    reorderLevel?: IntFilter<"RetailStoreInventoryItem"> | number
    sellingPrice?: DecimalNullableFilter<"RetailStoreInventoryItem"> | Decimal | DecimalJsLike | number | string | null
    costPrice?: DecimalNullableFilter<"RetailStoreInventoryItem"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFilter<"RetailStoreInventoryItem"> | boolean
    tenant?: XOR<RetailStoreTenantRelationFilter, RetailStoreTenantWhereInput>
    globalProduct?: XOR<GlobalProductMasterCatalogNullableRelationFilter, GlobalProductMasterCatalogWhereInput> | null
    lineItems?: OrderLineItemDetailListRelationFilter
  }

  export type RetailStoreInventoryItemOrderByWithRelationInput = {
    inventoryId?: SortOrder
    tenantId?: SortOrder
    globalProductId?: SortOrderInput | SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    sellingPrice?: SortOrderInput | SortOrder
    costPrice?: SortOrderInput | SortOrder
    isActive?: SortOrder
    tenant?: RetailStoreTenantOrderByWithRelationInput
    globalProduct?: GlobalProductMasterCatalogOrderByWithRelationInput
    lineItems?: OrderLineItemDetailOrderByRelationAggregateInput
  }

  export type RetailStoreInventoryItemWhereUniqueInput = Prisma.AtLeast<{
    inventoryId?: string
    AND?: RetailStoreInventoryItemWhereInput | RetailStoreInventoryItemWhereInput[]
    OR?: RetailStoreInventoryItemWhereInput[]
    NOT?: RetailStoreInventoryItemWhereInput | RetailStoreInventoryItemWhereInput[]
    tenantId?: StringFilter<"RetailStoreInventoryItem"> | string
    globalProductId?: StringNullableFilter<"RetailStoreInventoryItem"> | string | null
    currentStock?: IntFilter<"RetailStoreInventoryItem"> | number
    reorderLevel?: IntFilter<"RetailStoreInventoryItem"> | number
    sellingPrice?: DecimalNullableFilter<"RetailStoreInventoryItem"> | Decimal | DecimalJsLike | number | string | null
    costPrice?: DecimalNullableFilter<"RetailStoreInventoryItem"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFilter<"RetailStoreInventoryItem"> | boolean
    tenant?: XOR<RetailStoreTenantRelationFilter, RetailStoreTenantWhereInput>
    globalProduct?: XOR<GlobalProductMasterCatalogNullableRelationFilter, GlobalProductMasterCatalogWhereInput> | null
    lineItems?: OrderLineItemDetailListRelationFilter
  }, "inventoryId">

  export type RetailStoreInventoryItemOrderByWithAggregationInput = {
    inventoryId?: SortOrder
    tenantId?: SortOrder
    globalProductId?: SortOrderInput | SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    sellingPrice?: SortOrderInput | SortOrder
    costPrice?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: RetailStoreInventoryItemCountOrderByAggregateInput
    _avg?: RetailStoreInventoryItemAvgOrderByAggregateInput
    _max?: RetailStoreInventoryItemMaxOrderByAggregateInput
    _min?: RetailStoreInventoryItemMinOrderByAggregateInput
    _sum?: RetailStoreInventoryItemSumOrderByAggregateInput
  }

  export type RetailStoreInventoryItemScalarWhereWithAggregatesInput = {
    AND?: RetailStoreInventoryItemScalarWhereWithAggregatesInput | RetailStoreInventoryItemScalarWhereWithAggregatesInput[]
    OR?: RetailStoreInventoryItemScalarWhereWithAggregatesInput[]
    NOT?: RetailStoreInventoryItemScalarWhereWithAggregatesInput | RetailStoreInventoryItemScalarWhereWithAggregatesInput[]
    inventoryId?: StringWithAggregatesFilter<"RetailStoreInventoryItem"> | string
    tenantId?: StringWithAggregatesFilter<"RetailStoreInventoryItem"> | string
    globalProductId?: StringNullableWithAggregatesFilter<"RetailStoreInventoryItem"> | string | null
    currentStock?: IntWithAggregatesFilter<"RetailStoreInventoryItem"> | number
    reorderLevel?: IntWithAggregatesFilter<"RetailStoreInventoryItem"> | number
    sellingPrice?: DecimalNullableWithAggregatesFilter<"RetailStoreInventoryItem"> | Decimal | DecimalJsLike | number | string | null
    costPrice?: DecimalNullableWithAggregatesFilter<"RetailStoreInventoryItem"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolWithAggregatesFilter<"RetailStoreInventoryItem"> | boolean
  }

  export type CustomerOrderHeaderWhereInput = {
    AND?: CustomerOrderHeaderWhereInput | CustomerOrderHeaderWhereInput[]
    OR?: CustomerOrderHeaderWhereInput[]
    NOT?: CustomerOrderHeaderWhereInput | CustomerOrderHeaderWhereInput[]
    orderId?: StringFilter<"CustomerOrderHeader"> | string
    tenantId?: StringFilter<"CustomerOrderHeader"> | string
    customerId?: StringNullableFilter<"CustomerOrderHeader"> | string | null
    orderNumber?: StringNullableFilter<"CustomerOrderHeader"> | string | null
    totalAmount?: DecimalFilter<"CustomerOrderHeader"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"CustomerOrderHeader"> | string
    createdAt?: DateTimeFilter<"CustomerOrderHeader"> | Date | string
    tenant?: XOR<RetailStoreTenantRelationFilter, RetailStoreTenantWhereInput>
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    lineItems?: OrderLineItemDetailListRelationFilter
  }

  export type CustomerOrderHeaderOrderByWithRelationInput = {
    orderId?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrderInput | SortOrder
    orderNumber?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    tenant?: RetailStoreTenantOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    lineItems?: OrderLineItemDetailOrderByRelationAggregateInput
  }

  export type CustomerOrderHeaderWhereUniqueInput = Prisma.AtLeast<{
    orderId?: string
    AND?: CustomerOrderHeaderWhereInput | CustomerOrderHeaderWhereInput[]
    OR?: CustomerOrderHeaderWhereInput[]
    NOT?: CustomerOrderHeaderWhereInput | CustomerOrderHeaderWhereInput[]
    tenantId?: StringFilter<"CustomerOrderHeader"> | string
    customerId?: StringNullableFilter<"CustomerOrderHeader"> | string | null
    orderNumber?: StringNullableFilter<"CustomerOrderHeader"> | string | null
    totalAmount?: DecimalFilter<"CustomerOrderHeader"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"CustomerOrderHeader"> | string
    createdAt?: DateTimeFilter<"CustomerOrderHeader"> | Date | string
    tenant?: XOR<RetailStoreTenantRelationFilter, RetailStoreTenantWhereInput>
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    lineItems?: OrderLineItemDetailListRelationFilter
  }, "orderId">

  export type CustomerOrderHeaderOrderByWithAggregationInput = {
    orderId?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrderInput | SortOrder
    orderNumber?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: CustomerOrderHeaderCountOrderByAggregateInput
    _avg?: CustomerOrderHeaderAvgOrderByAggregateInput
    _max?: CustomerOrderHeaderMaxOrderByAggregateInput
    _min?: CustomerOrderHeaderMinOrderByAggregateInput
    _sum?: CustomerOrderHeaderSumOrderByAggregateInput
  }

  export type CustomerOrderHeaderScalarWhereWithAggregatesInput = {
    AND?: CustomerOrderHeaderScalarWhereWithAggregatesInput | CustomerOrderHeaderScalarWhereWithAggregatesInput[]
    OR?: CustomerOrderHeaderScalarWhereWithAggregatesInput[]
    NOT?: CustomerOrderHeaderScalarWhereWithAggregatesInput | CustomerOrderHeaderScalarWhereWithAggregatesInput[]
    orderId?: StringWithAggregatesFilter<"CustomerOrderHeader"> | string
    tenantId?: StringWithAggregatesFilter<"CustomerOrderHeader"> | string
    customerId?: StringNullableWithAggregatesFilter<"CustomerOrderHeader"> | string | null
    orderNumber?: StringNullableWithAggregatesFilter<"CustomerOrderHeader"> | string | null
    totalAmount?: DecimalWithAggregatesFilter<"CustomerOrderHeader"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"CustomerOrderHeader"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CustomerOrderHeader"> | Date | string
  }

  export type OrderLineItemDetailWhereInput = {
    AND?: OrderLineItemDetailWhereInput | OrderLineItemDetailWhereInput[]
    OR?: OrderLineItemDetailWhereInput[]
    NOT?: OrderLineItemDetailWhereInput | OrderLineItemDetailWhereInput[]
    lineItemId?: StringFilter<"OrderLineItemDetail"> | string
    orderId?: StringFilter<"OrderLineItemDetail"> | string
    inventoryId?: StringNullableFilter<"OrderLineItemDetail"> | string | null
    productName?: StringFilter<"OrderLineItemDetail"> | string
    quantity?: IntFilter<"OrderLineItemDetail"> | number
    unitPrice?: DecimalFilter<"OrderLineItemDetail"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"OrderLineItemDetail"> | Decimal | DecimalJsLike | number | string
    order?: XOR<CustomerOrderHeaderRelationFilter, CustomerOrderHeaderWhereInput>
    inventory?: XOR<RetailStoreInventoryItemNullableRelationFilter, RetailStoreInventoryItemWhereInput> | null
  }

  export type OrderLineItemDetailOrderByWithRelationInput = {
    lineItemId?: SortOrder
    orderId?: SortOrder
    inventoryId?: SortOrderInput | SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalAmount?: SortOrder
    order?: CustomerOrderHeaderOrderByWithRelationInput
    inventory?: RetailStoreInventoryItemOrderByWithRelationInput
  }

  export type OrderLineItemDetailWhereUniqueInput = Prisma.AtLeast<{
    lineItemId?: string
    AND?: OrderLineItemDetailWhereInput | OrderLineItemDetailWhereInput[]
    OR?: OrderLineItemDetailWhereInput[]
    NOT?: OrderLineItemDetailWhereInput | OrderLineItemDetailWhereInput[]
    orderId?: StringFilter<"OrderLineItemDetail"> | string
    inventoryId?: StringNullableFilter<"OrderLineItemDetail"> | string | null
    productName?: StringFilter<"OrderLineItemDetail"> | string
    quantity?: IntFilter<"OrderLineItemDetail"> | number
    unitPrice?: DecimalFilter<"OrderLineItemDetail"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"OrderLineItemDetail"> | Decimal | DecimalJsLike | number | string
    order?: XOR<CustomerOrderHeaderRelationFilter, CustomerOrderHeaderWhereInput>
    inventory?: XOR<RetailStoreInventoryItemNullableRelationFilter, RetailStoreInventoryItemWhereInput> | null
  }, "lineItemId">

  export type OrderLineItemDetailOrderByWithAggregationInput = {
    lineItemId?: SortOrder
    orderId?: SortOrder
    inventoryId?: SortOrderInput | SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalAmount?: SortOrder
    _count?: OrderLineItemDetailCountOrderByAggregateInput
    _avg?: OrderLineItemDetailAvgOrderByAggregateInput
    _max?: OrderLineItemDetailMaxOrderByAggregateInput
    _min?: OrderLineItemDetailMinOrderByAggregateInput
    _sum?: OrderLineItemDetailSumOrderByAggregateInput
  }

  export type OrderLineItemDetailScalarWhereWithAggregatesInput = {
    AND?: OrderLineItemDetailScalarWhereWithAggregatesInput | OrderLineItemDetailScalarWhereWithAggregatesInput[]
    OR?: OrderLineItemDetailScalarWhereWithAggregatesInput[]
    NOT?: OrderLineItemDetailScalarWhereWithAggregatesInput | OrderLineItemDetailScalarWhereWithAggregatesInput[]
    lineItemId?: StringWithAggregatesFilter<"OrderLineItemDetail"> | string
    orderId?: StringWithAggregatesFilter<"OrderLineItemDetail"> | string
    inventoryId?: StringNullableWithAggregatesFilter<"OrderLineItemDetail"> | string | null
    productName?: StringWithAggregatesFilter<"OrderLineItemDetail"> | string
    quantity?: IntWithAggregatesFilter<"OrderLineItemDetail"> | number
    unitPrice?: DecimalWithAggregatesFilter<"OrderLineItemDetail"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalWithAggregatesFilter<"OrderLineItemDetail"> | Decimal | DecimalJsLike | number | string
  }

  export type RetailStoreCustomerWhereInput = {
    AND?: RetailStoreCustomerWhereInput | RetailStoreCustomerWhereInput[]
    OR?: RetailStoreCustomerWhereInput[]
    NOT?: RetailStoreCustomerWhereInput | RetailStoreCustomerWhereInput[]
    customerId?: StringFilter<"RetailStoreCustomer"> | string
    userId?: StringNullableFilter<"RetailStoreCustomer"> | string | null
    walletBalance?: DecimalNullableFilter<"RetailStoreCustomer"> | Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: IntNullableFilter<"RetailStoreCustomer"> | number | null
    createdAt?: DateTimeFilter<"RetailStoreCustomer"> | Date | string
  }

  export type RetailStoreCustomerOrderByWithRelationInput = {
    customerId?: SortOrder
    userId?: SortOrderInput | SortOrder
    walletBalance?: SortOrderInput | SortOrder
    loyaltyPoints?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type RetailStoreCustomerWhereUniqueInput = Prisma.AtLeast<{
    customerId?: string
    userId?: string
    AND?: RetailStoreCustomerWhereInput | RetailStoreCustomerWhereInput[]
    OR?: RetailStoreCustomerWhereInput[]
    NOT?: RetailStoreCustomerWhereInput | RetailStoreCustomerWhereInput[]
    walletBalance?: DecimalNullableFilter<"RetailStoreCustomer"> | Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: IntNullableFilter<"RetailStoreCustomer"> | number | null
    createdAt?: DateTimeFilter<"RetailStoreCustomer"> | Date | string
  }, "customerId" | "userId">

  export type RetailStoreCustomerOrderByWithAggregationInput = {
    customerId?: SortOrder
    userId?: SortOrderInput | SortOrder
    walletBalance?: SortOrderInput | SortOrder
    loyaltyPoints?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RetailStoreCustomerCountOrderByAggregateInput
    _avg?: RetailStoreCustomerAvgOrderByAggregateInput
    _max?: RetailStoreCustomerMaxOrderByAggregateInput
    _min?: RetailStoreCustomerMinOrderByAggregateInput
    _sum?: RetailStoreCustomerSumOrderByAggregateInput
  }

  export type RetailStoreCustomerScalarWhereWithAggregatesInput = {
    AND?: RetailStoreCustomerScalarWhereWithAggregatesInput | RetailStoreCustomerScalarWhereWithAggregatesInput[]
    OR?: RetailStoreCustomerScalarWhereWithAggregatesInput[]
    NOT?: RetailStoreCustomerScalarWhereWithAggregatesInput | RetailStoreCustomerScalarWhereWithAggregatesInput[]
    customerId?: StringWithAggregatesFilter<"RetailStoreCustomer"> | string
    userId?: StringNullableWithAggregatesFilter<"RetailStoreCustomer"> | string | null
    walletBalance?: DecimalNullableWithAggregatesFilter<"RetailStoreCustomer"> | Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: IntNullableWithAggregatesFilter<"RetailStoreCustomer"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"RetailStoreCustomer"> | Date | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    tenantId?: StringNullableFilter<"Customer"> | string | null
    fullName?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    isActive?: BoolFilter<"Customer"> | boolean
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    tenant?: XOR<RetailStoreTenantNullableRelationFilter, RetailStoreTenantWhereInput> | null
    orders?: CustomerOrderHeaderListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: RetailStoreTenantOrderByWithRelationInput
    orders?: CustomerOrderHeaderOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    tenantId?: StringNullableFilter<"Customer"> | string | null
    fullName?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    isActive?: BoolFilter<"Customer"> | boolean
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    tenant?: XOR<RetailStoreTenantNullableRelationFilter, RetailStoreTenantWhereInput> | null
    orders?: CustomerOrderHeaderListRelationFilter
  }, "id">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    tenantId?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    fullName?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    isActive?: BoolWithAggregatesFilter<"Customer"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type VendorInvoicesWhereInput = {
    AND?: VendorInvoicesWhereInput | VendorInvoicesWhereInput[]
    OR?: VendorInvoicesWhereInput[]
    NOT?: VendorInvoicesWhereInput | VendorInvoicesWhereInput[]
    invoiceId?: StringFilter<"VendorInvoices"> | string
    tenantId?: StringFilter<"VendorInvoices"> | string
    vendorName?: StringFilter<"VendorInvoices"> | string
    invoiceDate?: DateTimeNullableFilter<"VendorInvoices"> | Date | string | null
    totalAmount?: DecimalNullableFilter<"VendorInvoices"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"VendorInvoices"> | string
    lineItems?: JsonNullableFilter<"VendorInvoices">
    tenant?: XOR<RetailStoreTenantRelationFilter, RetailStoreTenantWhereInput>
  }

  export type VendorInvoicesOrderByWithRelationInput = {
    invoiceId?: SortOrder
    tenantId?: SortOrder
    vendorName?: SortOrder
    invoiceDate?: SortOrderInput | SortOrder
    totalAmount?: SortOrderInput | SortOrder
    status?: SortOrder
    lineItems?: SortOrderInput | SortOrder
    tenant?: RetailStoreTenantOrderByWithRelationInput
  }

  export type VendorInvoicesWhereUniqueInput = Prisma.AtLeast<{
    invoiceId?: string
    AND?: VendorInvoicesWhereInput | VendorInvoicesWhereInput[]
    OR?: VendorInvoicesWhereInput[]
    NOT?: VendorInvoicesWhereInput | VendorInvoicesWhereInput[]
    tenantId?: StringFilter<"VendorInvoices"> | string
    vendorName?: StringFilter<"VendorInvoices"> | string
    invoiceDate?: DateTimeNullableFilter<"VendorInvoices"> | Date | string | null
    totalAmount?: DecimalNullableFilter<"VendorInvoices"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"VendorInvoices"> | string
    lineItems?: JsonNullableFilter<"VendorInvoices">
    tenant?: XOR<RetailStoreTenantRelationFilter, RetailStoreTenantWhereInput>
  }, "invoiceId">

  export type VendorInvoicesOrderByWithAggregationInput = {
    invoiceId?: SortOrder
    tenantId?: SortOrder
    vendorName?: SortOrder
    invoiceDate?: SortOrderInput | SortOrder
    totalAmount?: SortOrderInput | SortOrder
    status?: SortOrder
    lineItems?: SortOrderInput | SortOrder
    _count?: VendorInvoicesCountOrderByAggregateInput
    _avg?: VendorInvoicesAvgOrderByAggregateInput
    _max?: VendorInvoicesMaxOrderByAggregateInput
    _min?: VendorInvoicesMinOrderByAggregateInput
    _sum?: VendorInvoicesSumOrderByAggregateInput
  }

  export type VendorInvoicesScalarWhereWithAggregatesInput = {
    AND?: VendorInvoicesScalarWhereWithAggregatesInput | VendorInvoicesScalarWhereWithAggregatesInput[]
    OR?: VendorInvoicesScalarWhereWithAggregatesInput[]
    NOT?: VendorInvoicesScalarWhereWithAggregatesInput | VendorInvoicesScalarWhereWithAggregatesInput[]
    invoiceId?: StringWithAggregatesFilter<"VendorInvoices"> | string
    tenantId?: StringWithAggregatesFilter<"VendorInvoices"> | string
    vendorName?: StringWithAggregatesFilter<"VendorInvoices"> | string
    invoiceDate?: DateTimeNullableWithAggregatesFilter<"VendorInvoices"> | Date | string | null
    totalAmount?: DecimalNullableWithAggregatesFilter<"VendorInvoices"> | Decimal | DecimalJsLike | number | string | null
    status?: StringWithAggregatesFilter<"VendorInvoices"> | string
    lineItems?: JsonNullableWithAggregatesFilter<"VendorInvoices">
  }

  export type SuperAdminUserWhereInput = {
    AND?: SuperAdminUserWhereInput | SuperAdminUserWhereInput[]
    OR?: SuperAdminUserWhereInput[]
    NOT?: SuperAdminUserWhereInput | SuperAdminUserWhereInput[]
    id?: StringFilter<"SuperAdminUser"> | string
    userId?: StringFilter<"SuperAdminUser"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SuperAdminUserOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SuperAdminUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: SuperAdminUserWhereInput | SuperAdminUserWhereInput[]
    OR?: SuperAdminUserWhereInput[]
    NOT?: SuperAdminUserWhereInput | SuperAdminUserWhereInput[]
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type SuperAdminUserOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    _count?: SuperAdminUserCountOrderByAggregateInput
    _max?: SuperAdminUserMaxOrderByAggregateInput
    _min?: SuperAdminUserMinOrderByAggregateInput
  }

  export type SuperAdminUserScalarWhereWithAggregatesInput = {
    AND?: SuperAdminUserScalarWhereWithAggregatesInput | SuperAdminUserScalarWhereWithAggregatesInput[]
    OR?: SuperAdminUserScalarWhereWithAggregatesInput[]
    NOT?: SuperAdminUserScalarWhereWithAggregatesInput | SuperAdminUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SuperAdminUser"> | string
    userId?: StringWithAggregatesFilter<"SuperAdminUser"> | string
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
    RetailStoreTenants?: RetailStoreTenantCreateNestedManyWithoutOwnerInput
    SuperAdminProfile?: SuperAdminUserCreateNestedOneWithoutUserInput
    tenant?: RetailStoreTenantCreateNestedOneWithoutUsersInput
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
    tenantId?: string | null
    RetailStoreTenants?: RetailStoreTenantUncheckedCreateNestedManyWithoutOwnerInput
    SuperAdminProfile?: SuperAdminUserUncheckedCreateNestedOneWithoutUserInput
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
    RetailStoreTenants?: RetailStoreTenantUpdateManyWithoutOwnerNestedInput
    SuperAdminProfile?: SuperAdminUserUpdateOneWithoutUserNestedInput
    tenant?: RetailStoreTenantUpdateOneWithoutUsersNestedInput
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
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    RetailStoreTenants?: RetailStoreTenantUncheckedUpdateManyWithoutOwnerNestedInput
    SuperAdminProfile?: SuperAdminUserUncheckedUpdateOneWithoutUserNestedInput
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
    tenantId?: string | null
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
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RetailStoreTenantCreateInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    owner?: UserCreateNestedOneWithoutRetailStoreTenantsInput
    InventoryItems?: RetailStoreInventoryItemCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesCreateNestedManyWithoutTenantInput
    Customers?: CustomerCreateNestedManyWithoutTenantInput
    Users?: UserCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantUncheckedCreateInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    ownerUserId?: string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderUncheckedCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesUncheckedCreateNestedManyWithoutTenantInput
    Customers?: CustomerUncheckedCreateNestedManyWithoutTenantInput
    Users?: UserUncheckedCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantUpdateInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneWithoutRetailStoreTenantsNestedInput
    InventoryItems?: RetailStoreInventoryItemUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUpdateManyWithoutTenantNestedInput
    Users?: UserUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantUncheckedUpdateInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUncheckedUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUncheckedUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUncheckedUpdateManyWithoutTenantNestedInput
    Users?: UserUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantCreateManyInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    ownerUserId?: string | null
  }

  export type RetailStoreTenantUpdateManyMutationInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RetailStoreTenantUncheckedUpdateManyInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GlobalProductMasterCatalogCreateInput = {
    productId?: string
    productName: string
    sku?: string | null
    category?: string | null
    description?: string | null
    imageUrl?: string | null
    isActive?: boolean
    InventoryItems?: RetailStoreInventoryItemCreateNestedManyWithoutGlobalProductInput
  }

  export type GlobalProductMasterCatalogUncheckedCreateInput = {
    productId?: string
    productName: string
    sku?: string | null
    category?: string | null
    description?: string | null
    imageUrl?: string | null
    isActive?: boolean
    InventoryItems?: RetailStoreInventoryItemUncheckedCreateNestedManyWithoutGlobalProductInput
  }

  export type GlobalProductMasterCatalogUpdateInput = {
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    InventoryItems?: RetailStoreInventoryItemUpdateManyWithoutGlobalProductNestedInput
  }

  export type GlobalProductMasterCatalogUncheckedUpdateInput = {
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    InventoryItems?: RetailStoreInventoryItemUncheckedUpdateManyWithoutGlobalProductNestedInput
  }

  export type GlobalProductMasterCatalogCreateManyInput = {
    productId?: string
    productName: string
    sku?: string | null
    category?: string | null
    description?: string | null
    imageUrl?: string | null
    isActive?: boolean
  }

  export type GlobalProductMasterCatalogUpdateManyMutationInput = {
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GlobalProductMasterCatalogUncheckedUpdateManyInput = {
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RetailStoreInventoryItemCreateInput = {
    inventoryId?: string
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    tenant: RetailStoreTenantCreateNestedOneWithoutInventoryItemsInput
    globalProduct?: GlobalProductMasterCatalogCreateNestedOneWithoutInventoryItemsInput
    lineItems?: OrderLineItemDetailCreateNestedManyWithoutInventoryInput
  }

  export type RetailStoreInventoryItemUncheckedCreateInput = {
    inventoryId?: string
    tenantId: string
    globalProductId?: string | null
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    lineItems?: OrderLineItemDetailUncheckedCreateNestedManyWithoutInventoryInput
  }

  export type RetailStoreInventoryItemUpdateInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tenant?: RetailStoreTenantUpdateOneRequiredWithoutInventoryItemsNestedInput
    globalProduct?: GlobalProductMasterCatalogUpdateOneWithoutInventoryItemsNestedInput
    lineItems?: OrderLineItemDetailUpdateManyWithoutInventoryNestedInput
  }

  export type RetailStoreInventoryItemUncheckedUpdateInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    globalProductId?: NullableStringFieldUpdateOperationsInput | string | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lineItems?: OrderLineItemDetailUncheckedUpdateManyWithoutInventoryNestedInput
  }

  export type RetailStoreInventoryItemCreateManyInput = {
    inventoryId?: string
    tenantId: string
    globalProductId?: string | null
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
  }

  export type RetailStoreInventoryItemUpdateManyMutationInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RetailStoreInventoryItemUncheckedUpdateManyInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    globalProductId?: NullableStringFieldUpdateOperationsInput | string | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CustomerOrderHeaderCreateInput = {
    orderId?: string
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    tenant: RetailStoreTenantCreateNestedOneWithoutOrdersInput
    customer?: CustomerCreateNestedOneWithoutOrdersInput
    lineItems?: OrderLineItemDetailCreateNestedManyWithoutOrderInput
  }

  export type CustomerOrderHeaderUncheckedCreateInput = {
    orderId?: string
    tenantId: string
    customerId?: string | null
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    lineItems?: OrderLineItemDetailUncheckedCreateNestedManyWithoutOrderInput
  }

  export type CustomerOrderHeaderUpdateInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: RetailStoreTenantUpdateOneRequiredWithoutOrdersNestedInput
    customer?: CustomerUpdateOneWithoutOrdersNestedInput
    lineItems?: OrderLineItemDetailUpdateManyWithoutOrderNestedInput
  }

  export type CustomerOrderHeaderUncheckedUpdateInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lineItems?: OrderLineItemDetailUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type CustomerOrderHeaderCreateManyInput = {
    orderId?: string
    tenantId: string
    customerId?: string | null
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
  }

  export type CustomerOrderHeaderUpdateManyMutationInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerOrderHeaderUncheckedUpdateManyInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderLineItemDetailCreateInput = {
    lineItemId?: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    order: CustomerOrderHeaderCreateNestedOneWithoutLineItemsInput
    inventory?: RetailStoreInventoryItemCreateNestedOneWithoutLineItemsInput
  }

  export type OrderLineItemDetailUncheckedCreateInput = {
    lineItemId?: string
    orderId: string
    inventoryId?: string | null
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailUpdateInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    order?: CustomerOrderHeaderUpdateOneRequiredWithoutLineItemsNestedInput
    inventory?: RetailStoreInventoryItemUpdateOneWithoutLineItemsNestedInput
  }

  export type OrderLineItemDetailUncheckedUpdateInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    inventoryId?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailCreateManyInput = {
    lineItemId?: string
    orderId: string
    inventoryId?: string | null
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailUpdateManyMutationInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailUncheckedUpdateManyInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    inventoryId?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type RetailStoreCustomerCreateInput = {
    customerId?: string
    userId?: string | null
    walletBalance?: Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: number | null
    createdAt?: Date | string
  }

  export type RetailStoreCustomerUncheckedCreateInput = {
    customerId?: string
    userId?: string | null
    walletBalance?: Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: number | null
    createdAt?: Date | string
  }

  export type RetailStoreCustomerUpdateInput = {
    customerId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    walletBalance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetailStoreCustomerUncheckedUpdateInput = {
    customerId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    walletBalance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetailStoreCustomerCreateManyInput = {
    customerId?: string
    userId?: string | null
    walletBalance?: Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: number | null
    createdAt?: Date | string
  }

  export type RetailStoreCustomerUpdateManyMutationInput = {
    customerId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    walletBalance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetailStoreCustomerUncheckedUpdateManyInput = {
    customerId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    walletBalance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    loyaltyPoints?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerCreateInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant?: RetailStoreTenantCreateNestedOneWithoutCustomersInput
    orders?: CustomerOrderHeaderCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    tenantId?: string | null
    fullName?: string | null
    email?: string | null
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: CustomerOrderHeaderUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: RetailStoreTenantUpdateOneWithoutCustomersNestedInput
    orders?: CustomerOrderHeaderUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: CustomerOrderHeaderUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    tenantId?: string | null
    fullName?: string | null
    email?: string | null
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorInvoicesCreateInput = {
    invoiceId?: string
    vendorName: string
    invoiceDate?: Date | string | null
    totalAmount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
    tenant: RetailStoreTenantCreateNestedOneWithoutVendorInvoicesInput
  }

  export type VendorInvoicesUncheckedCreateInput = {
    invoiceId?: string
    tenantId: string
    vendorName: string
    invoiceDate?: Date | string | null
    totalAmount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VendorInvoicesUpdateInput = {
    invoiceId?: StringFieldUpdateOperationsInput | string
    vendorName?: StringFieldUpdateOperationsInput | string
    invoiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
    tenant?: RetailStoreTenantUpdateOneRequiredWithoutVendorInvoicesNestedInput
  }

  export type VendorInvoicesUncheckedUpdateInput = {
    invoiceId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    vendorName?: StringFieldUpdateOperationsInput | string
    invoiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VendorInvoicesCreateManyInput = {
    invoiceId?: string
    tenantId: string
    vendorName: string
    invoiceDate?: Date | string | null
    totalAmount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VendorInvoicesUpdateManyMutationInput = {
    invoiceId?: StringFieldUpdateOperationsInput | string
    vendorName?: StringFieldUpdateOperationsInput | string
    invoiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VendorInvoicesUncheckedUpdateManyInput = {
    invoiceId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    vendorName?: StringFieldUpdateOperationsInput | string
    invoiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SuperAdminUserCreateInput = {
    id?: string
    user: UserCreateNestedOneWithoutSuperAdminProfileInput
  }

  export type SuperAdminUserUncheckedCreateInput = {
    id?: string
    userId: string
  }

  export type SuperAdminUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutSuperAdminProfileNestedInput
  }

  export type SuperAdminUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SuperAdminUserCreateManyInput = {
    id?: string
    userId: string
  }

  export type SuperAdminUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type SuperAdminUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
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

  export type RetailStoreTenantListRelationFilter = {
    every?: RetailStoreTenantWhereInput
    some?: RetailStoreTenantWhereInput
    none?: RetailStoreTenantWhereInput
  }

  export type SuperAdminUserNullableRelationFilter = {
    is?: SuperAdminUserWhereInput | null
    isNot?: SuperAdminUserWhereInput | null
  }

  export type RetailStoreTenantNullableRelationFilter = {
    is?: RetailStoreTenantWhereInput | null
    isNot?: RetailStoreTenantWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RetailStoreTenantOrderByRelationAggregateInput = {
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
    tenantId?: SortOrder
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
    tenantId?: SortOrder
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
    tenantId?: SortOrder
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

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type RetailStoreInventoryItemListRelationFilter = {
    every?: RetailStoreInventoryItemWhereInput
    some?: RetailStoreInventoryItemWhereInput
    none?: RetailStoreInventoryItemWhereInput
  }

  export type CustomerOrderHeaderListRelationFilter = {
    every?: CustomerOrderHeaderWhereInput
    some?: CustomerOrderHeaderWhereInput
    none?: CustomerOrderHeaderWhereInput
  }

  export type VendorInvoicesListRelationFilter = {
    every?: VendorInvoicesWhereInput
    some?: VendorInvoicesWhereInput
    none?: VendorInvoicesWhereInput
  }

  export type CustomerListRelationFilter = {
    every?: CustomerWhereInput
    some?: CustomerWhereInput
    none?: CustomerWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type RetailStoreInventoryItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerOrderHeaderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VendorInvoicesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RetailStoreTenantCountOrderByAggregateInput = {
    tenantId?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrder
    isActive?: SortOrder
    ownerUserId?: SortOrder
  }

  export type RetailStoreTenantMaxOrderByAggregateInput = {
    tenantId?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrder
    isActive?: SortOrder
    ownerUserId?: SortOrder
  }

  export type RetailStoreTenantMinOrderByAggregateInput = {
    tenantId?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrder
    isActive?: SortOrder
    ownerUserId?: SortOrder
  }

  export type GlobalProductMasterCatalogCountOrderByAggregateInput = {
    productId?: SortOrder
    productName?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
  }

  export type GlobalProductMasterCatalogMaxOrderByAggregateInput = {
    productId?: SortOrder
    productName?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
  }

  export type GlobalProductMasterCatalogMinOrderByAggregateInput = {
    productId?: SortOrder
    productName?: SortOrder
    sku?: SortOrder
    category?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    isActive?: SortOrder
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

  export type RetailStoreTenantRelationFilter = {
    is?: RetailStoreTenantWhereInput
    isNot?: RetailStoreTenantWhereInput
  }

  export type GlobalProductMasterCatalogNullableRelationFilter = {
    is?: GlobalProductMasterCatalogWhereInput | null
    isNot?: GlobalProductMasterCatalogWhereInput | null
  }

  export type OrderLineItemDetailListRelationFilter = {
    every?: OrderLineItemDetailWhereInput
    some?: OrderLineItemDetailWhereInput
    none?: OrderLineItemDetailWhereInput
  }

  export type OrderLineItemDetailOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RetailStoreInventoryItemCountOrderByAggregateInput = {
    inventoryId?: SortOrder
    tenantId?: SortOrder
    globalProductId?: SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    sellingPrice?: SortOrder
    costPrice?: SortOrder
    isActive?: SortOrder
  }

  export type RetailStoreInventoryItemAvgOrderByAggregateInput = {
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    sellingPrice?: SortOrder
    costPrice?: SortOrder
  }

  export type RetailStoreInventoryItemMaxOrderByAggregateInput = {
    inventoryId?: SortOrder
    tenantId?: SortOrder
    globalProductId?: SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    sellingPrice?: SortOrder
    costPrice?: SortOrder
    isActive?: SortOrder
  }

  export type RetailStoreInventoryItemMinOrderByAggregateInput = {
    inventoryId?: SortOrder
    tenantId?: SortOrder
    globalProductId?: SortOrder
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    sellingPrice?: SortOrder
    costPrice?: SortOrder
    isActive?: SortOrder
  }

  export type RetailStoreInventoryItemSumOrderByAggregateInput = {
    currentStock?: SortOrder
    reorderLevel?: SortOrder
    sellingPrice?: SortOrder
    costPrice?: SortOrder
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

  export type CustomerNullableRelationFilter = {
    is?: CustomerWhereInput | null
    isNot?: CustomerWhereInput | null
  }

  export type CustomerOrderHeaderCountOrderByAggregateInput = {
    orderId?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrder
    orderNumber?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerOrderHeaderAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type CustomerOrderHeaderMaxOrderByAggregateInput = {
    orderId?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrder
    orderNumber?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerOrderHeaderMinOrderByAggregateInput = {
    orderId?: SortOrder
    tenantId?: SortOrder
    customerId?: SortOrder
    orderNumber?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerOrderHeaderSumOrderByAggregateInput = {
    totalAmount?: SortOrder
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

  export type CustomerOrderHeaderRelationFilter = {
    is?: CustomerOrderHeaderWhereInput
    isNot?: CustomerOrderHeaderWhereInput
  }

  export type RetailStoreInventoryItemNullableRelationFilter = {
    is?: RetailStoreInventoryItemWhereInput | null
    isNot?: RetailStoreInventoryItemWhereInput | null
  }

  export type OrderLineItemDetailCountOrderByAggregateInput = {
    lineItemId?: SortOrder
    orderId?: SortOrder
    inventoryId?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalAmount?: SortOrder
  }

  export type OrderLineItemDetailAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalAmount?: SortOrder
  }

  export type OrderLineItemDetailMaxOrderByAggregateInput = {
    lineItemId?: SortOrder
    orderId?: SortOrder
    inventoryId?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalAmount?: SortOrder
  }

  export type OrderLineItemDetailMinOrderByAggregateInput = {
    lineItemId?: SortOrder
    orderId?: SortOrder
    inventoryId?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalAmount?: SortOrder
  }

  export type OrderLineItemDetailSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    totalAmount?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type RetailStoreCustomerCountOrderByAggregateInput = {
    customerId?: SortOrder
    userId?: SortOrder
    walletBalance?: SortOrder
    loyaltyPoints?: SortOrder
    createdAt?: SortOrder
  }

  export type RetailStoreCustomerAvgOrderByAggregateInput = {
    walletBalance?: SortOrder
    loyaltyPoints?: SortOrder
  }

  export type RetailStoreCustomerMaxOrderByAggregateInput = {
    customerId?: SortOrder
    userId?: SortOrder
    walletBalance?: SortOrder
    loyaltyPoints?: SortOrder
    createdAt?: SortOrder
  }

  export type RetailStoreCustomerMinOrderByAggregateInput = {
    customerId?: SortOrder
    userId?: SortOrder
    walletBalance?: SortOrder
    loyaltyPoints?: SortOrder
    createdAt?: SortOrder
  }

  export type RetailStoreCustomerSumOrderByAggregateInput = {
    walletBalance?: SortOrder
    loyaltyPoints?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type VendorInvoicesCountOrderByAggregateInput = {
    invoiceId?: SortOrder
    tenantId?: SortOrder
    vendorName?: SortOrder
    invoiceDate?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
    lineItems?: SortOrder
  }

  export type VendorInvoicesAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type VendorInvoicesMaxOrderByAggregateInput = {
    invoiceId?: SortOrder
    tenantId?: SortOrder
    vendorName?: SortOrder
    invoiceDate?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
  }

  export type VendorInvoicesMinOrderByAggregateInput = {
    invoiceId?: SortOrder
    tenantId?: SortOrder
    vendorName?: SortOrder
    invoiceDate?: SortOrder
    totalAmount?: SortOrder
    status?: SortOrder
  }

  export type VendorInvoicesSumOrderByAggregateInput = {
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
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SuperAdminUserCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type SuperAdminUserMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type SuperAdminUserMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type RetailStoreTenantCreateNestedManyWithoutOwnerInput = {
    create?: XOR<RetailStoreTenantCreateWithoutOwnerInput, RetailStoreTenantUncheckedCreateWithoutOwnerInput> | RetailStoreTenantCreateWithoutOwnerInput[] | RetailStoreTenantUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutOwnerInput | RetailStoreTenantCreateOrConnectWithoutOwnerInput[]
    createMany?: RetailStoreTenantCreateManyOwnerInputEnvelope
    connect?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
  }

  export type SuperAdminUserCreateNestedOneWithoutUserInput = {
    create?: XOR<SuperAdminUserCreateWithoutUserInput, SuperAdminUserUncheckedCreateWithoutUserInput>
    connectOrCreate?: SuperAdminUserCreateOrConnectWithoutUserInput
    connect?: SuperAdminUserWhereUniqueInput
  }

  export type RetailStoreTenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<RetailStoreTenantCreateWithoutUsersInput, RetailStoreTenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutUsersInput
    connect?: RetailStoreTenantWhereUniqueInput
  }

  export type RetailStoreTenantUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<RetailStoreTenantCreateWithoutOwnerInput, RetailStoreTenantUncheckedCreateWithoutOwnerInput> | RetailStoreTenantCreateWithoutOwnerInput[] | RetailStoreTenantUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutOwnerInput | RetailStoreTenantCreateOrConnectWithoutOwnerInput[]
    createMany?: RetailStoreTenantCreateManyOwnerInputEnvelope
    connect?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
  }

  export type SuperAdminUserUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SuperAdminUserCreateWithoutUserInput, SuperAdminUserUncheckedCreateWithoutUserInput>
    connectOrCreate?: SuperAdminUserCreateOrConnectWithoutUserInput
    connect?: SuperAdminUserWhereUniqueInput
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

  export type RetailStoreTenantUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<RetailStoreTenantCreateWithoutOwnerInput, RetailStoreTenantUncheckedCreateWithoutOwnerInput> | RetailStoreTenantCreateWithoutOwnerInput[] | RetailStoreTenantUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutOwnerInput | RetailStoreTenantCreateOrConnectWithoutOwnerInput[]
    upsert?: RetailStoreTenantUpsertWithWhereUniqueWithoutOwnerInput | RetailStoreTenantUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: RetailStoreTenantCreateManyOwnerInputEnvelope
    set?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
    disconnect?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
    delete?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
    connect?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
    update?: RetailStoreTenantUpdateWithWhereUniqueWithoutOwnerInput | RetailStoreTenantUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: RetailStoreTenantUpdateManyWithWhereWithoutOwnerInput | RetailStoreTenantUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: RetailStoreTenantScalarWhereInput | RetailStoreTenantScalarWhereInput[]
  }

  export type SuperAdminUserUpdateOneWithoutUserNestedInput = {
    create?: XOR<SuperAdminUserCreateWithoutUserInput, SuperAdminUserUncheckedCreateWithoutUserInput>
    connectOrCreate?: SuperAdminUserCreateOrConnectWithoutUserInput
    upsert?: SuperAdminUserUpsertWithoutUserInput
    disconnect?: SuperAdminUserWhereInput | boolean
    delete?: SuperAdminUserWhereInput | boolean
    connect?: SuperAdminUserWhereUniqueInput
    update?: XOR<XOR<SuperAdminUserUpdateToOneWithWhereWithoutUserInput, SuperAdminUserUpdateWithoutUserInput>, SuperAdminUserUncheckedUpdateWithoutUserInput>
  }

  export type RetailStoreTenantUpdateOneWithoutUsersNestedInput = {
    create?: XOR<RetailStoreTenantCreateWithoutUsersInput, RetailStoreTenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutUsersInput
    upsert?: RetailStoreTenantUpsertWithoutUsersInput
    disconnect?: RetailStoreTenantWhereInput | boolean
    delete?: RetailStoreTenantWhereInput | boolean
    connect?: RetailStoreTenantWhereUniqueInput
    update?: XOR<XOR<RetailStoreTenantUpdateToOneWithWhereWithoutUsersInput, RetailStoreTenantUpdateWithoutUsersInput>, RetailStoreTenantUncheckedUpdateWithoutUsersInput>
  }

  export type RetailStoreTenantUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<RetailStoreTenantCreateWithoutOwnerInput, RetailStoreTenantUncheckedCreateWithoutOwnerInput> | RetailStoreTenantCreateWithoutOwnerInput[] | RetailStoreTenantUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutOwnerInput | RetailStoreTenantCreateOrConnectWithoutOwnerInput[]
    upsert?: RetailStoreTenantUpsertWithWhereUniqueWithoutOwnerInput | RetailStoreTenantUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: RetailStoreTenantCreateManyOwnerInputEnvelope
    set?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
    disconnect?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
    delete?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
    connect?: RetailStoreTenantWhereUniqueInput | RetailStoreTenantWhereUniqueInput[]
    update?: RetailStoreTenantUpdateWithWhereUniqueWithoutOwnerInput | RetailStoreTenantUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: RetailStoreTenantUpdateManyWithWhereWithoutOwnerInput | RetailStoreTenantUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: RetailStoreTenantScalarWhereInput | RetailStoreTenantScalarWhereInput[]
  }

  export type SuperAdminUserUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SuperAdminUserCreateWithoutUserInput, SuperAdminUserUncheckedCreateWithoutUserInput>
    connectOrCreate?: SuperAdminUserCreateOrConnectWithoutUserInput
    upsert?: SuperAdminUserUpsertWithoutUserInput
    disconnect?: SuperAdminUserWhereInput | boolean
    delete?: SuperAdminUserWhereInput | boolean
    connect?: SuperAdminUserWhereUniqueInput
    update?: XOR<XOR<SuperAdminUserUpdateToOneWithWhereWithoutUserInput, SuperAdminUserUpdateWithoutUserInput>, SuperAdminUserUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutRetailStoreTenantsInput = {
    create?: XOR<UserCreateWithoutRetailStoreTenantsInput, UserUncheckedCreateWithoutRetailStoreTenantsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRetailStoreTenantsInput
    connect?: UserWhereUniqueInput
  }

  export type RetailStoreInventoryItemCreateNestedManyWithoutTenantInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutTenantInput, RetailStoreInventoryItemUncheckedCreateWithoutTenantInput> | RetailStoreInventoryItemCreateWithoutTenantInput[] | RetailStoreInventoryItemUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutTenantInput | RetailStoreInventoryItemCreateOrConnectWithoutTenantInput[]
    createMany?: RetailStoreInventoryItemCreateManyTenantInputEnvelope
    connect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
  }

  export type CustomerOrderHeaderCreateNestedManyWithoutTenantInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutTenantInput, CustomerOrderHeaderUncheckedCreateWithoutTenantInput> | CustomerOrderHeaderCreateWithoutTenantInput[] | CustomerOrderHeaderUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutTenantInput | CustomerOrderHeaderCreateOrConnectWithoutTenantInput[]
    createMany?: CustomerOrderHeaderCreateManyTenantInputEnvelope
    connect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
  }

  export type VendorInvoicesCreateNestedManyWithoutTenantInput = {
    create?: XOR<VendorInvoicesCreateWithoutTenantInput, VendorInvoicesUncheckedCreateWithoutTenantInput> | VendorInvoicesCreateWithoutTenantInput[] | VendorInvoicesUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VendorInvoicesCreateOrConnectWithoutTenantInput | VendorInvoicesCreateOrConnectWithoutTenantInput[]
    createMany?: VendorInvoicesCreateManyTenantInputEnvelope
    connect?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
  }

  export type CustomerCreateNestedManyWithoutTenantInput = {
    create?: XOR<CustomerCreateWithoutTenantInput, CustomerUncheckedCreateWithoutTenantInput> | CustomerCreateWithoutTenantInput[] | CustomerUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutTenantInput | CustomerCreateOrConnectWithoutTenantInput[]
    createMany?: CustomerCreateManyTenantInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type RetailStoreInventoryItemUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutTenantInput, RetailStoreInventoryItemUncheckedCreateWithoutTenantInput> | RetailStoreInventoryItemCreateWithoutTenantInput[] | RetailStoreInventoryItemUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutTenantInput | RetailStoreInventoryItemCreateOrConnectWithoutTenantInput[]
    createMany?: RetailStoreInventoryItemCreateManyTenantInputEnvelope
    connect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
  }

  export type CustomerOrderHeaderUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutTenantInput, CustomerOrderHeaderUncheckedCreateWithoutTenantInput> | CustomerOrderHeaderCreateWithoutTenantInput[] | CustomerOrderHeaderUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutTenantInput | CustomerOrderHeaderCreateOrConnectWithoutTenantInput[]
    createMany?: CustomerOrderHeaderCreateManyTenantInputEnvelope
    connect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
  }

  export type VendorInvoicesUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<VendorInvoicesCreateWithoutTenantInput, VendorInvoicesUncheckedCreateWithoutTenantInput> | VendorInvoicesCreateWithoutTenantInput[] | VendorInvoicesUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VendorInvoicesCreateOrConnectWithoutTenantInput | VendorInvoicesCreateOrConnectWithoutTenantInput[]
    createMany?: VendorInvoicesCreateManyTenantInputEnvelope
    connect?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
  }

  export type CustomerUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<CustomerCreateWithoutTenantInput, CustomerUncheckedCreateWithoutTenantInput> | CustomerCreateWithoutTenantInput[] | CustomerUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutTenantInput | CustomerCreateOrConnectWithoutTenantInput[]
    createMany?: CustomerCreateManyTenantInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateOneWithoutRetailStoreTenantsNestedInput = {
    create?: XOR<UserCreateWithoutRetailStoreTenantsInput, UserUncheckedCreateWithoutRetailStoreTenantsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRetailStoreTenantsInput
    upsert?: UserUpsertWithoutRetailStoreTenantsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRetailStoreTenantsInput, UserUpdateWithoutRetailStoreTenantsInput>, UserUncheckedUpdateWithoutRetailStoreTenantsInput>
  }

  export type RetailStoreInventoryItemUpdateManyWithoutTenantNestedInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutTenantInput, RetailStoreInventoryItemUncheckedCreateWithoutTenantInput> | RetailStoreInventoryItemCreateWithoutTenantInput[] | RetailStoreInventoryItemUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutTenantInput | RetailStoreInventoryItemCreateOrConnectWithoutTenantInput[]
    upsert?: RetailStoreInventoryItemUpsertWithWhereUniqueWithoutTenantInput | RetailStoreInventoryItemUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: RetailStoreInventoryItemCreateManyTenantInputEnvelope
    set?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    disconnect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    delete?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    connect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    update?: RetailStoreInventoryItemUpdateWithWhereUniqueWithoutTenantInput | RetailStoreInventoryItemUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: RetailStoreInventoryItemUpdateManyWithWhereWithoutTenantInput | RetailStoreInventoryItemUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: RetailStoreInventoryItemScalarWhereInput | RetailStoreInventoryItemScalarWhereInput[]
  }

  export type CustomerOrderHeaderUpdateManyWithoutTenantNestedInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutTenantInput, CustomerOrderHeaderUncheckedCreateWithoutTenantInput> | CustomerOrderHeaderCreateWithoutTenantInput[] | CustomerOrderHeaderUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutTenantInput | CustomerOrderHeaderCreateOrConnectWithoutTenantInput[]
    upsert?: CustomerOrderHeaderUpsertWithWhereUniqueWithoutTenantInput | CustomerOrderHeaderUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: CustomerOrderHeaderCreateManyTenantInputEnvelope
    set?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    disconnect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    delete?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    connect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    update?: CustomerOrderHeaderUpdateWithWhereUniqueWithoutTenantInput | CustomerOrderHeaderUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: CustomerOrderHeaderUpdateManyWithWhereWithoutTenantInput | CustomerOrderHeaderUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: CustomerOrderHeaderScalarWhereInput | CustomerOrderHeaderScalarWhereInput[]
  }

  export type VendorInvoicesUpdateManyWithoutTenantNestedInput = {
    create?: XOR<VendorInvoicesCreateWithoutTenantInput, VendorInvoicesUncheckedCreateWithoutTenantInput> | VendorInvoicesCreateWithoutTenantInput[] | VendorInvoicesUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VendorInvoicesCreateOrConnectWithoutTenantInput | VendorInvoicesCreateOrConnectWithoutTenantInput[]
    upsert?: VendorInvoicesUpsertWithWhereUniqueWithoutTenantInput | VendorInvoicesUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: VendorInvoicesCreateManyTenantInputEnvelope
    set?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
    disconnect?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
    delete?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
    connect?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
    update?: VendorInvoicesUpdateWithWhereUniqueWithoutTenantInput | VendorInvoicesUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: VendorInvoicesUpdateManyWithWhereWithoutTenantInput | VendorInvoicesUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: VendorInvoicesScalarWhereInput | VendorInvoicesScalarWhereInput[]
  }

  export type CustomerUpdateManyWithoutTenantNestedInput = {
    create?: XOR<CustomerCreateWithoutTenantInput, CustomerUncheckedCreateWithoutTenantInput> | CustomerCreateWithoutTenantInput[] | CustomerUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutTenantInput | CustomerCreateOrConnectWithoutTenantInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutTenantInput | CustomerUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: CustomerCreateManyTenantInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutTenantInput | CustomerUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutTenantInput | CustomerUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type UserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutTenantInput, RetailStoreInventoryItemUncheckedCreateWithoutTenantInput> | RetailStoreInventoryItemCreateWithoutTenantInput[] | RetailStoreInventoryItemUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutTenantInput | RetailStoreInventoryItemCreateOrConnectWithoutTenantInput[]
    upsert?: RetailStoreInventoryItemUpsertWithWhereUniqueWithoutTenantInput | RetailStoreInventoryItemUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: RetailStoreInventoryItemCreateManyTenantInputEnvelope
    set?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    disconnect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    delete?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    connect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    update?: RetailStoreInventoryItemUpdateWithWhereUniqueWithoutTenantInput | RetailStoreInventoryItemUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: RetailStoreInventoryItemUpdateManyWithWhereWithoutTenantInput | RetailStoreInventoryItemUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: RetailStoreInventoryItemScalarWhereInput | RetailStoreInventoryItemScalarWhereInput[]
  }

  export type CustomerOrderHeaderUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutTenantInput, CustomerOrderHeaderUncheckedCreateWithoutTenantInput> | CustomerOrderHeaderCreateWithoutTenantInput[] | CustomerOrderHeaderUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutTenantInput | CustomerOrderHeaderCreateOrConnectWithoutTenantInput[]
    upsert?: CustomerOrderHeaderUpsertWithWhereUniqueWithoutTenantInput | CustomerOrderHeaderUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: CustomerOrderHeaderCreateManyTenantInputEnvelope
    set?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    disconnect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    delete?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    connect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    update?: CustomerOrderHeaderUpdateWithWhereUniqueWithoutTenantInput | CustomerOrderHeaderUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: CustomerOrderHeaderUpdateManyWithWhereWithoutTenantInput | CustomerOrderHeaderUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: CustomerOrderHeaderScalarWhereInput | CustomerOrderHeaderScalarWhereInput[]
  }

  export type VendorInvoicesUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<VendorInvoicesCreateWithoutTenantInput, VendorInvoicesUncheckedCreateWithoutTenantInput> | VendorInvoicesCreateWithoutTenantInput[] | VendorInvoicesUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: VendorInvoicesCreateOrConnectWithoutTenantInput | VendorInvoicesCreateOrConnectWithoutTenantInput[]
    upsert?: VendorInvoicesUpsertWithWhereUniqueWithoutTenantInput | VendorInvoicesUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: VendorInvoicesCreateManyTenantInputEnvelope
    set?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
    disconnect?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
    delete?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
    connect?: VendorInvoicesWhereUniqueInput | VendorInvoicesWhereUniqueInput[]
    update?: VendorInvoicesUpdateWithWhereUniqueWithoutTenantInput | VendorInvoicesUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: VendorInvoicesUpdateManyWithWhereWithoutTenantInput | VendorInvoicesUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: VendorInvoicesScalarWhereInput | VendorInvoicesScalarWhereInput[]
  }

  export type CustomerUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<CustomerCreateWithoutTenantInput, CustomerUncheckedCreateWithoutTenantInput> | CustomerCreateWithoutTenantInput[] | CustomerUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutTenantInput | CustomerCreateOrConnectWithoutTenantInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutTenantInput | CustomerUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: CustomerCreateManyTenantInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutTenantInput | CustomerUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutTenantInput | CustomerUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RetailStoreInventoryItemCreateNestedManyWithoutGlobalProductInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutGlobalProductInput, RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput> | RetailStoreInventoryItemCreateWithoutGlobalProductInput[] | RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput[]
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput | RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput[]
    createMany?: RetailStoreInventoryItemCreateManyGlobalProductInputEnvelope
    connect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
  }

  export type RetailStoreInventoryItemUncheckedCreateNestedManyWithoutGlobalProductInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutGlobalProductInput, RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput> | RetailStoreInventoryItemCreateWithoutGlobalProductInput[] | RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput[]
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput | RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput[]
    createMany?: RetailStoreInventoryItemCreateManyGlobalProductInputEnvelope
    connect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
  }

  export type RetailStoreInventoryItemUpdateManyWithoutGlobalProductNestedInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutGlobalProductInput, RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput> | RetailStoreInventoryItemCreateWithoutGlobalProductInput[] | RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput[]
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput | RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput[]
    upsert?: RetailStoreInventoryItemUpsertWithWhereUniqueWithoutGlobalProductInput | RetailStoreInventoryItemUpsertWithWhereUniqueWithoutGlobalProductInput[]
    createMany?: RetailStoreInventoryItemCreateManyGlobalProductInputEnvelope
    set?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    disconnect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    delete?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    connect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    update?: RetailStoreInventoryItemUpdateWithWhereUniqueWithoutGlobalProductInput | RetailStoreInventoryItemUpdateWithWhereUniqueWithoutGlobalProductInput[]
    updateMany?: RetailStoreInventoryItemUpdateManyWithWhereWithoutGlobalProductInput | RetailStoreInventoryItemUpdateManyWithWhereWithoutGlobalProductInput[]
    deleteMany?: RetailStoreInventoryItemScalarWhereInput | RetailStoreInventoryItemScalarWhereInput[]
  }

  export type RetailStoreInventoryItemUncheckedUpdateManyWithoutGlobalProductNestedInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutGlobalProductInput, RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput> | RetailStoreInventoryItemCreateWithoutGlobalProductInput[] | RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput[]
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput | RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput[]
    upsert?: RetailStoreInventoryItemUpsertWithWhereUniqueWithoutGlobalProductInput | RetailStoreInventoryItemUpsertWithWhereUniqueWithoutGlobalProductInput[]
    createMany?: RetailStoreInventoryItemCreateManyGlobalProductInputEnvelope
    set?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    disconnect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    delete?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    connect?: RetailStoreInventoryItemWhereUniqueInput | RetailStoreInventoryItemWhereUniqueInput[]
    update?: RetailStoreInventoryItemUpdateWithWhereUniqueWithoutGlobalProductInput | RetailStoreInventoryItemUpdateWithWhereUniqueWithoutGlobalProductInput[]
    updateMany?: RetailStoreInventoryItemUpdateManyWithWhereWithoutGlobalProductInput | RetailStoreInventoryItemUpdateManyWithWhereWithoutGlobalProductInput[]
    deleteMany?: RetailStoreInventoryItemScalarWhereInput | RetailStoreInventoryItemScalarWhereInput[]
  }

  export type RetailStoreTenantCreateNestedOneWithoutInventoryItemsInput = {
    create?: XOR<RetailStoreTenantCreateWithoutInventoryItemsInput, RetailStoreTenantUncheckedCreateWithoutInventoryItemsInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutInventoryItemsInput
    connect?: RetailStoreTenantWhereUniqueInput
  }

  export type GlobalProductMasterCatalogCreateNestedOneWithoutInventoryItemsInput = {
    create?: XOR<GlobalProductMasterCatalogCreateWithoutInventoryItemsInput, GlobalProductMasterCatalogUncheckedCreateWithoutInventoryItemsInput>
    connectOrCreate?: GlobalProductMasterCatalogCreateOrConnectWithoutInventoryItemsInput
    connect?: GlobalProductMasterCatalogWhereUniqueInput
  }

  export type OrderLineItemDetailCreateNestedManyWithoutInventoryInput = {
    create?: XOR<OrderLineItemDetailCreateWithoutInventoryInput, OrderLineItemDetailUncheckedCreateWithoutInventoryInput> | OrderLineItemDetailCreateWithoutInventoryInput[] | OrderLineItemDetailUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: OrderLineItemDetailCreateOrConnectWithoutInventoryInput | OrderLineItemDetailCreateOrConnectWithoutInventoryInput[]
    createMany?: OrderLineItemDetailCreateManyInventoryInputEnvelope
    connect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
  }

  export type OrderLineItemDetailUncheckedCreateNestedManyWithoutInventoryInput = {
    create?: XOR<OrderLineItemDetailCreateWithoutInventoryInput, OrderLineItemDetailUncheckedCreateWithoutInventoryInput> | OrderLineItemDetailCreateWithoutInventoryInput[] | OrderLineItemDetailUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: OrderLineItemDetailCreateOrConnectWithoutInventoryInput | OrderLineItemDetailCreateOrConnectWithoutInventoryInput[]
    createMany?: OrderLineItemDetailCreateManyInventoryInputEnvelope
    connect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type RetailStoreTenantUpdateOneRequiredWithoutInventoryItemsNestedInput = {
    create?: XOR<RetailStoreTenantCreateWithoutInventoryItemsInput, RetailStoreTenantUncheckedCreateWithoutInventoryItemsInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutInventoryItemsInput
    upsert?: RetailStoreTenantUpsertWithoutInventoryItemsInput
    connect?: RetailStoreTenantWhereUniqueInput
    update?: XOR<XOR<RetailStoreTenantUpdateToOneWithWhereWithoutInventoryItemsInput, RetailStoreTenantUpdateWithoutInventoryItemsInput>, RetailStoreTenantUncheckedUpdateWithoutInventoryItemsInput>
  }

  export type GlobalProductMasterCatalogUpdateOneWithoutInventoryItemsNestedInput = {
    create?: XOR<GlobalProductMasterCatalogCreateWithoutInventoryItemsInput, GlobalProductMasterCatalogUncheckedCreateWithoutInventoryItemsInput>
    connectOrCreate?: GlobalProductMasterCatalogCreateOrConnectWithoutInventoryItemsInput
    upsert?: GlobalProductMasterCatalogUpsertWithoutInventoryItemsInput
    disconnect?: GlobalProductMasterCatalogWhereInput | boolean
    delete?: GlobalProductMasterCatalogWhereInput | boolean
    connect?: GlobalProductMasterCatalogWhereUniqueInput
    update?: XOR<XOR<GlobalProductMasterCatalogUpdateToOneWithWhereWithoutInventoryItemsInput, GlobalProductMasterCatalogUpdateWithoutInventoryItemsInput>, GlobalProductMasterCatalogUncheckedUpdateWithoutInventoryItemsInput>
  }

  export type OrderLineItemDetailUpdateManyWithoutInventoryNestedInput = {
    create?: XOR<OrderLineItemDetailCreateWithoutInventoryInput, OrderLineItemDetailUncheckedCreateWithoutInventoryInput> | OrderLineItemDetailCreateWithoutInventoryInput[] | OrderLineItemDetailUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: OrderLineItemDetailCreateOrConnectWithoutInventoryInput | OrderLineItemDetailCreateOrConnectWithoutInventoryInput[]
    upsert?: OrderLineItemDetailUpsertWithWhereUniqueWithoutInventoryInput | OrderLineItemDetailUpsertWithWhereUniqueWithoutInventoryInput[]
    createMany?: OrderLineItemDetailCreateManyInventoryInputEnvelope
    set?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    disconnect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    delete?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    connect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    update?: OrderLineItemDetailUpdateWithWhereUniqueWithoutInventoryInput | OrderLineItemDetailUpdateWithWhereUniqueWithoutInventoryInput[]
    updateMany?: OrderLineItemDetailUpdateManyWithWhereWithoutInventoryInput | OrderLineItemDetailUpdateManyWithWhereWithoutInventoryInput[]
    deleteMany?: OrderLineItemDetailScalarWhereInput | OrderLineItemDetailScalarWhereInput[]
  }

  export type OrderLineItemDetailUncheckedUpdateManyWithoutInventoryNestedInput = {
    create?: XOR<OrderLineItemDetailCreateWithoutInventoryInput, OrderLineItemDetailUncheckedCreateWithoutInventoryInput> | OrderLineItemDetailCreateWithoutInventoryInput[] | OrderLineItemDetailUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: OrderLineItemDetailCreateOrConnectWithoutInventoryInput | OrderLineItemDetailCreateOrConnectWithoutInventoryInput[]
    upsert?: OrderLineItemDetailUpsertWithWhereUniqueWithoutInventoryInput | OrderLineItemDetailUpsertWithWhereUniqueWithoutInventoryInput[]
    createMany?: OrderLineItemDetailCreateManyInventoryInputEnvelope
    set?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    disconnect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    delete?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    connect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    update?: OrderLineItemDetailUpdateWithWhereUniqueWithoutInventoryInput | OrderLineItemDetailUpdateWithWhereUniqueWithoutInventoryInput[]
    updateMany?: OrderLineItemDetailUpdateManyWithWhereWithoutInventoryInput | OrderLineItemDetailUpdateManyWithWhereWithoutInventoryInput[]
    deleteMany?: OrderLineItemDetailScalarWhereInput | OrderLineItemDetailScalarWhereInput[]
  }

  export type RetailStoreTenantCreateNestedOneWithoutOrdersInput = {
    create?: XOR<RetailStoreTenantCreateWithoutOrdersInput, RetailStoreTenantUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutOrdersInput
    connect?: RetailStoreTenantWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutOrdersInput = {
    create?: XOR<CustomerCreateWithoutOrdersInput, CustomerUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutOrdersInput
    connect?: CustomerWhereUniqueInput
  }

  export type OrderLineItemDetailCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderLineItemDetailCreateWithoutOrderInput, OrderLineItemDetailUncheckedCreateWithoutOrderInput> | OrderLineItemDetailCreateWithoutOrderInput[] | OrderLineItemDetailUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderLineItemDetailCreateOrConnectWithoutOrderInput | OrderLineItemDetailCreateOrConnectWithoutOrderInput[]
    createMany?: OrderLineItemDetailCreateManyOrderInputEnvelope
    connect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
  }

  export type OrderLineItemDetailUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderLineItemDetailCreateWithoutOrderInput, OrderLineItemDetailUncheckedCreateWithoutOrderInput> | OrderLineItemDetailCreateWithoutOrderInput[] | OrderLineItemDetailUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderLineItemDetailCreateOrConnectWithoutOrderInput | OrderLineItemDetailCreateOrConnectWithoutOrderInput[]
    createMany?: OrderLineItemDetailCreateManyOrderInputEnvelope
    connect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type RetailStoreTenantUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<RetailStoreTenantCreateWithoutOrdersInput, RetailStoreTenantUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutOrdersInput
    upsert?: RetailStoreTenantUpsertWithoutOrdersInput
    connect?: RetailStoreTenantWhereUniqueInput
    update?: XOR<XOR<RetailStoreTenantUpdateToOneWithWhereWithoutOrdersInput, RetailStoreTenantUpdateWithoutOrdersInput>, RetailStoreTenantUncheckedUpdateWithoutOrdersInput>
  }

  export type CustomerUpdateOneWithoutOrdersNestedInput = {
    create?: XOR<CustomerCreateWithoutOrdersInput, CustomerUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutOrdersInput
    upsert?: CustomerUpsertWithoutOrdersInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutOrdersInput, CustomerUpdateWithoutOrdersInput>, CustomerUncheckedUpdateWithoutOrdersInput>
  }

  export type OrderLineItemDetailUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderLineItemDetailCreateWithoutOrderInput, OrderLineItemDetailUncheckedCreateWithoutOrderInput> | OrderLineItemDetailCreateWithoutOrderInput[] | OrderLineItemDetailUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderLineItemDetailCreateOrConnectWithoutOrderInput | OrderLineItemDetailCreateOrConnectWithoutOrderInput[]
    upsert?: OrderLineItemDetailUpsertWithWhereUniqueWithoutOrderInput | OrderLineItemDetailUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderLineItemDetailCreateManyOrderInputEnvelope
    set?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    disconnect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    delete?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    connect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    update?: OrderLineItemDetailUpdateWithWhereUniqueWithoutOrderInput | OrderLineItemDetailUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderLineItemDetailUpdateManyWithWhereWithoutOrderInput | OrderLineItemDetailUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderLineItemDetailScalarWhereInput | OrderLineItemDetailScalarWhereInput[]
  }

  export type OrderLineItemDetailUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderLineItemDetailCreateWithoutOrderInput, OrderLineItemDetailUncheckedCreateWithoutOrderInput> | OrderLineItemDetailCreateWithoutOrderInput[] | OrderLineItemDetailUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderLineItemDetailCreateOrConnectWithoutOrderInput | OrderLineItemDetailCreateOrConnectWithoutOrderInput[]
    upsert?: OrderLineItemDetailUpsertWithWhereUniqueWithoutOrderInput | OrderLineItemDetailUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderLineItemDetailCreateManyOrderInputEnvelope
    set?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    disconnect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    delete?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    connect?: OrderLineItemDetailWhereUniqueInput | OrderLineItemDetailWhereUniqueInput[]
    update?: OrderLineItemDetailUpdateWithWhereUniqueWithoutOrderInput | OrderLineItemDetailUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderLineItemDetailUpdateManyWithWhereWithoutOrderInput | OrderLineItemDetailUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderLineItemDetailScalarWhereInput | OrderLineItemDetailScalarWhereInput[]
  }

  export type CustomerOrderHeaderCreateNestedOneWithoutLineItemsInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutLineItemsInput, CustomerOrderHeaderUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutLineItemsInput
    connect?: CustomerOrderHeaderWhereUniqueInput
  }

  export type RetailStoreInventoryItemCreateNestedOneWithoutLineItemsInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutLineItemsInput, RetailStoreInventoryItemUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutLineItemsInput
    connect?: RetailStoreInventoryItemWhereUniqueInput
  }

  export type CustomerOrderHeaderUpdateOneRequiredWithoutLineItemsNestedInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutLineItemsInput, CustomerOrderHeaderUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutLineItemsInput
    upsert?: CustomerOrderHeaderUpsertWithoutLineItemsInput
    connect?: CustomerOrderHeaderWhereUniqueInput
    update?: XOR<XOR<CustomerOrderHeaderUpdateToOneWithWhereWithoutLineItemsInput, CustomerOrderHeaderUpdateWithoutLineItemsInput>, CustomerOrderHeaderUncheckedUpdateWithoutLineItemsInput>
  }

  export type RetailStoreInventoryItemUpdateOneWithoutLineItemsNestedInput = {
    create?: XOR<RetailStoreInventoryItemCreateWithoutLineItemsInput, RetailStoreInventoryItemUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: RetailStoreInventoryItemCreateOrConnectWithoutLineItemsInput
    upsert?: RetailStoreInventoryItemUpsertWithoutLineItemsInput
    disconnect?: RetailStoreInventoryItemWhereInput | boolean
    delete?: RetailStoreInventoryItemWhereInput | boolean
    connect?: RetailStoreInventoryItemWhereUniqueInput
    update?: XOR<XOR<RetailStoreInventoryItemUpdateToOneWithWhereWithoutLineItemsInput, RetailStoreInventoryItemUpdateWithoutLineItemsInput>, RetailStoreInventoryItemUncheckedUpdateWithoutLineItemsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RetailStoreTenantCreateNestedOneWithoutCustomersInput = {
    create?: XOR<RetailStoreTenantCreateWithoutCustomersInput, RetailStoreTenantUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutCustomersInput
    connect?: RetailStoreTenantWhereUniqueInput
  }

  export type CustomerOrderHeaderCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutCustomerInput, CustomerOrderHeaderUncheckedCreateWithoutCustomerInput> | CustomerOrderHeaderCreateWithoutCustomerInput[] | CustomerOrderHeaderUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutCustomerInput | CustomerOrderHeaderCreateOrConnectWithoutCustomerInput[]
    createMany?: CustomerOrderHeaderCreateManyCustomerInputEnvelope
    connect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
  }

  export type CustomerOrderHeaderUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutCustomerInput, CustomerOrderHeaderUncheckedCreateWithoutCustomerInput> | CustomerOrderHeaderCreateWithoutCustomerInput[] | CustomerOrderHeaderUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutCustomerInput | CustomerOrderHeaderCreateOrConnectWithoutCustomerInput[]
    createMany?: CustomerOrderHeaderCreateManyCustomerInputEnvelope
    connect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
  }

  export type RetailStoreTenantUpdateOneWithoutCustomersNestedInput = {
    create?: XOR<RetailStoreTenantCreateWithoutCustomersInput, RetailStoreTenantUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutCustomersInput
    upsert?: RetailStoreTenantUpsertWithoutCustomersInput
    disconnect?: RetailStoreTenantWhereInput | boolean
    delete?: RetailStoreTenantWhereInput | boolean
    connect?: RetailStoreTenantWhereUniqueInput
    update?: XOR<XOR<RetailStoreTenantUpdateToOneWithWhereWithoutCustomersInput, RetailStoreTenantUpdateWithoutCustomersInput>, RetailStoreTenantUncheckedUpdateWithoutCustomersInput>
  }

  export type CustomerOrderHeaderUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutCustomerInput, CustomerOrderHeaderUncheckedCreateWithoutCustomerInput> | CustomerOrderHeaderCreateWithoutCustomerInput[] | CustomerOrderHeaderUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutCustomerInput | CustomerOrderHeaderCreateOrConnectWithoutCustomerInput[]
    upsert?: CustomerOrderHeaderUpsertWithWhereUniqueWithoutCustomerInput | CustomerOrderHeaderUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CustomerOrderHeaderCreateManyCustomerInputEnvelope
    set?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    disconnect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    delete?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    connect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    update?: CustomerOrderHeaderUpdateWithWhereUniqueWithoutCustomerInput | CustomerOrderHeaderUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CustomerOrderHeaderUpdateManyWithWhereWithoutCustomerInput | CustomerOrderHeaderUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CustomerOrderHeaderScalarWhereInput | CustomerOrderHeaderScalarWhereInput[]
  }

  export type CustomerOrderHeaderUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CustomerOrderHeaderCreateWithoutCustomerInput, CustomerOrderHeaderUncheckedCreateWithoutCustomerInput> | CustomerOrderHeaderCreateWithoutCustomerInput[] | CustomerOrderHeaderUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerOrderHeaderCreateOrConnectWithoutCustomerInput | CustomerOrderHeaderCreateOrConnectWithoutCustomerInput[]
    upsert?: CustomerOrderHeaderUpsertWithWhereUniqueWithoutCustomerInput | CustomerOrderHeaderUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CustomerOrderHeaderCreateManyCustomerInputEnvelope
    set?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    disconnect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    delete?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    connect?: CustomerOrderHeaderWhereUniqueInput | CustomerOrderHeaderWhereUniqueInput[]
    update?: CustomerOrderHeaderUpdateWithWhereUniqueWithoutCustomerInput | CustomerOrderHeaderUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CustomerOrderHeaderUpdateManyWithWhereWithoutCustomerInput | CustomerOrderHeaderUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CustomerOrderHeaderScalarWhereInput | CustomerOrderHeaderScalarWhereInput[]
  }

  export type RetailStoreTenantCreateNestedOneWithoutVendorInvoicesInput = {
    create?: XOR<RetailStoreTenantCreateWithoutVendorInvoicesInput, RetailStoreTenantUncheckedCreateWithoutVendorInvoicesInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutVendorInvoicesInput
    connect?: RetailStoreTenantWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RetailStoreTenantUpdateOneRequiredWithoutVendorInvoicesNestedInput = {
    create?: XOR<RetailStoreTenantCreateWithoutVendorInvoicesInput, RetailStoreTenantUncheckedCreateWithoutVendorInvoicesInput>
    connectOrCreate?: RetailStoreTenantCreateOrConnectWithoutVendorInvoicesInput
    upsert?: RetailStoreTenantUpsertWithoutVendorInvoicesInput
    connect?: RetailStoreTenantWhereUniqueInput
    update?: XOR<XOR<RetailStoreTenantUpdateToOneWithWhereWithoutVendorInvoicesInput, RetailStoreTenantUpdateWithoutVendorInvoicesInput>, RetailStoreTenantUncheckedUpdateWithoutVendorInvoicesInput>
  }

  export type UserCreateNestedOneWithoutSuperAdminProfileInput = {
    create?: XOR<UserCreateWithoutSuperAdminProfileInput, UserUncheckedCreateWithoutSuperAdminProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutSuperAdminProfileInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSuperAdminProfileNestedInput = {
    create?: XOR<UserCreateWithoutSuperAdminProfileInput, UserUncheckedCreateWithoutSuperAdminProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutSuperAdminProfileInput
    upsert?: UserUpsertWithoutSuperAdminProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSuperAdminProfileInput, UserUpdateWithoutSuperAdminProfileInput>, UserUncheckedUpdateWithoutSuperAdminProfileInput>
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RetailStoreTenantCreateWithoutOwnerInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    InventoryItems?: RetailStoreInventoryItemCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesCreateNestedManyWithoutTenantInput
    Customers?: CustomerCreateNestedManyWithoutTenantInput
    Users?: UserCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantUncheckedCreateWithoutOwnerInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    InventoryItems?: RetailStoreInventoryItemUncheckedCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderUncheckedCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesUncheckedCreateNestedManyWithoutTenantInput
    Customers?: CustomerUncheckedCreateNestedManyWithoutTenantInput
    Users?: UserUncheckedCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantCreateOrConnectWithoutOwnerInput = {
    where: RetailStoreTenantWhereUniqueInput
    create: XOR<RetailStoreTenantCreateWithoutOwnerInput, RetailStoreTenantUncheckedCreateWithoutOwnerInput>
  }

  export type RetailStoreTenantCreateManyOwnerInputEnvelope = {
    data: RetailStoreTenantCreateManyOwnerInput | RetailStoreTenantCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type SuperAdminUserCreateWithoutUserInput = {
    id?: string
  }

  export type SuperAdminUserUncheckedCreateWithoutUserInput = {
    id?: string
  }

  export type SuperAdminUserCreateOrConnectWithoutUserInput = {
    where: SuperAdminUserWhereUniqueInput
    create: XOR<SuperAdminUserCreateWithoutUserInput, SuperAdminUserUncheckedCreateWithoutUserInput>
  }

  export type RetailStoreTenantCreateWithoutUsersInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    owner?: UserCreateNestedOneWithoutRetailStoreTenantsInput
    InventoryItems?: RetailStoreInventoryItemCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesCreateNestedManyWithoutTenantInput
    Customers?: CustomerCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantUncheckedCreateWithoutUsersInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    ownerUserId?: string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderUncheckedCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesUncheckedCreateNestedManyWithoutTenantInput
    Customers?: CustomerUncheckedCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantCreateOrConnectWithoutUsersInput = {
    where: RetailStoreTenantWhereUniqueInput
    create: XOR<RetailStoreTenantCreateWithoutUsersInput, RetailStoreTenantUncheckedCreateWithoutUsersInput>
  }

  export type RetailStoreTenantUpsertWithWhereUniqueWithoutOwnerInput = {
    where: RetailStoreTenantWhereUniqueInput
    update: XOR<RetailStoreTenantUpdateWithoutOwnerInput, RetailStoreTenantUncheckedUpdateWithoutOwnerInput>
    create: XOR<RetailStoreTenantCreateWithoutOwnerInput, RetailStoreTenantUncheckedCreateWithoutOwnerInput>
  }

  export type RetailStoreTenantUpdateWithWhereUniqueWithoutOwnerInput = {
    where: RetailStoreTenantWhereUniqueInput
    data: XOR<RetailStoreTenantUpdateWithoutOwnerInput, RetailStoreTenantUncheckedUpdateWithoutOwnerInput>
  }

  export type RetailStoreTenantUpdateManyWithWhereWithoutOwnerInput = {
    where: RetailStoreTenantScalarWhereInput
    data: XOR<RetailStoreTenantUpdateManyMutationInput, RetailStoreTenantUncheckedUpdateManyWithoutOwnerInput>
  }

  export type RetailStoreTenantScalarWhereInput = {
    AND?: RetailStoreTenantScalarWhereInput | RetailStoreTenantScalarWhereInput[]
    OR?: RetailStoreTenantScalarWhereInput[]
    NOT?: RetailStoreTenantScalarWhereInput | RetailStoreTenantScalarWhereInput[]
    tenantId?: StringFilter<"RetailStoreTenant"> | string
    storeName?: StringFilter<"RetailStoreTenant"> | string
    subdomain?: StringNullableFilter<"RetailStoreTenant"> | string | null
    isActive?: BoolFilter<"RetailStoreTenant"> | boolean
    ownerUserId?: StringNullableFilter<"RetailStoreTenant"> | string | null
  }

  export type SuperAdminUserUpsertWithoutUserInput = {
    update: XOR<SuperAdminUserUpdateWithoutUserInput, SuperAdminUserUncheckedUpdateWithoutUserInput>
    create: XOR<SuperAdminUserCreateWithoutUserInput, SuperAdminUserUncheckedCreateWithoutUserInput>
    where?: SuperAdminUserWhereInput
  }

  export type SuperAdminUserUpdateToOneWithWhereWithoutUserInput = {
    where?: SuperAdminUserWhereInput
    data: XOR<SuperAdminUserUpdateWithoutUserInput, SuperAdminUserUncheckedUpdateWithoutUserInput>
  }

  export type SuperAdminUserUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type SuperAdminUserUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type RetailStoreTenantUpsertWithoutUsersInput = {
    update: XOR<RetailStoreTenantUpdateWithoutUsersInput, RetailStoreTenantUncheckedUpdateWithoutUsersInput>
    create: XOR<RetailStoreTenantCreateWithoutUsersInput, RetailStoreTenantUncheckedCreateWithoutUsersInput>
    where?: RetailStoreTenantWhereInput
  }

  export type RetailStoreTenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: RetailStoreTenantWhereInput
    data: XOR<RetailStoreTenantUpdateWithoutUsersInput, RetailStoreTenantUncheckedUpdateWithoutUsersInput>
  }

  export type RetailStoreTenantUpdateWithoutUsersInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneWithoutRetailStoreTenantsNestedInput
    InventoryItems?: RetailStoreInventoryItemUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantUncheckedUpdateWithoutUsersInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUncheckedUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUncheckedUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserCreateWithoutRetailStoreTenantsInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SuperAdminProfile?: SuperAdminUserCreateNestedOneWithoutUserInput
    tenant?: RetailStoreTenantCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutRetailStoreTenantsInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId?: string | null
    SuperAdminProfile?: SuperAdminUserUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRetailStoreTenantsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRetailStoreTenantsInput, UserUncheckedCreateWithoutRetailStoreTenantsInput>
  }

  export type RetailStoreInventoryItemCreateWithoutTenantInput = {
    inventoryId?: string
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    globalProduct?: GlobalProductMasterCatalogCreateNestedOneWithoutInventoryItemsInput
    lineItems?: OrderLineItemDetailCreateNestedManyWithoutInventoryInput
  }

  export type RetailStoreInventoryItemUncheckedCreateWithoutTenantInput = {
    inventoryId?: string
    globalProductId?: string | null
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    lineItems?: OrderLineItemDetailUncheckedCreateNestedManyWithoutInventoryInput
  }

  export type RetailStoreInventoryItemCreateOrConnectWithoutTenantInput = {
    where: RetailStoreInventoryItemWhereUniqueInput
    create: XOR<RetailStoreInventoryItemCreateWithoutTenantInput, RetailStoreInventoryItemUncheckedCreateWithoutTenantInput>
  }

  export type RetailStoreInventoryItemCreateManyTenantInputEnvelope = {
    data: RetailStoreInventoryItemCreateManyTenantInput | RetailStoreInventoryItemCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type CustomerOrderHeaderCreateWithoutTenantInput = {
    orderId?: string
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    customer?: CustomerCreateNestedOneWithoutOrdersInput
    lineItems?: OrderLineItemDetailCreateNestedManyWithoutOrderInput
  }

  export type CustomerOrderHeaderUncheckedCreateWithoutTenantInput = {
    orderId?: string
    customerId?: string | null
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    lineItems?: OrderLineItemDetailUncheckedCreateNestedManyWithoutOrderInput
  }

  export type CustomerOrderHeaderCreateOrConnectWithoutTenantInput = {
    where: CustomerOrderHeaderWhereUniqueInput
    create: XOR<CustomerOrderHeaderCreateWithoutTenantInput, CustomerOrderHeaderUncheckedCreateWithoutTenantInput>
  }

  export type CustomerOrderHeaderCreateManyTenantInputEnvelope = {
    data: CustomerOrderHeaderCreateManyTenantInput | CustomerOrderHeaderCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type VendorInvoicesCreateWithoutTenantInput = {
    invoiceId?: string
    vendorName: string
    invoiceDate?: Date | string | null
    totalAmount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VendorInvoicesUncheckedCreateWithoutTenantInput = {
    invoiceId?: string
    vendorName: string
    invoiceDate?: Date | string | null
    totalAmount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VendorInvoicesCreateOrConnectWithoutTenantInput = {
    where: VendorInvoicesWhereUniqueInput
    create: XOR<VendorInvoicesCreateWithoutTenantInput, VendorInvoicesUncheckedCreateWithoutTenantInput>
  }

  export type VendorInvoicesCreateManyTenantInputEnvelope = {
    data: VendorInvoicesCreateManyTenantInput | VendorInvoicesCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type CustomerCreateWithoutTenantInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: CustomerOrderHeaderCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutTenantInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    orders?: CustomerOrderHeaderUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutTenantInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutTenantInput, CustomerUncheckedCreateWithoutTenantInput>
  }

  export type CustomerCreateManyTenantInputEnvelope = {
    data: CustomerCreateManyTenantInput | CustomerCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutTenantInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    RetailStoreTenants?: RetailStoreTenantCreateNestedManyWithoutOwnerInput
    SuperAdminProfile?: SuperAdminUserCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTenantInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    RetailStoreTenants?: RetailStoreTenantUncheckedCreateNestedManyWithoutOwnerInput
    SuperAdminProfile?: SuperAdminUserUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTenantInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserCreateManyTenantInputEnvelope = {
    data: UserCreateManyTenantInput | UserCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutRetailStoreTenantsInput = {
    update: XOR<UserUpdateWithoutRetailStoreTenantsInput, UserUncheckedUpdateWithoutRetailStoreTenantsInput>
    create: XOR<UserCreateWithoutRetailStoreTenantsInput, UserUncheckedCreateWithoutRetailStoreTenantsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRetailStoreTenantsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRetailStoreTenantsInput, UserUncheckedUpdateWithoutRetailStoreTenantsInput>
  }

  export type UserUpdateWithoutRetailStoreTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SuperAdminProfile?: SuperAdminUserUpdateOneWithoutUserNestedInput
    tenant?: RetailStoreTenantUpdateOneWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutRetailStoreTenantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    SuperAdminProfile?: SuperAdminUserUncheckedUpdateOneWithoutUserNestedInput
  }

  export type RetailStoreInventoryItemUpsertWithWhereUniqueWithoutTenantInput = {
    where: RetailStoreInventoryItemWhereUniqueInput
    update: XOR<RetailStoreInventoryItemUpdateWithoutTenantInput, RetailStoreInventoryItemUncheckedUpdateWithoutTenantInput>
    create: XOR<RetailStoreInventoryItemCreateWithoutTenantInput, RetailStoreInventoryItemUncheckedCreateWithoutTenantInput>
  }

  export type RetailStoreInventoryItemUpdateWithWhereUniqueWithoutTenantInput = {
    where: RetailStoreInventoryItemWhereUniqueInput
    data: XOR<RetailStoreInventoryItemUpdateWithoutTenantInput, RetailStoreInventoryItemUncheckedUpdateWithoutTenantInput>
  }

  export type RetailStoreInventoryItemUpdateManyWithWhereWithoutTenantInput = {
    where: RetailStoreInventoryItemScalarWhereInput
    data: XOR<RetailStoreInventoryItemUpdateManyMutationInput, RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantInput>
  }

  export type RetailStoreInventoryItemScalarWhereInput = {
    AND?: RetailStoreInventoryItemScalarWhereInput | RetailStoreInventoryItemScalarWhereInput[]
    OR?: RetailStoreInventoryItemScalarWhereInput[]
    NOT?: RetailStoreInventoryItemScalarWhereInput | RetailStoreInventoryItemScalarWhereInput[]
    inventoryId?: StringFilter<"RetailStoreInventoryItem"> | string
    tenantId?: StringFilter<"RetailStoreInventoryItem"> | string
    globalProductId?: StringNullableFilter<"RetailStoreInventoryItem"> | string | null
    currentStock?: IntFilter<"RetailStoreInventoryItem"> | number
    reorderLevel?: IntFilter<"RetailStoreInventoryItem"> | number
    sellingPrice?: DecimalNullableFilter<"RetailStoreInventoryItem"> | Decimal | DecimalJsLike | number | string | null
    costPrice?: DecimalNullableFilter<"RetailStoreInventoryItem"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFilter<"RetailStoreInventoryItem"> | boolean
  }

  export type CustomerOrderHeaderUpsertWithWhereUniqueWithoutTenantInput = {
    where: CustomerOrderHeaderWhereUniqueInput
    update: XOR<CustomerOrderHeaderUpdateWithoutTenantInput, CustomerOrderHeaderUncheckedUpdateWithoutTenantInput>
    create: XOR<CustomerOrderHeaderCreateWithoutTenantInput, CustomerOrderHeaderUncheckedCreateWithoutTenantInput>
  }

  export type CustomerOrderHeaderUpdateWithWhereUniqueWithoutTenantInput = {
    where: CustomerOrderHeaderWhereUniqueInput
    data: XOR<CustomerOrderHeaderUpdateWithoutTenantInput, CustomerOrderHeaderUncheckedUpdateWithoutTenantInput>
  }

  export type CustomerOrderHeaderUpdateManyWithWhereWithoutTenantInput = {
    where: CustomerOrderHeaderScalarWhereInput
    data: XOR<CustomerOrderHeaderUpdateManyMutationInput, CustomerOrderHeaderUncheckedUpdateManyWithoutTenantInput>
  }

  export type CustomerOrderHeaderScalarWhereInput = {
    AND?: CustomerOrderHeaderScalarWhereInput | CustomerOrderHeaderScalarWhereInput[]
    OR?: CustomerOrderHeaderScalarWhereInput[]
    NOT?: CustomerOrderHeaderScalarWhereInput | CustomerOrderHeaderScalarWhereInput[]
    orderId?: StringFilter<"CustomerOrderHeader"> | string
    tenantId?: StringFilter<"CustomerOrderHeader"> | string
    customerId?: StringNullableFilter<"CustomerOrderHeader"> | string | null
    orderNumber?: StringNullableFilter<"CustomerOrderHeader"> | string | null
    totalAmount?: DecimalFilter<"CustomerOrderHeader"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"CustomerOrderHeader"> | string
    createdAt?: DateTimeFilter<"CustomerOrderHeader"> | Date | string
  }

  export type VendorInvoicesUpsertWithWhereUniqueWithoutTenantInput = {
    where: VendorInvoicesWhereUniqueInput
    update: XOR<VendorInvoicesUpdateWithoutTenantInput, VendorInvoicesUncheckedUpdateWithoutTenantInput>
    create: XOR<VendorInvoicesCreateWithoutTenantInput, VendorInvoicesUncheckedCreateWithoutTenantInput>
  }

  export type VendorInvoicesUpdateWithWhereUniqueWithoutTenantInput = {
    where: VendorInvoicesWhereUniqueInput
    data: XOR<VendorInvoicesUpdateWithoutTenantInput, VendorInvoicesUncheckedUpdateWithoutTenantInput>
  }

  export type VendorInvoicesUpdateManyWithWhereWithoutTenantInput = {
    where: VendorInvoicesScalarWhereInput
    data: XOR<VendorInvoicesUpdateManyMutationInput, VendorInvoicesUncheckedUpdateManyWithoutTenantInput>
  }

  export type VendorInvoicesScalarWhereInput = {
    AND?: VendorInvoicesScalarWhereInput | VendorInvoicesScalarWhereInput[]
    OR?: VendorInvoicesScalarWhereInput[]
    NOT?: VendorInvoicesScalarWhereInput | VendorInvoicesScalarWhereInput[]
    invoiceId?: StringFilter<"VendorInvoices"> | string
    tenantId?: StringFilter<"VendorInvoices"> | string
    vendorName?: StringFilter<"VendorInvoices"> | string
    invoiceDate?: DateTimeNullableFilter<"VendorInvoices"> | Date | string | null
    totalAmount?: DecimalNullableFilter<"VendorInvoices"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"VendorInvoices"> | string
    lineItems?: JsonNullableFilter<"VendorInvoices">
  }

  export type CustomerUpsertWithWhereUniqueWithoutTenantInput = {
    where: CustomerWhereUniqueInput
    update: XOR<CustomerUpdateWithoutTenantInput, CustomerUncheckedUpdateWithoutTenantInput>
    create: XOR<CustomerCreateWithoutTenantInput, CustomerUncheckedCreateWithoutTenantInput>
  }

  export type CustomerUpdateWithWhereUniqueWithoutTenantInput = {
    where: CustomerWhereUniqueInput
    data: XOR<CustomerUpdateWithoutTenantInput, CustomerUncheckedUpdateWithoutTenantInput>
  }

  export type CustomerUpdateManyWithWhereWithoutTenantInput = {
    where: CustomerScalarWhereInput
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyWithoutTenantInput>
  }

  export type CustomerScalarWhereInput = {
    AND?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    OR?: CustomerScalarWhereInput[]
    NOT?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    id?: StringFilter<"Customer"> | string
    tenantId?: StringNullableFilter<"Customer"> | string | null
    fullName?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    isActive?: BoolFilter<"Customer"> | boolean
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
  }

  export type UserUpsertWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
  }

  export type UserUpdateManyWithWhereWithoutTenantInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tenantId?: StringNullableFilter<"User"> | string | null
  }

  export type RetailStoreInventoryItemCreateWithoutGlobalProductInput = {
    inventoryId?: string
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    tenant: RetailStoreTenantCreateNestedOneWithoutInventoryItemsInput
    lineItems?: OrderLineItemDetailCreateNestedManyWithoutInventoryInput
  }

  export type RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput = {
    inventoryId?: string
    tenantId: string
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    lineItems?: OrderLineItemDetailUncheckedCreateNestedManyWithoutInventoryInput
  }

  export type RetailStoreInventoryItemCreateOrConnectWithoutGlobalProductInput = {
    where: RetailStoreInventoryItemWhereUniqueInput
    create: XOR<RetailStoreInventoryItemCreateWithoutGlobalProductInput, RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput>
  }

  export type RetailStoreInventoryItemCreateManyGlobalProductInputEnvelope = {
    data: RetailStoreInventoryItemCreateManyGlobalProductInput | RetailStoreInventoryItemCreateManyGlobalProductInput[]
    skipDuplicates?: boolean
  }

  export type RetailStoreInventoryItemUpsertWithWhereUniqueWithoutGlobalProductInput = {
    where: RetailStoreInventoryItemWhereUniqueInput
    update: XOR<RetailStoreInventoryItemUpdateWithoutGlobalProductInput, RetailStoreInventoryItemUncheckedUpdateWithoutGlobalProductInput>
    create: XOR<RetailStoreInventoryItemCreateWithoutGlobalProductInput, RetailStoreInventoryItemUncheckedCreateWithoutGlobalProductInput>
  }

  export type RetailStoreInventoryItemUpdateWithWhereUniqueWithoutGlobalProductInput = {
    where: RetailStoreInventoryItemWhereUniqueInput
    data: XOR<RetailStoreInventoryItemUpdateWithoutGlobalProductInput, RetailStoreInventoryItemUncheckedUpdateWithoutGlobalProductInput>
  }

  export type RetailStoreInventoryItemUpdateManyWithWhereWithoutGlobalProductInput = {
    where: RetailStoreInventoryItemScalarWhereInput
    data: XOR<RetailStoreInventoryItemUpdateManyMutationInput, RetailStoreInventoryItemUncheckedUpdateManyWithoutGlobalProductInput>
  }

  export type RetailStoreTenantCreateWithoutInventoryItemsInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    owner?: UserCreateNestedOneWithoutRetailStoreTenantsInput
    Orders?: CustomerOrderHeaderCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesCreateNestedManyWithoutTenantInput
    Customers?: CustomerCreateNestedManyWithoutTenantInput
    Users?: UserCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantUncheckedCreateWithoutInventoryItemsInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    ownerUserId?: string | null
    Orders?: CustomerOrderHeaderUncheckedCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesUncheckedCreateNestedManyWithoutTenantInput
    Customers?: CustomerUncheckedCreateNestedManyWithoutTenantInput
    Users?: UserUncheckedCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantCreateOrConnectWithoutInventoryItemsInput = {
    where: RetailStoreTenantWhereUniqueInput
    create: XOR<RetailStoreTenantCreateWithoutInventoryItemsInput, RetailStoreTenantUncheckedCreateWithoutInventoryItemsInput>
  }

  export type GlobalProductMasterCatalogCreateWithoutInventoryItemsInput = {
    productId?: string
    productName: string
    sku?: string | null
    category?: string | null
    description?: string | null
    imageUrl?: string | null
    isActive?: boolean
  }

  export type GlobalProductMasterCatalogUncheckedCreateWithoutInventoryItemsInput = {
    productId?: string
    productName: string
    sku?: string | null
    category?: string | null
    description?: string | null
    imageUrl?: string | null
    isActive?: boolean
  }

  export type GlobalProductMasterCatalogCreateOrConnectWithoutInventoryItemsInput = {
    where: GlobalProductMasterCatalogWhereUniqueInput
    create: XOR<GlobalProductMasterCatalogCreateWithoutInventoryItemsInput, GlobalProductMasterCatalogUncheckedCreateWithoutInventoryItemsInput>
  }

  export type OrderLineItemDetailCreateWithoutInventoryInput = {
    lineItemId?: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    order: CustomerOrderHeaderCreateNestedOneWithoutLineItemsInput
  }

  export type OrderLineItemDetailUncheckedCreateWithoutInventoryInput = {
    lineItemId?: string
    orderId: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailCreateOrConnectWithoutInventoryInput = {
    where: OrderLineItemDetailWhereUniqueInput
    create: XOR<OrderLineItemDetailCreateWithoutInventoryInput, OrderLineItemDetailUncheckedCreateWithoutInventoryInput>
  }

  export type OrderLineItemDetailCreateManyInventoryInputEnvelope = {
    data: OrderLineItemDetailCreateManyInventoryInput | OrderLineItemDetailCreateManyInventoryInput[]
    skipDuplicates?: boolean
  }

  export type RetailStoreTenantUpsertWithoutInventoryItemsInput = {
    update: XOR<RetailStoreTenantUpdateWithoutInventoryItemsInput, RetailStoreTenantUncheckedUpdateWithoutInventoryItemsInput>
    create: XOR<RetailStoreTenantCreateWithoutInventoryItemsInput, RetailStoreTenantUncheckedCreateWithoutInventoryItemsInput>
    where?: RetailStoreTenantWhereInput
  }

  export type RetailStoreTenantUpdateToOneWithWhereWithoutInventoryItemsInput = {
    where?: RetailStoreTenantWhereInput
    data: XOR<RetailStoreTenantUpdateWithoutInventoryItemsInput, RetailStoreTenantUncheckedUpdateWithoutInventoryItemsInput>
  }

  export type RetailStoreTenantUpdateWithoutInventoryItemsInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneWithoutRetailStoreTenantsNestedInput
    Orders?: CustomerOrderHeaderUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUpdateManyWithoutTenantNestedInput
    Users?: UserUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantUncheckedUpdateWithoutInventoryItemsInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    Orders?: CustomerOrderHeaderUncheckedUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUncheckedUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUncheckedUpdateManyWithoutTenantNestedInput
    Users?: UserUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type GlobalProductMasterCatalogUpsertWithoutInventoryItemsInput = {
    update: XOR<GlobalProductMasterCatalogUpdateWithoutInventoryItemsInput, GlobalProductMasterCatalogUncheckedUpdateWithoutInventoryItemsInput>
    create: XOR<GlobalProductMasterCatalogCreateWithoutInventoryItemsInput, GlobalProductMasterCatalogUncheckedCreateWithoutInventoryItemsInput>
    where?: GlobalProductMasterCatalogWhereInput
  }

  export type GlobalProductMasterCatalogUpdateToOneWithWhereWithoutInventoryItemsInput = {
    where?: GlobalProductMasterCatalogWhereInput
    data: XOR<GlobalProductMasterCatalogUpdateWithoutInventoryItemsInput, GlobalProductMasterCatalogUncheckedUpdateWithoutInventoryItemsInput>
  }

  export type GlobalProductMasterCatalogUpdateWithoutInventoryItemsInput = {
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GlobalProductMasterCatalogUncheckedUpdateWithoutInventoryItemsInput = {
    productId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OrderLineItemDetailUpsertWithWhereUniqueWithoutInventoryInput = {
    where: OrderLineItemDetailWhereUniqueInput
    update: XOR<OrderLineItemDetailUpdateWithoutInventoryInput, OrderLineItemDetailUncheckedUpdateWithoutInventoryInput>
    create: XOR<OrderLineItemDetailCreateWithoutInventoryInput, OrderLineItemDetailUncheckedCreateWithoutInventoryInput>
  }

  export type OrderLineItemDetailUpdateWithWhereUniqueWithoutInventoryInput = {
    where: OrderLineItemDetailWhereUniqueInput
    data: XOR<OrderLineItemDetailUpdateWithoutInventoryInput, OrderLineItemDetailUncheckedUpdateWithoutInventoryInput>
  }

  export type OrderLineItemDetailUpdateManyWithWhereWithoutInventoryInput = {
    where: OrderLineItemDetailScalarWhereInput
    data: XOR<OrderLineItemDetailUpdateManyMutationInput, OrderLineItemDetailUncheckedUpdateManyWithoutInventoryInput>
  }

  export type OrderLineItemDetailScalarWhereInput = {
    AND?: OrderLineItemDetailScalarWhereInput | OrderLineItemDetailScalarWhereInput[]
    OR?: OrderLineItemDetailScalarWhereInput[]
    NOT?: OrderLineItemDetailScalarWhereInput | OrderLineItemDetailScalarWhereInput[]
    lineItemId?: StringFilter<"OrderLineItemDetail"> | string
    orderId?: StringFilter<"OrderLineItemDetail"> | string
    inventoryId?: StringNullableFilter<"OrderLineItemDetail"> | string | null
    productName?: StringFilter<"OrderLineItemDetail"> | string
    quantity?: IntFilter<"OrderLineItemDetail"> | number
    unitPrice?: DecimalFilter<"OrderLineItemDetail"> | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFilter<"OrderLineItemDetail"> | Decimal | DecimalJsLike | number | string
  }

  export type RetailStoreTenantCreateWithoutOrdersInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    owner?: UserCreateNestedOneWithoutRetailStoreTenantsInput
    InventoryItems?: RetailStoreInventoryItemCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesCreateNestedManyWithoutTenantInput
    Customers?: CustomerCreateNestedManyWithoutTenantInput
    Users?: UserCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantUncheckedCreateWithoutOrdersInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    ownerUserId?: string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesUncheckedCreateNestedManyWithoutTenantInput
    Customers?: CustomerUncheckedCreateNestedManyWithoutTenantInput
    Users?: UserUncheckedCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantCreateOrConnectWithoutOrdersInput = {
    where: RetailStoreTenantWhereUniqueInput
    create: XOR<RetailStoreTenantCreateWithoutOrdersInput, RetailStoreTenantUncheckedCreateWithoutOrdersInput>
  }

  export type CustomerCreateWithoutOrdersInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant?: RetailStoreTenantCreateNestedOneWithoutCustomersInput
  }

  export type CustomerUncheckedCreateWithoutOrdersInput = {
    id?: string
    tenantId?: string | null
    fullName?: string | null
    email?: string | null
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateOrConnectWithoutOrdersInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutOrdersInput, CustomerUncheckedCreateWithoutOrdersInput>
  }

  export type OrderLineItemDetailCreateWithoutOrderInput = {
    lineItemId?: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
    inventory?: RetailStoreInventoryItemCreateNestedOneWithoutLineItemsInput
  }

  export type OrderLineItemDetailUncheckedCreateWithoutOrderInput = {
    lineItemId?: string
    inventoryId?: string | null
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailCreateOrConnectWithoutOrderInput = {
    where: OrderLineItemDetailWhereUniqueInput
    create: XOR<OrderLineItemDetailCreateWithoutOrderInput, OrderLineItemDetailUncheckedCreateWithoutOrderInput>
  }

  export type OrderLineItemDetailCreateManyOrderInputEnvelope = {
    data: OrderLineItemDetailCreateManyOrderInput | OrderLineItemDetailCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type RetailStoreTenantUpsertWithoutOrdersInput = {
    update: XOR<RetailStoreTenantUpdateWithoutOrdersInput, RetailStoreTenantUncheckedUpdateWithoutOrdersInput>
    create: XOR<RetailStoreTenantCreateWithoutOrdersInput, RetailStoreTenantUncheckedCreateWithoutOrdersInput>
    where?: RetailStoreTenantWhereInput
  }

  export type RetailStoreTenantUpdateToOneWithWhereWithoutOrdersInput = {
    where?: RetailStoreTenantWhereInput
    data: XOR<RetailStoreTenantUpdateWithoutOrdersInput, RetailStoreTenantUncheckedUpdateWithoutOrdersInput>
  }

  export type RetailStoreTenantUpdateWithoutOrdersInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneWithoutRetailStoreTenantsNestedInput
    InventoryItems?: RetailStoreInventoryItemUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUpdateManyWithoutTenantNestedInput
    Users?: UserUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantUncheckedUpdateWithoutOrdersInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUncheckedUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUncheckedUpdateManyWithoutTenantNestedInput
    Users?: UserUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type CustomerUpsertWithoutOrdersInput = {
    update: XOR<CustomerUpdateWithoutOrdersInput, CustomerUncheckedUpdateWithoutOrdersInput>
    create: XOR<CustomerCreateWithoutOrdersInput, CustomerUncheckedCreateWithoutOrdersInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutOrdersInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutOrdersInput, CustomerUncheckedUpdateWithoutOrdersInput>
  }

  export type CustomerUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: RetailStoreTenantUpdateOneWithoutCustomersNestedInput
  }

  export type CustomerUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderLineItemDetailUpsertWithWhereUniqueWithoutOrderInput = {
    where: OrderLineItemDetailWhereUniqueInput
    update: XOR<OrderLineItemDetailUpdateWithoutOrderInput, OrderLineItemDetailUncheckedUpdateWithoutOrderInput>
    create: XOR<OrderLineItemDetailCreateWithoutOrderInput, OrderLineItemDetailUncheckedCreateWithoutOrderInput>
  }

  export type OrderLineItemDetailUpdateWithWhereUniqueWithoutOrderInput = {
    where: OrderLineItemDetailWhereUniqueInput
    data: XOR<OrderLineItemDetailUpdateWithoutOrderInput, OrderLineItemDetailUncheckedUpdateWithoutOrderInput>
  }

  export type OrderLineItemDetailUpdateManyWithWhereWithoutOrderInput = {
    where: OrderLineItemDetailScalarWhereInput
    data: XOR<OrderLineItemDetailUpdateManyMutationInput, OrderLineItemDetailUncheckedUpdateManyWithoutOrderInput>
  }

  export type CustomerOrderHeaderCreateWithoutLineItemsInput = {
    orderId?: string
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    tenant: RetailStoreTenantCreateNestedOneWithoutOrdersInput
    customer?: CustomerCreateNestedOneWithoutOrdersInput
  }

  export type CustomerOrderHeaderUncheckedCreateWithoutLineItemsInput = {
    orderId?: string
    tenantId: string
    customerId?: string | null
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
  }

  export type CustomerOrderHeaderCreateOrConnectWithoutLineItemsInput = {
    where: CustomerOrderHeaderWhereUniqueInput
    create: XOR<CustomerOrderHeaderCreateWithoutLineItemsInput, CustomerOrderHeaderUncheckedCreateWithoutLineItemsInput>
  }

  export type RetailStoreInventoryItemCreateWithoutLineItemsInput = {
    inventoryId?: string
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    tenant: RetailStoreTenantCreateNestedOneWithoutInventoryItemsInput
    globalProduct?: GlobalProductMasterCatalogCreateNestedOneWithoutInventoryItemsInput
  }

  export type RetailStoreInventoryItemUncheckedCreateWithoutLineItemsInput = {
    inventoryId?: string
    tenantId: string
    globalProductId?: string | null
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
  }

  export type RetailStoreInventoryItemCreateOrConnectWithoutLineItemsInput = {
    where: RetailStoreInventoryItemWhereUniqueInput
    create: XOR<RetailStoreInventoryItemCreateWithoutLineItemsInput, RetailStoreInventoryItemUncheckedCreateWithoutLineItemsInput>
  }

  export type CustomerOrderHeaderUpsertWithoutLineItemsInput = {
    update: XOR<CustomerOrderHeaderUpdateWithoutLineItemsInput, CustomerOrderHeaderUncheckedUpdateWithoutLineItemsInput>
    create: XOR<CustomerOrderHeaderCreateWithoutLineItemsInput, CustomerOrderHeaderUncheckedCreateWithoutLineItemsInput>
    where?: CustomerOrderHeaderWhereInput
  }

  export type CustomerOrderHeaderUpdateToOneWithWhereWithoutLineItemsInput = {
    where?: CustomerOrderHeaderWhereInput
    data: XOR<CustomerOrderHeaderUpdateWithoutLineItemsInput, CustomerOrderHeaderUncheckedUpdateWithoutLineItemsInput>
  }

  export type CustomerOrderHeaderUpdateWithoutLineItemsInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: RetailStoreTenantUpdateOneRequiredWithoutOrdersNestedInput
    customer?: CustomerUpdateOneWithoutOrdersNestedInput
  }

  export type CustomerOrderHeaderUncheckedUpdateWithoutLineItemsInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetailStoreInventoryItemUpsertWithoutLineItemsInput = {
    update: XOR<RetailStoreInventoryItemUpdateWithoutLineItemsInput, RetailStoreInventoryItemUncheckedUpdateWithoutLineItemsInput>
    create: XOR<RetailStoreInventoryItemCreateWithoutLineItemsInput, RetailStoreInventoryItemUncheckedCreateWithoutLineItemsInput>
    where?: RetailStoreInventoryItemWhereInput
  }

  export type RetailStoreInventoryItemUpdateToOneWithWhereWithoutLineItemsInput = {
    where?: RetailStoreInventoryItemWhereInput
    data: XOR<RetailStoreInventoryItemUpdateWithoutLineItemsInput, RetailStoreInventoryItemUncheckedUpdateWithoutLineItemsInput>
  }

  export type RetailStoreInventoryItemUpdateWithoutLineItemsInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tenant?: RetailStoreTenantUpdateOneRequiredWithoutInventoryItemsNestedInput
    globalProduct?: GlobalProductMasterCatalogUpdateOneWithoutInventoryItemsNestedInput
  }

  export type RetailStoreInventoryItemUncheckedUpdateWithoutLineItemsInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    globalProductId?: NullableStringFieldUpdateOperationsInput | string | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RetailStoreTenantCreateWithoutCustomersInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    owner?: UserCreateNestedOneWithoutRetailStoreTenantsInput
    InventoryItems?: RetailStoreInventoryItemCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesCreateNestedManyWithoutTenantInput
    Users?: UserCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantUncheckedCreateWithoutCustomersInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    ownerUserId?: string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderUncheckedCreateNestedManyWithoutTenantInput
    VendorInvoices?: VendorInvoicesUncheckedCreateNestedManyWithoutTenantInput
    Users?: UserUncheckedCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantCreateOrConnectWithoutCustomersInput = {
    where: RetailStoreTenantWhereUniqueInput
    create: XOR<RetailStoreTenantCreateWithoutCustomersInput, RetailStoreTenantUncheckedCreateWithoutCustomersInput>
  }

  export type CustomerOrderHeaderCreateWithoutCustomerInput = {
    orderId?: string
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    tenant: RetailStoreTenantCreateNestedOneWithoutOrdersInput
    lineItems?: OrderLineItemDetailCreateNestedManyWithoutOrderInput
  }

  export type CustomerOrderHeaderUncheckedCreateWithoutCustomerInput = {
    orderId?: string
    tenantId: string
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    lineItems?: OrderLineItemDetailUncheckedCreateNestedManyWithoutOrderInput
  }

  export type CustomerOrderHeaderCreateOrConnectWithoutCustomerInput = {
    where: CustomerOrderHeaderWhereUniqueInput
    create: XOR<CustomerOrderHeaderCreateWithoutCustomerInput, CustomerOrderHeaderUncheckedCreateWithoutCustomerInput>
  }

  export type CustomerOrderHeaderCreateManyCustomerInputEnvelope = {
    data: CustomerOrderHeaderCreateManyCustomerInput | CustomerOrderHeaderCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type RetailStoreTenantUpsertWithoutCustomersInput = {
    update: XOR<RetailStoreTenantUpdateWithoutCustomersInput, RetailStoreTenantUncheckedUpdateWithoutCustomersInput>
    create: XOR<RetailStoreTenantCreateWithoutCustomersInput, RetailStoreTenantUncheckedCreateWithoutCustomersInput>
    where?: RetailStoreTenantWhereInput
  }

  export type RetailStoreTenantUpdateToOneWithWhereWithoutCustomersInput = {
    where?: RetailStoreTenantWhereInput
    data: XOR<RetailStoreTenantUpdateWithoutCustomersInput, RetailStoreTenantUncheckedUpdateWithoutCustomersInput>
  }

  export type RetailStoreTenantUpdateWithoutCustomersInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneWithoutRetailStoreTenantsNestedInput
    InventoryItems?: RetailStoreInventoryItemUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUpdateManyWithoutTenantNestedInput
    Users?: UserUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantUncheckedUpdateWithoutCustomersInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUncheckedUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUncheckedUpdateManyWithoutTenantNestedInput
    Users?: UserUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type CustomerOrderHeaderUpsertWithWhereUniqueWithoutCustomerInput = {
    where: CustomerOrderHeaderWhereUniqueInput
    update: XOR<CustomerOrderHeaderUpdateWithoutCustomerInput, CustomerOrderHeaderUncheckedUpdateWithoutCustomerInput>
    create: XOR<CustomerOrderHeaderCreateWithoutCustomerInput, CustomerOrderHeaderUncheckedCreateWithoutCustomerInput>
  }

  export type CustomerOrderHeaderUpdateWithWhereUniqueWithoutCustomerInput = {
    where: CustomerOrderHeaderWhereUniqueInput
    data: XOR<CustomerOrderHeaderUpdateWithoutCustomerInput, CustomerOrderHeaderUncheckedUpdateWithoutCustomerInput>
  }

  export type CustomerOrderHeaderUpdateManyWithWhereWithoutCustomerInput = {
    where: CustomerOrderHeaderScalarWhereInput
    data: XOR<CustomerOrderHeaderUpdateManyMutationInput, CustomerOrderHeaderUncheckedUpdateManyWithoutCustomerInput>
  }

  export type RetailStoreTenantCreateWithoutVendorInvoicesInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    owner?: UserCreateNestedOneWithoutRetailStoreTenantsInput
    InventoryItems?: RetailStoreInventoryItemCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderCreateNestedManyWithoutTenantInput
    Customers?: CustomerCreateNestedManyWithoutTenantInput
    Users?: UserCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantUncheckedCreateWithoutVendorInvoicesInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
    ownerUserId?: string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedCreateNestedManyWithoutTenantInput
    Orders?: CustomerOrderHeaderUncheckedCreateNestedManyWithoutTenantInput
    Customers?: CustomerUncheckedCreateNestedManyWithoutTenantInput
    Users?: UserUncheckedCreateNestedManyWithoutTenantInput
  }

  export type RetailStoreTenantCreateOrConnectWithoutVendorInvoicesInput = {
    where: RetailStoreTenantWhereUniqueInput
    create: XOR<RetailStoreTenantCreateWithoutVendorInvoicesInput, RetailStoreTenantUncheckedCreateWithoutVendorInvoicesInput>
  }

  export type RetailStoreTenantUpsertWithoutVendorInvoicesInput = {
    update: XOR<RetailStoreTenantUpdateWithoutVendorInvoicesInput, RetailStoreTenantUncheckedUpdateWithoutVendorInvoicesInput>
    create: XOR<RetailStoreTenantCreateWithoutVendorInvoicesInput, RetailStoreTenantUncheckedCreateWithoutVendorInvoicesInput>
    where?: RetailStoreTenantWhereInput
  }

  export type RetailStoreTenantUpdateToOneWithWhereWithoutVendorInvoicesInput = {
    where?: RetailStoreTenantWhereInput
    data: XOR<RetailStoreTenantUpdateWithoutVendorInvoicesInput, RetailStoreTenantUncheckedUpdateWithoutVendorInvoicesInput>
  }

  export type RetailStoreTenantUpdateWithoutVendorInvoicesInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneWithoutRetailStoreTenantsNestedInput
    InventoryItems?: RetailStoreInventoryItemUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUpdateManyWithoutTenantNestedInput
    Users?: UserUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantUncheckedUpdateWithoutVendorInvoicesInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    InventoryItems?: RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUncheckedUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUncheckedUpdateManyWithoutTenantNestedInput
    Users?: UserUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserCreateWithoutSuperAdminProfileInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    RetailStoreTenants?: RetailStoreTenantCreateNestedManyWithoutOwnerInput
    tenant?: RetailStoreTenantCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutSuperAdminProfileInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantId?: string | null
    RetailStoreTenants?: RetailStoreTenantUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutSuperAdminProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSuperAdminProfileInput, UserUncheckedCreateWithoutSuperAdminProfileInput>
  }

  export type UserUpsertWithoutSuperAdminProfileInput = {
    update: XOR<UserUpdateWithoutSuperAdminProfileInput, UserUncheckedUpdateWithoutSuperAdminProfileInput>
    create: XOR<UserCreateWithoutSuperAdminProfileInput, UserUncheckedCreateWithoutSuperAdminProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSuperAdminProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSuperAdminProfileInput, UserUncheckedUpdateWithoutSuperAdminProfileInput>
  }

  export type UserUpdateWithoutSuperAdminProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    RetailStoreTenants?: RetailStoreTenantUpdateManyWithoutOwnerNestedInput
    tenant?: RetailStoreTenantUpdateOneWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutSuperAdminProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    RetailStoreTenants?: RetailStoreTenantUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type RetailStoreTenantCreateManyOwnerInput = {
    tenantId?: string
    storeName: string
    subdomain?: string | null
    isActive?: boolean
  }

  export type RetailStoreTenantUpdateWithoutOwnerInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    InventoryItems?: RetailStoreInventoryItemUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUpdateManyWithoutTenantNestedInput
    Users?: UserUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantUncheckedUpdateWithoutOwnerInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    InventoryItems?: RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantNestedInput
    Orders?: CustomerOrderHeaderUncheckedUpdateManyWithoutTenantNestedInput
    VendorInvoices?: VendorInvoicesUncheckedUpdateManyWithoutTenantNestedInput
    Customers?: CustomerUncheckedUpdateManyWithoutTenantNestedInput
    Users?: UserUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type RetailStoreTenantUncheckedUpdateManyWithoutOwnerInput = {
    tenantId?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RetailStoreInventoryItemCreateManyTenantInput = {
    inventoryId?: string
    globalProductId?: string | null
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
  }

  export type CustomerOrderHeaderCreateManyTenantInput = {
    orderId?: string
    customerId?: string | null
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
  }

  export type VendorInvoicesCreateManyTenantInput = {
    invoiceId?: string
    vendorName: string
    invoiceDate?: Date | string | null
    totalAmount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type CustomerCreateManyTenantInput = {
    id?: string
    fullName?: string | null
    email?: string | null
    phone?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateManyTenantInput = {
    id?: string
    email: string
    password: string
    name?: string | null
    role?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetailStoreInventoryItemUpdateWithoutTenantInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    globalProduct?: GlobalProductMasterCatalogUpdateOneWithoutInventoryItemsNestedInput
    lineItems?: OrderLineItemDetailUpdateManyWithoutInventoryNestedInput
  }

  export type RetailStoreInventoryItemUncheckedUpdateWithoutTenantInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    globalProductId?: NullableStringFieldUpdateOperationsInput | string | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lineItems?: OrderLineItemDetailUncheckedUpdateManyWithoutInventoryNestedInput
  }

  export type RetailStoreInventoryItemUncheckedUpdateManyWithoutTenantInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    globalProductId?: NullableStringFieldUpdateOperationsInput | string | null
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CustomerOrderHeaderUpdateWithoutTenantInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneWithoutOrdersNestedInput
    lineItems?: OrderLineItemDetailUpdateManyWithoutOrderNestedInput
  }

  export type CustomerOrderHeaderUncheckedUpdateWithoutTenantInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lineItems?: OrderLineItemDetailUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type CustomerOrderHeaderUncheckedUpdateManyWithoutTenantInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorInvoicesUpdateWithoutTenantInput = {
    invoiceId?: StringFieldUpdateOperationsInput | string
    vendorName?: StringFieldUpdateOperationsInput | string
    invoiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VendorInvoicesUncheckedUpdateWithoutTenantInput = {
    invoiceId?: StringFieldUpdateOperationsInput | string
    vendorName?: StringFieldUpdateOperationsInput | string
    invoiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type VendorInvoicesUncheckedUpdateManyWithoutTenantInput = {
    invoiceId?: StringFieldUpdateOperationsInput | string
    vendorName?: StringFieldUpdateOperationsInput | string
    invoiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    lineItems?: NullableJsonNullValueInput | InputJsonValue
  }

  export type CustomerUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: CustomerOrderHeaderUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: CustomerOrderHeaderUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    RetailStoreTenants?: RetailStoreTenantUpdateManyWithoutOwnerNestedInput
    SuperAdminProfile?: SuperAdminUserUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    RetailStoreTenants?: RetailStoreTenantUncheckedUpdateManyWithoutOwnerNestedInput
    SuperAdminProfile?: SuperAdminUserUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetailStoreInventoryItemCreateManyGlobalProductInput = {
    inventoryId?: string
    tenantId: string
    currentStock?: number
    reorderLevel?: number
    sellingPrice?: Decimal | DecimalJsLike | number | string | null
    costPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
  }

  export type RetailStoreInventoryItemUpdateWithoutGlobalProductInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    tenant?: RetailStoreTenantUpdateOneRequiredWithoutInventoryItemsNestedInput
    lineItems?: OrderLineItemDetailUpdateManyWithoutInventoryNestedInput
  }

  export type RetailStoreInventoryItemUncheckedUpdateWithoutGlobalProductInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lineItems?: OrderLineItemDetailUncheckedUpdateManyWithoutInventoryNestedInput
  }

  export type RetailStoreInventoryItemUncheckedUpdateManyWithoutGlobalProductInput = {
    inventoryId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    currentStock?: IntFieldUpdateOperationsInput | number
    reorderLevel?: IntFieldUpdateOperationsInput | number
    sellingPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OrderLineItemDetailCreateManyInventoryInput = {
    lineItemId?: string
    orderId: string
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailUpdateWithoutInventoryInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    order?: CustomerOrderHeaderUpdateOneRequiredWithoutLineItemsNestedInput
  }

  export type OrderLineItemDetailUncheckedUpdateWithoutInventoryInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailUncheckedUpdateManyWithoutInventoryInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailCreateManyOrderInput = {
    lineItemId?: string
    inventoryId?: string | null
    productName: string
    quantity: number
    unitPrice: Decimal | DecimalJsLike | number | string
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailUpdateWithoutOrderInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    inventory?: RetailStoreInventoryItemUpdateOneWithoutLineItemsNestedInput
  }

  export type OrderLineItemDetailUncheckedUpdateWithoutOrderInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    inventoryId?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type OrderLineItemDetailUncheckedUpdateManyWithoutOrderInput = {
    lineItemId?: StringFieldUpdateOperationsInput | string
    inventoryId?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type CustomerOrderHeaderCreateManyCustomerInput = {
    orderId?: string
    tenantId: string
    orderNumber?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
  }

  export type CustomerOrderHeaderUpdateWithoutCustomerInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: RetailStoreTenantUpdateOneRequiredWithoutOrdersNestedInput
    lineItems?: OrderLineItemDetailUpdateManyWithoutOrderNestedInput
  }

  export type CustomerOrderHeaderUncheckedUpdateWithoutCustomerInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lineItems?: OrderLineItemDetailUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type CustomerOrderHeaderUncheckedUpdateManyWithoutCustomerInput = {
    orderId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    orderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
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
     * @deprecated Use RetailStoreTenantCountOutputTypeDefaultArgs instead
     */
    export type RetailStoreTenantCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetailStoreTenantCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GlobalProductMasterCatalogCountOutputTypeDefaultArgs instead
     */
    export type GlobalProductMasterCatalogCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GlobalProductMasterCatalogCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetailStoreInventoryItemCountOutputTypeDefaultArgs instead
     */
    export type RetailStoreInventoryItemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetailStoreInventoryItemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerOrderHeaderCountOutputTypeDefaultArgs instead
     */
    export type CustomerOrderHeaderCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerOrderHeaderCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerCountOutputTypeDefaultArgs instead
     */
    export type CustomerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetailStoreTenantDefaultArgs instead
     */
    export type RetailStoreTenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetailStoreTenantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GlobalProductMasterCatalogDefaultArgs instead
     */
    export type GlobalProductMasterCatalogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GlobalProductMasterCatalogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetailStoreInventoryItemDefaultArgs instead
     */
    export type RetailStoreInventoryItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetailStoreInventoryItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerOrderHeaderDefaultArgs instead
     */
    export type CustomerOrderHeaderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerOrderHeaderDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrderLineItemDetailDefaultArgs instead
     */
    export type OrderLineItemDetailArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrderLineItemDetailDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetailStoreCustomerDefaultArgs instead
     */
    export type RetailStoreCustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetailStoreCustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerDefaultArgs instead
     */
    export type CustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VendorInvoicesDefaultArgs instead
     */
    export type VendorInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VendorInvoicesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SuperAdminUserDefaultArgs instead
     */
    export type SuperAdminUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SuperAdminUserDefaultArgs<ExtArgs>

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