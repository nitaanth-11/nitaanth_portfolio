import os
import re
import csv
import io
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable CORS for all routes

# ═══════════════════════════════════════════════════════════════
# ENV LOADER (Native parser to avoid python-dotenv requirement)
# ═══════════════════════════════════════════════════════════════
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    parts = line.split('=', 1)
                    if len(parts) == 2:
                        os.environ[parts[0].strip()] = parts[1].strip()

load_env()

# ═══════════════════════════════════════════════════════════════
# LOCAL FALLBACK DATA (New database provided by user)
# ═══════════════════════════════════════════════════════════════

PROJECTS_FALLBACK = [
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
]

WORK_FALLBACK = [
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
]

RESEARCH_FALLBACK = [
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
]

CERTIFICATIONS_FALLBACK = [
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
]

RESUME = {
    "url": "nitaanth_resume.pdf"
}

# ═══════════════════════════════════════════════════════════════
# GOOGLE SHEET CONNECTOR & DYNAMIC PARSER
# ═══════════════════════════════════════════════════════════════

def get_normalized_key(row_dict, target_variants):
    """Matches a key case-insensitively, removing spaces, dots, dashes, and underscores."""
    for key, value in row_dict.items():
        clean_key = re.sub(r'[\s_\-\.]', '', key).lower()
        if clean_key in target_variants:
            return value
    return None

def fetch_supabase_rows(table_name):
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_KEY')
    if not url or not key:
        return None
    
    clean_url = url.rstrip('/')
    rest_url = f"{clean_url}/rest/v1/{table_name}?select=*"
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    try:
        response = requests.get(rest_url, headers=headers, timeout=6)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Supabase HTTP {response.status_code} on {table_name}: {response.text}")
    except Exception as e:
        print(f"Supabase connection error on {table_name}: {e}")
    return None

# ═══════════════════════════════════════════════════════════════
# API ENDPOINTS — All data driven by the Supabase Nitaanth table
# Changes in the table auto-reflect on the frontend.
# ═══════════════════════════════════════════════════════════════

_nitaanth_cache = None

