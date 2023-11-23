import mongoose from "mongoose";
import { UserModel } from "../../DB/models/User";
import CustomError from "../../errors/errors";
import { user } from "../../types/user";
import {hash,compare} from 'bcrypt';
const hashPassword = async(password: string) => {
  try {
    if (password.length <6){
        throw new CustomError("Password length required").ValidationError()
    }
    const pwd = await hash(password,10)
    return pwd;
  } catch (error) {
    throw error;
  }
};

const verifyPassword = async(password: string, reqPassword: string) => {
    try {
        if (reqPassword.length < 6){
            throw new CustomError('Password must be at least 6 characters long').ValidationError()
        }
        // decrypt password
       const verify =  await compare(password,reqPassword)
       
        return verify
    } catch (error) {
        throw error
    }
}

export const register = async (user: user) => {
    try {
        const hashedPassword = await hashPassword(user.password);
        const registeredUser = await UserModel.create({ ...user, password: hashedPassword }).catch(err => {
          if (mongoose.Error.ValidationError) 
            throw new CustomError('User not registered').ValidationError()
            return
        });
        return registeredUser?.id;
    } catch (error) {
        throw error
    }
};


export const login = async(email: string, password: string) => {
    try {
        const user = await UserModel.findOne({email:email})
        if (!user) {
            throw new CustomError('User not found').ValidationError()
        }
        const isPasswordValid = await verifyPassword(password,user.password)
        if (!isPasswordValid) {
            throw new CustomError('Invalid password').ValidationError()
        }
        return user.id
    } catch (error) {
        throw error
    }
}


