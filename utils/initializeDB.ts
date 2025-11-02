import path from "path";
import fs from "fs";
import { Db } from "../types/types.js";

export function initializeDB(): Db {
  //============ CONSIGO LA RUTA EXACTA ============//
  const dbPath = path.join(process.cwd(), "db.json");

  // Si no exite devuelvo un objeto vacio
  if (!fs.existsSync(dbPath)) {
    console.log("No se encontró db.json, iniciando con base de datos vacía.");
    return {};
  }

  try {
    // ============ HAGO LA LECTURA ============ //
    const dbJsonContent = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbJsonContent);
    console.log("Base de datos cargada desde db.json.");
    return db;
  } catch (e: any) {
    console.error(
      `Error al parsear db.json: ${e.message}. Iniciando con base de datos vacía.`
    );
    return {};
  }
}
