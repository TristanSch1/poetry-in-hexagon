import type { Poem } from "../domain/poem";

export class PoemNotFoundError extends Error {}

export interface PoemRepository {
  findAll: () => Promise<Poem[]>;
  findBy: (
    filters: { key: keyof Poem; value: string; op: "eq" | "in" }[],
  ) => Promise<Poem[]>;
  findById: (id: string) => Promise<Poem | undefined>;
}
