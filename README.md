# Premier Bank — 3D Loan Management System

> A realistic, luxury-themed full-stack web application for bank loan management with immersive 3D animations, interactive UI, and a rich gold-navy design system.

**Loan Types Supported:** Personal · Home · Auto · Other

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite 5 |
| 3D Engine | React Three Fiber (R3F) v8 + Three.js r165 + Drei |
| Animation | GSAP 3 (ScrollTrigger) + Framer Motion 11 |
| Styling | Tailwind CSS v3 + CSS Custom Properties |
| State Management | Zustand |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Forms + Validation | React Hook Form + Zod |
| Charts | Recharts |
| Backend | Node.js 20 LTS + Express.js 4 |
| Database | MongoDB Atlas + Mongoose 8 |
| Auth | JWT (access + refresh tokens) + bcryptjs |
| File Uploads | Multer + Cloudinary |
| Email | Nodemailer |
| Caching / Token Blacklist | Redis (ioredis) |
| Security | helmet, cors, express-rate-limit, express-mongo-sanitize |

---

## Color Palette & Design System

### Luxury Bank Theme — CSS Custom Properties

```css
:root {
  /* Backgrounds */
  --color-obsidian:      #0A0A0F;   /* deepest background */
  --color-navy-deep:     #050B1A;   /* section backgrounds */
  --color-navy-mid:      #0D1B3E;   /* card backgrounds */
  --color-navy-light:    #1A2D5A;   /* elevated surfaces */

  /* Gold Accent System */
  --color-gold-primary:  #C9A84C;   /* primary CTAs, headings */
  --color-gold-bright:   #F0C040;   /* hover states, accents */
  --color-gold-pale:     #E8D5A3;   /* secondary text highlights */
  --color-gold-dark:     #8B6914;   /* shadows, depth */

  /* Text */
  --color-platinum:      #E8E8F0;   /* primary body text */
  --color-silver:        #A8A8C0;   /* secondary text */
  --color-muted:         #5A5A7A;   /* disabled, placeholders */

  /* Status Colors */
  --color-emerald:       #0F7B5E;   /* approved/success */
  --color-ruby:          #8B1A2E;   /* rejected/error */
  --color-sapphire:      #1A4B8B;   /* info states */
  --color-amber:         #B8860B;   /* pending states */

  /* Glassmorphism */
  --color-glass-bg:      rgba(13, 27, 62, 0.6);
  --color-glass-border:  rgba(201, 168, 76, 0.2);

  /* Typography */
  --font-display:        'Playfair Display', serif;
  --font-heading:        'Cormorant Garamond', serif;
  --font-body:           'Inter', sans-serif;
  --font-mono:           'JetBrains Mono', monospace;

  /* Radius */
  --radius-sharp:        2px;
  --radius-card:         8px;
  --radius-modal:        16px;
  --radius-pill:         9999px;

  /* Transitions */
  --ease-luxury:         cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --duration-normal:     0.4s;
}
```

### Background Images Required — place in `client/public/images/`

| File | Description | Suggested Search |
|---|---|---|
| `hero-bg.jpg` | Luxury bank interior, marble floor, gold columns | "luxury bank interior marble" |
| `about-bg.jpg` | Classic bank exterior architecture | "neoclassical bank building exterior" |
| `loan-personal-bg.jpg` | Professional lifestyle / business person | "professional businessman luxury office" |
| `loan-home-bg.jpg` | Elegant luxury home exterior | "luxury house mansion exterior" |
| `loan-auto-bg.jpg` | Luxury car on scenic road | "luxury car road cinematic" |
| `loan-other-bg.jpg` | Abstract financial concept | "city skyline finance abstract gold" |
| `testimonial-bg.jpg` | Warm blurred luxury interior bokeh | "luxury interior bokeh warm" |

> Use Unsplash (unsplash.com) or Pexels (pexels.com) — both free for commercial use.
> Recommended resolution: 2560×1440 for hero, 1920×1080 for sections.

### 3D Model Files Required — place in `client/public/models/`

| File | Description | Source |
|---|---|---|
| `vault_door.glb` | Bank vault door, metallic PBR materials | Sketchfab (free license) |
| `gold_coin.glb` | Single gold coin for physics clones | Sketchfab / generate in Blender |
| `bank_building.glb` | Stylized bank building (optional, About page) | Sketchfab / generate in Blender |

### HDRI Environment Map — place in `client/public/hdri/`

