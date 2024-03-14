import { type PoemProps, type Stanza, Poem } from "../domain/poem";

export const poemBuilder = ({
  id = "poem-id",
  title = "poem title",
  stanzas = [],
  author_id = "auth-id",
}: Partial<PoemProps> = {}) => {
  const props = { id, title, stanzas, author_id };
  return {
    withId(_id: string) {
      return poemBuilder({
        ...props,
        id: _id,
      });
    },
    withTitle(_title: string) {
      return poemBuilder({
        ...props,
        title: _title,
      });
    },
    withAuthorId(_author_id: string) {
      return poemBuilder({
        ...props,
        author_id: _author_id,
      });
    },
    addStanza(_stanza: Stanza) {
      return poemBuilder({
        ...props,
        stanzas: [...props.stanzas, _stanza],
      });
    },
    build() {
      return new Poem(props);
    },
  };
};
