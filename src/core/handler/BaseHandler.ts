import { EventHandlerMap, HandlerContext, IBaseHandler } from './IBaseHandler';

class BaseHandler<T> implements IBaseHandler<T> {
  private handlers: EventHandlerMap<T> = {};

  public on(id: string, handler: (ctx: HandlerContext<T>) => void): void {
    this.handlers[id] = handler;
  }

  public off(id: string): void {
    delete this.handlers[id];
  }

  public emit(id: string, ctx: HandlerContext<T>): void | Promise<void> {
    if (!this.handlers[id]) {
      return;
    }

    return this.handlers[id](ctx);
  }
}

export default BaseHandler;
