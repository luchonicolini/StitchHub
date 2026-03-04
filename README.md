<div align="center">
  <img src="public/images/favicon.ico" alt="StitchHub Logo" width="100"/>
  <h1>🧵 StitchHub</h1>
  <p><strong>The Neo-Brutalist Prompt & UI Design Gallery</strong></p>
</div>

---

**StitchHub** is a vibrant, community-driven platform where developers, designers, and AI enthusiasts can share their best UI designs, the prompts used to generate them, and the underlying code snippets. Built with a bold, high-contrast **Neo-Brutalist** aesthetic, StitchHub makes discovering inspiration as striking as the designs themselves.

## ✨ Features

- **🎨 Neo-Brutalist UI:** A unique, raw, and high-impact design language featuring thick borders, sharp shadows, and vibrant colors (ink, accent-orange, accent-green, primary yellow).
- **📝 Prompt & Code Sharing:** Not just images! Every design can include the exact AI prompt used to create it, along with the HTML/React/Tailwind code snippet to reproduce it.
- **🔐 User Authentication:** Powered by Supabase, users can sign up, log in, and manage their profiles securely.
- **❤️ Like & Save:** Authenticated users can "like" their favorite designs and save them to their personal collection.
- **📌 Pinned Collections:** Users can pin their most important designs to the top of their personal profile.
- **🔍 Smart Filtering:** Quickly filter the global workshop feed by tags like `#Mobile`, `#Shop`, `#UI`, `#Analytics`, and use the search bar to find exactly what you need.
- **📱 Fully Responsive:** The masonry grid and modal layouts adapt seamlessly from desktop monitors down to mobile screens.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom Neo-Brutalist base utilities.
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm (or pnpm/yarn) installed.

### 1. Clone & Install
```bash
git clone https://github.com/your-username/StitchHub.git
cd stitch-hub
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root of the project and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Schema Reference (Supabase)
StitchHub relies on three main tables:
- `profiles`: Stores user data, avatars, and bios. Links to Supabase Auth.
- `designs`: Stores the uploaded designs (title, category, prompt, code snippet, image URLs).
- `likes`: A join table tracking which user liked which design.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

---
*Crafted with bold strokes and thick borders.*
