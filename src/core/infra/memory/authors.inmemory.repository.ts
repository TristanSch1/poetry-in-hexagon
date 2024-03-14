import { type AuthorRepository } from "../../application/author.repository";
import { Author } from "../../domain/author";

export class InMemoryAuthorRepository implements AuthorRepository {
  authors: Author[] = [];
  async findAll() {
    return Promise.resolve(this.authors);
  }

  async findById(id: string) {
    return this.authors.find((a) => a.id === id);
  }

  async findByName(name: string) {
    return this.authors.find((a) => a.name === name);
  }

  givenSomeAuthorsExist(authors: Author[]) {
    this.authors = authors;
  }
}
