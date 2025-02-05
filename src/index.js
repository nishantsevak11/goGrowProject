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

app.get('/send', (req,res)=>{
    try{
         await sendDailyEmails();
         res.status(200).json({
            message:"Email send successfullt",
        })
    }catch(err){
        console.log("Failed to send emails ", err);
        res.status(400).json({
            message:"Email send Failed",
            err : err
        })
    }
})

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
         

    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
