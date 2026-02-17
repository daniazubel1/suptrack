# Suptrack 💊📊
> Daily Supplement & Lifestyle Optimization

**Suptrack** is a modern, mobile-first web application designed to help you build, track, and optimize your daily supplement stack. It goes beyond simple checkboxes by integrating lifestyle factors like sleep and workouts to show you the full picture of your health routine.

![Suptrack Screenshot](https://raw.githubusercontent.com/daniazubel1/suptrack/main/public/pwa-512x512.svg)

## ✨ Features

### 📅 **Daily Dashboard**
- **Smart Checklist**: See exactly what you need to take based on the time of day (Morning, Pre-workout, Night).
- **Lifestyle Tracking**: Log your **Sleep Duration** and **Workout Type** (Gym, Cardio, Swim, etc.) alongside your stack.
- **Context Awareness**: Reminders to take supplements with food or on an empty stomach.

### 🧪 **Supplement Management**
- **Custom Stacks**: Create your own stack or discover recommendations based on your goals (Muscle, Weight Loss, Longevity).
- **Detailed Info**: Track dosages, brands, and specific timing requirements.

### 📈 **Advanced Analytics**
- **Consistency Charts**: Visual stacked bar charts showing your intake over Daily, Weekly, and Monthly views.
- **Correlations**: See how your consistency overlaps with your sleep and workout patterns.

### 📚 **Sup Info Knowledge Base**
- **Built-in Library**: Access detailed information on popular supplements.
- **Science-Backed**: Learn about benefits, dosages, and warnings.
- **Responsive Layout**: Optimized for reading on any device.

### 🔄 **Data Sync**
- **No Account Needed**: Your data lives locally in your browser.
- **Easy Transfer**: Export your data as JSON and restore it on another device (e.g., move from Desktop to Mobile) via the **Settings** tab.

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **PWA**: Vite Plugin PWA (Installable on Mobile)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/daniazubel1/suptrack.git
    cd suptrack
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` in your browser.

### Building for Production

To create a production build:
```bash
npm run build
```
This generates a `dist` folder ready for deployment.

## 🌍 Deploying to the Web

To use Suptrack on your phone **without** being on the same WiFi (aka from anywhere in the world), you need to host it on the internet.

### Option 1: Vercel (Recommended ⚡)
1.  Go to [Vercel.com](https://vercel.com) and sign up (login with GitHub).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `suptrack` repository.
4.  Click **"Deploy"**.
    *   Vercel will automatically detect that it's a Vite project.
5.  Once done, you'll get a URL like `https://suptrack-yourname.vercel.app`. Open this on your phone!

### Option 2: Netlify
1.  Go to [Netlify.com](https://netlify.com) and sign up with GitHub.
2.  Click **"Add new site"** -> **"Import an existing project"**.
3.  Select GitHub and choose your `suptrack` repo.
4.  Click **"Deploy site"**.

> **Note:** When you switch to the live website, your data won't be there automatically (because it's saved in your browser). Use the **Settings -> Share** feature to move your data from your local version to the live version.

## 📱 Mobile Use (PWA)
Suptrack is a Progressive Web App. You can install it on your phone:
1.  Open the app in Chrome/Safari on your phone.
2.  Tap "Share" (iOS) or the Menu (Android).
3.  Tap **"Add to Home Screen"**.
