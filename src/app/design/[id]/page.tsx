import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { DesignDB, mapDesignToPrompt } from '@/types/design';
import { WorkshopHeader } from '@/components/workshop/WorkshopHeader';
import { Footer } from '@/components/workshop/Footer';
import DesignClientView from './DesignClientView';
import { MOCK_PROMPTS } from '@/data/mockPrompts';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Set up server-side Supabase client
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
    const { id } = await params;

    // Check if it's a mock prompt first
    const isMock = !id.startsWith('db-');

    if (isMock) {
        const promptId = parseInt(id, 10);
        const mockData = MOCK_PROMPTS.find(p => parseInt(p.id, 10) === promptId);

        if (mockData) {
            return {
                title: `${mockData.title} | StitchHub`,
                description: mockData.prompt,
                openGraph: {
                    title: mockData.title,
                    description: mockData.prompt,
                    images: [mockData.image],
                },
            };
        }
    } else {
        const supabase = await createClient();
        const numericId = parseInt(id.replace('db-', ''), 10);

        if (!isNaN(numericId)) {
            const { data } = await supabase
                .from('designs')
                .select('title, prompt_content, image_url, profiles(username)')
                .eq('id', numericId)
                .single();

            if (data) {
                const authorData = data.profiles as { username: string } | { username: string }[] | null;
                const authorName = Array.isArray(authorData) ? authorData[0]?.username : authorData?.username;
                return {
                    title: `${data.title} | StitchHub`,
                    description: data.prompt_content,
                    openGraph: {
                        title: `${data.title} by ${authorName || 'Creator'}`,
                        description: data.prompt_content,
                        images: [data.image_url],
                    },
                };
            }
        }
    }

    return {
        title: 'Design Not Found | StitchHub',
    };
}

export default async function DesignPage({ params }: Props) {
    const { id } = await params;
    let designData = null;

    // Handle Mock Prompts Strategy
    const isMock = !id.startsWith('db-');

    if (isMock) {
        const promptId = parseInt(id, 10);
        const mockPrompt = MOCK_PROMPTS.find(p => parseInt(p.id, 10) === promptId);
        if (mockPrompt) {
            designData = mockPrompt;
        }
    } else {
        // Fetch from Database
        const supabase = await createClient();
        const numericId = parseInt(id.replace('db-', ''), 10);

        if (!isNaN(numericId)) {
            const { data, error } = await supabase
                .from('designs')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .eq('id', numericId)
                .single();

            if (!error && data) {
                designData = mapDesignToPrompt(data as unknown as DesignDB, 0);
            }
        }
    }

    if (!designData) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light selection:bg-primary selection:text-ink">
            {/* Top Navigation Bar */}
            <WorkshopHeader showSearch={false} />

            <main className="flex-grow pt-8 pb-20">
                <DesignClientView initialDesign={designData} />
            </main>

            {/* Footer */}
            <div className="border-t-4 border-ink bg-white">
                <Footer />
            </div>
        </div>
    );
}
