import * as path from "path";
import * as fs from "fs";
import type { PoemRepository } from "../../application/poem.repository";
import { Poem } from "../../domain/poem";

export class FileSystemPoemsRepository implements PoemRepository {
  constructor(
    private readonly dataPath = path.join(
      __dirname,
      "../../../data",
      "poems.json",
    ),
  ) {}

  async findAll() {
    const data = await fs.promises.readFile(this.dataPath);

    const poems = JSON.parse(data.toString()) as {
      id: string;
      title: string;
      stanzas: string[][];
      author_id: string;
    }[];

    return poems.map((poem) => Poem.fromData(poem));
  }

  async findBy(filters: { key: keyof Poem; value: string; op: "eq" | "in" }[]) {
    let poems = await this.findAll();

    filters.forEach((filter) => {
      const filteredPoems = this.filter(poems, filter);

      poems = filteredPoems;
    });

    return poems;
  }

  async findById(id: string) {
    const poems = await this.findAll();

    return poems.find((p) => p.id === id);
  }

  private filter(
    poems: Poem[],
    filter: { key: keyof Poem; value: string; op: "eq" | "in" },
  ) {
    return poems.filter((poem) => {
      if (filter.op === "eq") {
        return (
          poem[filter.key].toString().toLowerCase() ===
          filter.value.toLowerCase()
        );
      } else if (filter.op === "in") {
        return poem[filter.key]
          .toString()
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      }
    });
  }
}
