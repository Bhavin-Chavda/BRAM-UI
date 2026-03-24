# BRAM · Gambling Investigative System

A professional React frontend for the **Behavioral Risk Analysis Module (BRAM)** — a forensic toolset for investigating online gambling platforms.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16.x
- **npm** ≥ 8.x
- BRAM backend running at `http://localhost:5000`

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

The app opens at **http://localhost:3000**.

---

## 📁 Project Structure

```
bram-system/
├── public/
│   └── index.html
├── src/
│   ├── App.js                    # Root component + routing + navbar
│   ├── index.js                  # Entry point
│   ├── context/
│   │   └── ToastContext.js       # Global notification system
│   ├── pages/
│   │   ├── Landing.js            # Overview / home page
│   │   ├── InvestigationForm.js  # Form with full validation
│   │   └── Reports.js            # Reports list + PDF viewer
│   └── styles/
│       └── global.css            # Full design system + theme
├── package.json
└── README.md
```

---

## 🌐 API Endpoints Expected

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `http://localhost:5000/bram-backend/investigate-url` | Submit a new investigation |
| `GET`  | `http://localhost:5000/bram-backend/getReports`      | Fetch all reports |
| `GET`  | `http://localhost:5000/bram-backend/reports/pdf?path=...` | Serve a PDF report file |

---

## 📋 Form Fields Reference

### Required
| Field | Type | Description |
|-------|------|-------------|
| `MERCHANT_URI` | string (URL) | Target site to investigate |
| `PAGE_LIMIT` | number | Max pages to crawl |
| `DEPTH_FROM_BASE_URL` | number | Link traversal depth |
| `RETRY_COUNTS` | number | Retries on failed requests |

### Optional
| Field | Type | Description |
|-------|------|-------------|
| `MAX_CRAWLING` | number | Total request cap |
| `MAX_WAIT_TIME` | number (ms) | Timeout per request |
| `CONCURRENT_WORKERS` | number | Parallel threads |
| `SCAN_TIMEOUT_SECONDS` | number | Session timeout |
| `ALLOW_SIGN_IN` | boolean | Flag: permit sign-in flows |
| `ALLOW_TEST_PAYMENT` | boolean | Flag: permit test payments |
| `ALERT_ON_SUSPICIOUS_LINKS` | boolean | Alert on suspicious findings |

---

## 🎨 Design

- **Theme**: Mastercard-inspired (deep navy + red/orange) × financial investigation terminal
- **Fonts**: Syne (headings) + DM Mono (data/code) + DM Sans (body)
- **Components**: Custom — no component library dependencies
- **Form**: React Hook Form with full validation
- **Routing**: React Router v6

---

## 🔧 Build for Production

```bash
npm run build
```

Outputs to `build/` — serve with any static file server.

---

## 📄 License

Internal use only — BRAM Investigative Division.
