import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
  hasServiceRole,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { JobRow } from "@/lib/cms/types";

export function jobPublicUrl(slug: string) {
  return `/careers/${slug}`;
}

export async function listOpenJobs(): Promise<JobRow[]> {
  if (!isSupabaseConfigured() || !hasServiceRole()) return [];
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data as JobRow[];
  } catch {
    return [];
  }
}

export async function getPublicJobBySlug(slug: string): Promise<JobRow | null> {
  if (!isSupabaseConfigured() || !hasServiceRole()) return null;
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("slug", slug)
      .in("status", ["published", "closed"])
      .is("deleted_at", null)
      .maybeSingle();
    if (error || !data) return null;
    return data as JobRow;
  } catch {
    return null;
  }
}

export async function listJobsAdmin(): Promise<JobRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data as JobRow[];
}

export async function getJobByIdAdmin(id: string): Promise<JobRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  return (data as JobRow | null) ?? null;
}
