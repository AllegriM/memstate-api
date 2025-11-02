import { Db } from "./types";

// modificamos el tipado de express
declare module "express-serve-static-core" {
  // Le agregamos a la request el db
  interface Request {
    db: Db;
  }
}
