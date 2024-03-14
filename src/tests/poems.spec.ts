import { describe, it, beforeEach } from "bun:test";
import { poemBuilder } from "./poem.builder";
import { type PoemsFixture, createPoemsFixture } from "./poems.fixture";
import { PoemNotFoundError } from "../application/poems.repository";

describe("Poems", () => {
  let fixture: PoemsFixture;

  beforeEach(() => {
    fixture = createPoemsFixture();
  });

  describe("Feature: Find all", () => {
    it("Should return all the poems", async () => {
      fixture.givenSomePoemsExists([
        poemBuilder().withId("p-1").build(),
        poemBuilder().withId("p-2").build(),
        poemBuilder().withId("p-3").build(),
      ]);

      await fixture.whenGettingAllThePoems();

      fixture.thenPoemsShouldBe([
        poemBuilder().withId("p-1").build(),
        poemBuilder().withId("p-2").build(),
        poemBuilder().withId("p-3").build(),
      ]);
    });
  });

  describe("Feature: Find by ID", () => {
    it("Should return the poem with given ID", async () => {
      fixture.givenSomePoemsExists([poemBuilder().withId("p-1").build()]);

      await fixture.whenGettingAPoemByItsId("p-1");

      await fixture.thenPoemShouldBe(poemBuilder().withId("p-1").build());
    });

    it("When a poem with the given ID does not exist, then it should throw an error", async () => {
      fixture.givenSomePoemsExists([poemBuilder().withId("p-1").build()]);

      await fixture.whenGettingAPoemByItsId("p-2");

      fixture.thenErrorShouldBe(PoemNotFoundError);
    });
  });

  describe("Feature: Find by title", () => {
    it("Should return the poem with the given title", async () => {
      fixture.givenSomePoemsExists([
        poemBuilder().withTitle("My Poem").build(),
      ]);

      await fixture.whenGettingAPoemByItsTitle("My Poem");

      await fixture.thenPoemShouldBe(
        poemBuilder().withTitle("My Poem").build(),
      );
    });

    it("When a poem with the given title does not exist, then it should throw an error", async () => {
      fixture.givenSomePoemsExists([
        poemBuilder().withTitle("My Poem").build(),
      ]);

      await fixture.whenGettingAPoemByItsTitle("My second poem");

      fixture.thenErrorShouldBe(PoemNotFoundError);
    });
  });

  describe("Feature: Find by Author ID", () => {
    it("Should return the poem with the given Author ID", async () => {
      fixture.givenSomePoemsExists([
        poemBuilder().withAuthorId("author-1").build(),
      ]);

      await fixture.whenGettingAPoemByAuthorId("author-1");

      await fixture.thenPoemShouldBe(
        poemBuilder().withAuthorId("author-1").build(),
      );
    });

    it("When a poem with the given author ID does not exist, then it should throw an error", async () => {
      fixture.givenSomePoemsExists([
        poemBuilder().withAuthorId("author-1").build(),
      ]);

      await fixture.whenGettingAPoemByAuthorId("author-2");

      fixture.thenErrorShouldBe(PoemNotFoundError);
    });
  });
});