| File | Source |
|---|---|
| `luxury_interior.hdr` | Poly Haven (polyhaven.com) — free, search "interior" |

---

## Pages & Features

### Public Pages (No Login Required)

| Page | Route | Key 3D Element |
|---|---|---|
| Home / Landing | `/` | VaultScene hero + FloatingCards + GoldCounter |
| About | `/about` | TimelinePath3D bank history |
| Loan Products | `/loans` | FloatingCards3D per loan type |
| Loan Calculator | `/calculator` | DonutChart3D principal vs interest |
| Contact | `/contact` | Atmospheric background |
| Login | `/login` | AtmosphericBg + wireframe shapes |
| Register | `/register` | AtmosphericBg + multi-step progress ring |

### Customer Portal (Login Required)

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | ParticleNetwork bg, loan summary cards, quick actions |
| Apply for Loan | `/apply` | Multi-step wizard: type → details → docs → review |
| My Applications | `/applications` | Status list with ApplicationTrack3D timeline |
| Active Loans | `/loans/active` | Loan cards, repayment schedule, Recharts |
| Make Payment | `/payments/new` | Payment form + transaction history |
| Documents | `/documents` | Drag-and-drop upload |
| Profile | `/profile` | Personal info, KYC status, password change |
| Notifications | `/notifications` | Status update feed |

### Admin / Bank Officer Portal

| Page | Route | Description |
|---|---|---|
| Admin Dashboard | `/admin` | Portfolio stats, pending queue counts |
| All Applications | `/admin/applications` | Filterable table, bulk actions |
| Application Review | `/admin/applications/:id` | Approve / Reject / Request Docs |
| Loan Portfolio | `/admin/loans` | Active loans, overdue tracking |
| User Management | `/admin/users` | Customer list, KYC verification |
| Reports | `/admin/reports` | Recharts analytics, CSV export |

---

## 3D Scenes — Full Specification

### Scene 1 — VaultScene (Hero Section)
**File:** `client/src/components/three/VaultScene.jsx`

- Large golden vault door with PBR metallic material (`metalness: 0.9, roughness: 0.1`)
- Spinning combination dial rotating on Y-axis at constant speed
- `GoldCoins.jsx` — 20 physics-enabled coins falling with `@react-three/cannon`
- Floating currency symbols (£ $ €) as `<Text3D>` from Drei, drifting upward in a loop
- GSAP ScrollTrigger: vault door swings open (`rotation.y` 0 → `Math.PI/2`) when user scrolls past 200px
- Environment: `<Environment preset="city" />` from Drei for reflections

### Scene 2 — FloatingCards3D (Loan Products)
**File:** `client/src/components/three/FloatingCards3D.jsx`

- 4 card meshes in a row with `MeshPhysicalMaterial` (transmission: 0.5 for glass effect)
- Slow idle Y-axis rotation via `useFrame` sin wave
- On hover: scale up to 1.15, emissive gold glow effect
- Card accent colors: Personal=`#C9A84C`, Home=`#1A4B8B`, Auto=`#0F7B5E`, Other=`#8B1A2E`
- Card labels using `<Text>` from Drei

### Scene 3 — ParticleNetwork (Dashboard Background)
**File:** `client/src/components/three/ParticleNetwork.jsx`

- 500 gold-colored point particles using `<Points>` + `PointsMaterial`
- `useFrame` slowly drifts particles, `<Line>` from Drei draws connections between nearby nodes
- Mouse move event: nearby particles are gently repelled (vec3 distance check)

### Scene 4 — GoldCounter3D (Stats Section)
**File:** `client/src/components/three/GoldCounter3D.jsx`

- `<Text3D>` with `MeshStandardMaterial` (`metalness: 1`, `roughness: 0.2`)
- Number counts up via `useEffect` + `useState` triggered by IntersectionObserver
- Subtle Y-axis rotation idle animation

### Scene 5 — TimelinePath3D (How It Works)
**File:** `client/src/components/three/TimelinePath3D.jsx`

- `CatmullRomCurve3` path rendered as a glowing TubeGeometry
- Numbered sphere nodes at each step with pulsing `PointLight`
- GSAP ScrollTrigger: camera position follows the CatmullRomCurve3 path as user scrolls
- Camera interpolation via `useFrame` + GSAP-driven `t` value

### Scene 6 — DonutChart3D (Calculator)
**File:** `client/src/components/three/DonutChart3D.jsx`

