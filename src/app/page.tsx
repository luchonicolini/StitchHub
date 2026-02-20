import { WorkshopPageClient } from "@/components/workshop/WorkshopPageClient";
import { createClient } from "@supabase/supabase-js";
import { Prompt } from "@/types/prompt";
import { DesignDB, mapDesignToPrompt } from "@/types/design";
import { MOCK_PROMPTS } from "@/data/mockPrompts";

export const revalidate = 60; // Revalidate the page every 60 seconds (ISR)

export default async function Home() {
  // 1. Fetch initial designs from Supabase (server-side)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let initialPrompts: Prompt[] = [];

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const ITEMS_PER_PAGE = 12;

    const { data } = await supabase
      .from('designs')
      .select(`
                *,
                profiles (
                    username,
                    avatar_url
                )
            `)
      .order('created_at', { ascending: false })
      .limit(ITEMS_PER_PAGE);

    if (data) {
      const dbPrompts: Prompt[] = (data as unknown as DesignDB[]).map(mapDesignToPrompt);

      const promoCard = MOCK_PROMPTS.find(p => p.type === 'promo');
      initialPrompts = promoCard ? [promoCard, ...dbPrompts] : dbPrompts;
    }
  }

  return <WorkshopPageClient initialPrompts={initialPrompts} />;
}
