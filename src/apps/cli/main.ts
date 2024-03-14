import { Command } from "commander";
import { FileSystemPoemsRepository } from "../../core/infra/file-system/poems.fs.repository";
import { ViewAllPoemsUseCase } from "../../core/application/use-cases/view-all-poems.usecase";
import {
  SearchPoemsUseCase,
  type SearchPoemsCommand,
} from "../../core/application/use-cases/search-poems.usecase";
import { FileSystemAuthorRepository } from "../../core/infra/file-system/authors.fs.repository";
import {
  ReadPoemUseCase,
  type ReadPoemCommand,
} from "../../core/application/use-cases/read-poem.usecase";
import { ViewAuthorsUseCase } from "../../core/application/use-cases/view-authors.usecase";

const poemRepository = new FileSystemPoemsRepository();
const authorRepository = new FileSystemAuthorRepository();
const findAllPoemsUseCase = new ViewAllPoemsUseCase(poemRepository);
const searchPoemsUseCase = new SearchPoemsUseCase(
  poemRepository,
  authorRepository,
);
const viewAuthorsUseCase = new ViewAuthorsUseCase(authorRepository);
const readPoemUseCase = new ReadPoemUseCase(poemRepository);

const program = new Command();
program
  .version("1.0.0")
  .description("Poetry in hexagon")
  .addCommand(
    new Command("find-all").action(async () => {
      const result = await findAllPoemsUseCase.execute();

      if (result.isErr()) {
        console.error("❌", result.error);
        process.exit(1);
      }

      console.log("Here is your poems 📖");
      console.table(result.value, ["id", "title"]);
    }),
  )
  .addCommand(
    new Command("search")
      .option("-t, --title <honorific>")
      .option("-i, --id <honorific>")
      .option("-a, --authorName <honorific>")
      .action(async (options) => {
        console.log("OPTIONS: ", options);
        const command: SearchPoemsCommand = {};

        if (options.id) {
          command.id = options.id;
        }
        if (options.title) {
          command.title = options.title;
        }
        if (options.authorName) {
          command.authorName = options.authorName;
        }

        const result = await searchPoemsUseCase.execute(command);

        if (result.isErr()) {
          console.error("❌", result.error);
          process.exit(1);
        }

        console.log("🔎 Search results 🔎");
        console.table(result.value);
      }),
  )
  .addCommand(
    new Command("view-authors").action(async () => {
      const result = await viewAuthorsUseCase.execute();

      if (result.isErr()) {
        console.error("❌", result.error);
        process.exit(1);
      }

      console.table(result.value);
    }),
  )
  .addCommand(
    new Command("read")
      .argument("<poemId>", "The id of the poem you want to read")
      .action(async (poemId) => {
        const command: ReadPoemCommand = {
          poemId,
        };

        const result = await readPoemUseCase.execute(command);

        if (result.isErr()) {
          console.error("❌", result.error);
          process.exit(1);
        }

        console.log("Here is your poem 🤓\n");
        result.value.forEach((stanza) => {
          console.log(stanza.join("\n"));
          console.log("\n");
        });
      }),
  );

export async function mainCLI() {
  await program.parseAsync();
}
