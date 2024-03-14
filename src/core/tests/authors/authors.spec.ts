import { describe, beforeEach, it } from "bun:test";
import { Author } from "../../domain/author";
import { type AuthorsFixture, createAuthorsFixture } from "./authors.fixture";

describe("Authors", () => {
  let fixture: AuthorsFixture;

  beforeEach(() => {
    fixture = createAuthorsFixture();
  });
  describe("Feature: View all authors", () => {
    it("Eric can see the list of authors", async () => {
      fixture.givenSomeAuthorsExist([
        Author.fromData({
          id: "1",
          name: "Victor Hugo",
        }),
        Author.fromData({
          id: "2",
          name: "Arthur Rimbaud",
        }),
        Author.fromData({
          id: "3",
          name: "Paul Verlaine",
        }),
      ]);

      await fixture.whenUserSeeTheAuthorList();

      await fixture.thenAuthorsToSeeAre([
        {
          id: "1",
          name: "Victor Hugo",
        },
        {
          id: "2",
          name: "Arthur Rimbaud",
        },
        {
          id: "3",
          name: "Paul Verlaine",
        },
      ]);
    });
  });
});
