# KORA TRAINING CO. 🏋️‍♂️

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Web](https://img.shields.io/badge/Web-Static-orange.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Serverless-green.svg)]()

**KORA Training Co.** is a premier high-performance coaching platform built on the architecture of human movement. We specialize in developing functional strength and metabolic conditioning through evidence-based programming.

---

## 🚀 Features

-   **Structural Coaching**: Focused on the mechanics of progress, not just trends.
-   **In-Person Coaching**: 1-on-1 sessions at partnered high-performance facilities in Addis Ababa.
-   **Online Programming**: Global access to custom training apps and weekly digital check-ins.
-   **Performance Nutrition**: Evidence-based dietary strategies to fuel your progress.
-   **Automated Lead Management**: Seamless client application flow with instant Telegram notifications for the coaching team.

## 🛠️ Tech Stack

-   **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6+).
-   **Libraries**: jQuery, Slick Carousel (for transformations & reviews).
-   **Backend**: Node.js Serverless Functions (located in `/api`).
-   **Integrations**: Telegram Bot API for real-time lead alerts.

## 📁 Project Structure

```text
├── api/            # Serverless functions (Telegram integration)
├── assets/         # Images, icons, and brand assets
├── css/            # Stylesheets
├── js/             # Client-side logic & animations
├── index.html      # Main landing page
└── package.json    # Project dependencies
```

## ⚙️ Setup & Deployment

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/NathanTura/KoraTrainining.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file (or set in your deployment platform) with the following:
    ```env
    TELEGRAM_BOT_TOKEN=your_bot_token
    TELEGRAM_CHAT_ID=your_chat_id
    ```
4.  **Deployment**:
    This project is designed to be deployed on platforms like **Vercel** or **Netlify** that support the `/api` directory for serverless functions.

## 📜 License

This project is licensed under the **ISC License**.

---

*Built for KORA TRAINING CO. - Addis Ababa, Ethiopia.*
