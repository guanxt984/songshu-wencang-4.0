export function reorderWarehouses(warehouses, sourceId, targetId, placement) {
  const sourceIndex = warehouses.findIndex((item) => item.id === sourceId);
  const targetIndex = warehouses.findIndex((item) => item.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return warehouses;

  const next = [...warehouses];
  const [source] = next.splice(sourceIndex, 1);
  const adjustedTarget = next.findIndex((item) => item.id === targetId);
  const insertIndex = adjustedTarget + (placement === "after" ? 1 : 0);
  next.splice(insertIndex, 0, source);
  return idsEqual(next, warehouses) ? warehouses : next;
}

export function removeWarehouse(warehouses, activeWarehouseId, warehouseId) {
  const index = warehouses.findIndex((item) => item.id === warehouseId);
  if (index < 0) return { warehouses, activeWarehouseId, removed: false };
  const next = warehouses.filter((item) => item.id !== warehouseId);
  const nextActive = activeWarehouseId === warehouseId
    ? (next[index]?.id || next[index - 1]?.id || "")
    : activeWarehouseId;
  return { warehouses: next, activeWarehouseId: nextActive, removed: true };
}

function idsEqual(left, right) {
  return left.length === right.length && left.every((item, index) => item.id === right[index].id);
}
