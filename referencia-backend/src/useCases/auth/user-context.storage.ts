/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { AsyncLocalStorage } from "async_hooks";

export const userContextStorage = new AsyncLocalStorage<{ userId: string | null }>();