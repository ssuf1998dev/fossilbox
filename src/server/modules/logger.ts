import { format } from "date-fns";
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
