import User from '../models/user.model.js';
import sendEmailService from './emailService.js';
import { generateContent } from './geminiService.js';


const sendDailyEmails = async () => {
    try {
        console.log(`🕒 Starting daily email job at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        
        const users = await User.find({}, "name email AiPrompt"); // Fetch all users
        console.log(`📋 Found ${users.length} users to send emails to`);

        if (users.length === 0) {
            console.log("⚠️ No users found.");
            return;
        }

        let successCount = 0;
        let failureCount = 0;

        for (const user of users) {
            try {
                console.log(`📧 Generating content for user: ${user.email}`);
                const message = await generateContent(user.categories, user.name, user.AiPrompt);
                await sendEmailService(user.name, user.email, message);
                successCount++;
                console.log(`✅ Successfully sent email to: ${user.email}`);
            } catch (error) {
                failureCount++;
                console.error(`❌ Error sending email to ${user.email}:`, error.message);
            }
        }

        console.log(`
🔄 Daily Email Job Summary:
✅ Successfully sent: ${successCount} emails
❌ Failed to send: ${failureCount} emails
📊 Total processed: ${users.length} users
⏰ Completed at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `);
    } catch (error) {
        console.error("❌ Error in daily email job:", error);
    }
};

export default sendDailyEmails;