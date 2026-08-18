export const NAV_LINKS = [
  { label: 'Home', to: 'home' },
  { label: 'Platform', to: 'platform' },
  { label: 'Features', to: 'features' },
  { label: 'Learning', to: 'journey' },
  { label: 'Careers', to: 'careers' },
  { label: 'AI Assistant', to: 'ai-assistant' },
  { label: 'About', to: 'about' },
  { label: 'Contact', to: 'contact' },
]

export const TRUST_COMPANIES = [
  { name: 'Google', role: 'r', color: '#2563EB' },
  { name: 'Microsoft', role: 'r', color: '#4F46E5' },
  { name: 'Amazon', role: 'r', color: '#06B6D4' },
  { name: 'Infosys', role: 'r', color: '#10B981' },
  { name: 'TCS', role: 'r', color: '#2563EB' },
  { name: 'IBM', role: 'r', color: '#4F46E5' },
  { name: 'Oracle', role: 'r', color: '#06B6D4' },
  { name: 'Adobe', role: 'r', color: '#10B981' },
  { name: 'Accenture', role: 'r', color: '#2563EB' },
]

export const PROBLEMS = [
  {
    icon: 'graduation',
    accent: '#2563EB',
    title: 'Students struggle to find real opportunities',
    body: 'Degrees and certificates pile up, yet the bridge between learning and a job remains broken. Talent stays undiscovered and careers stall.',
    stat: '73%',
    statLabel: 'of graduates feel underprepared for the job market',
  },
  {
    icon: 'presentation',
    accent: '#4F46E5',
    title: 'Trainers struggle to reach the right learners',
    body: 'World-class educators build incredible content that fades into a crowded sea of courses — no tools, no audience, no sustainable revenue.',
    stat: '68%',
    statLabel: 'of independent trainers abandon teaching within a year',
  },
  {
    icon: 'search',
    accent: '#06B6D4',
    title: 'Recruiters struggle to discover skilled talent',
    body: 'Hiring teams wade through thousands of resumes searching for verifiable skills, real projects, and proof of ability — mostly in the dark.',
    stat: '8.4x',
    statLabel: 'more screening time spent by recruiters on weak matches',
  },
]

export const ECOSYSTEM_NODES = [
  {
    id: 'students',
    label: 'Students',
    tagline: 'Learn real skills',
    accent: '#2563EB',
    icon: 'student',
    x: 18,
    y: 14,
    features: ['AI roadmaps', 'Portfolio', 'Job matching'],
  },
  {
    id: 'trainers',
    label: 'Trainers',
    tagline: 'Teach & earn',
    accent: '#4F46E5',
    icon: 'trainer',
    x: 82,
    y: 14,
    features: ['Course studio', 'Live classes', 'Revenue'],
  },
  {
    id: 'recruiters',
    label: 'Recruiters',
    tagline: 'Hire verified talent',
    accent: '#06B6D4',
    icon: 'recruiter',
    x: 82,
    y: 86,
    features: ['Verified profiles', 'Skill filtering', 'Interviews'],
  },
  {
    id: 'ai',
    label: 'AI Assistant',
    tagline: 'Guides every step',
    accent: '#10B981',
    icon: 'ai',
    x: 18,
    y: 86,
    features: ['Mentor', 'Coach', 'Analyst'],
  },
]

export const JOURNEY_STEPS = [
  { n: '01', title: 'Discover', text: 'AI assesses your goals, strengths and interests to map the right direction for your career.', icon: 'compass', accent: '#2563EB' },
  { n: '02', title: 'Choose Learning Path', text: 'Pick from a personalized roadmap crafted from 2,500+ courses, micro-learning and live sessions.', icon: 'route', accent: '#4F46E5' },
  { n: '03', title: 'Learn', text: 'Absorb knowledge through video, reading, interactive exercises and AI-generated study plans.', icon: 'book', accent: '#06B6D4' },
  { n: '04', title: 'Practice', text: 'Test yourself in the coding playground, sandboxes and adaptive quizzes that learn your weak spots.', icon: 'code', accent: '#10B981' },
  { n: '05', title: 'Build Projects', text: 'Ship real-world projects with feedback loops from AI reviewers and expert mentors.', icon: 'rocket', accent: '#2563EB' },
  { n: '06', title: 'Earn Certificates', text: 'Earn verifiable, shareable certificates and badges that prove your skills to the world.', icon: 'award', accent: '#4F46E5' },
  { n: '07', title: 'Create Portfolio', text: 'SkillBridge composes a stunning portfolio and resume from your projects automatically.', icon: 'briefcase', accent: '#06B6D4' },
  { n: '08', title: 'Apply for Jobs', text: 'Your verified profile flows straight into matched job and internship openings.', icon: 'send', accent: '#10B981' },
  { n: '09', title: 'Interview', text: 'Practice with AI mock interviews, then ace real ones with recruiters who already know your work.', icon: 'mic', accent: '#2563EB' },
  { n: '10', title: 'Get Hired', text: 'Receive offers from a talent pool where skills — not keywords — decide your value.', icon: 'trophy', accent: '#4F46E5' },
  { n: '11', title: 'Grow Your Career', text: 'Continuous AI guidance for promotions, upskilling, mentorship and your next big leap.', icon: 'trend', accent: '#06B6D4' },
]

