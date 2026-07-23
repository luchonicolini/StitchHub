import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { DesignDB, mapDesignToPrompt } from '@/types/design';
import { WorkshopHeader } from '@/components/workshop/WorkshopHeader';
import { Footer } from '@/components/workshop/Footer';
import PublicProfileClient from '@/app/profile/[username]/PublicProfileClient';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const createClient = async () => {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { username } = await params;
        const decodedUsername = decodeURIComponent(username || '');
        const cleanUsername = decodedUsername.replace(/^@/, '').trim();
        const supabase = await createClient();

        const { data } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .or(`username.eq.${cleanUsername},username.eq.@${cleanUsername}`)
            .maybeSingle();

        const displayUsername = data?.username || cleanUsername || 'User';

        return {
            title: `${displayUsername}'s Profile | StitchHub`,
            description: `Check out ${displayUsername}'s digital designs and prompts on StitchHub.`,
            openGraph: {
                title: `${displayUsername}'s Profile | StitchHub`,
                description: `Check out ${displayUsername}'s digital designs and prompts on StitchHub.`,
                images: data?.avatar_url ? [data.avatar_url] : [],
            },
        };
    } catch {
        return {
            title: 'Creator Profile | StitchHub',
            description: 'Explore creator designs on StitchHub',
        };
    }
}

export default async function PublicProfilePage({ params }: Props) {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username || '');
    const cleanUsername = decodedUsername.replace(/^@/, '').trim();
    const supabase = await createClient();

    let profile: any = null;

    try {
        const { data } = await supabase
            .from('profiles')
            .select('*, bio, website')
            .or(`username.eq.${cleanUsername},username.eq.@${cleanUsername}`)
            .maybeSingle();
        profile = data;
    } catch (err) {
        console.error("Error fetching profile from DB:", err);
    }

    // Fallback profile object for demo/seed creators or when DB fails
    const effectiveProfile = profile || {
        id: `demo-${cleanUsername || 'creator'}`,
        username: cleanUsername || 'creator',
        full_name: cleanUsername || 'Creator',
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername || 'creator'}`,
        bio: `Digital artisan & UI creator on StitchHub.`,
        website: null,
        created_at: new Date().toISOString(),
    };

    let designsData: any[] | null = null;
    let followerCount = 0;
    let followingCount = 0;

    try {
        if (profile) {
            // Fetch public designs for real registered user
            const { data } = await supabase
                .from('designs')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .eq('user_id', profile.id)
                .eq('is_public', true)
                .order('created_at', { ascending: false });
            designsData = data;

            try {
                const { count: fCount } = await supabase
                    .from('followers')
                    .select('*', { count: 'exact', head: true })
                    .eq('following_id', profile.id);
                followerCount = fCount || 0;

                const { count: flCount } = await supabase
                    .from('followers')
                    .select('*', { count: 'exact', head: true })
                    .eq('follower_id', profile.id);
                followingCount = flCount || 0;
            } catch (err) {
                console.error("Error fetching follower stats:", err);
            }
        } else {
            // Fallback designs query for demo authors
            const { data } = await supabase
                .from('designs')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .eq('is_public', true)
                .limit(6);
            designsData = data;
        }
    } catch (err) {
        console.error("Error fetching profile designs:", err);
    }

    const totalDesigns = designsData?.length || 0;

    // Process designs into Prompts
    const processedDesigns = designsData
        ? designsData.map((d, index) => mapDesignToPrompt(d as unknown as DesignDB, index))
        : [];

    return (
        <div className="min-h-screen bg-background-light selection:bg-primary selection:text-ink">
            <WorkshopHeader showSearch={true} />

            <main className="pb-20">
                <PublicProfileClient
                    profile={effectiveProfile}
                    designs={processedDesigns}
                    totalDesigns={totalDesigns}
                    followerCount={followerCount}
                    followingCount={followingCount}
                />
            </main>

            <div className="border-t-4 border-ink bg-white">
                <Footer />
            </div>
        </div>
    );
}
