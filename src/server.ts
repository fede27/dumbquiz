import * as constants from './globalConstants';
import * as Config from 'config';
import * as Path from 'path';
import * as Winston from 'winston';

import app from './app';

// Bootstrapping

const logFormat = Winston.format.combine(
    Winston.format.timestamp(),
    Winston.format.padLevels(),
    Winston.format.printf((info) => `[${ info.timestamp }] ${ info.level }: ${ info.message }`),
);

Winston.configure({
    transports: [
        new Winston.transports.Console({
            level: 'verbose',
            handleExceptions: true,
            format: logFormat,
        }),
        new Winston.transports.File({
            level: 'debug',
            filename: Path.resolve(Config.get<string>('paths.logs'), 'debug.log'),
        }),
        new Winston.transports.File({
            level: 'info',
            filename: Path.resolve(Config.get<string>('paths.logs'), 'info.log'),
        }),
        new Winston.transports.File({
            level: 'error',
            handleExceptions: true,
            filename: Path.resolve(Config.get<string>('paths.logs'), 'error.log'),
        }),
    ],
});

const handledExitHandler = (code: number) => {
    Winston.warn(`[${ constants.APP_NAME }] Server stopped because of a signal "${ code }"`);
    process.exit(code);
};
const unhandledExitHandler = (error: Error) => {
    Winston.error(`[${ constants.APP_NAME }] Server stopped because of an unhandled exception "${ error.message }"\n${ error.stack }`);
    process.exit(1);
};

process.on('uncaughtException', unhandledExitHandler);
process.on('SIGHUP', () => handledExitHandler(128 + 1));
process.on('SIGINT', () => handledExitHandler(128 + 2));
process.on('SIGTERM', () => handledExitHandler(128 + 15));
process.on('SIGBREAK', () => handledExitHandler(128 + 21));

Winston.info(`[${ constants.APP_NAME }] Starting ${ constants.APP_NAME } server\t${ process.pid }`);

// const bind = (Config.has('server.bind')) ? Config.get<string>('server.bind') : '::';
const hostname = (Config.has('server.hostname')) ? Config.get<string>('server.hostname') : 'localhost';
const port = Config.get<number>('server.port');

const server = app.listen(port, hostname, () => {
    Winston.info(`[${ constants.APP_NAME }] Server is running at http://${ hostname }:${ port } in ${ app.get('env') }`);
});

export default server;
