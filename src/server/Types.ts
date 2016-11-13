interface CronData
{
	env: { line: string, enable: boolean }[],
	cron: { time: string[], command: string, enable: boolean }[],
	create?: boolean,
};
