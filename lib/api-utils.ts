import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 60;

export async function requireAdminSession(requiredRole?: 'SUPER_ADMIN' | 'EDITOR') {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  if (requiredRole && (session.user as any).role !== requiredRole) return null;
  return session;
}

export async function requireSuperAdmin() {
  return requireAdminSession('SUPER_ADMIN');
}

// In-memory rate limiter
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetAt) rateLimitStore.delete(key);
  });
}, 10 * 60 * 1000).unref();

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
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
