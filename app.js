/**
 * app.js — Nitaanth's Developer Portfolio & Interactive Showcase
 * 
 * Simplified & Restructured Sequence:
 * 1. About Me (Clean Vertical Introduction)
 * 2. Education, Experience & Research (Continuous Horizontal Journey)
 * 3. Projects (Horizontal Scroll Gallery)
 * 4. How I Build (Horizontal Interactive Timeline)
 * 5. Beyond the Classroom (Editorial Layout)
 * 6. Token of Appreciation (Curated Closing Collection & Drive Links)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════════════
    // 01. SMOOTH SCROLLING (Lenis + GSAP ScrollTrigger Integration)
    // ═══════════════════════════════════════════════════════════════
    let lenis = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        try {
            lenis = new Lenis({
                duration: 1.15,
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

    // Smooth Anchor Scrolling Helper
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetEl, { offset: -40, duration: 1.2 });
                } else {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // 02. CURSOR SPOTLIGHT & PROGRESS BAR
    // ═══════════════════════════════════════════════════════════════
    const cursorSpotlight = document.getElementById('cursor-spotlight');
    const scrollProgressBar = document.getElementById('scroll-progress');

    if (cursorSpotlight && !('ontouchstart' in window)) {
        window.addEventListener('pointermove', (e) => {
            cursorSpotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
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
    // 03. MAGNETIC INTERACTIONS & 3D CARD TILT
    // ═══════════════════════════════════════════════════════════════
    if (!prefersReducedMotion && !('ontouchstart' in window)) {
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
                el.style.transition = 'transform 0.1s ease-out';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate3d(0, 0, 0)';
                el.style.transition = 'transform 0.35s var(--ease-out-expo)';
            });
        });
    }

    function initCardTilt() {
        if (prefersReducedMotion || ('ontouchstart' in window)) return;
        
        document.querySelectorAll('.card-tilt').forEach(card => {
            if (card.dataset.tiltInitialized) return;
            card.dataset.tiltInitialized = 'true';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((centerY - y) / centerY) * 4; // Max 4 deg subtle tilt
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }
    initCardTilt();

    // ═══════════════════════════════════════════════════════════════
    // 04. HORIZONTAL SCROLL STORYTELLING SEQUENCES (GSAP + ScrollTrigger)
    // ═══════════════════════════════════════════════════════════════
    const isDesktop = () => window.innerWidth > 900 && !prefersReducedMotion;

    function initHorizontalScrolls() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !isDesktop()) {
            return;
        }

        // ── SEQUENCE 1: THE JOURNEY (Education, Work Experience, Research) ──
        const journeyTrack = document.getElementById('journey-track');
        const journeySection = document.getElementById('journey');
        const stagePills = document.querySelectorAll('.stage-nav-pill');

        if (journeyTrack && journeySection) {
            const getJourneyScroll = () => journeyTrack.scrollWidth - journeySection.offsetWidth + 64;

            gsap.to(journeyTrack, {
                x: () => -getJourneyScroll(),
                ease: 'none',
                scrollTrigger: {
                    trigger: journeySection,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: () => `+=${getJourneyScroll()}`,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        stagePills.forEach(p => p.classList.remove('active'));
                        if (progress < 0.33) {
                            if (stagePills[0]) stagePills[0].classList.add('active');
                        } else if (progress < 0.68) {
                            if (stagePills[1]) stagePills[1].classList.add('active');
                        } else {
                            if (stagePills[2]) stagePills[2].classList.add('active');
                        }
                    }
                }
            });

            // Chapter pills click handler
            stagePills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const ch = parseInt(pill.getAttribute('data-chapter'), 10);
                    const targetProgress = ch === 1 ? 0 : ch === 2 ? 0.45 : 0.95;
                    const st = ScrollTrigger.getById('journey-st') || ScrollTrigger.getAll().find(s => s.trigger === journeySection);
                    if (st) {
                        const scrollTarget = st.start + (st.end - st.start) * targetProgress;
                        if (lenis) lenis.scrollTo(scrollTarget);
                        else window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                    }
                });
            });
        }

        // ── SEQUENCE 2: PROJECTS GALLERY ─────────────────────────
        const projectsTrack = document.getElementById('projects-track');
        const projectsSection = document.getElementById('projects');

        if (projectsTrack && projectsSection) {
            const getProjectsScroll = () => projectsTrack.scrollWidth - projectsSection.offsetWidth + 64;

            gsap.to(projectsTrack, {
                x: () => -getProjectsScroll(),
                ease: 'none',
                scrollTrigger: {
                    trigger: projectsSection,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: () => `+=${getProjectsScroll()}`,
                    invalidateOnRefresh: true
                }
            });
        }

        // ── SEQUENCE 3: "HOW I BUILD" ENGINEERING TIMELINE ───────
        const workflowTrack = document.getElementById('workflow-track');
        const workflowSection = document.getElementById('workflow');
        const lineFill = document.getElementById('workflow-line-fill');
        const stages = document.querySelectorAll('.workflow-stage-card');

        if (workflowTrack && workflowSection) {
            const getWorkflowScroll = () => workflowTrack.scrollWidth - workflowSection.offsetWidth + 80;

            gsap.to(workflowTrack, {
                x: () => -getWorkflowScroll(),
                ease: 'none',
                scrollTrigger: {
                    trigger: workflowSection,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: () => `+=${getWorkflowScroll()}`,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const prog = self.progress;
                        if (lineFill) {
                            lineFill.style.width = `${prog * 100}%`;
                        }
                        
                        // Illuminate stage nodes progressively
                        stages.forEach((stage, idx) => {
                            const threshold = idx / (stages.length - 1);
                            if (prog >= threshold - 0.1) {
                                stage.classList.add('active');
                            } else if (idx > 0) {
                                stage.classList.remove('active');
                            }
                        });
                    }
                }
            });
        }
    }

    // Refresh triggers on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 200);
    });

    // ═══════════════════════════════════════════════════════════════
    // 05. PROJECTS DATA & GALLERY RENDERER
    // ═══════════════════════════════════════════════════════════════
    const VERIFIED_PROJECTS = [
        {
            title: "Bandhoo",
            domain: "Legal AI & Penal Code NLP",
            status: "Live",
            badgeClass: "status-live",
            problem: "Ambiguous, multilingual natural-language crime complaints (EN, HI, Hinglish) causing incorrect First Information Report (FIR) penal code filing.",
            description: "Mumbai crime-reporting and statutory classification engine benchmarked on 50 diverse complaints under Bharatiya Nyaya Sanhita (BNS, 2023) and BNSS procedural mandates. Uses clause-level BM25 legal retrieval and a 4-tier certainty schema with metaphorical keyword trap immunity.",
            tags: ["BNS 2023", "BNSS Procedure", "Legal NLP", "4-Tier Certainty", "Multilingual", "Vercel Live"],
            github: "https://github.com/nitaanth-11/Bandhoo",
            deployed: "https://bandhoo-sigma.vercel.app/",
            icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 7l4-2 4 2M3 7v4c0 2 2 3 4 3s4-1 4-3V7M13 7l4-2 4 2M13 7v4c0 2 2 3 4 3s4-1 4-3V7M8 21h8"/></svg>`
        },
        {
            title: "Sentinel AI",
            domain: "Cybersecurity & Code Analysis",
            status: "CLI Tool",
            badgeClass: "status-cli",
            problem: "Traditional static scanners create noisy reports with zero root-cause reasoning or safe remediation rollback capabilities.",
            description: "Command-line vulnerability detection and code security engine combining static AST analysis with Retrieval-Augmented Generation (RAG). Accepted at Springer ICDECT-2026 proceedings. Published globally on PyPI as nitaanth-sentinelai.",
            tags: ["Static AST", "RAG Reasoning", "Springer Proceedings", "PyPI CLI", "Security Remediation"],
            github: "https://github.com/nitaanth-11/Sentinel-AI",
            deployed: "CLI Tool",
            icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
        },
        {
            title: "FreightIQ",
            domain: "Logistics & Supply Chain",
            status: "Live",
            badgeClass: "status-live",
            problem: "Inefficient multimodal freight dispatch causing excessive fuel burn, dispatch latency, and high logistics overhead.",
            description: "Intelligent freight routing and logistics optimizer utilizing neural network embeddings and heuristic constraint solvers to minimize transport latency and routing overhead. Finalist at the Lorri AI Hackathon.",
            tags: ["Python", "PyTorch", "Heuristic Search", "Route Optimization", "Docker", "Render"],
            github: "https://github.com/siddh-sh/LoRRI",
            deployed: "https://lorri.onrender.com/",
            icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
        },
        {
            title: "GeneBridge",
            domain: "Bioinformatics & Health Tech",
            status: "Live",
            badgeClass: "status-live",
            problem: "Massive computational complexity in aligning multi-strain genetic sequences and mapping hereditary disease mutations.",
            description: "Computational genomics and genetic sequence alignment platform engineered to discover and visualize hereditary correlations across multi-strain genetic data with interactive WebGL vector models.",
            tags: ["BioPython", "Genomics", "Sequence Alignment", "Flask", "Vercel Edge"],
            github: "https://github.com/nitaanth-11/GeneBridge",
            deployed: "https://gene-bridge-31eg.vercel.app/",
            icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 10.5C4.5 5 12 3 12 3s7.5 2 7.5 7.5c0 5-7.5 10.5-7.5 10.5s-7.5-5.5-7.5-10.5z"/><path d="M12 3v18M8 7h8M7 11h10M8 15h8"/></svg>`
        },
        {
            title: "JanRaksha",
            domain: "Public Safety & Civic Tech",
            status: "Live",
            badgeClass: "status-live",
            problem: "Disjointed emergency calls and lack of geospatial triage delaying critical rescue response times during natural disasters.",
            description: "Real-time emergency response and disaster relief orchestration platform. Ingests crowd-sourced distress signals, assesses geospatial urgency scores, and coordinates rapid responder dispatch pipelines.",
            tags: ["FastAPI", "Python", "Geospatial AI", "PostgreSQL", "Real-Time Pipelines"],
            github: "https://github.com/nitaanth-11/JanRaksha",
            deployed: "https://janraksha-wyc6.onrender.com/",
            icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v8M8 12h8"/></svg>`
        },
        {
            title: "Beema",
            domain: "InsurTech & FinTech",
            status: "Live",
            badgeClass: "status-live",
            problem: "Slow, manual insurance underwriting and vulnerability to fraudulent claims in high-volume digital policy applications.",
            description: "Automated insurance underwriting and claim adjudication engine. Leverages predictive risk assessment models, anomaly detection algorithms, and a streamlined digital interface for policy approval acceleration.",
            tags: ["InsurTech", "Risk Scoring", "Predictive Modeling", "Next.js", "Vercel"],
            github: "https://github.com/nitaanth-11/Beema",
            deployed: "https://beema-jade.vercel.app/",
            icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12A10 10 0 0 0 12 2 10 10 0 0 0 2 12c0 2.4 1 3.5 2 3.5 1 0 1.5-.7 2-1.5.8-1.3 1.8-2 3-2 1.3 0 2.2.7 3 2 .5.8 1 1.5 2 1.5 1 0 2-1.1 2-3.5z"/><path d="M12 12v7a2 2 0 0 0 4 0"/></svg>`
        },
        {
            title: "Prompt Max",
            domain: "Reinforcement Learning & GenAI",
            status: "Live",
            badgeClass: "status-live",
            problem: "Trial-and-error prompt engineering that fails to optimize for LLM reasoning accuracy while ballooning token costs.",
            description: "Reinforcement learning-driven prompt optimization system (Optima). Analyzes query intents, applies iterative reward modeling, and automatically rewrites prompts to maximize LLM accuracy and task benchmarks.",
            tags: ["Reinforcement Learning", "Reward Modeling", "Prompt Optimization", "LLMOps"],
            github: "https://github.com/vedikas323-pixel/RL_Prompt_Optimizer",
            deployed: "https://optima-kvj6.onrender.com",
            icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`
        },
        {
            title: "Event Oracle",
            domain: "Quantitative Finance & Macro AI",
            status: "Live",
            badgeClass: "status-live",
            problem: "High volatility risks in index options during unexpected macroeconomic announcements and liquidity flow shocks.",
            description: "Multi-source financial forecasting pipeline for NIFTY 50 and index options, fusing OHLCV price action, FII/DII liquidity flows, macroeconomic release surprises, and news sentiment for volatility prediction.",
            tags: ["GCP", "Agentic AI", "Ensemble Learning", "Time Series", "MongoDB"],
            github: "https://github.com/nitaanth-11/Project-Apex",
            deployed: "https://project-apex-baip.onrender.com/",
            icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 14l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/></svg>`
        }
    ];

    function renderProjectsGallery(projects) {
        const grid = document.getElementById('projects-track');
        if (!grid) return;
        grid.innerHTML = '';

        const list = projects || VERIFIED_PROJECTS;

        list.forEach((proj) => {
            const isSentinel = (proj.title || '').toLowerCase().includes('sentinel');
            const card = document.createElement('div');
            card.className = `project-panel-card card-tilt ${isSentinel ? 'sentinel-card-item' : ''}`;

            let liveLinkHTML = '';
            const dep = (proj.deployed || '').trim();
            if (dep.startsWith('http')) {
                liveLinkHTML = `
                    <a href="${dep}" target="_blank" class="project-action-button magnetic">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Live Demo ↗
                    </a>`;
            } else if (isSentinel || dep.toLowerCase().includes('cli')) {
                liveLinkHTML = `
                    <button type="button" class="project-action-button sentinel-cli-trigger magnetic" title="Open SentinelAI CLI Scans Guide & Interactive Snippets">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                        CLI Scans Guide ↗
                    </button>`;
            }

            const gitLinkHTML = (proj.github && proj.github.startsWith('http'))
                ? `<a href="${proj.github}" target="_blank" class="project-action-button project-button-github magnetic">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    Source Code
                </a>`
                : '';

            card.innerHTML = `
                <div>
                    <div class="project-card-top-row">
                        <div class="project-brand-box">
                            <div class="project-icon-frame">${proj.icon}</div>
                            <div>
                                <span class="project-domain-tag">${proj.domain}</span>
                                <h3 class="project-panel-title">${proj.title}</h3>
                            </div>
                        </div>
                        <span class="project-status-badge ${proj.badgeClass || 'status-live'}">${proj.status || 'Live'}</span>
                    </div>

                    ${proj.problem ? `
                    <div class="project-problem-box">
                        <span class="problem-label">Problem Solved</span>
                        <p class="problem-text">${proj.problem}</p>
                    </div>` : ''}

                    <p class="project-description-full">${proj.description}</p>
                </div>

                <div>
                    <div class="project-tags-row">
                        ${(proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>

                    <div class="project-footer-actions">
                        <div class="project-links-cluster">
                            ${liveLinkHTML}
                            ${gitLinkHTML}
                        </div>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        initCardTilt();
    }

    // ═══════════════════════════════════════════════════════════════
    // 06. TOKEN OF APPRECIATION / CERTIFICATIONS RENDERER
    // ═══════════════════════════════════════════════════════════════
    const VERIFIED_CERTS = [
        {
            title: "Fundamentals of LLM",
            issuer: "Hugging Face",
            date: "2026",
            link: "Certificates/nitaanth_fund_of_llm_cert.pdf",
            badge: "LLM"
        },
        {
            title: "Fundamentals of AI Agents",
            issuer: "Hugging Face",
            date: "2026",
            link: "Certificates/Hugging_face_agents_course.pdf",
            badge: "AGNT"
        },
        {
            title: "Building Data Lakes on AWS",
            issuer: "Amazon Web Services",
            date: "2026",
            link: "Certificates/data_lakes_certification.pdf",
            badge: "AWS"
        },
        {
            title: "Architecting Solutions on AWS",
            issuer: "Amazon Web Services",
            date: "2026",
            link: "Certificates/Nitaanth_AWS_architect_certificate.pdf",
            badge: "AWS"
        },
        {
            title: "AWS Cloud Technical Essentials",
            issuer: "AWS · Coursera",
            date: "2026",
            link: "Certificates/Nitaanth_coursera_AWS_certificate.pdf",
            badge: "AWS"
        },
        {
            title: "Edge AI Course Certificate",
            issuer: "Edge Impulse",
            date: "2025",
            link: "Certificates/Edge AI Course Certificate - Nitaanth Panickar.pdf",
            badge: "EDGE"
        },
        {
            title: "Managing Projects with AI",
            issuer: "AI Project Management",
            date: "2026",
            link: "Certificates/Mging_prjts_AI.pdf",
            badge: "AI-PM"
        }
    ];

    function renderCertifications(certs) {
        const grid = document.getElementById('certs-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const list = certs || VERIFIED_CERTS;

        list.forEach(cert => {
            let logoHTML = '';
            const issuerLower = (cert.issuer || '').toLowerCase();
            const badgeUpper = (cert.badge || '').toUpperCase();
            
            if (issuerLower.includes('aws') || badgeUpper === 'AWS') {
                logoHTML = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#FF9900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(255, 153, 0, 0.3));"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
            } else if (issuerLower.includes('huggingface') || issuerLower.includes('hugging face') || badgeUpper === 'LLM' || badgeUpper === 'AGNT') {
                logoHTML = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#FFD21E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(255, 210, 30, 0.3));"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="3"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="3"/><path d="M4 17c.5-1.5 2-2.5 3.5-2.5.8 0 1.5.3 2 1"/><path d="M20 17c-.5-1.5-2-2.5-3.5-2.5-.8 0-1.5.3-2 1"/></svg>`;
            } else {
                logoHTML = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#00D9FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(0, 217, 255, 0.3));"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>`;
            }

            const card = document.createElement('a');
            card.href = cert.link || '#';
            card.target = '_blank';
            card.className = 'card cert-card card-tilt';
            card.innerHTML = `
                <div>
                    <div class="cert-badge">${logoHTML}</div>
                    <h4 class="cert-title">${cert.title}</h4>
                    <p class="cert-issuer">${cert.issuer}</p>
                    <p class="cert-date">${cert.date}</p>
                </div>
                <div class="cert-verify">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Verify Credential (PDF)
                </div>
            `;
            grid.appendChild(card);
        });

        initCardTilt();
    }

    // ═══════════════════════════════════════════════════════════════
    // 07. BACKEND API CLIENT WITH ROBUST FALLBACK
    // ═══════════════════════════════════════════════════════════════
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

    async function loadData() {
        const [projects, certs, resume] = await Promise.all([
            fetchAPI('/projects'),
            fetchAPI('/certifications'),
            fetchAPI('/resume')
        ]);

        renderProjectsGallery(projects || VERIFIED_PROJECTS);
        renderCertifications(certs || VERIFIED_CERTS);

        const resumeUrl = (resume && resume.url) || 'https://drive.google.com/file/d/1Q3XOHoWpYLka72cCnHK6uxri_mxH13Kr/view?usp=sharing';
        const resumeBtn = document.getElementById('view-resume-btn');
        if (resumeBtn && resumeUrl) {
            resumeBtn.href = resumeUrl;
        }

        // Initialize GSAP scroll triggers after elements have rendered
        setTimeout(() => {
            initHorizontalScrolls();
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 150);
    }

    loadData();

    // ═══════════════════════════════════════════════════════════════
    // 08. NAVBAR SCROLL & ACTIVE SECTION SPY
    // ═══════════════════════════════════════════════════════════════
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const trackedSections = document.querySelectorAll('section[id]');

    function onScrollSpy() {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        const scrollPos = window.scrollY + 160;
        trackedSections.forEach(sec => {
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
    // 09. MOBILE NAVIGATION DRAWER
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
    // 10. BACK TO TOP BUTTON
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
    // 11. SENTINEL AI CLI GUIDE MODAL CONTROLLER
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
        if (sentinelCard && !e.target.closest('a') && !e.target.closest('button')) {
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
