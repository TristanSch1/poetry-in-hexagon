import { ViewAuthorsUseCase } from "../../application/use-cases/view-authors.usecase";
import { Author } from "../../domain/author";
import { InMemoryAuthorRepository } from "../../infra/memory/authors.inmemory.repository";
import { expect } from "bun:test";

export const createAuthorsFixture = () => {
  let authorList: { id: string; name: string }[] = [];
  const authorRepository = new InMemoryAuthorRepository();
  const viewAuthorsUseCase = new ViewAuthorsUseCase(authorRepository);
  let thrownError: any;

  return {
    givenSomeAuthorsExist(_authors: Author[]) {
      authorRepository.givenSomeAuthorsExist(_authors);
    },
    async whenUserSeeTheAuthorList() {
      const result = await viewAuthorsUseCase.execute();

      if (result.isErr()) {
        thrownError = result.error;
        return;
      }

      authorList = result.value;
    },
    async thenAuthorsToSeeAre(expectedAuthors: { id: string; name: string }[]) {
      expect(authorList).toEqual(expectedAuthors);
    },
    authorRepository,
  };
};

export type AuthorsFixture = ReturnType<typeof createAuthorsFixture>;
