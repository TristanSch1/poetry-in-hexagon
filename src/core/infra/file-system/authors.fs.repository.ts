import * as path from "path";
import * as fs from "fs";
import type { AuthorRepository } from "../../application/author.repository";
import { Author } from "../../domain/author";

export class FileSystemAuthorRepository implements AuthorRepository {
  constructor(
    private readonly dataPath = path.join(
      __dirname,
      "../../../data",
      "authors.json",
    ),
  ) {}

  async findAll() {
    const data = await fs.promises.readFile(this.dataPath);
    const authors = JSON.parse(data.toString()) as {
      id: string;
      name: string;
    }[];

    return authors.map((authorData) => Author.fromData(authorData));
  }

  async findById(id: string) {
    const allAuthors = await this.findAll();

    return allAuthors.find((a) => a.id === id);
  }

  async findByName(name: string) {
    const allAuthors = await this.findAll();

    return allAuthors.find((a) => a.name === name);
  }
}
