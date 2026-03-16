import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export type UserAddress = {
  id: string;
  full_name: string;
  company: string | null;
  email: string | null;
  phone: string;
  street: string;
  street_number_ext: string;
  street_number_int: string | null;
  colonia: string;
  municipio: string;
  postal_code: string;
  state: string;
  country: string;
  address_reference: string | null;
  is_default: boolean;
};

const QUERY_KEY = ["user-addresses"];

export function useUserAddresses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: !!user,
    queryFn: async (): Promise<UserAddress[]> => {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user!.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as UserAddress[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: Omit<UserAddress, "id" | "country" | "is_default"> & { is_default?: boolean }) => {
      const { error } = await supabase.from("user_addresses").insert({
        user_id: user!.id,
        country: "MX",
        ...payload,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_addresses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const defaultAddress = (query.data ?? []).find((a) => a.is_default) ?? null;

  return {
    ...query,
    addresses: query.data ?? [],
    defaultAddress,
    addAddress: addMutation.mutateAsync,
    adding: addMutation.isPending,
    setDefault: setDefaultMutation.mutateAsync,
    settingDefault: setDefaultMutation.isPending,
    deleteAddress: deleteMutation.mutateAsync,
    deleting: deleteMutation.isPending,
  };
}