- Custom `TorusGeometry` split into 2 arc segments: principal (gold) vs interest (sapphire)
- `useSpring` from `@react-spring/three` for smooth morph when EMI inputs change
- Hover: segment extrudes on Z-axis with smooth lerp

### Scene 7 — AtmosphericBg (Login / Register)
**File:** `client/src/components/three/AtmosphericBg.jsx`

- Deep dark background (`#050B1A`)
- 8 wireframe geometries: OctahedronGeometry, IcosahedronGeometry, DodecahedronGeometry
- `MeshBasicMaterial` with `wireframe: true`, gold color, opacity 0.3
- Each shape rotates on all 3 axes at different speeds via `useFrame`
- Soft fog: `<fog attach="fog" args={['#050B1A', 10, 50]} />`

### Scene 8 — ApplicationTrack3D (Status Progress)
**File:** `client/src/components/three/ApplicationTrack3D.jsx`

- Vertical TubeGeometry track from bottom to top of canvas
- 5 station spheres: Submitted → Under Review → Docs Required → Approved → Disbursed
- Capsule mesh slides to current station position via `useSpring`
- Past stations emit gold `PointLight`, future stations are dim silver

---

## Complete File & Folder Structure

```
loan-management-system/
├── .gitignore
├── README.md
├── package.json                          ← workspace root (concurrently)
│
├── client/                               ← React + Vite Frontend
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── package.json
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── fonts/                        ← Google Fonts: Playfair Display, Cormorant Garamond, Inter, JetBrains Mono
│   │   ├── images/                       ← Background images (list above)
│   │   ├── models/                       ← .glb 3D models (list above)
│   │   └── hdri/
│   │       └── luxury_interior.hdr       ← Poly Haven HDRI
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css                     ← Global CSS + all custom properties
│       │
│       ├── config/
│       │   ├── constants.js              ← API base URL, loan types, interest rates
│       │   └── theme.js                  ← Design token object for use in JS/JSX
│       │
│       ├── store/
│       │   ├── authStore.js              ← Zustand: user auth state + tokens
│       │   ├── loanStore.js              ← Zustand: loan applications list
│       │   └── uiStore.js                ← Zustand: modals, sidebar open state
│       │
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useScrollAnimation.js     ← GSAP ScrollTrigger wrapper
│       │   ├── useThreeScene.js
│       │   └── useWindowSize.js
│       │
│       ├── utils/
│       │   ├── api.js                    ← Axios instance + JWT interceptors
│       │   ├── formatters.js             ← currency, date, percentage formatters
│       │   ├── validators.js             ← Zod schemas
│       │   └── loanCalculator.js         ← EMI formula + amortization schedule
│       │
│       ├── components/
│       │   ├── ui/                       ← Reusable base components
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Select.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Badge.jsx
│       │   │   ├── Spinner.jsx
│       │   │   ├── ProgressBar.jsx
│       │   │   ├── Table.jsx
│       │   │   ├── Tooltip.jsx
│       │   │   └── FileUpload.jsx
│       │   │
│       │   ├── layout/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── Sidebar.jsx           ← Admin + customer dashboard sidebar
│       │   │   ├── DashboardLayout.jsx
│       │   │   └── PublicLayout.jsx
│       │   │
│       │   ├── three/                    ← ALL React Three Fiber / 3D components
│       │   │   ├── VaultScene.jsx
│       │   │   ├── FloatingCards3D.jsx
│       │   │   ├── ParticleNetwork.jsx
│       │   │   ├── GoldCounter3D.jsx
│       │   │   ├── TimelinePath3D.jsx
│       │   │   ├── DonutChart3D.jsx
│       │   │   ├── AtmosphericBg.jsx
│       │   │   ├── ApplicationTrack3D.jsx
│       │   │   ├── GoldCoins.jsx
│       │   │   ├── WireframeGeometry.jsx
│       │   │   └── EnvironmentSetup.jsx
│       │   │
│       │   ├── sections/                 ← Public homepage section components
│       │   │   ├── HeroSection.jsx
│       │   │   ├── StatsSection.jsx
│       │   │   ├── LoanProductsSection.jsx
│       │   │   ├── HowItWorksSection.jsx
│       │   │   ├── CalculatorSection.jsx
│       │   │   ├── TestimonialsSection.jsx
│       │   │   ├── CTASection.jsx
│       │   │   └── ContactSection.jsx
│       │   │
│       │   ├── dashboard/                ← Customer portal components
│       │   │   ├── LoanSummaryCard.jsx
│       │   │   ├── RecentActivity.jsx
│       │   │   ├── QuickActions.jsx
│       │   │   ├── RepaymentChart.jsx
│       │   │   └── NotificationPanel.jsx
│       │   │
│       │   └── admin/                    ← Admin-only components
│       │       ├── ApplicationTable.jsx
│       │       ├── ReviewPanel.jsx
│       │       ├── PortfolioStats.jsx
│       │       └── UserTable.jsx
│       │
│       ├── pages/
│       │   ├── public/
│       │   │   ├── HomePage.jsx
│       │   │   ├── AboutPage.jsx
│       │   │   ├── LoanProductsPage.jsx
│       │   │   ├── ContactPage.jsx
│       │   │   ├── LoginPage.jsx
│       │   │   └── RegisterPage.jsx
│       │   │
│       │   ├── customer/
│       │   │   ├── DashboardPage.jsx
│       │   │   ├── ApplyLoanPage.jsx
│       │   │   ├── MyApplicationsPage.jsx
│       │   │   ├── ActiveLoansPage.jsx
│       │   │   ├── PaymentPage.jsx
│       │   │   ├── DocumentsPage.jsx
│       │   │   ├── ProfilePage.jsx
│       │   │   └── NotificationsPage.jsx
│       │   │
│       │   └── admin/
│       │       ├── AdminDashboardPage.jsx
│       │       ├── AllApplicationsPage.jsx
│       │       ├── ApplicationDetailPage.jsx
│       │       ├── ActiveLoansAdminPage.jsx
│       │       ├── UserManagementPage.jsx
│       │       └── ReportsPage.jsx
│       │
│       └── routes/
│           ├── AppRouter.jsx
│           ├── ProtectedRoute.jsx        ← Redirects to /login if not authenticated
│           └── AdminRoute.jsx            ← Redirects if role !== 'admin'
│
└── server/                               ← Node.js + Express Backend
    ├── .env.example
    ├── package.json
    ├── server.js                         ← Express entry point, all middleware + route mounting
    │
    ├── config/
    │   ├── db.js                         ← MongoDB Atlas connection with retry logic
    │   ├── cloudinary.js
    │   ├── redis.js
    │   └── constants.js
    │
    ├── models/
    │   ├── User.model.js
    │   ├── LoanApplication.model.js      ← Most complex schema — drives entire workflow
    │   ├── Loan.model.js
    │   ├── Payment.model.js
    │   ├── Document.model.js
    │   └── Notification.model.js
    │
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── loanApplication.controller.js
    │   ├── loan.controller.js
    │   ├── payment.controller.js
    │   ├── document.controller.js
    │   ├── admin.controller.js
    │   └── notification.controller.js
    │
    ├── routes/
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── loanApplication.routes.js
    │   ├── loan.routes.js
    │   ├── payment.routes.js
    │   ├── document.routes.js
    │   ├── admin.routes.js
    │   └── notification.routes.js
    │
    ├── middleware/
    │   ├── auth.middleware.js            ← JWT verify, attach req.user
    │   ├── admin.middleware.js           ← Role check: admin / officer
    │   ├── validate.middleware.js        ← Joi schema validation wrapper
    │   ├── upload.middleware.js          ← Multer memory storage config
    │   ├── errorHandler.middleware.js    ← Global error handler
    │   └── rateLimiter.middleware.js
    │
    ├── services/
    │   ├── email.service.js              ← Nodemailer HTML email templates
    │   ├── loan.service.js               ← EMI calculation + amortization schedule
    │   ├── notification.service.js
    │   └── cloudinary.service.js
    │
    ├── validators/
    │   ├── auth.validator.js
    │   ├── loanApplication.validator.js
    │   └── payment.validator.js
    │
    ├── scripts/
    │   └── seedAdmin.js                  ← One-time script to create first admin user
    │
    └── utils/
        ├── ApiResponse.js                ← Standardized success response class
        ├── ApiError.js                   ← Custom error class with statusCode
        └── generateToken.js             ← JWT access + refresh token generator
```

