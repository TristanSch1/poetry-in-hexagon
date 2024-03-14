import type { Poem } from "../domain/poem";

export class PoemNotFoundError extends Error {}

export interface PoemsRepository {
  findAll: () => Promise<Poem[]>;
  findById: (id: string) => Promise<Poem | undefined>;
  findByTitle: (title: string) => Promise<Poem | undefined>;
  findByAuthorId: (authorId: string) => Promise<Poem | undefined>;
}
