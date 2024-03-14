import { Err, Ok, type Result } from "../../common/result";
import type { Poem } from "../../domain/poem";
import { PoemNotFoundError, type PoemsRepository } from "../poems.repository";

export interface FindByIdUseCaseCommand {
  id: string;
}

export class FindPoemByIdUseCase {
  constructor(private readonly poemsRepository: PoemsRepository) {}

  async execute({ id }: FindByIdUseCaseCommand): Promise<Result<Poem, Error>> {
    try {
      const poem = await this.poemsRepository.findById(id);

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
