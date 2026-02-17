
import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

export const isProduction = NODE_ENV === 'production';
export const isDevelopment = NODE_ENV === 'development';
export const isTest = NODE_ENV === 'test';

// Fail fast in production if critical vars are missing
const required = (key: string): string => {
    const val = process.env[key];
    if (!val && isProduction) {
        throw new Error(`[Config] Missing required environment variable: ${key}`);
    }
    return val || '';
};

const optional = (key: string, defaultValue = ''): string =>
    process.env[key] ?? defaultValue;

export const config = {
    env: NODE_ENV,
    isProduction,
    isDevelopment,
    isTest,

    server: {
        port: parseInt(optional('PORT', '5000')),
        host: optional('HOST', '0.0.0.0'),
    },

    database: {
        url: required('DATABASE_URL'),
        // These would be used if we were configuring a pool manually
        poolMin: parseInt(optional('DB_POOL_MIN', '2')),
        poolMax: parseInt(optional('DB_POOL_MAX', '10')),
    },

    logging: {
        level: optional('LOG_LEVEL', isProduction ? 'info' : 'debug'),
    },

    // Add other sections as needed (e.g., Auth, Redis, Stripe)
};
