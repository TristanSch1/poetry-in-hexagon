import * as path from "path";
import * as fs from "fs";
import { describe, beforeEach, it, expect } from "bun:test";
import { Poem } from "../../domain/poem";
import { FileSystemPoemsRepository } from "../file-system/poems.fs.repository";

const testPoemsPath = path.join(__dirname, "./poems-test.json");

describe("FileSystemPoemsRepository", () => {
  beforeEach(async () => {
    await fs.promises.writeFile(testPoemsPath, JSON.stringify([]));
  });

  it("findAll() should return all the poems", async () => {
    const repository = new FileSystemPoemsRepository(testPoemsPath);

    await fs.promises.writeFile(
      testPoemsPath,
      JSON.stringify([
        { id: "poem-1", title: "My Poem", stanzas: [], author_id: "author-1" },
        {
          id: "poem-2",
          title: "My Second Poem",
          stanzas: [],
          author_id: "author-1",
        },
      ]),
    );
    const allPoems = await repository.findAll();

    expect(allPoems).toHaveLength(2);
    expect(allPoems).toEqual(
      expect.arrayContaining([
        Poem.fromData({
          id: "poem-1",
          title: "My Poem",
          stanzas: [],
          author_id: "author-1",
        }),
        Poem.fromData({
          id: "poem-2",
          title: "My Second Poem",
          stanzas: [],
          author_id: "author-1",
        }),
      ]),
    );
  });

  it("findBy() should return poems with correct filters", async () => {
    const repository = new FileSystemPoemsRepository(testPoemsPath);

    await fs.promises.writeFile(
      testPoemsPath,
      JSON.stringify([
        { id: "poem-1", title: "My Poem", stanzas: [], author_id: "author-1" },
        {
          id: "poem-2",
          title: "My Second Poem",
          stanzas: [],
          author_id: "author-1",
        },
        {
          id: "poem-3",
          title: "My poem",
          stanzas: [],
          author_id: "author-2",
        },
      ]),
    );

    const poems = await repository.findBy([
      { key: "authorId", value: "author-1", op: "eq" },
    ]);

    expect(poems).toEqual([
      Poem.fromData({
        id: "poem-1",
        title: "My Poem",
        stanzas: [],
        author_id: "author-1",
      }),
      Poem.fromData({
        id: "poem-2",
        title: "My Second Poem",
        stanzas: [],
        author_id: "author-1",
      }),
    ]);
  });
});
