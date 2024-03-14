import { Err, Ok } from "../../common/result";
import { AuthorRepository } from "../author.repository";

export class ViewAuthorsUseCase {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async execute() {
    try {
      const authors = await this.authorRepository.findAll();

      return Ok.of(authors.map((author) => author.data));
    } catch (err) {
      return Err.of(err);
    }
  }
}
