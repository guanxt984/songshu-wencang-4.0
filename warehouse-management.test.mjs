import test from "node:test";
import assert from "node:assert/strict";
import { removeWarehouse, reorderWarehouses } from "./warehouse-management.js";

const ids = (items) => items.map((item) => item.id);
const warehouses = [{ id: "a" }, { id: "b" }, { id: "c" }];

test("reorderWarehouses moves a card before or after the target without mutation", () => {
  assert.deepEqual(ids(reorderWarehouses(warehouses, "c", "a", "before")), ["c", "a", "b"]);
  assert.deepEqual(ids(reorderWarehouses(warehouses, "a", "b", "after")), ["b", "a", "c"]);
  assert.deepEqual(ids(warehouses), ["a", "b", "c"]);
});

test("reorderWarehouses ignores invalid and no-op drops", () => {
  assert.equal(reorderWarehouses(warehouses, "missing", "a", "before"), warehouses);
  assert.equal(reorderWarehouses(warehouses, "a", "a", "before"), warehouses);
});

test("removeWarehouse preserves selection when deleting an inactive warehouse", () => {
  assert.deepEqual(removeWarehouse(warehouses, "a", "c"), {
    warehouses: [{ id: "a" }, { id: "b" }], activeWarehouseId: "a", removed: true,
  });
});

test("removeWarehouse selects next, then previous, and permits an empty list", () => {
  assert.equal(removeWarehouse(warehouses, "b", "b").activeWarehouseId, "c");
  assert.equal(removeWarehouse(warehouses, "c", "c").activeWarehouseId, "b");
  assert.deepEqual(removeWarehouse([{ id: "a" }], "a", "a"), {
    warehouses: [], activeWarehouseId: "", removed: true,
  });
});
