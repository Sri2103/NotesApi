import { NextFunction, Request, Response, Router } from "express";
import { handleAuth } from "../middleware/userAuth";
import CustomError from "../errors/errors";
import {
  createNotes,
  deleteNotes,
  getNoteById,
  getNotes,
  getSearchedNotes,
  shareNote,
} from "../services/notes/notes";

const router = Router({ mergeParams: true });
router.use(handleAuth);

router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      if (!user) {
        throw new CustomError("User Not Found").AuthError();
      }
      const userId = user.id as string;
      const searchTerm = req.query.q as string;
      //   get type for searchTerm
      console.log(searchTerm,"SearchTerms",req.query)
      const notes = await getSearchedNotes(searchTerm, userId);
      res.status(200).send({
        message: "Searched Notes",
        status: true,
        notes
      });
    } catch (error) {
      next(error);
    }
  }
);
// post a note
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw new CustomError("User not found").AuthError();
    }
    const userId = user.id as string;
    const { title, content } = req.body;
    const note = await createNotes({ title, content, createdBy: userId });
    res.status(201).json({
      message: "created note",
      note,
    });
  } catch (error) {
    next(error);
  }
});
// get all notes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw new CustomError("user not found").AuthError();
    }
    const userId = user.id as string;
    // find the user in db and return their notes
    const notes = await getNotes(userId);
    res.status(200).json({
        message:"notes fetched",
        notes
    });
  } catch (error) {
    next(error);
  }
});

// get notes by id in params
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) {
      throw new CustomError("user not found").AuthError();
    }
    const userId = user.id as string;
    const noteId = req.params.id;
    // find the user in db and return their notes
    const note = await getNoteById(noteId);
    res.status(200).send(note);
  } catch (error) {
    next(error);
  }
});

// delete note by Id
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      if (!user) {
        throw new CustomError("user not found").AuthError();
      }
      const userId = user.id as string;
      const noteId = req.params.id;
      // find the user in db and return their notes
      const note = await getNoteById(noteId);
      if (!note) {
        throw new CustomError("No Note Found").NotFoundError();
      }
      const deletedNote = await deleteNotes(noteId, userId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// post share a notes by id  with other user
router.post(
  "/:id/share",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      if (!user) {
        throw new CustomError("User Not Found").AuthError();
      }
      const userId = user.id as string;
      const noteId = req.params.id;
      const sharedUserId = req.body.userId;
      const note = await getNoteById(noteId);
      if (!note) {
        throw new CustomError("Note Not Found").NotFoundError();
      }
      const sharedNote = await shareNote(noteId, userId, sharedUserId);
      res.status(200).json({
        message:"Note shared to user",
        status: sharedNote.acknowledged
      });
    } catch (error) {
      next(error);
    }
  }
);

// get search by search query term


export default router;
