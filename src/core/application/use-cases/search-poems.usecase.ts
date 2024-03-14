import { Err, Ok } from "../../common/result";
import { Poem } from "../../domain/poem";
import {
  AuthorNotFoundError,
  type AuthorRepository,
} from "../author.repository";
import { PoemNotFoundError, type PoemRepository } from "../poem.repository";

export interface SearchPoemsCommand {
  id?: string;
  title?: string;
  authorName?: string;
}

export class SearchPoemsUseCase {
  constructor(
    private readonly poemRepository: PoemRepository,
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(command: SearchPoemsCommand) {
    try {
      const filters: { key: keyof Poem; value: string; op: "eq" | "in" }[] = [];
      if (command.id) {
        filters.push({ key: "id", value: command.id, op: "eq" });
      }
      if (command.authorName) {
        const author = await this.authorRepository.findByName(
          command.authorName,
        );

        if (author) {
          filters.push({ key: "authorId", value: author.id, op: "eq" });
        }
      }
      if (command.title) {
        filters.push({ key: "title", value: command.title, op: "in" });
      }
      const poems = await this.poemRepository.findBy(filters);

      const reformatedPoems = await Promise.all(
        poems.map(async (poem) => {
          return {
            id: poem.id,
            title: poem.title,
            author: await this.getPoemAuthorName(poem),
          };
        }),
      );

      return Ok.of(reformatedPoems);
    } catch (err) {
      return Err.of(err);
    }
  }

  private async getPoemAuthorName(poem: Poem) {
    const author = await this.authorRepository.findById(poem.authorId);

    if (!author) {
      throw new PoemNotFoundError(
        `Cannot find author with id ${poem.authorId}`,
      );
    }

    return author.name;
  }
}
