/**
 * Database Seed Script
 * Run with: npm run seed
 *
 * What it does:
 * 1. Connects to MongoDB
 * 2. Upserts all 21 patterns (won't duplicate on re-run)
 * 3. Upserts all problems linked to their pattern
 */

import mongoose from "mongoose";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env from backend root (works regardless of where you run from)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

import { Pattern } from "../models/Pattern.model.js";
import { Problem } from "../models/Problem.model.js";
import { patternsSeed } from "./patterns.seed.js";

// Import all problem sets
import { twoPointersProblems }        from "./problems/twoPointers.seed.js";
import { fastSlowPointersProblems }   from "./problems/fastSlowPointers.seed.js";
import { slidingWindowProblems }      from "./problems/slidingWindow.seed.js";
import { cyclicSortProblems }         from "./problems/cyclicSort.seed.js";
import { linkedListReversalProblems } from "./problems/linkedListReversal.seed.js";
import { mergeIntervalsProblems }     from "./problems/mergeIntervals.seed.js";
import { stackProblems }              from "./problems/stack.seed.js";
import { monotonicStackProblems }     from "./problems/monotonicStack.seed.js";
import { hashMapProblems }            from "./problems/hashMap.seed.js";
import { treeBFSProblems }            from "./problems/treeBFS.seed.js";
import { treeDFSProblems }            from "./problems/treeDFS.seed.js";
import { graphProblems }              from "./problems/graph.seed.js";
import { subsetsProblems }            from "./problems/subsets.seed.js";
import { binarySearchProblems }       from "./problems/binarySearch.seed.js";
import { twoHeapsProblems }           from "./problems/twoHeaps.seed.js";
import { bitwiseXorProblems }         from "./problems/bitwiseXor.seed.js";
import { kWayMergeProblems }          from "./problems/kWayMerge.seed.js";
import { greedyProblems }             from "./problems/greedy.seed.js";
import { knapsackProblems }           from "./problems/knapsack.seed.js";
import { trieProblems }               from "./problems/trie.seed.js";
import { unionFindProblems }          from "./problems/unionFind.seed.js";

// Maps pattern name → array of problems
// ⚠️ Names must exactly match patternsSeed[].name
const PROBLEM_GROUPS = [
  { pattern: "Two Pointers",                    data: twoPointersProblems },
  { pattern: "Fast & Slow Pointers",            data: fastSlowPointersProblems },
  { pattern: "Sliding Window",                  data: slidingWindowProblems },
  { pattern: "Cyclic Sort",                     data: cyclicSortProblems },
  { pattern: "In-place Reversal of Linked List",data: linkedListReversalProblems },
  { pattern: "Merge Intervals",                 data: mergeIntervalsProblems },
  { pattern: "Stack",                           data: stackProblems },
  { pattern: "Monotonic Stack",                 data: monotonicStackProblems },
  { pattern: "Hash Map",                        data: hashMapProblems },
  { pattern: "Tree BFS",                        data: treeBFSProblems },
  { pattern: "Tree DFS",                        data: treeDFSProblems },
  { pattern: "Graph",                           data: graphProblems },
  { pattern: "Subsets",                         data: subsetsProblems },
  { pattern: "Binary Search",                   data: binarySearchProblems },
  { pattern: "Two Heaps",                       data: twoHeapsProblems },
  { pattern: "Bitwise XOR",                     data: bitwiseXorProblems },
  { pattern: "K-Way Merge",                     data: kWayMergeProblems },
  { pattern: "Greedy",                          data: greedyProblems },
  { pattern: "0/1 Knapsack",                    data: knapsackProblems },
  { pattern: "Trie",                            data: trieProblems },
  { pattern: "Union Find",                      data: unionFindProblems },
];

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI not found in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB…");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to:", mongoose.connection.name);

  // ── Step 1: Seed patterns ──────────────────────────────────────
  console.log("\n📚 Seeding patterns…");
  const patternMap = {}; // name → _id

  for (const p of patternsSeed) {
    const doc = await Pattern.findOneAndUpdate(
      { name: p.name },
      { $set: p },
      { upsert: true, new: true }
    );
    patternMap[p.name] = doc._id;
  }
  console.log(`✅ ${Object.keys(patternMap).length} patterns upserted`);

  // ── Step 2: Seed problems ──────────────────────────────────────
  console.log("\n📝 Seeding problems…");
  let total = 0;
  let skipped = 0;

  for (const group of PROBLEM_GROUPS) {
    const patternId = patternMap[group.pattern];

    if (!patternId) {
      console.warn(`  ⚠️  Pattern not found: "${group.pattern}" — skipping`);
      skipped++;
      continue;
    }

    for (const p of group.data) {
      await Problem.findOneAndUpdate(
        { title: p.title },
        {
          $set: {
            title:        p.title,
            difficulty:   p.difficulty,
            topicTags:    p.topicTags || [],
            leetcodeLink: p.leetcode  || "",
            gfgLink:      p.gfg       || "",
            pattern:      patternId,
          },
        },
        { upsert: true, new: true }
      );
      total++;
    }

    console.log(`  ✓ ${group.pattern}: ${group.data.length} problems`);
  }

  console.log(`\n✅ ${total} problems upserted, ${skipped} groups skipped`);
  console.log("🎉 Seed complete!\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
