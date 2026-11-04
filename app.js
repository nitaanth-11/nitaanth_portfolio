/**
 * app.js — Nitaanth's Portfolio
 * Fetches dynamic data (Projects, Work, Research, Certifications) from
 * a Python Flask backend API, and handles all UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════════════
    // CONFIG — API base URL (Vercel serverless / Local backend)
    // ═══════════════════════════════════════════════════════════════
    const API_BASE = window.__API_BASE || (
        window.location.hostname === 'localhost' && window.location.port !== '5000' && window.location.port !== ''
            ? 'http://localhost:5000/api'
            : '/api'
    );

    // ═══════════════════════════════════════════════════════════════
    // SVG ICON HELPERS
    // ═══════════════════════════════════════════════════════════════
    const ICONS = {
        github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
        linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
        mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
        folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
        fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
        menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
        x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
    };

    // ═══════════════════════════════════════════════════════════════
    // HEADER SOCIALS
    // ═══════════════════════════════════════════════════════════════
    const socialLinks = [
        { href: 'https://github.com/nitaanth-11', icon: ICONS.github, label: 'GitHub', external: true },
        { href: 'https://www.linkedin.com/in/nitaanth-panickar', icon: ICONS.linkedin, label: 'LinkedIn', external: true },
        { href: 'mailto:nitaanth.panickar@gmail.com', icon: ICONS.mail, label: 'Email' },
    ];

    function renderSocials(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        socialLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'social-icon';
            a.setAttribute('aria-label', link.label);
            a.setAttribute('title', link.label);
            if (link.external) a.setAttribute('target', '_blank');
            a.innerHTML = link.icon;
            container.appendChild(a);
        });
    }

    renderSocials('header-socials');
    renderSocials('footer-socials');

    // ═══════════════════════════════════════════════════════════════
    // API FETCHER (with fallback for when backend is not running)
    // ═══════════════════════════════════════════════════════════════
    async function fetchAPI(endpoint) {
        try {
            const res = await fetch(`${API_BASE}${endpoint}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn(`API fetch failed for ${endpoint}:`, err.message);
            return null;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDER: PROJECTS
    // ═══════════════════════════════════════════════════════════════
    function renderProjects(projects) {
        const grid = document.getElementById('projects-grid');
        if (!grid || !projects || projects.length === 0) return;
        grid.innerHTML = '';

        projects.forEach(proj => {
            const statusLower = (proj.status || '').toLowerCase();
            const statusClass = statusLower.includes('live') ? 'status-live' :
                                statusLower.includes('cli') ? 'status-cli' :
                                statusLower.includes('test') ? 'status-testing' :
                                statusLower.includes('beta') ? 'status-beta' : 'status-dev';
            
            // Map specific dynamic SVG icons for projects
            let projectIcon = ICONS.folder;
            const titleLower = (proj.title || '').toLowerCase();
            
            if (titleLower.includes('freightiq') || titleLower.includes('lorri')) {
                // Smart logistics routing truck
                projectIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;
            } else if (titleLower.includes('genebridge')) {
                // DNA Double Helix
                projectIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5C4.5 5 12 3 12 3s7.5 2 7.5 7.5c0 5-7.5 10.5-7.5 10.5s-7.5-5.5-7.5-10.5z"/><path d="M12 3v18M8 7h8M7 11h10M8 15h8"/></svg>`;
            } else if (titleLower.includes('janraksha')) {
                // Emergency response shield with cross
                projectIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v8M8 12h8"/></svg>`;
            } else if (titleLower.includes('beema')) {
                // Insurance umbrella / shield
                projectIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12A10 10 0 0 0 12 2 10 10 0 0 0 2 12c0 2.4 1 3.5 2 3.5 1 0 1.5-.7 2-1.5.8-1.3 1.8-2 3-2 1.3 0 2.2.7 3 2 .5.8 1 1.5 2 1.5 1 0 1.5-.7 2-1.5.8-1.3 1.8-2 3-2 1.3 0 2.2.7 3 2 .5.8 1 1.5 2 1.5 1 0 2-1.1 2-3.5z"/><path d="M12 12v7a2 2 0 0 0 4 0"/></svg>`;
            } else if (titleLower.includes('bandhoo')) {
                // Collaborative agent handshake / assistive workflow
                projectIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
            } else if (titleLower.includes('sentinel')) {
                // Security terminal / CLI scanner
                projectIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
            } else if (titleLower.includes('prompt') || titleLower.includes('optima')) {
                // RL optimizer / intelligence sparkles
                projectIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`;
            } else if (titleLower.includes('event oracle')) {
                // Smart Calendar / Forecasting
                projectIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 14l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/></svg>`;
            }

            // Determine deployment link HTML
            let demoLinkHTML = '';
            const dep = (proj.deployed || '').trim();
            if (dep.startsWith('http')) {
                demoLinkHTML = `<a href="${dep}" target="_blank" class="project-link">${ICONS.externalLink} Live Demo</a>`;
            } else if (dep.toLowerCase().includes('test')) {
                demoLinkHTML = `<span class="project-link-badge badge-testing"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg> Under Testing</span>`;
            } else if (dep.toLowerCase().includes('cli') || (proj.status || '').toLowerCase().includes('cli')) {
                demoLinkHTML = `<span class="project-link-badge badge-cli"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> CLI Tool</span>`;
            }

            const gitLinkHTML = (proj.github && proj.github.startsWith('http'))
                ? `<a href="${proj.github}" target="_blank" class="project-link">${ICONS.github} Source</a>`
                : '';

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="project-card-body">
                    <div class="project-header">
                        <div class="project-icon" style="color: var(--crescent);">${projectIcon}</div>
                        <span class="project-status ${statusClass}">${proj.status || 'Dev'}</span>
                    </div>
                    <h3 class="project-title">${proj.title}</h3>
                    ${proj.domain ? `<span class="project-domain-badge">${proj.domain}</span>` : ''}
                    <p class="project-desc">${proj.description}</p>
                    <div class="tags-row">
                        ${(proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${gitLinkHTML}
                        ${demoLinkHTML}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDER: PROFESSIONAL WORK & CLIENT VENTURES UNDER NOBLENET
    // ═══════════════════════════════════════════════════════════════
    function renderWork(workItems) {
        const grid = document.getElementById('work-grid');
        if (!grid || !workItems || workItems.length === 0) return;

        // Filter out umbrella entry if passed, keeping client projects
        const clientProjects = Array.isArray(workItems)
            ? workItems.filter(item => !(item.company && item.company.toLowerCase().includes('noblenet') && !item.company.toLowerCase().includes('via') && !item.company.toLowerCase().includes('under') && (item.title || '').toLowerCase().includes('intern')))
            : [];

        if (clientProjects.length === 0) return;
        grid.innerHTML = '';

        clientProjects.forEach(work => {
            const card = document.createElement('a');
            card.href = work.link || '#';
            card.target = '_blank';
            card.className = 'card client-project-card';

            const isPrelaunch = (work.status || '').toLowerCase().includes('pre-launch') || (work.status || '').toLowerCase().includes('prototype');
            const statusClass = isPrelaunch ? 'status-prelaunch' : 'status-live';
            const statusText = work.status || (isPrelaunch ? 'Cloud Prototype' : 'Live Platform');
            const categoryBadge = work.badge || (work.title.toLowerCase().includes('perfume') || work.company.toLowerCase().includes('momento') ? 'Luxury Fragrance Brand' : 'Legal Tech & Portals');
            const cleanCompanyName = work.company.replace(/\s*\(.*\)/, '');
            const actionText = isPrelaunch ? 'View Prototype' : `Visit ${cleanCompanyName}`;
            const noteText = work.note || (isPrelaunch ? 'Prototype live on Render (Pre-launch / compliance)' : 'Live Production Platform');

            card.innerHTML = `
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
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDER: RESEARCH PAPERS (Inside Single Unified Container)
    // ═══════════════════════════════════════════════════════════════
    function renderResearch(papers) {
        const grid = document.getElementById('research-grid');
        if (!grid || !papers || papers.length === 0) return;
        grid.innerHTML = '';

        papers.forEach(paper => {
            const row = document.createElement('a');
            row.href = paper.link || '#';
            row.target = '_blank';
            row.className = 'research-item-row';
            row.innerHTML = `
                <div class="research-icon">${ICONS.fileText}</div>
                <div class="research-row-content">
                    <div class="research-row-header">
                        <h3 class="research-title">${paper.title}</h3>
                        ${paper.status ? `<span class="activity-chip" style="color: var(--crescent); border-color: var(--border-default); font-weight: 700;">${paper.status}</span>` : ''}
                    </div>
                    ${paper.subtitle ? `<p class="research-status-note">${paper.subtitle}</p>` : ''}
                    <p class="research-abstract">${paper.abstract || ''}</p>
                    <div class="research-link">${ICONS.externalLink} View Manuscript (PDF)</div>
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
                // AWS Logo (Cloud outline with arrow/lines)
                logoHTML = `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#FF9900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(255, 153, 0, 0.3));"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
            } else if (issuerLower.includes('huggingface') || issuerLower.includes('hugging face') || badgeUpper === 'LLM' || badgeUpper === 'AGNT') {
                // Hugging Face Logo (🤗 smiling face)
                logoHTML = `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#FFD21E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(255, 210, 30, 0.3));"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="3"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="3"/><path d="M4 17c.5-1.5 2-2.5 3.5-2.5.8 0 1.5.3 2 1"/><path d="M20 17c-.5-1.5-2-2.5-3.5-2.5-.8 0-1.5.3-2 1"/></svg>`;
            } else {
                // Default edge chip
                logoHTML = `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#00d2ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.3));"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>`;
            }

            const card = document.createElement('a');
            card.href = cert.link || '#';
            card.target = '_blank';
            card.className = 'card cert-card';
            card.innerHTML = `
                <div class="cert-badge" style="display: flex; justify-content: center; align-items: center; min-height: 48px; margin-bottom: 0.8rem;">${logoHTML}</div>
                <h3 class="cert-title">${cert.title}</h3>
                <p class="cert-issuer">${cert.issuer}</p>
                <p class="cert-date">${cert.date}</p>
                <div class="cert-verify">${ICONS.externalLink} Verify</div>
            `;
            grid.appendChild(card);
        });
    }


    // ═══════════════════════════════════════════════════════════════
    // LOCAL BACKUP DATA (Used if the Python backend is not running)
    // ═══════════════════════════════════════════════════════════════
    const LOCAL_FALLBACK = {
        projects: [
            {
                "title": "FreightIQ",
                "domain": "Logistics & Supply Chain",
                "description": "Intelligent multi-modal logistics routing and freight optimizer utilizing neural networks and heuristic constraint solvers to minimize transport latency, fuel burn, and routing overhead. Finalist at the Lorri AI Hackathon.",
                "tags": ["Python", "PyTorch", "Heuristic Search", "MLOps", "Route Optimization", "Docker"],
                "github": "https://github.com/siddh-sh/LoRRI",
                "deployed": "https://lorri.onrender.com/",
                "status": "Live"
            },
            {
                "title": "GeneBridge",
                "domain": "Bioinformatics & Health Tech",
                "description": "Computational genomics and genetic sequence alignment platform engineered to discover and visualize hereditary correlations across multi-strain genetic data with interactive computational models.",
                "tags": ["BioPython", "Genomics", "Sequence Alignment", "Flask", "Vercel", "Docker"],
                "github": "https://github.com/nitaanth-11/GeneBridge",
                "deployed": "https://gene-bridge-31eg.vercel.app/",
                "status": "Live"
            },
            {
                "title": "JanRaksha",
                "domain": "Public Safety & Civic Tech",
                "description": "Real-time emergency response and disaster relief orchestration platform. Ingests crowd-sourced distress signals, assesses geospatial urgency scores, and coordinates rapid responder dispatch pipelines.",
                "tags": ["FastAPI", "Python", "Geospatial AI", "PostgreSQL", "Real-Time Pipelines", "Cloud"],
                "github": "https://github.com/nitaanth-11/JanRaksha",
                "deployed": "https://janraksha-wyc6.onrender.com/",
                "status": "Live"
            },
            {
                "title": "Beema",
                "domain": "InsurTech & FinTech",
                "description": "Automated insurance underwriting and claim adjudication engine. Leverages predictive risk assessment models, anomaly detection algorithms, and a streamlined digital interface for policy approval acceleration.",
                "tags": ["InsurTech", "Risk Scoring", "Predictive Modeling", "Next.js", "Vercel"],
                "github": "https://github.com/nitaanth-11/Beema",
                "deployed": "https://beema-jade.vercel.app/",
                "status": "Live"
            },
            {
                "title": "Bandhoo",
                "domain": "Assistive AI & Orchestration",
                "description": "Adaptive collaborative agent framework designed to orchestrate complex user workflows and bridge communication through contextual memory and task execution. Supported by active academic peer review.",
                "tags": ["Agentic AI", "Task Orchestration", "Contextual Memory", "Python", "Under Review"],
                "github": "https://github.com/nitaanth-11/Bandhoo",
                "deployed": "Under testing",
                "status": "Testing"
            },
            {
                "title": "Sentinel AI",
                "domain": "Cybersecurity & Code Analysis",
                "description": "Command-line vulnerability detection and code security engine. Combines static AST analysis with Retrieval-Augmented Generation (RAG) for explainable security audits. Accepted at ICDECT-2026 (Springer Proceedings).",
                "tags": ["CLI Security Tool", "Static AST", "RAG Reasoning", "Springer Proceedings", "Vulnerability Scanning"],
                "github": "https://github.com/nitaanth-11/Sentinel-AI",
                "deployed": "CLI Tool",
                "status": "CLI Tool"
            },
            {
                "title": "Prompt Max",
                "domain": "Reinforcement Learning & GenAI",
                "description": "Reinforcement learning-driven prompt optimization system (Optima). Analyzes query intents, applies iterative reward modeling, and automatically rewrites prompts to maximize LLM accuracy and task benchmarks.",
                "tags": ["Reinforcement Learning", "Reward Modeling", "Prompt Optimization", "LLMOps", "Render"],
                "github": "https://github.com/vedikas323-pixel/RL_Prompt_Optimizer",
                "deployed": "https://optima-kvj6.onrender.com",
                "status": "Live"
            },
            {
                "title": "Event Oracle",
                "domain": "Quantitative Finance & Macro AI",
                "description": "Multi-source financial forecasting pipeline for NIFTY 50 and index options, fusing OHLCV price action, FII/DII liquidity flows, macroeconomic release surprises, and news sentiment for volatility prediction.",
                "tags": ["GCP", "Agentic AI", "Ensemble Learning", "Time Series Analysis", "MongoDB"],
                "github": "https://github.com/nitaanth-11/Project-Apex",
                "deployed": "https://project-apex-baip.onrender.com/",
                "status": "Live"
            }
        ],
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
                "link": "Research Papers/252_CRC.pdf",
                "journal": "ICDECT-2026 (Springer Proceedings)",
                "tags": ["Springer", "Static Analysis", "RAG", "Vulnerability Detection"]
            },
            {
                "title": "Bandhoo",
                "subtitle": "Under peer review from the guide and in view of application",
                "status": "Under Peer Review",
                "year": 2026,
                "abstract": "An assistive and coordination intelligence framework bridging workflows and user needs, engineered under academic guidance and currently undergoing peer review.",
                "link": "Research Papers/Bandhoo_IEEE_paper.pdf",
                "journal": "Under Peer Review",
                "tags": ["AI Systems", "Full Stack", "Under Review"]
            },
            {
                "title": "Xenotransplantation",
                "subtitle": "Under active research with proper guidance",
                "status": "Active Research",
                "year": 2026,
                "abstract": "Predicting xenotransplantation viability and organ rejection risks through multi-layered biological, genomic, and immunological compatibility profiling.",
                "link": "Research Papers/Xenotransplantation_final_research.pdf",
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
            "url": "nitaanth_resume.pdf"
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // LOAD ALL DATA FROM BACKEND (with local backup fallback)
    // ═══════════════════════════════════════════════════════════════
    async function loadAllData() {
        const [projects, work, research, certs, resume, socials] = await Promise.all([
            fetchAPI('/projects'),
            fetchAPI('/work'),
            fetchAPI('/research'),
            fetchAPI('/certifications'),
            fetchAPI('/resume'),
            fetchAPI('/socials'),
        ]);

        const projectsData = projects || LOCAL_FALLBACK.projects;
        const workData = work || LOCAL_FALLBACK.work;
        const researchData = research || LOCAL_FALLBACK.research;
        const certsData = certs || LOCAL_FALLBACK.certifications;
        const resumeData = resume || LOCAL_FALLBACK.resume;

        if (projectsData) renderProjects(projectsData);
        if (workData) renderWork(workData);
        if (researchData) renderResearch(researchData);
        if (certsData) renderCerts(certsData);

        if (resumeData && resumeData.url) {
            const resumeBtn = document.getElementById('view-resume-btn');
            if (resumeBtn) {
                resumeBtn.href = resumeData.url;
                resumeBtn.style.display = 'inline-flex';
            }
        }

        // Dynamically update socials if successfully fetched
        if (socials) {
            const githubUrl = socials.github || 'https://github.com/nitaanth-11';
            const linkedinUrl = socials.linkedin || 'https://www.linkedin.com/in/nitaanth-panickar';
            const emailUrl = socials.email || 'nitaanth.panickar@gmail.com';
            
            socialLinks[0].href = githubUrl;
            socialLinks[1].href = linkedinUrl;
            socialLinks[2].href = emailUrl.startsWith('mailto:') ? emailUrl : `mailto:${emailUrl}`;
            
            // Re-render socials containers
            const header = document.getElementById('header-socials');
            const footer = document.getElementById('footer-socials');
            if (header) header.innerHTML = '';
            if (footer) footer.innerHTML = '';
            
            renderSocials('header-socials');
            renderSocials('footer-socials');
        }

        if (!projects || !work || !research || !certs) {
            console.info("Using local fallback data because the Python Flask backend is offline. Run 'python server.py' to serve dynamic API endpoints.");
        }
    }

    loadAllData();

    // ═══════════════════════════════════════════════════════════════
    // UI — NAVBAR SCROLL
    // ═══════════════════════════════════════════════════════════════
    const navbar = document.getElementById('navbar');
    function onScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    // ═══════════════════════════════════════════════════════════════
    // UI — MOBILE NAV
    // ═══════════════════════════════════════════════════════════════
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function closeMobileNav() {
        mobileNav.classList.remove('open');
        mobileOverlay.classList.remove('active');
        mobileToggle.innerHTML = ICONS.menu;
    }

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            if (isOpen) {
                closeMobileNav();
            } else {
                mobileNav.classList.add('open');
                mobileOverlay.classList.add('active');
                mobileToggle.innerHTML = ICONS.x;
            }
        });

        mobileOverlay.addEventListener('click', closeMobileNav);

        mobileNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // UI — SCROLL SPY
    // ═══════════════════════════════════════════════════════════════
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function scrollSpy() {
        const y = window.scrollY + 150;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (y >= top && y < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    // ═══════════════════════════════════════════════════════════════
    // UI — SCROLL REVEAL
    // ═══════════════════════════════════════════════════════════════
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════════════════════════════
    // UI — CONTACT FORM
    // ═══════════════════════════════════════════════════════════════
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            const btnText = btn.querySelector('span');
            btn.disabled = true;
            btnText.textContent = 'Sending...';

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
                
                btn.disabled = false;
                btnText.textContent = 'Send Message';
                
                if (res.ok && data.success) {
                    formFeedback.textContent = '✓ Message sent successfully!';
                    formFeedback.className = 'form-feedback show success';
                    contactForm.reset();
                } else {
                    formFeedback.textContent = `⚠ Send failed: ${data.error || 'Server error'}`;
                    formFeedback.className = 'form-feedback show error';
                }
            } catch (err) {
                btn.disabled = false;
                btnText.textContent = 'Send Message';
                formFeedback.textContent = `⚠ Connection error: ${err.message}`;
                formFeedback.className = 'form-feedback show error';
            }

            setTimeout(() => {
                formFeedback.className = 'form-feedback';
            }, 6000);
        });
    }

});
