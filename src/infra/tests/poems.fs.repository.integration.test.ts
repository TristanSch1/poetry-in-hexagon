import * as path from "path";
import * as fs from "fs";
import { describe, beforeEach, it, expect } from "bun:test";
import { FileSystemPoemsRepository } from "../poems.fs.repository";
import { Poem } from "../../domain/poem";

const testPoemsPath = path.join(__dirname, "./poems-test/");

describe("FileSystemPoemsRepository", () => {
  beforeEach(async () => {
    if (fs.existsSync(testPoemsPath)) {
      await fs.promises.rm(testPoemsPath, {
        recursive: true,
      });
    }
    await fs.promises.mkdir(testPoemsPath);
  });

  it("findAll() should return all the files in poems path directory", async () => {
    const repository = new FileSystemPoemsRepository(testPoemsPath);
    const myPoemData = {
      id: "poem-1",
      title: "My Poem",
      stanzas: [],
      author_id: "author-1",
    };

    const mySecondPoemData = {
      id: "poem-2",
      title: "My Second Poem",
      stanzas: [],
      author_id: "author-1",
    };

    await fs.promises.writeFile(
      path.join(testPoemsPath, "./poem-1.json"),
      JSON.stringify(myPoemData),
    );
    await fs.promises.writeFile(
      path.join(testPoemsPath, "./poem-2.json"),
      JSON.stringify(mySecondPoemData),
    );

    const allPoems = await repository.findAll();

    expect(allPoems).toHaveLength(2);
    expect(allPoems).toEqual(
      expect.arrayContaining([
        new Poem(myPoemData),
        new Poem(mySecondPoemData),
      ]),
    );
  });

  it("findById() should return the poem with the given ID", async () => {
    const repository = new FileSystemPoemsRepository(testPoemsPath);
    const myPoemData = {
      id: "poem-1",
      title: "My Poem",
      stanzas: [],
      author_id: "author-1",
    };
    await fs.promises.writeFile(
      path.join(testPoemsPath, "./poem-1.json"),
      JSON.stringify(myPoemData),
    );

    const poem = await repository.findById("poem-1");

    expect(poem).toEqual(new Poem(myPoemData));
  });

  it("findByTitle() should return the poem with the given Title", async () => {
    const repository = new FileSystemPoemsRepository(testPoemsPath);
    const myPoemData = {
      id: "poem-1",
      title: "My Poem",
      stanzas: [],
      author_id: "author-1",
    };
    await fs.promises.writeFile(
      path.join(testPoemsPath, "./poem-1.json"),
      JSON.stringify(myPoemData),
    );

    const poem = await repository.findByTitle("My Poem");

    expect(poem).toEqual(new Poem(myPoemData));
  });

  it("findByAuthorId() should return the poem with the given Author ID", async () => {
    const repository = new FileSystemPoemsRepository(testPoemsPath);
    const myPoemData = {
      id: "poem-1",
      title: "My Poem",
      stanzas: [],
      author_id: "author-1",
    };
    await fs.promises.writeFile(
      path.join(testPoemsPath, "./poem-1.json"),
      JSON.stringify(myPoemData),
    );

    const poem = await repository.findByAuthorId("author-1");

    expect(poem).toEqual(new Poem(myPoemData));
  });
});
