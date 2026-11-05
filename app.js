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

        // ── "HOW I BUILD" ENGINEERING TIMELINE ───────────────────
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
        // Duplicate cards so CSS infinite marquee loops seamlessly without any jump
        const fullList = [...list, ...list];

        fullList.forEach((proj) => {
            const isSentinel = (proj.title || '').toLowerCase().includes('sentinel');
            const projId = (proj.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const card = document.createElement('div');
            card.className = `project-panel-card card-tilt ${isSentinel ? 'sentinel-card-item' : ''}`;
            card.setAttribute('data-focus', 'project');
            card.setAttribute('data-id', projId);
            card.setAttribute('title', 'Click to view full architecture & technical breakdown');

            let liveLinkHTML = '';
            const dep = (proj.deployed || '').trim();
            if (dep.startsWith('http')) {
                liveLinkHTML = `
                    <a href="${dep}" target="_blank" class="project-action-button magnetic" onclick="event.stopPropagation();">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Live Demo ↗
                    </a>`;
            } else if (isSentinel || dep.toLowerCase().includes('cli')) {
                liveLinkHTML = `
                    <button type="button" class="project-action-button sentinel-cli-trigger magnetic" onclick="event.stopPropagation();" title="Open SentinelAI CLI Scans Guide & Interactive Snippets">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                        CLI Scans Guide ↗
                    </button>`;
            }

            const gitLinkHTML = (proj.github && proj.github.startsWith('http'))
                ? `<a href="${proj.github}" target="_blank" class="project-action-button project-button-github magnetic" onclick="event.stopPropagation();">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    Source Code
                </a>`
                : '';

            card.innerHTML = `
                <div>
                    <span class="focus-hint-badge">Click to Expand ↗</span>
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

        // Hover listeners: pause slow carousel when cursor enters or stops on any project
        const viewport = document.getElementById('projects-carousel-viewport');
        if (viewport && grid) {
            viewport.addEventListener('mouseenter', () => {
                grid.style.animationPlayState = 'paused';
            });
            viewport.addEventListener('mouseleave', () => {
                grid.style.animationPlayState = 'running';
            });
        }

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

        list.forEach((cert, idx) => {
            let logoHTML = '';
            const issuerLower = (cert.issuer || '').toLowerCase();
            const badgeUpper = (cert.badge || '').toUpperCase();
            
            if (issuerLower.includes('aws') || badgeUpper === 'AWS') {
                logoHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FF9900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(255, 153, 0, 0.3));"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
            } else if (issuerLower.includes('huggingface') || issuerLower.includes('hugging face') || badgeUpper === 'LLM' || badgeUpper === 'AGNT') {
                logoHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FFD21E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(255, 210, 30, 0.3));"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="3"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="3"/><path d="M4 17c.5-1.5 2-2.5 3.5-2.5.8 0 1.5.3 2 1"/><path d="M20 17c-.5-1.5-2-2.5-3.5-2.5-.8 0-1.5.3-2 1"/></svg>`;
            } else {
                logoHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00D9FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(0, 217, 255, 0.3));"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>`;
            }

            const card = document.createElement('div');
            card.className = 'card cert-card card-tilt open-pdf-btn';
            card.setAttribute('data-pdf', cert.link || '');
            card.setAttribute('data-title', cert.title);
            card.setAttribute('title', 'Click to preview full PDF on screen');

            card.innerHTML = `
                <div class="section-item-index">${idx + 1}</div>
                <div class="cert-preview-window">
                    <iframe src="${cert.link}#toolbar=0&navpanes=0&scrollbar=0&view=FitH" class="cert-mini-preview" loading="lazy" tabindex="-1"></iframe>
                    <div class="cert-preview-glass-overlay">
                        <span class="cert-expand-pill">Preview PDF ↗</span>
                    </div>
                </div>
                <div class="cert-card-bottom">
                    <div class="cert-badge">${logoHTML}</div>
                    <h4 class="cert-title">${cert.title}</h4>
                    <p class="cert-issuer">${cert.issuer}</p>
                    <p class="cert-date">${cert.date}</p>
                    <div class="cert-verify">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        <span>Open Document On Screen</span>
                    </div>
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

        const resumeBtn = document.getElementById('view-resume-btn');
        if (resumeBtn) {
            resumeBtn.setAttribute('data-pdf', 'nitaanth_resume.pdf');
            resumeBtn.setAttribute('data-title', 'Nitaanth Panickar — Official Resume');
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

    // ═══════════════════════════════════════════════════════════════
    // 12. CLICK-TO-FOCUS SPOTLIGHT CONTROLLER & RICH DATASET
    // ═══════════════════════════════════════════════════════════════
    const FOCUS_DATA = {
        // ── PROJECTS ──
        project: {
            bandhoo: {
                category: "Production System // Legal NLP",
                status: "Live on Vercel",
                title: "Bandhoo: BNS Legal Classification Benchmark",
                subtitle: "Mumbai Crime-Reporting & Statutory Provision Classification Engine",
                meta: [
                    { label: "Architecture", value: "Hybrid BM25 + Rule Schema" },
                    { label: "Statutes", value: "BNS 2023 & BNSS 2023" },
                    { label: "Dataset", value: "50 Realistic Complaints (EN / HI / Hinglish)" },
                    { label: "Deployment", value: "Vercel Edge & Serverless Python" }
                ],
                sections: [
                    {
                        heading: "Problem Statement & Procedural Friction",
                        content: "Natural-language crime complaints across Mumbai and metropolitan India suffer from linguistic variance, regional idioms, and metaphorical expressions (such as calling overpriced street food 'daylight robbery'). First Information Reports (FIRs) and police station entries are frequently assigned inaccurate or speculative penal sections due to simplistic keyword matching, causing prolonged judicial delays and procedural dismissals under the newly enacted Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023)."
                    },
                    {
                        heading: "4-Tier Legal Certainty Schema",
                        bullets: [
                            "Tier A (Supported candidate provision): Complaint facts prima facie satisfy all essential statutory ingredients of one or more candidate sections with positive applicability scores.",
                            "Tier B (Plausible alternative / Clarification needed): Narrative indicates a legal domain, but material facts (property valuation, entrustment, consent) are ambiguous. The engine outputs candidate sections while identifying missing facts and expressing qualified uncertainty.",
                            "Tier C (Contradicted provision): Specific statutory elements are legally or factually negated by complaint facts (e.g. stealth theft negating robbery, or metaphorical grievances). Contradicted sections are strictly assigned 0.0 applicability.",
                            "Tier D (Insufficient information): Complaint is too brief, vague, or incoherent to justify any penal classification. The engine refrains from hallucinating penal sections and mandates clarification."
                        ]
                    },
                    {
                        heading: "System Architecture & Engineering",
                        bullets: [
                            "Clause-level statutory retrieval using tuned BM25 over the full 358 sections of the Bharatiya Nyaya Sanhita (BNS, 2023).",
                            "Metaphorical keyword trap immunity ensuring colloquial grievances do not trigger criminal penal codes.",
                            "Procedural guidance engine mapping identified sections directly to BNSS First Schedule (cognizability, bailability, court jurisdiction).",
                            "High-concurrency microservice hosted on Vercel with real-time JSON and markdown output."
                        ]
                    },
                    {
                        heading: "Technologies & Frameworks",
                        tags: ["Python", "FastAPI", "BNS 2023", "BNSS 2023", "BM25 Retrieval", "Legal NLP", "Vercel Edge", "TailwindCSS"]
                    }
                ],
                actions: [
                    { label: "Live Engine Demo ↗", url: "https://bandhoo-sigma.vercel.app/", primary: true },
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/Bandhoo", primary: false },
                    { label: "View IEEE Manuscript", url: "Research-Papers/Bandhoo_IEEE_paper.pdf", primary: false }
                ]
            },
            sentinelai: {
                category: "Security Platform // AST & RAG",
                status: "PyPI Package & Springer ICDECT-2026",
                title: "Sentinel AI: Dual-Engine Vulnerability Scanner",
                subtitle: "Deterministic AST Security Auditing & LLM-Driven Root-Cause Remediation",
                meta: [
                    { label: "Package", value: "pip install nitaanth-sentinelai" },
                    { label: "Publication", value: "Accepted at Springer ICDECT-2026" },
                    { label: "LLM Backend", value: "Llama 3.3-70B via Groq" },
                    { label: "Output Formats", value: "Terminal, HTML, SARIF, JSON, Markdown" }
                ],
                sections: [
                    {
                        heading: "Problem & Industry Need",
                        content: "Conventional static security scanners produce hundreds of noisy, context-free alerts without actionable remediation guidance or safe automated patch verification. Developers waste hundreds of hours deciphering false positives without understanding root architectural vulnerability causes."
                    },
                    {
                        heading: "Dual-Engine Architecture",
                        bullets: [
                            "Deterministic AST Engine: Deep Abstract Syntax Tree traversal using Semgrep, Bandit, and GitLeaks to catch CWE vulnerabilities, SQL injections, hardcoded secrets, and unsafe deserialization.",
                            "RAG-Assisted Remediation: Correlates detected AST nodes with codebase context, sending targeted snippets to Llama 3.3-70B via Groq for root-cause analysis and automated syntax-validated patch generation.",
                            "Interactive CLI & Rollback: Developers can review interactive diffs with 'sentinelai fix' and safely revert all changes at any point with 'sentinelai undo'.",
                            "CI/CD Build Gating: Configurable severity thresholds (--fail-on high) to automatically protect pull requests in automated DevOps pipelines."
                        ]
                    },
                    {
                        heading: "Technologies & Tooling",
                        tags: ["Python", "AST Parsing", "Semgrep", "Bandit", "GitLeaks", "Groq API", "Llama 3.3-70B", "SARIF Standard", "PyPI"]
                    }
                ],
                actions: [
                    { label: "Open CLI Scans Guide", action: "openSentinelModal", primary: true },
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/Sentinel-AI", primary: false },
                    { label: "View Springer Manuscript", url: "Research-Papers/SentinelAI_Research_Paper.pdf", primary: false }
                ]
            },
            freightiq: {
                category: "Logistics Intelligence // AI & GIS",
                status: "Production Demo",
                title: "FreightIQ: Logistics & Dynamic Route Optimization",
                subtitle: "Neural ETA Prediction & Multi-Modal Supply Chain Telemetry",
                meta: [
                    { label: "Domain", value: "Supply Chain & GIS" },
                    { label: "ML Model", value: "Gradient Boosted ETA Regressor" },
                    { label: "Telemetry", value: "Simulated Real-Time Fleet GPS" },
                    { label: "Cloud", value: "GCP Cloud Run" }
                ],
                sections: [
                    {
                        heading: "Problem Solved",
                        content: "Supply chain disruptions and unpredictable freight delays cost logistics operators millions annually. Static routing engines fail to dynamically factor in hyper-local weather events, toll bottlenecks, driver rest cycles, and sudden road closures."
                    },
                    {
                        heading: "Engineering Highlights",
                        bullets: [
                            "Built predictive ETA estimation pipelines integrating historical telemetry, real-time weather APIs, and road impedance factors.",
                            "Engineered dynamic re-routing algorithms capable of recalculating optimal delivery corridors for multi-stop consignments.",
                            "Interactive GIS dashboard with live status cards, fleet telematics tracking, and automated delay threshold notifications."
                        ]
                    },
                    {
                        heading: "Tech Stack",
                        tags: ["Python", "GIS Spatial Analysis", "Scikit-Learn", "FastAPI", "Mapbox GL", "PostgreSQL", "Docker"]
                    }
                ],
                actions: [
                    { label: "Live Demo ↗", url: "https://freightiq.onrender.com", primary: true },
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/FreightIQ", primary: false }
                ]
            },
            genebridge: {
                category: "Bioinformatics // Computational Immunology",
                status: "Research Prototype",
                title: "GeneBridge: Cross-Species Genetic Compatibility",
                subtitle: "Immunological Compatibility Profiling & Organ Matching Pipeline",
                meta: [
                    { label: "Domain", value: "Bioinformatics & Genetics" },
                    { label: "Focus", value: "HLA & Cross-Species Xenotransplantation" },
                    { label: "Algorithm", value: "Multi-Factor Immunological Scoring" }
                ],
                sections: [
                    {
                        heading: "Problem Solved",
                        content: "Critical shortages in donor organs result in thousands of preventable fatalities annually. Xenotransplantation and high-risk human organ matching require deep computational analysis of HLA markers and hyperacute immune rejection triggers."
                    },
                    {
                        heading: "Methodology & Architecture",
                        bullets: [
                            "Analyzed genomic sequences and immune reaction vectors to quantify rejection probabilities across donor-recipient pairs.",
                            "Modeled CRISPR gene-knockout scenarios (GGTA1, CMAH, B4GALNT2) to evaluate cross-species cellular survivability.",
                            "Interactive visualization dashboard for transplant surgeons and computational researchers."
                        ]
                    },
                    {
                        heading: "Tech Stack",
                        tags: ["Python", "BioPython", "Scikit-Learn", "NumPy", "Pandas", "Streamlit", "Genomic Analysis"]
                    }
                ],
                actions: [
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/GeneBridge", primary: true },
                    { label: "View Research PDF", url: "Research-Papers/Xenotransplantation_final_research.pdf", primary: false }
                ]
            },
            janraksha: {
                category: "Public Safety // Spatial AI & Crisis Response",
                status: "Production Prototype",
                title: "JanRaksha: Disaster Response & Spatial Triage",
                subtitle: "Crowd-Sourced Spatial Incident Reporting & Emergency Dispatch",
                meta: [
                    { label: "Domain", value: "Disaster Management & GIS" },
                    { label: "Map Engine", value: "Leaflet & Turf.js Spatial Index" },
                    { label: "Deployment", value: "Render Cloud" }
                ],
                sections: [
                    {
                        heading: "Problem Solved",
                        content: "During acute urban floods and environmental disasters, emergency helplines become overwhelmed while first responders lack geo-located situational awareness to triage relief missions."
                    },
                    {
                        heading: "Engineering Highlights",
                        bullets: [
                            "Designed an intuitive mobile-first reporting interface allowing citizens to transmit geotagged incident reports with low bandwidth.",
                            "Integrated spatial clustering algorithms to aggregate duplicate reports into consolidated disaster severity zones.",
                            "Dispatch operations command portal prioritizing high-urgency zones based on vulnerability metrics."
                        ]
                    },
                    {
                        heading: "Tech Stack",
                        tags: ["FastAPI", "Leaflet GIS", "PostGIS", "Python", "Spatial Clustering", "TailwindCSS"]
                    }
                ],
                actions: [
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/JanRaksha", primary: true }
                ]
            },
            beema: {
                category: "FinTech // Risk Modeling",
                status: "Live on Vercel",
                title: "Beema: InsurTech Underwriting & Adjudication",
                subtitle: "Predictive Risk Scoring & Policy Approval Acceleration",
                meta: [
                    { label: "Domain", value: "Insurance & Actuarial AI" },
                    { label: "Deployment", value: "Vercel Edge (Next.js)" },
                    { label: "Pipeline", value: "Automated Underwriting Engine" }
                ],
                sections: [
                    {
                        heading: "Problem Solved",
                        content: "Traditional manual insurance underwriting processes take weeks, require costly document verifications, and suffer from subjective fraud risk evaluations."
                    },
                    {
                        heading: "Engineering Highlights",
                        bullets: [
                            "Built automated risk stratification algorithms calculating real-time insurance premium loading factors.",
                            "Implemented anomaly detection pipelines to flag fraudulent claims before claim payout.",
                            "Responsive Next.js digital interface providing rapid quote generation and instant policy issuance."
                        ]
                    },
                    {
                        heading: "Tech Stack",
                        tags: ["Next.js", "TypeScript", "Python Backend", "Vercel", "Predictive Modeling", "Chart.js"]
                    }
                ],
                actions: [
                    { label: "Live Demo ↗", url: "https://beema-jade.vercel.app/", primary: true },
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/Beema", primary: false }
                ]
            },
            promptmax: {
                category: "GenAI Infrastructure // Reinforcement Learning",
                status: "Live on Render",
                title: "Prompt Max: RL-Driven Prompt Optimization",
                subtitle: "Reinforcement Learning & Iterative Reward Modeling Engine (Optima)",
                meta: [
                    { label: "Domain", value: "LLMOps & Prompt Tuning" },
                    { label: "Framework", value: "PPO & Reward Modeling" },
                    { label: "Deployment", value: "Render Cloud" }
                ],
                sections: [
                    {
                        heading: "Problem Solved",
                        content: "Ad-hoc human prompt engineering is non-deterministic, fails to systematically improve LLM reasoning accuracy, and frequently balloons token usage and API expenses."
                    },
                    {
                        heading: "Engineering Highlights",
                        bullets: [
                            "Formulated an automated reward modeling framework scoring prompt outputs on clarity, conciseness, and task success benchmarks.",
                            "Iteratively mutates prompt candidates using policy gradients to discover optimal prompting formulations.",
                            "Significantly boosted task completion accuracy across reasoning benchmarks while trimming unnecessary token fluff."
                        ]
                    },
                    {
                        heading: "Tech Stack",
                        tags: ["PyTorch", "Reinforcement Learning", "FastAPI", "HuggingFace Transformers", "Docker", "Render"]
                    }
                ],
                actions: [
                    { label: "Live Demo ↗", url: "https://optima-kvj6.onrender.com", primary: true },
                    { label: "GitHub Repository", url: "https://github.com/vedikas323-pixel/RL_Prompt_Optimizer", primary: false }
                ]
            },
            eventoracle: {
                category: "Quantitative Finance // Macro AI",
                status: "Live on Render",
                title: "Event Oracle: Macroeconomic & Options Forecasting",
                subtitle: "Multi-Source Financial Forecasting Pipeline for NIFTY 50",
                meta: [
                    { label: "Domain", value: "Quantitative Finance & Index Options" },
                    { label: "Database", value: "MongoDB Atlas Time Series" },
                    { label: "Cloud", value: "Google Cloud Platform (GCP)" }
                ],
                sections: [
                    {
                        heading: "Problem Solved",
                        content: "Sudden macroeconomic announcements (RBI repo rate decisions, US Fed inflation figures) cause violent volatility spikes in index options that blindside retail algorithmic traders."
                    },
                    {
                        heading: "Engineering Highlights",
                        bullets: [
                            "Engineered high-frequency data ingestion fusing OHLCV price action, FII/DII institutional liquidity flows, and macroeconomic surprise indices.",
                            "Trained ensemble models predicting option implied volatility (IV) crush and post-event directional momentum.",
                            "Deployed on Google Cloud Platform with automated MongoDB time-series storage and real-time dashboard alerts."
                        ]
                    },
                    {
                        heading: "Tech Stack",
                        tags: ["Python", "GCP", "MongoDB Atlas", "Time Series Models", "FastAPI", "Ensemble Learning"]
                    }
                ],
                actions: [
                    { label: "Live Demo ↗", url: "https://project-apex-baip.onrender.com/", primary: true },
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/Project-Apex", primary: false }
                ]
            }
        },

        // ── EDUCATION ──
        education: {
            mpstme: {
                category: "Academic Foundation // University",
                status: "2023 – Present · Mumbai",
                title: "Mukesh Patel School of Technology Management & Engineering",
                subtitle: "NMIMS University — B.Tech in Data Science",
                meta: [
                    { label: "GPA", value: "3.68" },
                    { label: "CGPA", value: "3.3*" },
                    { label: "Department", value: "Computer Engineering & Data Science" },
                    { label: "Leadership", value: "Head of Operations — Data Mavericks" }
                ],
                sections: [
                    {
                        heading: "Academic Curriculum & Focus",
                        content: "Rigorous academic curriculum covering advanced mathematical modeling, distributed systems architecture, artificial intelligence, and software engineering. Emphasis on bridging mathematical proofs with high-throughput production code."
                    },
                    {
                        heading: "Core Coursework",
                        bullets: [
                            "Machine Learning & Deep Learning (CNNs, Transformers, Optimization Algorithms)",
                            "Distributed Systems & Cloud Computing (Kubernetes, AWS architecture, microservices)",
                            "Advanced Data Structures & Algorithms, Design Patterns, Database Management Systems",
                            "Statistical Inference, Multivariable Calculus, Probability Theory & Linear Algebra"
                        ]
                    },
                    {
                        heading: "Co-Curricular Leadership & Varsity Athletics",
                        bullets: [
                            "Head of Operations at Data Mavericks: Spearheaded technical hackathons, industry workshops, and student developer cohorts.",
                            "NMIMS Varsity Cricket Team: Active player in inter-university tournaments, balancing intense athletic schedules with top-tier academic rigor."
                        ]
                    }
                ],
                actions: [
                    { label: "View Resume On Screen ↗", pdf: "nitaanth_resume.pdf", title: "Nitaanth Panickar — Official Resume", primary: true }
                ]
            },
            mithibai: {
                category: "Academic Foundation // Higher Secondary",
                status: "2021 – 2023 · Mumbai",
                title: "Mithibai College of Arts, Chauhan Institute of Science",
                subtitle: "Higher Secondary Certificate (HSC) — Science Stream",
                meta: [
                    { label: "Board", value: "Maharashtra State Board (HSC)" },
                    { label: "Stream", value: "Pure Science & Mathematics" },
                    { label: "Leadership", value: "Captain — College Cricket Team" }
                ],
                sections: [
                    {
                        heading: "Academic Focus",
                        content: "Completed intensive science curriculum with rigorous coursework in Advanced Mathematics, Physics, Chemistry, and Computer Science, establishing an analytical foundation for engineering."
                    },
                    {
                        heading: "Athletic Leadership",
                        bullets: [
                            "Captained Mithibai College cricket team to tournament victories across Mumbai collegiate leagues.",
                            "Selected for the prestigious Mumbai Under-23 Zonal Summer Camp, training under elite coaches."
                        ]
                    }
                ],
                actions: [
                    { label: "View Resume On Screen ↗", pdf: "nitaanth_resume.pdf", title: "Nitaanth Panickar — Official Resume", primary: true }
                ]
            },
            lakshdham: {
                category: "Foundational Education // High School",
                status: "Graduated · Mumbai",
                title: "Lakshdham High School",
                subtitle: "Indian Certificate of Secondary Education (ICSE)",
                meta: [
                    { label: "Board", value: "ICSE Council" },
                    { label: "Score", value: "90.4%" },
                    { label: "Distinction", value: "School Sports Captain & Academic Honors" }
                ],
                sections: [
                    {
                        heading: "Foundational Excellence",
                        content: "Graduated with 90.4% in ICSE examinations with top honors in Computer Applications, Science, and Mathematics. Maintained active involvement in competitive athletics and school leadership councils."
                    }
                ],
                actions: [
                    { label: "View Resume On Screen ↗", pdf: "nitaanth_resume.pdf", title: "Nitaanth Panickar — Official Resume", primary: true }
                ]
            }
        },

        // ── EXPERIENCE ──
        experience: {
            noblenet: {
                category: "Entrepreneurship & Engineering",
                status: "Founder & Lead Architect · 2024 – Present",
                title: "NobleNet Technologies",
                subtitle: "Custom Cloud Engineering, Digital Architecture & Technical Consultancy",
                meta: [
                    { label: "Role", value: "Founder & Lead Architect" },
                    { label: "Clients Served", value: "Luxury Retail, Legal Tech, Industrial Manufacturing" },
                    { label: "Stack", value: "Python, Django, FastAPI, React, PostgreSQL, Docker, Render" }
                ],
                sections: [
                    {
                        heading: "Venture Overview",
                        content: "Founded NobleNet Technologies as an independent technology studio delivering high-reliability web systems, automated operational pipelines, and custom software architecture for commercial enterprises."
                    },
                    {
                        heading: "Architectural & Technical Contributions",
                        bullets: [
                            "Architected and deployed end-to-end full-stack platforms from bare requirements to secure production cloud instances.",
                            "Engineered zero-downtime deployment pipelines with Docker containerization, automated SSL/TLS management, and DNS health routing.",
                            "Designed custom relational schemas and optimized ORM queries for sub-100ms API response times across high-traffic catalogs.",
                            "Consulted directly with business founders on tech stack selection, cost optimization on Render/Vercel, and cybersecurity best practices."
                        ]
                    }
                ],
                actions: [
                    { label: "Maison Momento Prototype ↗", url: "https://maison-momento.onrender.com/products/", primary: true },
                    { label: "Entrust Legal Services ↗", url: "https://www.entrustlegal.in/", primary: false }
                ]
            },
            momento: {
                category: "Commercial Client Venture // Luxury Retail",
                status: "Cloud Prototype Live on Render",
                title: "Maison Momento",
                subtitle: "High-Concurrency Luxury E-Commerce Platform & Order Management",
                meta: [
                    { label: "Client", value: "Maison Momento" },
                    { label: "Host", value: "Render Cloud Platform" },
                    { label: "Backend", value: "Django & PostgreSQL" }
                ],
                sections: [
                    {
                        heading: "Project Brief & Architecture",
                        content: "Developed a luxury retail digital shopping experience with dynamic inventory catalogs, responsive product showcases, customer cart persistence, and secure checkout simulation."
                    },
                    {
                        heading: "Key Deliverables",
                        bullets: [
                            "Designed responsive UI featuring high-aesthetic minimalism matching the luxury brand's visual identity.",
                            "Implemented PostgreSQL database backend with indexing on product categories and SKU attributes.",
                            "Configured Render Web Services deployment with persistent media asset handling and automated builds."
                        ]
                    }
                ],
                actions: [
                    { label: "View Live Prototype ↗", url: "https://maison-momento.onrender.com/products/", primary: true }
                ]
            },
            entrust: {
                category: "Commercial Client Venture // Legal Tech",
                status: "Production Live",
                title: "Entrust Legal Services",
                subtitle: "Corporate Legal Advisory & Client Consultation Portal",
                meta: [
                    { label: "Client", value: "Entrust Legal Services" },
                    { label: "Domain", value: "entrustlegal.in" },
                    { label: "Features", value: "Client Ingestion & SEO Architecture" }
                ],
                sections: [
                    {
                        heading: "Project Brief & Impact",
                        content: "Built a high-trust digital portal for a premier legal advisory firm, facilitating client case intake, corporate service inquiries, and statutory practice showcases."
                    },
                    {
                        heading: "Technical Deliverables",
                        bullets: [
                            "Delivered 100/100 Lighthouse performance and SEO scores with semantic HTML and structured schema metadata.",
                            "Engineered secure form handling with spam protection, rate-limiting, and encrypted email notification dispatch.",
                            "Established custom domain DNS routing with automated SSL certificate lifecycle management."
                        ]
                    }
                ],
                actions: [
                    { label: "Visit Production Site ↗", url: "https://www.entrustlegal.in/", primary: true }
                ]
            },
            jyoti: {
                category: "Industrial Client Venture // Manufacturing",
                status: "System In Production",
                title: "Jyoti Enterprises",
                subtitle: "Industrial Procurement, Quotation Engine & Inventory Operations",
                meta: [
                    { label: "Client", value: "Jyoti Enterprises" },
                    { label: "Scope", value: "B2B Procurement & Quotations" },
                    { label: "Outcome", value: "80% Reduction in Manual RFQ Inquiries" }
                ],
                sections: [
                    {
                        heading: "Project Brief & Impact",
                        content: "Modernized digital presence and B2B quotation generation workflows for an industrial fasteners and precision manufacturing firm."
                    },
                    {
                        heading: "Technical Deliverables",
                        bullets: [
                            "Cataloged hundreds of industrial SKUs with technical specification sheets and CAD dimensional parameters.",
                            "Built a dynamic RFQ (Request for Quotation) generator reducing phone-based inquiry overhead by over 80%.",
                            "Optimized for high-speed mobile accessibility across manufacturing field staff and warehouse floor supervisors."
                        ]
                    }
                ],
                actions: []
            }
        },

        // ── RESEARCH ──
        research: {
            sentinel: {
                category: "Academic Research // Security & RAG",
                status: "Accepted · Springer ICDECT-2026",
                title: "Sentinel AI: Hybrid AST Security & LLM Remediation",
                subtitle: "Published in Proceedings of Springer ICDECT-2026",
                meta: [
                    { label: "Conference", value: "Springer ICDECT-2026" },
                    { label: "Authors", value: "Nitaanth Panickar, Research Collaborators" },
                    { label: "Package", value: "pip install nitaanth-sentinelai" },
                    { label: "Artifacts", value: "CLI Tool, PyPI, Full Manuscript" }
                ],
                sections: [
                    {
                        heading: "Research Abstract",
                        content: "Modern software repositories suffer from pervasive security vulnerabilities compounded by static analysis tools that produce unranked, context-decoupled alerts. This paper introduces Sentinel AI, a dual-layer cybersecurity architecture combining deterministic Abstract Syntax Tree (AST) pattern matching with Retrieval-Augmented Generation (RAG) powered by Llama 3.3-70B via Groq. The engine provides root-cause explanations and generates AST syntax-validated patches with rollback capabilities."
                    },
                    {
                        heading: "Key Methodological Findings",
                        bullets: [
                            "Evaluated across diverse Python and JavaScript test fixtures, demonstrating zero hallucination on deterministic AST flaw detection.",
                            "Reduced time-to-remediate from hours to seconds through contextual diff generation and atomic patch application.",
                            "Introduced reversible remediation via 'sentinelai undo' state snapshots, ensuring zero breaking changes in production pipelines."
                        ]
                    }
                ],
                actions: [
                    { label: "View Manuscript (PDF) ↗", pdf: "Research-Papers/252_CRC.pdf", title: "Sentinel AI: Hybrid AST Security & LLM Remediation", primary: true },
                    { label: "Open CLI Scans Guide", action: "openSentinelModal", primary: false },
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/Sentinel-AI", primary: false }
                ]
            },
            bandhoo: {
                category: "Academic Research // Legal NLP",
                status: "Under IEEE Peer Review",
                title: "Bandhoo: BNS Legal Classification Benchmark",
                subtitle: "Mumbai Crime-Reporting and Statutory Classification Framework",
                meta: [
                    { label: "Venue", value: "Under IEEE Peer Review" },
                    { label: "Benchmark", value: "50 Multilingual Complaints (BNS 2023)" },
                    { label: "Procedural Engine", value: "BNSS First Schedule Reasoning" },
                    { label: "Demo", value: "bandhoo-sigma.vercel.app" }
                ],
                sections: [
                    {
                        heading: "Research Abstract",
                        content: "The enactment of the Bharatiya Nyaya Sanhita (BNS, 2023) and Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023) fundamentally reshuffled India's penal code structure. This research presents the Bandhoo BNS Legal Classification Benchmark (v1.0), comprising 50 diverse, realistic synthetic complaints in English, Hindi, and Hinglish across 12 penal categories. The proposed engine integrates tuned BM25 statutory retrieval with a 4-tier certainty schema to prevent false criminal filings caused by metaphorical complaints."
                    },
                    {
                        heading: "Benchmark Findings & Certainty Schema",
                        bullets: [
                            "Tier A (Supported candidate provision): Facts satisfy prima facie statutory elements with high confidence.",
                            "Tier B (Plausible alternative): Material ambiguity flagged; engine poses clarifying questions.",
                            "Tier C (Contradicted provision): Correctly rejects metaphorical traps (e.g. pricing grievances) with 0.0 applicability score.",
                            "Tier D (Insufficient information): Avoids hallucination on brief narratives."
                        ]
                    }
                ],
                actions: [
                    { label: "View Manuscript (PDF) ↗", pdf: "Research-Papers/Bandhoo_IEEE_paper.pdf", title: "Bandhoo: BNS Legal Classification Benchmark", primary: true },
                    { label: "Live Engine Demo ↗", url: "https://bandhoo-sigma.vercel.app/", primary: false },
                    { label: "GitHub Repository", url: "https://github.com/nitaanth-11/Bandhoo", primary: false }
                ]
            },
            xenotransplantation: {
                category: "Academic Research // Computational Immunology",
                status: "Active Research",
                title: "Xenotransplantation Viability Profiling",
                subtitle: "Predicting Organ Rejection Risks via Genomic & Immunological Profiling",
                meta: [
                    { label: "Domain", value: "Computational Biology & Genetics" },
                    { label: "Key Vectors", value: "GGTA1, CMAH, B4GALNT2, HLA Typing" },
                    { label: "Methods", value: "Multi-layered Deep Learning & Feature Ranking" }
                ],
                sections: [
                    {
                        heading: "Research Abstract",
                        content: "Xenotransplantation presents a viable solution to the worldwide donor organ shortage, yet hyperacute rejection and cross-species immune responses remain critical hurdles. This study formulates a computational risk modeling pipeline analyzing donor-recipient genomic compatibility, evaluating gene knockout markers and predicting post-transplantation cellular survival rates."
                    },
                    {
                        heading: "Methodology & Scope",
                        bullets: [
                            "Investigated immune response cascades triggered by Galactose-alpha-1,3-galactose epitopes.",
                            "Trained predictive classification models on cross-species cellular assays to profile graft survival horizons.",
                            "Formulated computational frameworks to guide targeted CRISPR-Cas9 genetic modifications in prospective donor strains."
                        ]
                    }
                ],
                actions: [
                    { label: "View Manuscript (PDF) ↗", pdf: "Research-Papers/Xenotransplantation_final_research.pdf", title: "Xenotransplantation Viability Profiling", primary: true }
                ]
            }
        },

        // ── HOW I BUILD (WORKFLOW STAGES) ──
        workflow: {
            "stage-1": {
                category: "Engineering Discipline // Stage 01",
                status: "Foundational Phase",
                title: "Stage 01: Explore",
                subtitle: "Problem Deconstruction, Stakeholder Interviews & Domain Immersion",
                meta: [
                    { label: "Focus", value: "Problem Discovery" },
                    { label: "Artifacts", value: "Requirements Doc, Friction Map" },
                    { label: "Tools", value: "Domain Research, Literature Review" }
                ],
                sections: [
                    {
                        heading: "Methodology & Objectives",
                        content: "Great engineering starts with identifying the exact bottleneck. Before writing a single line of code or choosing a database, I immerse myself in the domain, study existing academic literature, dissect friction points, and interview end-users to establish unambiguous, quantitative requirements."
                    },
                    {
                        heading: "Execution Checklist",
                        bullets: [
                            "Deconstruct user pain points into quantifiable performance metrics (latency, accuracy, throughput).",
                            "Conduct comprehensive prior-art and literature surveys to leverage proven algorithms.",
                            "Draft user journey maps and establish failure edge cases upfront."
                        ]
                    }
                ],
                actions: []
            },
            "stage-2": {
                category: "Engineering Discipline // Stage 02",
                status: "Architectural Phase",
                title: "Stage 02: Architect",
                subtitle: "System Topology, Schema Contracts & Model Selection",
                meta: [
                    { label: "Focus", value: "Topology & Data Flow" },
                    { label: "Artifacts", value: "System Architecture Diagram, DB Schema" },
                    { label: "Decisions", value: "Storage vs Compute vs Latency" }
                ],
                sections: [
                    {
                        heading: "Methodology & Objectives",
                        content: "Designing the high-level topology: selecting between relational vs document databases, evaluating whether a heuristic, classical ML, or neural LLM approach is warranted, and enforcing strict data contracts between services."
                    },
                    {
                        heading: "Execution Checklist",
                        bullets: [
                            "Formalize database schema contracts with normalized tables, foreign keys, and indexes.",
                            "Evaluate cost vs latency trade-offs (e.g. self-hosted models vs serverless APIs).",
                            "Design modular microservices with clear separation of concerns."
                        ]
                    }
                ],
                actions: []
            },
            "stage-3": {
                category: "Engineering Discipline // Stage 03",
                status: "Validation Phase",
                title: "Stage 03: Experiment",
                subtitle: "Benchmarking, Rapid Prototyping & Iteration",
                meta: [
                    { label: "Focus", value: "Feasibility & Proof of Concept" },
                    { label: "Artifacts", value: "Benchmark Metrics, Model Weights" },
                    { label: "Techniques", value: "A/B Testing, Baseline Comparisons" }
                ],
                sections: [
                    {
                        heading: "Methodology & Objectives",
                        content: "Assumptions must be verified empirically. I rapidly build functional proof-of-concept scripts, test edge cases, compare neural models against baseline heuristics, and evaluate convergence and token efficiency."
                    },
                    {
                        heading: "Execution Checklist",
                        bullets: [
                            "Benchmark algorithmic accuracy against established test fixtures and golden datasets.",
                            "Stress-test edge cases, adversarial inputs, and out-of-distribution prompts.",
                            "Measure token efficiency and inference latency under simulated peak load."
                        ]
                    }
                ],
                actions: []
            },
            "stage-4": {
                category: "Engineering Discipline // Stage 04",
                status: "Development Phase",
                title: "Stage 04: Engineer",
                subtitle: "Production APIs, Model Integrations & Responsive Interfaces",
                meta: [
                    { label: "Focus", value: "Implementation & Hardening" },
                    { label: "Stack", value: "FastAPI, Flask, Next.js, TypeScript" },
                    { label: "Standards", value: "Clean Code, Typing, Unit Tests" }
                ],
                sections: [
                    {
                        heading: "Methodology & Objectives",
                        content: "Transforming prototypes into production-grade systems. Writing asynchronous backend services with FastAPI or Flask, structuring caching layers, integrating LLM retrieval modules, and building accessible, lightning-fast UIs."
                    },
                    {
                        heading: "Execution Checklist",
                        bullets: [
                            "Implement typed async REST endpoints with strict Pydantic / dataclass validation.",
                            "Incorporate connection pooling, rate-limiting, and error fallback handlers.",
                            "Craft responsive, dark-mode, accessible interfaces with fluid micro-interactions."
                        ]
                    }
                ],
                actions: []
            },
            "stage-5": {
                category: "Engineering Discipline // Stage 05",
                status: "Deployment Phase",
                title: "Stage 05: Deploy",
                subtitle: "Docker Containers, Cloud Infrastructure & Global Edge Delivery",
                meta: [
                    { label: "Focus", value: "Containerization & Delivery" },
                    { label: "Platforms", value: "AWS, GCP, Render, Vercel" },
                    { label: "DevOps", value: "CI/CD, Docker, SSL, Edge DNS" }
                ],
                sections: [
                    {
                        heading: "Methodology & Objectives",
                        content: "Shipping software reliably. Packaging services into lightweight, reproducible Docker images, setting up automated CI/CD pipelines, provisioning cloud resources, and ensuring global SSL and DNS integrity."
                    },
                    {
                        heading: "Execution Checklist",
                        bullets: [
                            "Construct multi-stage Dockerfiles optimizing image size and security layers.",
                            "Configure GitHub Actions for automated linting, test execution, and deployment hooks.",
                            "Set up custom domain DNS routing with automated SSL/TLS renewals."
                        ]
                    }
                ],
                actions: []
            },
            "stage-6": {
                category: "Engineering Discipline // Stage 06",
                status: "Continuous Phase",
                title: "Stage 06: Improve",
                subtitle: "Telemetry, Latency Profiling & Continuous Optimization",
                meta: [
                    { label: "Focus", value: "Monitoring & Refinement" },
                    { label: "Metrics", value: "p95/p99 Latency, Error Rates" },
                    { label: "Loop", value: "Feedback Analytics, Security Patches" }
                ],
                sections: [
                    {
                        heading: "Methodology & Objectives",
                        content: "Deployment is day one, not the finish line. I monitor real-time system telemetry, track p95 and p99 latency, analyze error logs, review user feedback, patch security vulnerabilities, and iteratively refine performance."
                    },
                    {
                        heading: "Execution Checklist",
                        bullets: [
                            "Monitor API response times, memory spikes, and error logs via telemetry dashboards.",
                            "Profile runtime bottlenecks and apply database index or algorithmic optimizations.",
                            "Iterate model weights and prompts based on real-world production query distributions."
                        ]
                    }
                ],
                actions: []
            }
        }
    };

    function openFocusModal(category, id) {
        const data = FOCUS_DATA[category]?.[id];
        if (!data) return;

        const modal = document.getElementById('focus-spotlight-modal');
        const catBadge = document.getElementById('focus-category');
        const statusBadge = document.getElementById('focus-status');
        const body = document.getElementById('focus-modal-body');
        const footer = document.getElementById('focus-modal-footer');

        if (!modal || !body) return;

        if (catBadge) catBadge.textContent = data.category || category.toUpperCase();
        if (statusBadge) {
            statusBadge.textContent = data.status || '';
            statusBadge.style.display = data.status ? 'inline-block' : 'none';
        }

        let metaHTML = '';
        if (data.meta && data.meta.length) {
            metaHTML = `
                <div class="focus-meta-strip">
                    ${data.meta.map(m => `<div class="focus-meta-item"><span>${m.label}:</span> <strong>${m.value}</strong></div>`).join('')}
                </div>
            `;
        }

        let sectionsHTML = '';
        if (data.sections && data.sections.length) {
            sectionsHTML = data.sections.map(sec => {
                let inner = '';
                if (sec.content) {
                    inner += `<p class="focus-prose-text">${sec.content}</p>`;
                }
                if (sec.bullets && sec.bullets.length) {
                    inner += `<ul class="focus-bullets-list">${sec.bullets.map(b => `<li class="focus-bullet-item">${b}</li>`).join('')}</ul>`;
                }
                if (sec.tags && sec.tags.length) {
                    inner += `<div class="focus-tags-cloud">${sec.tags.map(t => `<span class="focus-tag-chip">${t}</span>`).join('')}</div>`;
                }
                return `
                    <div class="focus-section-block">
                        <span class="focus-section-heading">${sec.heading}</span>
                        ${inner}
                    </div>
                `;
            }).join('');
        }

        body.innerHTML = `
            <div class="focus-title-block">
                <h3 class="focus-main-title" id="focus-modal-title">${data.title}</h3>
                ${data.subtitle ? `<span class="focus-sub-title">${data.subtitle}</span>` : ''}
            </div>
            ${metaHTML}
            ${sectionsHTML}
        `;

        // Render Action Buttons
        if (footer) {
            footer.innerHTML = '';
            if (data.actions && data.actions.length) {
                data.actions.forEach(act => {
                    if (act.action === 'openSentinelModal') {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = `focus-action-btn ${act.primary ? 'focus-action-primary' : 'focus-action-secondary'}`;
                        btn.textContent = act.label;
                        btn.onclick = () => {
                            closeFocusModal();
                            openSentinelModal();
                        };
                        footer.appendChild(btn);
                    } else if (act.pdf) {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = `focus-action-btn ${act.primary ? 'focus-action-primary' : 'focus-action-secondary'}`;
                        btn.textContent = act.label;
                        btn.onclick = () => {
                            closeFocusModal();
                            openPDFModal(act.pdf, act.title || act.label);
                        };
                        footer.appendChild(btn);
                    } else if (act.url) {
                        const a = document.createElement('a');
                        a.href = act.url;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.className = `focus-action-btn ${act.primary ? 'focus-action-primary' : 'focus-action-secondary'}`;
                        a.textContent = act.label;
                        footer.appendChild(a);
                    }
                });
                footer.style.display = 'flex';
            } else {
                footer.style.display = 'none';
            }
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeFocusModal() {
        const modal = document.getElementById('focus-spotlight-modal');
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    const focusCloseBtn = document.getElementById('focus-close-btn');
    const focusBackdrop = document.getElementById('focus-spotlight-backdrop');
    if (focusCloseBtn) focusCloseBtn.addEventListener('click', closeFocusModal);
    if (focusBackdrop) focusBackdrop.addEventListener('click', closeFocusModal);

    // ── ON-SCREEN FULLSCREEN PDF VIEWER MODAL ──────────────────
    const pdfModal = document.getElementById('pdf-viewer-modal');
    const pdfIframe = document.getElementById('pdf-modal-iframe');
    const pdfModalTitle = document.getElementById('pdf-modal-title');
    const pdfDownloadLink = document.getElementById('pdf-download-link');
    const pdfCloseBtn = document.getElementById('pdf-close-btn');
    const pdfBackdrop = document.getElementById('pdf-modal-backdrop');

    function openPDFModal(pdfUrl, title) {
        if (!pdfModal || !pdfIframe) return;
        if (pdfModalTitle) pdfModalTitle.textContent = title || 'Document Viewer';
        if (pdfDownloadLink) {
            pdfDownloadLink.href = pdfUrl;
            pdfDownloadLink.setAttribute('download', (pdfUrl || '').split('/').pop() || 'document.pdf');
        }
        // Native browser PDF viewer with toolbar enabled for reading and zooming
        pdfIframe.src = `${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
        pdfModal.classList.add('active');
        pdfModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePDFModal() {
        if (!pdfModal || !pdfIframe) return;
        pdfModal.classList.remove('active');
        pdfModal.setAttribute('aria-hidden', 'true');
        pdfIframe.src = 'about:blank';
        document.body.style.overflow = '';
    }

    if (pdfCloseBtn) pdfCloseBtn.addEventListener('click', closePDFModal);
    if (pdfBackdrop) pdfBackdrop.addEventListener('click', closePDFModal);

    // Global Key Listener for Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const pdfModal = document.getElementById('pdf-viewer-modal');
            if (pdfModal && pdfModal.classList.contains('active')) {
                closePDFModal();
            }
            const focusModal = document.getElementById('focus-spotlight-modal');
            if (focusModal && focusModal.classList.contains('active')) {
                closeFocusModal();
            }
            if (sentinelModal && sentinelModal.classList.contains('active')) {
                closeSentinelModal();
            }
        }
    });

    // Delegation click listener for PDF triggers, Sentinel CLI triggers and Click-to-Focus Spotlight cards
    document.addEventListener('click', (e) => {
        // Priority 1: On-Screen PDF document triggers (Certificates, Resume, LOR, Papers)
        const pdfBtn = e.target.closest('.open-pdf-btn, [data-pdf]');
        if (pdfBtn) {
            e.preventDefault();
            e.stopPropagation();
            const pdfUrl = pdfBtn.getAttribute('data-pdf');
            const title = pdfBtn.getAttribute('data-title') || pdfBtn.getAttribute('title') || 'Document Preview';
            if (pdfUrl) {
                openPDFModal(pdfUrl, title);
            }
            return;
        }

        // Priority 2: Sentinel CLI triggers
        const trigger = e.target.closest('.sentinel-cli-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            openSentinelModal();
            return;
        }

        // Priority 3: Ignore clicks on standard links, action buttons, copy triggers, mobile nav
        if (e.target.closest('a, button, .copy-btn, .mobile-toggle, #back-to-top')) {
            return;
        }

        // Priority 4: Interactive Spotlight Click-to-Focus items
        const focusTarget = e.target.closest('[data-focus]');
        if (focusTarget) {
            const cat = focusTarget.getAttribute('data-focus');
            const id = focusTarget.getAttribute('data-id');
            if (cat && id) {
                openFocusModal(cat, id);
            }
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
