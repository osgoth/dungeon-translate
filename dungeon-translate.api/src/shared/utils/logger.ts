import winston from "winston";

// Logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    }),
    winston.format.colorize({all: true}),
  ),
  transports: [
    new winston.transports.Console(),
  ]
});
export { logger };

