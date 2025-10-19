"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//Middleware for JSON parsing and cors
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
//Basic logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
const userProfile = {
    email: process.env.USER_EMAIL || 'opseyakinbohun@gmail.com',
    name: process.env.USER_NAME || "Akinbohun Opeyemi",
    stack: 'Node.js/Express'
};
function fetchCatFact() {
    return __awaiter(this, arguments, void 0, function* (timeoutMs = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = yield (0, node_fetch_1.default)('https://catfact.ninja/fact', {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Error fetching cat fact: ${response.status}`);
            }
            const data = yield response.json();
            return data.fact || 'No fact found';
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.error('Cat fact API request timed out');
                }
                else {
                    console.error('Error fetching cat fact:', error.message);
                }
            }
            return 'Could not fetch cat fact at this time.';
        }
    });
}
app.get('/me', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timestamp = new Date().toDateString();
        const fact = yield fetchCatFact();
        const response = {
            status: 'success',
            user: userProfile,
            timestamp,
            fact
        };
        return res.status(200).set('Content-Type', 'application/json').json(response);
    }
    catch (error) {
        next(error);
    }
}));
//Health check endpoint
app.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    if (res.headersSent) {
        return next(err);
    }
    return res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message
    });
});
// Graceful shutdown
const server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://locahost:${PORT}/health`);
    console.log(`Profile endpoint: http://localhost:${PORT}/me`);
});
// Handle gracefull shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal receieved: closing HTTPS server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT signal receieved: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
