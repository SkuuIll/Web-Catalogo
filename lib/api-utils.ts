import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 60;

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export function parsePagination(searchParams: URLSearchParams, fallbackPageSize = DEFAULT_PAGE_SIZE) {
  const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);
  const requestedPageSize = Number(searchParams.get("pageSize") || fallbackPageSize) || fallbackPageSize;
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, requestedPageSize));

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function paginatedResponse<T>(items: T[], total: number, page: number, pageSize: number) {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
