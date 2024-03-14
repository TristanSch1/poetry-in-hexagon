import type { PoemsRepository } from "../poems.repository";

export class FindAllPoemsUseCase {
  constructor(private readonly poemsRepository: PoemsRepository) {}

  execute() {
    return this.poemsRepository.findAll();
  }
}
