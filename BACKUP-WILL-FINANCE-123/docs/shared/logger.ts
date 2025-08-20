interface Logger {
	info: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
}

export const logger: Logger = {
	info: (...args) => console.log(...args),
	error: (...args) => console.error(...args)
};
