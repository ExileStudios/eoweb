import { Ecf, Eif, Emf, Enf, EoReader, EoWriter, Esf } from 'eolib';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

type PubsKey = 'eif' | 'enf' | 'ecf' | 'esf';

interface DB extends DBSchema {
  pubs: {
    key: PubsKey;
    value: Uint8Array;
  };
  maps: {
    key: number;
    value: Uint8Array;
  };
}

let dbPromise: Promise<IDBPDatabase<DB>>;

function getDb(): Promise<IDBPDatabase<DB>> {
  if (!dbPromise) {
    dbPromise = openDB<DB>('db', 1, {
      upgrade(db) {
        db.createObjectStore('pubs');
        db.createObjectStore('maps');
      },
    });
  }
  return dbPromise;
}

export async function getEmf(id: number): Promise<Emf | null> {
  const db = await getDb();
  const buf = await db.get('maps', id);
  if (!buf) {
    return null;
  }

  const reader = new EoReader(buf);
  return Emf.deserialize(reader);
}

export function saveEmf(id: number, emf: Emf) {
  getDb().then((db) => {
    const writer = new EoWriter();
    Emf.serialize(writer, emf);
    db.put('maps', writer.toByteArray(), id);
  });
}

export async function getEif(): Promise<Eif | null> {
  const db = await getDb();
  const buf = await db.get('pubs', 'eif');
  if (!buf) {
    return null;
  }

  const reader = new EoReader(buf);
  return Eif.deserialize(reader);
}

export function saveEif(eif: Eif) {
  getDb().then((db) => {
    const writer = new EoWriter();
    Eif.serialize(writer, eif);
    db.put('pubs', writer.toByteArray(), 'eif');
  });
}

export async function getEcf(): Promise<Ecf | null> {
  const db = await getDb();
  const buf = await db.get('pubs', 'ecf');
  if (!buf) {
    return null;
  }

  const reader = new EoReader(buf);
  return Ecf.deserialize(reader);
}

export function saveEcf(ecf: Ecf) {
  getDb().then((db) => {
    const writer = new EoWriter();
    Ecf.serialize(writer, ecf);
    db.put('pubs', writer.toByteArray(), 'ecf');
  });
}

export async function getEnf(): Promise<Enf | null> {
  const db = await getDb();
  const buf = await db.get('pubs', 'enf');
  if (!buf) {
    return null;
  }

  const reader = new EoReader(buf);
  return Enf.deserialize(reader);
}

export function saveEnf(enf: Enf) {
  getDb().then((db) => {
    const writer = new EoWriter();
    Enf.serialize(writer, enf);
    db.put('pubs', writer.toByteArray(), 'enf');
  });
}

export async function getEsf(): Promise<Esf | null> {
  const db = await getDb();
  const buf = await db.get('pubs', 'esf');
  if (!buf) {
    return null;
  }

  const reader = new EoReader(buf);
  return Esf.deserialize(reader);
}

export function saveEsf(esf: Esf) {
  getDb().then((db) => {
    const writer = new EoWriter();
    Esf.serialize(writer, esf);
    db.put('pubs', writer.toByteArray(), 'esf');
  });
}
