"use server";

import { createClient } from '@/utils/supabase/server';

export async function select_reservation_data() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("rserve_form").select("reservation_date");
    return {data};
    
  } catch (error) {
    return {error};
  }
}

export async function insert_reservation_data(formData:FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const grade = formData.get('grade');
  const school = formData.get('school');
  const kinds = formData.get('kinds');
  const date = formData.get('date');

  console.log(name, email, grade, school, kinds, date);
  try {
    const supabase = await createClient();
    const { error } = await supabase
    .from("rserve_form")
    .insert({
      reserver: name,
      mail: email,
      grade: grade,
      type: kinds,
      school: school,
      reservation_date: date
    });
    console.log("送信成功");
    console.log(error);
  } catch (error) {
    console.log(error);
    return {error};
  }
}



