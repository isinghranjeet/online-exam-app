🌐 Online Exam Platform
Live Demo: here

An Online Exam Platform built with Next.js, enabling instructors to create exams and students to take them — with timer, result tracking, and real-time feedback.

✨ Features
✅ User roles: Instructor & Student

🗂 Create, edit, and delete exams (questions, answers)

⏱ Timed exams with countdown timer

🧮 Auto-grading & immediate feedback

📊 Score summaries and exam history

📱 Responsive UI — works on mobile and desktop

📂 Project Structure
online-exam-app/
├── app/                     # Pages / Routes (Next.js)
├── components/              # Reusable UI components
├── public/                  # Static assets (images, icons)
├── styles/                  # Global & component styling
├── utils/                   # Helper functions
├── data/ or backend/API      # Where exam data / user data stored / fetched
├── package.json
└── README.md
🛠 Setup & Run Locally
# Clone the repo
git clone <your-repo-url>
cd online-exam-app

# Install dependencies
npm install
# or
yarn

# Run in development mode
npm run dev

# Open
http://localhost:3000
🚀 Deployment
Deployed live via Vercel — automatic when pushing to the main branch.


🔮 Future Enhancements
Authentication & authorization (JWT, NextAuth)

Better UI themes / dark mode

Timer pausing / resuming

Analytics: average score, question item analysis

Real-time proctoring or webcam monitoring
