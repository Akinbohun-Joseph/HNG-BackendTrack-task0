// import express, {Request, Response, NextFunction} from 'express';
// import fetch from 'node-fetch';

// const app = express();
// const PORT = process.env.PORT || 3000;

// //Middleware for JSON parsing and cors
// app.use(express.json());
// app.use((req: Request, res: Response, next: NextFunction)=> {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

//     if (req.method === 'OPTIONS'){
//         return res.status(200).end();
//     }
//     next();
// });
// //Basic logging middleware
// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next()
// });
// const userProfile = {
//     email: process.env.USER_EMAIL || 'opseyakinbohun@gmail.com',
//     name: process.env.USER_NAME || "Akinbohun Opeyemi",
//     stack: 'Node.js/Express'
// };
// async function fetchCatFact(timeoutMs: number = 5000): Promise<string> {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
//     try {
//         const response = await fetch('https://catfact.ninja/fact', {
//             signal: controller.signal,
//             headers: {'Accept': 'application/json'}
//         });
//         clearTimeout(timeoutId);
//         if(!response.ok){
//             throw new Error(`Error fetching cat fact: ${response.status}`);
        
//         } 
//         const data = await response.json() as { fact: string}
//         return data.fact || 'No fact found';
//     } catch (error) {
//         clearTimeout(timeoutId);

//         if(error instanceof Error ){
//             if (error.name === 'AbortError') {
//                 console.error('Cat fact API request timed out')
//             } else {
//                 console.error('Error fetching cat fact:', error.message);
//             }
//     }

//         return 'Could not fetch cat fact at this time.';
//     }
// }
// app.get('/me', async ( req: Request, res: Response, next: NextFunction) => {
//     try{
//         const timestamp = new Date().toDateString();
//         const fact = await fetchCatFact();

//         const response = {
//             status: 'success', 
//             user: userProfile,
//             timestamp,
//             fact
//         };
//        return res.status(200).set('Content-Type', 'application/json').json(response);
//     } catch (error) {
//         next(error);
//     }
// });
// //Health check endpoint
// app.get('/health', (req: Request, res: Response) => {
//    return res.status(200).json({
//         status: 'OK',
//         timestamp: new Date().toISOString(),
//         uptime: process.uptime()
//     });
// });

// app.use((req: Request, res: Response) => {
//     res.status(404).json({
//         status: 'error', 
//         message: 'Route not found',
//         path: req.path
//     });
// });
// // Error handling middleware
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error('Error stack:', err.stack);

//     if(res.headersSent){
//         return next(err);
//     }
//    return res.status(500).json({
//         status: 'error',
//         message: process.env.NODE_ENV === 'production'
//         ? 'Internal Server Error'
//         : err.message
//     });
// })
// // Graceful shutdown
// const server = app.listen(PORT, () => {
//     console.log (`Server is running on ${PORT}`);
//     console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`Health check: http://locahost:${PORT}/health`);
//     console.log(`Profile endpoint: http://localhost:${PORT}/me`);    
// })
// // Handle gracefull shutdown
// process.on('SIGTERM', ()=> {
//     console.log('SIGTERM signal receieved: closing HTTPS server');
//     server.close(() => {
//         console.log('HTTP server closed');
//         process.exit(0);
//     });
// });
// process.on('SIGINT', ()=> {
//     console.log('SIGINT signal receieved: closing HTTP server');
//     server.close(()=> {
//         console.log('HTTP server closed');
//         process.exit(0);
//     })
// })

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
// No need to import fetch - it's built into Node.js 18+

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Basic logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// User profile data
const userProfile = {
    email: process.env.USER_EMAIL || 'opseyakinbohun@gmail.com',
    name: process.env.USER_NAME || "Akinbohun Opeyemi",
    stack: 'Node.js/Express'
};

// Fetch cat fact with timeout
async function fetchCatFact(timeoutMs: number = 5000): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch('https://catfact.ninja/fact', {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Error fetching cat fact: ${response.status}`);
        }
        
        const data = await response.json() as { fact: string };
        return data.fact || 'No fact found';
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.error('Cat fact API request timed out');
            } else {
                console.error('Error fetching cat fact:', error.message);
            }
        }

        return 'Could not fetch cat fact at this time.';
    }
}

// GET /me endpoint
app.get('/me', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const timestamp = new Date().toISOString();
        const fact = await fetchCatFact();

        const response = {
            status: 'success',
            user: userProfile,
            timestamp,
            fact
        };
        
        // FIX: .json() already sets Content-Type and sends response
        // Don't chain .set() after .json()
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path
    });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error stack:', err.stack);
    
    // Safety check: don't send if headers already sent
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

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Profile endpoint: http://localhost:${PORT}/me`);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});