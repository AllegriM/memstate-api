import fs from "fs";
import { initializeDB } from "./utils/initializeDB";
import createError from "http-errors";
import express, { Express, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Db, MirageHandler, ServerContext } from "./types/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let globalDelay = 0;

export async function createServer() {
  const app: Express = express();

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  //========== INICIALIZO LA DB ==============//

  const db: Db = initializeDB();

  //===========================================//
  //========== EXPORTO ESTA CLASE ==============//
  //===========================================//

  const serverContext: ServerContext = {
    resource: function (ruta: string, data: any[]) {
      // Inserta los valores en db.json
      const keyName = ruta.trim().replace("/", "");
      db[keyName] = data;

      // Crea los endpoint que se utilizaran para esa ruta
      this.get(ruta, (db: Db, req: Request) => {
        return db[keyName];
      });
      this.get(ruta + "/:id", (db: Db, req: Request) => {
        const id = +req.params.id;
        const item = db[keyName].find((x) => x.id === id);
        if (item) {
          return item;
        }
        return this.error(404, { error: `Item con id ${id} no encontrado` });
      });
      this.post(ruta, (db: Db, req: Request) => {
        const newId = Date.now();
        const postBody = { id: newId, ...req.body };
        db[keyName].push(postBody);

        return postBody;
      });
      this.put(ruta + "/:id", (db: Db, req: Request) => {
        const id = +req.params.id;
        const index = db[keyName].findIndex((x) => x.id === id);
        if (index > -1) {
          db[keyName][index] = { ...req.body, id: id };
          return db[keyName][index];
        }
        return this.error(404, { error: `Item con id ${id} no encontrado` });
      });
      this.patch(ruta + "/:id", (db: Db, req: Request) => {
        const id = +req.params.id;
        const index = db[keyName].findIndex((x) => x.id === id);
        if (index > -1) {
          const oldItem = db[keyName][index];
          db[keyName][index] = { ...oldItem, ...req.body, id: id };
          return db[keyName][index];
        }
        return this.error(404, { error: `Item con id ${id} no encontrado` });
      });
      this.delete(ruta + "/:id", (db: Db, req: Request) => {
        const id = +req.params.id;
        const index = db[keyName].findIndex((x) => x.id === id);

        if (index > -1) {
          const deletedItem = db[keyName].splice(index, 1);
          return deletedItem[0];
        }
        return this.error(404, { error: `Item con id ${id} no encontrado` });
      });
    },

    error: function (code: number, body: object = {}) {
      return {
        __isApiMirageError: true,
        code: code,
        body: body,
      };
    },

    delay: function (ms: number) {
      console.log(`Estableciendo delay global a ${ms}ms`);
      globalDelay = ms;
    },

    _createHandler: (handler: MirageHandler, successCode: number) => {
      return async (req: Request, res: Response) => {
        try {
          if (globalDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, globalDelay));
          }

          const result = await handler(db, req);

          if (result && result.__isApiMirageError === true) {
            res.status(result.code).json(result.body);
          } else {
            res.status(successCode).json(result);
          }
        } catch (e: any) {
          res.status(500).json({
            error: "Error interno del servidor en el handler",
            message: e.message,
          });
        }
      };
    },

    get: function (path: string, handler: MirageHandler) {
      app.get(path, this._createHandler(handler, 200));
    },
    post: function (path: string, handler: MirageHandler) {
      app.post(path, this._createHandler(handler, 201));
    },
    put: function (path: string, handler: MirageHandler) {
      app.put(path, this._createHandler(handler, 200));
    },
    patch: function (path: string, handler: MirageHandler) {
      app.patch(path, this._createHandler(handler, 200));
    },
    delete: function (path: string, handler: MirageHandler) {
      app.delete(path, this._createHandler(handler, 200));
    },
  };
  //===========================================//
  //========== CREACION DE RUTAS ==============//
  //===========================================//
  const configPath = path.join(process.cwd(), "memstate-config.ts");
  if (fs.existsSync(configPath)) {
    console.log("Cargando configuración desde memstate-config.ts...");
    const { default: config } = await import(configPath);

    if (config.routes) {
      config.routes(serverContext);

      console.log("Rutas personalizadas (estilo Argumento) cargadas.");
    }
  }

  //===========================================//
  //============ PASAR DB A RUTAS ============//
  //===========================================//

  app.use(function (req, res, next) {
    req.db = db;
    next();
  });

  //===========================================//

  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.send("error");
  });

  return app;
}
