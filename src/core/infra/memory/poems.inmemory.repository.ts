import type { PoemRepository } from "../../application/poem.repository";
import type { Poem } from "../../domain/poem";

export class InMemoryPoemsRepository implements PoemRepository {
  poems: Poem[] = [];

  findAll() {
    return Promise.resolve(this.poems);
  }

  async findBy(filters: { key: keyof Poem; value: string; op: "eq" | "in" }[]) {
    let poems = await this.findAll();

    filters.forEach((filter) => {
      const filteredPoems = this.filter(poems, filter);

      poems = filteredPoems;
    });

    return poems;
  }

  findById(id: string) {
    return Promise.resolve(this.poems.find((p) => p.id === id));
  }

  givenSomePoems(poems: Poem[]) {
    this.poems = poems;
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
