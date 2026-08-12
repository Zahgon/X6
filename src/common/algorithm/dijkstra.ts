import { PriorityQueue } from './priorityqueue'

export type DijkstraAdjacencyList = { [key: string]: string[] }
export type DijkstraWeight = (u: string, v: string) => number

export function dijkstra(
  adjacencyList: DijkstraAdjacencyList,
  source: string,
  weight: DijkstraWeight = (u, v) => { throw new Error("STUB"); },
) {
    throw new Error("STUB");
}
