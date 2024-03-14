import { expect } from "bun:test";
import { FindAllPoemsUseCase } from "../application/use-cases/find-all-poems.usecase";
import { Poem } from "../domain/poem";
import { InMemoryPoemsRepository } from "../infra/poems.inmemory.repository";
import { FindPoemByIdUseCase } from "../application/use-cases/find-poem-by-id.usecase";
import { FindPoemByTitleUseCase } from "../application/use-cases/find-poem-by-title.usecase";
import { FindPoemByAuthorIdUseCase } from "../application/use-cases/find-poem-by-author-id.usecase";

export const createPoemsFixture = () => {
  const poemsRepository = new InMemoryPoemsRepository();
  const findAllPoemsUseCase = new FindAllPoemsUseCase(poemsRepository);
  const findPoemByIdUseCase = new FindPoemByIdUseCase(poemsRepository);
  const findPoemByTitleUseCase = new FindPoemByTitleUseCase(poemsRepository);
  const findPoemByAuthorIdUseCase = new FindPoemByAuthorIdUseCase(
    poemsRepository,
  );

  let poem: Poem;

  let thrownError: Error;

  return {
    givenSomePoemsExists(_poems: Poem[]) {
      poemsRepository.givenSomePoems(_poems);
    },
    whenGettingAllThePoems() {
      return findAllPoemsUseCase.execute();
    },

    async whenGettingAPoemByItsId(id: string) {
      const result = await findPoemByIdUseCase.execute({ id });

      if (result.isErr()) {
        thrownError = result.error;
        return;
      }

      poem = result.value;
    },

    async whenGettingAPoemByItsTitle(title: string) {
      const result = await findPoemByTitleUseCase.execute({ title });

      if (result.isErr()) {
        thrownError = result.error;

        return;
      }

      poem = result.value;
    },

    async whenGettingAPoemByAuthorId(authorId: string) {
      const result = await findPoemByAuthorIdUseCase.execute({ authorId });

      if (result.isErr()) {
        thrownError = result.error;
        return;
      }

      poem = result.value;
    },

    async thenPoemsShouldBe(expectedPoems: Poem[]) {
      const poems = await poemsRepository.findAll();
      expect(poems).toEqual(expectedPoems);
    },

    async thenPoemShouldBe(expectedPoem: Poem) {
      expect(poem).toEqual(expectedPoem);
    },

    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type PoemsFixture = ReturnType<typeof createPoemsFixture>;
