export type Stanza = string[];

export interface PoemProps {
  id: string;
  title: string;
  stanzas: Stanza[];
  author_id: string;
}

export class Poem {
  constructor(private readonly props: PoemProps) {}

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get authorId() {
    return this.props.author_id;
  }

  get stanzas() {
    return this.props.stanzas;
  }

  get data() {
    return {
      id: this.props.id,
      title: this.props.title,
      stanzas: this.props.stanzas,
      author_id: this.props.author_id,
    };
  }

  static fromData(data: Poem["data"]) {
    return new Poem(data);
  }
}
