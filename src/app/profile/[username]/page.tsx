import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
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
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    const supabase = await createClient();

    const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('username', decodedUsername)
        .single();

    if (data) {
        return {
            title: `${data.username}'s Profile | StitchHub`,
            description: `Check out ${data.username}'s digital designs and prompts on StitchHub.`,
            openGraph: {
                title: `${data.username}'s Profile | StitchHub`,
                description: `Check out ${data.username}'s digital designs and prompts on StitchHub.`,
                images: data.avatar_url ? [data.avatar_url] : [],
            },
        };
    }

    return {
        title: 'Profile Not Found | StitchHub',
    };
}

export default async function PublicProfilePage({ params }: Props) {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);
    const supabase = await createClient();

    // Fetch the user's profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, bio, website')
        .eq('username', decodedUsername)
        .single();

    if (profileError || !profile) {
        notFound();
    }

    // Fetch their public designs
    const { data: designsData } = await supabase
        .from('designs')
        .select(`
            *,
            profiles (
                username,
                avatar_url
            )
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

    const totalDesigns = designsData?.length || 0;

    // Default counts
    let followerCount = 0;
    let followingCount = 0;

    try {
        // Fetch Follower count (people following this user)
        const { count: fCount, error: fError } = await supabase
            .from('followers')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', profile.id);
        
        if (fError) {
             console.warn("Could not fetch followers (table might be missing).");
        } else {
             followerCount = fCount || 0;
        }

        // Fetch Following count (people this user is following)
        const { count: flCount, error: flError } = await supabase
            .from('followers')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', profile.id);
            
        if (flError) {
             console.warn("Could not fetch following count (table might be missing).");
        } else {
             followingCount = flCount || 0;
        }
    } catch (err) {
        console.error("Error fetching follower stats:", err);
    }

    // Process designs into Prompts
    const processedDesigns = designsData
        ? designsData.map((d, index) => mapDesignToPrompt(d as unknown as DesignDB, index))
        : [];

    return (
        <div className="min-h-screen bg-background-light selection:bg-primary selection:text-ink">
            <WorkshopHeader showSearch={true} />

            <main className="pb-20">
                <PublicProfileClient
                    profile={profile}
                    designs={processedDesigns}
                    totalDesigns={totalDesigns}
                    followerCount={followerCount || 0}
                    followingCount={followingCount || 0}
                />
            </main>

            <div className="border-t-4 border-ink bg-white">
                <Footer />
            </div>
        </div>
    );
}
