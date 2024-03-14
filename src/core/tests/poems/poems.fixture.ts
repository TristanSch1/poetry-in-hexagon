import { type AuthorRepository } from "../../application/author.repository";
import {
  type SearchPoemsCommand,
  SearchPoemsUseCase,
} from "../../application/use-cases/search-poems.usecase";
import { Poem } from "../../domain/poem";
import { InMemoryPoemsRepository } from "../../infra/memory/poems.inmemory.repository";
import { expect } from "bun:test";

export const createPoemsFixture = (authorRepository: AuthorRepository) => {
  const poemRepository = new InMemoryPoemsRepository();
  const searchPoemsUseCase = new SearchPoemsUseCase(
    poemRepository,
    authorRepository,
  );

  let poem: Poem;

  let thrownError: any;

  let searchResult: {
    id: string;
    title: string;
    author: string;
  }[];
  return {
    givenSomePoemsExists(_poems: Poem[]) {
      poemRepository.givenSomePoems(_poems);
    },

    async whenUserSearchPoemsWith(command: SearchPoemsCommand) {
      const result = await searchPoemsUseCase.execute(command);

      if (result.isErr()) {
        thrownError = result.error;
        return;
      }

      searchResult = result.value;
    },

    async thenSearchResultShouldBe(
      expectedResult: {
        id: string;
        title: string;
        author: string;
      }[],
    ) {
      expect(searchResult).toEqual(expectedResult);
    },
  };
};

export type PoemsFixture = ReturnType<typeof createPoemsFixture>;
