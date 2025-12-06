import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "@lib/supabase.client";

export class GenericRepository {
  private client!: SupabaseClient;
  private name!: string;

  constructor(name: string) {
    this.client = supabaseClient;
    this.name = name;
  }

  getAll() {
    return this.client.from(this.name).select();
  }
}