def fetch_nitaanth_rows():
    """Fetch all rows from the Nitaanth table, sorted by id.
    Returns a list of dicts with the exact Supabase column names:
      id, Projects, Research Papers, Social Links, Work Projects,
      Certfications (sic), Resume, Github Repo, Domain
    """
    global _nitaanth_cache
    url = os.environ.get('SUPABASE_URL', '').rstrip('/')
    key = os.environ.get('SUPABASE_KEY', '')
    if not url or not key:
        return None
    rest_url = f"{url}/rest/v1/Nitaanth?select=*&order=id.asc"
    headers = {"apikey": key, "Authorization": f"Bearer {key}"}
    try:
        resp = requests.get(rest_url, headers=headers, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            if data:
                _nitaanth_cache = data
                return data
    except Exception as e:
        print(f"Supabase Nitaanth fetch error: {e}")
    return _nitaanth_cache  # return stale cache on failure

FALLBACK_ROWS = [
    {"Projects": "https://moodsignal.onrender.com/", "Research Papers": "Research_paper_Nitaanth_House_of_Couton.pdf", "Social Links": "https://github.com/nitaanth-11", "Work Projects": "https://www.entrustlegal.in/", "Certfications": None, "Resume": None, "Github Repo": "https://github.com/nitaanth-11/MoodSignal", "Domain": "Finance"},
    {"Projects": "https://rakhtsetu-1.onrender.com", "Research Papers": "Xenotransplantation_research_paper.pdf", "Social Links": "https://www.linkedin.com/in/nitaanth-panickar-55043523a/", "Work Projects": "https://adv-jyoti.web.app/", "Certfications": None, "Resume": None, "Github Repo": "https://github.com/nitaanth-11/rakhtsetu", "Domain": "Medical & Supply Chain"},
    {"Projects": "https://project-apex-baip.onrender.com/", "Research Papers": None, "Social Links": "nitaanth.panickar@gmail.com", "Work Projects": None, "Certfications": None, "Resume": None, "Github Repo": "https://github.com/nitaanth-11/Project-Apex", "Domain": "Finance"},
    {"Projects": "https://genebridge-uroz.onrender.com", "Research Papers": None, "Social Links": None, "Work Projects": None, "Certfications": None, "Resume": None, "Github Repo": "https://github.com/nitaanth-11/GeneBridge", "Domain": "Medical Science"},
    {"Projects": "https://lorri.onrender.com/", "Research Papers": None, "Social Links": None, "Work Projects": None, "Certfications": None, "Resume": None, "Github Repo": "https://github.com/nitaanth-11/LoRRI", "Domain": "Logistics and Supply Chain"},
]

def get_nitaanth_data():
    """Returns Nitaanth rows from DB or fallback, always sorted by id."""
    rows = fetch_nitaanth_rows()
    return rows if rows else FALLBACK_ROWS

# ── HEALTH ────────────────────────────────────────────────────
@app.route('/api/health', methods=['GET'])
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Nitaanth Portfolio API"})

# ── PROJECTS ──────────────────────────────────────────────────
@app.route('/api/projects', methods=['GET'])
@app.route('/projects', methods=['GET'])
def get_projects():
    return jsonify(PROJECTS_FALLBACK)

# ── WORK ──────────────────────────────────────────────────────
@app.route('/api/work', methods=['GET'])
@app.route('/work', methods=['GET'])
def get_work():
    return jsonify(WORK_FALLBACK)

# ── RESEARCH ──────────────────────────────────────────────────
@app.route('/api/research', methods=['GET'])
@app.route('/research', methods=['GET'])
def get_research():
    return jsonify(RESEARCH_FALLBACK)

@app.route('/Research Papers/<path:filename>')
def serve_research_papers(filename):
    return send_from_directory('Research Papers', filename)

@app.route('/Certificates/<path:filename>')
def serve_certificates(filename):
    return send_from_directory('Certificates', filename)

# ── SOCIALS ───────────────────────────────────────────────────
@app.route('/api/socials', methods=['GET'])
@app.route('/socials', methods=['GET'])
def get_socials():
    nitaanth = get_nitaanth_data()
    github = "https://github.com/nitaanth-11"
    linkedin = "https://www.linkedin.com/in/nitaanth-panickar-55043523a/"
    email = "nitaanth.panickar@gmail.com"

    for row in nitaanth:
        sl = (row.get('Social Links') or '').strip()
        if not sl:
            continue
        if 'github.com' in sl:
            github = sl
        elif 'linkedin.com' in sl:
            linkedin = sl
        elif '@' in sl:
            email = sl

    return jsonify({"github": github, "linkedin": linkedin, "email": email})

# ── CERTIFICATIONS ────────────────────────────────────────────
@app.route('/api/certifications', methods=['GET'])
@app.route('/certifications', methods=['GET'])
def get_certifications():
    return jsonify(CERTIFICATIONS_FALLBACK)

# ── RESUME ────────────────────────────────────────────────────
@app.route('/api/resume', methods=['GET'])
@app.route('/resume', methods=['GET'])
def get_resume():
    nitaanth = get_nitaanth_data()
    # First row with a Resume link wins
    for row in nitaanth:
        resume_link = (row.get('Resume') or '').strip()
        if resume_link:
            return jsonify({"url": resume_link})
    return jsonify(RESUME)

@app.route('/api/contact', methods=['POST'])
@app.route('/contact', methods=['POST'])
def handle_contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')
    
    # Load SMTP settings from .env
    smtp_server = os.environ.get('SMTP_SERVER')
    smtp_port = os.environ.get('SMTP_PORT', '587')
    smtp_user = os.environ.get('SMTP_USERNAME')
    smtp_pass = os.environ.get('SMTP_PASSWORD')
    to_email = os.environ.get('TO_EMAIL') or smtp_user
    
    if not smtp_user or not smtp_pass:
        print("\n📧 Contact Form Submission (SMTP not configured in .env):")
        print(f"Name: {name}\nEmail: {email}\nSubject: {subject}\nMessage: {message}\n")
        return jsonify({
            "success": True, 
            "message": "Message logged to console (SMTP not configured in .env)."
        })
        
    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg['Subject'] = f"Portfolio Contact: {subject}"
        
        body = f"You received a new message from your portfolio contact form:\n\nName: {name}\nEmail: {email}\nSubject: {subject}\nMessage:\n{message}"
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server or 'smtp.gmail.com', int(smtp_port))
        server.starttls()
        server.login(smtp_user, smtp_pass)
        text = msg.as_string()
        server.sendmail(smtp_user, to_email, text)
        server.quit()
        
        return jsonify({"success": True, "message": "Email sent successfully!"})
    except Exception as e:
        print(f"SMTP Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# ═══════════════════════════════════════════════════════════════
# STATIC FILES SERVING (Fallback if accessed directly on port 5000)
# ═══════════════════════════════════════════════════════════════

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    print("Nitaanth's Portfolio Backend running on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