export const STUDENT_FEATURES = [
  { icon: 'dashboard', label: 'Learning Dashboard', color: '#2563EB' },
  { icon: 'map', label: 'AI Learning Roadmap', color: '#4F46E5' },
  { icon: 'clipboard', label: 'Assignments', color: '#06B6D4' },
  { icon: 'terminal', label: 'Coding Playground', color: '#10B981' },
  { icon: 'rocket', label: 'Projects', color: '#2563EB' },
  { icon: 'layout', label: 'Portfolio Builder', color: '#4F46E5' },
  { icon: 'file', label: 'Resume Builder', color: '#06B6D4' },
  { icon: 'briefcase', label: 'Internship Portal', color: '#10B981' },
  { icon: 'search', label: 'Job Portal', color: '#2563EB' },
  { icon: 'award', label: 'Certificates', color: '#4F46E5' },
  { icon: 'chart', label: 'Learning Analytics', color: '#06B6D4' },
  { icon: 'bookmark', label: 'Bookmarks', color: '#10B981' },
  { icon: 'gauge', label: 'Progress Tracking', color: '#2563EB' },
  { icon: 'calendar', label: 'Study Planner', color: '#4F46E5' },
  { icon: 'gamepad', label: 'Gamification', color: '#06B6D4' },
  { icon: 'shield', label: 'Badges & XP', color: '#10B981' },
  { icon: 'flame', label: 'Learning Streak', color: '#2563EB' },
]

export const TRAINER_FEATURES = [
  { icon: 'play-circle', label: 'Create Courses', color: '#2563EB' },
  { icon: 'upload', label: 'Upload Videos', color: '#4F46E5' },
  { icon: 'video', label: 'Live Classes', color: '#06B6D4' },
  { icon: 'clipboard', label: 'Assignments', color: '#10B981' },
  { icon: 'check-square', label: 'Quizzes', color: '#2563EB' },
  { icon: 'users', label: 'Student Analytics', color: '#4F46E5' },
  { icon: 'trend', label: 'Course Performance', color: '#06B6D4' },
  { icon: 'wallet', label: 'Revenue Dashboard', color: '#10B981' },
  { icon: 'message', label: 'Community Discussions', color: '#2563EB' },
  { icon: 'award', label: 'Certificates', color: '#4F46E5' },
  { icon: 'hand', label: 'Mentorship', color: '#06B6D4' },
]

export const RECRUITER_FEATURES = [
  { icon: 'building', label: 'Company Dashboard', color: '#2563EB' },
  { icon: 'briefcase', label: 'Post Jobs', color: '#4F46E5' },
  { icon: 'clock', label: 'Post Internships', color: '#06B6D4' },
  { icon: 'sparkles', label: 'Talent Discovery', color: '#10B981' },
  { icon: 'filter', label: 'Candidate Filtering', color: '#2563EB' },
  { icon: 'file', label: 'Resume Preview', color: '#4F46E5' },
  { icon: 'calendar', label: 'Interview Scheduling', color: '#06B6D4' },
  { icon: 'mail-check', label: 'Offer Management', color: '#10B981' },
  { icon: 'chart', label: 'Hiring Analytics', color: '#2563EB' },
]

export const AI_PROMPTS = [
  'Create Resume',
  'Generate Learning Plan',
  'Explain Java',
  'Explain React',
  'Prepare Interview',
  'Generate Quiz',
  'Suggest Internship',
  'Review Resume',
  'Career Guidance',
]

