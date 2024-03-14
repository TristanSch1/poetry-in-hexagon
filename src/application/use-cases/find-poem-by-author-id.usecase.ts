import { type Result, Err, Ok } from "../../common/result";
import type { Poem } from "../../domain/poem";
import { PoemNotFoundError, type PoemsRepository } from "../poems.repository";

export interface FindPoemByAuthorIdCommand {
  authorId: string;
}

export class FindPoemByAuthorIdUseCase {
  constructor(private readonly poemsRepository: PoemsRepository) {}

  async execute({
    authorId,
  }: FindPoemByAuthorIdCommand): Promise<Result<Poem, Error>> {
    try {
      const poem = await this.poemsRepository.findByAuthorId(authorId);

      if (!poem) {
        return Err.of(new PoemNotFoundError());
      }

      return Ok.of(poem);
    } catch (err) {
      if (err instanceof Error) {
        return Err.of(err);
      }

      return Err.of(new Error("unknown error"));
    }
  }
}
