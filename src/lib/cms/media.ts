import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { MediaAssetRow } from "@/lib/cms/types";

export async function listMediaAdmin(): Promise<MediaAssetRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as MediaAssetRow[];
}

export async function getMediaByIdAdmin(id: string): Promise<MediaAssetRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("media_assets").select("*").eq("id", id).maybeSingle();
  return (data as MediaAssetRow | null) ?? null;
}
