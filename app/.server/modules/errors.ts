export class DatabaseNotSupported extends Error {
  constructor(db?: string) {
    const message = db ? `\`${db}\` is not supported.` : "current database is not supported";
    super(message);
    this.name = "Error [FOSSILBOX_DATABASE_NOT_SUPPORTED]";
    this.cause = `${this.name}: ${message}`;
  }
}
