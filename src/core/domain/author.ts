export interface AuthorProps {
  id: string;
  name: string;
}

export class Author {
  constructor(private readonly props: AuthorProps) {}

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get data() {
    return {
      id: this.props.id,
      name: this.props.name,
    };
  }

  static fromData(data: Author["data"]) {
    return new Author(data);
  }
}