---

## Database Schemas (MongoDB / Mongoose)

### User Model — `server/models/User.model.js`

```javascript
{
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, select: false },
  phone:        { type: String, required: true },
  dateOfBirth:  Date,
  address: {
    street: String, city: String, state: String,
    zipCode: String, country: { type: String, default: 'US' }
  },
  employmentInfo: {
    status:        { type: String, enum: ['employed','self-employed','unemployed','retired'] },
    employerName:  String,
    annualIncome:  Number,
    yearsEmployed: Number
  },
  creditScore:  { type: Number, min: 300, max: 850 },
  role:         { type: String, enum: ['customer','admin','officer'], default: 'customer' },
  isVerified:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  avatar:       String,                    // Cloudinary secure URL
  kycStatus:    { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
  refreshToken: { type: String, select: false }
}
```

### LoanApplication Model — `server/models/LoanApplication.model.js`

```javascript
{
  applicationNumber: { type: String, unique: true },  // APP-2024-XXXXX (auto-generated)
  applicant:   { type: ObjectId, ref: 'User', required: true },
  reviewedBy:  { type: ObjectId, ref: 'User' },
  loanType:    { type: String, enum: ['personal','home','auto','other'], required: true },

  loanDetails: {
    requestedAmount:  { type: Number, required: true },
    requestedTenure:  { type: Number, required: true },   // months
    purpose:          { type: String, required: true },
    collateral:       String,
    propertyAddress:  String,    // home loans
    vehicleMake:      String,    // auto loans
    vehicleModel:     String,
    vehicleYear:      Number
  },

  financialSnapshot: {
    declaredIncome: Number, existingLoans: Number,
    monthlyExpenses: Number, creditScore: Number
  },

  status: {
    type: String,
    enum: ['draft','submitted','under_review','docs_required',
           'approved','rejected','disbursed','cancelled'],
    default: 'draft'
  },

  statusHistory: [{
    status: String, changedBy: { type: ObjectId, ref: 'User' },
    note: String, timestamp: { type: Date, default: Date.now }
  }],

  approvalDetails: {
    approvedAmount: Number, approvedTenure: Number,
    interestRate: Number, processingFee: Number,
    conditions: [String], approvedAt: Date
  },

  rejectionReason: String, internalNotes: String,
  documents: [{ type: ObjectId, ref: 'Document' }]
}
```

