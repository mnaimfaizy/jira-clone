# GitHub Copilot Instructions for Jira Clone

## Project Overview

This is a full-featured Jira-inspired project management application built with Next.js 14 App Router, TypeScript, and Appwrite as the backend service. The application provides workspace management, team collaboration, member management, and comprehensive authentication features.

## Tech Stack

### Core Framework

- **Next.js 14+** with App Router (uses Server Components and Server Actions)
- **TypeScript** (strict mode enabled, target ES2017)
- **React 18+** with React Server Components

### Backend & Data

- **Appwrite** (Cloud or self-hosted) - BaaS for authentication, database, and storage
- **Hono.js** - Type-safe API routes in `/src/app/api/[[...route]]/route.ts`
- **TanStack Query (React Query)** - Data fetching, caching, and state management
- **Zod** - Runtime validation and schema definition

### UI & Styling

- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-built components (managed via `components.json`)
- **Lucide React & React Icons** - Icon libraries
- **next-themes** - Theme management (dark mode support)

### Forms & Validation

- **React Hook Form** - Form state management
- **Zod** - Schema validation with `@hookform/resolvers`

### Other Key Dependencies

- **date-fns** - Date manipulation
- **nuqs** - Type-safe URL state management
- **sonner** - Toast notifications
- **vaul** - Drawer component for mobile
- **react-use** - React hooks library

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication routes (sign-in, sign-up, forgot-password, etc.)
│   ├── (dashboard)/         # Main dashboard and workspace pages
│   ├── (standalone)/        # Standalone pages (workspace creation, etc.)
│   ├── api/[[...route]]/    # Hono.js API routes
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Shared UI components
│   └── ui/                  # shadcn/ui components
├── features/                # Feature-based modules
│   ├── auth/               # Authentication feature
│   │   ├── api/            # React Query hooks
│   │   ├── components/     # Auth-specific components
│   │   ├── server/         # Server-side route handlers
│   │   ├── constants.ts    # Auth constants
│   │   ├── queries.ts      # Server queries
│   │   └── schemas.ts      # Zod schemas
│   ├── members/            # Member management feature
│   └── workspaces/         # Workspace management feature
├── hooks/                   # Shared React hooks
├── lib/                     # Utility libraries
│   ├── appwrite.ts         # Appwrite client setup
│   ├── rpc.ts              # RPC utilities
│   ├── session-middleware.ts
│   └── utils.ts            # Shared utilities (cn, etc.)
└── config.ts               # Environment configuration
```

## Coding Guidelines

### General Principles

1. **Type Safety First**: Always use TypeScript with proper typing. Avoid `any` types.
2. **Server-First Approach**: Leverage React Server Components by default. Use Client Components only when needed (interactivity, hooks, browser APIs).
3. **Feature-Based Organization**: Group related code by feature (auth, workspaces, members) rather than by type.
4. **Validation Everywhere**: Use Zod schemas for both client and server-side validation.

### Next.js Patterns

#### App Router Structure

- Use **route groups** for layout organization: `(auth)`, `(dashboard)`, `(standalone)`
- Server Components by default; add `"use client"` only when necessary
- Use `loading.tsx` for loading states
- Use `error.tsx` for error boundaries

#### Data Fetching

```typescript
// Server Component (preferred)
export default async function Page() {
  const data = await serverQuery();
  return <Component data={data} />;
}

// Client Component with React Query
"use client";
export function Component() {
  const { data } = useGetData();
  return <div>{data?.name}</div>;
}
```

### File Naming Conventions

- **Components**: PascalCase for React components (`UserButton.tsx`, `WorkspaceCard.tsx`)
- **Hooks**: kebab-case with `use-` prefix (`use-create-workspace.ts`, `use-get-members.ts`)
- **Route files**: Next.js conventions (`page.tsx`, `layout.tsx`, `route.ts`)
- **Utilities**: kebab-case (`session-middleware.ts`, `utils.ts`)
- **Types**: kebab-case (`types.ts`)
- **Schemas**: kebab-case (`schemas.ts`)

### Component Patterns

#### Client Components

```typescript
"use client";

import { ComponentProps } from "@/types";
import { useFeature } from "@/features/feature/api/use-feature";

interface FeatureComponentProps {
  // Props here
}

export const FeatureComponent = ({ prop }: FeatureComponentProps) => {
  // Implementation
};
```

#### Server Components

```typescript
import { getServerQuery } from "@/features/feature/queries";

interface ServerComponentProps {
  // Props here
}

export default async function ServerComponent({ prop }: ServerComponentProps) {
  const data = await getServerQuery();
  return <div>{/* JSX */}</div>;
}
```

### API Routes (Hono.js)

- All API routes are in `/src/app/api/[[...route]]/route.ts`
- Use Hono.js router with type-safe middleware
- Validate requests with `@hono/zod-validator`
- Use session middleware for protected routes

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono().post(
  "/endpoint",
  sessionMiddleware,
  zValidator("json", schema),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    // Implementation
  },
);
```

### Data Fetching Patterns

#### React Query Hooks (Client)

```typescript
// File: src/features/feature/api/use-get-data.ts
import { useQuery } from "@tanstack/react-query";

export const useGetData = (id: string) => {
  return useQuery({
    queryKey: ["data", id],
    queryFn: async () => {
      const response = await fetch(`/api/data/${id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });
};
```

#### Server Queries

```typescript
// File: src/features/feature/queries.ts
import "server-only";
import { createSessionClient } from "@/lib/appwrite";

