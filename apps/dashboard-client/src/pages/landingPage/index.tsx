import { DiscordSignIn } from '@/components/common/discord-signin';
import { Link } from '@tanstack/react-router';

import { motion } from 'framer-motion';
import { ChartBarIcon, ChartGanttIcon, ClockIcon, UsersIcon } from 'lucide-react';

function LandingPage() {
  return (
    <div id="landing-page-container" className="flex min-h-screen flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <img src="/logo_128.png" alt="Taskcord Logo" className="scale-[.75] pt-1.5" />
          <h1 className="text-3xl font-bold">Taskcord</h1>
        </div>
        <nav>
          <Link
            to="/project/$projectId"
            params={{ projectId: '1234' }}
            className="px-4 hover:text-gray-400"
          >
            Dashboard
          </Link>
          <a href="#about" className="px-4 hover:text-gray-400">
            About
          </a>
          <a href="#contact" className="px-4 hover:text-gray-400">
            Contact
          </a>
          <Link to="/playground" className="px-4 hover:text-gray-400">
            Playground
          </Link>
          <Link to="/onboarding" className="px-4 hover:text-gray-400">
            Onboarding
          </Link>
        </nav>
      </header>

      <main className="flex flex-grow flex-col items-center justify-center text-center">
        <motion.h2
          className="mb-4 text-4xl font-extrabold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Manage Your Tasks Seamlessly with Discord Integration
        </motion.h2>
        <p className="mb-8 text-lg">
          Create organizations, invite team members, assign tasks, and set deadlines—all from
          Discord and our platform.
        </p>
        <motion.button
          className="rounded-lg bg-blue-600 px-6 py-3 text-white shadow-lg transition duration-300 hover:bg-blue-500"
          whileHover={{ scale: 1.05 }}
        >
          Get Started
        </motion.button>
        <Link
          to={'/onboarding'}
          search={{
            auth_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNjb3JkSWQiOiI1MjEzMzA5NDgzODI2NTQ0ODciLCJmdWxsTmFtZSI6ImEuc2VocmlrIiwiYXZhdGFyIjoiZGQyMjE1YmQ3ZjM2NjM1Y2EyNTFiZTU1ZWZiNTEyNGIiLCJlbWFpbCI6ImFzZWhyaWtAZ21haWwuY29tIiwiaWQiOiIwMTk1ZTExMS05NDQyLTdkNjMtYjIzMS1kZjg1NmIxOGIyNjUiLCJpYXQiOjE3NTA0MTcwNzgsImV4cCI6MTc1MTAyMTg3OH0.Wfubrf8fnt6afo37Yff9Kg92HtNvlULMGDWzapUqfYA',
          }}
          rel="noopener noreferrer"
          className="ml-4 text-blue-500 hover:underline"
        >
          Test Token
        </Link>
        <DiscordSignIn className="rounded-md border border-gray-300 p-3" />
      </main>

      <section id="features" className="bg-gray-800 py-20">
        <h3 className="mb-10 text-center text-3xl font-bold">Features</h3>
        <div className="flex flex-wrap justify-center">
          <div className="m-4 max-w-xs rounded-lg bg-gray-700 p-6 shadow-lg">
            <ChartGanttIcon className="mb-4 h-10 w-10 text-blue-400" />
            <h4 className="text-xl font-semibold">Discord Integration</h4>
            <p>Manage tasks and updates directly from Discord.</p>
          </div>
          <div className="m-4 max-w-xs rounded-lg bg-gray-700 p-6 shadow-lg">
            <UsersIcon className="mb-4 h-10 w-10 text-blue-400" />
            <h4 className="text-xl font-semibold">Team Collaboration</h4>
            <p>Invite team members and collaborate on projects.</p>
          </div>
          <div className="m-4 max-w-xs rounded-lg bg-gray-700 p-6 shadow-lg">
            <ClockIcon className="mb-4 h-10 w-10 text-blue-400" />
            <h4 className="text-xl font-semibold">Task Management</h4>
            <p>Assign tasks, set deadlines, and track progress.</p>
          </div>
          <div className="m-4 max-w-xs rounded-lg bg-gray-700 p-6 shadow-lg">
            <ChartBarIcon className="mb-4 h-10 w-10 text-blue-400" />
            <h4 className="text-xl font-semibold">Analytics & Logs</h4>
            <p>View detailed analytics and logs for your projects.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 p-6 text-center">
        <p>&copy; 2025 Taskcord. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