### Loan Model — `server/models/Loan.model.js`

```javascript
{
  loanNumber:         { type: String, unique: true },  // LN-2024-XXXXX
  application:        { type: ObjectId, ref: 'LoanApplication', required: true },
  borrower:           { type: ObjectId, ref: 'User', required: true },
  loanType:           { type: String, enum: ['personal','home','auto','other'] },
  principalAmount:    { type: Number, required: true },
  outstandingBalance: { type: Number, required: true },
  interestRate:       { type: Number, required: true },   // annual %
  tenure:             { type: Number, required: true },   // months
  emiAmount:          { type: Number, required: true },
  processingFee:      { type: Number, default: 0 },
  disbursementDate:   { type: Date, required: true },
  nextDueDate:        { type: Date, required: true },
  maturityDate:       { type: Date, required: true },
  lastPaymentDate:    Date,
  status:             { type: String, enum: ['active','closed','defaulted','foreclosed'], default: 'active' },

  repaymentSchedule: [{
    installmentNo: Number, dueDate: Date,
    emiAmount: Number, principal: Number, interest: Number, balance: Number,
    status: { type: String, enum: ['pending','paid','overdue'], default: 'pending' },
    paidDate: Date, paidAmount: Number
  }],

  overdueAmount: { type: Number, default: 0 },
  totalPaid:     { type: Number, default: 0 },
  payments:      [{ type: ObjectId, ref: 'Payment' }]
}
```

### Payment Model — `server/models/Payment.model.js`

```javascript
{
  paymentReference: { type: String, unique: true },  // PAY-2024-XXXXX
  loan:     { type: ObjectId, ref: 'Loan', required: true },
  borrower: { type: ObjectId, ref: 'User', required: true },
  amount: Number, principalPaid: Number, interestPaid: Number,
  lateFee: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['bank_transfer','card','upi','check'] },
  transactionId: String, bankReference: String,
  status: { type: String, enum: ['pending','processing','completed','failed','reversed'], default: 'pending' },
  installmentsCovered: [Number], remarks: String
}
```

### Document Model — `server/models/Document.model.js`

