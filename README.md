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

### 5. Secure Authentication 🔐

- **NextAuth.js Integration**: Secure, production-ready authentication system.
- **User Registration \u0026 Login**: Create account with email and password.
- **Password Security**: Passwords are hashed with bcryptjs before storage.
- **Session Management**: JWT-based sessions for fast, stateless authentication.
- **Protected Routes**: Automatic redirection for unauthenticated users.
- **User Isolation**: All data (subjects, notes, quizzes) is strictly user-specific.
- **Show/Hide Password**: User-friendly password visibility toggle on auth forms.

### 6. Modern UI/UX 🎨

- **Theme System**: "Academic" aesthetic with global Light/Dark mode toggle (Notion-like feel).
- **Responsive**: Fully functional on desktop and mobile.
- **Optimized**: Fast transitions and server-side rendering with Next.js 15.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/), [bcryptjs](https://www.npmjs.com/package/bcryptjs)
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

    # NextAuth Configuration
    NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-chars
    NEXTAUTH_URL=http://localhost:3000
    ```

    > **Note**: Generate a secure `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit `http://localhost:3000`

6.  **Create Your Account**
    - You'll be redirected to `/login`
    - Click "Sign up" to create a new account
    - After registration, sign in with your credentials
    - Start organizing your learning journey!

---

## 🔐 Authentication

Mero Shaathi uses **NextAuth.js** for secure authentication:

- **Registration**: Navigate to `/register` to create a new account
- **Login**: Access `/login` to sign in
- **Protected Routes**: All dashboard routes require authentication
- **User Isolation**: Each user's data (subjects, notes, quizzes, progress) is completely isolated
- **Session Management**: Sessions use JWT tokens and persist across browser refreshes
- **Profile**: View your profile and statistics at `/profile`

**Security Features:**

- Passwords are hashed with bcryptjs (never stored in plain text)
- Protected API routes require valid session
- Middleware automatically redirects unauthenticated users to login

---

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router Pages
│   ├── (dashboard)/      # Main App Layout (Sidebar + Navbar)
│   │   ├── history/      # Activity Log Page
│   │   ├── progress/     # Analytics Page
│   │   ├── profile/      # User Profile Page
│   │   ├── revision/     # Due Reviews Page
│   │   ├── subjects/     # Subject & Topic Management
│   │   └── page.tsx      # Dashboard Home
│   ├── login/            # Login Page
│   ├── register/         # Registration Page
│   └── api/              # Backend API Routes
│       ├── auth/         # Authentication (NextAuth + Register)
│       ├── dashboard/    # Stats Aggregation
│       ├── history/      # Activity Logs
│       ├── quizzes/      # Quiz Logic & Generation
│       └── ...
├── components/           # Reusable UI Components
│   ├── layout/           # Sidebar, Navbar
│   ├── notebook/         # Tiptap Editor Components
│   ├── providers/        # AuthProvider, ThemeProvider
│   ├── quiz/             # Quiz Player & Generator
│   └── ui/               # Shadcn Primitives
├── lib/                  # Utilities & Logic
│   ├── ai/               # AI Service Abstraction (Groq)
│   ├── models/           # Mongoose Schemas (User, Subject, Note, Quiz)
│   └── sm2.ts            # Spaced Repetition Algorithm
├── auth.ts               # NextAuth Configuration
├── middleware.ts         # Route Protection Middleware
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
