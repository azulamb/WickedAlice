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
	id: string,
	email: string,
	name:  string,
	type:  string,
};

interface CloseUserData
{
	id: string,
	name: string,
	type: string,
};

interface ResultMessage
{
	message: string,
}
