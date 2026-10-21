export const patternsSeed = [
  {
    name: "Two Pointers",
    description: "Uses two indices to traverse a data structure efficiently.",
    keywords: ["sorted array", "pair", "triplet", "remove duplicates"],
    subPatterns: [
      { title: "Opposite Ends", description: "One pointer at start, one at end." },
      { title: "Same Direction", description: "Both pointers move forward." },
      { title: "Fast & Slow", description: "Pointers move at different speeds." }
    ],
    whenToUse: [
      "Input is sorted",
      "Need O(n) solution",
      "Pair or triplet problems"
    ],
    whenNotToUse: [
      "Unsorted data without preprocessing",
      "Order must remain unchanged"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    codeTemplate: `l = 0
r = n - 1
while l < r:
  process(l, r)
  l += 1
  r -= 1`
  },

  {
    name: "Sliding Window",
    description: "Maintains a window range to process subarrays efficiently.",
    keywords: ["subarray", "substring", "window", "maximum", "minimum"],
    subPatterns: [
      { title: "Fixed Window", description: "Window size remains constant." },
      { title: "Variable Window", description: "Window expands and shrinks." }
    ],
    whenToUse: [
      "Contiguous subarray problems",
      "Optimizing nested loops"
    ],
    whenNotToUse: [
      "Non-contiguous data",
      "Global comparisons required"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) to O(k)",
    codeTemplate: `start = 0
for end in range(n):
  add(end)
  while invalid:
    remove(start)
    start += 1`
  },

  {
    name: "Fast & Slow Pointers",
    description: "Uses two pointers moving at different speeds.",
    keywords: ["cycle", "linked list", "middle", "loop"],
    subPatterns: [
      { title: "Cycle Detection", description: "Detect loops in linked list." },
      { title: "Middle Element", description: "Find middle node efficiently." }
    ],
    whenToUse: [
      "Cycle detection",
      "Linked list traversal"
    ],
    whenNotToUse: [
      "Random access required",
      "Array index-based problems"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    codeTemplate: `slow = head
fast = head
while fast and fast.next:
  slow = slow.next
  fast = fast.next.next`
  },

  {
    name: "Cyclic Sort",
    description: "Places elements at their correct index by swapping.",
    keywords: ["range 1..n", "missing number", "duplicate", "cyclic"],
    subPatterns: [
      { title: "Index Mapping", description: "Value maps directly to index." }
    ],
    whenToUse: [
      "Numbers in a fixed range",
      "Missing / duplicate problems"
    ],
    whenNotToUse: [
      "Negative numbers",
      "Unknown value ranges"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    codeTemplate: `i = 0
  while i < n:
    j = nums[i] - 1
    if nums[i] != nums[j]:
      swap(nums[i], nums[j])
    else:
      i += 1`
  },

  {
    name: "Merge Intervals",
    description: "Merges overlapping intervals efficiently.",
    keywords: ["interval", "overlap", "merge", "schedule"],
    subPatterns: [
      { title: "Sorting + Merge", description: "Sort by start time first." }
    ],
    whenToUse: [
      "Overlapping time ranges",
      "Calendar or scheduling problems"
    ],
    whenNotToUse: [
      "Discrete unrelated ranges"
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    codeTemplate: `sort intervals by start
  for interval in intervals:
    if overlaps:
      merge
    else:
      add to result`
  },

  {
    name: "In-place Reversal of Linked List",
    description: "Reverses a linked list or sublist in-place.",
    keywords: ["reverse", "linked list", "in-place"],
    subPatterns: [
      { title: "Full Reversal", description: "Reverse entire list." },
      { title: "Partial Reversal", description: "Reverse a sub-list." }
    ],
    whenToUse: [
      "Linked list manipulation",
      "Reverse sequence in-place"
    ],
    whenNotToUse: [
      "Random access required"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    codeTemplate: `prev = null
  curr = head
  while curr:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next`
  },

  {
    name: "Stack",
    description: "Uses LIFO order to process elements with nested or reversed logic.",
    keywords: ["parentheses", "undo", "backtracking", "LIFO"],
    subPatterns: [
      { title: "Expression Evaluation", description: "Evaluate infix/postfix expressions." },
      { title: "Balanced Brackets", description: "Validate parentheses and symbols." }
    ],
    whenToUse: [
      "Nested structures",
      "Reverse processing",
      "Undo / backtracking logic"
    ],
    whenNotToUse: [
      "Random access required"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    codeTemplate: `stack = []
  for item in data:
    if condition:
      stack.push(item)
    else:
      stack.pop()`
  },

  {
    name: "Monotonic Stack",
    description: "Maintains elements in increasing or decreasing order.",
    keywords: ["next greater", "previous smaller", "histogram"],
    subPatterns: [
      { title: "Increasing Stack", description: "Elements increase from bottom to top." },
      { title: "Decreasing Stack", description: "Elements decrease from bottom to top." }
    ],
    whenToUse: [
      "Next/Previous greater or smaller problems",
      "Range-based comparisons"
    ],
    whenNotToUse: [
      "Full pairwise comparison needed"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    codeTemplate: `stack = []
  for i in range(n):
    while stack and stack[-1] < arr[i]:
      stack.pop()
    stack.push(arr[i])`
  },

  {
    name: "Hash Map",
    description: "Stores key-value pairs for constant time lookup.",
    keywords: ["frequency", "count", "lookup", "mapping"],
    subPatterns: [
      { title: "Frequency Map", description: "Count occurrences." },
      { title: "Index Map", description: "Map values to indices." }
    ],
    whenToUse: [
      "Fast lookup needed",
      "Counting or grouping elements"
    ],
    whenNotToUse: [
      "Ordered traversal required"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    codeTemplate: `map = {}
  for x in data:
    map[x] = map.get(x, 0) + 1`
  },

  {
    name: "Tree BFS",
    description: "Traverses a tree level by level using a queue.",
    keywords: ["level order", "queue", "breadth first", "levels"],
    subPatterns: [
      {
        title: "Level Order Traversal",
        description: "Process nodes level by level."
      },
      {
        title: "Zigzag Traversal",
        description: "Alternate direction at each level."
      }
    ],
    whenToUse: [
      "Level-wise processing",
      "Shortest path in unweighted tree",
      "Nearest node problems"
    ],
    whenNotToUse: [
      "Deep recursive structure preferred",
      "Memory is very limited"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    codeTemplate: `queue = [root]
  while queue:
    level = []
    for _ in range(len(queue)):
      node = queue.pop(0)
      level.append(node.val)
      if node.left: queue.append(node.left)
      if node.right: queue.append(node.right)`
  },

  {
    name: "Tree DFS",
    description: "Traverses a tree by exploring depth before breadth.",
    keywords: ["preorder", "inorder", "postorder", "recursion"],
    subPatterns: [
      {
        title: "Preorder",
        description: "Root → Left → Right"
      },
      {
        title: "Inorder",
        description: "Left → Root → Right"
      },
      {
        title: "Postorder",
        description: "Left → Right → Root"
      }
    ],
    whenToUse: [
      "Hierarchical data",
      "Path-based problems",
      "Tree property validation"
    ],
    whenNotToUse: [
      "Level-wise traversal required"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    codeTemplate: `def dfs(node):
    if not node:
      return
    dfs(node.left)
    dfs(node.right)`
  },

  {
    name: "Graph",
    description: "Models relationships using nodes and edges.",
    keywords: ["adjacency list", "cycle", "connected components"],
    subPatterns: [
      {
        title: "Graph BFS",
        description: "Shortest path in unweighted graph."
      },
      {
        title: "Graph DFS",
        description: "Cycle detection and connectivity."
      }
    ],
    whenToUse: [
      "Relationship-based problems",
      "Network traversal",
      "Dependency resolution"
    ],
    whenNotToUse: [
      "Linear data structures"
    ],
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    codeTemplate: `visited = set()
  def dfs(node):
    visited.add(node)
    for nei in graph[node]:
      if nei not in visited:
        dfs(nei)`
  },

  {
    name: "Binary Search",
    description: "Searches efficiently in a sorted search space by halving it.",
    keywords: ["sorted", "mid", "search space", "lower bound", "upper bound"],
    subPatterns: [
      {
        title: "Classic Binary Search",
        description: "Search in sorted array."
      },
      {
        title: "Binary Search on Answer",
        description: "Search the solution space instead of array."
      }
    ],
    whenToUse: [
      "Sorted data",
      "Monotonic search space",
      "Optimization problems"
    ],
    whenNotToUse: [
      "Unsorted data",
      "Non-monotonic conditions"
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    codeTemplate: `l = 0
  r = n - 1
  while l <= r:
    mid = (l + r) // 2
    if ok(mid):
      r = mid - 1
    else:
      l = mid + 1`
  },

  {
    name: "Two Heaps",
    description: "Uses a min heap and max heap together to balance data.",
    keywords: ["median", "priority queue", "stream"],
    subPatterns: [
      {
        title: "Median of Stream",
        description: "Maintain running median."
      }
    ],
    whenToUse: [
      "Median or percentile problems",
      "Streaming data"
    ],
    whenNotToUse: [
      "Static sorted data"
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    codeTemplate: `maxHeap = []
  minHeap = []
  for num in stream:
    add(num)
    balance()
    median = getMedian()`
  },

  {
    name: "K-Way Merge",
    description: "Merges K sorted lists efficiently using a heap.",
    keywords: ["merge", "sorted lists", "heap"],
    subPatterns: [
      {
        title: "Merge Sorted Lists",
        description: "Combine multiple sorted arrays/lists."
      }
    ],
    whenToUse: [
      "Multiple sorted inputs",
      "Merge problems"
    ],
    whenNotToUse: [
      "Unsorted inputs"
    ],
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    codeTemplate: `heap = []
  for each list:
    push first element
  while heap:
    node = pop()
    push next from same list`
  },

  {
    name: "Subsets",
    description: "Generates all possible subsets or combinations of a set.",
    keywords: ["power set", "combinations", "backtracking", "bitmask"],
    subPatterns: [
      {
        title: "Backtracking",
        description: "Build subsets recursively."
      },
      {
        title: "Bitmasking",
        description: "Use bits to represent inclusion/exclusion."
      }
    ],
    whenToUse: [
      "Generate all combinations",
      "Decision-based enumeration"
    ],
    whenNotToUse: [
      "Large input size (exponential growth)"
    ],
    timeComplexity: "O(2^n)",
    spaceComplexity: "O(2^n)",
    codeTemplate: `result = []
  def backtrack(start, path):
    result.append(path)
    for i in range(start, n):
      backtrack(i+1, path+[nums[i]])`
  },

  {
    name: "Bitwise XOR",
    description: "Uses XOR properties to solve problems efficiently.",
    keywords: ["xor", "unique", "odd occurrence", "bitwise"],
    subPatterns: [
      {
        title: "Single Number",
        description: "Find unique element using XOR."
      }
    ],
    whenToUse: [
      "Odd/even occurrence problems",
      "Constant space requirement"
    ],
    whenNotToUse: [
      "Multiple unknown duplicates"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    codeTemplate: `res = 0
  for num in nums:
    res ^= num
  return res`
  },

  {
    name: "Greedy",
    description: "Makes locally optimal choices to reach global optimum.",
    keywords: ["optimal", "choice", "interval", "schedule"],
    subPatterns: [
      {
        title: "Interval Greedy",
        description: "Choose by earliest finish time."
      },
      {
        title: "Resource Allocation",
        description: "Optimize based on constraints."
      }
    ],
    whenToUse: [
      "Optimization problems",
      "Choice property holds"
    ],
    whenNotToUse: [
      "Global decision affects future choices"
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    codeTemplate: `sort by criteria
  for item in items:
    if valid:
      take item`
  },

  {
    name: "0/1 Knapsack",
    description: "Chooses items with maximum value under capacity constraints.",
    keywords: ["dp", "capacity", "weights", "values"],
    subPatterns: [
      {
        title: "Top-Down DP",
        description: "Recursive with memoization."
      },
      {
        title: "Bottom-Up DP",
        description: "Tabulation using 2D or 1D DP."
      }
    ],
    whenToUse: [
      "Optimization with constraints",
      "Include/exclude decisions"
    ],
    whenNotToUse: [
      "Fractional items allowed",
      "Greedy works better"
    ],
    timeComplexity: "O(n * W)",
    spaceComplexity: "O(n * W) or O(W)",
    codeTemplate: `dp = [[0]*(W+1) for _ in range(n+1)]
  for i in range(1, n+1):
    for w in range(W+1):
      if wt[i-1] <= w:
        dp[i][w] = max(dp[i-1][w],
                      val[i-1] + dp[i-1][w-wt[i-1]])
      else:
        dp[i][w] = dp[i-1][w]`
  },

  {
    name: "Trie",
    description: "Tree-based structure for efficient prefix search.",
    keywords: ["prefix", "string", "dictionary", "autocomplete"],
    subPatterns: [
      {
        title: "Insert & Search",
        description: "Basic word insertion and lookup."
      },
      {
        title: "Prefix Matching",
        description: "Find words with common prefix."
      }
    ],
    whenToUse: [
      "String prefix problems",
      "Autocomplete / dictionary"
    ],
    whenNotToUse: [
      "Memory is very limited",
      "Small dataset"
    ],
    timeComplexity: "O(L)",
    spaceComplexity: "O(total characters)",
    codeTemplate: `class TrieNode:
    def __init__(self):
      self.children = {}
      self.end = False`
  },

  {
    name: "Union Find",
    description: "Tracks disjoint sets with union and find operations.",
    keywords: ["disjoint set", "connected components", "cycle detection"],
    subPatterns: [
      {
        title: "Path Compression",
        description: "Flattens tree during find."
      },
      {
        title: "Union by Rank",
        description: "Attach smaller tree to larger."
      }
    ],
    whenToUse: [
      "Dynamic connectivity",
      "Cycle detection in graphs"
    ],
    whenNotToUse: [
      "Need full traversal paths"
    ],
    timeComplexity: "O(α(n))",
    spaceComplexity: "O(n)",
    codeTemplate: `parent = [i for i in range(n)]
  def find(x):
    if parent[x] != x:
      parent[x] = find(parent[x])
    return parent[x]`
  }

];
