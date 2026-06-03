import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { authLimiter } from './middleware/rateLimiter.middleware.js';

import authRoutes         from './routes/auth.routes.js';
import userRoutes         from './routes/user.routes.js';
import loanApplicationRoutes from './routes/loanApplication.routes.js';
import loanRoutes         from './routes/loan.routes.js';
import paymentRoutes      from './routes/payment.routes.js';
import documentRoutes     from './routes/document.routes.js';
import adminRoutes        from './routes/admin.routes.js';
import notificationRoutes from './routes/notification.routes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Initialise SQLite database + create all tables
initDB();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth',          authLimiter, authRoutes);
app.use('/api/v1/users',         userRoutes);
app.use('/api/v1/applications',  loanApplicationRoutes);
app.use('/api/v1/loans',         loanRoutes);
app.use('/api/v1/payments',      paymentRoutes);
app.use('/api/v1/documents',     documentRoutes);
app.use('/api/v1/admin',         adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.get('/api/v1/health', (_, res) => res.json({ status: 'ok', db: 'sqlite' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} | DB: SQLite`));

export default app;
