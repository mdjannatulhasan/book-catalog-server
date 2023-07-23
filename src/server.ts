/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { Server } from 'http';
// import { logger, errorLogger } from './shared/logger';

async function bootstrap() {
    let server: Server;
    try {
        await mongoose.connect(config.database_url as string);
        // logger.info('DB is connected');

        server = app.listen(config.port, () => {
            // logger.info('Port is listening');
        });
    } catch (er) {
        // errorLogger.error('DB connection failed');
    }

    process.on('unhandledRejection', err => {
        if (server) {
            server.close(() => {
                // errorLogger.error(err);

                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    });
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
bootstrap();
