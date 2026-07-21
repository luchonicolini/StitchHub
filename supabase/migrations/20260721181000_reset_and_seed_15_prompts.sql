-- Clean reset of test data and seed of 15 standard prompts
ALTER TABLE public.designs ALTER COLUMN user_id DROP NOT NULL;

TRUNCATE TABLE public.likes CASCADE;
TRUNCATE TABLE public.followers CASCADE;
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.designs CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

INSERT INTO public.designs (id, title, prompt_content, code_snippet, image_url, image_urls, category, likes_count, is_pinned, created_at)
VALUES
(
    1,
    'Retro Neon Dashboard UI',
    'A retro-futuristic dashboard interface with glowing green text on a dark CRT monitor background, scanlines visible, chunky 8-bit icons, high contrast, neo-brutalist layout with thick borders, data visualization charts in wireframe style, cyberpunk aesthetic.',
    '<div class="dashboard-container"><nav class="sidebar"><ul><li class="active"><a href="#">Overview</a></li><li><a href="#">Analytics</a></li><li><a href="#">Settings</a></li></ul></nav><main class="content"><div class="card stat-card"><h3>Active Users</h3><span class="value">12,345</span><div class="chart-placeholder"></div></div></main></div>',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'],
    '#Analytics',
    482,
    true,
    NOW() - INTERVAL '14 days'
),
(
    2,
    'SaaS Analytics Engine',
    'Modern Neo-Brutalist SaaS Analytics Dashboard with bold yellow & purple accents, thick black 4px borders, hard drop shadows, high contrast revenue metric cards, line charts, and status pills.',
    '<div class="saas-card"><div class="header flex justify-between"><h2>Monthly Recurring Revenue</h2><span class="badge bg-yellow">$48,250</span></div><div class="chart-area"><canvas id="mrrChart"></canvas></div></div>',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'],
    '#Analytics',
    315,
    true,
    NOW() - INTERVAL '12 days'
),
(
    3,
    'Crypto & Web3 Vault UI',
    'Dark mode crypto wallet interface featuring neon green highlights, crisp balance cards, quick token swap widget, transaction history table, and hard border neo-brutalist styling.',
    '<div class="wallet-card bg-black text-white p-6 border-4 border-white"><span class="text-xs font-mono text-gray-400">Total Portfolio Value</span><h1 class="text-4xl font-black text-green-400 mt-1">$142,890.50</h1></div>',
    'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80'],
    '#Developer',
    289,
    false,
    NOW() - INTERVAL '10 days'
),
(
    4,
    'Neo-Brutalist Checkout Page',
    'E-commerce order summary and payment form in pastel pink and electric blue, featuring high contrast input fields, promo code sticker badge, and 3D hard shadow CTA button.',
    '<form class="checkout-form bg-pink-100 p-8 border-4 border-black"><h2 class="text-2xl font-black uppercase mb-4">Order Summary</h2><button class="w-full bg-blue-500 text-white font-black py-4 uppercase">Pay $129.00</button></form>',
    'https://images.unsplash.com/photo-1556742049-0a67e5621413?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1556742049-0a67e5621413?auto=format&fit=crop&w=1200&q=80'],
    '#Shop',
    198,
    false,
    NOW() - INTERVAL '9 days'
),
(
    5,
    'Mobile Fitness Workout Tracker',
    'Mobile app card design for workout tracking, featuring circular progress ring, heart rate gauge, dark mode with neon lime accents, and activity breakdown list.',
    '<div class="fitness-card bg-neutral-900 text-white p-6 border-4 border-lime-400"><h3 class="font-black text-xl text-lime-400">DAILY BURN</h3></div>',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80'],
    '#Mobile',
    412,
    true,
    NOW() - INTERVAL '8 days'
),
(
    6,
    'AI Command Console & Prompt IDE',
    'Developer-focused AI prompt engineer console with syntax highlighting, token usage counter, model selection dropdown, and terminal execution log window.',
    '<div class="ai-console bg-gray-950 text-green-400 font-mono p-6 border-4 border-gray-700"><span>MODEL: gpt-4o-realtime</span></div>',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'],
    '#Developer',
    530,
    true,
    NOW() - INTERVAL '7 days'
),
(
    7,
    'Editorial Magazine Article Card',
    'Clean, bold editorial article card layout featuring exaggerated typography, thick black borders, category sticker, reading time indicator, and author signature.',
    '<article class="magazine-card bg-amber-50 p-6 border-4 border-black"><h2 class="font-black text-3xl uppercase text-black">The Death of Bland Minimalist Web Design</h2></article>',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'],
    '#UI',
    165,
    false,
    NOW() - INTERVAL '6 days'
),
(
    8,
    'Cyberpunk Audio Wave Player',
    'Vibrant music player component with interactive waveform visualizer, album cover glow, volume slider, and neo-brutalist playback controls.',
    '<div class="player bg-purple-950 text-purple-200 p-6 border-4 border-pink-500"><h4 class="font-black text-white text-lg">HYPERDRIVE</h4></div>',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'],
    '#Mobile',
    240,
    false,
    NOW() - INTERVAL '5 days'
),
(
    9,
    'Fintech Expense Breakdown',
    'Financial budget tracker card with category badges, percentage progress bars, weekly spending limits, and quick add transaction modal button.',
    '<div class="budget-card bg-white p-6 border-4 border-black"><h3 class="font-black text-xl uppercase">Weekly Budget</h3></div>',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'],
    '#Analytics',
    210,
    false,
    NOW() - INTERVAL '5 days'
),
(
    10,
    'Developer Documentation Portal',
    'Sleek API documentation sidebar and code viewer widget with copy-to-clipboard button, endpoint HTTP badges (GET, POST), and JSON response pre-tag.',
    '<div class="doc-widget bg-slate-900 text-slate-100 p-6 border-4 border-slate-700 font-mono"><span class="bg-green-500 text-black px-2 py-0.5 text-xs font-bold">GET</span></div>',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'],
    '#Developer',
    380,
    true,
    NOW() - INTERVAL '4 days'
),
(
    11,
    'NFT Marketplace Collection Card',
    'Digital art NFT auction card featuring live countdown timer, highest bidder avatar, current ETH price badge, and bold placing bid button.',
    '<div class="nft-card bg-neutral-950 text-white p-5 border-4 border-cyan-400"><span class="font-black text-lg text-white">4.85 ETH</span></div>',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80'],
    '#Shop',
    175,
    false,
    NOW() - INTERVAL '3 days'
),
(
    12,
    'Kanban Task Management Card',
    'Project management task card with urgency status pill, avatar stack of assigned team members, progress checklist counter, and drag handle.',
    '<div class="task-card bg-yellow-100 p-5 border-3 border-black"><h4 class="font-black text-lg text-black">Refactor Authentication Flow</h4></div>',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1200&q=80'],
    '#Analytics',
    295,
    false,
    NOW() - INTERVAL '2 days'
),
(
    13,
    'Cyberpunk Auth & Login Form',
    'High contrast futuristic login screen component with glitch text styling, social login buttons, remember session checkbox, and password visibility toggle.',
    '<div class="auth-box bg-black text-green-400 p-8 border-4 border-green-500 font-mono"><h2 class="text-3xl font-black uppercase text-white mb-6">ACCESS TERMINAL</h2></div>',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'],
    '#Developer',
    440,
    true,
    NOW() - INTERVAL '2 days'
),
(
    14,
    'Food Delivery Mobile Order Card',
    'Mobile app card for food delivery featuring dish thumbnail, star rating badge, estimated delivery countdown, and quick reorder button.',
    '<div class="food-card bg-orange-50 p-4 border-3 border-black"><h4 class="font-black text-lg text-black">Artisanal Ramen Bowl</h4></div>',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80'],
    '#Mobile',
    190,
    false,
    NOW() - INTERVAL '1 day'
),
(
    15,
    'Portfolio Hero Sticker Section',
    'Eye-catching Neo-Brutalist portfolio hero header component with floating sticker badges, bold headline typography, social icon strip, and contact CTA button.',
    '<header class="hero bg-yellow-300 p-12 border-4 border-black text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"><span class="inline-block bg-black text-yellow-300 font-mono font-bold text-xs px-3 py-1 uppercase mb-4">AVAILABLE FOR FREELANCE</span><h1 class="font-black text-5xl uppercase leading-none mb-6">CRAFTING DIGITAL ARTISAN UIs</h1><button class="bg-black text-white font-black text-lg px-8 py-4 uppercase border-2 border-black hover:bg-white hover:text-black">LET''S BUILD</button></header>',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    ARRAY['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'],
    '#UI',
    498,
    true,
    NOW() - INTERVAL '1 hour'
);

SELECT setval('designs_id_seq', (SELECT MAX(id) FROM public.designs));
