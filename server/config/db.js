import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH   = path.join(__dirname, '..', 'database.sqlite');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id              TEXT PRIMARY KEY,
      firstName       TEXT NOT NULL,
      lastName        TEXT NOT NULL,
      email           TEXT UNIQUE NOT NULL,
      password        TEXT NOT NULL,
      phone           TEXT NOT NULL,
      dateOfBirth     TEXT,
      address         TEXT DEFAULT '{}',
      employmentInfo  TEXT DEFAULT '{}',
      creditScore     INTEGER,
      role            TEXT DEFAULT 'customer',
      isVerified      INTEGER DEFAULT 0,
      isActive        INTEGER DEFAULT 1,
      avatar          TEXT,
      kycStatus       TEXT DEFAULT 'pending',
      refreshToken    TEXT,
      createdAt       TEXT DEFAULT (datetime('now')),
      updatedAt       TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS loan_applications (
      id                TEXT PRIMARY KEY,
      applicationNumber TEXT UNIQUE,
      applicantId       TEXT NOT NULL REFERENCES users(id),
      reviewedById      TEXT REFERENCES users(id),
      loanType          TEXT NOT NULL,
      loanDetails       TEXT NOT NULL DEFAULT '{}',
      financialSnapshot TEXT DEFAULT '{}',
      status            TEXT DEFAULT 'draft',
      statusHistory     TEXT DEFAULT '[]',
      approvalDetails   TEXT DEFAULT '{}',
      rejectionReason   TEXT,
      internalNotes     TEXT,
      documents         TEXT DEFAULT '[]',
      submittedAt       TEXT,
      createdAt         TEXT DEFAULT (datetime('now')),
      updatedAt         TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS loans (
      id                  TEXT PRIMARY KEY,
      loanNumber          TEXT UNIQUE,
      applicationId       TEXT NOT NULL REFERENCES loan_applications(id),
      borrowerId          TEXT NOT NULL REFERENCES users(id),
      loanType            TEXT,
      principalAmount     REAL NOT NULL,
      outstandingBalance  REAL NOT NULL,
      interestRate        REAL NOT NULL,
      tenure              INTEGER NOT NULL,
      emiAmount           REAL NOT NULL,
      processingFee       REAL DEFAULT 0,
      disbursementDate    TEXT NOT NULL,
      nextDueDate         TEXT NOT NULL,
      maturityDate        TEXT NOT NULL,
      lastPaymentDate     TEXT,
      status              TEXT DEFAULT 'active',
      repaymentSchedule   TEXT DEFAULT '[]',
      overdueAmount       REAL DEFAULT 0,
      totalPaid           REAL DEFAULT 0,
      payments            TEXT DEFAULT '[]',
      createdAt           TEXT DEFAULT (datetime('now')),
      updatedAt           TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payments (
      id               TEXT PRIMARY KEY,
      paymentReference TEXT UNIQUE,
      loanId           TEXT NOT NULL REFERENCES loans(id),
      borrowerId       TEXT NOT NULL REFERENCES users(id),
      amount           REAL NOT NULL,
      principalPaid    REAL,
      interestPaid     REAL,
      lateFee          REAL DEFAULT 0,
      paymentMethod    TEXT,
      transactionId    TEXT,
      bankReference    TEXT,
      status           TEXT DEFAULT 'pending',
      installmentsCovered TEXT DEFAULT '[]',
      remarks          TEXT,
      createdAt        TEXT DEFAULT (datetime('now')),
      updatedAt        TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id                  TEXT PRIMARY KEY,
      ownerId             TEXT NOT NULL REFERENCES users(id),
      applicationId       TEXT REFERENCES loan_applications(id),
      documentType        TEXT,
      documentName        TEXT NOT NULL,
      description         TEXT,
      fileUrl             TEXT NOT NULL,
      fileName            TEXT,
      fileType            TEXT,
      fileSize            INTEGER,
      verificationStatus  TEXT DEFAULT 'pending',
      verifiedById        TEXT REFERENCES users(id),
      rejectionNote       TEXT,
      createdAt           TEXT DEFAULT (datetime('now')),
      updatedAt           TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id          TEXT PRIMARY KEY,
      recipientId TEXT NOT NULL REFERENCES users(id),
      type        TEXT,
      title       TEXT NOT NULL,
      message     TEXT NOT NULL,
      link        TEXT,
      isRead      INTEGER DEFAULT 0,
      createdAt   TEXT DEFAULT (datetime('now'))
    );
  `);

  console.log('SQLite database ready:', DB_PATH);
};

export default db;
