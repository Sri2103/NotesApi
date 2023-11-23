import { Document, Schema, model } from "mongoose";
import { notes } from "../../types/notes";

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    createdBy :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sharedUsers:[{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
},{timestamps:true})

NotesSchema.index(
    {
        title: "text",
        content: "text",
    }
)
export const NotesModel = model<notes & Document>('Notes',NotesSchema)
// NotesModel.createIndexes();
