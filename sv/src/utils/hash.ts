import bcrypt from "bcrypt";

let saltRounds = 7;

export function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}
