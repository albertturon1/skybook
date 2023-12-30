import { type InArgs } from "@libsql/client";

export type SafeParseSuccess<D> = { success: true; data: D };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeParseError<E extends Array<Record<PropertyKey, any>>> = { success: false; errors: E };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeParse<D, E extends Array<Record<PropertyKey, any>>> = SafeParseSuccess<D> | SafeParseError<E>;

export type InsertHelper<T extends InArgs> = {
  sql: string;
  args: T;
};
