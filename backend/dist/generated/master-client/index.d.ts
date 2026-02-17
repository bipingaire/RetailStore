
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
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model SharedCatalog
 * 
 */
export type SharedCatalog = $Result.DefaultSelection<Prisma.$SharedCatalogPayload>
/**
 * Model SuperAdmin
 * 
 */
export type SuperAdmin = $Result.DefaultSelection<Prisma.$SuperAdminPayload>
/**
 * Model PendingProductAddition
 * 
 */
export type PendingProductAddition = $Result.DefaultSelection<Prisma.$PendingProductAdditionPayload>
/**
 * Model MasterWebsiteConfig
 * 
 */
export type MasterWebsiteConfig = $Result.DefaultSelection<Prisma.$MasterWebsiteConfigPayload>
/**
 * Model TenantSubscription
 * 
 */
export type TenantSubscription = $Result.DefaultSelection<Prisma.$TenantSubscriptionPayload>
/**
 * Model BillingTransaction
 * 
 */
export type BillingTransaction = $Result.DefaultSelection<Prisma.$BillingTransactionPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
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
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
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
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs>;

  /**
   * `prisma.sharedCatalog`: Exposes CRUD operations for the **SharedCatalog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SharedCatalogs
    * const sharedCatalogs = await prisma.sharedCatalog.findMany()
    * ```
    */
  get sharedCatalog(): Prisma.SharedCatalogDelegate<ExtArgs>;

  /**
   * `prisma.superAdmin`: Exposes CRUD operations for the **SuperAdmin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SuperAdmins
    * const superAdmins = await prisma.superAdmin.findMany()
    * ```
    */
  get superAdmin(): Prisma.SuperAdminDelegate<ExtArgs>;

  /**
   * `prisma.pendingProductAddition`: Exposes CRUD operations for the **PendingProductAddition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PendingProductAdditions
    * const pendingProductAdditions = await prisma.pendingProductAddition.findMany()
    * ```
    */
  get pendingProductAddition(): Prisma.PendingProductAdditionDelegate<ExtArgs>;

  /**
   * `prisma.masterWebsiteConfig`: Exposes CRUD operations for the **MasterWebsiteConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MasterWebsiteConfigs
    * const masterWebsiteConfigs = await prisma.masterWebsiteConfig.findMany()
    * ```
    */
  get masterWebsiteConfig(): Prisma.MasterWebsiteConfigDelegate<ExtArgs>;

  /**
   * `prisma.tenantSubscription`: Exposes CRUD operations for the **TenantSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantSubscriptions
    * const tenantSubscriptions = await prisma.tenantSubscription.findMany()
    * ```
    */
  get tenantSubscription(): Prisma.TenantSubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.billingTransaction`: Exposes CRUD operations for the **BillingTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingTransactions
    * const billingTransactions = await prisma.billingTransaction.findMany()
    * ```
    */
  get billingTransaction(): Prisma.BillingTransactionDelegate<ExtArgs>;
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
    Tenant: 'Tenant',
    SharedCatalog: 'SharedCatalog',
    SuperAdmin: 'SuperAdmin',
    PendingProductAddition: 'PendingProductAddition',
    MasterWebsiteConfig: 'MasterWebsiteConfig',
    TenantSubscription: 'TenantSubscription',
    BillingTransaction: 'BillingTransaction'
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
      modelProps: "tenant" | "sharedCatalog" | "superAdmin" | "pendingProductAddition" | "masterWebsiteConfig" | "tenantSubscription" | "billingTransaction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      SharedCatalog: {
        payload: Prisma.$SharedCatalogPayload<ExtArgs>
        fields: Prisma.SharedCatalogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SharedCatalogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SharedCatalogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload>
          }
          findFirst: {
            args: Prisma.SharedCatalogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SharedCatalogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload>
          }
          findMany: {
            args: Prisma.SharedCatalogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload>[]
          }
          create: {
            args: Prisma.SharedCatalogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload>
          }
          createMany: {
            args: Prisma.SharedCatalogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SharedCatalogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload>[]
          }
          delete: {
            args: Prisma.SharedCatalogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload>
          }
          update: {
            args: Prisma.SharedCatalogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload>
          }
          deleteMany: {
            args: Prisma.SharedCatalogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SharedCatalogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SharedCatalogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedCatalogPayload>
          }
          aggregate: {
            args: Prisma.SharedCatalogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSharedCatalog>
          }
          groupBy: {
            args: Prisma.SharedCatalogGroupByArgs<ExtArgs>
            result: $Utils.Optional<SharedCatalogGroupByOutputType>[]
          }
          count: {
            args: Prisma.SharedCatalogCountArgs<ExtArgs>
            result: $Utils.Optional<SharedCatalogCountAggregateOutputType> | number
          }
        }
      }
      SuperAdmin: {
        payload: Prisma.$SuperAdminPayload<ExtArgs>
        fields: Prisma.SuperAdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuperAdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuperAdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findFirst: {
            args: Prisma.SuperAdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuperAdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findMany: {
            args: Prisma.SuperAdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          create: {
            args: Prisma.SuperAdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          createMany: {
            args: Prisma.SuperAdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SuperAdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          delete: {
            args: Prisma.SuperAdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          update: {
            args: Prisma.SuperAdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          deleteMany: {
            args: Prisma.SuperAdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SuperAdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SuperAdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          aggregate: {
            args: Prisma.SuperAdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSuperAdmin>
          }
          groupBy: {
            args: Prisma.SuperAdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuperAdminCountArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminCountAggregateOutputType> | number
          }
        }
      }
      PendingProductAddition: {
        payload: Prisma.$PendingProductAdditionPayload<ExtArgs>
        fields: Prisma.PendingProductAdditionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PendingProductAdditionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PendingProductAdditionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload>
          }
          findFirst: {
            args: Prisma.PendingProductAdditionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PendingProductAdditionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload>
          }
          findMany: {
            args: Prisma.PendingProductAdditionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload>[]
          }
          create: {
            args: Prisma.PendingProductAdditionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload>
          }
          createMany: {
            args: Prisma.PendingProductAdditionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PendingProductAdditionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload>[]
          }
          delete: {
            args: Prisma.PendingProductAdditionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload>
          }
          update: {
            args: Prisma.PendingProductAdditionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload>
          }
          deleteMany: {
            args: Prisma.PendingProductAdditionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PendingProductAdditionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PendingProductAdditionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingProductAdditionPayload>
          }
          aggregate: {
            args: Prisma.PendingProductAdditionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePendingProductAddition>
          }
          groupBy: {
            args: Prisma.PendingProductAdditionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PendingProductAdditionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PendingProductAdditionCountArgs<ExtArgs>
            result: $Utils.Optional<PendingProductAdditionCountAggregateOutputType> | number
          }
        }
      }
      MasterWebsiteConfig: {
        payload: Prisma.$MasterWebsiteConfigPayload<ExtArgs>
        fields: Prisma.MasterWebsiteConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MasterWebsiteConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MasterWebsiteConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload>
          }
          findFirst: {
            args: Prisma.MasterWebsiteConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MasterWebsiteConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload>
          }
          findMany: {
            args: Prisma.MasterWebsiteConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload>[]
          }
          create: {
            args: Prisma.MasterWebsiteConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload>
          }
          createMany: {
            args: Prisma.MasterWebsiteConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MasterWebsiteConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload>[]
          }
          delete: {
            args: Prisma.MasterWebsiteConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload>
          }
          update: {
            args: Prisma.MasterWebsiteConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload>
          }
          deleteMany: {
            args: Prisma.MasterWebsiteConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MasterWebsiteConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MasterWebsiteConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterWebsiteConfigPayload>
          }
          aggregate: {
            args: Prisma.MasterWebsiteConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMasterWebsiteConfig>
          }
          groupBy: {
            args: Prisma.MasterWebsiteConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<MasterWebsiteConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.MasterWebsiteConfigCountArgs<ExtArgs>
            result: $Utils.Optional<MasterWebsiteConfigCountAggregateOutputType> | number
          }
        }
      }
      TenantSubscription: {
        payload: Prisma.$TenantSubscriptionPayload<ExtArgs>
        fields: Prisma.TenantSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.TenantSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          findMany: {
            args: Prisma.TenantSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>[]
          }
          create: {
            args: Prisma.TenantSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          createMany: {
            args: Prisma.TenantSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.TenantSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          update: {
            args: Prisma.TenantSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.TenantSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.TenantSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantSubscription>
          }
          groupBy: {
            args: Prisma.TenantSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<TenantSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      BillingTransaction: {
        payload: Prisma.$BillingTransactionPayload<ExtArgs>
        fields: Prisma.BillingTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload>
          }
          findFirst: {
            args: Prisma.BillingTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload>
          }
          findMany: {
            args: Prisma.BillingTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload>[]
          }
          create: {
            args: Prisma.BillingTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload>
          }
          createMany: {
            args: Prisma.BillingTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingTransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload>[]
          }
          delete: {
            args: Prisma.BillingTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload>
          }
          update: {
            args: Prisma.BillingTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload>
          }
          deleteMany: {
            args: Prisma.BillingTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BillingTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingTransactionPayload>
          }
          aggregate: {
            args: Prisma.BillingTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingTransaction>
          }
          groupBy: {
            args: Prisma.BillingTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<BillingTransactionCountAggregateOutputType> | number
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
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    SharedCatalog: number
    PendingProductAdditions: number
    TenantSubscriptions: number
    BillingTransactions: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    SharedCatalog?: boolean | TenantCountOutputTypeCountSharedCatalogArgs
    PendingProductAdditions?: boolean | TenantCountOutputTypeCountPendingProductAdditionsArgs
    TenantSubscriptions?: boolean | TenantCountOutputTypeCountTenantSubscriptionsArgs
    BillingTransactions?: boolean | TenantCountOutputTypeCountBillingTransactionsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountSharedCatalogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SharedCatalogWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountPendingProductAdditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingProductAdditionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountTenantSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSubscriptionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountBillingTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingTransactionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    storeName: string | null
    subdomain: string | null
    databaseUrl: string | null
    adminEmail: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    storeName: string | null
    subdomain: string | null
    databaseUrl: string | null
    adminEmail: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    storeName: number
    subdomain: number
    databaseUrl: number
    adminEmail: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    storeName?: true
    subdomain?: true
    databaseUrl?: true
    adminEmail?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    storeName?: true
    subdomain?: true
    databaseUrl?: true
    adminEmail?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    storeName?: true
    subdomain?: true
    databaseUrl?: true
    adminEmail?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeName?: boolean
    subdomain?: boolean
    databaseUrl?: boolean
    adminEmail?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    SharedCatalog?: boolean | Tenant$SharedCatalogArgs<ExtArgs>
    PendingProductAdditions?: boolean | Tenant$PendingProductAdditionsArgs<ExtArgs>
    TenantSubscriptions?: boolean | Tenant$TenantSubscriptionsArgs<ExtArgs>
    BillingTransactions?: boolean | Tenant$BillingTransactionsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeName?: boolean
    subdomain?: boolean
    databaseUrl?: boolean
    adminEmail?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    storeName?: boolean
    subdomain?: boolean
    databaseUrl?: boolean
    adminEmail?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    SharedCatalog?: boolean | Tenant$SharedCatalogArgs<ExtArgs>
    PendingProductAdditions?: boolean | Tenant$PendingProductAdditionsArgs<ExtArgs>
    TenantSubscriptions?: boolean | Tenant$TenantSubscriptionsArgs<ExtArgs>
    BillingTransactions?: boolean | Tenant$BillingTransactionsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      SharedCatalog: Prisma.$SharedCatalogPayload<ExtArgs>[]
      PendingProductAdditions: Prisma.$PendingProductAdditionPayload<ExtArgs>[]
      TenantSubscriptions: Prisma.$TenantSubscriptionPayload<ExtArgs>[]
      BillingTransactions: Prisma.$BillingTransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeName: string
      subdomain: string
      databaseUrl: string
      adminEmail: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
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
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    SharedCatalog<T extends Tenant$SharedCatalogArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$SharedCatalogArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "findMany"> | Null>
    PendingProductAdditions<T extends Tenant$PendingProductAdditionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$PendingProductAdditionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "findMany"> | Null>
    TenantSubscriptions<T extends Tenant$TenantSubscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$TenantSubscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findMany"> | Null>
    BillingTransactions<T extends Tenant$BillingTransactionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$BillingTransactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Tenant model
   */ 
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly storeName: FieldRef<"Tenant", 'String'>
    readonly subdomain: FieldRef<"Tenant", 'String'>
    readonly databaseUrl: FieldRef<"Tenant", 'String'>
    readonly adminEmail: FieldRef<"Tenant", 'String'>
    readonly isActive: FieldRef<"Tenant", 'Boolean'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
  }

  /**
   * Tenant.SharedCatalog
   */
  export type Tenant$SharedCatalogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    where?: SharedCatalogWhereInput
    orderBy?: SharedCatalogOrderByWithRelationInput | SharedCatalogOrderByWithRelationInput[]
    cursor?: SharedCatalogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SharedCatalogScalarFieldEnum | SharedCatalogScalarFieldEnum[]
  }

  /**
   * Tenant.PendingProductAdditions
   */
  export type Tenant$PendingProductAdditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    where?: PendingProductAdditionWhereInput
    orderBy?: PendingProductAdditionOrderByWithRelationInput | PendingProductAdditionOrderByWithRelationInput[]
    cursor?: PendingProductAdditionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PendingProductAdditionScalarFieldEnum | PendingProductAdditionScalarFieldEnum[]
  }

  /**
   * Tenant.TenantSubscriptions
   */
  export type Tenant$TenantSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    where?: TenantSubscriptionWhereInput
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    cursor?: TenantSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * Tenant.BillingTransactions
   */
  export type Tenant$BillingTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    where?: BillingTransactionWhereInput
    orderBy?: BillingTransactionOrderByWithRelationInput | BillingTransactionOrderByWithRelationInput[]
    cursor?: BillingTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingTransactionScalarFieldEnum | BillingTransactionScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model SharedCatalog
   */

  export type AggregateSharedCatalog = {
    _count: SharedCatalogCountAggregateOutputType | null
    _avg: SharedCatalogAvgAggregateOutputType | null
    _sum: SharedCatalogSumAggregateOutputType | null
    _min: SharedCatalogMinAggregateOutputType | null
    _max: SharedCatalogMaxAggregateOutputType | null
  }

  export type SharedCatalogAvgAggregateOutputType = {
    basePrice: Decimal | null
  }

  export type SharedCatalogSumAggregateOutputType = {
    basePrice: Decimal | null
  }

  export type SharedCatalogMinAggregateOutputType = {
    sku: string | null
    productName: string | null
    category: string | null
    description: string | null
    basePrice: Decimal | null
    imageUrl: string | null
    aiEnrichedAt: Date | null
    syncedAt: Date | null
    tenantId: string | null
  }

  export type SharedCatalogMaxAggregateOutputType = {
    sku: string | null
    productName: string | null
    category: string | null
    description: string | null
    basePrice: Decimal | null
    imageUrl: string | null
    aiEnrichedAt: Date | null
    syncedAt: Date | null
    tenantId: string | null
  }

  export type SharedCatalogCountAggregateOutputType = {
    sku: number
    productName: number
    category: number
    description: number
    basePrice: number
    imageUrl: number
    aiEnrichedAt: number
    syncedAt: number
    tenantId: number
    _all: number
  }


  export type SharedCatalogAvgAggregateInputType = {
    basePrice?: true
  }

  export type SharedCatalogSumAggregateInputType = {
    basePrice?: true
  }

  export type SharedCatalogMinAggregateInputType = {
    sku?: true
    productName?: true
    category?: true
    description?: true
    basePrice?: true
    imageUrl?: true
    aiEnrichedAt?: true
    syncedAt?: true
    tenantId?: true
  }

  export type SharedCatalogMaxAggregateInputType = {
    sku?: true
    productName?: true
    category?: true
    description?: true
    basePrice?: true
    imageUrl?: true
    aiEnrichedAt?: true
    syncedAt?: true
    tenantId?: true
  }

  export type SharedCatalogCountAggregateInputType = {
    sku?: true
    productName?: true
    category?: true
    description?: true
    basePrice?: true
    imageUrl?: true
    aiEnrichedAt?: true
    syncedAt?: true
    tenantId?: true
    _all?: true
  }

  export type SharedCatalogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SharedCatalog to aggregate.
     */
    where?: SharedCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedCatalogs to fetch.
     */
    orderBy?: SharedCatalogOrderByWithRelationInput | SharedCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SharedCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SharedCatalogs
    **/
    _count?: true | SharedCatalogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SharedCatalogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SharedCatalogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SharedCatalogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SharedCatalogMaxAggregateInputType
  }

  export type GetSharedCatalogAggregateType<T extends SharedCatalogAggregateArgs> = {
        [P in keyof T & keyof AggregateSharedCatalog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSharedCatalog[P]>
      : GetScalarType<T[P], AggregateSharedCatalog[P]>
  }




  export type SharedCatalogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SharedCatalogWhereInput
    orderBy?: SharedCatalogOrderByWithAggregationInput | SharedCatalogOrderByWithAggregationInput[]
    by: SharedCatalogScalarFieldEnum[] | SharedCatalogScalarFieldEnum
    having?: SharedCatalogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SharedCatalogCountAggregateInputType | true
    _avg?: SharedCatalogAvgAggregateInputType
    _sum?: SharedCatalogSumAggregateInputType
    _min?: SharedCatalogMinAggregateInputType
    _max?: SharedCatalogMaxAggregateInputType
  }

  export type SharedCatalogGroupByOutputType = {
    sku: string
    productName: string
    category: string | null
    description: string | null
    basePrice: Decimal
    imageUrl: string | null
    aiEnrichedAt: Date | null
    syncedAt: Date
    tenantId: string
    _count: SharedCatalogCountAggregateOutputType | null
    _avg: SharedCatalogAvgAggregateOutputType | null
    _sum: SharedCatalogSumAggregateOutputType | null
    _min: SharedCatalogMinAggregateOutputType | null
    _max: SharedCatalogMaxAggregateOutputType | null
  }

  type GetSharedCatalogGroupByPayload<T extends SharedCatalogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SharedCatalogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SharedCatalogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SharedCatalogGroupByOutputType[P]>
            : GetScalarType<T[P], SharedCatalogGroupByOutputType[P]>
        }
      >
    >


  export type SharedCatalogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sku?: boolean
    productName?: boolean
    category?: boolean
    description?: boolean
    basePrice?: boolean
    imageUrl?: boolean
    aiEnrichedAt?: boolean
    syncedAt?: boolean
    tenantId?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sharedCatalog"]>

  export type SharedCatalogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sku?: boolean
    productName?: boolean
    category?: boolean
    description?: boolean
    basePrice?: boolean
    imageUrl?: boolean
    aiEnrichedAt?: boolean
    syncedAt?: boolean
    tenantId?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sharedCatalog"]>

  export type SharedCatalogSelectScalar = {
    sku?: boolean
    productName?: boolean
    category?: boolean
    description?: boolean
    basePrice?: boolean
    imageUrl?: boolean
    aiEnrichedAt?: boolean
    syncedAt?: boolean
    tenantId?: boolean
  }

  export type SharedCatalogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type SharedCatalogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $SharedCatalogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SharedCatalog"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      sku: string
      productName: string
      category: string | null
      description: string | null
      basePrice: Prisma.Decimal
      imageUrl: string | null
      aiEnrichedAt: Date | null
      syncedAt: Date
      tenantId: string
    }, ExtArgs["result"]["sharedCatalog"]>
    composites: {}
  }

  type SharedCatalogGetPayload<S extends boolean | null | undefined | SharedCatalogDefaultArgs> = $Result.GetResult<Prisma.$SharedCatalogPayload, S>

  type SharedCatalogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SharedCatalogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SharedCatalogCountAggregateInputType | true
    }

  export interface SharedCatalogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SharedCatalog'], meta: { name: 'SharedCatalog' } }
    /**
     * Find zero or one SharedCatalog that matches the filter.
     * @param {SharedCatalogFindUniqueArgs} args - Arguments to find a SharedCatalog
     * @example
     * // Get one SharedCatalog
     * const sharedCatalog = await prisma.sharedCatalog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SharedCatalogFindUniqueArgs>(args: SelectSubset<T, SharedCatalogFindUniqueArgs<ExtArgs>>): Prisma__SharedCatalogClient<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SharedCatalog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SharedCatalogFindUniqueOrThrowArgs} args - Arguments to find a SharedCatalog
     * @example
     * // Get one SharedCatalog
     * const sharedCatalog = await prisma.sharedCatalog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SharedCatalogFindUniqueOrThrowArgs>(args: SelectSubset<T, SharedCatalogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SharedCatalogClient<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SharedCatalog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedCatalogFindFirstArgs} args - Arguments to find a SharedCatalog
     * @example
     * // Get one SharedCatalog
     * const sharedCatalog = await prisma.sharedCatalog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SharedCatalogFindFirstArgs>(args?: SelectSubset<T, SharedCatalogFindFirstArgs<ExtArgs>>): Prisma__SharedCatalogClient<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SharedCatalog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedCatalogFindFirstOrThrowArgs} args - Arguments to find a SharedCatalog
     * @example
     * // Get one SharedCatalog
     * const sharedCatalog = await prisma.sharedCatalog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SharedCatalogFindFirstOrThrowArgs>(args?: SelectSubset<T, SharedCatalogFindFirstOrThrowArgs<ExtArgs>>): Prisma__SharedCatalogClient<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SharedCatalogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedCatalogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SharedCatalogs
     * const sharedCatalogs = await prisma.sharedCatalog.findMany()
     * 
     * // Get first 10 SharedCatalogs
     * const sharedCatalogs = await prisma.sharedCatalog.findMany({ take: 10 })
     * 
     * // Only select the `sku`
     * const sharedCatalogWithSkuOnly = await prisma.sharedCatalog.findMany({ select: { sku: true } })
     * 
     */
    findMany<T extends SharedCatalogFindManyArgs>(args?: SelectSubset<T, SharedCatalogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SharedCatalog.
     * @param {SharedCatalogCreateArgs} args - Arguments to create a SharedCatalog.
     * @example
     * // Create one SharedCatalog
     * const SharedCatalog = await prisma.sharedCatalog.create({
     *   data: {
     *     // ... data to create a SharedCatalog
     *   }
     * })
     * 
     */
    create<T extends SharedCatalogCreateArgs>(args: SelectSubset<T, SharedCatalogCreateArgs<ExtArgs>>): Prisma__SharedCatalogClient<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SharedCatalogs.
     * @param {SharedCatalogCreateManyArgs} args - Arguments to create many SharedCatalogs.
     * @example
     * // Create many SharedCatalogs
     * const sharedCatalog = await prisma.sharedCatalog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SharedCatalogCreateManyArgs>(args?: SelectSubset<T, SharedCatalogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SharedCatalogs and returns the data saved in the database.
     * @param {SharedCatalogCreateManyAndReturnArgs} args - Arguments to create many SharedCatalogs.
     * @example
     * // Create many SharedCatalogs
     * const sharedCatalog = await prisma.sharedCatalog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SharedCatalogs and only return the `sku`
     * const sharedCatalogWithSkuOnly = await prisma.sharedCatalog.createManyAndReturn({ 
     *   select: { sku: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SharedCatalogCreateManyAndReturnArgs>(args?: SelectSubset<T, SharedCatalogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SharedCatalog.
     * @param {SharedCatalogDeleteArgs} args - Arguments to delete one SharedCatalog.
     * @example
     * // Delete one SharedCatalog
     * const SharedCatalog = await prisma.sharedCatalog.delete({
     *   where: {
     *     // ... filter to delete one SharedCatalog
     *   }
     * })
     * 
     */
    delete<T extends SharedCatalogDeleteArgs>(args: SelectSubset<T, SharedCatalogDeleteArgs<ExtArgs>>): Prisma__SharedCatalogClient<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SharedCatalog.
     * @param {SharedCatalogUpdateArgs} args - Arguments to update one SharedCatalog.
     * @example
     * // Update one SharedCatalog
     * const sharedCatalog = await prisma.sharedCatalog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SharedCatalogUpdateArgs>(args: SelectSubset<T, SharedCatalogUpdateArgs<ExtArgs>>): Prisma__SharedCatalogClient<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SharedCatalogs.
     * @param {SharedCatalogDeleteManyArgs} args - Arguments to filter SharedCatalogs to delete.
     * @example
     * // Delete a few SharedCatalogs
     * const { count } = await prisma.sharedCatalog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SharedCatalogDeleteManyArgs>(args?: SelectSubset<T, SharedCatalogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SharedCatalogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedCatalogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SharedCatalogs
     * const sharedCatalog = await prisma.sharedCatalog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SharedCatalogUpdateManyArgs>(args: SelectSubset<T, SharedCatalogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SharedCatalog.
     * @param {SharedCatalogUpsertArgs} args - Arguments to update or create a SharedCatalog.
     * @example
     * // Update or create a SharedCatalog
     * const sharedCatalog = await prisma.sharedCatalog.upsert({
     *   create: {
     *     // ... data to create a SharedCatalog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SharedCatalog we want to update
     *   }
     * })
     */
    upsert<T extends SharedCatalogUpsertArgs>(args: SelectSubset<T, SharedCatalogUpsertArgs<ExtArgs>>): Prisma__SharedCatalogClient<$Result.GetResult<Prisma.$SharedCatalogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SharedCatalogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedCatalogCountArgs} args - Arguments to filter SharedCatalogs to count.
     * @example
     * // Count the number of SharedCatalogs
     * const count = await prisma.sharedCatalog.count({
     *   where: {
     *     // ... the filter for the SharedCatalogs we want to count
     *   }
     * })
    **/
    count<T extends SharedCatalogCountArgs>(
      args?: Subset<T, SharedCatalogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SharedCatalogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SharedCatalog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedCatalogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SharedCatalogAggregateArgs>(args: Subset<T, SharedCatalogAggregateArgs>): Prisma.PrismaPromise<GetSharedCatalogAggregateType<T>>

    /**
     * Group by SharedCatalog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedCatalogGroupByArgs} args - Group by arguments.
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
      T extends SharedCatalogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SharedCatalogGroupByArgs['orderBy'] }
        : { orderBy?: SharedCatalogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SharedCatalogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSharedCatalogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SharedCatalog model
   */
  readonly fields: SharedCatalogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SharedCatalog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SharedCatalogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the SharedCatalog model
   */ 
  interface SharedCatalogFieldRefs {
    readonly sku: FieldRef<"SharedCatalog", 'String'>
    readonly productName: FieldRef<"SharedCatalog", 'String'>
    readonly category: FieldRef<"SharedCatalog", 'String'>
    readonly description: FieldRef<"SharedCatalog", 'String'>
    readonly basePrice: FieldRef<"SharedCatalog", 'Decimal'>
    readonly imageUrl: FieldRef<"SharedCatalog", 'String'>
    readonly aiEnrichedAt: FieldRef<"SharedCatalog", 'DateTime'>
    readonly syncedAt: FieldRef<"SharedCatalog", 'DateTime'>
    readonly tenantId: FieldRef<"SharedCatalog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SharedCatalog findUnique
   */
  export type SharedCatalogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * Filter, which SharedCatalog to fetch.
     */
    where: SharedCatalogWhereUniqueInput
  }

  /**
   * SharedCatalog findUniqueOrThrow
   */
  export type SharedCatalogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * Filter, which SharedCatalog to fetch.
     */
    where: SharedCatalogWhereUniqueInput
  }

  /**
   * SharedCatalog findFirst
   */
  export type SharedCatalogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * Filter, which SharedCatalog to fetch.
     */
    where?: SharedCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedCatalogs to fetch.
     */
    orderBy?: SharedCatalogOrderByWithRelationInput | SharedCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SharedCatalogs.
     */
    cursor?: SharedCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedCatalogs.
     */
    distinct?: SharedCatalogScalarFieldEnum | SharedCatalogScalarFieldEnum[]
  }

  /**
   * SharedCatalog findFirstOrThrow
   */
  export type SharedCatalogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * Filter, which SharedCatalog to fetch.
     */
    where?: SharedCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedCatalogs to fetch.
     */
    orderBy?: SharedCatalogOrderByWithRelationInput | SharedCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SharedCatalogs.
     */
    cursor?: SharedCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedCatalogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedCatalogs.
     */
    distinct?: SharedCatalogScalarFieldEnum | SharedCatalogScalarFieldEnum[]
  }

  /**
   * SharedCatalog findMany
   */
  export type SharedCatalogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * Filter, which SharedCatalogs to fetch.
     */
    where?: SharedCatalogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedCatalogs to fetch.
     */
    orderBy?: SharedCatalogOrderByWithRelationInput | SharedCatalogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SharedCatalogs.
     */
    cursor?: SharedCatalogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedCatalogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedCatalogs.
     */
    skip?: number
    distinct?: SharedCatalogScalarFieldEnum | SharedCatalogScalarFieldEnum[]
  }

  /**
   * SharedCatalog create
   */
  export type SharedCatalogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * The data needed to create a SharedCatalog.
     */
    data: XOR<SharedCatalogCreateInput, SharedCatalogUncheckedCreateInput>
  }

  /**
   * SharedCatalog createMany
   */
  export type SharedCatalogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SharedCatalogs.
     */
    data: SharedCatalogCreateManyInput | SharedCatalogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SharedCatalog createManyAndReturn
   */
  export type SharedCatalogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SharedCatalogs.
     */
    data: SharedCatalogCreateManyInput | SharedCatalogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SharedCatalog update
   */
  export type SharedCatalogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * The data needed to update a SharedCatalog.
     */
    data: XOR<SharedCatalogUpdateInput, SharedCatalogUncheckedUpdateInput>
    /**
     * Choose, which SharedCatalog to update.
     */
    where: SharedCatalogWhereUniqueInput
  }

  /**
   * SharedCatalog updateMany
   */
  export type SharedCatalogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SharedCatalogs.
     */
    data: XOR<SharedCatalogUpdateManyMutationInput, SharedCatalogUncheckedUpdateManyInput>
    /**
     * Filter which SharedCatalogs to update
     */
    where?: SharedCatalogWhereInput
  }

  /**
   * SharedCatalog upsert
   */
  export type SharedCatalogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * The filter to search for the SharedCatalog to update in case it exists.
     */
    where: SharedCatalogWhereUniqueInput
    /**
     * In case the SharedCatalog found by the `where` argument doesn't exist, create a new SharedCatalog with this data.
     */
    create: XOR<SharedCatalogCreateInput, SharedCatalogUncheckedCreateInput>
    /**
     * In case the SharedCatalog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SharedCatalogUpdateInput, SharedCatalogUncheckedUpdateInput>
  }

  /**
   * SharedCatalog delete
   */
  export type SharedCatalogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
    /**
     * Filter which SharedCatalog to delete.
     */
    where: SharedCatalogWhereUniqueInput
  }

  /**
   * SharedCatalog deleteMany
   */
  export type SharedCatalogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SharedCatalogs to delete
     */
    where?: SharedCatalogWhereInput
  }

  /**
   * SharedCatalog without action
   */
  export type SharedCatalogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedCatalog
     */
    select?: SharedCatalogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedCatalogInclude<ExtArgs> | null
  }


  /**
   * Model SuperAdmin
   */

  export type AggregateSuperAdmin = {
    _count: SuperAdminCountAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  export type SuperAdminMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SuperAdminMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SuperAdminCountAggregateOutputType = {
    id: number
    email: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SuperAdminMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SuperAdminMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SuperAdminCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SuperAdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmin to aggregate.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SuperAdmins
    **/
    _count?: true | SuperAdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SuperAdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SuperAdminMaxAggregateInputType
  }

  export type GetSuperAdminAggregateType<T extends SuperAdminAggregateArgs> = {
        [P in keyof T & keyof AggregateSuperAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuperAdmin[P]>
      : GetScalarType<T[P], AggregateSuperAdmin[P]>
  }




  export type SuperAdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuperAdminWhereInput
    orderBy?: SuperAdminOrderByWithAggregationInput | SuperAdminOrderByWithAggregationInput[]
    by: SuperAdminScalarFieldEnum[] | SuperAdminScalarFieldEnum
    having?: SuperAdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuperAdminCountAggregateInputType | true
    _min?: SuperAdminMinAggregateInputType
    _max?: SuperAdminMaxAggregateInputType
  }

  export type SuperAdminGroupByOutputType = {
    id: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
    _count: SuperAdminCountAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  type GetSuperAdminGroupByPayload<T extends SuperAdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuperAdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SuperAdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
            : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
        }
      >
    >


  export type SuperAdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SuperAdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SuperAdmin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["superAdmin"]>
    composites: {}
  }

  type SuperAdminGetPayload<S extends boolean | null | undefined | SuperAdminDefaultArgs> = $Result.GetResult<Prisma.$SuperAdminPayload, S>

  type SuperAdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SuperAdminFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SuperAdminCountAggregateInputType | true
    }

  export interface SuperAdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuperAdmin'], meta: { name: 'SuperAdmin' } }
    /**
     * Find zero or one SuperAdmin that matches the filter.
     * @param {SuperAdminFindUniqueArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SuperAdminFindUniqueArgs>(args: SelectSubset<T, SuperAdminFindUniqueArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SuperAdmin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SuperAdminFindUniqueOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SuperAdminFindUniqueOrThrowArgs>(args: SelectSubset<T, SuperAdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SuperAdmin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SuperAdminFindFirstArgs>(args?: SelectSubset<T, SuperAdminFindFirstArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SuperAdmin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SuperAdminFindFirstOrThrowArgs>(args?: SelectSubset<T, SuperAdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SuperAdmins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany()
     * 
     * // Get first 10 SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SuperAdminFindManyArgs>(args?: SelectSubset<T, SuperAdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SuperAdmin.
     * @param {SuperAdminCreateArgs} args - Arguments to create a SuperAdmin.
     * @example
     * // Create one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.create({
     *   data: {
     *     // ... data to create a SuperAdmin
     *   }
     * })
     * 
     */
    create<T extends SuperAdminCreateArgs>(args: SelectSubset<T, SuperAdminCreateArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SuperAdmins.
     * @param {SuperAdminCreateManyArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SuperAdminCreateManyArgs>(args?: SelectSubset<T, SuperAdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SuperAdmins and returns the data saved in the database.
     * @param {SuperAdminCreateManyAndReturnArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SuperAdmins and only return the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SuperAdminCreateManyAndReturnArgs>(args?: SelectSubset<T, SuperAdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SuperAdmin.
     * @param {SuperAdminDeleteArgs} args - Arguments to delete one SuperAdmin.
     * @example
     * // Delete one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.delete({
     *   where: {
     *     // ... filter to delete one SuperAdmin
     *   }
     * })
     * 
     */
    delete<T extends SuperAdminDeleteArgs>(args: SelectSubset<T, SuperAdminDeleteArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SuperAdmin.
     * @param {SuperAdminUpdateArgs} args - Arguments to update one SuperAdmin.
     * @example
     * // Update one SuperAdmin
     * const superAdmin = await prisma.superAdmin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SuperAdminUpdateArgs>(args: SelectSubset<T, SuperAdminUpdateArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SuperAdmins.
     * @param {SuperAdminDeleteManyArgs} args - Arguments to filter SuperAdmins to delete.
     * @example
     * // Delete a few SuperAdmins
     * const { count } = await prisma.superAdmin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SuperAdminDeleteManyArgs>(args?: SelectSubset<T, SuperAdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuperAdmins
     * const superAdmin = await prisma.superAdmin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SuperAdminUpdateManyArgs>(args: SelectSubset<T, SuperAdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SuperAdmin.
     * @param {SuperAdminUpsertArgs} args - Arguments to update or create a SuperAdmin.
     * @example
     * // Update or create a SuperAdmin
     * const superAdmin = await prisma.superAdmin.upsert({
     *   create: {
     *     // ... data to create a SuperAdmin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuperAdmin we want to update
     *   }
     * })
     */
    upsert<T extends SuperAdminUpsertArgs>(args: SelectSubset<T, SuperAdminUpsertArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminCountArgs} args - Arguments to filter SuperAdmins to count.
     * @example
     * // Count the number of SuperAdmins
     * const count = await prisma.superAdmin.count({
     *   where: {
     *     // ... the filter for the SuperAdmins we want to count
     *   }
     * })
    **/
    count<T extends SuperAdminCountArgs>(
      args?: Subset<T, SuperAdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuperAdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SuperAdminAggregateArgs>(args: Subset<T, SuperAdminAggregateArgs>): Prisma.PrismaPromise<GetSuperAdminAggregateType<T>>

    /**
     * Group by SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminGroupByArgs} args - Group by arguments.
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
      T extends SuperAdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuperAdminGroupByArgs['orderBy'] }
        : { orderBy?: SuperAdminGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SuperAdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuperAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SuperAdmin model
   */
  readonly fields: SuperAdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuperAdmin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuperAdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SuperAdmin model
   */ 
  interface SuperAdminFieldRefs {
    readonly id: FieldRef<"SuperAdmin", 'String'>
    readonly email: FieldRef<"SuperAdmin", 'String'>
    readonly password: FieldRef<"SuperAdmin", 'String'>
    readonly createdAt: FieldRef<"SuperAdmin", 'DateTime'>
    readonly updatedAt: FieldRef<"SuperAdmin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SuperAdmin findUnique
   */
  export type SuperAdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findUniqueOrThrow
   */
  export type SuperAdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findFirst
   */
  export type SuperAdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findFirstOrThrow
   */
  export type SuperAdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findMany
   */
  export type SuperAdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmins to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin create
   */
  export type SuperAdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * The data needed to create a SuperAdmin.
     */
    data: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
  }

  /**
   * SuperAdmin createMany
   */
  export type SuperAdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin createManyAndReturn
   */
  export type SuperAdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin update
   */
  export type SuperAdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * The data needed to update a SuperAdmin.
     */
    data: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
    /**
     * Choose, which SuperAdmin to update.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin updateMany
   */
  export type SuperAdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuperAdmins.
     */
    data: XOR<SuperAdminUpdateManyMutationInput, SuperAdminUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdmins to update
     */
    where?: SuperAdminWhereInput
  }

  /**
   * SuperAdmin upsert
   */
  export type SuperAdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * The filter to search for the SuperAdmin to update in case it exists.
     */
    where: SuperAdminWhereUniqueInput
    /**
     * In case the SuperAdmin found by the `where` argument doesn't exist, create a new SuperAdmin with this data.
     */
    create: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
    /**
     * In case the SuperAdmin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
  }

  /**
   * SuperAdmin delete
   */
  export type SuperAdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter which SuperAdmin to delete.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin deleteMany
   */
  export type SuperAdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmins to delete
     */
    where?: SuperAdminWhereInput
  }

  /**
   * SuperAdmin without action
   */
  export type SuperAdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
  }


  /**
   * Model PendingProductAddition
   */

  export type AggregatePendingProductAddition = {
    _count: PendingProductAdditionCountAggregateOutputType | null
    _avg: PendingProductAdditionAvgAggregateOutputType | null
    _sum: PendingProductAdditionSumAggregateOutputType | null
    _min: PendingProductAdditionMinAggregateOutputType | null
    _max: PendingProductAdditionMaxAggregateOutputType | null
  }

  export type PendingProductAdditionAvgAggregateOutputType = {
    aiConfidenceScore: number | null
  }

  export type PendingProductAdditionSumAggregateOutputType = {
    aiConfidenceScore: number | null
  }

  export type PendingProductAdditionMinAggregateOutputType = {
    id: string | null
    productName: string | null
    upcEanCode: string | null
    brandName: string | null
    categoryName: string | null
    descriptionText: string | null
    imageUrl: string | null
    aiConfidenceScore: number | null
    addedByUserId: string | null
    tenantId: string | null
    status: string | null
    suggestedMatchProductId: string | null
    createdAt: Date | null
  }

  export type PendingProductAdditionMaxAggregateOutputType = {
    id: string | null
    productName: string | null
    upcEanCode: string | null
    brandName: string | null
    categoryName: string | null
    descriptionText: string | null
    imageUrl: string | null
    aiConfidenceScore: number | null
    addedByUserId: string | null
    tenantId: string | null
    status: string | null
    suggestedMatchProductId: string | null
    createdAt: Date | null
  }

  export type PendingProductAdditionCountAggregateOutputType = {
    id: number
    productName: number
    upcEanCode: number
    brandName: number
    categoryName: number
    descriptionText: number
    imageUrl: number
    aiConfidenceScore: number
    addedByUserId: number
    tenantId: number
    status: number
    suggestedMatchProductId: number
    createdAt: number
    _all: number
  }


  export type PendingProductAdditionAvgAggregateInputType = {
    aiConfidenceScore?: true
  }

  export type PendingProductAdditionSumAggregateInputType = {
    aiConfidenceScore?: true
  }

  export type PendingProductAdditionMinAggregateInputType = {
    id?: true
    productName?: true
    upcEanCode?: true
    brandName?: true
    categoryName?: true
    descriptionText?: true
    imageUrl?: true
    aiConfidenceScore?: true
    addedByUserId?: true
    tenantId?: true
    status?: true
    suggestedMatchProductId?: true
    createdAt?: true
  }

  export type PendingProductAdditionMaxAggregateInputType = {
    id?: true
    productName?: true
    upcEanCode?: true
    brandName?: true
    categoryName?: true
    descriptionText?: true
    imageUrl?: true
    aiConfidenceScore?: true
    addedByUserId?: true
    tenantId?: true
    status?: true
    suggestedMatchProductId?: true
    createdAt?: true
  }

  export type PendingProductAdditionCountAggregateInputType = {
    id?: true
    productName?: true
    upcEanCode?: true
    brandName?: true
    categoryName?: true
    descriptionText?: true
    imageUrl?: true
    aiConfidenceScore?: true
    addedByUserId?: true
    tenantId?: true
    status?: true
    suggestedMatchProductId?: true
    createdAt?: true
    _all?: true
  }

  export type PendingProductAdditionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingProductAddition to aggregate.
     */
    where?: PendingProductAdditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingProductAdditions to fetch.
     */
    orderBy?: PendingProductAdditionOrderByWithRelationInput | PendingProductAdditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PendingProductAdditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingProductAdditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingProductAdditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PendingProductAdditions
    **/
    _count?: true | PendingProductAdditionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PendingProductAdditionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PendingProductAdditionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PendingProductAdditionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PendingProductAdditionMaxAggregateInputType
  }

  export type GetPendingProductAdditionAggregateType<T extends PendingProductAdditionAggregateArgs> = {
        [P in keyof T & keyof AggregatePendingProductAddition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePendingProductAddition[P]>
      : GetScalarType<T[P], AggregatePendingProductAddition[P]>
  }




  export type PendingProductAdditionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingProductAdditionWhereInput
    orderBy?: PendingProductAdditionOrderByWithAggregationInput | PendingProductAdditionOrderByWithAggregationInput[]
    by: PendingProductAdditionScalarFieldEnum[] | PendingProductAdditionScalarFieldEnum
    having?: PendingProductAdditionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PendingProductAdditionCountAggregateInputType | true
    _avg?: PendingProductAdditionAvgAggregateInputType
    _sum?: PendingProductAdditionSumAggregateInputType
    _min?: PendingProductAdditionMinAggregateInputType
    _max?: PendingProductAdditionMaxAggregateInputType
  }

  export type PendingProductAdditionGroupByOutputType = {
    id: string
    productName: string
    upcEanCode: string
    brandName: string
    categoryName: string
    descriptionText: string | null
    imageUrl: string | null
    aiConfidenceScore: number
    addedByUserId: string
    tenantId: string
    status: string
    suggestedMatchProductId: string | null
    createdAt: Date
    _count: PendingProductAdditionCountAggregateOutputType | null
    _avg: PendingProductAdditionAvgAggregateOutputType | null
    _sum: PendingProductAdditionSumAggregateOutputType | null
    _min: PendingProductAdditionMinAggregateOutputType | null
    _max: PendingProductAdditionMaxAggregateOutputType | null
  }

  type GetPendingProductAdditionGroupByPayload<T extends PendingProductAdditionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PendingProductAdditionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PendingProductAdditionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PendingProductAdditionGroupByOutputType[P]>
            : GetScalarType<T[P], PendingProductAdditionGroupByOutputType[P]>
        }
      >
    >


  export type PendingProductAdditionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productName?: boolean
    upcEanCode?: boolean
    brandName?: boolean
    categoryName?: boolean
    descriptionText?: boolean
    imageUrl?: boolean
    aiConfidenceScore?: boolean
    addedByUserId?: boolean
    tenantId?: boolean
    status?: boolean
    suggestedMatchProductId?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pendingProductAddition"]>

  export type PendingProductAdditionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productName?: boolean
    upcEanCode?: boolean
    brandName?: boolean
    categoryName?: boolean
    descriptionText?: boolean
    imageUrl?: boolean
    aiConfidenceScore?: boolean
    addedByUserId?: boolean
    tenantId?: boolean
    status?: boolean
    suggestedMatchProductId?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pendingProductAddition"]>

  export type PendingProductAdditionSelectScalar = {
    id?: boolean
    productName?: boolean
    upcEanCode?: boolean
    brandName?: boolean
    categoryName?: boolean
    descriptionText?: boolean
    imageUrl?: boolean
    aiConfidenceScore?: boolean
    addedByUserId?: boolean
    tenantId?: boolean
    status?: boolean
    suggestedMatchProductId?: boolean
    createdAt?: boolean
  }

  export type PendingProductAdditionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type PendingProductAdditionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $PendingProductAdditionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PendingProductAddition"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productName: string
      upcEanCode: string
      brandName: string
      categoryName: string
      descriptionText: string | null
      imageUrl: string | null
      aiConfidenceScore: number
      addedByUserId: string
      tenantId: string
      status: string
      suggestedMatchProductId: string | null
      createdAt: Date
    }, ExtArgs["result"]["pendingProductAddition"]>
    composites: {}
  }

  type PendingProductAdditionGetPayload<S extends boolean | null | undefined | PendingProductAdditionDefaultArgs> = $Result.GetResult<Prisma.$PendingProductAdditionPayload, S>

  type PendingProductAdditionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PendingProductAdditionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PendingProductAdditionCountAggregateInputType | true
    }

  export interface PendingProductAdditionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PendingProductAddition'], meta: { name: 'PendingProductAddition' } }
    /**
     * Find zero or one PendingProductAddition that matches the filter.
     * @param {PendingProductAdditionFindUniqueArgs} args - Arguments to find a PendingProductAddition
     * @example
     * // Get one PendingProductAddition
     * const pendingProductAddition = await prisma.pendingProductAddition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PendingProductAdditionFindUniqueArgs>(args: SelectSubset<T, PendingProductAdditionFindUniqueArgs<ExtArgs>>): Prisma__PendingProductAdditionClient<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PendingProductAddition that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PendingProductAdditionFindUniqueOrThrowArgs} args - Arguments to find a PendingProductAddition
     * @example
     * // Get one PendingProductAddition
     * const pendingProductAddition = await prisma.pendingProductAddition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PendingProductAdditionFindUniqueOrThrowArgs>(args: SelectSubset<T, PendingProductAdditionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PendingProductAdditionClient<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PendingProductAddition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductAdditionFindFirstArgs} args - Arguments to find a PendingProductAddition
     * @example
     * // Get one PendingProductAddition
     * const pendingProductAddition = await prisma.pendingProductAddition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PendingProductAdditionFindFirstArgs>(args?: SelectSubset<T, PendingProductAdditionFindFirstArgs<ExtArgs>>): Prisma__PendingProductAdditionClient<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PendingProductAddition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductAdditionFindFirstOrThrowArgs} args - Arguments to find a PendingProductAddition
     * @example
     * // Get one PendingProductAddition
     * const pendingProductAddition = await prisma.pendingProductAddition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PendingProductAdditionFindFirstOrThrowArgs>(args?: SelectSubset<T, PendingProductAdditionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PendingProductAdditionClient<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PendingProductAdditions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductAdditionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PendingProductAdditions
     * const pendingProductAdditions = await prisma.pendingProductAddition.findMany()
     * 
     * // Get first 10 PendingProductAdditions
     * const pendingProductAdditions = await prisma.pendingProductAddition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pendingProductAdditionWithIdOnly = await prisma.pendingProductAddition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PendingProductAdditionFindManyArgs>(args?: SelectSubset<T, PendingProductAdditionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PendingProductAddition.
     * @param {PendingProductAdditionCreateArgs} args - Arguments to create a PendingProductAddition.
     * @example
     * // Create one PendingProductAddition
     * const PendingProductAddition = await prisma.pendingProductAddition.create({
     *   data: {
     *     // ... data to create a PendingProductAddition
     *   }
     * })
     * 
     */
    create<T extends PendingProductAdditionCreateArgs>(args: SelectSubset<T, PendingProductAdditionCreateArgs<ExtArgs>>): Prisma__PendingProductAdditionClient<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PendingProductAdditions.
     * @param {PendingProductAdditionCreateManyArgs} args - Arguments to create many PendingProductAdditions.
     * @example
     * // Create many PendingProductAdditions
     * const pendingProductAddition = await prisma.pendingProductAddition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PendingProductAdditionCreateManyArgs>(args?: SelectSubset<T, PendingProductAdditionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PendingProductAdditions and returns the data saved in the database.
     * @param {PendingProductAdditionCreateManyAndReturnArgs} args - Arguments to create many PendingProductAdditions.
     * @example
     * // Create many PendingProductAdditions
     * const pendingProductAddition = await prisma.pendingProductAddition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PendingProductAdditions and only return the `id`
     * const pendingProductAdditionWithIdOnly = await prisma.pendingProductAddition.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PendingProductAdditionCreateManyAndReturnArgs>(args?: SelectSubset<T, PendingProductAdditionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PendingProductAddition.
     * @param {PendingProductAdditionDeleteArgs} args - Arguments to delete one PendingProductAddition.
     * @example
     * // Delete one PendingProductAddition
     * const PendingProductAddition = await prisma.pendingProductAddition.delete({
     *   where: {
     *     // ... filter to delete one PendingProductAddition
     *   }
     * })
     * 
     */
    delete<T extends PendingProductAdditionDeleteArgs>(args: SelectSubset<T, PendingProductAdditionDeleteArgs<ExtArgs>>): Prisma__PendingProductAdditionClient<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PendingProductAddition.
     * @param {PendingProductAdditionUpdateArgs} args - Arguments to update one PendingProductAddition.
     * @example
     * // Update one PendingProductAddition
     * const pendingProductAddition = await prisma.pendingProductAddition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PendingProductAdditionUpdateArgs>(args: SelectSubset<T, PendingProductAdditionUpdateArgs<ExtArgs>>): Prisma__PendingProductAdditionClient<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PendingProductAdditions.
     * @param {PendingProductAdditionDeleteManyArgs} args - Arguments to filter PendingProductAdditions to delete.
     * @example
     * // Delete a few PendingProductAdditions
     * const { count } = await prisma.pendingProductAddition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PendingProductAdditionDeleteManyArgs>(args?: SelectSubset<T, PendingProductAdditionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingProductAdditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductAdditionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PendingProductAdditions
     * const pendingProductAddition = await prisma.pendingProductAddition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PendingProductAdditionUpdateManyArgs>(args: SelectSubset<T, PendingProductAdditionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PendingProductAddition.
     * @param {PendingProductAdditionUpsertArgs} args - Arguments to update or create a PendingProductAddition.
     * @example
     * // Update or create a PendingProductAddition
     * const pendingProductAddition = await prisma.pendingProductAddition.upsert({
     *   create: {
     *     // ... data to create a PendingProductAddition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PendingProductAddition we want to update
     *   }
     * })
     */
    upsert<T extends PendingProductAdditionUpsertArgs>(args: SelectSubset<T, PendingProductAdditionUpsertArgs<ExtArgs>>): Prisma__PendingProductAdditionClient<$Result.GetResult<Prisma.$PendingProductAdditionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PendingProductAdditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductAdditionCountArgs} args - Arguments to filter PendingProductAdditions to count.
     * @example
     * // Count the number of PendingProductAdditions
     * const count = await prisma.pendingProductAddition.count({
     *   where: {
     *     // ... the filter for the PendingProductAdditions we want to count
     *   }
     * })
    **/
    count<T extends PendingProductAdditionCountArgs>(
      args?: Subset<T, PendingProductAdditionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PendingProductAdditionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PendingProductAddition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductAdditionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PendingProductAdditionAggregateArgs>(args: Subset<T, PendingProductAdditionAggregateArgs>): Prisma.PrismaPromise<GetPendingProductAdditionAggregateType<T>>

    /**
     * Group by PendingProductAddition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingProductAdditionGroupByArgs} args - Group by arguments.
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
      T extends PendingProductAdditionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PendingProductAdditionGroupByArgs['orderBy'] }
        : { orderBy?: PendingProductAdditionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PendingProductAdditionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPendingProductAdditionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PendingProductAddition model
   */
  readonly fields: PendingProductAdditionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PendingProductAddition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PendingProductAdditionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the PendingProductAddition model
   */ 
  interface PendingProductAdditionFieldRefs {
    readonly id: FieldRef<"PendingProductAddition", 'String'>
    readonly productName: FieldRef<"PendingProductAddition", 'String'>
    readonly upcEanCode: FieldRef<"PendingProductAddition", 'String'>
    readonly brandName: FieldRef<"PendingProductAddition", 'String'>
    readonly categoryName: FieldRef<"PendingProductAddition", 'String'>
    readonly descriptionText: FieldRef<"PendingProductAddition", 'String'>
    readonly imageUrl: FieldRef<"PendingProductAddition", 'String'>
    readonly aiConfidenceScore: FieldRef<"PendingProductAddition", 'Float'>
    readonly addedByUserId: FieldRef<"PendingProductAddition", 'String'>
    readonly tenantId: FieldRef<"PendingProductAddition", 'String'>
    readonly status: FieldRef<"PendingProductAddition", 'String'>
    readonly suggestedMatchProductId: FieldRef<"PendingProductAddition", 'String'>
    readonly createdAt: FieldRef<"PendingProductAddition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PendingProductAddition findUnique
   */
  export type PendingProductAdditionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * Filter, which PendingProductAddition to fetch.
     */
    where: PendingProductAdditionWhereUniqueInput
  }

  /**
   * PendingProductAddition findUniqueOrThrow
   */
  export type PendingProductAdditionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * Filter, which PendingProductAddition to fetch.
     */
    where: PendingProductAdditionWhereUniqueInput
  }

  /**
   * PendingProductAddition findFirst
   */
  export type PendingProductAdditionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * Filter, which PendingProductAddition to fetch.
     */
    where?: PendingProductAdditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingProductAdditions to fetch.
     */
    orderBy?: PendingProductAdditionOrderByWithRelationInput | PendingProductAdditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingProductAdditions.
     */
    cursor?: PendingProductAdditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingProductAdditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingProductAdditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingProductAdditions.
     */
    distinct?: PendingProductAdditionScalarFieldEnum | PendingProductAdditionScalarFieldEnum[]
  }

  /**
   * PendingProductAddition findFirstOrThrow
   */
  export type PendingProductAdditionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * Filter, which PendingProductAddition to fetch.
     */
    where?: PendingProductAdditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingProductAdditions to fetch.
     */
    orderBy?: PendingProductAdditionOrderByWithRelationInput | PendingProductAdditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingProductAdditions.
     */
    cursor?: PendingProductAdditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingProductAdditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingProductAdditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingProductAdditions.
     */
    distinct?: PendingProductAdditionScalarFieldEnum | PendingProductAdditionScalarFieldEnum[]
  }

  /**
   * PendingProductAddition findMany
   */
  export type PendingProductAdditionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * Filter, which PendingProductAdditions to fetch.
     */
    where?: PendingProductAdditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingProductAdditions to fetch.
     */
    orderBy?: PendingProductAdditionOrderByWithRelationInput | PendingProductAdditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PendingProductAdditions.
     */
    cursor?: PendingProductAdditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingProductAdditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingProductAdditions.
     */
    skip?: number
    distinct?: PendingProductAdditionScalarFieldEnum | PendingProductAdditionScalarFieldEnum[]
  }

  /**
   * PendingProductAddition create
   */
  export type PendingProductAdditionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * The data needed to create a PendingProductAddition.
     */
    data: XOR<PendingProductAdditionCreateInput, PendingProductAdditionUncheckedCreateInput>
  }

  /**
   * PendingProductAddition createMany
   */
  export type PendingProductAdditionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PendingProductAdditions.
     */
    data: PendingProductAdditionCreateManyInput | PendingProductAdditionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PendingProductAddition createManyAndReturn
   */
  export type PendingProductAdditionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PendingProductAdditions.
     */
    data: PendingProductAdditionCreateManyInput | PendingProductAdditionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PendingProductAddition update
   */
  export type PendingProductAdditionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * The data needed to update a PendingProductAddition.
     */
    data: XOR<PendingProductAdditionUpdateInput, PendingProductAdditionUncheckedUpdateInput>
    /**
     * Choose, which PendingProductAddition to update.
     */
    where: PendingProductAdditionWhereUniqueInput
  }

  /**
   * PendingProductAddition updateMany
   */
  export type PendingProductAdditionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PendingProductAdditions.
     */
    data: XOR<PendingProductAdditionUpdateManyMutationInput, PendingProductAdditionUncheckedUpdateManyInput>
    /**
     * Filter which PendingProductAdditions to update
     */
    where?: PendingProductAdditionWhereInput
  }

  /**
   * PendingProductAddition upsert
   */
  export type PendingProductAdditionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * The filter to search for the PendingProductAddition to update in case it exists.
     */
    where: PendingProductAdditionWhereUniqueInput
    /**
     * In case the PendingProductAddition found by the `where` argument doesn't exist, create a new PendingProductAddition with this data.
     */
    create: XOR<PendingProductAdditionCreateInput, PendingProductAdditionUncheckedCreateInput>
    /**
     * In case the PendingProductAddition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PendingProductAdditionUpdateInput, PendingProductAdditionUncheckedUpdateInput>
  }

  /**
   * PendingProductAddition delete
   */
  export type PendingProductAdditionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
    /**
     * Filter which PendingProductAddition to delete.
     */
    where: PendingProductAdditionWhereUniqueInput
  }

  /**
   * PendingProductAddition deleteMany
   */
  export type PendingProductAdditionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingProductAdditions to delete
     */
    where?: PendingProductAdditionWhereInput
  }

  /**
   * PendingProductAddition without action
   */
  export type PendingProductAdditionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingProductAddition
     */
    select?: PendingProductAdditionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PendingProductAdditionInclude<ExtArgs> | null
  }


  /**
   * Model MasterWebsiteConfig
   */

  export type AggregateMasterWebsiteConfig = {
    _count: MasterWebsiteConfigCountAggregateOutputType | null
    _min: MasterWebsiteConfigMinAggregateOutputType | null
    _max: MasterWebsiteConfigMaxAggregateOutputType | null
  }

  export type MasterWebsiteConfigMinAggregateOutputType = {
    id: string | null
    primaryDomain: string | null
    sslEnabled: boolean | null
    dnsConfigured: boolean | null
    updatedAt: Date | null
  }

  export type MasterWebsiteConfigMaxAggregateOutputType = {
    id: string | null
    primaryDomain: string | null
    sslEnabled: boolean | null
    dnsConfigured: boolean | null
    updatedAt: Date | null
  }

  export type MasterWebsiteConfigCountAggregateOutputType = {
    id: number
    primaryDomain: number
    sslEnabled: number
    dnsConfigured: number
    updatedAt: number
    _all: number
  }


  export type MasterWebsiteConfigMinAggregateInputType = {
    id?: true
    primaryDomain?: true
    sslEnabled?: true
    dnsConfigured?: true
    updatedAt?: true
  }

  export type MasterWebsiteConfigMaxAggregateInputType = {
    id?: true
    primaryDomain?: true
    sslEnabled?: true
    dnsConfigured?: true
    updatedAt?: true
  }

  export type MasterWebsiteConfigCountAggregateInputType = {
    id?: true
    primaryDomain?: true
    sslEnabled?: true
    dnsConfigured?: true
    updatedAt?: true
    _all?: true
  }

  export type MasterWebsiteConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MasterWebsiteConfig to aggregate.
     */
    where?: MasterWebsiteConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterWebsiteConfigs to fetch.
     */
    orderBy?: MasterWebsiteConfigOrderByWithRelationInput | MasterWebsiteConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MasterWebsiteConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterWebsiteConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterWebsiteConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MasterWebsiteConfigs
    **/
    _count?: true | MasterWebsiteConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MasterWebsiteConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MasterWebsiteConfigMaxAggregateInputType
  }

  export type GetMasterWebsiteConfigAggregateType<T extends MasterWebsiteConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateMasterWebsiteConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMasterWebsiteConfig[P]>
      : GetScalarType<T[P], AggregateMasterWebsiteConfig[P]>
  }




  export type MasterWebsiteConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MasterWebsiteConfigWhereInput
    orderBy?: MasterWebsiteConfigOrderByWithAggregationInput | MasterWebsiteConfigOrderByWithAggregationInput[]
    by: MasterWebsiteConfigScalarFieldEnum[] | MasterWebsiteConfigScalarFieldEnum
    having?: MasterWebsiteConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MasterWebsiteConfigCountAggregateInputType | true
    _min?: MasterWebsiteConfigMinAggregateInputType
    _max?: MasterWebsiteConfigMaxAggregateInputType
  }

  export type MasterWebsiteConfigGroupByOutputType = {
    id: string
    primaryDomain: string
    sslEnabled: boolean
    dnsConfigured: boolean
    updatedAt: Date
    _count: MasterWebsiteConfigCountAggregateOutputType | null
    _min: MasterWebsiteConfigMinAggregateOutputType | null
    _max: MasterWebsiteConfigMaxAggregateOutputType | null
  }

  type GetMasterWebsiteConfigGroupByPayload<T extends MasterWebsiteConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MasterWebsiteConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MasterWebsiteConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MasterWebsiteConfigGroupByOutputType[P]>
            : GetScalarType<T[P], MasterWebsiteConfigGroupByOutputType[P]>
        }
      >
    >


  export type MasterWebsiteConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    primaryDomain?: boolean
    sslEnabled?: boolean
    dnsConfigured?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["masterWebsiteConfig"]>

  export type MasterWebsiteConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    primaryDomain?: boolean
    sslEnabled?: boolean
    dnsConfigured?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["masterWebsiteConfig"]>

  export type MasterWebsiteConfigSelectScalar = {
    id?: boolean
    primaryDomain?: boolean
    sslEnabled?: boolean
    dnsConfigured?: boolean
    updatedAt?: boolean
  }


  export type $MasterWebsiteConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MasterWebsiteConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      primaryDomain: string
      sslEnabled: boolean
      dnsConfigured: boolean
      updatedAt: Date
    }, ExtArgs["result"]["masterWebsiteConfig"]>
    composites: {}
  }

  type MasterWebsiteConfigGetPayload<S extends boolean | null | undefined | MasterWebsiteConfigDefaultArgs> = $Result.GetResult<Prisma.$MasterWebsiteConfigPayload, S>

  type MasterWebsiteConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MasterWebsiteConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MasterWebsiteConfigCountAggregateInputType | true
    }

  export interface MasterWebsiteConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MasterWebsiteConfig'], meta: { name: 'MasterWebsiteConfig' } }
    /**
     * Find zero or one MasterWebsiteConfig that matches the filter.
     * @param {MasterWebsiteConfigFindUniqueArgs} args - Arguments to find a MasterWebsiteConfig
     * @example
     * // Get one MasterWebsiteConfig
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MasterWebsiteConfigFindUniqueArgs>(args: SelectSubset<T, MasterWebsiteConfigFindUniqueArgs<ExtArgs>>): Prisma__MasterWebsiteConfigClient<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MasterWebsiteConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MasterWebsiteConfigFindUniqueOrThrowArgs} args - Arguments to find a MasterWebsiteConfig
     * @example
     * // Get one MasterWebsiteConfig
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MasterWebsiteConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, MasterWebsiteConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MasterWebsiteConfigClient<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MasterWebsiteConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterWebsiteConfigFindFirstArgs} args - Arguments to find a MasterWebsiteConfig
     * @example
     * // Get one MasterWebsiteConfig
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MasterWebsiteConfigFindFirstArgs>(args?: SelectSubset<T, MasterWebsiteConfigFindFirstArgs<ExtArgs>>): Prisma__MasterWebsiteConfigClient<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MasterWebsiteConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterWebsiteConfigFindFirstOrThrowArgs} args - Arguments to find a MasterWebsiteConfig
     * @example
     * // Get one MasterWebsiteConfig
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MasterWebsiteConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, MasterWebsiteConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__MasterWebsiteConfigClient<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MasterWebsiteConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterWebsiteConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MasterWebsiteConfigs
     * const masterWebsiteConfigs = await prisma.masterWebsiteConfig.findMany()
     * 
     * // Get first 10 MasterWebsiteConfigs
     * const masterWebsiteConfigs = await prisma.masterWebsiteConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const masterWebsiteConfigWithIdOnly = await prisma.masterWebsiteConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MasterWebsiteConfigFindManyArgs>(args?: SelectSubset<T, MasterWebsiteConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MasterWebsiteConfig.
     * @param {MasterWebsiteConfigCreateArgs} args - Arguments to create a MasterWebsiteConfig.
     * @example
     * // Create one MasterWebsiteConfig
     * const MasterWebsiteConfig = await prisma.masterWebsiteConfig.create({
     *   data: {
     *     // ... data to create a MasterWebsiteConfig
     *   }
     * })
     * 
     */
    create<T extends MasterWebsiteConfigCreateArgs>(args: SelectSubset<T, MasterWebsiteConfigCreateArgs<ExtArgs>>): Prisma__MasterWebsiteConfigClient<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MasterWebsiteConfigs.
     * @param {MasterWebsiteConfigCreateManyArgs} args - Arguments to create many MasterWebsiteConfigs.
     * @example
     * // Create many MasterWebsiteConfigs
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MasterWebsiteConfigCreateManyArgs>(args?: SelectSubset<T, MasterWebsiteConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MasterWebsiteConfigs and returns the data saved in the database.
     * @param {MasterWebsiteConfigCreateManyAndReturnArgs} args - Arguments to create many MasterWebsiteConfigs.
     * @example
     * // Create many MasterWebsiteConfigs
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MasterWebsiteConfigs and only return the `id`
     * const masterWebsiteConfigWithIdOnly = await prisma.masterWebsiteConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MasterWebsiteConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, MasterWebsiteConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MasterWebsiteConfig.
     * @param {MasterWebsiteConfigDeleteArgs} args - Arguments to delete one MasterWebsiteConfig.
     * @example
     * // Delete one MasterWebsiteConfig
     * const MasterWebsiteConfig = await prisma.masterWebsiteConfig.delete({
     *   where: {
     *     // ... filter to delete one MasterWebsiteConfig
     *   }
     * })
     * 
     */
    delete<T extends MasterWebsiteConfigDeleteArgs>(args: SelectSubset<T, MasterWebsiteConfigDeleteArgs<ExtArgs>>): Prisma__MasterWebsiteConfigClient<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MasterWebsiteConfig.
     * @param {MasterWebsiteConfigUpdateArgs} args - Arguments to update one MasterWebsiteConfig.
     * @example
     * // Update one MasterWebsiteConfig
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MasterWebsiteConfigUpdateArgs>(args: SelectSubset<T, MasterWebsiteConfigUpdateArgs<ExtArgs>>): Prisma__MasterWebsiteConfigClient<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MasterWebsiteConfigs.
     * @param {MasterWebsiteConfigDeleteManyArgs} args - Arguments to filter MasterWebsiteConfigs to delete.
     * @example
     * // Delete a few MasterWebsiteConfigs
     * const { count } = await prisma.masterWebsiteConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MasterWebsiteConfigDeleteManyArgs>(args?: SelectSubset<T, MasterWebsiteConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MasterWebsiteConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterWebsiteConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MasterWebsiteConfigs
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MasterWebsiteConfigUpdateManyArgs>(args: SelectSubset<T, MasterWebsiteConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MasterWebsiteConfig.
     * @param {MasterWebsiteConfigUpsertArgs} args - Arguments to update or create a MasterWebsiteConfig.
     * @example
     * // Update or create a MasterWebsiteConfig
     * const masterWebsiteConfig = await prisma.masterWebsiteConfig.upsert({
     *   create: {
     *     // ... data to create a MasterWebsiteConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MasterWebsiteConfig we want to update
     *   }
     * })
     */
    upsert<T extends MasterWebsiteConfigUpsertArgs>(args: SelectSubset<T, MasterWebsiteConfigUpsertArgs<ExtArgs>>): Prisma__MasterWebsiteConfigClient<$Result.GetResult<Prisma.$MasterWebsiteConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MasterWebsiteConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterWebsiteConfigCountArgs} args - Arguments to filter MasterWebsiteConfigs to count.
     * @example
     * // Count the number of MasterWebsiteConfigs
     * const count = await prisma.masterWebsiteConfig.count({
     *   where: {
     *     // ... the filter for the MasterWebsiteConfigs we want to count
     *   }
     * })
    **/
    count<T extends MasterWebsiteConfigCountArgs>(
      args?: Subset<T, MasterWebsiteConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MasterWebsiteConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MasterWebsiteConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterWebsiteConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MasterWebsiteConfigAggregateArgs>(args: Subset<T, MasterWebsiteConfigAggregateArgs>): Prisma.PrismaPromise<GetMasterWebsiteConfigAggregateType<T>>

    /**
     * Group by MasterWebsiteConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterWebsiteConfigGroupByArgs} args - Group by arguments.
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
      T extends MasterWebsiteConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MasterWebsiteConfigGroupByArgs['orderBy'] }
        : { orderBy?: MasterWebsiteConfigGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MasterWebsiteConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMasterWebsiteConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MasterWebsiteConfig model
   */
  readonly fields: MasterWebsiteConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MasterWebsiteConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MasterWebsiteConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MasterWebsiteConfig model
   */ 
  interface MasterWebsiteConfigFieldRefs {
    readonly id: FieldRef<"MasterWebsiteConfig", 'String'>
    readonly primaryDomain: FieldRef<"MasterWebsiteConfig", 'String'>
    readonly sslEnabled: FieldRef<"MasterWebsiteConfig", 'Boolean'>
    readonly dnsConfigured: FieldRef<"MasterWebsiteConfig", 'Boolean'>
    readonly updatedAt: FieldRef<"MasterWebsiteConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MasterWebsiteConfig findUnique
   */
  export type MasterWebsiteConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * Filter, which MasterWebsiteConfig to fetch.
     */
    where: MasterWebsiteConfigWhereUniqueInput
  }

  /**
   * MasterWebsiteConfig findUniqueOrThrow
   */
  export type MasterWebsiteConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * Filter, which MasterWebsiteConfig to fetch.
     */
    where: MasterWebsiteConfigWhereUniqueInput
  }

  /**
   * MasterWebsiteConfig findFirst
   */
  export type MasterWebsiteConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * Filter, which MasterWebsiteConfig to fetch.
     */
    where?: MasterWebsiteConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterWebsiteConfigs to fetch.
     */
    orderBy?: MasterWebsiteConfigOrderByWithRelationInput | MasterWebsiteConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MasterWebsiteConfigs.
     */
    cursor?: MasterWebsiteConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterWebsiteConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterWebsiteConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterWebsiteConfigs.
     */
    distinct?: MasterWebsiteConfigScalarFieldEnum | MasterWebsiteConfigScalarFieldEnum[]
  }

  /**
   * MasterWebsiteConfig findFirstOrThrow
   */
  export type MasterWebsiteConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * Filter, which MasterWebsiteConfig to fetch.
     */
    where?: MasterWebsiteConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterWebsiteConfigs to fetch.
     */
    orderBy?: MasterWebsiteConfigOrderByWithRelationInput | MasterWebsiteConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MasterWebsiteConfigs.
     */
    cursor?: MasterWebsiteConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterWebsiteConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterWebsiteConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterWebsiteConfigs.
     */
    distinct?: MasterWebsiteConfigScalarFieldEnum | MasterWebsiteConfigScalarFieldEnum[]
  }

  /**
   * MasterWebsiteConfig findMany
   */
  export type MasterWebsiteConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * Filter, which MasterWebsiteConfigs to fetch.
     */
    where?: MasterWebsiteConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterWebsiteConfigs to fetch.
     */
    orderBy?: MasterWebsiteConfigOrderByWithRelationInput | MasterWebsiteConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MasterWebsiteConfigs.
     */
    cursor?: MasterWebsiteConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterWebsiteConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterWebsiteConfigs.
     */
    skip?: number
    distinct?: MasterWebsiteConfigScalarFieldEnum | MasterWebsiteConfigScalarFieldEnum[]
  }

  /**
   * MasterWebsiteConfig create
   */
  export type MasterWebsiteConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a MasterWebsiteConfig.
     */
    data: XOR<MasterWebsiteConfigCreateInput, MasterWebsiteConfigUncheckedCreateInput>
  }

  /**
   * MasterWebsiteConfig createMany
   */
  export type MasterWebsiteConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MasterWebsiteConfigs.
     */
    data: MasterWebsiteConfigCreateManyInput | MasterWebsiteConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MasterWebsiteConfig createManyAndReturn
   */
  export type MasterWebsiteConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MasterWebsiteConfigs.
     */
    data: MasterWebsiteConfigCreateManyInput | MasterWebsiteConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MasterWebsiteConfig update
   */
  export type MasterWebsiteConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a MasterWebsiteConfig.
     */
    data: XOR<MasterWebsiteConfigUpdateInput, MasterWebsiteConfigUncheckedUpdateInput>
    /**
     * Choose, which MasterWebsiteConfig to update.
     */
    where: MasterWebsiteConfigWhereUniqueInput
  }

  /**
   * MasterWebsiteConfig updateMany
   */
  export type MasterWebsiteConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MasterWebsiteConfigs.
     */
    data: XOR<MasterWebsiteConfigUpdateManyMutationInput, MasterWebsiteConfigUncheckedUpdateManyInput>
    /**
     * Filter which MasterWebsiteConfigs to update
     */
    where?: MasterWebsiteConfigWhereInput
  }

  /**
   * MasterWebsiteConfig upsert
   */
  export type MasterWebsiteConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the MasterWebsiteConfig to update in case it exists.
     */
    where: MasterWebsiteConfigWhereUniqueInput
    /**
     * In case the MasterWebsiteConfig found by the `where` argument doesn't exist, create a new MasterWebsiteConfig with this data.
     */
    create: XOR<MasterWebsiteConfigCreateInput, MasterWebsiteConfigUncheckedCreateInput>
    /**
     * In case the MasterWebsiteConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MasterWebsiteConfigUpdateInput, MasterWebsiteConfigUncheckedUpdateInput>
  }

  /**
   * MasterWebsiteConfig delete
   */
  export type MasterWebsiteConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
    /**
     * Filter which MasterWebsiteConfig to delete.
     */
    where: MasterWebsiteConfigWhereUniqueInput
  }

  /**
   * MasterWebsiteConfig deleteMany
   */
  export type MasterWebsiteConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MasterWebsiteConfigs to delete
     */
    where?: MasterWebsiteConfigWhereInput
  }

  /**
   * MasterWebsiteConfig without action
   */
  export type MasterWebsiteConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterWebsiteConfig
     */
    select?: MasterWebsiteConfigSelect<ExtArgs> | null
  }


  /**
   * Model TenantSubscription
   */

  export type AggregateTenantSubscription = {
    _count: TenantSubscriptionCountAggregateOutputType | null
    _avg: TenantSubscriptionAvgAggregateOutputType | null
    _sum: TenantSubscriptionSumAggregateOutputType | null
    _min: TenantSubscriptionMinAggregateOutputType | null
    _max: TenantSubscriptionMaxAggregateOutputType | null
  }

  export type TenantSubscriptionAvgAggregateOutputType = {
    monthlyPrice: Decimal | null
  }

  export type TenantSubscriptionSumAggregateOutputType = {
    monthlyPrice: Decimal | null
  }

  export type TenantSubscriptionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planType: string | null
    monthlyPrice: Decimal | null
    status: string | null
    startDate: Date | null
    endDate: Date | null
  }

  export type TenantSubscriptionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planType: string | null
    monthlyPrice: Decimal | null
    status: string | null
    startDate: Date | null
    endDate: Date | null
  }

  export type TenantSubscriptionCountAggregateOutputType = {
    id: number
    tenantId: number
    planType: number
    monthlyPrice: number
    status: number
    startDate: number
    endDate: number
    _all: number
  }


  export type TenantSubscriptionAvgAggregateInputType = {
    monthlyPrice?: true
  }

  export type TenantSubscriptionSumAggregateInputType = {
    monthlyPrice?: true
  }

  export type TenantSubscriptionMinAggregateInputType = {
    id?: true
    tenantId?: true
    planType?: true
    monthlyPrice?: true
    status?: true
    startDate?: true
    endDate?: true
  }

  export type TenantSubscriptionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    planType?: true
    monthlyPrice?: true
    status?: true
    startDate?: true
    endDate?: true
  }

  export type TenantSubscriptionCountAggregateInputType = {
    id?: true
    tenantId?: true
    planType?: true
    monthlyPrice?: true
    status?: true
    startDate?: true
    endDate?: true
    _all?: true
  }

  export type TenantSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantSubscription to aggregate.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantSubscriptions
    **/
    _count?: true | TenantSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantSubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSubscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantSubscriptionMaxAggregateInputType
  }

  export type GetTenantSubscriptionAggregateType<T extends TenantSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantSubscription[P]>
      : GetScalarType<T[P], AggregateTenantSubscription[P]>
  }




  export type TenantSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSubscriptionWhereInput
    orderBy?: TenantSubscriptionOrderByWithAggregationInput | TenantSubscriptionOrderByWithAggregationInput[]
    by: TenantSubscriptionScalarFieldEnum[] | TenantSubscriptionScalarFieldEnum
    having?: TenantSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantSubscriptionCountAggregateInputType | true
    _avg?: TenantSubscriptionAvgAggregateInputType
    _sum?: TenantSubscriptionSumAggregateInputType
    _min?: TenantSubscriptionMinAggregateInputType
    _max?: TenantSubscriptionMaxAggregateInputType
  }

  export type TenantSubscriptionGroupByOutputType = {
    id: string
    tenantId: string
    planType: string
    monthlyPrice: Decimal
    status: string
    startDate: Date
    endDate: Date | null
    _count: TenantSubscriptionCountAggregateOutputType | null
    _avg: TenantSubscriptionAvgAggregateOutputType | null
    _sum: TenantSubscriptionSumAggregateOutputType | null
    _min: TenantSubscriptionMinAggregateOutputType | null
    _max: TenantSubscriptionMaxAggregateOutputType | null
  }

  type GetTenantSubscriptionGroupByPayload<T extends TenantSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], TenantSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type TenantSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planType?: boolean
    monthlyPrice?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSubscription"]>

  export type TenantSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planType?: boolean
    monthlyPrice?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSubscription"]>

  export type TenantSubscriptionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    planType?: boolean
    monthlyPrice?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
  }

  export type TenantSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantSubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantSubscription"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      planType: string
      monthlyPrice: Prisma.Decimal
      status: string
      startDate: Date
      endDate: Date | null
    }, ExtArgs["result"]["tenantSubscription"]>
    composites: {}
  }

  type TenantSubscriptionGetPayload<S extends boolean | null | undefined | TenantSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$TenantSubscriptionPayload, S>

  type TenantSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TenantSubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TenantSubscriptionCountAggregateInputType | true
    }

  export interface TenantSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantSubscription'], meta: { name: 'TenantSubscription' } }
    /**
     * Find zero or one TenantSubscription that matches the filter.
     * @param {TenantSubscriptionFindUniqueArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantSubscriptionFindUniqueArgs>(args: SelectSubset<T, TenantSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TenantSubscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TenantSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TenantSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindFirstArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantSubscriptionFindFirstArgs>(args?: SelectSubset<T, TenantSubscriptionFindFirstArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TenantSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindFirstOrThrowArgs} args - Arguments to find a TenantSubscription
     * @example
     * // Get one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TenantSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantSubscriptions
     * const tenantSubscriptions = await prisma.tenantSubscription.findMany()
     * 
     * // Get first 10 TenantSubscriptions
     * const tenantSubscriptions = await prisma.tenantSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantSubscriptionWithIdOnly = await prisma.tenantSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantSubscriptionFindManyArgs>(args?: SelectSubset<T, TenantSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TenantSubscription.
     * @param {TenantSubscriptionCreateArgs} args - Arguments to create a TenantSubscription.
     * @example
     * // Create one TenantSubscription
     * const TenantSubscription = await prisma.tenantSubscription.create({
     *   data: {
     *     // ... data to create a TenantSubscription
     *   }
     * })
     * 
     */
    create<T extends TenantSubscriptionCreateArgs>(args: SelectSubset<T, TenantSubscriptionCreateArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TenantSubscriptions.
     * @param {TenantSubscriptionCreateManyArgs} args - Arguments to create many TenantSubscriptions.
     * @example
     * // Create many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantSubscriptionCreateManyArgs>(args?: SelectSubset<T, TenantSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantSubscriptions and returns the data saved in the database.
     * @param {TenantSubscriptionCreateManyAndReturnArgs} args - Arguments to create many TenantSubscriptions.
     * @example
     * // Create many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantSubscriptions and only return the `id`
     * const tenantSubscriptionWithIdOnly = await prisma.tenantSubscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TenantSubscription.
     * @param {TenantSubscriptionDeleteArgs} args - Arguments to delete one TenantSubscription.
     * @example
     * // Delete one TenantSubscription
     * const TenantSubscription = await prisma.tenantSubscription.delete({
     *   where: {
     *     // ... filter to delete one TenantSubscription
     *   }
     * })
     * 
     */
    delete<T extends TenantSubscriptionDeleteArgs>(args: SelectSubset<T, TenantSubscriptionDeleteArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TenantSubscription.
     * @param {TenantSubscriptionUpdateArgs} args - Arguments to update one TenantSubscription.
     * @example
     * // Update one TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantSubscriptionUpdateArgs>(args: SelectSubset<T, TenantSubscriptionUpdateArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TenantSubscriptions.
     * @param {TenantSubscriptionDeleteManyArgs} args - Arguments to filter TenantSubscriptions to delete.
     * @example
     * // Delete a few TenantSubscriptions
     * const { count } = await prisma.tenantSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantSubscriptionDeleteManyArgs>(args?: SelectSubset<T, TenantSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantSubscriptions
     * const tenantSubscription = await prisma.tenantSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantSubscriptionUpdateManyArgs>(args: SelectSubset<T, TenantSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantSubscription.
     * @param {TenantSubscriptionUpsertArgs} args - Arguments to update or create a TenantSubscription.
     * @example
     * // Update or create a TenantSubscription
     * const tenantSubscription = await prisma.tenantSubscription.upsert({
     *   create: {
     *     // ... data to create a TenantSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantSubscription we want to update
     *   }
     * })
     */
    upsert<T extends TenantSubscriptionUpsertArgs>(args: SelectSubset<T, TenantSubscriptionUpsertArgs<ExtArgs>>): Prisma__TenantSubscriptionClient<$Result.GetResult<Prisma.$TenantSubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TenantSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionCountArgs} args - Arguments to filter TenantSubscriptions to count.
     * @example
     * // Count the number of TenantSubscriptions
     * const count = await prisma.tenantSubscription.count({
     *   where: {
     *     // ... the filter for the TenantSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends TenantSubscriptionCountArgs>(
      args?: Subset<T, TenantSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TenantSubscriptionAggregateArgs>(args: Subset<T, TenantSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetTenantSubscriptionAggregateType<T>>

    /**
     * Group by TenantSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSubscriptionGroupByArgs} args - Group by arguments.
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
      T extends TenantSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: TenantSubscriptionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TenantSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantSubscription model
   */
  readonly fields: TenantSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the TenantSubscription model
   */ 
  interface TenantSubscriptionFieldRefs {
    readonly id: FieldRef<"TenantSubscription", 'String'>
    readonly tenantId: FieldRef<"TenantSubscription", 'String'>
    readonly planType: FieldRef<"TenantSubscription", 'String'>
    readonly monthlyPrice: FieldRef<"TenantSubscription", 'Decimal'>
    readonly status: FieldRef<"TenantSubscription", 'String'>
    readonly startDate: FieldRef<"TenantSubscription", 'DateTime'>
    readonly endDate: FieldRef<"TenantSubscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantSubscription findUnique
   */
  export type TenantSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription findUniqueOrThrow
   */
  export type TenantSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription findFirst
   */
  export type TenantSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantSubscriptions.
     */
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription findFirstOrThrow
   */
  export type TenantSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscription to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantSubscriptions.
     */
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription findMany
   */
  export type TenantSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSubscriptions to fetch.
     */
    where?: TenantSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSubscriptions to fetch.
     */
    orderBy?: TenantSubscriptionOrderByWithRelationInput | TenantSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantSubscriptions.
     */
    cursor?: TenantSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSubscriptions.
     */
    skip?: number
    distinct?: TenantSubscriptionScalarFieldEnum | TenantSubscriptionScalarFieldEnum[]
  }

  /**
   * TenantSubscription create
   */
  export type TenantSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantSubscription.
     */
    data: XOR<TenantSubscriptionCreateInput, TenantSubscriptionUncheckedCreateInput>
  }

  /**
   * TenantSubscription createMany
   */
  export type TenantSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantSubscriptions.
     */
    data: TenantSubscriptionCreateManyInput | TenantSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantSubscription createManyAndReturn
   */
  export type TenantSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TenantSubscriptions.
     */
    data: TenantSubscriptionCreateManyInput | TenantSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantSubscription update
   */
  export type TenantSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantSubscription.
     */
    data: XOR<TenantSubscriptionUpdateInput, TenantSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which TenantSubscription to update.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription updateMany
   */
  export type TenantSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantSubscriptions.
     */
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which TenantSubscriptions to update
     */
    where?: TenantSubscriptionWhereInput
  }

  /**
   * TenantSubscription upsert
   */
  export type TenantSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantSubscription to update in case it exists.
     */
    where: TenantSubscriptionWhereUniqueInput
    /**
     * In case the TenantSubscription found by the `where` argument doesn't exist, create a new TenantSubscription with this data.
     */
    create: XOR<TenantSubscriptionCreateInput, TenantSubscriptionUncheckedCreateInput>
    /**
     * In case the TenantSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantSubscriptionUpdateInput, TenantSubscriptionUncheckedUpdateInput>
  }

  /**
   * TenantSubscription delete
   */
  export type TenantSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which TenantSubscription to delete.
     */
    where: TenantSubscriptionWhereUniqueInput
  }

  /**
   * TenantSubscription deleteMany
   */
  export type TenantSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantSubscriptions to delete
     */
    where?: TenantSubscriptionWhereInput
  }

  /**
   * TenantSubscription without action
   */
  export type TenantSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSubscription
     */
    select?: TenantSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model BillingTransaction
   */

  export type AggregateBillingTransaction = {
    _count: BillingTransactionCountAggregateOutputType | null
    _avg: BillingTransactionAvgAggregateOutputType | null
    _sum: BillingTransactionSumAggregateOutputType | null
    _min: BillingTransactionMinAggregateOutputType | null
    _max: BillingTransactionMaxAggregateOutputType | null
  }

  export type BillingTransactionAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type BillingTransactionSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type BillingTransactionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    amount: Decimal | null
    transactionDate: Date | null
    status: string | null
    paymentMethod: string | null
    description: string | null
  }

  export type BillingTransactionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    amount: Decimal | null
    transactionDate: Date | null
    status: string | null
    paymentMethod: string | null
    description: string | null
  }

  export type BillingTransactionCountAggregateOutputType = {
    id: number
    tenantId: number
    amount: number
    transactionDate: number
    status: number
    paymentMethod: number
    description: number
    _all: number
  }


  export type BillingTransactionAvgAggregateInputType = {
    amount?: true
  }

  export type BillingTransactionSumAggregateInputType = {
    amount?: true
  }

  export type BillingTransactionMinAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    transactionDate?: true
    status?: true
    paymentMethod?: true
    description?: true
  }

  export type BillingTransactionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    transactionDate?: true
    status?: true
    paymentMethod?: true
    description?: true
  }

  export type BillingTransactionCountAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    transactionDate?: true
    status?: true
    paymentMethod?: true
    description?: true
    _all?: true
  }

  export type BillingTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingTransaction to aggregate.
     */
    where?: BillingTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingTransactions to fetch.
     */
    orderBy?: BillingTransactionOrderByWithRelationInput | BillingTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingTransactions
    **/
    _count?: true | BillingTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingTransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingTransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingTransactionMaxAggregateInputType
  }

  export type GetBillingTransactionAggregateType<T extends BillingTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingTransaction[P]>
      : GetScalarType<T[P], AggregateBillingTransaction[P]>
  }




  export type BillingTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingTransactionWhereInput
    orderBy?: BillingTransactionOrderByWithAggregationInput | BillingTransactionOrderByWithAggregationInput[]
    by: BillingTransactionScalarFieldEnum[] | BillingTransactionScalarFieldEnum
    having?: BillingTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingTransactionCountAggregateInputType | true
    _avg?: BillingTransactionAvgAggregateInputType
    _sum?: BillingTransactionSumAggregateInputType
    _min?: BillingTransactionMinAggregateInputType
    _max?: BillingTransactionMaxAggregateInputType
  }

  export type BillingTransactionGroupByOutputType = {
    id: string
    tenantId: string
    amount: Decimal
    transactionDate: Date
    status: string
    paymentMethod: string
    description: string | null
    _count: BillingTransactionCountAggregateOutputType | null
    _avg: BillingTransactionAvgAggregateOutputType | null
    _sum: BillingTransactionSumAggregateOutputType | null
    _min: BillingTransactionMinAggregateOutputType | null
    _max: BillingTransactionMaxAggregateOutputType | null
  }

  type GetBillingTransactionGroupByPayload<T extends BillingTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], BillingTransactionGroupByOutputType[P]>
        }
      >
    >


  export type BillingTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    transactionDate?: boolean
    status?: boolean
    paymentMethod?: boolean
    description?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingTransaction"]>

  export type BillingTransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    transactionDate?: boolean
    status?: boolean
    paymentMethod?: boolean
    description?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingTransaction"]>

  export type BillingTransactionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    transactionDate?: boolean
    status?: boolean
    paymentMethod?: boolean
    description?: boolean
  }

  export type BillingTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type BillingTransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $BillingTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingTransaction"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      amount: Prisma.Decimal
      transactionDate: Date
      status: string
      paymentMethod: string
      description: string | null
    }, ExtArgs["result"]["billingTransaction"]>
    composites: {}
  }

  type BillingTransactionGetPayload<S extends boolean | null | undefined | BillingTransactionDefaultArgs> = $Result.GetResult<Prisma.$BillingTransactionPayload, S>

  type BillingTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BillingTransactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BillingTransactionCountAggregateInputType | true
    }

  export interface BillingTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingTransaction'], meta: { name: 'BillingTransaction' } }
    /**
     * Find zero or one BillingTransaction that matches the filter.
     * @param {BillingTransactionFindUniqueArgs} args - Arguments to find a BillingTransaction
     * @example
     * // Get one BillingTransaction
     * const billingTransaction = await prisma.billingTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingTransactionFindUniqueArgs>(args: SelectSubset<T, BillingTransactionFindUniqueArgs<ExtArgs>>): Prisma__BillingTransactionClient<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BillingTransaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BillingTransactionFindUniqueOrThrowArgs} args - Arguments to find a BillingTransaction
     * @example
     * // Get one BillingTransaction
     * const billingTransaction = await prisma.billingTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingTransactionClient<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BillingTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingTransactionFindFirstArgs} args - Arguments to find a BillingTransaction
     * @example
     * // Get one BillingTransaction
     * const billingTransaction = await prisma.billingTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingTransactionFindFirstArgs>(args?: SelectSubset<T, BillingTransactionFindFirstArgs<ExtArgs>>): Prisma__BillingTransactionClient<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BillingTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingTransactionFindFirstOrThrowArgs} args - Arguments to find a BillingTransaction
     * @example
     * // Get one BillingTransaction
     * const billingTransaction = await prisma.billingTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingTransactionClient<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BillingTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingTransactions
     * const billingTransactions = await prisma.billingTransaction.findMany()
     * 
     * // Get first 10 BillingTransactions
     * const billingTransactions = await prisma.billingTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingTransactionWithIdOnly = await prisma.billingTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingTransactionFindManyArgs>(args?: SelectSubset<T, BillingTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BillingTransaction.
     * @param {BillingTransactionCreateArgs} args - Arguments to create a BillingTransaction.
     * @example
     * // Create one BillingTransaction
     * const BillingTransaction = await prisma.billingTransaction.create({
     *   data: {
     *     // ... data to create a BillingTransaction
     *   }
     * })
     * 
     */
    create<T extends BillingTransactionCreateArgs>(args: SelectSubset<T, BillingTransactionCreateArgs<ExtArgs>>): Prisma__BillingTransactionClient<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BillingTransactions.
     * @param {BillingTransactionCreateManyArgs} args - Arguments to create many BillingTransactions.
     * @example
     * // Create many BillingTransactions
     * const billingTransaction = await prisma.billingTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingTransactionCreateManyArgs>(args?: SelectSubset<T, BillingTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingTransactions and returns the data saved in the database.
     * @param {BillingTransactionCreateManyAndReturnArgs} args - Arguments to create many BillingTransactions.
     * @example
     * // Create many BillingTransactions
     * const billingTransaction = await prisma.billingTransaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingTransactions and only return the `id`
     * const billingTransactionWithIdOnly = await prisma.billingTransaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingTransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingTransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BillingTransaction.
     * @param {BillingTransactionDeleteArgs} args - Arguments to delete one BillingTransaction.
     * @example
     * // Delete one BillingTransaction
     * const BillingTransaction = await prisma.billingTransaction.delete({
     *   where: {
     *     // ... filter to delete one BillingTransaction
     *   }
     * })
     * 
     */
    delete<T extends BillingTransactionDeleteArgs>(args: SelectSubset<T, BillingTransactionDeleteArgs<ExtArgs>>): Prisma__BillingTransactionClient<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BillingTransaction.
     * @param {BillingTransactionUpdateArgs} args - Arguments to update one BillingTransaction.
     * @example
     * // Update one BillingTransaction
     * const billingTransaction = await prisma.billingTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingTransactionUpdateArgs>(args: SelectSubset<T, BillingTransactionUpdateArgs<ExtArgs>>): Prisma__BillingTransactionClient<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BillingTransactions.
     * @param {BillingTransactionDeleteManyArgs} args - Arguments to filter BillingTransactions to delete.
     * @example
     * // Delete a few BillingTransactions
     * const { count } = await prisma.billingTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingTransactionDeleteManyArgs>(args?: SelectSubset<T, BillingTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingTransactions
     * const billingTransaction = await prisma.billingTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingTransactionUpdateManyArgs>(args: SelectSubset<T, BillingTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BillingTransaction.
     * @param {BillingTransactionUpsertArgs} args - Arguments to update or create a BillingTransaction.
     * @example
     * // Update or create a BillingTransaction
     * const billingTransaction = await prisma.billingTransaction.upsert({
     *   create: {
     *     // ... data to create a BillingTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingTransaction we want to update
     *   }
     * })
     */
    upsert<T extends BillingTransactionUpsertArgs>(args: SelectSubset<T, BillingTransactionUpsertArgs<ExtArgs>>): Prisma__BillingTransactionClient<$Result.GetResult<Prisma.$BillingTransactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BillingTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingTransactionCountArgs} args - Arguments to filter BillingTransactions to count.
     * @example
     * // Count the number of BillingTransactions
     * const count = await prisma.billingTransaction.count({
     *   where: {
     *     // ... the filter for the BillingTransactions we want to count
     *   }
     * })
    **/
    count<T extends BillingTransactionCountArgs>(
      args?: Subset<T, BillingTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BillingTransactionAggregateArgs>(args: Subset<T, BillingTransactionAggregateArgs>): Prisma.PrismaPromise<GetBillingTransactionAggregateType<T>>

    /**
     * Group by BillingTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingTransactionGroupByArgs} args - Group by arguments.
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
      T extends BillingTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingTransactionGroupByArgs['orderBy'] }
        : { orderBy?: BillingTransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BillingTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingTransaction model
   */
  readonly fields: BillingTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the BillingTransaction model
   */ 
  interface BillingTransactionFieldRefs {
    readonly id: FieldRef<"BillingTransaction", 'String'>
    readonly tenantId: FieldRef<"BillingTransaction", 'String'>
    readonly amount: FieldRef<"BillingTransaction", 'Decimal'>
    readonly transactionDate: FieldRef<"BillingTransaction", 'DateTime'>
    readonly status: FieldRef<"BillingTransaction", 'String'>
    readonly paymentMethod: FieldRef<"BillingTransaction", 'String'>
    readonly description: FieldRef<"BillingTransaction", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BillingTransaction findUnique
   */
  export type BillingTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * Filter, which BillingTransaction to fetch.
     */
    where: BillingTransactionWhereUniqueInput
  }

  /**
   * BillingTransaction findUniqueOrThrow
   */
  export type BillingTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * Filter, which BillingTransaction to fetch.
     */
    where: BillingTransactionWhereUniqueInput
  }

  /**
   * BillingTransaction findFirst
   */
  export type BillingTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * Filter, which BillingTransaction to fetch.
     */
    where?: BillingTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingTransactions to fetch.
     */
    orderBy?: BillingTransactionOrderByWithRelationInput | BillingTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingTransactions.
     */
    cursor?: BillingTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingTransactions.
     */
    distinct?: BillingTransactionScalarFieldEnum | BillingTransactionScalarFieldEnum[]
  }

  /**
   * BillingTransaction findFirstOrThrow
   */
  export type BillingTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * Filter, which BillingTransaction to fetch.
     */
    where?: BillingTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingTransactions to fetch.
     */
    orderBy?: BillingTransactionOrderByWithRelationInput | BillingTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingTransactions.
     */
    cursor?: BillingTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingTransactions.
     */
    distinct?: BillingTransactionScalarFieldEnum | BillingTransactionScalarFieldEnum[]
  }

  /**
   * BillingTransaction findMany
   */
  export type BillingTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * Filter, which BillingTransactions to fetch.
     */
    where?: BillingTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingTransactions to fetch.
     */
    orderBy?: BillingTransactionOrderByWithRelationInput | BillingTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingTransactions.
     */
    cursor?: BillingTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingTransactions.
     */
    skip?: number
    distinct?: BillingTransactionScalarFieldEnum | BillingTransactionScalarFieldEnum[]
  }

  /**
   * BillingTransaction create
   */
  export type BillingTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingTransaction.
     */
    data: XOR<BillingTransactionCreateInput, BillingTransactionUncheckedCreateInput>
  }

  /**
   * BillingTransaction createMany
   */
  export type BillingTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingTransactions.
     */
    data: BillingTransactionCreateManyInput | BillingTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingTransaction createManyAndReturn
   */
  export type BillingTransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BillingTransactions.
     */
    data: BillingTransactionCreateManyInput | BillingTransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingTransaction update
   */
  export type BillingTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingTransaction.
     */
    data: XOR<BillingTransactionUpdateInput, BillingTransactionUncheckedUpdateInput>
    /**
     * Choose, which BillingTransaction to update.
     */
    where: BillingTransactionWhereUniqueInput
  }

  /**
   * BillingTransaction updateMany
   */
  export type BillingTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingTransactions.
     */
    data: XOR<BillingTransactionUpdateManyMutationInput, BillingTransactionUncheckedUpdateManyInput>
    /**
     * Filter which BillingTransactions to update
     */
    where?: BillingTransactionWhereInput
  }

  /**
   * BillingTransaction upsert
   */
  export type BillingTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingTransaction to update in case it exists.
     */
    where: BillingTransactionWhereUniqueInput
    /**
     * In case the BillingTransaction found by the `where` argument doesn't exist, create a new BillingTransaction with this data.
     */
    create: XOR<BillingTransactionCreateInput, BillingTransactionUncheckedCreateInput>
    /**
     * In case the BillingTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingTransactionUpdateInput, BillingTransactionUncheckedUpdateInput>
  }

  /**
   * BillingTransaction delete
   */
  export type BillingTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
    /**
     * Filter which BillingTransaction to delete.
     */
    where: BillingTransactionWhereUniqueInput
  }

  /**
   * BillingTransaction deleteMany
   */
  export type BillingTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingTransactions to delete
     */
    where?: BillingTransactionWhereInput
  }

  /**
   * BillingTransaction without action
   */
  export type BillingTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingTransaction
     */
    select?: BillingTransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingTransactionInclude<ExtArgs> | null
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


  export const TenantScalarFieldEnum: {
    id: 'id',
    storeName: 'storeName',
    subdomain: 'subdomain',
    databaseUrl: 'databaseUrl',
    adminEmail: 'adminEmail',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const SharedCatalogScalarFieldEnum: {
    sku: 'sku',
    productName: 'productName',
    category: 'category',
    description: 'description',
    basePrice: 'basePrice',
    imageUrl: 'imageUrl',
    aiEnrichedAt: 'aiEnrichedAt',
    syncedAt: 'syncedAt',
    tenantId: 'tenantId'
  };

  export type SharedCatalogScalarFieldEnum = (typeof SharedCatalogScalarFieldEnum)[keyof typeof SharedCatalogScalarFieldEnum]


  export const SuperAdminScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SuperAdminScalarFieldEnum = (typeof SuperAdminScalarFieldEnum)[keyof typeof SuperAdminScalarFieldEnum]


  export const PendingProductAdditionScalarFieldEnum: {
    id: 'id',
    productName: 'productName',
    upcEanCode: 'upcEanCode',
    brandName: 'brandName',
    categoryName: 'categoryName',
    descriptionText: 'descriptionText',
    imageUrl: 'imageUrl',
    aiConfidenceScore: 'aiConfidenceScore',
    addedByUserId: 'addedByUserId',
    tenantId: 'tenantId',
    status: 'status',
    suggestedMatchProductId: 'suggestedMatchProductId',
    createdAt: 'createdAt'
  };

  export type PendingProductAdditionScalarFieldEnum = (typeof PendingProductAdditionScalarFieldEnum)[keyof typeof PendingProductAdditionScalarFieldEnum]


  export const MasterWebsiteConfigScalarFieldEnum: {
    id: 'id',
    primaryDomain: 'primaryDomain',
    sslEnabled: 'sslEnabled',
    dnsConfigured: 'dnsConfigured',
    updatedAt: 'updatedAt'
  };

  export type MasterWebsiteConfigScalarFieldEnum = (typeof MasterWebsiteConfigScalarFieldEnum)[keyof typeof MasterWebsiteConfigScalarFieldEnum]


  export const TenantSubscriptionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    planType: 'planType',
    monthlyPrice: 'monthlyPrice',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate'
  };

  export type TenantSubscriptionScalarFieldEnum = (typeof TenantSubscriptionScalarFieldEnum)[keyof typeof TenantSubscriptionScalarFieldEnum]


  export const BillingTransactionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    amount: 'amount',
    transactionDate: 'transactionDate',
    status: 'status',
    paymentMethod: 'paymentMethod',
    description: 'description'
  };

  export type BillingTransactionScalarFieldEnum = (typeof BillingTransactionScalarFieldEnum)[keyof typeof BillingTransactionScalarFieldEnum]


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
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    storeName?: StringFilter<"Tenant"> | string
    subdomain?: StringFilter<"Tenant"> | string
    databaseUrl?: StringFilter<"Tenant"> | string
    adminEmail?: StringFilter<"Tenant"> | string
    isActive?: BoolFilter<"Tenant"> | boolean
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    SharedCatalog?: SharedCatalogListRelationFilter
    PendingProductAdditions?: PendingProductAdditionListRelationFilter
    TenantSubscriptions?: TenantSubscriptionListRelationFilter
    BillingTransactions?: BillingTransactionListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrder
    adminEmail?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    SharedCatalog?: SharedCatalogOrderByRelationAggregateInput
    PendingProductAdditions?: PendingProductAdditionOrderByRelationAggregateInput
    TenantSubscriptions?: TenantSubscriptionOrderByRelationAggregateInput
    BillingTransactions?: BillingTransactionOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    subdomain?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    storeName?: StringFilter<"Tenant"> | string
    databaseUrl?: StringFilter<"Tenant"> | string
    adminEmail?: StringFilter<"Tenant"> | string
    isActive?: BoolFilter<"Tenant"> | boolean
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    SharedCatalog?: SharedCatalogListRelationFilter
    PendingProductAdditions?: PendingProductAdditionListRelationFilter
    TenantSubscriptions?: TenantSubscriptionListRelationFilter
    BillingTransactions?: BillingTransactionListRelationFilter
  }, "id" | "subdomain">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrder
    adminEmail?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    storeName?: StringWithAggregatesFilter<"Tenant"> | string
    subdomain?: StringWithAggregatesFilter<"Tenant"> | string
    databaseUrl?: StringWithAggregatesFilter<"Tenant"> | string
    adminEmail?: StringWithAggregatesFilter<"Tenant"> | string
    isActive?: BoolWithAggregatesFilter<"Tenant"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type SharedCatalogWhereInput = {
    AND?: SharedCatalogWhereInput | SharedCatalogWhereInput[]
    OR?: SharedCatalogWhereInput[]
    NOT?: SharedCatalogWhereInput | SharedCatalogWhereInput[]
    sku?: StringFilter<"SharedCatalog"> | string
    productName?: StringFilter<"SharedCatalog"> | string
    category?: StringNullableFilter<"SharedCatalog"> | string | null
    description?: StringNullableFilter<"SharedCatalog"> | string | null
    basePrice?: DecimalFilter<"SharedCatalog"> | Decimal | DecimalJsLike | number | string
    imageUrl?: StringNullableFilter<"SharedCatalog"> | string | null
    aiEnrichedAt?: DateTimeNullableFilter<"SharedCatalog"> | Date | string | null
    syncedAt?: DateTimeFilter<"SharedCatalog"> | Date | string
    tenantId?: StringFilter<"SharedCatalog"> | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type SharedCatalogOrderByWithRelationInput = {
    sku?: SortOrder
    productName?: SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    basePrice?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    aiEnrichedAt?: SortOrderInput | SortOrder
    syncedAt?: SortOrder
    tenantId?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type SharedCatalogWhereUniqueInput = Prisma.AtLeast<{
    sku?: string
    AND?: SharedCatalogWhereInput | SharedCatalogWhereInput[]
    OR?: SharedCatalogWhereInput[]
    NOT?: SharedCatalogWhereInput | SharedCatalogWhereInput[]
    productName?: StringFilter<"SharedCatalog"> | string
    category?: StringNullableFilter<"SharedCatalog"> | string | null
    description?: StringNullableFilter<"SharedCatalog"> | string | null
    basePrice?: DecimalFilter<"SharedCatalog"> | Decimal | DecimalJsLike | number | string
    imageUrl?: StringNullableFilter<"SharedCatalog"> | string | null
    aiEnrichedAt?: DateTimeNullableFilter<"SharedCatalog"> | Date | string | null
    syncedAt?: DateTimeFilter<"SharedCatalog"> | Date | string
    tenantId?: StringFilter<"SharedCatalog"> | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "sku">

  export type SharedCatalogOrderByWithAggregationInput = {
    sku?: SortOrder
    productName?: SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    basePrice?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    aiEnrichedAt?: SortOrderInput | SortOrder
    syncedAt?: SortOrder
    tenantId?: SortOrder
    _count?: SharedCatalogCountOrderByAggregateInput
    _avg?: SharedCatalogAvgOrderByAggregateInput
    _max?: SharedCatalogMaxOrderByAggregateInput
    _min?: SharedCatalogMinOrderByAggregateInput
    _sum?: SharedCatalogSumOrderByAggregateInput
  }

  export type SharedCatalogScalarWhereWithAggregatesInput = {
    AND?: SharedCatalogScalarWhereWithAggregatesInput | SharedCatalogScalarWhereWithAggregatesInput[]
    OR?: SharedCatalogScalarWhereWithAggregatesInput[]
    NOT?: SharedCatalogScalarWhereWithAggregatesInput | SharedCatalogScalarWhereWithAggregatesInput[]
    sku?: StringWithAggregatesFilter<"SharedCatalog"> | string
    productName?: StringWithAggregatesFilter<"SharedCatalog"> | string
    category?: StringNullableWithAggregatesFilter<"SharedCatalog"> | string | null
    description?: StringNullableWithAggregatesFilter<"SharedCatalog"> | string | null
    basePrice?: DecimalWithAggregatesFilter<"SharedCatalog"> | Decimal | DecimalJsLike | number | string
    imageUrl?: StringNullableWithAggregatesFilter<"SharedCatalog"> | string | null
    aiEnrichedAt?: DateTimeNullableWithAggregatesFilter<"SharedCatalog"> | Date | string | null
    syncedAt?: DateTimeWithAggregatesFilter<"SharedCatalog"> | Date | string
    tenantId?: StringWithAggregatesFilter<"SharedCatalog"> | string
  }

  export type SuperAdminWhereInput = {
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    id?: StringFilter<"SuperAdmin"> | string
    email?: StringFilter<"SuperAdmin"> | string
    password?: StringFilter<"SuperAdmin"> | string
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeFilter<"SuperAdmin"> | Date | string
  }

  export type SuperAdminOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SuperAdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    password?: StringFilter<"SuperAdmin"> | string
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeFilter<"SuperAdmin"> | Date | string
  }, "id" | "email">

  export type SuperAdminOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SuperAdminCountOrderByAggregateInput
    _max?: SuperAdminMaxOrderByAggregateInput
    _min?: SuperAdminMinOrderByAggregateInput
  }

  export type SuperAdminScalarWhereWithAggregatesInput = {
    AND?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    OR?: SuperAdminScalarWhereWithAggregatesInput[]
    NOT?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SuperAdmin"> | string
    email?: StringWithAggregatesFilter<"SuperAdmin"> | string
    password?: StringWithAggregatesFilter<"SuperAdmin"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SuperAdmin"> | Date | string
  }

  export type PendingProductAdditionWhereInput = {
    AND?: PendingProductAdditionWhereInput | PendingProductAdditionWhereInput[]
    OR?: PendingProductAdditionWhereInput[]
    NOT?: PendingProductAdditionWhereInput | PendingProductAdditionWhereInput[]
    id?: StringFilter<"PendingProductAddition"> | string
    productName?: StringFilter<"PendingProductAddition"> | string
    upcEanCode?: StringFilter<"PendingProductAddition"> | string
    brandName?: StringFilter<"PendingProductAddition"> | string
    categoryName?: StringFilter<"PendingProductAddition"> | string
    descriptionText?: StringNullableFilter<"PendingProductAddition"> | string | null
    imageUrl?: StringNullableFilter<"PendingProductAddition"> | string | null
    aiConfidenceScore?: FloatFilter<"PendingProductAddition"> | number
    addedByUserId?: StringFilter<"PendingProductAddition"> | string
    tenantId?: StringFilter<"PendingProductAddition"> | string
    status?: StringFilter<"PendingProductAddition"> | string
    suggestedMatchProductId?: StringNullableFilter<"PendingProductAddition"> | string | null
    createdAt?: DateTimeFilter<"PendingProductAddition"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type PendingProductAdditionOrderByWithRelationInput = {
    id?: SortOrder
    productName?: SortOrder
    upcEanCode?: SortOrder
    brandName?: SortOrder
    categoryName?: SortOrder
    descriptionText?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    aiConfidenceScore?: SortOrder
    addedByUserId?: SortOrder
    tenantId?: SortOrder
    status?: SortOrder
    suggestedMatchProductId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type PendingProductAdditionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PendingProductAdditionWhereInput | PendingProductAdditionWhereInput[]
    OR?: PendingProductAdditionWhereInput[]
    NOT?: PendingProductAdditionWhereInput | PendingProductAdditionWhereInput[]
    productName?: StringFilter<"PendingProductAddition"> | string
    upcEanCode?: StringFilter<"PendingProductAddition"> | string
    brandName?: StringFilter<"PendingProductAddition"> | string
    categoryName?: StringFilter<"PendingProductAddition"> | string
    descriptionText?: StringNullableFilter<"PendingProductAddition"> | string | null
    imageUrl?: StringNullableFilter<"PendingProductAddition"> | string | null
    aiConfidenceScore?: FloatFilter<"PendingProductAddition"> | number
    addedByUserId?: StringFilter<"PendingProductAddition"> | string
    tenantId?: StringFilter<"PendingProductAddition"> | string
    status?: StringFilter<"PendingProductAddition"> | string
    suggestedMatchProductId?: StringNullableFilter<"PendingProductAddition"> | string | null
    createdAt?: DateTimeFilter<"PendingProductAddition"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id">

  export type PendingProductAdditionOrderByWithAggregationInput = {
    id?: SortOrder
    productName?: SortOrder
    upcEanCode?: SortOrder
    brandName?: SortOrder
    categoryName?: SortOrder
    descriptionText?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    aiConfidenceScore?: SortOrder
    addedByUserId?: SortOrder
    tenantId?: SortOrder
    status?: SortOrder
    suggestedMatchProductId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PendingProductAdditionCountOrderByAggregateInput
    _avg?: PendingProductAdditionAvgOrderByAggregateInput
    _max?: PendingProductAdditionMaxOrderByAggregateInput
    _min?: PendingProductAdditionMinOrderByAggregateInput
    _sum?: PendingProductAdditionSumOrderByAggregateInput
  }

  export type PendingProductAdditionScalarWhereWithAggregatesInput = {
    AND?: PendingProductAdditionScalarWhereWithAggregatesInput | PendingProductAdditionScalarWhereWithAggregatesInput[]
    OR?: PendingProductAdditionScalarWhereWithAggregatesInput[]
    NOT?: PendingProductAdditionScalarWhereWithAggregatesInput | PendingProductAdditionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PendingProductAddition"> | string
    productName?: StringWithAggregatesFilter<"PendingProductAddition"> | string
    upcEanCode?: StringWithAggregatesFilter<"PendingProductAddition"> | string
    brandName?: StringWithAggregatesFilter<"PendingProductAddition"> | string
    categoryName?: StringWithAggregatesFilter<"PendingProductAddition"> | string
    descriptionText?: StringNullableWithAggregatesFilter<"PendingProductAddition"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"PendingProductAddition"> | string | null
    aiConfidenceScore?: FloatWithAggregatesFilter<"PendingProductAddition"> | number
    addedByUserId?: StringWithAggregatesFilter<"PendingProductAddition"> | string
    tenantId?: StringWithAggregatesFilter<"PendingProductAddition"> | string
    status?: StringWithAggregatesFilter<"PendingProductAddition"> | string
    suggestedMatchProductId?: StringNullableWithAggregatesFilter<"PendingProductAddition"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PendingProductAddition"> | Date | string
  }

  export type MasterWebsiteConfigWhereInput = {
    AND?: MasterWebsiteConfigWhereInput | MasterWebsiteConfigWhereInput[]
    OR?: MasterWebsiteConfigWhereInput[]
    NOT?: MasterWebsiteConfigWhereInput | MasterWebsiteConfigWhereInput[]
    id?: StringFilter<"MasterWebsiteConfig"> | string
    primaryDomain?: StringFilter<"MasterWebsiteConfig"> | string
    sslEnabled?: BoolFilter<"MasterWebsiteConfig"> | boolean
    dnsConfigured?: BoolFilter<"MasterWebsiteConfig"> | boolean
    updatedAt?: DateTimeFilter<"MasterWebsiteConfig"> | Date | string
  }

  export type MasterWebsiteConfigOrderByWithRelationInput = {
    id?: SortOrder
    primaryDomain?: SortOrder
    sslEnabled?: SortOrder
    dnsConfigured?: SortOrder
    updatedAt?: SortOrder
  }

  export type MasterWebsiteConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MasterWebsiteConfigWhereInput | MasterWebsiteConfigWhereInput[]
    OR?: MasterWebsiteConfigWhereInput[]
    NOT?: MasterWebsiteConfigWhereInput | MasterWebsiteConfigWhereInput[]
    primaryDomain?: StringFilter<"MasterWebsiteConfig"> | string
    sslEnabled?: BoolFilter<"MasterWebsiteConfig"> | boolean
    dnsConfigured?: BoolFilter<"MasterWebsiteConfig"> | boolean
    updatedAt?: DateTimeFilter<"MasterWebsiteConfig"> | Date | string
  }, "id">

  export type MasterWebsiteConfigOrderByWithAggregationInput = {
    id?: SortOrder
    primaryDomain?: SortOrder
    sslEnabled?: SortOrder
    dnsConfigured?: SortOrder
    updatedAt?: SortOrder
    _count?: MasterWebsiteConfigCountOrderByAggregateInput
    _max?: MasterWebsiteConfigMaxOrderByAggregateInput
    _min?: MasterWebsiteConfigMinOrderByAggregateInput
  }

  export type MasterWebsiteConfigScalarWhereWithAggregatesInput = {
    AND?: MasterWebsiteConfigScalarWhereWithAggregatesInput | MasterWebsiteConfigScalarWhereWithAggregatesInput[]
    OR?: MasterWebsiteConfigScalarWhereWithAggregatesInput[]
    NOT?: MasterWebsiteConfigScalarWhereWithAggregatesInput | MasterWebsiteConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MasterWebsiteConfig"> | string
    primaryDomain?: StringWithAggregatesFilter<"MasterWebsiteConfig"> | string
    sslEnabled?: BoolWithAggregatesFilter<"MasterWebsiteConfig"> | boolean
    dnsConfigured?: BoolWithAggregatesFilter<"MasterWebsiteConfig"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"MasterWebsiteConfig"> | Date | string
  }

  export type TenantSubscriptionWhereInput = {
    AND?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    OR?: TenantSubscriptionWhereInput[]
    NOT?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    id?: StringFilter<"TenantSubscription"> | string
    tenantId?: StringFilter<"TenantSubscription"> | string
    planType?: StringFilter<"TenantSubscription"> | string
    monthlyPrice?: DecimalFilter<"TenantSubscription"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"TenantSubscription"> | string
    startDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    endDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type TenantSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planType?: SortOrder
    monthlyPrice?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    OR?: TenantSubscriptionWhereInput[]
    NOT?: TenantSubscriptionWhereInput | TenantSubscriptionWhereInput[]
    tenantId?: StringFilter<"TenantSubscription"> | string
    planType?: StringFilter<"TenantSubscription"> | string
    monthlyPrice?: DecimalFilter<"TenantSubscription"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"TenantSubscription"> | string
    startDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    endDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id">

  export type TenantSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planType?: SortOrder
    monthlyPrice?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    _count?: TenantSubscriptionCountOrderByAggregateInput
    _avg?: TenantSubscriptionAvgOrderByAggregateInput
    _max?: TenantSubscriptionMaxOrderByAggregateInput
    _min?: TenantSubscriptionMinOrderByAggregateInput
    _sum?: TenantSubscriptionSumOrderByAggregateInput
  }

  export type TenantSubscriptionScalarWhereWithAggregatesInput = {
    AND?: TenantSubscriptionScalarWhereWithAggregatesInput | TenantSubscriptionScalarWhereWithAggregatesInput[]
    OR?: TenantSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: TenantSubscriptionScalarWhereWithAggregatesInput | TenantSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantSubscription"> | string
    tenantId?: StringWithAggregatesFilter<"TenantSubscription"> | string
    planType?: StringWithAggregatesFilter<"TenantSubscription"> | string
    monthlyPrice?: DecimalWithAggregatesFilter<"TenantSubscription"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"TenantSubscription"> | string
    startDate?: DateTimeWithAggregatesFilter<"TenantSubscription"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"TenantSubscription"> | Date | string | null
  }

  export type BillingTransactionWhereInput = {
    AND?: BillingTransactionWhereInput | BillingTransactionWhereInput[]
    OR?: BillingTransactionWhereInput[]
    NOT?: BillingTransactionWhereInput | BillingTransactionWhereInput[]
    id?: StringFilter<"BillingTransaction"> | string
    tenantId?: StringFilter<"BillingTransaction"> | string
    amount?: DecimalFilter<"BillingTransaction"> | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFilter<"BillingTransaction"> | Date | string
    status?: StringFilter<"BillingTransaction"> | string
    paymentMethod?: StringFilter<"BillingTransaction"> | string
    description?: StringNullableFilter<"BillingTransaction"> | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type BillingTransactionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    transactionDate?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type BillingTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingTransactionWhereInput | BillingTransactionWhereInput[]
    OR?: BillingTransactionWhereInput[]
    NOT?: BillingTransactionWhereInput | BillingTransactionWhereInput[]
    tenantId?: StringFilter<"BillingTransaction"> | string
    amount?: DecimalFilter<"BillingTransaction"> | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFilter<"BillingTransaction"> | Date | string
    status?: StringFilter<"BillingTransaction"> | string
    paymentMethod?: StringFilter<"BillingTransaction"> | string
    description?: StringNullableFilter<"BillingTransaction"> | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id">

  export type BillingTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    transactionDate?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: BillingTransactionCountOrderByAggregateInput
    _avg?: BillingTransactionAvgOrderByAggregateInput
    _max?: BillingTransactionMaxOrderByAggregateInput
    _min?: BillingTransactionMinOrderByAggregateInput
    _sum?: BillingTransactionSumOrderByAggregateInput
  }

  export type BillingTransactionScalarWhereWithAggregatesInput = {
    AND?: BillingTransactionScalarWhereWithAggregatesInput | BillingTransactionScalarWhereWithAggregatesInput[]
    OR?: BillingTransactionScalarWhereWithAggregatesInput[]
    NOT?: BillingTransactionScalarWhereWithAggregatesInput | BillingTransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingTransaction"> | string
    tenantId?: StringWithAggregatesFilter<"BillingTransaction"> | string
    amount?: DecimalWithAggregatesFilter<"BillingTransaction"> | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeWithAggregatesFilter<"BillingTransaction"> | Date | string
    status?: StringWithAggregatesFilter<"BillingTransaction"> | string
    paymentMethod?: StringWithAggregatesFilter<"BillingTransaction"> | string
    description?: StringNullableWithAggregatesFilter<"BillingTransaction"> | string | null
  }

  export type TenantCreateInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SharedCatalog?: SharedCatalogCreateNestedManyWithoutTenantInput
    PendingProductAdditions?: PendingProductAdditionCreateNestedManyWithoutTenantInput
    TenantSubscriptions?: TenantSubscriptionCreateNestedManyWithoutTenantInput
    BillingTransactions?: BillingTransactionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SharedCatalog?: SharedCatalogUncheckedCreateNestedManyWithoutTenantInput
    PendingProductAdditions?: PendingProductAdditionUncheckedCreateNestedManyWithoutTenantInput
    TenantSubscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
    BillingTransactions?: BillingTransactionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SharedCatalog?: SharedCatalogUpdateManyWithoutTenantNestedInput
    PendingProductAdditions?: PendingProductAdditionUpdateManyWithoutTenantNestedInput
    TenantSubscriptions?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
    BillingTransactions?: BillingTransactionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SharedCatalog?: SharedCatalogUncheckedUpdateManyWithoutTenantNestedInput
    PendingProductAdditions?: PendingProductAdditionUncheckedUpdateManyWithoutTenantNestedInput
    TenantSubscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    BillingTransactions?: BillingTransactionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedCatalogCreateInput = {
    sku: string
    productName: string
    category?: string | null
    description?: string | null
    basePrice: Decimal | DecimalJsLike | number | string
    imageUrl?: string | null
    aiEnrichedAt?: Date | string | null
    syncedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSharedCatalogInput
  }

  export type SharedCatalogUncheckedCreateInput = {
    sku: string
    productName: string
    category?: string | null
    description?: string | null
    basePrice: Decimal | DecimalJsLike | number | string
    imageUrl?: string | null
    aiEnrichedAt?: Date | string | null
    syncedAt?: Date | string
    tenantId: string
  }

  export type SharedCatalogUpdateInput = {
    sku?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSharedCatalogNestedInput
  }

  export type SharedCatalogUncheckedUpdateInput = {
    sku?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type SharedCatalogCreateManyInput = {
    sku: string
    productName: string
    category?: string | null
    description?: string | null
    basePrice: Decimal | DecimalJsLike | number | string
    imageUrl?: string | null
    aiEnrichedAt?: Date | string | null
    syncedAt?: Date | string
    tenantId: string
  }

  export type SharedCatalogUpdateManyMutationInput = {
    sku?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedCatalogUncheckedUpdateManyInput = {
    sku?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
  }

  export type SuperAdminCreateInput = {
    id?: string
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminCreateManyInput = {
    id?: string
    email: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingProductAdditionCreateInput = {
    id?: string
    productName: string
    upcEanCode: string
    brandName: string
    categoryName: string
    descriptionText?: string | null
    imageUrl?: string | null
    aiConfidenceScore: number
    addedByUserId: string
    status?: string
    suggestedMatchProductId?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutPendingProductAdditionsInput
  }

  export type PendingProductAdditionUncheckedCreateInput = {
    id?: string
    productName: string
    upcEanCode: string
    brandName: string
    categoryName: string
    descriptionText?: string | null
    imageUrl?: string | null
    aiConfidenceScore: number
    addedByUserId: string
    tenantId: string
    status?: string
    suggestedMatchProductId?: string | null
    createdAt?: Date | string
  }

  export type PendingProductAdditionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    upcEanCode?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    categoryName?: StringFieldUpdateOperationsInput | string
    descriptionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidenceScore?: FloatFieldUpdateOperationsInput | number
    addedByUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    suggestedMatchProductId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutPendingProductAdditionsNestedInput
  }

  export type PendingProductAdditionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    upcEanCode?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    categoryName?: StringFieldUpdateOperationsInput | string
    descriptionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidenceScore?: FloatFieldUpdateOperationsInput | number
    addedByUserId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    suggestedMatchProductId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingProductAdditionCreateManyInput = {
    id?: string
    productName: string
    upcEanCode: string
    brandName: string
    categoryName: string
    descriptionText?: string | null
    imageUrl?: string | null
    aiConfidenceScore: number
    addedByUserId: string
    tenantId: string
    status?: string
    suggestedMatchProductId?: string | null
    createdAt?: Date | string
  }

  export type PendingProductAdditionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    upcEanCode?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    categoryName?: StringFieldUpdateOperationsInput | string
    descriptionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidenceScore?: FloatFieldUpdateOperationsInput | number
    addedByUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    suggestedMatchProductId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingProductAdditionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    upcEanCode?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    categoryName?: StringFieldUpdateOperationsInput | string
    descriptionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidenceScore?: FloatFieldUpdateOperationsInput | number
    addedByUserId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    suggestedMatchProductId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterWebsiteConfigCreateInput = {
    id?: string
    primaryDomain?: string
    sslEnabled?: boolean
    dnsConfigured?: boolean
    updatedAt?: Date | string
  }

  export type MasterWebsiteConfigUncheckedCreateInput = {
    id?: string
    primaryDomain?: string
    sslEnabled?: boolean
    dnsConfigured?: boolean
    updatedAt?: Date | string
  }

  export type MasterWebsiteConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryDomain?: StringFieldUpdateOperationsInput | string
    sslEnabled?: BoolFieldUpdateOperationsInput | boolean
    dnsConfigured?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterWebsiteConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryDomain?: StringFieldUpdateOperationsInput | string
    sslEnabled?: BoolFieldUpdateOperationsInput | boolean
    dnsConfigured?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterWebsiteConfigCreateManyInput = {
    id?: string
    primaryDomain?: string
    sslEnabled?: boolean
    dnsConfigured?: boolean
    updatedAt?: Date | string
  }

  export type MasterWebsiteConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryDomain?: StringFieldUpdateOperationsInput | string
    sslEnabled?: BoolFieldUpdateOperationsInput | boolean
    dnsConfigured?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterWebsiteConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    primaryDomain?: StringFieldUpdateOperationsInput | string
    sslEnabled?: BoolFieldUpdateOperationsInput | boolean
    dnsConfigured?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSubscriptionCreateInput = {
    id?: string
    planType: string
    monthlyPrice: Decimal | DecimalJsLike | number | string
    status?: string
    startDate?: Date | string
    endDate?: Date | string | null
    tenant: TenantCreateNestedOneWithoutTenantSubscriptionsInput
  }

  export type TenantSubscriptionUncheckedCreateInput = {
    id?: string
    tenantId: string
    planType: string
    monthlyPrice: Decimal | DecimalJsLike | number | string
    status?: string
    startDate?: Date | string
    endDate?: Date | string | null
  }

  export type TenantSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutTenantSubscriptionsNestedInput
  }

  export type TenantSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantSubscriptionCreateManyInput = {
    id?: string
    tenantId: string
    planType: string
    monthlyPrice: Decimal | DecimalJsLike | number | string
    status?: string
    startDate?: Date | string
    endDate?: Date | string | null
  }

  export type TenantSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BillingTransactionCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    transactionDate?: Date | string
    status?: string
    paymentMethod: string
    description?: string | null
    tenant: TenantCreateNestedOneWithoutBillingTransactionsInput
  }

  export type BillingTransactionUncheckedCreateInput = {
    id?: string
    tenantId: string
    amount: Decimal | DecimalJsLike | number | string
    transactionDate?: Date | string
    status?: string
    paymentMethod: string
    description?: string | null
  }

  export type BillingTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tenant?: TenantUpdateOneRequiredWithoutBillingTransactionsNestedInput
  }

  export type BillingTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingTransactionCreateManyInput = {
    id?: string
    tenantId: string
    amount: Decimal | DecimalJsLike | number | string
    transactionDate?: Date | string
    status?: string
    paymentMethod: string
    description?: string | null
  }

  export type BillingTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type SharedCatalogListRelationFilter = {
    every?: SharedCatalogWhereInput
    some?: SharedCatalogWhereInput
    none?: SharedCatalogWhereInput
  }

  export type PendingProductAdditionListRelationFilter = {
    every?: PendingProductAdditionWhereInput
    some?: PendingProductAdditionWhereInput
    none?: PendingProductAdditionWhereInput
  }

  export type TenantSubscriptionListRelationFilter = {
    every?: TenantSubscriptionWhereInput
    some?: TenantSubscriptionWhereInput
    none?: TenantSubscriptionWhereInput
  }

  export type BillingTransactionListRelationFilter = {
    every?: BillingTransactionWhereInput
    some?: BillingTransactionWhereInput
    none?: BillingTransactionWhereInput
  }

  export type SharedCatalogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PendingProductAdditionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrder
    adminEmail?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrder
    adminEmail?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    storeName?: SortOrder
    subdomain?: SortOrder
    databaseUrl?: SortOrder
    adminEmail?: SortOrder
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

  export type TenantRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SharedCatalogCountOrderByAggregateInput = {
    sku?: SortOrder
    productName?: SortOrder
    category?: SortOrder
    description?: SortOrder
    basePrice?: SortOrder
    imageUrl?: SortOrder
    aiEnrichedAt?: SortOrder
    syncedAt?: SortOrder
    tenantId?: SortOrder
  }

  export type SharedCatalogAvgOrderByAggregateInput = {
    basePrice?: SortOrder
  }

  export type SharedCatalogMaxOrderByAggregateInput = {
    sku?: SortOrder
    productName?: SortOrder
    category?: SortOrder
    description?: SortOrder
    basePrice?: SortOrder
    imageUrl?: SortOrder
    aiEnrichedAt?: SortOrder
    syncedAt?: SortOrder
    tenantId?: SortOrder
  }

  export type SharedCatalogMinOrderByAggregateInput = {
    sku?: SortOrder
    productName?: SortOrder
    category?: SortOrder
    description?: SortOrder
    basePrice?: SortOrder
    imageUrl?: SortOrder
    aiEnrichedAt?: SortOrder
    syncedAt?: SortOrder
    tenantId?: SortOrder
  }

  export type SharedCatalogSumOrderByAggregateInput = {
    basePrice?: SortOrder
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

  export type SuperAdminCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SuperAdminMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SuperAdminMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PendingProductAdditionCountOrderByAggregateInput = {
    id?: SortOrder
    productName?: SortOrder
    upcEanCode?: SortOrder
    brandName?: SortOrder
    categoryName?: SortOrder
    descriptionText?: SortOrder
    imageUrl?: SortOrder
    aiConfidenceScore?: SortOrder
    addedByUserId?: SortOrder
    tenantId?: SortOrder
    status?: SortOrder
    suggestedMatchProductId?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingProductAdditionAvgOrderByAggregateInput = {
    aiConfidenceScore?: SortOrder
  }

  export type PendingProductAdditionMaxOrderByAggregateInput = {
    id?: SortOrder
    productName?: SortOrder
    upcEanCode?: SortOrder
    brandName?: SortOrder
    categoryName?: SortOrder
    descriptionText?: SortOrder
    imageUrl?: SortOrder
    aiConfidenceScore?: SortOrder
    addedByUserId?: SortOrder
    tenantId?: SortOrder
    status?: SortOrder
    suggestedMatchProductId?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingProductAdditionMinOrderByAggregateInput = {
    id?: SortOrder
    productName?: SortOrder
    upcEanCode?: SortOrder
    brandName?: SortOrder
    categoryName?: SortOrder
    descriptionText?: SortOrder
    imageUrl?: SortOrder
    aiConfidenceScore?: SortOrder
    addedByUserId?: SortOrder
    tenantId?: SortOrder
    status?: SortOrder
    suggestedMatchProductId?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingProductAdditionSumOrderByAggregateInput = {
    aiConfidenceScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type MasterWebsiteConfigCountOrderByAggregateInput = {
    id?: SortOrder
    primaryDomain?: SortOrder
    sslEnabled?: SortOrder
    dnsConfigured?: SortOrder
    updatedAt?: SortOrder
  }

  export type MasterWebsiteConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    primaryDomain?: SortOrder
    sslEnabled?: SortOrder
    dnsConfigured?: SortOrder
    updatedAt?: SortOrder
  }

  export type MasterWebsiteConfigMinOrderByAggregateInput = {
    id?: SortOrder
    primaryDomain?: SortOrder
    sslEnabled?: SortOrder
    dnsConfigured?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planType?: SortOrder
    monthlyPrice?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
  }

  export type TenantSubscriptionAvgOrderByAggregateInput = {
    monthlyPrice?: SortOrder
  }

  export type TenantSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planType?: SortOrder
    monthlyPrice?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
  }

  export type TenantSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planType?: SortOrder
    monthlyPrice?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
  }

  export type TenantSubscriptionSumOrderByAggregateInput = {
    monthlyPrice?: SortOrder
  }

  export type BillingTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    transactionDate?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
  }

  export type BillingTransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type BillingTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    transactionDate?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
  }

  export type BillingTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    transactionDate?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    description?: SortOrder
  }

  export type BillingTransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type SharedCatalogCreateNestedManyWithoutTenantInput = {
    create?: XOR<SharedCatalogCreateWithoutTenantInput, SharedCatalogUncheckedCreateWithoutTenantInput> | SharedCatalogCreateWithoutTenantInput[] | SharedCatalogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SharedCatalogCreateOrConnectWithoutTenantInput | SharedCatalogCreateOrConnectWithoutTenantInput[]
    createMany?: SharedCatalogCreateManyTenantInputEnvelope
    connect?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
  }

  export type PendingProductAdditionCreateNestedManyWithoutTenantInput = {
    create?: XOR<PendingProductAdditionCreateWithoutTenantInput, PendingProductAdditionUncheckedCreateWithoutTenantInput> | PendingProductAdditionCreateWithoutTenantInput[] | PendingProductAdditionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PendingProductAdditionCreateOrConnectWithoutTenantInput | PendingProductAdditionCreateOrConnectWithoutTenantInput[]
    createMany?: PendingProductAdditionCreateManyTenantInputEnvelope
    connect?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
  }

  export type TenantSubscriptionCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput> | TenantSubscriptionCreateWithoutTenantInput[] | TenantSubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput | TenantSubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: TenantSubscriptionCreateManyTenantInputEnvelope
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
  }

  export type BillingTransactionCreateNestedManyWithoutTenantInput = {
    create?: XOR<BillingTransactionCreateWithoutTenantInput, BillingTransactionUncheckedCreateWithoutTenantInput> | BillingTransactionCreateWithoutTenantInput[] | BillingTransactionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingTransactionCreateOrConnectWithoutTenantInput | BillingTransactionCreateOrConnectWithoutTenantInput[]
    createMany?: BillingTransactionCreateManyTenantInputEnvelope
    connect?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
  }

  export type SharedCatalogUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<SharedCatalogCreateWithoutTenantInput, SharedCatalogUncheckedCreateWithoutTenantInput> | SharedCatalogCreateWithoutTenantInput[] | SharedCatalogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SharedCatalogCreateOrConnectWithoutTenantInput | SharedCatalogCreateOrConnectWithoutTenantInput[]
    createMany?: SharedCatalogCreateManyTenantInputEnvelope
    connect?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
  }

  export type PendingProductAdditionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<PendingProductAdditionCreateWithoutTenantInput, PendingProductAdditionUncheckedCreateWithoutTenantInput> | PendingProductAdditionCreateWithoutTenantInput[] | PendingProductAdditionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PendingProductAdditionCreateOrConnectWithoutTenantInput | PendingProductAdditionCreateOrConnectWithoutTenantInput[]
    createMany?: PendingProductAdditionCreateManyTenantInputEnvelope
    connect?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
  }

  export type TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput> | TenantSubscriptionCreateWithoutTenantInput[] | TenantSubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput | TenantSubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: TenantSubscriptionCreateManyTenantInputEnvelope
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
  }

  export type BillingTransactionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<BillingTransactionCreateWithoutTenantInput, BillingTransactionUncheckedCreateWithoutTenantInput> | BillingTransactionCreateWithoutTenantInput[] | BillingTransactionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingTransactionCreateOrConnectWithoutTenantInput | BillingTransactionCreateOrConnectWithoutTenantInput[]
    createMany?: BillingTransactionCreateManyTenantInputEnvelope
    connect?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SharedCatalogUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SharedCatalogCreateWithoutTenantInput, SharedCatalogUncheckedCreateWithoutTenantInput> | SharedCatalogCreateWithoutTenantInput[] | SharedCatalogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SharedCatalogCreateOrConnectWithoutTenantInput | SharedCatalogCreateOrConnectWithoutTenantInput[]
    upsert?: SharedCatalogUpsertWithWhereUniqueWithoutTenantInput | SharedCatalogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SharedCatalogCreateManyTenantInputEnvelope
    set?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
    disconnect?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
    delete?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
    connect?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
    update?: SharedCatalogUpdateWithWhereUniqueWithoutTenantInput | SharedCatalogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SharedCatalogUpdateManyWithWhereWithoutTenantInput | SharedCatalogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SharedCatalogScalarWhereInput | SharedCatalogScalarWhereInput[]
  }

  export type PendingProductAdditionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PendingProductAdditionCreateWithoutTenantInput, PendingProductAdditionUncheckedCreateWithoutTenantInput> | PendingProductAdditionCreateWithoutTenantInput[] | PendingProductAdditionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PendingProductAdditionCreateOrConnectWithoutTenantInput | PendingProductAdditionCreateOrConnectWithoutTenantInput[]
    upsert?: PendingProductAdditionUpsertWithWhereUniqueWithoutTenantInput | PendingProductAdditionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PendingProductAdditionCreateManyTenantInputEnvelope
    set?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
    disconnect?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
    delete?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
    connect?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
    update?: PendingProductAdditionUpdateWithWhereUniqueWithoutTenantInput | PendingProductAdditionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PendingProductAdditionUpdateManyWithWhereWithoutTenantInput | PendingProductAdditionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PendingProductAdditionScalarWhereInput | PendingProductAdditionScalarWhereInput[]
  }

  export type TenantSubscriptionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput> | TenantSubscriptionCreateWithoutTenantInput[] | TenantSubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput | TenantSubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput | TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantSubscriptionCreateManyTenantInputEnvelope
    set?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    disconnect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    delete?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    update?: TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput | TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantSubscriptionUpdateManyWithWhereWithoutTenantInput | TenantSubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
  }

  export type BillingTransactionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BillingTransactionCreateWithoutTenantInput, BillingTransactionUncheckedCreateWithoutTenantInput> | BillingTransactionCreateWithoutTenantInput[] | BillingTransactionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingTransactionCreateOrConnectWithoutTenantInput | BillingTransactionCreateOrConnectWithoutTenantInput[]
    upsert?: BillingTransactionUpsertWithWhereUniqueWithoutTenantInput | BillingTransactionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BillingTransactionCreateManyTenantInputEnvelope
    set?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
    disconnect?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
    delete?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
    connect?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
    update?: BillingTransactionUpdateWithWhereUniqueWithoutTenantInput | BillingTransactionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BillingTransactionUpdateManyWithWhereWithoutTenantInput | BillingTransactionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BillingTransactionScalarWhereInput | BillingTransactionScalarWhereInput[]
  }

  export type SharedCatalogUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SharedCatalogCreateWithoutTenantInput, SharedCatalogUncheckedCreateWithoutTenantInput> | SharedCatalogCreateWithoutTenantInput[] | SharedCatalogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SharedCatalogCreateOrConnectWithoutTenantInput | SharedCatalogCreateOrConnectWithoutTenantInput[]
    upsert?: SharedCatalogUpsertWithWhereUniqueWithoutTenantInput | SharedCatalogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SharedCatalogCreateManyTenantInputEnvelope
    set?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
    disconnect?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
    delete?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
    connect?: SharedCatalogWhereUniqueInput | SharedCatalogWhereUniqueInput[]
    update?: SharedCatalogUpdateWithWhereUniqueWithoutTenantInput | SharedCatalogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SharedCatalogUpdateManyWithWhereWithoutTenantInput | SharedCatalogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SharedCatalogScalarWhereInput | SharedCatalogScalarWhereInput[]
  }

  export type PendingProductAdditionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PendingProductAdditionCreateWithoutTenantInput, PendingProductAdditionUncheckedCreateWithoutTenantInput> | PendingProductAdditionCreateWithoutTenantInput[] | PendingProductAdditionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PendingProductAdditionCreateOrConnectWithoutTenantInput | PendingProductAdditionCreateOrConnectWithoutTenantInput[]
    upsert?: PendingProductAdditionUpsertWithWhereUniqueWithoutTenantInput | PendingProductAdditionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PendingProductAdditionCreateManyTenantInputEnvelope
    set?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
    disconnect?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
    delete?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
    connect?: PendingProductAdditionWhereUniqueInput | PendingProductAdditionWhereUniqueInput[]
    update?: PendingProductAdditionUpdateWithWhereUniqueWithoutTenantInput | PendingProductAdditionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PendingProductAdditionUpdateManyWithWhereWithoutTenantInput | PendingProductAdditionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PendingProductAdditionScalarWhereInput | PendingProductAdditionScalarWhereInput[]
  }

  export type TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput> | TenantSubscriptionCreateWithoutTenantInput[] | TenantSubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSubscriptionCreateOrConnectWithoutTenantInput | TenantSubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput | TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantSubscriptionCreateManyTenantInputEnvelope
    set?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    disconnect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    delete?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    connect?: TenantSubscriptionWhereUniqueInput | TenantSubscriptionWhereUniqueInput[]
    update?: TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput | TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantSubscriptionUpdateManyWithWhereWithoutTenantInput | TenantSubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
  }

  export type BillingTransactionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BillingTransactionCreateWithoutTenantInput, BillingTransactionUncheckedCreateWithoutTenantInput> | BillingTransactionCreateWithoutTenantInput[] | BillingTransactionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingTransactionCreateOrConnectWithoutTenantInput | BillingTransactionCreateOrConnectWithoutTenantInput[]
    upsert?: BillingTransactionUpsertWithWhereUniqueWithoutTenantInput | BillingTransactionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BillingTransactionCreateManyTenantInputEnvelope
    set?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
    disconnect?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
    delete?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
    connect?: BillingTransactionWhereUniqueInput | BillingTransactionWhereUniqueInput[]
    update?: BillingTransactionUpdateWithWhereUniqueWithoutTenantInput | BillingTransactionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BillingTransactionUpdateManyWithWhereWithoutTenantInput | BillingTransactionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BillingTransactionScalarWhereInput | BillingTransactionScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutSharedCatalogInput = {
    create?: XOR<TenantCreateWithoutSharedCatalogInput, TenantUncheckedCreateWithoutSharedCatalogInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSharedCatalogInput
    connect?: TenantWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TenantUpdateOneRequiredWithoutSharedCatalogNestedInput = {
    create?: XOR<TenantCreateWithoutSharedCatalogInput, TenantUncheckedCreateWithoutSharedCatalogInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSharedCatalogInput
    upsert?: TenantUpsertWithoutSharedCatalogInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSharedCatalogInput, TenantUpdateWithoutSharedCatalogInput>, TenantUncheckedUpdateWithoutSharedCatalogInput>
  }

  export type TenantCreateNestedOneWithoutPendingProductAdditionsInput = {
    create?: XOR<TenantCreateWithoutPendingProductAdditionsInput, TenantUncheckedCreateWithoutPendingProductAdditionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPendingProductAdditionsInput
    connect?: TenantWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TenantUpdateOneRequiredWithoutPendingProductAdditionsNestedInput = {
    create?: XOR<TenantCreateWithoutPendingProductAdditionsInput, TenantUncheckedCreateWithoutPendingProductAdditionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPendingProductAdditionsInput
    upsert?: TenantUpsertWithoutPendingProductAdditionsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutPendingProductAdditionsInput, TenantUpdateWithoutPendingProductAdditionsInput>, TenantUncheckedUpdateWithoutPendingProductAdditionsInput>
  }

  export type TenantCreateNestedOneWithoutTenantSubscriptionsInput = {
    create?: XOR<TenantCreateWithoutTenantSubscriptionsInput, TenantUncheckedCreateWithoutTenantSubscriptionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutTenantSubscriptionsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutTenantSubscriptionsNestedInput = {
    create?: XOR<TenantCreateWithoutTenantSubscriptionsInput, TenantUncheckedCreateWithoutTenantSubscriptionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutTenantSubscriptionsInput
    upsert?: TenantUpsertWithoutTenantSubscriptionsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutTenantSubscriptionsInput, TenantUpdateWithoutTenantSubscriptionsInput>, TenantUncheckedUpdateWithoutTenantSubscriptionsInput>
  }

  export type TenantCreateNestedOneWithoutBillingTransactionsInput = {
    create?: XOR<TenantCreateWithoutBillingTransactionsInput, TenantUncheckedCreateWithoutBillingTransactionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBillingTransactionsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutBillingTransactionsNestedInput = {
    create?: XOR<TenantCreateWithoutBillingTransactionsInput, TenantUncheckedCreateWithoutBillingTransactionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBillingTransactionsInput
    upsert?: TenantUpsertWithoutBillingTransactionsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutBillingTransactionsInput, TenantUpdateWithoutBillingTransactionsInput>, TenantUncheckedUpdateWithoutBillingTransactionsInput>
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type SharedCatalogCreateWithoutTenantInput = {
    sku: string
    productName: string
    category?: string | null
    description?: string | null
    basePrice: Decimal | DecimalJsLike | number | string
    imageUrl?: string | null
    aiEnrichedAt?: Date | string | null
    syncedAt?: Date | string
  }

  export type SharedCatalogUncheckedCreateWithoutTenantInput = {
    sku: string
    productName: string
    category?: string | null
    description?: string | null
    basePrice: Decimal | DecimalJsLike | number | string
    imageUrl?: string | null
    aiEnrichedAt?: Date | string | null
    syncedAt?: Date | string
  }

  export type SharedCatalogCreateOrConnectWithoutTenantInput = {
    where: SharedCatalogWhereUniqueInput
    create: XOR<SharedCatalogCreateWithoutTenantInput, SharedCatalogUncheckedCreateWithoutTenantInput>
  }

  export type SharedCatalogCreateManyTenantInputEnvelope = {
    data: SharedCatalogCreateManyTenantInput | SharedCatalogCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type PendingProductAdditionCreateWithoutTenantInput = {
    id?: string
    productName: string
    upcEanCode: string
    brandName: string
    categoryName: string
    descriptionText?: string | null
    imageUrl?: string | null
    aiConfidenceScore: number
    addedByUserId: string
    status?: string
    suggestedMatchProductId?: string | null
    createdAt?: Date | string
  }

  export type PendingProductAdditionUncheckedCreateWithoutTenantInput = {
    id?: string
    productName: string
    upcEanCode: string
    brandName: string
    categoryName: string
    descriptionText?: string | null
    imageUrl?: string | null
    aiConfidenceScore: number
    addedByUserId: string
    status?: string
    suggestedMatchProductId?: string | null
    createdAt?: Date | string
  }

  export type PendingProductAdditionCreateOrConnectWithoutTenantInput = {
    where: PendingProductAdditionWhereUniqueInput
    create: XOR<PendingProductAdditionCreateWithoutTenantInput, PendingProductAdditionUncheckedCreateWithoutTenantInput>
  }

  export type PendingProductAdditionCreateManyTenantInputEnvelope = {
    data: PendingProductAdditionCreateManyTenantInput | PendingProductAdditionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantSubscriptionCreateWithoutTenantInput = {
    id?: string
    planType: string
    monthlyPrice: Decimal | DecimalJsLike | number | string
    status?: string
    startDate?: Date | string
    endDate?: Date | string | null
  }

  export type TenantSubscriptionUncheckedCreateWithoutTenantInput = {
    id?: string
    planType: string
    monthlyPrice: Decimal | DecimalJsLike | number | string
    status?: string
    startDate?: Date | string
    endDate?: Date | string | null
  }

  export type TenantSubscriptionCreateOrConnectWithoutTenantInput = {
    where: TenantSubscriptionWhereUniqueInput
    create: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type TenantSubscriptionCreateManyTenantInputEnvelope = {
    data: TenantSubscriptionCreateManyTenantInput | TenantSubscriptionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type BillingTransactionCreateWithoutTenantInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    transactionDate?: Date | string
    status?: string
    paymentMethod: string
    description?: string | null
  }

  export type BillingTransactionUncheckedCreateWithoutTenantInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    transactionDate?: Date | string
    status?: string
    paymentMethod: string
    description?: string | null
  }

  export type BillingTransactionCreateOrConnectWithoutTenantInput = {
    where: BillingTransactionWhereUniqueInput
    create: XOR<BillingTransactionCreateWithoutTenantInput, BillingTransactionUncheckedCreateWithoutTenantInput>
  }

  export type BillingTransactionCreateManyTenantInputEnvelope = {
    data: BillingTransactionCreateManyTenantInput | BillingTransactionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type SharedCatalogUpsertWithWhereUniqueWithoutTenantInput = {
    where: SharedCatalogWhereUniqueInput
    update: XOR<SharedCatalogUpdateWithoutTenantInput, SharedCatalogUncheckedUpdateWithoutTenantInput>
    create: XOR<SharedCatalogCreateWithoutTenantInput, SharedCatalogUncheckedCreateWithoutTenantInput>
  }

  export type SharedCatalogUpdateWithWhereUniqueWithoutTenantInput = {
    where: SharedCatalogWhereUniqueInput
    data: XOR<SharedCatalogUpdateWithoutTenantInput, SharedCatalogUncheckedUpdateWithoutTenantInput>
  }

  export type SharedCatalogUpdateManyWithWhereWithoutTenantInput = {
    where: SharedCatalogScalarWhereInput
    data: XOR<SharedCatalogUpdateManyMutationInput, SharedCatalogUncheckedUpdateManyWithoutTenantInput>
  }

  export type SharedCatalogScalarWhereInput = {
    AND?: SharedCatalogScalarWhereInput | SharedCatalogScalarWhereInput[]
    OR?: SharedCatalogScalarWhereInput[]
    NOT?: SharedCatalogScalarWhereInput | SharedCatalogScalarWhereInput[]
    sku?: StringFilter<"SharedCatalog"> | string
    productName?: StringFilter<"SharedCatalog"> | string
    category?: StringNullableFilter<"SharedCatalog"> | string | null
    description?: StringNullableFilter<"SharedCatalog"> | string | null
    basePrice?: DecimalFilter<"SharedCatalog"> | Decimal | DecimalJsLike | number | string
    imageUrl?: StringNullableFilter<"SharedCatalog"> | string | null
    aiEnrichedAt?: DateTimeNullableFilter<"SharedCatalog"> | Date | string | null
    syncedAt?: DateTimeFilter<"SharedCatalog"> | Date | string
    tenantId?: StringFilter<"SharedCatalog"> | string
  }

  export type PendingProductAdditionUpsertWithWhereUniqueWithoutTenantInput = {
    where: PendingProductAdditionWhereUniqueInput
    update: XOR<PendingProductAdditionUpdateWithoutTenantInput, PendingProductAdditionUncheckedUpdateWithoutTenantInput>
    create: XOR<PendingProductAdditionCreateWithoutTenantInput, PendingProductAdditionUncheckedCreateWithoutTenantInput>
  }

  export type PendingProductAdditionUpdateWithWhereUniqueWithoutTenantInput = {
    where: PendingProductAdditionWhereUniqueInput
    data: XOR<PendingProductAdditionUpdateWithoutTenantInput, PendingProductAdditionUncheckedUpdateWithoutTenantInput>
  }

  export type PendingProductAdditionUpdateManyWithWhereWithoutTenantInput = {
    where: PendingProductAdditionScalarWhereInput
    data: XOR<PendingProductAdditionUpdateManyMutationInput, PendingProductAdditionUncheckedUpdateManyWithoutTenantInput>
  }

  export type PendingProductAdditionScalarWhereInput = {
    AND?: PendingProductAdditionScalarWhereInput | PendingProductAdditionScalarWhereInput[]
    OR?: PendingProductAdditionScalarWhereInput[]
    NOT?: PendingProductAdditionScalarWhereInput | PendingProductAdditionScalarWhereInput[]
    id?: StringFilter<"PendingProductAddition"> | string
    productName?: StringFilter<"PendingProductAddition"> | string
    upcEanCode?: StringFilter<"PendingProductAddition"> | string
    brandName?: StringFilter<"PendingProductAddition"> | string
    categoryName?: StringFilter<"PendingProductAddition"> | string
    descriptionText?: StringNullableFilter<"PendingProductAddition"> | string | null
    imageUrl?: StringNullableFilter<"PendingProductAddition"> | string | null
    aiConfidenceScore?: FloatFilter<"PendingProductAddition"> | number
    addedByUserId?: StringFilter<"PendingProductAddition"> | string
    tenantId?: StringFilter<"PendingProductAddition"> | string
    status?: StringFilter<"PendingProductAddition"> | string
    suggestedMatchProductId?: StringNullableFilter<"PendingProductAddition"> | string | null
    createdAt?: DateTimeFilter<"PendingProductAddition"> | Date | string
  }

  export type TenantSubscriptionUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantSubscriptionWhereUniqueInput
    update: XOR<TenantSubscriptionUpdateWithoutTenantInput, TenantSubscriptionUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantSubscriptionCreateWithoutTenantInput, TenantSubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type TenantSubscriptionUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantSubscriptionWhereUniqueInput
    data: XOR<TenantSubscriptionUpdateWithoutTenantInput, TenantSubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type TenantSubscriptionUpdateManyWithWhereWithoutTenantInput = {
    where: TenantSubscriptionScalarWhereInput
    data: XOR<TenantSubscriptionUpdateManyMutationInput, TenantSubscriptionUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantSubscriptionScalarWhereInput = {
    AND?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
    OR?: TenantSubscriptionScalarWhereInput[]
    NOT?: TenantSubscriptionScalarWhereInput | TenantSubscriptionScalarWhereInput[]
    id?: StringFilter<"TenantSubscription"> | string
    tenantId?: StringFilter<"TenantSubscription"> | string
    planType?: StringFilter<"TenantSubscription"> | string
    monthlyPrice?: DecimalFilter<"TenantSubscription"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"TenantSubscription"> | string
    startDate?: DateTimeFilter<"TenantSubscription"> | Date | string
    endDate?: DateTimeNullableFilter<"TenantSubscription"> | Date | string | null
  }

  export type BillingTransactionUpsertWithWhereUniqueWithoutTenantInput = {
    where: BillingTransactionWhereUniqueInput
    update: XOR<BillingTransactionUpdateWithoutTenantInput, BillingTransactionUncheckedUpdateWithoutTenantInput>
    create: XOR<BillingTransactionCreateWithoutTenantInput, BillingTransactionUncheckedCreateWithoutTenantInput>
  }

  export type BillingTransactionUpdateWithWhereUniqueWithoutTenantInput = {
    where: BillingTransactionWhereUniqueInput
    data: XOR<BillingTransactionUpdateWithoutTenantInput, BillingTransactionUncheckedUpdateWithoutTenantInput>
  }

  export type BillingTransactionUpdateManyWithWhereWithoutTenantInput = {
    where: BillingTransactionScalarWhereInput
    data: XOR<BillingTransactionUpdateManyMutationInput, BillingTransactionUncheckedUpdateManyWithoutTenantInput>
  }

  export type BillingTransactionScalarWhereInput = {
    AND?: BillingTransactionScalarWhereInput | BillingTransactionScalarWhereInput[]
    OR?: BillingTransactionScalarWhereInput[]
    NOT?: BillingTransactionScalarWhereInput | BillingTransactionScalarWhereInput[]
    id?: StringFilter<"BillingTransaction"> | string
    tenantId?: StringFilter<"BillingTransaction"> | string
    amount?: DecimalFilter<"BillingTransaction"> | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFilter<"BillingTransaction"> | Date | string
    status?: StringFilter<"BillingTransaction"> | string
    paymentMethod?: StringFilter<"BillingTransaction"> | string
    description?: StringNullableFilter<"BillingTransaction"> | string | null
  }

  export type TenantCreateWithoutSharedCatalogInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    PendingProductAdditions?: PendingProductAdditionCreateNestedManyWithoutTenantInput
    TenantSubscriptions?: TenantSubscriptionCreateNestedManyWithoutTenantInput
    BillingTransactions?: BillingTransactionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSharedCatalogInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    PendingProductAdditions?: PendingProductAdditionUncheckedCreateNestedManyWithoutTenantInput
    TenantSubscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
    BillingTransactions?: BillingTransactionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSharedCatalogInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSharedCatalogInput, TenantUncheckedCreateWithoutSharedCatalogInput>
  }

  export type TenantUpsertWithoutSharedCatalogInput = {
    update: XOR<TenantUpdateWithoutSharedCatalogInput, TenantUncheckedUpdateWithoutSharedCatalogInput>
    create: XOR<TenantCreateWithoutSharedCatalogInput, TenantUncheckedCreateWithoutSharedCatalogInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSharedCatalogInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSharedCatalogInput, TenantUncheckedUpdateWithoutSharedCatalogInput>
  }

  export type TenantUpdateWithoutSharedCatalogInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    PendingProductAdditions?: PendingProductAdditionUpdateManyWithoutTenantNestedInput
    TenantSubscriptions?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
    BillingTransactions?: BillingTransactionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSharedCatalogInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    PendingProductAdditions?: PendingProductAdditionUncheckedUpdateManyWithoutTenantNestedInput
    TenantSubscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    BillingTransactions?: BillingTransactionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutPendingProductAdditionsInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SharedCatalog?: SharedCatalogCreateNestedManyWithoutTenantInput
    TenantSubscriptions?: TenantSubscriptionCreateNestedManyWithoutTenantInput
    BillingTransactions?: BillingTransactionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutPendingProductAdditionsInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SharedCatalog?: SharedCatalogUncheckedCreateNestedManyWithoutTenantInput
    TenantSubscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
    BillingTransactions?: BillingTransactionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPendingProductAdditionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPendingProductAdditionsInput, TenantUncheckedCreateWithoutPendingProductAdditionsInput>
  }

  export type TenantUpsertWithoutPendingProductAdditionsInput = {
    update: XOR<TenantUpdateWithoutPendingProductAdditionsInput, TenantUncheckedUpdateWithoutPendingProductAdditionsInput>
    create: XOR<TenantCreateWithoutPendingProductAdditionsInput, TenantUncheckedCreateWithoutPendingProductAdditionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutPendingProductAdditionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutPendingProductAdditionsInput, TenantUncheckedUpdateWithoutPendingProductAdditionsInput>
  }

  export type TenantUpdateWithoutPendingProductAdditionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SharedCatalog?: SharedCatalogUpdateManyWithoutTenantNestedInput
    TenantSubscriptions?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
    BillingTransactions?: BillingTransactionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutPendingProductAdditionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SharedCatalog?: SharedCatalogUncheckedUpdateManyWithoutTenantNestedInput
    TenantSubscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    BillingTransactions?: BillingTransactionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutTenantSubscriptionsInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SharedCatalog?: SharedCatalogCreateNestedManyWithoutTenantInput
    PendingProductAdditions?: PendingProductAdditionCreateNestedManyWithoutTenantInput
    BillingTransactions?: BillingTransactionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutTenantSubscriptionsInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SharedCatalog?: SharedCatalogUncheckedCreateNestedManyWithoutTenantInput
    PendingProductAdditions?: PendingProductAdditionUncheckedCreateNestedManyWithoutTenantInput
    BillingTransactions?: BillingTransactionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutTenantSubscriptionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutTenantSubscriptionsInput, TenantUncheckedCreateWithoutTenantSubscriptionsInput>
  }

  export type TenantUpsertWithoutTenantSubscriptionsInput = {
    update: XOR<TenantUpdateWithoutTenantSubscriptionsInput, TenantUncheckedUpdateWithoutTenantSubscriptionsInput>
    create: XOR<TenantCreateWithoutTenantSubscriptionsInput, TenantUncheckedCreateWithoutTenantSubscriptionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutTenantSubscriptionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutTenantSubscriptionsInput, TenantUncheckedUpdateWithoutTenantSubscriptionsInput>
  }

  export type TenantUpdateWithoutTenantSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SharedCatalog?: SharedCatalogUpdateManyWithoutTenantNestedInput
    PendingProductAdditions?: PendingProductAdditionUpdateManyWithoutTenantNestedInput
    BillingTransactions?: BillingTransactionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutTenantSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SharedCatalog?: SharedCatalogUncheckedUpdateManyWithoutTenantNestedInput
    PendingProductAdditions?: PendingProductAdditionUncheckedUpdateManyWithoutTenantNestedInput
    BillingTransactions?: BillingTransactionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutBillingTransactionsInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SharedCatalog?: SharedCatalogCreateNestedManyWithoutTenantInput
    PendingProductAdditions?: PendingProductAdditionCreateNestedManyWithoutTenantInput
    TenantSubscriptions?: TenantSubscriptionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutBillingTransactionsInput = {
    id?: string
    storeName: string
    subdomain: string
    databaseUrl: string
    adminEmail: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    SharedCatalog?: SharedCatalogUncheckedCreateNestedManyWithoutTenantInput
    PendingProductAdditions?: PendingProductAdditionUncheckedCreateNestedManyWithoutTenantInput
    TenantSubscriptions?: TenantSubscriptionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutBillingTransactionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutBillingTransactionsInput, TenantUncheckedCreateWithoutBillingTransactionsInput>
  }

  export type TenantUpsertWithoutBillingTransactionsInput = {
    update: XOR<TenantUpdateWithoutBillingTransactionsInput, TenantUncheckedUpdateWithoutBillingTransactionsInput>
    create: XOR<TenantCreateWithoutBillingTransactionsInput, TenantUncheckedCreateWithoutBillingTransactionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutBillingTransactionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutBillingTransactionsInput, TenantUncheckedUpdateWithoutBillingTransactionsInput>
  }

  export type TenantUpdateWithoutBillingTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SharedCatalog?: SharedCatalogUpdateManyWithoutTenantNestedInput
    PendingProductAdditions?: PendingProductAdditionUpdateManyWithoutTenantNestedInput
    TenantSubscriptions?: TenantSubscriptionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutBillingTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    databaseUrl?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    SharedCatalog?: SharedCatalogUncheckedUpdateManyWithoutTenantNestedInput
    PendingProductAdditions?: PendingProductAdditionUncheckedUpdateManyWithoutTenantNestedInput
    TenantSubscriptions?: TenantSubscriptionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type SharedCatalogCreateManyTenantInput = {
    sku: string
    productName: string
    category?: string | null
    description?: string | null
    basePrice: Decimal | DecimalJsLike | number | string
    imageUrl?: string | null
    aiEnrichedAt?: Date | string | null
    syncedAt?: Date | string
  }

  export type PendingProductAdditionCreateManyTenantInput = {
    id?: string
    productName: string
    upcEanCode: string
    brandName: string
    categoryName: string
    descriptionText?: string | null
    imageUrl?: string | null
    aiConfidenceScore: number
    addedByUserId: string
    status?: string
    suggestedMatchProductId?: string | null
    createdAt?: Date | string
  }

  export type TenantSubscriptionCreateManyTenantInput = {
    id?: string
    planType: string
    monthlyPrice: Decimal | DecimalJsLike | number | string
    status?: string
    startDate?: Date | string
    endDate?: Date | string | null
  }

  export type BillingTransactionCreateManyTenantInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    transactionDate?: Date | string
    status?: string
    paymentMethod: string
    description?: string | null
  }

  export type SharedCatalogUpdateWithoutTenantInput = {
    sku?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedCatalogUncheckedUpdateWithoutTenantInput = {
    sku?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedCatalogUncheckedUpdateManyWithoutTenantInput = {
    sku?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    basePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiEnrichedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingProductAdditionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    upcEanCode?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    categoryName?: StringFieldUpdateOperationsInput | string
    descriptionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidenceScore?: FloatFieldUpdateOperationsInput | number
    addedByUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    suggestedMatchProductId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingProductAdditionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    upcEanCode?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    categoryName?: StringFieldUpdateOperationsInput | string
    descriptionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidenceScore?: FloatFieldUpdateOperationsInput | number
    addedByUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    suggestedMatchProductId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingProductAdditionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    upcEanCode?: StringFieldUpdateOperationsInput | string
    brandName?: StringFieldUpdateOperationsInput | string
    categoryName?: StringFieldUpdateOperationsInput | string
    descriptionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    aiConfidenceScore?: FloatFieldUpdateOperationsInput | number
    addedByUserId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    suggestedMatchProductId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSubscriptionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantSubscriptionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantSubscriptionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BillingTransactionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingTransactionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingTransactionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    transactionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use TenantCountOutputTypeDefaultArgs instead
     */
    export type TenantCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TenantDefaultArgs instead
     */
    export type TenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SharedCatalogDefaultArgs instead
     */
    export type SharedCatalogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SharedCatalogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SuperAdminDefaultArgs instead
     */
    export type SuperAdminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SuperAdminDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PendingProductAdditionDefaultArgs instead
     */
    export type PendingProductAdditionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PendingProductAdditionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MasterWebsiteConfigDefaultArgs instead
     */
    export type MasterWebsiteConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MasterWebsiteConfigDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TenantSubscriptionDefaultArgs instead
     */
    export type TenantSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantSubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BillingTransactionDefaultArgs instead
     */
    export type BillingTransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BillingTransactionDefaultArgs<ExtArgs>

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