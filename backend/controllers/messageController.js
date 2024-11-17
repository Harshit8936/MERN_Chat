import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import {getReceiverSocketId, io} from "../socket/socket.js"


export const sendMessage = async(req,res)=>{
    try {
        const sender_user_id = req.user_id;
        const receiver_user_id = req.params.id;
        const {message} = req.body;

        // check conversations b/w two users 
        let gotConversation = await Conversation.findOne({
            participants:{$all:[sender_user_id,receiver_user_id]}
        });
        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[sender_user_id,receiver_user_id]
            }) 
        }

        const newMessage = await Message.create({
            sender_user_id,receiver_user_id,message
        })
        if(newMessage){
            gotConversation.messages.push(newMessage._id)
        }
        // await gotConversation.save();
        await Promise.all([gotConversation.save(),newMessage.save()]);


        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiver_user_id);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        return res.status(201).json({
            message:"Message sent successfully",
            success:true,
            newMessage
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`${error}`
        })
    }
}


export const getMessage = async(req,res)=>{
    try {
        const receiver_user_id = req.params.id;
        const sender_user_id = req.user_id;
        const conversation = await Conversation.findOne({
            participants:{$all:[sender_user_id,receiver_user_id]}
        }).populate('messages').exec();
        return res.status(200).json({
            success:true,
            message:"Messages fetched",
            conversation
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`${error}`
        })
    }
}