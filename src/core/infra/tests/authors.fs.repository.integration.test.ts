import * as path from "path";
import * as fs from "fs";
import { describe, beforeEach, it, expect } from "bun:test";
import { FileSystemAuthorRepository } from "../file-system/authors.fs.repository";
import { Author } from "../../domain/author";

const testAuthorsPath = path.join(__dirname, "./authors-test.json");

describe("FileSystemAuthorRepository", () => {
  beforeEach(async () => {
    await fs.promises.writeFile(testAuthorsPath, JSON.stringify([]));
  });

  it("FindAll() should return all the authors", async () => {
    const repository = new FileSystemAuthorRepository(testAuthorsPath);
    await fs.promises.writeFile(
      testAuthorsPath,
      JSON.stringify([
        {
          id: "1",
          name: "Victor Hugo",
        },
        {
          id: "2",
          name: "Arthur Rimbaud",
        },
      ]),
    );

    const authors = await repository.findAll();

    expect(authors).toEqual([
      Author.fromData({ id: "1", name: "Victor Hugo" }),
      Author.fromData({ id: "2", name: "Arthur Rimbaud" }),
    ]);
  });

  it("FindByName() should return the author with given name", async () => {
    const repository = new FileSystemAuthorRepository(testAuthorsPath);

    await fs.promises.writeFile(
      testAuthorsPath,
      JSON.stringify([
        {
          id: "1",
          name: "Victor Hugo",
        },
        {
          id: "2",
          name: "Arthur Rimbaud",
        },
      ]),
    );

    const author = await repository.findByName("Victor Hugo");

    expect(author).toEqual(Author.fromData({ id: "1", name: "Victor Hugo" }));
  });

  it("FindById() should return the author with given ID", async () => {
    const repository = new FileSystemAuthorRepository(testAuthorsPath);

    await fs.promises.writeFile(
      testAuthorsPath,
      JSON.stringify([
        {
          id: "1",
          name: "Victor Hugo",
        },
        {
          id: "2",
          name: "Arthur Rimbaud",
        },
      ]),
    );

    const author = await repository.findById("2");

    expect(author).toEqual(
      Author.fromData({ id: "2", name: "Arthur Rimbaud" }),
    );
  });
});
