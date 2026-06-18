"use client";

import { useQuery, useInfiniteQuery, type UseQueryOptions } from "@tanstack/react-query";
import { supabaseConfig } from "@/lib/supabase/config";

export const PAGE_SIZE = 20;

type QueryValue = string | number | boolean;

const SUPABASE_FILTER_PREFIX =
  /^(?:not\.(?:eq|neq|gt|gte|lt|lte|like|ilike|is|in|cs|cd|sl|sr|nxl|nxr|adj|ov|fts|plfts|phfts|wfts)|eq|neq|gt|gte|lt|lte|like|ilike|is|in|cs|cd|sl|sr|nxl|nxr|adj|ov|fts|plfts|phfts|wfts)\./;

export function toSupabaseFilterValue(value: QueryValue): string {
  if (typeof value === "string" && SUPABASE_FILTER_PREFIX.test(value)) {
    return value;
  }

  return `eq.${String(value)}`;
}

export interface InventoryItemsQueryParams {
  select?: string;
  limit?: number;
  offset?: number;
  order?: string;
  queryParams?: Record<string, QueryValue | undefined | null>;
}

export interface InventoryItem {
  id: string;
  tenant_id: string;
  site_id: string;
  category: string;
  name: string;
  quantity: number;
  unit: string;
  images: string[];
  price: string | null;
  status: string;
  received_date: string;
  vendor: string;
  last_updated: string;
  created_at: string;
  unit_value: unknown;
  reorder_level: unknown;
  note?: string;
}

export interface GetSiteCategoriesPayload {
  p_site_id: string;
  [key: string]: unknown;
}

export interface SiteCategory {
  category: string;
}

function buildUrl(path: string, searchParams?: URLSearchParams): string {
  const url = new URL(path, supabaseConfig.url);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return url.toString();
}

function getHeaders(): HeadersInit {
  return {
    apikey: supabaseConfig.anonKey,
    Authorization: `Bearer ${supabaseConfig.anonKey}`,
    "Content-Type": "application/json",
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Supabase request failed (${response.status}): ${errorBody || response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function fetchInventoryItems(params: InventoryItemsQueryParams = {}) {
  const searchParams = new URLSearchParams({
    select: params.select ?? "*",
    apikey: supabaseConfig.anonKey,
  });

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    searchParams.set("offset", String(params.offset));
  }

  if (params.order !== undefined) {
    searchParams.set("order", params.order);
  }

  if (params.queryParams) {
    for (const [key, value] of Object.entries(params.queryParams)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, toSupabaseFilterValue(value));
      }
    }
  }

  const response = await fetch(buildUrl("/rest/v1/inventory_items", searchParams), {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  return handleResponse<InventoryItem[]>(response);
}

export async function fetchSiteCategories(payload: GetSiteCategoriesPayload) {
  const searchParams = new URLSearchParams({
    apikey: supabaseConfig.anonKey,
  });

  const response = await fetch(
    buildUrl("/rest/v1/rpc/get_site_categories", searchParams),
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  return handleResponse<SiteCategory[]>(response);
}

type InventoryItemsQueryOptions = Omit<
  UseQueryOptions<InventoryItem[], Error>,
  "queryKey" | "queryFn"
>;

export function useInventoryItems(
  params: InventoryItemsQueryParams,
  options?: InventoryItemsQueryOptions,
) {
  return useQuery<InventoryItem[], Error>({
    queryKey: ["inventory-items", params],
    queryFn: () => fetchInventoryItems(params),
    ...options,
  });
}

type SiteCategoriesQueryOptions = Omit<
  UseQueryOptions<SiteCategory[], Error>,
  "queryKey" | "queryFn"
>;

export function useSiteCategories(
  payload: GetSiteCategoriesPayload,
  options?: SiteCategoriesQueryOptions,
) {
  return useQuery<SiteCategory[], Error>({
    queryKey: ["site-categories", payload],
    queryFn: () => fetchSiteCategories(payload),
    ...options,
  });
}

export function useInfiniteInventoryItems(
  params: Omit<InventoryItemsQueryParams, "limit" | "offset">,
) {
  return useInfiniteQuery({
    queryKey: ["inventory-items-infinite", params],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchInventoryItems({ ...params, limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: InventoryItem[],
      _: InventoryItem[][],
      lastPageParam: number,
    ) => (lastPage.length === PAGE_SIZE ? lastPageParam + PAGE_SIZE : undefined),
  });
}