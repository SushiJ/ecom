import crypto from "crypto";

const salt = "ThisisSalt";

export const setPassword = (password: string) => {
	const hash = crypto
		.pbkdf2Sync(password, salt, 1000, 64, "sha256")
		.toString("hex");
	return hash;
};

export const matchPassword = (originalHash: string, password: string) => {
	const hash = crypto
		.pbkdf2Sync(password, salt, 1000, 64, "sha256")
		.toString("hex");
	return originalHash === hash;
};