export const getServerData = async () => {
  const { databases } = await createSessionClient();
  // Query Appwrite
};
```

### Appwrite Integration

#### Client Setup (Server-only)

```typescript
// Always use in Server Components or API routes
import { createSessionClient } from "@/lib/appwrite";
import { createAdminClient } from "@/lib/appwrite";

// Session client (uses user's session)
const { account, databases, storage } = await createSessionClient();

// Admin client (uses API key)
const { account, users, databases } = await createAdminClient();
```

#### Environment Variables

- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Appwrite endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT` - Project ID
- `NEXT_APPWRITE_KEY` - API key (server-side only)
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID` - Database ID
- `NEXT_PUBLIC_APPWRITE_WORKSPACES_ID` - Workspaces collection ID
- `NEXT_PUBLIC_APPWRITE_MEMBERS_ID` - Members collection ID
- `NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID` - Images bucket ID

### Form Handling

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().trim().min(1, "Required"),
});

export const FormComponent = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Handle submit
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
```

### Zod Schema Patterns

```typescript
// src/features/feature/schemas.ts
import { z } from "zod";

export const createSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().trim().min(1, "Required").email(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

// For password confirmation
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Minimum 8 characters required"),
    confirmPassword: z.string().min(8, "Minimum 8 characters required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

### Styling Guidelines

- Use **Tailwind CSS** utility classes
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow shadcn/ui patterns for component variants (use `class-variance-authority`)
- Prefer Tailwind config over arbitrary values when possible
- Use CSS variables for theme colors (defined in `globals.css`)

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Allow override
)} />
```

### State Management

- **Server State**: TanStack Query (React Query)
- **URL State**: nuqs for type-safe URL parameters
- **Local State**: useState, useReducer
- **Form State**: React Hook Form

### Error Handling

- Use error boundaries (`error.tsx`) for page-level errors
- Handle API errors with try-catch in mutations
- Display user-friendly error messages with `sonner` toast
- Log errors to console in development

### Authentication Flow

1. User registers → Email verification sent (optional)
2. User logs in → Session cookie set (`AUTH_COOKIE`)
3. Protected routes check session via middleware
4. Server components use `createSessionClient()`
5. Logout clears session cookie

### Workspace & Members

- **Workspaces**: User can create/update workspaces, upload avatars
- **Members**: Role-based (Admin/Member), invite via code
- **Permissions**: Admins can manage workspace and members

## Performance Considerations

- Use Server Components for static/data-fetching components
- Use `loading.tsx` and `Suspense` for loading states
- Implement optimistic updates with React Query
- Use `Image` from `next/image` for optimized images
- Lazy load heavy components with `dynamic()`

## Testing & Quality

- Use TypeScript strict mode
- Validate all inputs with Zod
- Handle loading and error states in UI
- Use React Query's built-in retry and caching
- Follow accessibility best practices (Radix UI is accessible by default)

## Common Patterns

### Creating a New Feature

1. Create feature directory: `src/features/feature-name/`
2. Add schemas: `schemas.ts` (Zod validation)
3. Add types: `types.ts` (TypeScript interfaces)
4. Add server queries: `queries.ts` (server-only)
5. Add API routes: `server/route.ts` (Hono handlers)
6. Add React Query hooks: `api/use-*.ts`
7. Add components: `components/*.tsx`
8. Add utilities: `utils.ts` (if needed)

### Adding a New UI Component (shadcn/ui)

Use the shadcn CLI to add components:

```bash
npx shadcn-ui@latest add [component-name]
```

### Adding a New Page

1. Create page file: `src/app/(group)/path/page.tsx`
2. Add layout if needed: `layout.tsx`
3. Add loading state: `loading.tsx`
4. Add error boundary: `error.tsx`

## Important Notes

- **Free Tier Compatibility**: The app works on Appwrite Cloud free tier
- Email verification and password reset require SMTP (Pro or self-hosted)
- Image transformations not used (direct file URLs for free tier)
- Port 3001 for dev server (configured in `package.json`)
- Session cookie name: `AUTH_COOKIE` from constants

## Code Style Preferences

- Use **named exports** for components (except page components)
- Use **async/await** over promises
- Use **arrow functions** for components and utilities
- Use **template literals** for string interpolation
- Use **optional chaining** (`?.`) and nullish coalescing (`??`)
- Prefer **const** over let
- Use **destructuring** for props and objects
- Import types with `import type { Type }` when importing only types

## When Adding New Features

1. **Define the schema** with Zod first
2. **Create types** from the schema
3. **Implement server logic** (Appwrite queries)
4. **Create API routes** with Hono
5. **Add React Query hooks** for client-side
6. **Build UI components** with proper loading/error states
7. **Update navigation** if needed
8. **Test the flow** end-to-end

## Common Utilities

- `cn()` - Merge Tailwind classes
- `createSessionClient()` - Get Appwrite client with user session
- `createAdminClient()` - Get Appwrite client with admin privileges
- `sessionMiddleware` - Protect API routes

## Remember

- Server Components can't use hooks or browser APIs
- Client Components need `"use client"` directive
- Appwrite clients must be created in async functions
- Always validate inputs on both client and server
- Use proper TypeScript types, avoid `any`
- Follow the existing feature structure for consistency
