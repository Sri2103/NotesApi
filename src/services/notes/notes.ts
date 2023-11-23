import { Request } from "express";
import { NotesModel } from "../../DB/models/Note";
import { UserModel } from "../../DB/models/User";
import CustomError from "../../errors/errors";
import { notes } from "../../types/notes";
import mongoose from "mongoose";
// create notes function
export const createNotes = async (notes: notes) => {
  try {
    const notesCreated = await NotesModel.create(notes);
    if (!notesCreated) {
      throw new CustomError("Error creating note");
    }
    return notesCreated.id;
  } catch (error) {
    throw error;
  }
};

export const getNoteById = async (noteId: string) => {
  try {
    const notes = await NotesModel.findById(noteId);
    if (notes?.errors) {
      throw new CustomError("Error getting note").ValidationError();
    }
    return notes;
  } catch (error) {
    throw error;
  }
};

export const getNotes = async (userId: string) => {
  const mongooseId = new mongoose.Types.ObjectId(userId);
  console.log(mongooseId.toString(), userId);
  try {
    const allNotes = await NotesModel.find().or([
      { sharedUsers: { $in: [userId] } },
      { createdBy: userId },
    ]);

    return allNotes;
  } catch (error) {
    throw error;
  }
};

// update notes by ID
export const updateNotes = async (noteId: string, updatedData: any) => {
  try {
    const updatedNote = await NotesModel.findByIdAndUpdate(
      noteId,
      updatedData,
      { new: true }
    );
    if (!updatedNote) {
      throw new CustomError("Error updating the note");
    }
    return updatedNote;
  } catch (error) {
    throw error;
  }
};

// delete notes by ID
export const deleteNotes = async (noteId: string, userId: string) => {
  try {
    const deletedNote = await NotesModel.findOneAndDelete({
      _id: noteId,
      createdBy: userId,
    });
    if (!deletedNote) {
      throw new CustomError("Error deleting the note");
    }
    return deletedNote;
  } catch (error) {
    throw error;
  }
};

// share notes with other user
export const shareNote = async (
  noteId: string,
  userId: string,
  ShareUserId: string
) => {
  try {
    // check if the note exists in database
    // add the user to the list of users who have access to this note
    let sharedUser = await NotesModel.updateOne(
      { _id: noteId, createdBy: userId },
      { $push: { sharedUsers: ShareUserId } }
    );
    if (!sharedUser) {
      throw new CustomError("Error sharing the note");
    }
    return sharedUser;
  } catch (error) {
    throw error;
  }
};

// query based on search term
export const getSearchedNotes = async (searchTerm: string, userId: string) => {
  try {
    let searchedNotes = await NotesModel.find({
      $text: { $search: searchTerm },
      $or:[
        {createdBy:userId},
        {sharedUsers:{$in:[userId]}}
      ]
    })
      .then((s) => s)
      .catch((err) => {
        new CustomError(
          "Unable to search notes" + err.message
        ).ValidationError();
      });
    return searchedNotes;
  } catch (error) {
    throw error;
  }
};
