import {Schema,model} from "mongoose";

const messageSchema = new Schema({
    sender_user_id:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    receiver_user_id:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    message:{
        type:String,
        required:true
    },
},{timestamps:true})

export const Message = model('Message',messageSchema)