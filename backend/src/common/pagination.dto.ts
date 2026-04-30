export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function parsePagination(
  page?: string | number,
  limit?: string | number,
  defaultLimit = 20,
): { skip: number; take: number; page: number; limit: number } {
  const p = Math.max(1, parseInt(String(page || 1), 10));
  const l = Math.min(100, Math.max(1, parseInt(String(limit || defaultLimit), 10)));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
