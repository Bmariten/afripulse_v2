
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/cac2ac2f-f1c6-4001-b088-1c595b087e65

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cac2ac2f-f1c6-4001-b088-1c595b087e65) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Node.js/Express.js (Backend)
- MySQL (Database)
- Axios (Frontend HTTP Client)

### Backend-Driven Architecture

This project no longer uses Supabase. All authentication, user management, product, and affiliate operations are handled by a custom Node.js/Express backend with a MySQL database. The frontend communicates with the backend via REST API endpoints using axios. Environment variables should include `REACT_APP_API_BASE_URL` to specify the backend API URL.

#### Setting up the backend

1. Clone the repository and navigate to the `server/` directory.
2. Install backend dependencies: `npm install`
3. Configure your `.env` file with MySQL and email settings.
4. Start the backend server: `npm run dev` or `npm start`

#### Setting up the frontend

1. Navigate to the root project directory.
2. Install frontend dependencies: `npm install`
3. Set `REACT_APP_API_BASE_URL` in your `.env` file to point to your backend (e.g., `http://localhost:4000/api`).
4. Start the frontend: `npm run dev`

All data and authentication flows are now handled by your own backend for full control and flexibility.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cac2ac2f-f1c6-4001-b088-1c595b087e65) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
