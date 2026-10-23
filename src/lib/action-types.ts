export type FormState =
  | {
      error?: string;
      success?: string;
      fieldErrors?: Record<string, string>;
      /** raw submitted values, so a failed submit doesn't wipe the form */
      values?: Record<string, string>;
    }
  | undefined;

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };
