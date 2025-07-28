import { CodelyError } from "../../../shared/domain/CodelyError";

export class InvalidCourseCursorError extends CodelyError {
	readonly message = "InvalidCourseCursorError";

	constructor(cursor: string) {
		super({ cursor });
	}
}
