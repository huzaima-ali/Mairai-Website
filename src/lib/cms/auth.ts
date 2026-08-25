import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/cms/types";
import type { User } from "@supabase/supabase-js";

export type AdminSession = {
  user: User;
  profile: ProfileRow;
};

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createServerSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError || !profile || !(profile as ProfileRow).is_admin) return null;
    return { user: userData.user, profile: profile as ProfileRow };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
