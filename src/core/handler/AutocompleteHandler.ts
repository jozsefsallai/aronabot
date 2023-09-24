import { AutocompleteInteraction } from 'discord.js';
import { HandlerContext } from './IBaseHandler';
import BaseHandler from './BaseHandler';

export type AutocompleteContext<T = AutocompleteInteraction> =
  HandlerContext<T>;

class AutocompleteHandler extends BaseHandler<AutocompleteInteraction> {}

export default AutocompleteHandler;
