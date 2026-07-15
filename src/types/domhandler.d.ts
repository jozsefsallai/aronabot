declare module "domhandler" {
  export interface Node {
    type: string;
  }

  export interface Element extends Node {
    name: string;
    attribs: Record<string, string>;
    children: Node[];
  }

  export type AnyNode = Element | Node;
}
