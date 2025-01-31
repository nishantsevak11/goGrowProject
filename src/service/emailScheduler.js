import User from '../models/user.model.js';
import sendEmailService from './emailService.js';
import { generateContent } from './geminiService.js';


const sendDailyEmails = async () => {
    try {
        const users = await User.find({}, "name email AiPrompt"); // Fetch all users

        if (users.length === 0) {
            console.log("⚠️ No users found.");
            return;
        }

        for (const user of users) {
            try {
                const message = await generateContent(users.categories, users.name , users.AiPrompt);
                await sendEmailService(user.name, user.email, message);
            } catch (error) {
                console.error(`❌ Error sending email to ${user.email}:`, error.message);
            }
        }
    } catch (error) {
        console.error("❌ Error fetching users:", error);
    }
};

export default sendDailyEmails;