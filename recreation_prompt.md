# Project Recreation Prompt: VidioX AI

You are an expert Full Stack Developer specializing in **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Shadcn UI**. Your task is to recreate the "VidioX AI" application with exact fidelity to the design, structure, and functionality described below.

## 1. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Authentication**: Firebase (Client SDK)
- **Form Handling**: React Hook Form + Zod
- **Date Handling**: date-fns
- **Charts**: Recharts

## 2. Design System

### Colors & Theme
The application uses a **Neutral** base color with a specific CSS variable configuration.

**`app/globals.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

### Typography
- Font: **Inter** (from `next/font/google`)

### UI Configuration (`components.json`)
- Style: `default`
- Base Color: `neutral`
- CSS Variables: `true`
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`

## 3. Directory Structure

Recreate the following file structure:

```
project/
├── app/
│   ├── auth/
│   │   ├── forgot-password/page.tsx
│   │   ├── login/page.tsx
│   │   ├── reset-password/page.tsx
│   │   ├── signup/page.tsx
│   │   └── verify-email/page.tsx
│   ├── dashboard/page.tsx
│   ├── settings/page.tsx
│   ├── careers/page.tsx
│   ├── contact/page.tsx
│   ├── demo/page.tsx
│   ├── docs/page.tsx
│   ├── enhance/page.tsx
│   ├── features/page.tsx
│   ├── pricing/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── videos/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (Landing Page)
├── components/
│   ├── ui/ (Shadcn components: button, card, input, etc.)
│   ├── footer.tsx
│   ├── header.tsx
│   ├── mode-toggle.tsx
│   └── theme-provider.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── firebase.ts
│   └── utils.ts
├── middleware.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 4. Key Features & Implementation Details

### Authentication (`contexts/AuthContext.tsx`)
- Implement a robust `AuthContext` using Firebase Auth.
- Features: Login, Signup, Logout, Reset Password, Update Profile/Email/Password.
- **Persistence**: Ensure user session persists across reloads.
- **Firestore Integration**: Store user profiles in a `users` collection in Firestore.

### Landing Page (`app/page.tsx`)
- **Hero Section**: High-impact headline, "Get Started" CTA, animated elements using Framer Motion.
- **Features Section**: Grid layout showcasing AI capabilities.
- **Pricing Section**: Tiered pricing cards.
- **Testimonials**: Carousel or grid of user reviews.

### Dashboard (`app/dashboard/page.tsx`)
- Protected route (requires login).
- Overview of user stats (videos processed, storage used).
- Recent activity list.

### Settings (`app/settings/page.tsx`)
- Tabbed interface (Profile, Preferences, Notifications, Account).
- Form fields to update user details and app preferences.

### Video Enhancement (`app/enhance/page.tsx`)
- Drag-and-drop file upload zone.
- Configuration options for enhancement (Resolution, FPS, Denoise).
- Progress indication.

## 5. Setup Instructions

1.  **Initialize Project**:
    ```bash
    npx create-next-app@latest project --typescript --tailwind --eslint
    cd project
    ```

2.  **Install Dependencies**:
    ```bash
    npm install firebase framer-motion lucide-react react-hook-form zod @hookform/resolvers/zod date-fns react-day-picker@^8.10.0 recharts next-themes sonner clsx tailwind-merge class-variance-authority @radix-ui/react-slot
    ```

3.  **Setup Shadcn UI**:
    ```bash
    npx shadcn-ui@latest init
    # Select Default style, Neutral color, CSS variables
    ```
    Install necessary components:
    ```bash
    npx shadcn-ui@latest add button card input label tabs select switch dropdown-menu avatar toast
    ```

4.  **Configure Environment**:
    Create `.env.local` with Firebase credentials:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    # ... other firebase config
    ```

5.  **Run Application**:
    ```bash
    npm run dev
    ```

This prompt provides all the necessary blueprints to reconstruct the VidioX AI application with pixel-perfect accuracy to the original design.
