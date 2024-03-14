import { Err, Ok, Result } from "../../common/result";
import { Poem } from "../../domain/poem";
import type { PoemRepository } from "../poem.repository";

export class ViewAllPoemsUseCase {
  constructor(private readonly poemRepository: PoemRepository) {}

  async execute(): Promise<Result<Poem["data"][], any>> {
    try {
      const poems = await this.poemRepository.findAll();

      return Ok.of(poems.map((poem) => poem.data));
    } catch (err) {
      return Err.of(err);
    }
  }
}
