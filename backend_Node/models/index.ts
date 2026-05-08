import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    conversation_id: { type: String, required: true, unique: true },
    user_email: String,
    user_name: String,
    messages: [{
        role: String,
        content: String,
        sentiment: {
            score: Number,
            emotion: String,
            label: String
        },
        timestamp: { type: Date, default: Date.now }
    }],
    language: String
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Simple plain text for now as requested
    createdAt: { type: Date, default: Date.now }
});

export const Conversation = mongoose.model('Conversation', conversationSchema);
export const User = mongoose.model('User', userSchema);
