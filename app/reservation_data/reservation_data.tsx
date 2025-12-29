"use server";

import { createClient } from "@/utils/supabase/server";

export async function select_reservation_data() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rserve_form_public")
      .select("reservation_date");
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function CheckData(checktime: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rserve_form_public")
      .select("reservation_date")
      .eq("reservation_date", checktime);
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function insert_reservation_data(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number");
  const grade = formData.get("grade");
  const school = formData.get("school");
  const kinds = formData.get("kinds");
  const date = formData.get("date");

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("rserve_form").insert({
      reserver: name,
      mail: email,
      phone_number: phone_number,
      grade: grade,
      type: kinds,
      school: school,
      reservation_date: date,
    });
    console.log("insert error", error);
  } catch (error) {
    console.log(error)
    return { error };
  }
}
