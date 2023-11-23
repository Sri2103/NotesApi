import {model,Schema,Document} from 'mongoose';
import { user } from '../../types/user';

const UserSchema = new Schema({
    name:{
        type:String,
        required:[true,'Name is required']  
    },
    email:{
        type:String,
        unique:true,
        required: true,
    },
    password:{
        type:String,
        required:true
    },
},{timestamps: true})

export const UserModel = model<user & Document>('User',UserSchema)