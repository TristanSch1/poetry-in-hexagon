import * as path from "path";
import * as fs from "fs";
import type { PoemsRepository } from "../application/poems.repository";
import { Poem } from "../domain/poem";

export class FileSystemPoemsRepository implements PoemsRepository {
  constructor(
    private readonly dataPath = path.join(__dirname, "data", "poems"),
  ) {}

  async findAll() {
    const allPoems = await fs.promises.readdir(this.dataPath);

    const poemBuffers = await Promise.all(
      allPoems.map((poemPath) => {
        return fs.promises.readFile(path.join(this.dataPath, poemPath));
      }),
    );

    return poemBuffers.map((buffer) => {
      const parsedPoem = JSON.parse(buffer.toString()) as {
        id: string;
        title: string;
        stanzas: string[][];
        author_id: string;
      };

      return new Poem({
        id: parsedPoem.id,
        title: parsedPoem.title,
        stanzas: parsedPoem.stanzas,
        author_id: parsedPoem.author_id,
      });
    });
  }

  async findById(id: string) {
    const allPoems = await this.findAll();

    return allPoems.find((p) => p.id === id);
  }

  async findByTitle(title: string) {
    const allPoems = await this.findAll();

    return allPoems.find((p) => p.title === title);
  }

  async findByAuthorId(authorId: string) {
    const allPoems = await this.findAll();

    return allPoems.find((p) => p.authorId === authorId);
  }
}
