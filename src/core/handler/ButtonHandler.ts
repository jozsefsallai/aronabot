import { ButtonInteraction } from 'discord.js';
import BaseHandler from './BaseHandler';
import { HandlerContext } from './IBaseHandler';

export type ButtonContext = HandlerContext<ButtonInteraction>;

class ButtonHandler extends BaseHandler<ButtonInteraction> {}

export default ButtonHandler;
