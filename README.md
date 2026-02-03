# Mero Shaathi (My Best Friend) 🎓

**Mero Shaathi** is a modern, AI-powered personal learning companion designed to help you organize your studies, retain knowledge via Spaced Repetition, and test yourself with intelligent quizzes.

![Mero Shaathi](https://placeholder-image-url.com/optional-hero.png)

## 🚀 Features

### 1. Smart Dashboard 📊

- **Overview**: Real-time stats on total subjects, revisions due, and quiz accuracy.
- **Recent Activity**: Timeline of your latest notes and quiz attempts.
- **Spaced Repetition**: "Retention Factor" indicators showing how well you know a topic.

### 2. Rich Text Notebook (OneNote-style) 📝

- **WYSIWYG Editor**: Built with **Tiptap**, supporting bold, italics, lists, headings, and more.
- **Sidebar Navigation**: Manage multiple notes per topic easily.
- **Auto-Save**: Never lose your work; notes save automatically as you type.

### 3. Advanced Quiz System 🧠

- **Hybrid Generation**:
  - **60%** existing questions (reinforcement).
  - **40%** AI-generated questions (discovery) via **Groq AI**.
- **AI Integration**: Generates context-aware questions based on your specific notes.
- **Quiz Player**: Interactive interface with timer and immediate feedback.

### 4. Progress & Analytics 📈

- **Revision Center**: Dedicated page showing exactly what you need to review today (based on SM-2 algorithm).
- **History**: A chronological timeline of your entire learning journey.
- **Charts**: Visual breakdown of Subject Mastery and Daily Activity streaks.

### 5. Modern UI/UX 🎨

- **Theme System**: "Academic" aesthetic with global Light/Dark mode toggle (Notion-like feel).
- **Responsive**: Fully functional on desktop and mobile.
- **Optimized**: Fast transitions and server-side rendering with Next.js 15.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Backend**: Next.js API Routes (Serverless)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **AI Provider**: [Groq](https://groq.com/) (Llama-3.1-8b model)

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Instance (Local or Atlas)
- Groq API Key (for AI features)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/mero-shaathi.git
    cd mero-shaathi
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:

    ```env
    # Database
    MONGODB_URI=mongodb://localhost:27017/mero-shaathi

    # AI Service (Get free key from console.groq.com)
    GROQ_API_KEY=gsk_your_api_key_here
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit `http://localhost:3000` to start learning!

---

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router Pages
│   ├── (dashboard)/      # Main App Layout (Sidebar + Navbar)
│   │   ├── history/      # Activity Log Page
│   │   ├── progress/     # Analytics Page
│   │   ├── revision/     # Due Reviews Page
│   │   ├── subjects/     # Subject & Topic Management
│   │   └── page.tsx      # Dashboard Home
│   └── api/              # Backend API Routes
│       ├── dashboard/    # Stats Aggregation
│       ├── history/      # Activity Logs
│       ├── quizzes/      # Quiz Logic & Generation
│       └── ...
├── components/           # Reusable UI Components
│   ├── layout/           # Sidebar, Navbar
│   ├── notebook/         # Tiptap Editor Components
│   ├── quiz/             # Quiz Player & Generator
│   └── ui/               # Shadcn Primitives
├── lib/                  # Utilities & Logic
│   ├── ai/               # AI Service Abstraction (Groq)
│   ├── models/           # Mongoose Schemas (Subject, Note, Quiz)
│   └── sm2.ts            # Spaced Repetition Algorithm
└── ...
```

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Built with ❤️ for generic students everywhere._
