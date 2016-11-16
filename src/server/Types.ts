// API responce type.
// Use server & client.

interface CronData
{
	env: { line: string, enable: boolean }[],
	cron: { time: string[], command: string, enable: boolean }[],
	create?: boolean,
};

interface OpenUserData
{
	id: number,
	email: string,
	name:  string,
	type:  string,
};