```javascript
{
  owner:       { type: ObjectId, ref: 'User', required: true },
  application: { type: ObjectId, ref: 'LoanApplication' },
  documentType: {
    type: String,
    enum: ['identity','address_proof','income_proof','bank_statement',
           'property_document','vehicle_document','tax_return','other']
  },
  documentName: String, description: String,
  fileUrl:    String,  // Cloudinary secure URL
  publicId:   String,  // Cloudinary public_id (for deletion)
  fileType:   String,  // MIME type
  fileSize:   Number,  // bytes
  verificationStatus: { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
  verifiedBy: { type: ObjectId, ref: 'User' },
  rejectionNote: String
}
```

### Notification Model — `server/models/Notification.model.js`

```javascript
{
  recipient: { type: ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['application_submitted','application_approved','application_rejected',
           'docs_required','loan_disbursed','payment_due','payment_received',
           'payment_overdue','system']
  },
  title: String, message: String, link: String,
  isRead: { type: Boolean, default: false }
}
```

---

## API Endpoints

### Auth — `/api/v1/auth`

```
POST   /register               Create customer account
POST   /login                  Returns JWT access + refresh token (httpOnly cookie)
POST   /logout                 Blacklist refresh token in Redis
POST   /refresh-token          Exchange refresh token for new access token
POST   /forgot-password        Send password reset email
POST   /reset-password/:token  Set new password via reset token
GET    /verify-email/:token    Confirm email address
```

### Users — `/api/v1/users`

```
GET    /me              Get own profile                  [AUTH]
PUT    /me              Update own profile               [AUTH]
PUT    /me/password     Change password                  [AUTH]
PUT    /me/avatar       Upload profile picture           [AUTH + Multer]
DELETE /me              Deactivate account               [AUTH]
```

### Applications — `/api/v1/applications`

```
POST   /                Create new draft application     [AUTH]
GET    /                List own applications            [AUTH]
GET    /:id             Get application detail           [AUTH]
PUT    /:id             Update draft application         [AUTH]
POST   /:id/submit      Submit draft for review          [AUTH]
DELETE /:id             Cancel draft application         [AUTH]
GET    /:id/status-history  Status change timeline       [AUTH]
```

### Loans — `/api/v1/loans`

```
GET    /                List own active loans            [AUTH]
GET    /:id             Loan detail + repayment schedule [AUTH]
GET    /:id/schedule    Full amortization schedule       [AUTH]
GET    /:id/payments    Payment history for a loan       [AUTH]
```

### Payments — `/api/v1/payments`

```
POST   /                Initiate payment                 [AUTH]
GET    /                All payments by current user     [AUTH]
GET    /:id             Single payment receipt           [AUTH]
POST   /:id/confirm     Mark payment completed           [AUTH]
```

### Documents — `/api/v1/documents`

```
POST   /upload              Upload document file         [AUTH + Multer]
GET    /                    List own documents           [AUTH]
GET    /:id                 Get document metadata        [AUTH]
DELETE /:id                 Delete document              [AUTH]
POST   /:appId/attach/:docId  Attach doc to application  [AUTH]
```

### Admin — `/api/v1/admin`

```
GET    /dashboard                    Stats overview                     [ADMIN]
GET    /applications                 All applications with filters      [ADMIN]
GET    /applications/:id             Full application detail            [ADMIN]
PUT    /applications/:id/approve     Approve with terms                 [ADMIN]
PUT    /applications/:id/reject      Reject with reason                 [ADMIN]
PUT    /applications/:id/request-docs  Flag docs needed                 [ADMIN]
POST   /applications/:id/disburse   Create Loan from Application        [ADMIN]
GET    /loans                        All active loans                   [ADMIN]
GET    /loans/:id                    Loan detail                        [ADMIN]
PUT    /loans/:id/status             Update loan status                 [ADMIN]
GET    /users                        All users                          [ADMIN]
GET    /users/:id                    User detail + loan history         [ADMIN]
PUT    /users/:id/kyc                Verify/reject KYC                  [ADMIN]
PUT    /users/:id/role               Change user role                   [ADMIN]
PUT    /documents/:id/verify         Approve/reject document            [ADMIN]
GET    /reports/summary              Aggregate financial reports        [ADMIN]
```

### Notifications — `/api/v1/notifications`

```
GET    /              List notifications for current user  [AUTH]
PUT    /:id/read      Mark one notification as read        [AUTH]
PUT    /read-all      Mark all as read                     [AUTH]
DELETE /:id           Delete notification                  [AUTH]
```

---

## Environment Variables

### `server/.env` (copy from `server/.env.example`)

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/loandb

