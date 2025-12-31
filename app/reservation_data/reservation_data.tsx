"use server";

import { createClient, createAdminClient  } from "@/utils/supabase/server";
import { headers } from 'next/headers';


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
    if (error){
      return { success:false, error };

    } else {
      return { success:true };
    }


  } catch (error) {
    console.log("error", error);
    return { error };
  }
}

export async function delete_reservation_data() {
  console.log("delete関数実行されました。")
  // 1. ユーザーのipアドレスを取得するを見つける
  // const headerList = await headers();
  // const userIpReal = headerList.get('x-forwarded-for');
  // const userIp = userIpReal ? userIpReal.split(',')[0]: '127.0.0.1';

  // 2. supabaseからinsertしたデータを取得
  const userIp = '127.0.0.1' // テスト用のipアドレス(supabaseのipも同じにする)
  const supabase_admin= await createAdminClient();
  const id_record = await supabase_admin
  .from('rserve_form')
  .select('id, ip_address')
  .eq('ip_address', userIp)
  .order('created_at', { ascending: false })
  .limit(1)
  .single();
  console.log("id_record", id_record);

  // 3. そのIDで消す
  if (id_record) {
    const{error} = await supabase_admin
      .from('rserve_form')
      .delete()
      .eq('id', id_record.data?.id);
    console.log("delete error", {error});
  }
}
// 
// ipアドレスを持ってくる方法を考える
// {ascending: false}とは？
