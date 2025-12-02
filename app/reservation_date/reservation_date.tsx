"use server";

import { createClient } from '@/utils/supabase/server';

export default async function select_reservation_date() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("rserve_form").select("reservation_date");
    return {data};
    
  } catch (error) {
    return {error};
  }
}

