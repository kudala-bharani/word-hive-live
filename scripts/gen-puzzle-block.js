// Export the current puzzles using only the reviewed vocabulary.
// Raw dictionary imports are intentionally unsupported.
async function main() {
  const { puzzles } = await import('../lib/puzzles.js');
  console.log(JSON.stringify(puzzles, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
