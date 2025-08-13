import { CodelyError } from "./CodelyError";

export class InvalidNanoIdError extends CodelyError {
	readonly message = "InvalidNanoIdError";

	constructor(id: string) {
		super({ id });
	}
}
