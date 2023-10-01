import { Request, Response } from 'express';
import { studentContainer } from '../../containers/students';

export function index(req: Request, res: Response) {
  const data = studentContainer.all();
  res.json(data);
}
