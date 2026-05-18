// projects.js — Shared projects data, localStorage-based

const DEFAULT_PROJECTS = [
  {
    id: 1,
    name: "Ceylon Peakz — Tea E-Commerce Platform",
    description:
      "A fully functional e-commerce web application designed for a premium tea brand. Features an interactive product catalog, dynamic shopping cart, and seamless order placement online.",
    techStack: ["HTML5", "CSS3", "JavaScript (ES6)", "PHP", "Node.js"],
    type: "Solo Project",
    role: "Sole Full-Stack Developer",
    liveLink: "https://ceylonepeakz.com/index",
    githubLink: "",
    image: ""
  },
  {
    id: 2,
    name: "Inventrana — Inventory Management System (IMS)",
    description:
      "A full-stack group project to streamline inventory operations with stock management, order tracking, low-stock alerts, reporting, and role-based user access.",
    techStack: ["HTML", "CSS", "JavaScript", "Bootstrap", "PHP", "MySQL", "XAMPP"],
    type: "Group Project",
    role: "Backend Development, Database & Testing, Full-stack Integration (PHP development, MySQL database design, ER diagrams, debugging, feature integration, deployment & documentation)",
    liveLink: "https://inventrana.infinityfree.me/",
    githubLink: "",
    image: ""
  },
  {
    id: 3,
    name: "Academy Management System — Automated Cloud-Based Student & Fee Tracker",
    description:
      "A production-ready enterprise dashboard for educational institutes managing 700+ student records, academic performance tracking, disciplinary actions, and automated monthly tuition fee cycles with multi-level staff authentication.",
    techStack: ["Python", "Streamlit", "Supabase (Cloud PostgreSQL)", "PostgREST API", "Git & GitHub"],
    type: "Solo Project",
    role: "Full-Stack Software Engineer — entire lifecycle including UI design, database relational mapping, cloud infrastructure migration, API data pipeline integrations, and deployment.",
    liveLink: "",
    githubLink: "https://github.com/madhawaaravinda05-dotco",
    image: ""
  }
];

const DEFAULT_PERSONAL = {
  fullName: "P.M. Madhawa Aravinda Bandara Molagoda",
  displayName: "Madhawa Aravinda",
  roles: ["Full-Stack Developer", "CS Undergraduate", "Problem Solver"],
  about:
    "I'm someone who is constantly curious and driven to improve, both personally and professionally. I enjoy solving problems, exploring new ideas, and turning concepts into practical solutions. My mindset is focused on growth, creativity, and consistency — I believe that with the right attitude and effort, any challenge can become an opportunity to learn and succeed.",
  university: "NSBM Green University",
  degree: "BSc. (Hons) in Computer Science",
  year: "2nd Year",
  email: "madhawaaravinda05@gmail.com",
  phone: "",
  github: "https://github.com/madhawaaravinda05-dotco",
  linkedin: "https://www.linkedin.com/in/madhawa-aravinda-ab4bb8319/"
};

const DEFAULT_SKILLS = {
  languages: ["JavaScript (ES6+)", "TypeScript", "Java", "HTML5", "CSS3"],
  frameworks: ["React.js", "Next.js", "Tailwind CSS", "Bootstrap"],
  tools: ["MongoDB", "MySQL", "Git & GitHub", "Postman", "VS Code"],
  learning: ["Cloud Computing (AWS)", "Docker"]
};

function initData() {
  if (!localStorage.getItem("portfolio_projects")) {
    localStorage.setItem("portfolio_projects", JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem("portfolio_personal")) {
    localStorage.setItem("portfolio_personal", JSON.stringify(DEFAULT_PERSONAL));
  }
  if (!localStorage.getItem("portfolio_skills")) {
    localStorage.setItem("portfolio_skills", JSON.stringify(DEFAULT_SKILLS));
  }
}

function getProjects() {
  return JSON.parse(localStorage.getItem("portfolio_projects")) || DEFAULT_PROJECTS;
}

function saveProjects(projects) {
  localStorage.setItem("portfolio_projects", JSON.stringify(projects));
}

function getPersonal() {
  return JSON.parse(localStorage.getItem("portfolio_personal")) || DEFAULT_PERSONAL;
}

function savePersonal(data) {
  localStorage.setItem("portfolio_personal", JSON.stringify(data));
}

function getSkills() {
  return JSON.parse(localStorage.getItem("portfolio_skills")) || DEFAULT_SKILLS;
}

function saveSkills(data) {
  localStorage.setItem("portfolio_skills", JSON.stringify(data));
}
