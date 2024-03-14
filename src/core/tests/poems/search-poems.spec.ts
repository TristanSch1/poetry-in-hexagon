import { describe, it, expect, beforeEach } from "bun:test";
import { type PoemsFixture, createPoemsFixture } from "./poems.fixture";
import { poemBuilder } from "./poem.builder";
import {
  type AuthorsFixture,
  createAuthorsFixture,
} from "../authors/authors.fixture";
import { Author } from "../../domain/author";

describe("Feature: Search Poems", () => {
  let fixture: PoemsFixture;
  let authorsFixture: AuthorsFixture;

  beforeEach(() => {
    authorsFixture = createAuthorsFixture();
    fixture = createPoemsFixture(authorsFixture.authorRepository);
  });

  describe("By Id", () => {
    it("Eric search a poem by its ID, he should see only the poem with the given ID", async () => {
      authorsFixture.givenSomeAuthorsExist([
        Author.fromData({ id: "author-1", name: "Victor Hugo" }),
      ]);
      fixture.givenSomePoemsExists([
        poemBuilder()
          .withId("poem-1")
          .withTitle("My Poem")
          .withAuthorId("author-1")
          .build(),
        poemBuilder().withId("poem-2").build(),
        poemBuilder().withId("poem-3").build(),
      ]);

      await fixture.whenUserSearchPoemsWith({ id: "poem-1" });

      await fixture.thenSearchResultShouldBe([
        {
          id: "poem-1",
          title: "My Poem",
          author: "Victor Hugo",
        },
      ]);
    });

    it("Eric search a poem by its ID that doesn't exist, he should see empty results", async () => {
      fixture.givenSomePoemsExists([poemBuilder().build()]);

      await fixture.whenUserSearchPoemsWith({ id: "unknown-poem" });

      await fixture.thenSearchResultShouldBe([]);
    });
  });

  describe("By Author Name", () => {
    it("Eric search all the poems of Victor Hugo, he should the the corresponding results", async () => {
      authorsFixture.givenSomeAuthorsExist([
        Author.fromData({ id: "author-1", name: "Victor Hugo" }),
      ]);
      fixture.givenSomePoemsExists([
        poemBuilder()
          .withId("poem-1")
          .withTitle("My Poem")
          .withAuthorId("author-1")
          .build(),
        poemBuilder().withId("poem-2").build(),
        poemBuilder().withId("poem-3").build(),
        poemBuilder()
          .withId("poem-4")
          .withTitle("My second poem")
          .withAuthorId("author-1")
          .build(),
        poemBuilder()
          .withId("poem-5")
          .withTitle("My third poem")
          .withAuthorId("author-1")
          .build(),
      ]);

      await fixture.whenUserSearchPoemsWith({ authorName: "Victor Hugo" });

      await fixture.thenSearchResultShouldBe([
        {
          id: "poem-1",
          title: "My Poem",
          author: "Victor Hugo",
        },
        {
          id: "poem-4",
          title: "My second poem",
          author: "Victor Hugo",
        },
        {
          id: "poem-5",
          title: "My third poem",
          author: "Victor Hugo",
        },
      ]);
    });

    it("Eric can search poems by author name regardless of case-sensitive", async () => {
      authorsFixture.givenSomeAuthorsExist([
        Author.fromData({ id: "author-1", name: "Victor Hugo" }),
      ]);
      fixture.givenSomePoemsExists([
        poemBuilder()
          .withId("poem-1")
          .withTitle("My Poem")
          .withAuthorId("author-1")
          .build(),
      ]);

      await fixture.whenUserSearchPoemsWith({ authorName: "eric evans" });

      await fixture.thenSearchResultShouldBe([
        {
          id: "poem-1",
          title: "My Poem",
          author: "Victor Hugo",
        },
      ]);
    });
  });

  describe("By Title", () => {
    it("Eric can search poems by its title or parts of its title", async () => {
      authorsFixture.givenSomeAuthorsExist([
        Author.fromData({ id: "author-1", name: "Victor Hugo" }),
      ]);
      fixture.givenSomePoemsExists([
        poemBuilder()
          .withId("poem-1")
          .withAuthorId("author-1")
          .withTitle("My poem")
          .build(),
        poemBuilder().withId("poem-2").withTitle("The Road Not Take").build(),
        poemBuilder().withId("poem-3").withTitle("To Autumn").build(),
        poemBuilder()
          .withId("poem-4")
          .withAuthorId("author-1")
          .withTitle("My second poem")
          .build(),
        poemBuilder()
          .withId("poem-5")
          .withAuthorId("author-1")
          .withTitle("My third poem")
          .build(),
      ]);

      await fixture.whenUserSearchPoemsWith({ title: "poem" });

      await fixture.thenSearchResultShouldBe([
        {
          id: "poem-1",
          title: "My poem",
          author: "Victor Hugo",
        },
        {
          id: "poem-4",
          title: "My second poem",
          author: "Victor Hugo",
        },
        {
          id: "poem-5",
          title: "My third poem",
          author: "Victor Hugo",
        },
      ]);
    });

    it("Eric can search poems by title regardless of case-sensitive", async () => {
      authorsFixture.givenSomeAuthorsExist([
        Author.fromData({ id: "author-1", name: "Victor Hugo" }),
      ]);
      fixture.givenSomePoemsExists([
        poemBuilder()
          .withId("poem-1")
          .withAuthorId("author-1")
          .withTitle("My poEm")
          .build(),
        poemBuilder().withId("poem-2").withTitle("The Road Not Take").build(),
        poemBuilder().withId("poem-3").withTitle("To Autumn").build(),
        poemBuilder()
          .withId("poem-4")
          .withAuthorId("author-1")
          .withTitle("My second POEM")
          .build(),
        poemBuilder()
          .withId("poem-5")
          .withAuthorId("author-1")
          .withTitle("My third poeM")
          .build(),
      ]);

      await fixture.whenUserSearchPoemsWith({ title: "poem" });

      await fixture.thenSearchResultShouldBe([
        {
          id: "poem-1",
          title: "My poEm",
          author: "Victor Hugo",
        },
        {
          id: "poem-4",
          title: "My second POEM",
          author: "Victor Hugo",
        },
        {
          id: "poem-5",
          title: "My third poeM",
          author: "Victor Hugo",
        },
      ]);
    });
  });

  describe("By Title and Author", () => {
    it("Eric can search poems combining title and author in search", async () => {
      authorsFixture.givenSomeAuthorsExist([
        Author.fromData({ id: "author-1", name: "Victor Hugo" }),
        Author.fromData({ id: "author-2", name: "Robert Frost" }),
      ]);
      fixture.givenSomePoemsExists([
        poemBuilder()
          .withId("poem-1")
          .withAuthorId("author-1")
          .withTitle("My poem")
          .build(),
        poemBuilder().withId("poem-2").withTitle("The Road Not Take").build(),
        poemBuilder().withId("poem-3").withTitle("To Autumn").build(),
        poemBuilder()
          .withId("poem-4")
          .withAuthorId("author-2")
          .withTitle("My poem")
          .build(),
        poemBuilder()
          .withId("poem-5")
          .withAuthorId("author-1")
          .withTitle("My second poem")
          .build(),
      ]);

      await fixture.whenUserSearchPoemsWith({
        authorName: "Victor Hugo",
        title: "My Poem",
      });

      await fixture.thenSearchResultShouldBe([
        {
          id: "poem-1",
          title: "My poem",
          author: "Victor Hugo",
        },
      ]);
    });
  });
});
