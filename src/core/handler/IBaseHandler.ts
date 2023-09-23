import Client from '../client';

export interface HandlerContext<T> {
  interaction: T;
  client: Client;
  uniqueId?: string;
}

export interface EventHandlerMap<T> {
  [id: string]: (ctx: HandlerContext<T>) => void | Promise<void>;
}

export interface IBaseHandler<T> {
  on(id: string, handler: (ctx: HandlerContext<T>) => void): void;
  off(id: string): void;
  emit(id: string, ctx: HandlerContext<T>): void | Promise<void>;
}
