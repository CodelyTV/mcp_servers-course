import { CodelyError } from "../../../shared/domain/CodelyError";

export class CourseBySimilarNameNotFoundError extends CodelyError {
	readonly message = "CourseBySimilarNameNotFoundError";

	constructor(cursor: string) {
		super({ cursor });
	}
}
