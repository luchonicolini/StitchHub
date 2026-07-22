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
  let dataStatus: "ready" | "demo" | "empty" | "error" = "empty";
  let stats = {
    totalPrompts: 0,
    totalContributors: 0,
    totalLikes: 0
  };
  const demoPrompts = MOCK_PROMPTS.map(prompt => (
    prompt.type === 'promo' ? prompt : { ...prompt, isDemo: true }
  ));

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const ITEMS_PER_PAGE = 12;

    const { data, error } = await supabase
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

    if (error) {
      dataStatus = "error";
    } else if (data && data.length > 0) {
      const dbPrompts: Prompt[] = (data as unknown as DesignDB[]).map(mapDesignToPrompt);
      const promoCard = MOCK_PROMPTS.find(p => p.type === 'promo');
      initialPrompts = promoCard ? [promoCard, ...dbPrompts] : dbPrompts;
      dataStatus = "ready";
    } else {
      dataStatus = "demo";
      initialPrompts = demoPrompts;
    }

    // Fetch Stats
    const [
      { count: designsCount },
      { count: profilesCount },
      { count: likesCount }
    ] = await Promise.all([
      supabase.from('designs').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('likes').select('*', { count: 'exact', head: true })
    ]);

    stats = {
      totalPrompts: designsCount || 0,
      totalContributors: profilesCount || 0,
      totalLikes: likesCount || 0
    };
  } else {
    dataStatus = "error";
  }

  return <WorkshopPageClient initialPrompts={initialPrompts} stats={stats} dataStatus={dataStatus} />;
}
