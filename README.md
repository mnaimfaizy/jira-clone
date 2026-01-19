# Jira Clone

A modern, full-featured project management and task tracking application built with Next.js 14, inspired by Jira. This application provides workspace management, team collaboration, and comprehensive member management features.

## 🚀 Features

### Core Features

- **🔐 Authentication System**: Secure user registration and login with session management
  - Email/password authentication with email verification
  - Email verification (optional - requires Appwrite Pro or self-hosting for SMTP)
  - Resend verification email functionality
  - Password reset functionality (requires SMTP configuration)
  - Forgot password flow with secure token-based recovery
- **👥 Workspace Management**: Create, update, and manage multiple workspaces
- **🎫 Invite System**: Generate and share workspace invite codes
- **👤 Member Management**: Add, remove, and manage workspace members with role-based access (Admin/Member)
- **🖼️ Image Upload**: Support for workspace avatars and image management (optimized for free tier)
- **📱 Responsive Design**: Mobile-first design with responsive navigation and sidebar
- **🎨 Modern UI**: Built with Radix UI components and Tailwind CSS
- **🌙 Theme Support**: Dark mode ready with next-themes

### Appwrite Free Tier Compatibility

This application is fully functional on **Appwrite Cloud's free tier**:

- ✅ **Authentication**: Full user registration and login
- ✅ **Workspaces**: Create and manage unlimited workspaces
- ✅ **File Uploads**: Workspace avatars and images (using direct file URLs)
- ⚠️ **Email Verification**: Optional (requires Pro or self-hosting)
- ⚠️ **Password Reset**: Requires SMTP configuration (Pro or self-hosting)
- ⚠️ **Image Transformations**: Not available (using direct file URLs instead)

### Technical Features

- Server-side rendering (SSR) and React Server Components
- Real-time data fetching with TanStack Query (React Query)
- Type-safe API routes with Hono.js
- Form validation with Zod and React Hook Form
- Optimistic UI updates
- Efficient state management with URL state (nuqs)
- Responsive modals and drawers (desktop/mobile)

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend

- **API Framework**: [Hono.js](https://hono.dev/)
- **Backend Service**: [Appwrite](https://appwrite.io/)
- **Database**: Appwrite Database
- **Storage**: Appwrite Storage
- **Authentication**: Appwrite Auth

### Development Tools

- **Package Manager**: npm/yarn/pnpm/bun
- **Linting**: ESLint
- **Type Checking**: TypeScript 5

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- An Appwrite instance (self-hosted or cloud)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd jira-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and configure the following variables (see `.env.example` for reference):

   ```env
   # Application URL (use http://localhost:3001 for development)
   NEXT_PUBLIC_APP_URL=http://localhost:3001

   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
   NEXT_APPWRITE_KEY=your_api_key

   # Database Collections
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=your_workspaces_collection_id
   NEXT_PUBLIC_APPWRITE_MEMBERS_ID=your_members_collection_id

   # Storage
   NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=your_images_bucket_id
   ```

4. **Get Appwrite Environment Variables**

   Follow these steps to obtain all required Appwrite configuration values:

   ### Step 1: Create an Appwrite Account & Project
   1. Go to [Appwrite Cloud](https://cloud.appwrite.io) or use your self-hosted instance
   2. Sign up or log in to your account
   3. Click **"Create Project"**
   4. Enter a project name (e.g., "Jira Clone")
   5. Click **"Create"**

   ### Step 2: Get Project Credentials

   **`NEXT_PUBLIC_APPWRITE_ENDPOINT`**
   - For Appwrite Cloud: `https://cloud.appwrite.io/v1`
   - For self-hosted: Your Appwrite server URL + `/v1` (e.g., `https://appwrite.yourdomain.com/v1`)

   **`NEXT_PUBLIC_APPWRITE_PROJECT`**
   1. In your Appwrite project dashboard
   2. Go to **Settings** (gear icon in the left sidebar)
   3. Find **"Project ID"** at the top
   4. Copy the project ID

   **`NEXT_APPWRITE_KEY`**
   1. In your project, go to **Settings** → **View API Keys**
   2. Click **"Create API Key"**
   3. Enter a name (e.g., "Backend API Key")
   4. Set expiration (or select "Never" for development)
   5. Under **Scopes**, select the following scopes (required for authentication and database operations):
      - **Sessions**
        - `sessions.write` (required for creating sessions during registration and login)
      - **Users**
        - `users.read`
        - `users.write`
      - **Databases**
        - `databases.read`
        - `databases.write`
      - **Collections**
        - `collections.read`
        - `collections.write`
      - **Documents**
        - `documents.read`
        - `documents.write`
      - **Files**
        - `files.read`
        - `files.write`
   6. Click **"Create"**
   7. Copy the API Key (⚠️ save it securely, it won't be shown again)

   ⚠️ **Important**: Make sure the `sessions.write` scope is selected, as it's required for user authentication, email verification, and password reset functionality.

   ### Step 3: Create Database

   **`NEXT_PUBLIC_APPWRITE_DATABASE_ID`**
   1. In the left sidebar, click **Databases**
   2. Click **"Create Database"**
   3. Enter a name (e.g., "jira-clone-db")
   4. Click **"Create"**
   5. Copy the **Database ID** from the top of the page

   ### Step 4: Create Collections

   **`NEXT_PUBLIC_APPWRITE_WORKSPACES_ID`** (Workspaces Collection)
   1. Inside your database, click **"Create Collection"**
   2. Enter collection name: `workspaces`
   3. Click **"Create"**
   4. Copy the **Collection ID**
   5. Go to **Attributes** tab and add the following attributes:
      - `name` - String (required, size: 255)
      - `imageUrl` - String (size: 2000)
      - `inviteCode` - String (required, size: 10)
      - `userId` - String (required, size: 255)
   6. Go to **Settings** → **Permissions**
   7. Add these permissions:
      - **Role: Any** → Read access
      - **Role: Users** → Create, Read, Update, Delete access

   **`NEXT_PUBLIC_APPWRITE_MEMBERS_ID`** (Members Collection)
   1. Click **"Create Collection"** again
   2. Enter collection name: `members`
   3. Click **"Create"**
   4. Copy the **Collection ID**
   5. Go to **Attributes** tab and add:
      - `workspaceId` - String (required, size: 255)
      - `userId` - String (required, size: 255)
      - `role` - String (required, size: 20)
   6. Go to **Settings** → **Permissions**
   7. Add these permissions:
      - **Role: Any** → Read access
      - **Role: Users** → Create, Read, Update, Delete access

   ### Step 5: Create Storage Bucket

   **`NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID`**
   1. In the left sidebar, click **Storage**
   2. Click **"Create Bucket"**
   3. Enter bucket name: `images`
   4. Click **"Create"**
   5. Copy the **Bucket ID**
   6. Configure bucket settings:
      - **Maximum File Size**: 50MB (or as needed)
      - **Allowed File Extensions**: `jpg`, `jpeg`, `png`, `gif`, `webp`
      - **Compression**: Optional (recommended: Gzip)
      - **Encryption**: Enabled (recommended)
      - **Antivirus**: Enabled (if available)
   7. Go to **Settings** → **Permissions**
   8. Add these permissions:
      - **Role: Any** → Read access
      - **Role: Users** → Create, Read, Update, Delete access

   ### Step 6: Update .env.local

   Copy all the IDs you collected into your `.env.local` file:

   ```env
   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3001

   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT=your_copied_project_id
   NEXT_APPWRITE_KEY=your_copied_api_key
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_copied_database_id
   NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=your_copied_workspaces_collection_id
   NEXT_PUBLIC_APPWRITE_MEMBERS_ID=your_copied_members_collection_id
   NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=your_copied_images_bucket_id
   ```

   ### Step 7: Enable Authentication (Optional but Recommended)
   1. Go to **Auth** in the left sidebar
   2. Under **Auth Methods**, ensure **Email/Password** is enabled
   3. **Important**: Configure email settings for verification emails:
      - Go to **Settings** → **SMTP** in your Appwrite console
      - Configure your SMTP settings (or use Appwrite's default for testing)
      - Verify email delivery is working
   4. Configure session settings as needed
   5. Optionally, add allowed domains under **Security**

   ### Step 8: Configure SMTP for Email Delivery (Optional - Pro Feature)

   **Note**: SMTP configuration is a **pro/paid feature** in Appwrite Cloud. Without it:
   - ✅ Users can still register and login immediately
   - ❌ Email verification emails will not be sent
   - ❌ Password reset emails will not be sent

   If you have Appwrite Pro or are self-hosting, configure SMTP for full email functionality:
   1. In Appwrite Console, go to **Settings** → **SMTP**
   2. Fill in the following fields:

   **SMTP Configuration Options:**

   <details>
   <summary><strong>Using Gmail</strong> (Free)</summary>
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Security**: TLS
   - **Username**: Your Gmail address (e.g., `yourname@gmail.com`)
   - **Password**: **App Password** (NOT your Gmail password)
     - Go to [Google Account Settings](https://myaccount.google.com/)
     - Enable 2-Factor Authentication
     - Go to Security → 2-Step Verification → App passwords
     - Generate an App Password for "Mail"
     - Use this 16-character password in Appwrite
   - **Sender Email**: Your Gmail address
   - **Sender Name**: `Jira Clone` (or your app name)

   </details>

   <details>
   <summary><strong>Using SendGrid</strong> (Recommended - 100 emails/day free)</summary>
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **Security**: TLS
   - **Username**: `apikey` (literally the word "apikey")
   - **Password**: Your SendGrid API Key
     - Sign up at [SendGrid](https://sendgrid.com/)
     - Go to Settings → API Keys → Create API Key
     - Give it **Full Access** or **Mail Send** access
     - Copy the API key
   - **Sender Email**: Verified sender email from SendGrid
   - **Sender Name**: `Jira Clone`

   </details>

   <details>
   <summary><strong>Using Mailgun</strong> (5,000 emails/month free)</summary>
   - **Host**: `smtp.mailgun.org` (or your region-specific host)
   - **Port**: `587`
   - **Security**: TLS
   - **Username**: From Mailgun Dashboard → Sending → Domain Settings → SMTP Credentials
   - **Password**: From Mailgun Dashboard → Sending → Domain Settings → SMTP Credentials
   - **Sender Email**: `noreply@your-domain.mailgun.org`
   - **Sender Name**: `Jira Clone`

   </details>

   <details>
   <summary><strong>Using AWS SES</strong> (62,000 emails/month free)</summary>
   - **Host**: `email-smtp.us-east-1.amazonaws.com` (or your region)
   - **Port**: `587`
   - **Security**: TLS
   - **Username**: SMTP Username from AWS SES Console
   - **Password**: SMTP Password from AWS SES Console
   - **Sender Email**: Verified email address in AWS SES
   - **Sender Name**: `Jira Clone`

   </details>
   3. Click **Update** to save
   4. **Test the configuration**:
      - Try registering a new test user in your app
      - Check the email inbox (and spam folder)
      - Look for "Verification email sent successfully" in server logs

   **✅ You're all set!** All environment variables are now configured.

## 🚀 Getting Started

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application will be available at [http://localhost:3001](http://localhost:3001)

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
jira-clone/
├── public/              # Static files
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── (auth)/    # Authentication routes (sign-in, sign-up)
│   │   ├── (dashboard)/    # Main application routes
│   │   ├── (standalone)/   # Standalone pages (create workspace, join)
│   │   ├── api/       # API routes
│   │   ├── fonts/     # Custom fonts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/    # Reusable UI components
│   │   └── ui/       # Shadcn UI components
│   ├── features/     # Feature-based modules
│   │   ├── auth/     # Authentication logic
│   │   ├── members/  # Member management
│   │   └── workspaces/   # Workspace management
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility libraries
│   └── config.ts     # Application configuration
├── .env.local        # Environment variables (create this)
├── .env.example      # Environment variables template
├── components.json   # Shadcn UI configuration
├── next.config.mjs   # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
```

## 🏗️ Architecture

### Feature-Based Structure

The application follows a feature-based architecture where each feature is self-contained:

```
features/
└── [feature-name]/
    ├── api/           # React Query hooks (use-*)
    ├── components/    # Feature-specific components
    ├── server/        # Server-side logic (route handlers)
    ├── hooks/         # Feature-specific hooks
    ├── schemas.ts     # Zod validation schemas
    ├── queries.ts     # Server-side queries
    └── types.ts       # TypeScript types
```

### Route Groups

- **(auth)**: Public authentication pages
- **(dashboard)**: Protected application pages
- **(standalone)**: Pages with minimal layout (e.g., workspace creation)

### API Layer

- **Client-side**: React Query hooks for data fetching and mutations
- **Server-side**: Hono.js routes with Zod validation
- **Type Safety**: Full TypeScript coverage with Zod schemas

## 🔑 Key Features Explained

### Authentication

- **User Registration & Login**: Email/password authentication via Appwrite
- **Email Verification**: Required for new user accounts
  - Verification email sent upon registration
  - Users must verify email before logging in
  - Resend verification email if not received
  - Secure token-based verification
- **Session Management**: Session-based auth with HTTP-only cookies for security
- **Password Recovery**: Complete forgot password flow
  - Users can request a password reset via email
  - Secure token-based verification
  - Set new password with confirmation
- **Protected Routes**: Automatic redirects for authenticated/unauthenticated users
- **User Profile Management**: View and manage user information

### Workspaces

- Create and manage multiple workspaces
- Upload custom workspace images
- Generate shareable invite codes
- Reset invite codes for security
- Update workspace details

### Members

- Invite members via invite codes
- Role-based access control (Admin/Member)
- Remove members from workspaces
- Update member roles
- View member lists with avatars

## 🎨 UI Components

This project uses [Shadcn UI](https://ui.shadcn.com/) components, including:

- Avatar, Badge, Button
- Calendar, Card, Chart
- Checkbox, Dialog, Drawer
- Dropdown Menu, Form, Input
- Label, Popover, ScrollArea
- Select, Separator, Sheet
- Skeleton, Table, Tabs
- Textarea, and more

## 🔐 Environment Variables

| Variable                                | Description                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`                   | Your application URL (e.g., http://localhost:3001 for dev, https://yourdomain.com for production) |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT`         | Appwrite API endpoint URL                                                                         |
| `NEXT_PUBLIC_APPWRITE_PROJECT`          | Appwrite project ID                                                                               |
| `NEXT_APPWRITE_KEY`                     | Appwrite API key (server-side only)                                                               |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID`      | Database ID in Appwrite                                                                           |
| `NEXT_PUBLIC_APPWRITE_WORKSPACES_ID`    | Workspaces collection ID                                                                          |
| `NEXT_PUBLIC_APPWRITE_MEMBERS_ID`       | Members collection ID                                                                             |
| `NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID` | Storage bucket ID for images                                                                      |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

This Next.js application can be deployed to any platform that supports Node.js:

- AWS Amplify
- Netlify
- Railway
- Render
- Self-hosted with PM2 or Docker

Ensure all environment variables are properly configured in your deployment platform.

## 📚 Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

### Appwrite Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Console](https://cloud.appwrite.io)

### UI/UX Resources

- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues & Troubleshooting

### Common Issues

1. **404 Error with "Cannot read properties of undefined (reading 'replace')"**

   **Error:**

   ```
   Failed to load resource: the server responded with a status of 404 (Not Found)
   TypeError: Cannot read properties of undefined (reading 'replace')
       at mergePath (utils.js:11:15)
   ```

   **Solution:**
   - This error occurs when `NEXT_PUBLIC_APP_URL` is missing from your `.env.local` file
   - Add the following to your `.env.local`:
     ```env
     NEXT_PUBLIC_APP_URL=http://localhost:3001
     ```
   - For production, use your actual domain:
     ```env
     NEXT_PUBLIC_APP_URL=https://yourdomain.com
     ```
   - Restart the development server after adding the variable

2. **"Missing scopes ([account])" or "Missing scopes" Error During Registration**

   **Error:**

   ```json
   {
     "error": "app.xxxxx@service.cloud.appwrite.io (role: applications) missing scopes"
   }
   ```

   **Solution:**
   - This error occurs when your Appwrite API key doesn't have the required scopes
   - Go to your Appwrite Console → **Settings** → **View API Keys**
   - Find your API key and click on it to edit
   - Under **Scopes**, make sure the following are checked/enabled:
     - **sessions.write** (required for authentication)
     - **users.write** (required for creating users)
   - If you can't edit the existing key, create a new one with all required scopes
   - Update your `.env.local` with the new API key:
     ```env
     NEXT_APPWRITE_KEY=your_new_api_key_here
     ```
   - Restart your development server

   **Note**: The `sessions.write` scope is required for:
   - User registration
   - User login (creating sessions)
   - Email verification flow
   - Password reset functionality
   - Any operation that creates or manages user sessions

3. **Email Verification Not Being Sent**

   **Note**: Email verification is **optional**. Users can register and login without email verification.

   If you want to enable email verification (requires Appwrite Pro or self-hosting):

   **Step 1: Check Server Logs**
   Look for these messages in your terminal:

   ```
   Creating user account for: user@example.com
   User created successfully: [user-id]
   Creating session...
   Attempting to send verification email to: user@example.com
   Failed to send verification email (SMTP may not be configured): [ERROR]
   Registration completed successfully
   ```

   **Step 2: Upgrade to Appwrite Pro or Self-Host**
   - SMTP is a **pro/paid feature** in Appwrite Cloud
   - Free tier does not support email sending
   - Options:
     1. Upgrade to Appwrite Pro
     2. Self-host Appwrite and configure SMTP
     3. Use the app without email verification (current default behavior)

   **Step 3: Configure SMTP** (If you have Pro or self-hosting)
   - Go to **Appwrite Console** → **Settings** → **SMTP**
   - See "Step 8: Configure SMTP" in the setup section above
   - Popular options: Gmail (with App Password), SendGrid, Mailgun

   **Step 4: Test SMTP Configuration**
   - After configuring SMTP, register a new test user
   - Check email inbox AND spam folder
   - Look for "Verification email sent successfully" in server logs

   **Step 5: Common SMTP Mistakes** (If you have Pro)
   - ❌ Using Gmail password instead of App Password
   - ❌ Wrong port (use 587 for TLS, 465 for SSL)
   - ❌ Username incorrect (Gmail: full email, SendGrid: "apikey")
   - ❌ Sender email not verified (some providers require this)
   - ❌ Firewall blocking SMTP port

4. **Image Transformations Blocked Error**

   If you see: `AppwriteException: Image transformations are blocked on your current plan`

   **This is expected on the free tier** - the app has been updated to work around this:
   - ✅ The app now uses direct file URLs instead of image transformations
   - ✅ Workspace images will still upload and display correctly
   - ✅ No action needed - this is automatically handled

   **Technical Details**:
   - Free tier: Uses `getFileView` (direct file URLs)
   - Paid tier: Could use `getFilePreview` (with transformations like resizing)
   - Both approaches work, but transformations allow better optimization

5. **Image Upload Returns 401 Unauthorized**

   If workspace images show error: `upstream image response failed ... 401`

   **This means your storage bucket doesn't have public read permissions:**
   1. Go to **Appwrite Console** → Your Project → **Storage**
   2. Click on your **images** bucket
   3. Go to **Settings** → **Permissions**
   4. **Add or verify** these permissions:
      - **Role: Any** → ✅ **Read** access (this is critical!)
      - **Role: Users** → ✅ Create, Read, Update, Delete access
   5. Click **Update**
   6. Refresh your application

   **Why this is needed:**
   - Next.js Image component fetches images from the Appwrite URL
   - Without public read access, the URL returns 401 Unauthorized
   - "Any" role means anyone can view the images (safe for workspace avatars)

6. **Appwrite Connection Errors**
   - Verify your Appwrite endpoint and project ID
   - Check that your API key has proper permissions
   - Ensure database collections and bucket are created
   - Make sure all environment variables are correctly set in `.env.local`

7. **Build Errors**
   - Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
   - Verify all environment variables are set
   - Check for TypeScript errors: `npm run lint`

8. **Authentication Issues**
   - Check cookie settings in Appwrite
   - Verify session configuration
   - Clear browser cookies and try again
   - Ensure the AUTH_COOKIE constant matches your Appwrite session name

9. **API Route 404 Errors**
   - Verify the API routes are properly exported in `src/app/api/[[...route]]/route.ts`
   - Check that the Hono basePath is set to `/api`
   - Ensure `NEXT_PUBLIC_APP_URL` is correctly configured
   - Restart the dev server after environment changes

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js and Appwrite**