# JWT — generate strong random strings (64+ chars)
JWT_SECRET=<random_64_char_string>
JWT_REFRESH_SECRET=<different_random_64_char_string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (free account at cloudinary.com)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Redis (local: redis://localhost:6379 | cloud: Upstash URL)
REDIS_URL=redis://localhost:6379

# Email (Gmail App Password recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# CORS
CLIENT_URL=http://localhost:5173
```

### `client/.env` (copy from `client/.env.example`)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Premier Bank
```

---

## Key Dependency Lists

### `client/package.json`

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.112.0",
    "@react-three/cannon": "^6.6.0",
    "@react-three/postprocessing": "^2.16.3",
    "three": "^0.167.0",
    "gsap": "^3.12.5",
    "framer-motion": "^11.3.0",
    "zustand": "^4.5.4",
    "axios": "^1.7.3",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.8",
    "recharts": "^2.12.7",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.408.0",
    "date-fns": "^3.6.0",
    "cannon-es": "^0.20.0"
  },
  "devDependencies": {
    "vite": "^5.3.4",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.6",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40",
    "eslint": "^9.8.0"
  }
}
```

### `server/package.json`

```json
{
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.5.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^2.4.0",
    "multer-storage-cloudinary": "^4.0.0",
    "nodemailer": "^6.9.14",
    "joi": "^17.13.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.3.1",
    "express-mongo-sanitize": "^2.2.0",
    "dotenv": "^16.4.5",
    "ioredis": "^5.4.1",
    "morgan": "^1.10.0",
    "uuid": "^10.0.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

### Root `package.json`

```json
{
  "name": "loan-management-system",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "cd client && npm run build",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

---

## EMI Formula — Use in Both Client and Server

```javascript
// File: client/src/utils/loanCalculator.js  AND  server/services/loan.service.js

function calculateEMI(P, annualRate, n) {
  // P = principal, annualRate = annual interest %, n = tenure in months
  const r = annualRate / 12 / 100;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
}

function generateAmortizationSchedule(P, annualRate, n, disbursementDate) {
  const r = annualRate / 12 / 100;
  const emi = calculateEMI(P, annualRate, n);
  let balance = P;
  const schedule = [];

  for (let i = 1; i <= n; i++) {
    const interest  = Math.round(balance * r * 100) / 100;
    const principal = Math.round((emi - interest) * 100) / 100;
    balance         = Math.round((balance - principal) * 100) / 100;

    schedule.push({
      installmentNo: i,
      dueDate:       addMonths(disbursementDate, i),   // use date-fns addMonths
      emiAmount:     emi,
      principal,
      interest,
      balance:       Math.max(0, balance),
      status:        'pending'
    });
  }
  return schedule;
}
```

### Default Interest Rate Ranges

| Loan Type | Min Rate | Max Rate |
|---|---|---|
| Personal | 10.5% p.a. | 18.0% p.a. |
| Home | 7.5% p.a. | 11.0% p.a. |
| Auto | 8.5% p.a. | 14.0% p.a. |
| Other | 12.0% p.a. | 20.0% p.a. |

---

## Security Architecture

### JWT Auth Flow
- **Access token:** 15-minute expiry — stored in **Zustand memory only** (never in localStorage or cookies)
- **Refresh token:** 7-day expiry — stored in **httpOnly cookie** (inaccessible to JavaScript)
- **Silent refresh:** Axios interceptor catches 401, calls `/refresh-token`, retries the original request
- **Logout:** Refresh token is blacklisted in Redis with TTL matching its remaining expiry time

### File Upload Security
- Multer stores to **memory buffer** (never writes to disk)
- Streamed directly to Cloudinary via `multer-storage-cloudinary`
- Cloudinary folder path: `loan-mgmt/{userId}/documents/{documentType}/`
- Max file size: **10 MB**
- Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`, `application/msword`
- Store `publicId` in Document model for clean deletion via `cloudinary.uploader.destroy()`

### Backend Hardening
- `helmet` — sets secure HTTP headers
- `express-mongo-sanitize` — prevents NoSQL injection
- `express-rate-limit` — 100 requests / 15 min per IP on auth routes
- `cors` — only allows `CLIENT_URL` origin
- All passwords hashed with `bcryptjs` (salt rounds: 12)
- Joi validation on all request bodies before reaching controllers

---

## Architecture Notes for AI Implementation

1. **3D Performance:** Wrap every `<Canvas>` in `<Suspense fallback={<SkeletonLoader />}>`. Use `React.lazy()` for all 3D-heavy pages so they don't block initial load. Cap pixel ratio: `dpr={[1, 2]}` on the Canvas.

2. **Three.js Error Boundaries:** Wrap all `<Canvas>` elements in a `class ErrorBoundary extends React.Component` — WebGL errors are silent otherwise and can break the entire page.

3. **Vite Dev Proxy** (eliminates CORS issues in development):
   ```javascript
   // vite.config.js
   export default defineConfig({
     server: { proxy: { '/api': 'http://localhost:5000' } }
   })
   ```

4. **Auto-generated IDs:** Use Mongoose `pre('save')` middleware + a `Counter` collection (or UUID prefix) to generate `APP-YYYY-NNNNN`, `LN-YYYY-NNNNN`, `PAY-YYYY-NNNNN` reference numbers.

5. **Admin Seeding:** Create `server/scripts/seedAdmin.js` to create the first admin user. **Never expose an open admin registration route** in the API.

6. **Route Guards:**
   - `ProtectedRoute.jsx` — checks `authStore.isAuthenticated`, redirects to `/login` if false
   - `AdminRoute.jsx` — additionally checks `authStore.user.role === 'admin' || 'officer'`

7. **Disbursement Flow:** When admin calls `POST /admin/applications/:id/disburse`:
   - Change application status to `disbursed`
   - Auto-create a new `Loan` document
   - Generate full `repaymentSchedule` array using `loan.service.js`
   - Create a `loan_disbursed` notification for the borrower
   - Send disbursement email via `email.service.js`

8. **Scroll Animations Pattern:** Use a `useScrollAnimation` hook wrapping GSAP ScrollTrigger. Register the plugin in `main.jsx` once: `gsap.registerPlugin(ScrollTrigger)`.

---

## Getting Started

### Prerequisites

- Node.js 20 LTS — [nodejs.org](https://nodejs.org)
- MongoDB Atlas — [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- Cloudinary account — [cloudinary.com](https://cloudinary.com) (free tier)
- Redis — local via Docker: `docker run -d -p 6379:6379 redis` OR use [Upstash](https://upstash.com) (free)
- Git — [git-scm.com](https://git-scm.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/loan-management-system.git
cd loan-management-system

# 2. Install all dependencies (root + client + server)
npm run install:all

# 3. Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit both .env files and fill in your credentials

# 4. Seed the admin user (first time only)
cd server && node scripts/seedAdmin.js

# 5. Start the development server (frontend + backend simultaneously)
cd ..
npm run dev
```

After starting:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1
- **Admin Login:** Use the credentials you set in `seedAdmin.js`

---

## Implementation Phases

| Phase | Scope | Estimated Days |
|---|---|---|
| 1 | Project scaffolding, git init, Tailwind config, Vite proxy | 1 |
| 2 | Express server, all MongoDB models, auth routes + JWT | 2–3 |
| 3 | Loan application CRUD, admin endpoints, payments, file upload | 4–5 |
| 4 | React routing, Zustand stores, Axios instance, base UI components | 6–7 |
| 5 | All 8 Three.js/R3F scenes (VaultScene, ParticleNetwork, etc.) | 8–10 |
| 6 | Public pages: Home, About, Loan Products, Calculator, Contact | 11–13 |
| 7 | Auth pages: Login, Register, Forgot/Reset Password | 14 |
| 8 | Customer portal: Dashboard, Apply Wizard, Loans, Payments, Docs | 15–17 |
| 9 | Admin portal: Dashboard, Review, Reports, User Management | 18–20 |
| 10 | GSAP scroll animations, responsive design, performance, accessibility | 21–23 |
| 11 | Final cleanup, screenshots for README, GitHub push, tag v1.0.0 | 24 |

---

## GitHub Setup

### Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial project structure and requirements"
git branch -M main
git remote add origin https://github.com/<your-username>/loan-management-system.git
git push -u origin main
```

### `.gitignore` (root)

```
node_modules/
*/node_modules/
.env
.env.local
.env.production
server/.env
client/.env
client/dist/
*.log
logs/
.DS_Store
Thumbs.db
.vscode/settings.json
.idea/
server/uploads/
.cache/
.eslintcache
```

---

*Document Version: 1.0 — Premier Bank Loan Management System*
*Last Updated: 2026-06-03*
