import { Request, Response } from "express";

export interface Db {
  [key: string]: any[];
}

export type MirageHandler = (db: Db, req: Request) => any;

export interface ServerContext {
  resource: (ruta: string, data: any[]) => void;
  _createHandler: (
    handler: MirageHandler,
    successCode: number
  ) => (req: Request, res: Response) => Promise<void>;
  delay: (ms: number) => void;
  error: (code: number, body?: object) => any;
  get: (path: string, handler: MirageHandler) => void;
  post: (path: string, handler: MirageHandler) => void;
  put: (path: string, handler: MirageHandler) => void;
  patch: (path: string, handler: MirageHandler) => void;
  delete: (path: string, handler: MirageHandler) => void;
}
