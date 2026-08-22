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

export function normalizeWarehouseState(source, version) {
  if (source?.warehouses?.byId && Array.isArray(source?.warehouses?.order)) {
    return {
      ...source,
      version,
      warehouses: {
        byId: { ...source.warehouses.byId },
        order: source.warehouses.order.filter((id) => source.warehouses.byId[id]),
      },
      documents: { byWarehouseId: { ...(source.documents?.byWarehouseId || {}) } },
      shelves: { byWarehouseId: { ...(source.shelves?.byWarehouseId || {}) } },
      pinecones: { byWarehouseId: { ...(source.pinecones?.byWarehouseId || {}) } },
    };
  }

  const legacyWarehouses = Array.isArray(source?.warehouses) ? source.warehouses : [];
  const byId = {};
  const order = [];
  const documentsByWarehouseId = {};
  const shelvesByWarehouseId = {};
  const pineconesByWarehouseId = {};

  legacyWarehouses.forEach((warehouse) => {
    if (!warehouse?.id || byId[warehouse.id]) return;
    const { reviewDocument, shelves, pinecones, ...meta } = warehouse;
    byId[warehouse.id] = {
      id: warehouse.id,
      name: warehouse.name || "未命名松鼠仓",
      updatedAt: warehouse.updatedAt || "",
      tempLimit: warehouse.tempLimit || 5,
      ...(meta.iconDataUrl ? { iconDataUrl: meta.iconDataUrl } : {}),
    };
    order.push(warehouse.id);
    documentsByWarehouseId[warehouse.id] = structuredClone(reviewDocument || { title: warehouse.name || "未命名松鼠仓", sections: [] });
    shelvesByWarehouseId[warehouse.id] = structuredClone(Array.isArray(shelves) ? shelves : []);
    pineconesByWarehouseId[warehouse.id] = structuredClone(Array.isArray(pinecones) ? pinecones : []);
  });

  const activeWarehouseId = byId[source?.activeWarehouseId]
    ? source.activeWarehouseId
    : (order[0] || "");

  return {
    ...(source || {}),
    version,
    activeWarehouseId,
    warehouses: { byId, order },
    documents: { byWarehouseId: documentsByWarehouseId },
    shelves: { byWarehouseId: shelvesByWarehouseId },
    pinecones: { byWarehouseId: pineconesByWarehouseId },
  };
}

export function getWarehouseRecords(state) {
  return (state.warehouses?.order || [])
    .map((id) => hydrateWarehouseRecord(state, id))
    .filter(Boolean);
}

export function hydrateWarehouseRecord(state, warehouseId) {
  const warehouse = state.warehouses?.byId?.[warehouseId];
  if (!warehouse) return null;
  return {
    ...structuredClone(warehouse),
    reviewDocument: structuredClone(state.documents?.byWarehouseId?.[warehouseId] || { title: warehouse.name, sections: [] }),
    shelves: structuredClone(state.shelves?.byWarehouseId?.[warehouseId] || []),
    pinecones: structuredClone(state.pinecones?.byWarehouseId?.[warehouseId] || []),
  };
}

export function persistWarehouseRecord(state, record) {
  if (!record?.id) return state;
  const { reviewDocument, shelves, pinecones, ...warehouse } = record;
  return {
    ...state,
    warehouses: {
      byId: { ...state.warehouses.byId, [record.id]: structuredClone(warehouse) },
      order: state.warehouses.order.includes(record.id) ? state.warehouses.order : [record.id, ...state.warehouses.order],
    },
    documents: { byWarehouseId: { ...state.documents.byWarehouseId, [record.id]: structuredClone(reviewDocument || { title: record.name, sections: [] }) } },
    shelves: { byWarehouseId: { ...state.shelves.byWarehouseId, [record.id]: structuredClone(shelves || []) } },
    pinecones: { byWarehouseId: { ...state.pinecones.byWarehouseId, [record.id]: structuredClone(pinecones || []) } },
  };
}

export function useOnlyExampleWarehouses(state, examples, collectionVersion) {
  if ((state.exampleCollectionVersion || 0) >= collectionVersion) return state;

  const emptyState = {
    ...state,
    activeWarehouseId: examples[0]?.id || "",
    warehouses: { byId: {}, order: [] },
    documents: { byWarehouseId: {} },
    shelves: { byWarehouseId: {} },
    pinecones: { byWarehouseId: {} },
  };
  const examplesOnly = examples.reduce(
    (nextState, example) => persistWarehouseRecord(nextState, example),
    emptyState,
  );

  return {
    ...examplesOnly,
    exampleCollectionVersion: collectionVersion,
    warehouses: { ...examplesOnly.warehouses, order: examples.map((example) => example.id) },
  };
}

export function createEmptyWarehouseRecord(id, name, updatedAt) {
  return {
    warehouse: { id, name, updatedAt, tempLimit: 5 },
    document: {
      title: name,
      sections: [{
        shelfId: "ideas",
        heading: "先存下零散松果",
        summary: "这个仓库还在积累材料，添加松果后可以让 AI 开始整理。",
        bullets: [],
      }],
    },
    shelves: [{ id: "ideas", name: "待整理线索", description: "新松果整理后会先放到这里。" }],
    pinecones: [],
  };
}

export function removeWarehouseRecord(state, warehouseId) {
  const records = getWarehouseRecords(state).map(({ reviewDocument, shelves, pinecones, ...warehouse }) => warehouse);
  const result = removeWarehouse(records, state.activeWarehouseId, warehouseId);
  if (!result.removed) return { state, removed: false };

  const { [warehouseId]: _removedWarehouse, ...byId } = state.warehouses.byId;
  const { [warehouseId]: _removedDocument, ...documentsByWarehouseId } = state.documents.byWarehouseId;
  const { [warehouseId]: _removedShelves, ...shelvesByWarehouseId } = state.shelves.byWarehouseId;
  const { [warehouseId]: _removedPinecones, ...pineconesByWarehouseId } = state.pinecones.byWarehouseId;

  return {
    removed: true,
    state: {
      ...state,
      activeWarehouseId: result.activeWarehouseId,
      warehouses: { byId, order: result.warehouses.map((warehouse) => warehouse.id) },
      documents: { byWarehouseId: documentsByWarehouseId },
      shelves: { byWarehouseId: shelvesByWarehouseId },
      pinecones: { byWarehouseId: pineconesByWarehouseId },
    },
  };
}

export function reorderWarehouseRecords(state, sourceId, targetId, placement) {
  const records = getWarehouseRecords(state).map(({ reviewDocument, shelves, pinecones, ...warehouse }) => warehouse);
  const next = reorderWarehouses(records, sourceId, targetId, placement);
  if (next === records) return state;
  return {
    ...state,
    warehouses: {
      ...state.warehouses,
      order: next.map((warehouse) => warehouse.id),
    },
  };
}
