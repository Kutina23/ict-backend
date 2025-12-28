"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../src/config/database");
require("../src/models/index");
const auth_1 = __importDefault(require("../src/routes/auth"));
const admin_1 = __importDefault(require("../src/routes/admin"));
const student_1 = __importDefault(require("../src/routes/student"));
const hod_1 = __importDefault(require("../src/routes/hod"));
const events_1 = __importDefault(require("../src/routes/events"));
const public_1 = __importDefault(require("../src/routes/public"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../public')));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/student', student_1.default);
app.use('/api/hod', hod_1.default);
app.use('/api/events', events_1.default);
app.use('/api', public_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});
// Database connection - test connection on startup
(async () => {
    try {
        console.log('Attempting to connect to database...');
        console.log('Database URL:', `mysql://${process.env.DB_USER}:****@${process.env.DB_HOST}:17200/${process.env.DB_NAME}`);
        await database_1.sequelize.authenticate();
        console.log('Database connected successfully');
        await database_1.sequelize.sync();
        console.log('Database models synced');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        // Don't crash the server if database connection fails
        // In Vercel serverless, connections are established on-demand for each request
    }
})();
// Export the Express app for Vercel
module.exports = app;
exports.default = (req, res) => {
    app(req, res);
};
