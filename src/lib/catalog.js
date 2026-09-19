// Shared option lists for enrollment + application flows.
// Single source of truth for course/degree/experience/skill data. Kept
// framework-free so a backend or fixtures can replace it later without
// touching any form UI.

export const DEGREE_OPTIONS = [
  'BCA',
  'B.Sc Computer Science',
  'B.Sc Information Technology',
  'B.Tech / BE',
  'MCA',
  'M.Sc',
  'MBA',
  'Other',
]

export const COURSE_OPTIONS = [
  'Full Stack Development',
  'Java Development',
  'React Development',
  'Python Development',
  'Data Science',
  'AI / Machine Learning',
  'UI/UX Design',
  'Other',
]

// Trainer application experience bands.
export const TRAINER_EXPERIENCE_OPTIONS = [
  '0–1 Years',
  '1–3 Years',
  '3–5 Years',
  '5–10 Years',
  '10+ Years',
]

// Optional quick-pick suggestions for the Known Skills chip input.
export const SKILL_SUGGESTIONS = [
  'JavaScript',
  'React',
  'Node.js',
  'Java',
  'Spring Boot',
  'Python',
  'Django',
  'SQL',
  'MongoDB',
  'AWS',
  'Docker',
  'Figma',
  'UI Design',
  'Data Analysis',
  'Machine Learning',
  'Git',
]
