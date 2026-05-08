import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { aiOrchestrator } from './services/aiOrchestrator';
import { Conversation, User } from './models';

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

// --- LOGIN ENDPOINT ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


mongoose.connect(process.env.MONGODB_URI!, { dbName: 'ecommerce_ai' })
    .then(() => console.log("✅ CONNECTED TO MONGODB"))
    .catch(err => console.error(err));

app.post('/chat', async (req, res) => {
    const { conversation_id, message, user_email, language: preferredLanguage } = req.body;
    const userMessage = message?.trim();
    if (!userMessage) return res.json({ reply: "Message required." });

    const id = conversation_id || "default";
    console.log(`[CHAT] Incoming message from: ${user_email || 'Anonymous'}`);

    try {
        let conversation = await Conversation.findOne({ conversation_id: id });

        // 1. CONTEXT ENHANCEMENT (Lookup Order Data by ID or Email in History)
        let combinedText = userMessage;
        if (conversation) {
            combinedText += " " + conversation.messages.map(m => m.content).join(" ");
        }

        let foundOrder: any = null;

        // Search for Order ID in CURRENT message only
        const orderIdMatch = userMessage.match(/ORD-2026-\d+/i);
        // Search for Email in history or current message
        const emailMatch = combinedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

        if (orderIdMatch || emailMatch || user_email) {
            let orderData: any = null;
            let query: any = {};

            if (orderIdMatch) {
                // If user specifically mentions an ID in this message, zoom in
                query = {
                    orderId: orderIdMatch[0].toUpperCase(),
                    "customer.email": user_email ? user_email.toLowerCase() : { $exists: true }
                };
                orderData = await mongoose.connection.db!.collection('orders').findOne(query);
            } else {
                // Otherwise, keep the full history visible
                const targetEmail = emailMatch ? emailMatch[0] : user_email;
                if (targetEmail) {
                    query = { "customer.email": targetEmail.toLowerCase() };
                    orderData = await mongoose.connection.db!.collection('orders').find(query).toArray();
                }
            }

            if (orderData && (Array.isArray(orderData) ? orderData.length > 0 : true)) {
                foundOrder = orderData;
                console.log(`[DB-LOG] SUCCESS: Data retrieved for ${query["customer.email"] || query.orderId}`);
            } else {
                console.log(`[DB-LOG] WARNING: No data found for query:`, query);
            }
        }

        const history = conversation ? conversation.messages : [];

        // 2. AI Processing (Phase 5: Sentiment & Phase 6: Multilingual)
        const aiResponse = await aiOrchestrator.handleMessage(
            userMessage, 
            { 
                conversationId: id, 
                history: history as any,
                language: preferredLanguage
            }, 
            foundOrder
        );

        // 3. Save History
        const userMessageWithSentiment = {
            role: 'user',
            content: userMessage,
            sentiment: aiResponse.metadata?.sentiment
        };

        let userName = "Anonymous";
        if (user_email) {
            const userDoc = await User.findOne({ email: user_email });
            if (userDoc) userName = userDoc.name;
        }

        if (!conversation) {
            conversation = new Conversation({
                conversation_id: id,
                user_email: user_email,
                user_name: userName,
                messages: [userMessageWithSentiment, { role: 'assistant', content: aiResponse.content }],
                language: aiResponse.metadata?.language
            });
        } else {
            conversation.user_email = user_email;
            conversation.user_name = userName;
            conversation.messages.push(userMessageWithSentiment as any);
            conversation.messages.push({ role: 'assistant', content: aiResponse.content } as any);
            conversation.language = aiResponse.metadata?.language;
        }
        await conversation.save();

        res.json({ reply: aiResponse.content, conversation_id: id, metadata: aiResponse.metadata });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- ADMIN ENDPOINTS ---
app.get('/admin/conversations', async (req, res) => {
    try {
        const conversations = await Conversation.find().sort({ _id: -1 });
        res.json(conversations);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => console.log(`🚀 AI Agent (Sentiment & Multilingual) running on ${port}`));
