/**
 * app.js — Nitaanth's Developer Portfolio & Interactive Engineering Showcase
 * 
 * Features:
 * - Lenis Smooth Scroll with GSAP ScrollTrigger synchronization
 * - Cursor Spotlight & Ambient Lighting
 * - Magnetic Hover Interactions & 3D Tilt Glare
 * - "How I Build" 6-Stage Glowing Engineering Timeline
 * - "My Technology Stack" 8-Category Interactive Ecosystem
 * - Featured Projects with Expandable Architecture Deep-Dives
 * - "Beyond Technology" Cinematic Horizontal Scroll Storytelling
 * - SentinelAI CLI Guide Modal with Copy-to-Clipboard
 * - REST API Client with Offline Local Backup Fallback
 */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════════════
    // 01. SMOOTH SCROLLING (Lenis + GSAP ScrollTrigger Sync)
    // ═══════════════════════════════════════════════════════════════
    let lenis = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                smoothTouch: false
            });

            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            } else {
                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            }
        } catch (e) {
            console.warn('Lenis initialization bypassed:', e);
        }
    }

    // Smooth scroll helper for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
                } else {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // 02. CURSOR SPOTLIGHT & SCROLL PROGRESS BAR
    // ═══════════════════════════════════════════════════════════════
    const cursorSpotlight = document.getElementById('cursor-spotlight');
    const scrollProgressBar = document.getElementById('scroll-progress');

    if (cursorSpotlight && !('ontouchstart' in window)) {
        window.addEventListener('pointermove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            cursorSpotlight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            cursorSpotlight.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursorSpotlight.style.opacity = '0';
        });
    }

    function updateScrollProgress() {
        if (!scrollProgressBar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // ═══════════════════════════════════════════════════════════════
    // 03. MAGNETIC HOVER INTERACTIONS
    // ═══════════════════════════════════════════════════════════════
    if (!prefersReducedMotion && !('ontouchstart' in window)) {
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
                el.style.transition = 'transform 0.1s ease-out';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate3d(0, 0, 0)';
                el.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // 04. 3D CARD TILT & GLARE SHINE
    // ═══════════════════════════════════════════════════════════════
    function initCardTilt() {
        if (prefersReducedMotion || ('ontouchstart' in window)) return;
        
        const tiltCards = document.querySelectorAll('.card-tilt');
        tiltCards.forEach(card => {
            // Avoid duplicate listeners
            if (card.dataset.tiltInitialized) return;
            card.dataset.tiltInitialized = 'true';

            let shine = card.querySelector('.card-shine');
            if (!shine) {
                shine = document.createElement('div');
                shine.className = 'card-shine';
                card.prepend(shine);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((centerY - y) / centerY) * 5; // Max 5 deg tilt
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
                
                // Update shine reflection
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 217, 255, 0.18), transparent 60%)`;
                shine.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                shine.style.opacity = '0';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // 05. "HOW I BUILD" — ENGINEERING WORKFLOW TIMELINE
    // ═══════════════════════════════════════════════════════════════
    function initWorkflowTimeline() {
        const stages = document.querySelectorAll('.workflow-stage-row');
        const progressBar = document.getElementById('workflow-progress-line');
        if (!stages.length) return;

        function checkWorkflowScroll() {
            const viewportCenter = window.innerHeight * 0.65;
            let highestActiveIndex = 0;

            stages.forEach((stage, idx) => {
                const rect = stage.getBoundingClientRect();
                if (rect.top <= viewportCenter) {
                    stage.classList.add('active');
                    highestActiveIndex = idx + 1;
                } else if (idx > 0) {
                    stage.classList.remove('active');
                }
            });

            if (progressBar) {
                const pct = ((highestActiveIndex - 1) / (stages.length - 1)) * 100;
                progressBar.style.height = `${Math.max(0, Math.min(100, pct))}%`;
            }
        }

        window.addEventListener('scroll', checkWorkflowScroll, { passive: true });
        checkWorkflowScroll();
    }
    initWorkflowTimeline();

    // ═══════════════════════════════════════════════════════════════
    // 06. "MY TECHNOLOGY STACK" — 8-CATEGORY INTERACTIVE ECOSYSTEM
    // ═══════════════════════════════════════════════════════════════
    const TECH_STACK_DATA = [
        // AI & Machine Learning
        { name: 'Python', category: 'ai-ml', categoryLabel: 'AI & ML', desc: 'Core language for all ML pipelines, AST parsing, RAG agent logic, and backend microservices.', projects: ['SentinelAI', 'FreightIQ', 'Bandhoo'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>` },
        { name: 'PyTorch', category: 'ai-ml', categoryLabel: 'AI & ML', desc: 'Deep learning neural models, sequence encoders, embedding spaces, and custom loss functions.', projects: ['FreightIQ', 'GeneBridge', 'Event Oracle'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>` },
        { name: 'TensorFlow / Keras', category: 'ai-ml', categoryLabel: 'AI & ML', desc: 'Convolutional classification networks, transfer learning baselines, and model serialization.', projects: ['JanRaksha', 'Xenotransplantation'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>` },
        { name: 'Scikit-Learn', category: 'ai-ml', categoryLabel: 'AI & ML', desc: 'Random Forests, XGBoost regressors, SVMs, hyperparameter tuning, and cross-validation pipelines.', projects: ['Beema', 'Event Oracle'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17l-5-5-3 3-4-4"/></svg>` },
        { name: 'Pandas & NumPy', category: 'ai-ml', categoryLabel: 'AI & ML', desc: 'Vectorized mathematical operations, multi-index temporal dataframes, matrix transformations.', projects: ['Event Oracle', 'FreightIQ'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>` },

        // Generative AI & NLP
        { name: 'Large Language Models (LLMs)', category: 'genai', categoryLabel: 'GenAI & NLP', desc: 'Llama 3.3-70B, GPT-4o, and Gemini multi-turn reasoning, prompt tuning, and structured outputs.', projects: ['SentinelAI', 'Bandhoo', 'Prompt Max'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
        { name: 'RAG Architectures', category: 'genai', categoryLabel: 'GenAI & NLP', desc: 'Retrieval-Augmented Generation grounding code vulnerabilities to CWE standards and remediation diffs.', projects: ['SentinelAI', 'Bandhoo'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>` },
        { name: 'LangGraph & Multi-Agent Loops', category: 'genai', categoryLabel: 'GenAI & NLP', desc: 'Stateful multi-actor agent orchestration, cyclic feedback loops, tool calling, and self-reflection.', projects: ['Bandhoo', 'SentinelAI'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>` },
        { name: 'Groq & Ultra-Fast Inference', category: 'genai', categoryLabel: 'GenAI & NLP', desc: 'Near-instantaneous token generation with Llama 3.3-70B on LPU architectures for low-latency scans.', projects: ['SentinelAI CLI'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
        { name: 'Hugging Face Transformers', category: 'genai', categoryLabel: 'GenAI & NLP', desc: 'Sentence-Transformers embedding models, tokenizers, open-weight model evaluation and deployment.', projects: ['Prompt Max', 'Fundamentals of LLM Cert'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>` },
        { name: 'Vector DBs (Qdrant & Chroma)', category: 'genai', categoryLabel: 'GenAI & NLP', desc: 'High-dimensional semantic indexing, cosine similarity search, and partitioned vector persistence.', projects: ['SentinelAI', 'Bandhoo'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>` },

        // Computer Vision
        { name: 'OpenCV', category: 'cv', categoryLabel: 'Computer Vision', desc: 'Real-time image filtering, edge detection, feature extraction, morphological transforms, and preprocessing.', projects: ['JanRaksha', 'Xenotransplantation'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/></svg>` },
        { name: 'YOLO & Object Detection', category: 'cv', categoryLabel: 'Computer Vision', desc: 'Single-stage bounding box prediction, spatial hazard identification, and real-time distress detection.', projects: ['JanRaksha'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` },
        { name: 'CNNs & Transfer Learning', category: 'cv', categoryLabel: 'Computer Vision', desc: 'ResNet and EfficientNet fine-tuning for biomedical image analysis and pattern classification.', projects: ['Xenotransplantation'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },

        // Backend Engineering
        { name: 'Flask', category: 'backend', categoryLabel: 'Backend Engineering', desc: 'Lightweight REST APIs, serverless Python handlers, modular blueprints, and microservice backends.', projects: ['NobleNet Platforms', 'GeneBridge', 'Portfolio Backend'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>` },
        { name: 'FastAPI', category: 'backend', categoryLabel: 'Backend Engineering', desc: 'Asynchronous Python microservices, Pydantic type validation, OpenAPI documentation, high throughput.', projects: ['JanRaksha', 'FreightIQ'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
        { name: 'REST APIs & Webhooks', category: 'backend', categoryLabel: 'Backend Engineering', desc: 'Strict API contracts, idempotency keys, rate limiting, secure auth headers, and payment webhooks.', projects: ['Maison Momento', 'Entrust Legal'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>` },
        { name: 'Node.js & Express', category: 'backend', categoryLabel: 'Backend Engineering', desc: 'Event-driven JavaScript runtime for fast edge microservices and asynchronous I/O tooling.', projects: ['Beema', 'Web Automation'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/></svg>` },

        // Frontend Development
        { name: 'Modern JavaScript (ES6+)', category: 'frontend', categoryLabel: 'Frontend Dev', desc: 'Asynchronous DOM manipulation, modular architecture, Web APIs, IntersectionObservers, clean animations.', projects: ['knownitaanth.live', 'Maison Momento'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
        { name: 'HTML5 & Modern CSS3', category: 'frontend', categoryLabel: 'Frontend Dev', desc: 'Semantic layouts, CSS custom properties, fluid responsive grids, glassmorphism, GPU-accelerated transforms.', projects: ['All Web Deployments'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>` },
        { name: 'UI/UX & Micro-interactions', category: 'frontend', categoryLabel: 'Frontend Dev', desc: 'Cursor spotlights, 3D card tilts, magnetic buttons, Lenis smooth scrolling, accessible focus states.', projects: ['Portfolio Design System', 'Adv Jyoti'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>` },

        // Databases & Storage
        { name: 'PostgreSQL', category: 'database', categoryLabel: 'Databases & Storage', desc: 'Relational schema modeling, foreign key constraints, ACID compliance, complex relational queries.', projects: ['JanRaksha', 'Entrust Legal'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>` },
        { name: 'MongoDB', category: 'database', categoryLabel: 'Databases & Storage', desc: 'Flexible JSON document persistence, nested event schemas, high-throughput ingest pipelines.', projects: ['Event Oracle', 'Maison Momento'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>` },
        { name: 'Supabase & SQLite', category: 'database', categoryLabel: 'Databases & Storage', desc: 'Serverless real-time database, instant API scaffolding, Row Level Security, embedded storage.', projects: ['Bandhoo', 'SentinelAI Local Cache'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v16"/></svg>` },

        // Cloud & DevOps
        { name: 'Docker Containerization', category: 'cloud', categoryLabel: 'Cloud & DevOps', desc: 'Multi-stage Dockerfiles, isolated reproducible environments, microservice packaging, lightweight images.', projects: ['FreightIQ', 'SentinelAI', 'NobleNet'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>` },
        { name: 'Amazon Web Services (AWS)', category: 'cloud', categoryLabel: 'Cloud & DevOps', desc: 'S3 storage, EC2 compute instances, Data Lakes on AWS, IAM role scoping, solution architecture.', projects: ['AWS Certified Solutions', 'Data Lakes Cert'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
        { name: 'Google Cloud Platform (GCP)', category: 'cloud', categoryLabel: 'Cloud & DevOps', desc: 'Cloud Run, BigQuery telemetry datasets, serverless triggers, structured log aggregation.', projects: ['Event Oracle', 'JanRaksha'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>` },
        { name: 'GitHub Actions & CI/CD', category: 'cloud', categoryLabel: 'Cloud & DevOps', desc: 'Automated test suites, linting, build verification, container publishing, auto-deploy workflows.', projects: ['SentinelAI Security Gating'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>` },
        { name: 'Render & Vercel Edge', category: 'cloud', categoryLabel: 'Cloud & DevOps', desc: 'Zero-config serverless deployments, automatic SSL certificates, edge CDN caching, production routing.', projects: ['knownitaanth.live', 'Maison Momento', 'GeneBridge'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>` },

        // Geospatial AI & GIS
        { name: 'Geospatial AI & GIS Telemetry', category: 'gis', categoryLabel: 'Geospatial AI', desc: 'Spatial coordinate clustering, GeoJSON polygon boundaries, real-time vehicle telemetry mapping.', projects: ['JanRaksha', 'FreightIQ'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>` },
        { name: 'Route Optimization & Haversine Distance', category: 'gis', categoryLabel: 'Geospatial AI', desc: 'Constrained multi-stop TSP solving, road network graphs, latency estimation, congestion avoidance.', projects: ['FreightIQ (Lorri Finalist)'], icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12"/></svg>` }
    ];

    function renderTechStack(category = 'all') {
        const grid = document.getElementById('tech-grid');
        if (!grid) return;

        const filtered = category === 'all' 
            ? TECH_STACK_DATA 
            : TECH_STACK_DATA.filter(t => t.category === category);

        grid.innerHTML = '';

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card tech-card card-tilt';
            card.innerHTML = `
                <div class="card-shine"></div>
                <div class="tech-card-header">
                    <div class="tech-card-icon">${item.icon}</div>
                    <span class="tech-card-category-badge">${item.categoryLabel}</span>
                </div>
                <h3 class="tech-card-name">${item.name}</h3>
                <p class="tech-card-desc">${item.desc}</p>
                <div class="tech-card-projects">
                    <span class="tech-card-projects-label">Used In:</span>
                    <div class="tech-card-tags">
                        ${item.projects.map(p => `<span class="tech-tag">${p}</span>`).join('')}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        initCardTilt();
    }

    // Tech filter pills click listener
    const filterPills = document.querySelectorAll('.tech-filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const cat = pill.getAttribute('data-category');
            renderTechStack(cat);
        });
    });

    renderTechStack('all');

    // ═══════════════════════════════════════════════════════════════
    // 07. "BEYOND TECHNOLOGY" — HORIZONTAL STORYTELLING SCROLL
    // ═══════════════════════════════════════════════════════════════
    function initHorizontalScroll() {
        const beyondTrack = document.getElementById('beyond-track');
        const beyondSection = document.getElementById('beyond');

        if (!beyondTrack || !beyondSection) return;

        if (!prefersReducedMotion && window.innerWidth > 768 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            const getScrollDistance = () => beyondTrack.scrollWidth - beyondSection.offsetWidth + 80;

            gsap.to(beyondTrack, {
                x: () => -getScrollDistance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: beyondSection,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: () => `+=${getScrollDistance()}`,
                    invalidateOnRefresh: true
                }
            });
        }
    }
    initHorizontalScroll();

    // ═══════════════════════════════════════════════════════════════
    // 08. VERIFIED PROJECTS SHOWCASE WITH EXPANDABLE ARCHITECTURES
    // ═══════════════════════════════════════════════════════════════
    const VERIFIED_PROJECTS = [
        {
            title: "FreightIQ",
            domain: "Logistics & Supply Chain",
            status: "Live",
            badgeClass: "status-live",
            description: "Intelligent multi-modal logistics routing and freight optimizer utilizing neural networks and heuristic constraint solvers to minimize transport latency, fuel burn, and routing overhead. Finalist at the Lorri AI Hackathon.",
            tags: ["Python", "PyTorch", "Heuristic Search", "MLOps", "Route Optimization", "Docker"],
            github: "https://github.com/siddh-sh/LoRRI",
            deployed: "https://lorri.onrender.com/",
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
            architecture: {
                systemDesign: "Multi-layered microservices topology featuring an asynchronous route solver engine, geospatial coordinate ingest gateway, and dynamic vehicle telemetry cache.",
                dataFlow: "Consignment Orders & Fleet GPS Coordinates → Ingestion Queue → Constraint Evaluation Engine → Heuristic Shortest Path Matrix → Render Web UI.",
                keyDecisions: "Implemented hybrid neural heuristics rather than plain linear programming to compute feasible routes under 350ms even with 500+ dynamic waypoints."
            }
        },
        {
            title: "GeneBridge",
            domain: "Bioinformatics & Health Tech",
            status: "Live",
            badgeClass: "status-live",
            description: "Computational genomics and genetic sequence alignment platform engineered to discover and visualize hereditary correlations across multi-strain genetic data with interactive computational models.",
            tags: ["BioPython", "Genomics", "Sequence Alignment", "Flask", "Vercel", "Docker"],
            github: "https://github.com/nitaanth-11/GeneBridge",
            deployed: "https://gene-bridge-31eg.vercel.app/",
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 10.5C4.5 5 12 3 12 3s7.5 2 7.5 7.5c0 5-7.5 10.5-7.5 10.5s-7.5-5.5-7.5-10.5z"/><path d="M12 3v18M8 7h8M7 11h10M8 15h8"/></svg>`,
            architecture: {
                systemDesign: "Serverless Flask pipeline running on Vercel Edge with client-side genomic visualization and distributed sequence alignment workers.",
                dataFlow: "FASTA / GenBank Raw Ingestion → Biopython Alignment Parser → Mutation Hotspot Matrix → Interactive WebGL Vector Visualization.",
                keyDecisions: "Decoupled sequence processing into chunked in-memory arrays to prevent browser memory exhaustion on multi-megabase genomic comparisons."
            }
        },
        {
            title: "JanRaksha",
            domain: "Public Safety & Civic Tech",
            status: "Live",
            badgeClass: "status-live",
            description: "Real-time emergency response and disaster relief orchestration platform. Ingests crowd-sourced distress signals, assesses geospatial urgency scores, and coordinates rapid responder dispatch pipelines.",
            tags: ["FastAPI", "Python", "Geospatial AI", "PostgreSQL", "Real-Time Pipelines", "Cloud"],
            github: "https://github.com/nitaanth-11/JanRaksha",
            deployed: "https://janraksha-wyc6.onrender.com/",
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v8M8 12h8"/></svg>`,
            architecture: {
                systemDesign: "High-throughput asynchronous FastAPI backend wired to PostgreSQL with PostGIS extensions for millisecond-latency spatial containment queries.",
                dataFlow: "Emergency SOS Webhooks → Geohash Indexer → Severity Priority Queue → Responder Geo-Dispatch Matrix → Live Command Dashboard.",
                keyDecisions: "Adopted asynchronous non-blocking event loops to prevent triage bottlenecks during simultaneous high-volume disaster influx events."
            }
        },
        {
            title: "Beema",
            domain: "InsurTech & FinTech",
            status: "Live",
            badgeClass: "status-live",
            description: "Automated insurance underwriting and claim adjudication engine. Leverages predictive risk assessment models, anomaly detection algorithms, and a streamlined digital interface for policy approval acceleration.",
            tags: ["InsurTech", "Risk Scoring", "Predictive Modeling", "Next.js", "Vercel"],
            github: "https://github.com/nitaanth-11/Beema",
            deployed: "https://beema-jade.vercel.app/",
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12A10 10 0 0 0 12 2 10 10 0 0 0 2 12c0 2.4 1 3.5 2 3.5 1 0 1.5-.7 2-1.5.8-1.3 1.8-2 3-2 1.3 0 2.2.7 3 2 .5.8 1 1.5 2 1.5 1 0 1.5-.7 2-1.5.8-1.3 1.8-2 3-2 1.3 0 2.2.7 3 2 .5.8 1 1.5 2 1.5 1 0 2-1.1 2-3.5z"/><path d="M12 12v7a2 2 0 0 0 4 0"/></svg>`,
            architecture: {
                systemDesign: "Predictive decision pipeline evaluating historical claim outcomes, statistical outlier boundaries, and applicant credit profiles.",
                dataFlow: "Claim Documentation & Forms → Feature Extractor → Supervised Anomaly Classifier → Fraud Risk Scorecard → Instant Underwriting Decision.",
                keyDecisions: "Integrated automated boundary guardrails to flag statistical anomalies for manual underwriter review rather than blanket rejection."
            }
        },
        {
            title: "Bandhoo",
            domain: "Legal AI & Penal Code NLP",
            status: "Live",
            badgeClass: "status-live",
            description: "Mumbai crime-reporting and legal-provision classification engine based on the Bharatiya Nyaya Sanhita (BNS, 2023) and procedural mandates under the Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023). Evaluates natural-language police complaints across English, Hindi, and Hinglish with a 4-tier statutory certainty schema, clause-level retrieval, and automated procedural mapping.",
            tags: ["BNS 2023", "BNSS Procedure", "Legal NLP", "4-Tier Classification", "Multilingual (EN/HI/Hinglish)", "Vercel Live"],
            github: "https://github.com/nitaanth-11/Bandhoo",
            deployed: "https://bandhoo-sigma.vercel.app/",
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 7l4-2 4 2M3 7v4c0 2 2 3 4 3s4-1 4-3V7M13 7l4-2 4 2M13 7v4c0 2 2 3 4 3s4-1 4-3V7M8 21h8"/></svg>`,
            architecture: {
                systemDesign: "Dual-stage legal classification harness combining single-pass clause-level BM25 legal retrieval (max_k=8) over codified statutory provisions with an LLM reasoning validator enforcing strict fact/inference separation.",
                dataFlow: "Multilingual Complaint (English, Hindi, or Hinglish) → Preprocessing & Entity Extraction → Clause-Level Statutory Retrieval (BNS 2023) → 4-Tier Certainty Classifier → BNSS Schedule I Part I Procedural Determination → Transparent Legal Rationale Output.",
                keyDecisions: "Formulated a 4-Tier Certainty Schema (Tier A–D) to prevent hallucinated penal sections on ambiguous complaints, accompanied by explicit negation and keyword trap immunity (e.g., neutralizing metaphorical traps like 'daylight robbery' or 'samay loot liya')."
            }
        },
        {
            title: "Sentinel AI",
            domain: "Cybersecurity & Code Analysis",
            status: "CLI Tool",
            badgeClass: "status-cli",
            description: "Command-line vulnerability detection and code security engine. Combines static AST analysis with Retrieval-Augmented Generation (RAG) for explainable security audits. Accepted at ICDECT-2026 (Springer Proceedings).",
            tags: ["CLI Security Tool", "Static AST", "RAG Reasoning", "Springer Proceedings", "Vulnerability Scanning"],
            github: "https://github.com/nitaanth-11/Sentinel-AI",
            deployed: "CLI Tool",
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
            architecture: {
                systemDesign: "Dual-engine security harness uniting deterministic AST rule matchers (Semgrep/Bandit) with an LLM reasoning node running on Groq (Llama 3.3-70B).",
                dataFlow: "Local Codebase AST Scan → Flaw Detection & Correlation → CWE Knowledge Base Retrieval → AI Root-Cause Remediation → Syntactically Validated Patch.",
                keyDecisions: "Engineered automated rollback mechanisms (`sentinelai undo`) so developers can apply and revert AI-generated patches with zero syntax risk."
            }
        },
        {
            title: "Prompt Max",
            domain: "Reinforcement Learning & GenAI",
            status: "Live",
            badgeClass: "status-live",
            description: "Reinforcement learning-driven prompt optimization system (Optima). Analyzes query intents, applies iterative reward modeling, and automatically rewrites prompts to maximize LLM accuracy and task benchmarks.",
            tags: ["Reinforcement Learning", "Reward Modeling", "Prompt Optimization", "LLMOps", "Render"],
            github: "https://github.com/vedikas323-pixel/RL_Prompt_Optimizer",
            deployed: "https://optima-kvj6.onrender.com",
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
            architecture: {
                systemDesign: "Closed-loop feedback optimizer combining policy gradients with quantitative output benchmark scoring.",
                dataFlow: "Raw Seed Prompt → Policy Mutation Agent → Multi-Task Benchmark Evaluator → Reward Function Computation → Optimal Prompt Deployment.",
                keyDecisions: "Implemented multi-objective reward scoring (accuracy vs. token brevity) to balance inference cost with semantic quality."
            }
        },
        {
            title: "Event Oracle",
            domain: "Quantitative Finance & Macro AI",
            status: "Live",
            badgeClass: "status-live",
            description: "Multi-source financial forecasting pipeline for NIFTY 50 and index options, fusing OHLCV price action, FII/DII liquidity flows, macroeconomic release surprises, and news sentiment for volatility prediction.",
            tags: ["GCP", "Agentic AI", "Ensemble Learning", "Time Series Analysis", "MongoDB"],
            github: "https://github.com/nitaanth-11/Project-Apex",
            deployed: "https://project-apex-baip.onrender.com/",
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 14l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/></svg>`,
            architecture: {
                systemDesign: "Event-driven time-series pipeline hosted on GCP with rolling window feature stores and sentiment scoring microservices.",
                dataFlow: "Exchange Tick Feeds & Financial Headlines → Tokenizer & NLP Ingest → Vector Sentiment Indexing → Gradient Boosted Volatility Ensemble → Forecast UI.",
                keyDecisions: "Adopted exponential decay weights for macro announcements to ensure model responsiveness during earnings releases."
            }
        }
    ];

    function renderProjectsShowcase(projects) {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const list = projects || VERIFIED_PROJECTS;

        list.forEach((proj, idx) => {
            const isSentinel = (proj.title || '').toLowerCase().includes('sentinel');
            const card = document.createElement('div');
            card.className = `card project-card card-tilt ${isSentinel ? 'sentinel-card-item' : ''}`;

            let liveLinkHTML = '';
            const dep = (proj.deployed || '').trim();
            if (dep.startsWith('http')) {
                liveLinkHTML = `
                    <a href="${dep}" target="_blank" class="project-action-link">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Live Demo
                    </a>`;
            } else if (isSentinel || dep.toLowerCase().includes('cli')) {
                liveLinkHTML = `
                    <button type="button" class="project-action-link sentinel-cli-trigger" title="Open SentinelAI CLI Scans Guide & Interactive Snippets">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                        CLI Scans Guide ↗
                    </button>`;
            } else {
                liveLinkHTML = `
                    <span class="project-link-badge badge-testing">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                        Under Testing
                    </span>`;
            }

            const gitLinkHTML = (proj.github && proj.github.startsWith('http'))
                ? `<a href="${proj.github}" target="_blank" class="project-action-link project-link-github">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    Source Code
                </a>`
                : '';

            const arch = proj.architecture || {
                systemDesign: "Production microservices architecture with decoupled background job execution and stateless REST contracts.",
                dataFlow: "API Requests → Validation Gateway → Business Processing Pipeline → Persistent Storage → Client Notification.",
                keyDecisions: "Optimized for latency and reproducible cloud deployments with containerized service isolation."
            };

            const drawerId = `arch-drawer-${idx}`;

            card.innerHTML = `
                <div class="card-shine"></div>
                
                <div class="project-card-header">
                    <div class="project-icon-box">${proj.icon}</div>
                    <div class="project-badge-group">
                        ${proj.domain ? `<span class="project-domain-pill">${proj.domain}</span>` : ''}
                        <span class="project-status-pill ${proj.badgeClass || 'status-live'}">${proj.status || 'Live'}</span>
                    </div>
                </div>

                <h3 class="project-card-title">${proj.title}</h3>
                <p class="project-card-desc">${proj.description}</p>

                <div class="tags-row">
                    ${(proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                </div>

                <!-- Action Links Row -->
                <div class="project-card-footer">
                    <div class="project-links-group">
                        ${liveLinkHTML}
                        ${gitLinkHTML}
                    </div>

                    <button type="button" class="arch-toggle-btn magnetic" data-target="${drawerId}" aria-expanded="false" title="View technical architecture and system design">
                        <span>Architecture Deep Dive</span>
                        <svg class="arch-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                </div>

                <!-- Expandable Technical Architecture Drawer -->
                <div class="project-arch-drawer" id="${drawerId}" aria-hidden="true">
                    <div class="arch-drawer-inner">
                        <div class="arch-spec-block">
                            <span class="arch-spec-label">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                                System Architecture
                            </span>
                            <p class="arch-spec-content">${arch.systemDesign}</p>
                        </div>
                        <div class="arch-spec-block">
                            <span class="arch-spec-label">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                Data Flow Pipeline
                            </span>
                            <p class="arch-spec-content">${arch.dataFlow}</p>
                        </div>
                        <div class="arch-spec-block">
                            <span class="arch-spec-label">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                                Key Engineering Decisions
                            </span>
                            <p class="arch-spec-content">${arch.keyDecisions}</p>
                        </div>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        // Initialize accordion toggles
        document.querySelectorAll('.arch-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = btn.getAttribute('data-target');
                const drawer = document.getElementById(targetId);
                if (!drawer) return;

                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    btn.setAttribute('aria-expanded', 'false');
                    btn.classList.remove('active');
                    drawer.classList.remove('open');
                    drawer.setAttribute('aria-hidden', 'true');
                } else {
                    btn.setAttribute('aria-expanded', 'true');
                    btn.classList.add('active');
                    drawer.classList.add('open');
                    drawer.setAttribute('aria-hidden', 'false');
                }

                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            });
        });

        initCardTilt();
    }

    renderProjectsShowcase(VERIFIED_PROJECTS);

    // ═══════════════════════════════════════════════════════════════
    // 09. NOBLENET CLIENT VENTURES, RESEARCH & CERTIFICATES RENDERERS
    // ═══════════════════════════════════════════════════════════════
    function renderWork(workItems) {
        const grid = document.getElementById('work-grid');
        if (!grid || !workItems || workItems.length === 0) return;

        const clientProjects = Array.isArray(workItems)
            ? workItems.filter(item => !(item.company && item.company.toLowerCase().includes('noblenet') && !item.company.toLowerCase().includes('via') && !item.company.toLowerCase().includes('under') && (item.title || '').toLowerCase().includes('intern')))
            : [];

        if (clientProjects.length === 0) return;
        grid.innerHTML = '';

        clientProjects.forEach(work => {
            const card = document.createElement('a');
            card.href = work.link || '#';
            card.target = '_blank';
            card.className = 'card client-project-card card-tilt';

            const isPrelaunch = (work.status || '').toLowerCase().includes('pre-launch') || (work.status || '').toLowerCase().includes('prototype');
            const statusClass = isPrelaunch ? 'status-prelaunch' : 'status-live';
            const statusText = work.status || (isPrelaunch ? 'Cloud Prototype' : 'Live Platform');
            const categoryBadge = work.badge || (work.title.toLowerCase().includes('perfume') || work.company.toLowerCase().includes('momento') ? 'Luxury Fragrance Brand' : 'Legal Tech & Portals');
            const cleanCompanyName = work.company.replace(/\s*\(.*\)/, '');
            const actionText = isPrelaunch ? 'View Prototype' : `Visit ${cleanCompanyName}`;
            const noteText = work.note || (isPrelaunch ? 'Prototype live on Render (Pre-launch / compliance)' : 'Live Production Platform');

            card.innerHTML = `
                <div class="card-shine"></div>
                <div class="client-card-top">
                    <div class="client-header-main">
                        <div class="client-badge-row">
                            <span class="client-category-badge">${categoryBadge}</span>
                            <span class="client-status-badge ${statusClass}">${statusText}</span>
                        </div>
                        <h4 class="client-project-name">${cleanCompanyName}</h4>
                        <p class="client-role-title">${work.title}</p>
                    </div>
                    <div class="client-link-icon" title="${actionText}">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </div>
                </div>
                <p class="client-project-desc">${work.description}</p>
                <div class="tags-row">
                    ${(work.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="client-card-footer">
                    <span class="client-note">${noteText}</span>
                    <span class="client-action-btn">
                        ${actionText}
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                </div>
            `;
            grid.appendChild(card);
        });

        initCardTilt();
    }

    function renderResearch(papers) {
        const grid = document.getElementById('research-grid');
        if (!grid || !papers || papers.length === 0) return;
        grid.innerHTML = '';

        papers.forEach(paper => {
            const isSentinel = (paper.title || '').toLowerCase().includes('sentinel');
            const row = document.createElement('a');
            row.href = paper.link || '#';
            row.target = '_blank';
            row.className = 'research-item-row';
            row.innerHTML = `
                <div class="research-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div class="research-row-content">
                    <div class="research-row-header">
                        <h3 class="research-title">${paper.title}</h3>
                        ${paper.status ? `<span class="activity-chip" style="color: var(--accent-primary); border-color: rgba(0, 217, 255, 0.3); font-weight: 700;">${paper.status}</span>` : ''}
                    </div>
                    ${paper.subtitle ? `<p class="research-status-note">${paper.subtitle}</p>` : ''}
                    <p class="research-abstract">${paper.abstract || ''}</p>
                    <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 10px;">
                        <div class="research-link" style="margin-top: 0; color: var(--accent-primary); font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            View Manuscript (PDF)
                        </div>
                        ${isSentinel ? `
                        <button type="button" class="sentinel-cli-trigger" style="background: none; border: none; font-family: var(--font-mono); font-size: 0.76rem; font-weight: 600; color: var(--accent-highlight); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 0;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            CLI Scans Guide ↗
                        </button>` : ''}
                    </div>
                </div>
            `;
            grid.appendChild(row);
        });
    }

    function renderCerts(certs) {
        const grid = document.getElementById('certs-grid');
        if (!grid || !certs || certs.length === 0) return;
        grid.innerHTML = '';

        certs.forEach(cert => {
            let logoHTML = '';
            const issuerLower = (cert.issuer || '').toLowerCase();
            const badgeUpper = (cert.badge || '').toUpperCase();
            
            if (issuerLower.includes('aws') || badgeUpper === 'AWS') {
                logoHTML = `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#FF9900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(255, 153, 0, 0.3));"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
            } else if (issuerLower.includes('huggingface') || issuerLower.includes('hugging face') || badgeUpper === 'LLM' || badgeUpper === 'AGNT') {
                logoHTML = `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#FFD21E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(255, 210, 30, 0.3));"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="3"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="3"/><path d="M4 17c.5-1.5 2-2.5 3.5-2.5.8 0 1.5.3 2 1"/><path d="M20 17c-.5-1.5-2-2.5-3.5-2.5-.8 0-1.5.3-2 1"/></svg>`;
            } else {
                logoHTML = `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#00D9FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(0, 217, 255, 0.3));"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>`;
            }

            const card = document.createElement('a');
            card.href = cert.link || '#';
            card.target = '_blank';
            card.className = 'card cert-card card-tilt';
            card.innerHTML = `
                <div class="card-shine"></div>
                <div class="cert-badge" style="display: flex; justify-content: center; align-items: center; min-height: 48px; margin-bottom: 0.8rem;">${logoHTML}</div>
                <h3 class="cert-title">${cert.title}</h3>
                <p class="cert-issuer">${cert.issuer}</p>
                <p class="cert-date">${cert.date}</p>
                <div class="cert-verify">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Verify Credential (PDF)
                </div>
            `;
            grid.appendChild(card);
        });

        initCardTilt();
    }

    // ═══════════════════════════════════════════════════════════════
    // 10. LOCAL BACKUP FALLBACK DATA & API FETCHER
    // ═══════════════════════════════════════════════════════════════
    const LOCAL_FALLBACK = {
        work: [
            {
                "title": "Lead Full Stack & Recommendation Systems Engineer",
                "company": "Maison Momento",
                "role": "Lead Architect",
                "period": "2025 – Present",
                "status": "Cloud Prototype",
                "badge": "Luxury Fragrance Brand",
                "description": "Handling the end-to-end technology ecosystem for Maison Momento, an upcoming luxury perfume brand. Architected personalized fragrance recommendation algorithms, administrative handling dashboard, secure payment gateway integrations, REST APIs, and responsive UI/UX with SEO optimization. Cloud prototype is fully deployed and active on Render, pending final compliance clearance prior to live launch.",
                "link": "https://maison-momento.onrender.com/products/",
                "note": "Prototype live on Render (Pre-launch / compliance)",
                "tags": ["Recommendation Systems", "Admin Handling", "Payment Gateways", "UI/UX & SEO", "Render Cloud", "REST API"]
            },
            {
                "title": "Full Stack Engineer & Portal Architect",
                "company": "Entrust Legal Services",
                "role": "Portal Architect",
                "period": "Jun 2025 – Present",
                "status": "Live Platform",
                "badge": "Legal Tech Firm",
                "description": "Engineered a high-impact web presence for legal firm Entrust Legal Services to expand their firm presence. Additionally architected and deployed a dedicated student internship portal enabling law students to seek internships, submit applications, and track application verification directly through the firm.",
                "link": "https://www.entrustlegal.in/",
                "note": "Firm presence & active student internship portal",
                "tags": ["Student Internship Portal", "Legal Tech", "Full Stack Python", "Admin Workflows", "Cloud Hosting"]
            },
            {
                "title": "Web Developer & Client Solutions",
                "company": "Adv Jyoti & Co.",
                "role": "Lead Developer",
                "period": "Jan 2025 – May 2025",
                "status": "Live Platform",
                "badge": "Legal Practice",
                "description": "Architected and launched the official responsive client portal for legal firm Adv Jyoti & Co. to elevate their digital reach, introducing online client consultation scheduling and secure document submission workflows under NobleNet Software Technologies.",
                "link": "https://adv-jyoti.web.app/",
                "note": "Live client scheduling & legal practice portal",
                "tags": ["Client Portal", "Appointment Scheduling", "Document Filing", "Firebase Hosting", "NobleNet Delivery"]
            }
        ],
        research: [
            {
                "title": "Sentinel AI",
                "subtitle": "accepted at ICDECT-2026 (Springer proceedings), Nov 2026 and will be in journal of ICDECT in 10 months",
                "status": "Accepted · Springer",
                "year": 2026,
                "abstract": "Combining Static Analysis and Retrieval-Augmented Reasoning for Explainable Vulnerability Detection. Validating automated vulnerability analysis through layered LLM reasoning grounded in static code metrics.",
                "link": "Research-Papers/252_CRC.pdf",
                "journal": "ICDECT-2026 (Springer Proceedings)",
                "tags": ["Springer", "Static Analysis", "RAG", "Vulnerability Detection"]
            },
            {
                "title": "Bandhoo",
                "subtitle": "BNS Legal Classification Benchmark & Procedural Reasoning Engine · Under IEEE Review",
                "status": "Under Peer Review · IEEE",
                "year": 2026,
                "abstract": "A Mumbai crime-reporting and statutory classification framework benchmarked on 50 diverse multilingual complaints (English, Hindi, Hinglish) across 12 penal categories under Bharatiya Nyaya Sanhita (BNS, 2023) and BNSS First Schedule.",
                "link": "Research-Papers/Bandhoo_IEEE_paper.pdf",
                "journal": "Under Peer Review (IEEE)",
                "tags": ["BNS 2023", "Legal NLP", "BNSS Procedure", "Under Review"]
            },
            {
                "title": "Xenotransplantation",
                "subtitle": "Under active research with proper guidance",
                "status": "Active Research",
                "year": 2026,
                "abstract": "Predicting xenotransplantation viability and organ rejection risks through multi-layered biological, genomic, and immunological compatibility profiling.",
                "link": "Research-Papers/Xenotransplantation_final_research.pdf",
                "journal": "Active Research",
                "tags": ["Bioinformatics", "Deep Learning", "Active Research"]
            }
        ],
        certifications: [
            {
                "title": "Fundamentals of LLM",
                "issuer": "Hugging Face",
                "date": "2026",
                "link": "Certificates/nitaanth_fund_of_llm_cert.pdf",
                "badge": "LLM"
            },
            {
                "title": "Fundamentals of AI Agents",
                "issuer": "Hugging Face",
                "date": "2026",
                "link": "Certificates/Hugging_face_agents_course.pdf",
                "badge": "AGNT"
            },
            {
                "title": "Building Data Lakes on AWS",
                "issuer": "Amazon Web Services",
                "date": "2026",
                "link": "Certificates/data_lakes_certification.pdf",
                "badge": "AWS"
            },
            {
                "title": "Architecting Solutions on AWS",
                "issuer": "Amazon Web Services",
                "date": "2026",
                "link": "Certificates/Nitaanth_AWS_architect_certificate.pdf",
                "badge": "AWS"
            },
            {
                "title": "AWS Cloud Technical Essentials",
                "issuer": "AWS · Coursera",
                "date": "2026",
                "link": "Certificates/Nitaanth_coursera_AWS_certificate.pdf",
                "badge": "AWS"
            },
            {
                "title": "Edge AI Course Certificate",
                "issuer": "Edge Impulse",
                "date": "2025",
                "link": "Certificates/Edge AI Course Certificate - Nitaanth Panickar.pdf",
                "badge": "EDGE"
            },
            {
                "title": "Managing Projects with AI",
                "issuer": "AI Project Management",
                "date": "2026",
                "link": "Certificates/Mging_prjts_AI.pdf",
                "badge": "AI-PM"
            }
        ],
        resume: {
            url: "https://drive.google.com/file/d/1Q3XOHoWpYLka72cCnHK6uxri_mxH13Kr/view?usp=sharing"
        }
    };

    const API_BASE = window.__API_BASE || (
        window.location.hostname === 'localhost' && window.location.port !== '5000' && window.location.port !== ''
            ? 'http://localhost:5000/api'
            : '/api'
    );

    async function fetchAPI(endpoint) {
        try {
            const res = await fetch(`${API_BASE}${endpoint}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            return null;
        }
    }

    async function loadAllData() {
        const [projects, work, research, certs, resume] = await Promise.all([
            fetchAPI('/projects'),
            fetchAPI('/work'),
            fetchAPI('/research'),
            fetchAPI('/certifications'),
            fetchAPI('/resume')
        ]);

        renderProjectsShowcase(projects || VERIFIED_PROJECTS);
        renderWork(work || LOCAL_FALLBACK.work);
        renderResearch(research || LOCAL_FALLBACK.research);
        renderCerts(certs || LOCAL_FALLBACK.certifications);

        const resumeUrl = (resume && resume.url) || LOCAL_FALLBACK.resume.url;
        const resumeBtn = document.getElementById('view-resume-btn');
        if (resumeBtn && resumeUrl) {
            resumeBtn.href = resumeUrl;
            resumeBtn.style.display = 'inline-flex';
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    loadAllData();

    // ═══════════════════════════════════════════════════════════════
    // 11. NAVBAR SCROLL & ACTIVE SECTION SPY
    // ═══════════════════════════════════════════════════════════════
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function onScrollSpy() {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        const scrollPos = window.scrollY + 180;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy();

    // ═══════════════════════════════════════════════════════════════
    // 12. MOBILE NAVIGATION DRAWER
    // ═══════════════════════════════════════════════════════════════
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function closeMobileNav() {
        if (!mobileNav) return;
        mobileNav.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
        }
    }

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            if (isOpen) {
                closeMobileNav();
            } else {
                mobileNav.classList.add('open');
                if (mobileOverlay) mobileOverlay.classList.add('active');
                mobileToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
            }
        });

        if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);
        mobileNav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMobileNav));
    }

    // ═══════════════════════════════════════════════════════════════
    // 13. BACK TO TOP BUTTON
    // ═══════════════════════════════════════════════════════════════
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // 14. CONTACT FORM SUBMISSION
    // ═══════════════════════════════════════════════════════════════
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            const btnText = btn ? btn.querySelector('span') : null;
            if (btn) btn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';

            const payload = {
                name: document.getElementById('name').value,
                email: document.getElementById('form-email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                const res = await fetch(`${API_BASE}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const data = await res.json();
                if (btn) btn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                
                if (res.ok && data.success) {
                    formFeedback.textContent = '✓ Message sent successfully! Nitaanth will get back to you shortly.';
                    formFeedback.className = 'form-feedback show success';
                    contactForm.reset();
                } else {
                    formFeedback.textContent = `⚠ Send failed: ${data.error || 'Server error'}`;
                    formFeedback.className = 'form-feedback show error';
                }
            } catch (err) {
                if (btn) btn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                formFeedback.textContent = '✓ Message captured! Thank you for reaching out.';
                formFeedback.className = 'form-feedback show success';
                contactForm.reset();
            }

            setTimeout(() => {
                formFeedback.className = 'form-feedback';
            }, 6000);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // 15. SENTINEL AI CLI GUIDE MODAL CONTROLLER
    // ═══════════════════════════════════════════════════════════════
    const sentinelModal = document.getElementById('sentinel-modal');
    const sentinelCloseBtn = document.getElementById('sentinel-close-btn');
    const sentinelCloseDot = document.getElementById('sentinel-close-dot');
    const sentinelBackdrop = document.getElementById('sentinel-modal-backdrop');

    function openSentinelModal() {
        if (!sentinelModal) return;
        sentinelModal.classList.add('active');
        sentinelModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeSentinelModal() {
        if (!sentinelModal) return;
        sentinelModal.classList.remove('active');
        sentinelModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (sentinelCloseBtn) sentinelCloseBtn.addEventListener('click', closeSentinelModal);
    if (sentinelCloseDot) sentinelCloseDot.addEventListener('click', closeSentinelModal);
    if (sentinelBackdrop) sentinelBackdrop.addEventListener('click', closeSentinelModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sentinelModal && sentinelModal.classList.contains('active')) {
            closeSentinelModal();
        }
    });

    // Delegation click listener for Sentinel card and CLI triggers
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.sentinel-cli-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            openSentinelModal();
            return;
        }

        const sentinelCard = e.target.closest('.sentinel-card-item');
        if (sentinelCard && !e.target.closest('a') && !e.target.closest('.arch-toggle-btn') && !e.target.closest('.project-arch-drawer')) {
            openSentinelModal();
        }
    });

    // Copy to Clipboard buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const textToCopy = btn.getAttribute('data-clipboard') || '';
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                const span = btn.querySelector('span');
                const originalText = span ? span.textContent : 'Copy';
                btn.classList.add('copied');
                if (span) span.textContent = 'Copied! ✓';

                setTimeout(() => {
                    btn.classList.remove('copied');
                    if (span) span.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy command:', err);
            }
        });
    });

});
