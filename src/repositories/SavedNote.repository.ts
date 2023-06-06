import { Prisma, SavedNoteState } from "@prisma/client";

class SavedNoteRepository {
  upsertQuery({
    lockerId,
    noteId,
    savedNoteState,
  }: {
    lockerId: bigint;
    noteId: bigint;
    savedNoteState: SavedNoteState;
  }): Prisma.SavedNoteUpsertArgs {
    return {
      where: {
        lockerId_noteId: {
          lockerId,
          noteId,
        },
      },
      update: {
        status: savedNoteState,
      },
      create: {
        status: savedNoteState,
        lockerId,
        noteId,
      },
    };
  }
}

export default SavedNoteRepository;
