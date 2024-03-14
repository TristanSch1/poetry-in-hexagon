import { Err, Ok } from "../../common/result";
import { PoemNotFoundError, type PoemRepository } from "../poem.repository";

export interface ReadPoemCommand {
  poemId: string;
}

export class ReadPoemUseCase {
  constructor(private readonly poemRepository: PoemRepository) {}

  async execute({ poemId }: ReadPoemCommand) {
    try {
      const poem = await this.poemRepository.findById(poemId);

      if (!poem) {
        return Err.of(new PoemNotFoundError());
      }

      return Ok.of(poem.stanzas);
    } catch (err) {
      return Err.of(err);
    }
  }
}