export const AI_CHAT = {
  intro: 'Hi, I\u2019m Aura \u2014 your AI career mentor. Ask me anything about learning, projects, resumes or interviews.',
  replies: {
    'Create Resume': 'Here\u2019s your optimized resume draft. I pulled 4 projects from your portfolio and matched 7 keywords recruiters at Microsoft and Infosys look for. Want me to tailor it for a specific role?',
    'Generate Learning Plan': 'I built you a 12-week roadmap for Frontend Engineering: HTML/CSS (wk 1-2) \u2192 JS mastery (wk 3-5) \u2192 React (wk 6-9) \u2192 2 portfolio projects (wk 10-12). Includes daily goals and milestones.',
    'Explain Java': 'Java is a class-based, object-oriented language that runs on the JVM \u2014 write once, run anywhere. Imagine a blueprint (class) you use to build objects (instances). Its garbage collection manages memory for you.',
    'Explain React': 'React is a JavaScript library for building UIs from components \u2014 small, reusable pieces. It uses a virtual DOM to efficiently update only what changed, and hooks let you manage state and effects cleanly.',
    'Prepare Interview': 'I\u2019ll run a live mock interview for a Frontend Engineer role. Expect: 2 DSA problems, 1 React architecture question and a behavioral segment. I\u2019ll score you and show weak areas after.',
    'Generate Quiz': 'Quiz ready: 10 questions covering JavaScript closures, event loop, React hooks and CSS grid. I mixed 3 difficulty levels based on your current XP. Type "start quiz" to begin!',
    'Suggest Internship': 'You match 3 open internships: Frontend Intern @ Microsoft (92% match), Data Intern @ Amazon (88%), Full-stack @ Infosys (84%). Your resume is auto-verified \u2014 one click to apply.',
    'Review Resume': 'Review complete. Score: 86/100. ATS passes 94% of filters. 3 suggestions: quantify project impact, add a skills section up top, and trim the summary to 2 lines. Want me to apply the edits?',
    'Career Guidance': 'Based on your streak of 42 days and project scores, you\u2019re 6 weeks from interview-ready for junior Frontend roles. Your strongest signal is React performance work \u2014 lean into it.',
  },
}

export const FEATURES = [
  { icon: 'sparkles', title: 'AI Mentor', text: 'A personal AI mentor that learns your pace, answers instantly, and keeps you accountable around the clock.', color: '#2563EB' },
  { icon: 'file', title: 'Resume Builder', text: 'Generate ATS-optimized resumes from your verified projects, skills and achievements in one click.', color: '#4F46E5' },
  { icon: 'layout', title: 'Portfolio Builder', text: 'Your projects transform into a stunning personal portfolio site \u2014 hosted, shareable and recruiter-ready.', color: '#06B6D4' },
  { icon: 'mic', title: 'Mock Interviews', text: 'Practice with role-specific AI interviews that score answers, timing and confidence in real time.', color: '#10B981' },
  { icon: 'terminal', title: 'Coding Playground', text: 'A browser IDE with 40+ languages, instant feedback and challenge-based drills that sharpen your skills.', color: '#2563EB' },
  { icon: 'map', title: 'Career Roadmaps', text: 'AI-crafted step-by-step roadmaps from where you are today to the role you want tomorrow.', color: '#4F46E5' },
  { icon: 'video', title: 'Live Classes', text: 'Interactive live sessions with top trainers, real-time polls, Q&A and session replays.', color: '#06B6D4' },
  { icon: 'clipboard', title: 'Assignments', text: 'Curated assignments with auto-grading and detailed feedback from both AI and human experts.', color: '#10B981' },
  { icon: 'rocket', title: 'Projects', text: 'Industry-grade projects that double as proof \u2014 reviewed, scored and portfolio-ready.', color: '#2563EB' },
  { icon: 'award', title: 'Certificates', text: 'Blockchain-verifiable certificates that recruiters can authenticate instantly.', color: '#4F46E5' },
  { icon: 'message', title: 'Discussion Forum', text: 'Ask anything, share insights and get answers from a thriving community of learners and experts.', color: '#06B6D4' },
  { icon: 'users', title: 'Community', text: 'Connect with peers, form study groups and grow your professional network inside one ecosystem.', color: '#10B981' },
  { icon: 'trophy', title: 'Hackathons', text: 'Weekly online hackathons with real sponsors, cash prizes and direct recruiter visibility.', color: '#2563EB' },
  { icon: 'bar-chart', title: 'Leaderboards', text: 'Earn XP, climb global and domain leaderboards, and turn learning into a competitive sport.', color: '#4F46E5' },
  { icon: 'bookmark', title: 'Bookmarks', text: 'Save courses, lessons, resources and jobs into smart collections that sync across devices.', color: '#06B6D4' },
  { icon: 'note', title: 'Notes', text: 'AI-powered note-taking that highlights key concepts and turns them into revision cards.', color: '#10B981' },
  { icon: 'play-circle', title: 'Video Learning', text: 'Cinema-grade lesson videos with transcripts, chapters, speed control and smart captions.', color: '#2563EB' },
  { icon: 'briefcase', title: 'Job Portal', text: 'A skill-first job board where verified candidates match openings without keyword lottery.', color: '#4F46E5' },
  { icon: 'clock', title: 'Internships', text: 'Campus-to-corporate internship tracks with real company projects and stipend support.', color: '#06B6D4' },
  { icon: 'bell', title: 'Notifications', text: 'Smart, real-time alerts for deadlines, streaks, matches, offers and mentor feedback.', color: '#10B981' },
  { icon: 'chart', title: 'Learning Analytics', text: 'Deep insights into time spent, mastery curves, focus patterns and career-readiness scores.', color: '#2563EB' },
  { icon: 'calendar', title: 'Study Planner', text: 'An AI planner that blocks your schedule, balances subjects and defends your focus time.', color: '#4F46E5' },
  { icon: 'compass', title: 'Career Guidance', text: 'Role-matching, salary insights and growth paths shaped by live industry demand data.', color: '#06B6D4' },
  { icon: 'bot', title: 'AI Chat', text: 'Aura, your always-on assistant for learning, career strategy, documents and everything between.', color: '#10B981' },
]

