import { describe, it, expect, beforeEach } from "bun:test";
import { poemBuilder } from "./poem.builder";
import { Poem } from "../../domain/poem";
import { InMemoryPoemsRepository } from "../../infra/memory/poems.inmemory.repository";
import { ReadPoemUseCase } from "../../application/use-cases/read-poem.usecase";
import { PoemNotFoundError } from "../../application/poem.repository";

describe("Feature: Read Poem", () => {
  let fixture: ReadPoemFixture;

  beforeEach(() => {
    fixture = createReadPoemFixture();
  });

  it("Eric can read a poem", async () => {
    fixture.givenSomePoemsExist([
      poemBuilder()
        .withId("poem-1")
        .addStanza([
          "Voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
          "Sed ut perspiciatis, unde omnis veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
        ])
        .addStanza([
          "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis.",
          "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore.",
        ])
        .build(),
    ]);

    await fixture.whenUserReadPoem("poem-1");

    fixture.thenUserShouldSee([
      [
        "Voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
        "Sed ut perspiciatis, unde omnis veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
      ],
      [
        "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis.",
        "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore.",
      ],
    ]);
  });

  it("If Eric try to read a non existing poem, then it should throw an error", async () => {
    fixture.givenSomePoemsExist([
      poemBuilder()
        .withId("poem-1")
        .addStanza([
          "Voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
          "Sed ut perspiciatis, unde omnis veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
        ])
        .addStanza([
          "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis.",
          "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore.",
        ])
        .build(),
    ]);

    await fixture.whenUserReadPoem("poem-2");

    fixture.thenErrorShouldBe(PoemNotFoundError);
  });
});

export const createReadPoemFixture = () => {
  const poemRepository = new InMemoryPoemsRepository();
  const readPoemUseCase = new ReadPoemUseCase(poemRepository);
  let content: string[][];
  let thrownError: any;

  return {
    givenSomePoemsExist(poems: Poem[]) {
      poemRepository.givenSomePoems(poems);
    },

    async whenUserReadPoem(id: string) {
      const result = await readPoemUseCase.execute({ poemId: id });

      if (result.isErr()) {
        thrownError = result.error;
        return;
      }

      content = result.value;
    },

    thenUserShouldSee(expectedContent: string[][]) {
      expect(content).toEqual(expectedContent);
    },

    thenErrorShouldBe(error: new () => Error) {
      expect(thrownError).toBeInstanceOf(error);
    },
  };
};

export type ReadPoemFixture = ReturnType<typeof createReadPoemFixture>;
