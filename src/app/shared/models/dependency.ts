export interface Dependency {
  id: number;
  predecessorId: number;
  successorId: number;
  type: number;
}