export const LIVE_ACTIVITY = [
  { actor: 'Rahul S.', action: 'completed the Java Certification', time: '2m ago', color: '#2563EB', icon: 'award' },
  { actor: 'Priya K.', action: 'earned a Gold Badge in AI & ML', time: '7m ago', color: '#F59E0B', icon: 'shield' },
  { actor: 'Microsoft', action: 'posted a new Frontend Internship', time: '14m ago', color: '#4F46E5', icon: 'briefcase' },
  { actor: 'Arun T.', action: 'uploaded a React Advanced course', time: '21m ago', color: '#06B6D4', icon: 'video' },
  { actor: 'SkillBridge AI', action: 'generated a new learning roadmap', time: '33m ago', color: '#10B981', icon: 'sparkles' },
  { actor: 'Meera N.', action: 'solved a Hard-level coding challenge', time: '41m ago', color: '#2563EB', icon: 'terminal' },
  { actor: 'Amazon', action: 'scheduled 12 interviews from the pool', time: '55m ago', color: '#4F46E5', icon: 'calendar' },
  { actor: 'Sneha R.', action: 'completed the Data Structures path', time: '1h ago', color: '#06B6D4', icon: 'trophy' },
  { actor: 'Vikram P.', action: 'achieved a 100-day learning streak', time: '1h ago', color: '#10B981', icon: 'flame' },
  { actor: 'TCS', action: 'posted 3 new Data Analyst roles', time: '2h ago', color: '#2563EB', icon: 'briefcase' },
  { actor: 'Kavya D.', action: 'earned the React Certified badge', time: '2h ago', color: '#4F46E5', icon: 'award' },
  { actor: 'OpenAI-expert trainer', action: 'launched a Prompt Engineering course', time: '3h ago', color: '#06B6D4', icon: 'video' },
]

export const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    role: 'Frontend Engineer \u00b7 Microsoft',
    initials: 'AS',
    color: '#2563EB',
    rating: 5,
    quote: 'SkillBridge didn\u2019t just teach me React \u2014 it built my resume, drilled me with AI interviews and placed me at Microsoft. My whole career changed in 7 months.',
    journey: 'From B.Tech student \u2192 SDE Intern \u2192 Full-time @ Microsoft',
    featured: true,
  },
  {
    name: 'Rohan Mehta',
    role: 'Data Analyst \u00b7 Amazon',
    initials: 'RM',
    color: '#4F46E5',
    rating: 5,
    quote: 'The AI roadmap knew exactly what to teach me next. I stopped wasting time on random tutorials and finally learned in a straight line to a job offer.',
    journey: 'Self-taught coder \u2192 Data Analyst @ Amazon',
    featured: false,
  },
  {
    name: 'Divya Iyer',
    role: 'Full-stack Developer \u00b7 Infosys',
    initials: 'DI',
    color: '#06B6D4',
    rating: 5,
    quote: 'My trainer dashboard grew my course revenue 5x in a year. But the real magic? Watching students who started from zero land real jobs.',
    journey: 'Freelance trainer \u2192 Top 1% educator on SkillBridge',
    featured: false,
  },
]

