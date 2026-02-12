import { Prompt } from "@/types/prompt";

export const MOCK_PROMPTS: Prompt[] = [
    {
        id: "promo-card",
        type: "promo",
        title: "Join the Workshop",
        tags: [],
        prompt: "",
        author: { name: "", avatar: "" },
        image: "",
        imageAlt: "",
        rotation: "rotate-2",
        codeSnippet: "",
    },
    {
        id: "card-1",
        title: "Retro Dashboard UI",
        tags: ["#Analytics", "#RetroUI", "#NeoBrutalism"],
        prompt: "A retro-futuristic dashboard interface with glowing green text on a dark CRT monitor background, scanlines visible, chunky 8-bit icons, high contrast, neo-brutalist layout with thick borders, data visualization charts in wireframe style, cyberpunk aesthetic.",
        author: {
            name: "@pixel_artisan",
            avatar: "https://i.pravatar.cc/150?u=pixel_artisan",
        },
        image: "https://picsum.photos/seed/retro/800/600",
        gallery: [
            "https://picsum.photos/seed/retro/800/600",
            "https://picsum.photos/seed/retro2/800/800",
            "https://picsum.photos/seed/retro3/600/1000",
        ],
        imageAlt: "Retro dashboard UI design",
        pinColor: "bg-accent-orange",
        rotation: "-rotate-2",
        featured: true,
        codeSnippet: `<div class="dashboard-container">
  <!-- Sidebar Navigation -->
  <nav class="sidebar">
    <ul>
      <li class="active"><a href="#">Overview</a></li>
      <li><a href="#">Analytics</a></li>
      <li><a href="#">Settings</a></li>
    </ul>
  </nav>
  
  <!-- Main Content Area -->
  <main class="content">
    <div class="card stat-card">
      <h3>Active Users</h3>
      <span class="value">12,345</span>
      <div class="chart-placeholder"></div>
    </div>
  </main>
</div>`,
    },
    {
        id: "card-2",
        title: "Neon Mobile App",
        tags: ["#Mobile", "#AppDesign", "#Neon"],
        prompt: "High-fidelity mobile app design for a music streaming service, dark mode with vibrant neon pink and blue accents, glassmorphism effects on cards, large bold typography, minimal navigation bar, album art with glowing drop shadows.",
        author: {
            name: "@neon_dreams",
            avatar: "https://i.pravatar.cc/150?u=neon_dreams",
        },
        image: "https://picsum.photos/seed/neon/800/600",
        gallery: [
            "https://picsum.photos/seed/neon/800/600",
            "https://picsum.photos/seed/neon-detail/800/800",
            "https://picsum.photos/seed/neon-mobile/400/800",
        ],
        imageAlt: "Neon mobile app interface",
        pinColor: "bg-primary",
        rotation: "rotate-1",
        codeSnippet: `.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.neon-text {
  color: #fff;
  text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #ff00de,
    0 0 42px #ff00de,
    0 0 82px #ff00de;
}`,
    },
    {
        id: "card-3",
        title: "E-commerce Hero",
        tags: ["#Shop", "#WebDesign", "#Minimal"],
        prompt: "Clean and minimalist e-commerce website hero section for a luxury sneaker brand, large high-quality product image on the right, bold serif typography on the left, plenty of whitespace, 'Shop Now' button with a subtle hover animation, soft pastel background.",
        author: {
            name: "@minimal_store",
            avatar: "https://i.pravatar.cc/150?u=minimal_store",
        },
        image: "https://picsum.photos/seed/shop/800/600",
        gallery: [
            "https://picsum.photos/seed/shop/800/600",
            "https://picsum.photos/seed/shop-hero/1200/600",
        ],
        imageAlt: "E-commerce hero section",
        pinColor: "bg-accent-green",
        rotation: "-rotate-1",
        codeSnippet: `const HeroSection = () => {
  return (
    <section className="flex h-screen items-center justify-between px-20 bg-cream-50">
      <div className="space-y-6 max-w-xl">
        <h1 className="text-6xl font-serif text-gray-900 leading-tight">
          Step Into <br/>
          <span className="italic">Future Comfort</span>
        </h1>
        <p className="text-lg text-gray-600">
          Discover the blend of premium materials and ergonomic design.
        </p>
        <button className="px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors">
          Shop Collection
        </button>
      </div>
      <div className="hero-image">
        <img src="/shoe-hero.png" alt="Luxury Sneaker" />
      </div>
    </section>
  );
};`,
    },
    {
        id: "card-4",
        title: "Developer Portfolio",
        tags: ["#Developer", "#Portfolio", "#Dark"],
        prompt: "Personal portfolio website for a full-stack developer, dark theme with code snippet background textures, monospaced typography, timeline component for work experience, skill badges with glow effects, contact form with floating labels.",
        author: {
            name: "@dev_guru",
            avatar: "https://i.pravatar.cc/150?u=dev_guru",
        },
        image: "https://picsum.photos/seed/developer/800/600",
        imageAlt: "Developer portfolio website",
        pinColor: "bg-ink",
        rotation: "rotate-2",
        codeSnippet: `// Experience Data
const experiences = [
  {
    role: "Senior Frontend Engineer",
    company: "TechCorp",
    period: "2020 - Present",
    description: "Leading the core UI team, migrating legacy codebase to React."
  },
  {
    role: "Full Stack Developer",
    company: "StartupInc",
    period: "2018 - 2020",
    description: "Built scalable APIs with Node.js and designed responsive UIs."
  }
];

// In Component
{experiences.map((exp, index) => (
  <TimelineItem key={index} data={exp} />
))}`,
    },
    {
        id: "card-5",
        title: "Crypto Wallet",
        tags: ["#Trend", "#Finance", "#Mobile"],
        prompt: "Modern cryptocurrency wallet mobile app interface, clean white background with bold black borders (neo-brutalism light), colorful pill-shaped buttons for 'Send' and 'Receive', real-time graph with gradient fill, large balance display.",
        author: {
            name: "@crypto_king",
            avatar: "https://i.pravatar.cc/150?u=crypto_king",
        },
        image: "https://picsum.photos/seed/crypto/800/600",
        imageAlt: "Crypto wallet app design",
        pinColor: "bg-accent-orange",
        rotation: "-rotate-1",
        codeSnippet: `fun WalletScreen(
    balance: String,
    onSendClick: () -> Unit,
    onReceiveClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text(
            text = "Total Balance",
            style = MaterialTheme.typography.labelMedium
        )
        Text(
            text = balance,
            style = MaterialTheme.typography.displayLarge,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            ActionButton(text = "Send", color = Color.Green, onClick = onSendClick)
            ActionButton(text = "Receive", color = Color.Blue, onClick = onReceiveClick)
        }
    }
}`,
    },
    {
        id: "card-6",
        title: "Task Manager",
        tags: ["#UI", "#Productivity", "#Clean"],
        prompt: "Productivity dashboard for project management, Kanban board layout with drag-and-drop cards, soft shadows, rounded corners, pastel color coding for tags, user avatars overlapping, sidebar navigation with collapsible menus.",
        author: {
            name: "@task_master",
            avatar: "https://i.pravatar.cc/150?u=task_master",
        },
        image: "https://picsum.photos/seed/task/800/600",
        imageAlt: "Task manager dashboard",
        pinColor: "bg-primary",
        rotation: "rotate-1",
        codeSnippet: `interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assignees: User[];
}

function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const columns = ['todo', 'in-progress', 'done'];

  return (
    <div className="flex gap-4 h-full p-6 bg-gray-50">
      {columns.map(status => (
        <div key={status} className="flex-1 bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold mb-4 uppercase text-gray-500">{status}</h3>
          <div className="space-y-3">
            {tasks.filter(t => t.status === status).map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}`,
    },
];
