export type ActionState = { ok: boolean; message?: string; errors?: Record<string, string[] | undefined> } | undefined;
export type FormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;
