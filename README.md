# Bryntum Grid + Supabase Live Editing Demo

A React application demonstrating real-time CRUD operations with Bryntum Grid and Supabase integration.

## Prerequisites

- Node.js 20 or higher
- npm or yarn package manager
- A Supabase account and project
- Access to Bryntum NPM registry (trial or licensed)

## Setup Instructions

### 1. Bryntum NPM Registry Access

**Repository access**

Bryntum components are commercial products, hosted in a private Bryntum repository. To get repository access, you need to complete these **two steps**:
* Configure npm
* Login

You may access the repository with a single login, or if your team contains multiple developers, you may follow the instructions in this multi-user access guide.

**Repositories**

Bryntum has two repositories located in Europe and US:

- Europe location: `https://npm.bryntum.com`
- US location: Available on request

Please change repository URL for the commands in this guide accordingly.

**Configure npm**

Configure **npm** to download packages for the `@bryntum` scope from the Bryntum registry with this command which will store the npm configuration in your local machine:

```shell
npm config set "@bryntum:registry=https://npm.bryntum.com"
```

Do not forget to put the config value in quotes as shown above (required for Windows PowerShell).

Check that **npm** uses correct Bryntum repository setting with:

```shell
npm config list
```

Command console output should contain this setting:

```shell
@bryntum:registry = "https://npm.bryntum.com"
```

Check npm-config online documentation.

**Login**

Login to the registry using this command, which will create and store login credentials on your local machine:

```shell
npm login --registry=https://npm.bryntum.com
```

Bryntum repository does not support the web login protocol used by a few npm v9.x versions as a default. If you are on such version, please add `--auth-type=legacy` option to authenticate, or upgrade your npm client to 9.5 or newer:

```shell
npm login --auth-type=legacy --registry=https://npm.bryntum.com
```

**Login example:**

*Do not use `user..yourdomain.com` and `user@yourdomain.com` from the example below to login! Use your own email address.*

**For Trial Version:**
Use your email as the login but replace the `@` with `..` (double dot) and use `trial` as password. For example, if your email is `user@yourdomain.com`, use the following:

```shell
$ npm login --registry=https://npm.bryntum.com
npm notice Log in on https://npm.bryntum.com/
Username: user..yourdomain.com
Password: trial
```

**For Licensed Version:**
Use your licensed credentials provided by Bryntum.

*If you see a rotating spinner after the password prompt in the console (introduced in npm 10.7), enter your password and press `[Enter]`. The spinner is not indicating any progress, it's a part of the prompt display waiting for your input*

**NPM Requirements**

Bryntum demo applications use package aliasing for trial Bryntum Grid packages. This requires **npm** versions that support aliases.

Minimum supported **npm** versions are `v6.9.0` or `v7.11.0`.

Check installed **npm** version with:

```shell
npm -v
```

Use npm upgrade guide for **npm** upgrade instructions and check Docs for package alias syntax.

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/jamesdanielwhitford/bryntum-grid-app/tree/cursor-version
cd bryntum-grid-supabase-demo
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in the project root:

```bash
touch .env
```

Edit the `.env` file and add your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**To find your Supabase credentials:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings > API**
3. Copy the **Project URL** and **anon public** key

### 4. Database Setup

In your Supabase project:

1. Navigate to **SQL Editor**
2. Click **+ New query**
3. Copy and paste the contents of `database-setup.sql`
4. Click **Run** to execute the SQL

This will create the `people` table with sample data.

### 5. Verify Vite Configuration

Ensure your `vite.config.js` includes Bryntum packages in optimizeDeps:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@bryntum/grid', '@bryntum/grid-react']
  }
})
```

### 6. Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- **Live Editing**: Double-click any cell to edit data
- **Real-time Sync**: Changes appear instantly across all browser tabs
- **Add Records**: Use the "Add" button to create new entries
- **Remove Records**: Select rows and click "Remove Selected"
- **Auto-save**: Changes are automatically saved to Supabase

## Project Structure

```
src/
├── services/
│   └── supabase.js          # Supabase client configuration
├── App.jsx                  # Main application component
├── App.scss                 # Application styles
├── GridConfig.js            # Bryntum Grid configuration
└── main.jsx                 # React entry point
```

## Troubleshooting

### NPM Registry Issues
If you get authentication errors when installing:
1. Verify you're logged into the Bryntum registry: `npm whoami --registry=https://npm.bryntum.com`
2. Re-run the login command with your correct credentials

### Environment Variables Not Loading
- Ensure your `.env` file is in the project root (same level as `package.json`)
- Restart your development server after adding environment variables
- Variable names must start with `VITE_` for Vite to expose them

### Database Connection Issues
- Verify your Supabase URL and key are correct
- Check that Row Level Security is disabled on the `people` table for development
- Ensure your Supabase project is active and not paused

### Grid Not Loading
- Check browser console for errors
- Verify Bryntum packages are installed correctly
- Ensure `grid.stockholm.css` is being imported in `App.scss`

## Development Notes

- The application uses Bryntum Grid's documented React patterns
- Real-time updates are handled via Supabase's `postgres_changes` API
- The grid automatically handles optimistic updates for better UX
- All CRUD operations are validated before being sent to the database

## Next Steps

- Enable Row Level Security (RLS) for production
- Add user authentication
- Implement data validation
- Add error handling and user feedback
- Customize the grid theme and styling