# 🛡️ Prohorini | Guardian for Women

[![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Prohorini** is an advanced, AI-driven safety ecosystem designed to empower women through real-time protection, community intelligence, and predictive monitoring. It bridges the gap between technology and personal safety, providing a comprehensive "guardian" experience.

---

## ✨ Key Features

### 📡 Real-time Intelligence

- **Live SOS Monitoring**: Instant emergency signal broadcasting with precise GPS tracking.
- **Threat Zone Mapping**: Dynamic visualization of unsafe areas using heatmaps and real-time crowd-sourced data.
- **Pulse Dashboard**: A high-level overview of community safety status and active alerts.

### 👥 Community Engagement

- **The Pulse (Community Feed)**: A verified social space for sharing safety updates, warnings, and community support.
- **Trusted Circles**: Managed emergency contacts with automated notification systems via SMS/Email (integrated with Brevo).

### 🏛️ Administrative Command Center

- **Intelligence Dashboard**: Comprehensive monitoring for authorities/admins to track active SOS signals and manage reported incidents.
- **Infrastructure Management**: Tools for defining and refining threat zones (Safe/Danger/Intermediate).
- **Audit Logs**: Deep trace-ability of safety events and system interactions.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Clerk](https://clerk.com/) (Secure User Management)
- **Database & Realtime**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime Channels)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **GIS/Mapping**: [Leaflet](https://leafletjs.com/) with [Turf.js](https://turfjs.org/) & [React Leaflet](https://react-leaflet.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: [Brevo API](https://www.brevo.com/) (Email & SMS)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- npm / yarn / pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/prohorini.git
cd prohorini
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and populate it with your credentials:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role

# Notifications
BREVO_API_KEY=your_brevo_key
```

### 4. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the application.

---

## 📂 Project Structure

```text
├── src/
│   ├── app/                # Next.js App Router (Public/Protected paths)
│   ├── components/         # Reusable UI components (Atomic design)
│   ├── hooks/              # Custom React hooks (Redux, React Query, Utils)
│   ├── lib/                # Third-party configurations (Supabase, Clerk)
│   ├── services/           # Data fetching and business logic
│   ├── typeScript/         # Global type definitions
│   └── utils/              # Helper functions and constants
└── public/                 # Static assets (Images, Icons)
```

---

## 🔐 Security & Privacy

- **AES-256 Encryption** for sensitive location data.
- **RBAC (Role-Based Access Control)** for User and Admin panels.
- **Privacy First**: Location data is only shared with trusted contacts or during an active SOS window.

## 🤝 Contributing

We welcome contributions to make Prohorini even better. Please refer to our contributing guidelines before submitting a pull request.

---

Developed by SUMAN NANDI with ❤️ for a safer tomorrow.
