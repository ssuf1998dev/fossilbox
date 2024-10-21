import type { RequestHandler } from "express";
import type { Logger } from "vite";

import { format } from "date-fns";
import process from "node:process";
import pc from "picocolors";
import winston from "winston";

export default function createLogger(options?: {
  level?: string;
  label?: string;
}) {
  return winston.createLogger({
    level: options?.level,
    transports: [
      new winston.transports.Console(),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.label({ label: options?.label }),
      winston.format.timestamp(),
      winston.format.printf(
        ({ timestamp, label, message, level }) => [
          pc.dim(format(new Date(timestamp), "yyyy/dd/MM HH:mm:ss")),
          label && pc.bold(`[${label}]`),
          `${level}:`,
          String(message).replace(/`([^`]*)`/g, pc.cyan("$1")),
        ].filter(Boolean).join(" "),
      ),
    ),
  });
}

export function createAppLogger(level?: string) {
  return createLogger({ label: "app", level });
}

export function createHTTPLogger(level?: string) {
  const logger = createLogger({ label: "app", level });
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  return <RequestHandler>((req, resp, next) => {
    const start = process.hrtime();

    resp.on("finish", () => {
      const diff = process.hrtime(start);
      const duration = ~~((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS);

      logger.http([
        req.method.toUpperCase(),
        req.url,
        resp.statusCode,
        pc.dim(`${duration}ms`),
      ].filter(Boolean).join(" "));
    });

    next();
  });
}

export function createViteDevServerLogger(level?: string): Logger {
  const logger = createLogger({ label: "vite", level });
  const warnedMessages = new Set<string>();
  const viteLogger: Logger = {
    hasWarned: false,
    info(msg) {
      logger.info(msg);
    },
    warn(msg) {
      viteLogger.hasWarned = true;
      logger.warn(msg);
    },
    warnOnce(msg) {
      if (warnedMessages.has(msg))
        return;
      viteLogger.hasWarned = true;
      logger.warn(msg);
      warnedMessages.add(msg);
    },
    error(msg) {
      viteLogger.hasWarned = true;
      logger.error(msg);
    },
    /** @todo */
    clearScreen() { },
    /** @todo */
    hasErrorLogged() {
      return false;
    },
  };
  return viteLogger;
}
