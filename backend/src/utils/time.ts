const MILLISECONDS = 1;
const SECONDS = 1000 * MILLISECONDS;
const MINUTES = SECONDS * 60;
const HOURS = MINUTES * 60;
const DAYS = HOURS * 24;

const TIME_UNITS = [
	"milliseconds",
	"seconds",
	"minutes",
	"hours",
	"days",
] as const;

/**
 * Human readable time units
 */
export type TimeUnit = typeof TIME_UNITS[number];

const UNIT_VALUES: Required<TimeSpec> = {
	milliseconds: MILLISECONDS,
	seconds: SECONDS,
	minutes: MINUTES,
	hours: HOURS,
	days: DAYS,
};

/**
 * Object that maps time unit to a human readable count
 */
export type TimeSpec = {
	[K in TimeUnit]?: number;
};

/**
 * Convert a TimeSpec into milliseconds.
 * Empty or undefined values are interpreted as 0
 *
 * @param spec the 'human readable' time to convert
 * @returns a number of milliseconds equivalent to the given time
 *
 * @example
 * // returns 20500
 * convertTime({
 *   "milliseconds": 500,
 *   "seconds": 20,
 * });
 *
 * @example
 * function callback() {
 *   // ...
 * }
 * // execute function in 2 hours
 * setTimeout(callback, convertTime({ hours: 2 }));
 */
export function convertTime(spec: TimeSpec): number | undefined {
	const values: number[] = [];

	for (const unit of TIME_UNITS) {
		const currentValue = spec[unit] ?? 0;

		if (currentValue < 0) {
			return undefined;
		}

		values.push(currentValue * UNIT_VALUES[unit]);
	}

	return values.reduce(function (previous, current) { return previous + current }, 0);
}
