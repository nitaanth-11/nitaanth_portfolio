/**
 * database.js — Simulated Database for Nitaanth's Portfolio
 * 
 * Replace values here to update the entire website.
 * When ready, swap this file with real API fetch calls
 * (e.g., Firebase, Supabase, MongoDB Atlas).
 */

const DATABASE = {

    // ─── HEADER / CONTACT ────────────────────────────────────────────
    header: {
        name: "Nitaanth",
        github: "https://github.com/nitaanth",
        linkedin: "https://www.linkedin.com/in/nitaanth-panickar-55043523a/",
        email: "nitaanth@example.com",
        phone: "+91 98765 43210"
    },

    // ─── HERO / PROFILE ──────────────────────────────────────────────
    profile: {
        greeting: "Hey, I'm",
        name: "Nitaanth",
        tagline: "Data Science Student | Building Smart Solutions",
        description: "I architect intelligent systems at the intersection of Cloud Computing, Large Language Models, and Distributed AI. Currently focused on building scalable, real-world applications powered by machine learning pipelines and modern infrastructure.",
        image: "profile.jpg",   // Place your image in the project folder
        interests: [
            "Cloud Computing",
            "Large Language Models",
            "Intelligent Systems",
            "Data Engineering",
            "MLOps"
        ]
    },

    // ─── EDUCATION ───────────────────────────────────────────────────
    education: [
        {
            level: "University",
            institution: "Your University Name",
            degree: "B.Tech in Computer Science / Data Science",
            period: "2022 – Present",
            description: "Specializing in Machine Learning, Cloud Architecture, and Intelligent Systems. Active member of the AI Research Club and hackathon teams.",
            image: "university.jpg",    // Place image in project folder
            location: "City, Country"
        },
        {
            level: "High School",
            institution: "Your High School Name",
            degree: "Senior Secondary (XII) — Science Stream",
            period: "2020 – 2022",
            description: "Focused on Mathematics, Physics, and Computer Science. Participated in national-level science olympiads and coding competitions.",
            image: "highschool.jpg",
            location: "City, Country"
        },
        {
            level: "School",
            institution: "Your School Name",
            degree: "Secondary (X) — CBSE / ICSE",
            period: "2018 – 2020",
            description: "Built foundational skills in programming and analytical thinking. Led the school's tech club and organized coding workshops.",
            image: "school.jpg",
            location: "City, Country"
        }
    ],

    // ─── PERSONAL PROJECTS ───────────────────────────────────────────
    projects: [
        {
            title: "MoodSignal",
            description: "A market sentiment analysis and prediction dashboard that scrapes social media, processes sentiment through NLP pipelines, and visualizes trends with interactive charts.",
            tags: ["Python", "NLP", "Streamlit", "Pandas"],
            github: "https://github.com/nitaanth/MoodSignal",
            deployed: "https://moodsignal.demo.com",
            status: "Live"
        },
        {
            title: "CloudSync AI",
            description: "Serverless ML model deployment pipeline using AWS Lambda, API Gateway, and S3 for automated training, versioning, and inference at scale.",
            tags: ["AWS", "Docker", "FastAPI", "TensorFlow"],
            github: "https://github.com/nitaanth/CloudSyncAI",
            deployed: "https://cloudsync-ai.demo.com",
            status: "Live"
        },
        {
            title: "LLM Knowledge Graph",
            description: "An intelligent knowledge extraction system that converts unstructured text into structured graph databases using LLM-powered entity recognition and relationship mapping.",
            tags: ["LangChain", "Neo4j", "OpenAI", "Python"],
            github: "https://github.com/nitaanth/LLM-KnowledgeGraph",
            deployed: "https://llm-kg.demo.com",
            status: "Beta"
        }
    ],

    // ─── PROFESSIONAL WORK ───────────────────────────────────────────
    professionalWork: [
        {
            title: "AI Automation Dashboard",
            company: "TechCorp Solutions",
            role: "Data Science Intern",
            period: "Jun 2025 – Present",
            description: "Built an internal analytics dashboard automating report generation using Python, Airflow, and Tableau, reducing manual effort by 60%.",
            link: "https://techcorp.example.com/project",
            tags: ["Python", "Airflow", "Tableau"]
        },
        {
            title: "Predictive Maintenance System",
            company: "IndustrialAI Labs",
            role: "ML Engineering Trainee",
            period: "Jan 2025 – May 2025",
            description: "Developed sensor anomaly detection models for industrial IoT equipment using time-series classification and deployed via REST APIs.",
            link: "https://industrialai.example.com/demo",
            tags: ["Scikit-learn", "FastAPI", "IoT"]
        }
    ],

    // ─── RESEARCH PAPERS ─────────────────────────────────────────────
    research: [
        {
            title: "Optimizing Transformer Attention for Low-Resource Languages",
            journal: "IEEE Conference on NLP",
            year: 2025,
            abstract: "Proposed a parameter-efficient fine-tuning approach for multilingual transformers, achieving state-of-the-art results on Indic language benchmarks.",
            link: "https://ieee.org/paper/example-1",
            doi: "10.1109/NLP.2025.001"
        },
        {
            title: "Cloud-Native ML Pipelines: A Comparative Study",
            journal: "ArXiv Preprint",
            year: 2024,
            abstract: "Benchmarked serverless vs. container-based ML deployment strategies across AWS, GCP, and Azure, evaluating cost, latency, and scalability.",
            link: "https://arxiv.org/abs/2024.example",
            doi: "arXiv:2024.12345"
        }
    ],

    // ─── CERTIFICATIONS ──────────────────────────────────────────────
    certifications: [
        {
            title: "AWS Certified Cloud Practitioner",
            issuer: "Amazon Web Services",
            date: "2025",
            link: "https://aws.amazon.com/certification/example",
            badge: "☁️"
        },
        {
            title: "TensorFlow Developer Certificate",
            issuer: "Google",
            date: "2024",
            link: "https://tensorflow.org/certificate/example",
            badge: "🧠"
        },
        {
            title: "Microsoft Azure AI Fundamentals",
            issuer: "Microsoft",
            date: "2024",
            link: "https://learn.microsoft.com/certifications/example",
            badge: "⚡"
        },
        {
            title: "Deep Learning Specialization",
            issuer: "Coursera / DeepLearning.AI",
            date: "2023",
            link: "https://coursera.org/certificate/example",
            badge: "📊"
        }
    ],

    // ─── ACHIEVEMENTS ────────────────────────────────────────────────
    achievements: [
        {
            title: "1st Place — National AI Hackathon",
            description: "Won the top prize at a 48-hour national AI hackathon for building a real-time disaster response prediction system.",
            year: 2025
        },
        {
            title: "Published Research at IEEE Conference",
            description: "Paper accepted and presented at an international IEEE conference on Natural Language Processing.",
            year: 2025
        },
        {
            title: "Dean's List — Academic Excellence",
            description: "Recognized for outstanding academic performance across three consecutive semesters.",
            year: 2024
        },
        {
            title: "Google Cloud Study Jam Winner",
            description: "Completed all advanced-level labs and earned the top performer badge in the university's cloud study program.",
            year: 2024
        },
        {
            title: "Open Source Contributor — LangChain",
            description: "Contributed feature enhancements and bug fixes to the LangChain open-source project.",
            year: 2024
        }
    ]
};
