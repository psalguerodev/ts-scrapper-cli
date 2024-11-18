import winston from 'winston';
import {ConfigService} from "../config/config.service";

const config = ConfigService.getInstance();

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            filename: config.logFile,
            level: 'error'
        }),
        new winston.transports.File({
            filename: config.logFile
        })
    ]
});

export default logger;
