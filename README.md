<div align="center">
  <img src="assets/logo.png" alt="KORA Training Logo" width="200">
  <h1>KORA TRAINING CO.</h1>

  <a href="https://github.com/NathanTura/KoraTrainining">
    <img src="https://img.shields.io/badge/Frontend-HTML5%20%2F%20CSS3%20%2F%20JS-orange?style=flat-square&logo=html5&logoColor=white" alt="Frontend: HTML5 / CSS3 / JS">
  </a>
  <a href="https://github.com/NathanTura/KoraTrainining">
    <img src="https://img.shields.io/badge/Backend-Serverless%20%2F%20Node-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Backend: Serverless / Node">
  </a>
  <a href="https://github.com/NathanTura/KoraTrainining">
    <img src="https://img.shields.io/badge/Fitness-Coaching%20%26%20Nutrition-ff3b30?style=flat-square&logo=googlefit&logoColor=white" alt="Fitness: Coaching & Nutrition">
  </a>
</div>

This is the repository for the **KORA Training Co.** website—a sleek, responsive landing page for our hybrid personal training and strength conditioning business based in Addis Ababa, Ethiopia. 

It handles everything from introducing our coaching philosophy to capturing new client leads and instantly routing them to our coaching team via a Telegram bot integration.

---

## What it does

*   **Hybrid Training Services**: Showcases our in-person 1-on-1 coaching at elite gyms in Addis Ababa (like Roots Fitness, Bellevue, and Gast) alongside our global online coaching programs.
*   **Proof of Progress**: Features a clean slider showing real client transformations and reviews.
*   **Instant Lead Capture**: When a potential client fills out our coaching application, the details are formatted and instantly sent to our trainers via a Telegram bot. No manual tracking, no missed leads.

## Tech behind the site

We kept the site extremely fast, offline-capable, and simple to host:
*   **Frontend**: Built with clean, semantic HTML5, custom vanilla CSS (no heavy frameworks), and vanilla JavaScript.
*   **Client Slider**: Powered by jQuery and Slick Carousel to display high-res transformation photos smoothly.
*   **Backend**: Uses serverless Node.js functions (found in `/api/`) to securely handle the Telegram bot communication without needing a dedicated running server.
*   **Integration**: Connects directly to the Telegram Bot API to drop new client alerts straight into our trainer group chat.

## Folder structure

*   `/api/` — The backend serverless function that handles form submission and securely forwards data to Telegram.
*   `/assets/` — All our branding, logos, and high-res transformation images.
*   `/css/` and `/js/` — Modular stylesheets and vanilla JS for animations and lead-form validation.
*   `index.html` — The main, fully responsive single-page application.

## Getting started locally

If you want to run this project locally or test the form submissions:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/NathanTura/KoraTrainining.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Create a `.env` file in the root directory (or configure them in your hosting provider):
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   ```

4. **Run the local dev server:**
   You can use any local static server (e.g., Live Server in VS Code) or run the serverless functions locally using Vercel CLI:
   ```bash
   npm run dev
   ```

## Hosting & Deployment

The easiest way to deploy this is on **Vercel** or **Netlify**. They will automatically detect the `/api` folder and host the backend handler as a serverless function without any extra configuration. Just make sure to add your `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` under the project's environment variables in the dashboard.

---

*Built for KORA TRAINING CO. - Addis Ababa, Ethiopia.*

