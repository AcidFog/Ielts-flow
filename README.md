
Next.js App

This is a Next.js project bootstrapped with create-next-app.

 Getting Started

1. Install dependencies

npm install

2. Add environment variables

Create a file named .env.local in the root of the project and add your API keys and other environment variables there.

Example:

NEXT_PUBLIC_API_KEY=your_api_key_here

3. Start Docker (required)

Make sure Docker is installed and running on your machine.

Then run:

docker compose up

This will launch your local database and other services.

 The database runs locally at http://localhost:6791

4. Start Convex dev server

In a new terminal, run:

npx convex dev

5. Run the development server

npm run dev

Then open http://localhost:3000 in your browser to see the app.

📁 Project Structure

You can start editing the main page in:

app/page.js

The project uses next/font to automatically load optimized fonts.

📚 Useful Resources
	•	Next.js Documentation
	•	Learn Next.js - interactive tutorial

