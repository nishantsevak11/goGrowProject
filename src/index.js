import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRoute/authRoute.js';
import connectDb from './utils/databaseConnnect.js';
import cron from 'node-cron';
import sendDailyEmails from './service/emailScheduler.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDb();
        console.log('Connected to MongoDB');


        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

         // ✅ Schedule daily email job at 9:00 AM IST
         cron.schedule("*/1 * * * *", async () => {
            console.log("📩 Running daily email job...");
            await sendDailyEmails();
        }, {
            scheduled: true,
            timezone: "Asia/Kolkata"
        });

        console.log("✅ Email scheduler started...");

    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();