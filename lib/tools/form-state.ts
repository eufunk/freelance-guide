/** Result of saving a calculator result. */
export type SaveResultState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export const initialSaveResultState: SaveResultState = { status: "idle" };
