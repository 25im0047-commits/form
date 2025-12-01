import { createClient } from '@/utils/supabase/server';

export default async function reservation_date() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("rserve_form").select("reservation_date, mail");
    await console.log("Fetched reservation dates:", data);

    return <pre>{JSON.stringify(data, null, 2)}</pre>
    
  } catch (error) {
    await console.error("Error fetching reservation dates:", error);
    return <div>Error loading reservation dates.</div>;
  }
}