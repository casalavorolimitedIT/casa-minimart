"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { supabaseConfig } from "@/lib/supabase/config";

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
  queryParams?: Record<string, QueryValue | undefined | null>;
}

export interface InventoryItem {
  id: string;
  site_id: string;
  category: string;
  [key: string]: unknown;
}

export interface GetSiteCategoriesPayload {
  p_site_id: string;
  [key: string]: unknown;
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

  return handleResponse<unknown[]>(response);
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
  UseQueryOptions<unknown[], Error>,
  "queryKey" | "queryFn"
>;

export function useSiteCategories(
  payload: GetSiteCategoriesPayload,
  options?: SiteCategoriesQueryOptions,
) {
  return useQuery<unknown[], Error>({
    queryKey: ["site-categories", payload],
    queryFn: () => fetchSiteCategories(payload),
    ...options,
  });
}