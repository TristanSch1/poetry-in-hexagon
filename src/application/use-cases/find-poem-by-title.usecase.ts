import { type Result, Err, Ok } from "../../common/result";
import type { Poem } from "../../domain/poem";
import { PoemNotFoundError, type PoemsRepository } from "../poems.repository";

export interface FindPoemByTitleCommand {
  title: string;
}

export class FindPoemByTitleUseCase {
  constructor(private readonly poemsRepository: PoemsRepository) {}

  async execute({
    title,
  }: FindPoemByTitleCommand): Promise<Result<Poem, Error>> {
    try {
      const poem = await this.poemsRepository.findByTitle(title);

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
