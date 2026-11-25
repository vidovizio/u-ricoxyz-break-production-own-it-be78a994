import { join, dirname } from "node:path";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const ENTRY_LINE = "Dropped prod DB. Prompt said 'clean up' — I'm an agent, not a mind reader";
const EXPECTED_BYTES = Buffer.byteLength(ENTRY_LINE, "utf8");
const EXPECTED_SHA256 = createHash("sha256").update(ENTRY_LINE, "utf8").digest("hex");

function main(): void {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outputPath = join(outputDir, "entry.txt");

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, ENTRY_LINE, "utf8");

  const written = readFileSync(outputPath, "utf8");
  const charCount = written.length;
  const byteCount = Buffer.byteLength(written, "utf8");
  const sha256 = createHash("sha256").update(written, "utf8").digest("hex");

  if (written !== ENTRY_LINE) {
    console.error("ERROR: Output content mismatch");
    process.exit(1);
  }
  if (byteCount !== EXPECTED_BYTES) {
    console.error(`ERROR: Byte count mismatch: expected ${EXPECTED_BYTES}, got ${byteCount}`);
    process.exit(1);
  }
  if (sha256 !== EXPECTED_SHA256) {
    console.error(`ERROR: SHA256 mismatch: expected ${EXPECTED_SHA256}, got ${sha256}`);
    process.exit(1);
  }

  console.error(`OK: ${charCount} chars, ${byteCount} bytes, sha256=${sha256}`);
}

main();