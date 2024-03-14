import { Author } from "../domain/author";

export class AuthorNotFoundError extends Error {}

export interface AuthorRepository {
  findAll: () => Promise<Author[]>;
  findById: (id: string) => Promise<Author | undefined>;
  findByName: (name: string) => Promise<Author | undefined>;
}
