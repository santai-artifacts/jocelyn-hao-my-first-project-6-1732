import Database from "bun:sqlite";
import { mkdirSync } from "fs";

mkdirSync("./data", { recursive: true });

const db = new Database(process.env.DATABASE_URL || "./data/cats.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS cats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age INTEGER NOT NULL,
    description TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS fun_facts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fact TEXT NOT NULL
  );
`);

// Seed cats if empty
const catCount = db.query("SELECT COUNT(*) as c FROM cats").get() as { c: number };
if (catCount.c === 0) {
  const insert = db.prepare(
    "INSERT INTO cats (name, breed, age, description, emoji) VALUES (?, ?, ?, ?, ?)"
  );
  [
    ["Luna", "Siamese", 3, "A vocal and affectionate companion who loves to chat and snuggle.", "🐱"],
    ["Oliver", "Maine Coon", 5, "Gentle giant with tufted ears and a playful spirit. Loves water!", "🦁"],
    ["Mochi", "Scottish Fold", 2, "Perpetually surprised face, tiny paws, and an enormous personality.", "😸"],
    ["Shadow", "Black Domestic Shorthair", 7, "Mysterious and wise. A master of the dramatic midnight sprint.", "🐈‍⬛"],
    ["Cleo", "Egyptian Mau", 4, "Naturally spotted and lightning fast. Loyal as a dog, graceful as royalty.", "🐆"],
    ["Biscuit", "Ragdoll", 1, "Flops into your arms on command. Named for his biscuit-making paw kneads.", "🍞"],
  ].forEach((c) => insert.run(...c as [string, string, number, string, string]));
}

// Seed facts if empty
const factCount = db.query("SELECT COUNT(*) as c FROM fun_facts").get() as { c: number };
if (factCount.c === 0) {
  const insertFact = db.prepare("INSERT INTO fun_facts (fact) VALUES (?)");
  [
    "Cats spend 70% of their lives sleeping — about 13–16 hours a day.",
    "A group of cats is called a clowder.",
    "Cats have 32 muscles in each ear, giving them incredible directional hearing.",
    "A cat's nose print is as unique as a human fingerprint.",
    "Cats can rotate their ears 180 degrees independently.",
    "The oldest known pet cat existed 9,500 years ago in Cyprus.",
    "Cats can jump up to 6 times their own body length.",
    "A cat's purr vibrates at 25–150 Hz, which may promote bone healing.",
    "Cats have a third eyelid called the nictitating membrane.",
    "House cats share 95.6% of their genetic makeup with tigers.",
  ].forEach((f) => insertFact.run(f));
}

export default db;
