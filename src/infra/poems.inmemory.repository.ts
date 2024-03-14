import type { PoemsRepository } from "../application/poems.repository";
import type { Poem } from "../domain/poem";

export class InMemoryPoemsRepository implements PoemsRepository {
  poems: Poem[] = [];

  findAll() {
    return Promise.resolve(this.poems);
  }

  findById(id: string) {
    return Promise.resolve(this.poems.find((p) => p.id === id));
  }

  findByTitle(title: string) {
    return Promise.resolve(this.poems.find((p) => p.title === title));
  }

  findByAuthorId(authorId: string) {
    return Promise.resolve(this.poems.find((p) => p.authorId === authorId));
  }

  givenSomePoems(poems: Poem[]) {
    this.poems = poems;
  }
}