export const STATS = [
  { value: 100000, suffix: '+', label: 'Learners', sub: 'across 90+ countries', color: '#2563EB' },
  { value: 2500, suffix: '+', label: 'Courses', sub: 'curated & AI-mapped', color: '#4F46E5' },
  { value: 1000, suffix: '+', label: 'Recruiters', sub: 'hiring verified talent', color: '#06B6D4' },
  { value: 600, suffix: '+', label: 'Expert Trainers', sub: 'from top companies', color: '#10B981' },
  { value: 95, suffix: '%', label: 'Career Success Rate', sub: 'within 6 months', color: '#2563EB' },
]

export const HIGHLIGHTS = [
  { icon: 'lock', title: 'Secure Authentication', text: 'OAuth2, SSO, MFA and encrypted sessions keep every account fortress-grade.', color: '#2563EB' },
  { icon: 'users', title: 'Role-Based Experience', text: 'Dedicated workspaces for students, trainers and recruiters \u2014 tailored end to end.', color: '#4F46E5' },
  { icon: 'sparkles', title: 'AI Personalization', text: 'Every roadmap, feed and recommendation adapts to you in real time.', color: '#06B6D4' },
  { icon: 'cloud', title: 'Cloud Infrastructure', text: 'Globally distributed, auto-scaling architecture with 99.99% uptime.', color: '#10B981' },
  { icon: 'zap', title: 'Fast Performance', text: 'Edge-rendered pages, sub-second loads and 100/100 Lighthouse scores.', color: '#2563EB' },
  { icon: 'eye', title: 'Privacy First', text: 'Your data is yours. Zero third-party tracking, full GDPR & DPDP compliance.', color: '#4F46E5' },
  { icon: 'bell', title: 'Real-Time Notifications', text: 'Instant alerts on matches, offers, streaks, and community moments.', color: '#06B6D4' },
  { icon: 'target', title: 'Smart Recommendations', text: 'A recommendation engine trained on outcomes, not just clicks.', color: '#10B981' },
]

export const FAQS = [
  {
    q: 'What exactly is SkillBridge AI?',
    a: 'SkillBridge AI is a unified AI-powered ecosystem connecting students, trainers and recruiters. Learners follow AI-personalized paths to real skills, trainers build audiences and income, and recruiters hire from a pool of verified, project-proven talent \u2014 all on one platform.',
  },
  {
    q: 'How does the AI personalize my learning?',
    a: 'Onboarding and continuous signals (quiz scores, time-on-task, project reviews, goals) feed our engine. It rebuilds your roadmap daily, surfaces the highest-impact next lesson, schedules your planner and predicts the fastest path to your target role.',
  },
  {
    q: 'Is SkillBridge AI free to start?',
    a: 'Yes. The free tier includes AI guidance, select courses, the coding playground, community and one career roadmap. Paid plans unlock live classes, certifications, mock interviews and the full job portal.',
  },
  {
    q: 'How are my skills verified for recruiters?',
    a: 'Skills are verified through project submissions, proctored assessments, live coding evaluations and trainer endorsements \u2014 never self-declared. Every badge carries a verifiable credential recruiters can check instantly.',
  },
  {
    q: 'Can trainers really earn on the platform?',
    a: 'Trainers keep up to 90% of revenue from courses, live classes and mentorship. Analytics, marketing tools and AI assistants help you grow your audience and income \u2014 thousands already do.',
  },
  {
    q: 'How do companies hire through SkillBridge?',
    a: 'Recruiters post jobs and internships, then our AI surfaces pre-verified, skill-matched candidates. You can review portfolios, run AI-assisted interviews and manage offers \u2014 all from one hiring dashboard.',
  },
  {
    q: 'Which industries and roles are covered?',
    a: 'Everything from software engineering, data science and design to marketing, finance and operations \u2014 with new AI-mapped domains added every month based on live demand.',
  },
]

export const FOOTER_LINKS = {
  Company: ['About', 'Careers', 'Press', 'Brand', 'Contact'],
  Features: ['AI Mentor', 'Resume Builder', 'Mock Interviews', 'Hackathons', 'Analytics'],
  Learning: ['Courses', 'Live Classes', 'Learning Paths', 'Certificates', 'Coding Playground'],
  Careers: ['Job Portal', 'Internships', 'Recruiters', 'Hiring Analytics', 'Talent Pool'],
  Resources: ['Blog', 'Help Center', 'Community', 'API Docs', 'Status'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies', 'Licenses'],
}
