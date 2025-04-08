- [🔍 **Dijkstra’s Algorithm: Overview \& Why Use It**](#-dijkstras-algorithm-overview--why-use-it)
  - [🚦 **Purpose**:](#-purpose)
- [🧠 **How This Implementation Works**:](#-how-this-implementation-works)
- [⚙️ **Why Choose Dijkstra?**](#️-why-choose-dijkstra)
- [🧮 **Time Complexity**:](#-time-complexity)
- [🎯 **Why Dijkstra’s Algorithm Is the Best Choice in Certain Scenarios**](#-why-dijkstras-algorithm-is-the-best-choice-in-certain-scenarios)
- [✅ **1. Efficient for Single-Source Shortest Paths in Sparse Graphs**](#-1-efficient-for-single-source-shortest-paths-in-sparse-graphs)
- [✅ **2. Non-Negative Weights**](#-2-non-negative-weights)
- [✅ **3. Only Need Path From One Source**](#-3-only-need-path-from-one-source)
- [✅ **Deterministic and Simple**](#-deterministic-and-simple)
- [✨ **Use Case Examples Where Dijkstra Excels**:](#-use-case-examples-where-dijkstra-excels)

---

### 🔍 **Dijkstra’s Algorithm: Overview & Why Use It**

#### 🚦 **Purpose**:
Find the **shortest path** from a `start` node to an `end` node in a **weighted graph** (non-negative edge weights).

---

### 🧠 **How This Implementation Works**:

1. **Initialize**:
   - `distances`: all nodes set to `∞` (except start = 0)
   - `prev_nodes`: used to reconstruct path later
   - `queue`: a min-heap priority queue of (distance, node)

2. **Explore**:
   - Pop the node with the smallest distance.
   - For each neighbor, if a **shorter path** is found:
     - Update its distance.
     - Track the path using `prev_nodes`.
     - Push the neighbor into the heap.

3. **Path Reconstruction**:
   - Backtrack from `end` using `prev_nodes` to build the shortest path.

---

### ⚙️ **Why Choose Dijkstra?**

| Feature | Benefit |
|--------|---------|
| ✅ Guarantees shortest path | For graphs with **non-negative weights** |
| ⏱️ Efficient with priority queue | Especially with `heapq` (binary heap) |
| 📦 Simple to implement | Clean logic and widely applicable |
| 💡 Deterministic | Always gives the same shortest path |

---

### 🧮 **Time Complexity**:

- Using a **binary heap** (`heapq`) and adjacency list:
  
  **`O((V + E) * log V)`**
  
  Where:
  - `V` = number of nodes
  - `E` = number of edges

---

### 🎯 **Why Dijkstra’s Algorithm Is the Best Choice in Certain Scenarios**

Dijkstra's algorithm shines in specific use cases because of its **efficiency, determinism, and optimality for non-negative weights**. Here's a breakdown of why and when it's the best choice — especially compared to alternatives like **Bellman-Ford** and **Floyd-Warshall**.

---

### ✅ **1. Efficient for Single-Source Shortest Paths in Sparse Graphs**

- **Dijkstra**:  
  - With a binary heap (like `heapq`): `O((V + E) log V)`
  - Best suited for **sparse graphs** (i.e., few edges compared to number of nodes)

- **Bellman-Ford**:  
  - `O(V * E)`  
  - Slower, especially when the number of vertices or edges is large.

🔸 **Why Dijkstra wins**: In real-world road networks or communication systems (which are usually sparse), Dijkstra is significantly faster.

---

### ✅ **2. Non-Negative Weights**

- **Dijkstra**:  
  - Requires **non-negative edge weights** (as it assumes once a node's shortest path is found, it won't be improved later)

- **Bellman-Ford**:  
  - Handles **negative weights** and detects **negative cycles**

🔸 **Why Dijkstra wins**:  
  - If the graph is guaranteed to have **no negative weights** (e.g., travel time, costs), Dijkstra is both **faster and more memory-efficient**.

---

### ✅ **3. Only Need Path From One Source**

- **Dijkstra**: Great for **single-source to single-destination** or **all nodes from one source**

- **Floyd-Warshall**: Computes **all-pairs shortest paths**, but at a cost of `O(V^3)`

🔸 **Why Dijkstra wins**:  
  - For single-source use cases, Dijkstra avoids unnecessary computation.

---

### ✅ **Deterministic and Simple**

- Gives **exact shortest paths**, unlike some heuristics (like A* or greedy BFS)
- Logic is **straightforward** with clear guarantees

---

### ✨ **Use Case Examples Where Dijkstra Excels**:

| Scenario | Why Dijkstra Fits |
|----------|-------------------|
| **GPS / Mapping** | Roads don't have negative travel time, graph is sparse |
| **Network Routing** | Packet routing with link costs, where delays are ≥ 0 |
| **Game AI (with non-negative costs)** | Grid movement costs (e.g., terrain weights) |
| **Public Transport Systems** | Timetables with only positive time intervals |

---

