
import winston from 'winston';
import { config } from './environment';

const { combine, timestamp, json, colorize, simple, errors } = winston.format;

// Production format: JSON for ELK/CloudWatch ingestion
const productionFormat = combine(
    errors({ stack: true }),
    timestamp(),
    json()
);

// Development format: human-readable colored output
const developmentFormat = combine(
    colorize(),
    timestamp({ format: 'HH:mm:ss' }),
    simple()
);

const logger = winston.createLogger({
    level: config.logging.level,
    format: config.isProduction ? productionFormat : developmentFormat,
    defaultMeta: {
        service: 'clothing-ecommerce-api',
        environment: config.env,
    },
    transports: [
        new winston.transports.Console({
            // In production, never print stack traces to stdout? 
            // Actually usually we do want errors in stdout for container logs, 
            // but formatted as JSON.
            handleExceptions: true,
            handleRejections: true,
        }),
    ],
    exitOnError: false,
});

// Silence logs in test environment
if (config.isTest) {
    logger.silent = true;
}

export default logger;
