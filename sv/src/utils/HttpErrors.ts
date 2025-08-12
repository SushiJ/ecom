export class HttpError extends Error {
	public statusCode: number;
	public name: string;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpError);
		}
	}

	static badRequest(message: string = "Bad Request") {
		return new HttpError(400, message);
	}

	static unauthorized(message: string = "Unauthorized") {
		return new HttpError(401, message);
	}

	static forbidden(message: string = "Forbidden") {
		return new HttpError(403, message);
	}

	static notFound(message: string = "Not Found") {
		return new HttpError(404, message);
	}

	static conflict(message: string = "Conflict") {
		return new HttpError(409, message);
	}

	static unprocessableEntity(message: string = "Unprocessable Entity") {
		return new HttpError(422, message);
	}

	static internalServerError(message: string = "Internal Server Error") {
		return new HttpError(500, message);
	}

	static notImplemented(message: string = "Not Implemented") {
		return new HttpError(501, message);
	}

	static serviceUnavailable(message: string = "Service Unavailable") {
		return new HttpError(503, message);
	}

	static isHttpError(error: any): error is HttpError {
		return error instanceof HttpError;
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			statusCode: this.statusCode,
			stack: this.stack,
		};
	}
}
