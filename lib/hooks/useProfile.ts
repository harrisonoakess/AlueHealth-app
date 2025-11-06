import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  due_date: string | null;
  child_number: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  onboarding_complete?: boolean | null;
  created_at?: string;
};

type FetchOptions = {
  isRefetch?: boolean;
};

export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async ({ isRefetch }: FetchOptions = {}) => {
    setError(null);
    if (isRefetch) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(user);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      setProfile((data as ProfileRow | null) ?? null);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load profile");
    } finally {
      if (isRefetch) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (changes: Partial<ProfileRow>) => {
      if (!user) throw new Error("You must be signed in to update your profile.");

      setSaving(true);
      setError(null);

      try {
        const payload = {
          id: user.id,
          ...changes,
        };

        const { data, error: upsertError } = await supabase
          .from("profiles")
          .upsert(payload, { onConflict: "id" })
          .select()
          .single();

        if (upsertError) throw upsertError;

        setProfile((data as ProfileRow | null) ?? null);
        return data as ProfileRow | null;
      } catch (err: any) {
        setError(err?.message ?? "Failed to update profile");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [user],
  );

  const refresh = useCallback(() => fetchProfile({ isRefetch: true }), [fetchProfile]);

  return {
    user,
    profile,
    loading,
    refreshing,
    saving,
    error,
    refresh,
    updateProfile,
  };
}
