export class HttpError extends Error {
  constructor(
    public status: number,
    public statusMessage: string,
    message?: string | undefined,
    options?: ErrorOptions | undefined
  ) {
    super(message, options);
  }
}
