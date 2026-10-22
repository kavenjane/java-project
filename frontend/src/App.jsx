import { useEffect, useState } from "react";
import {
  createItem,
  deleteItem,
  getErrorMessage,
  getItem,
  getItems,
  resolveItem,
  updateItem,
} from "./api/itemApi";
import ItemForm from "./components/ItemForm";
import ItemTable from "./components/ItemTable";
import ItemDetails from "./components/ItemDetails";

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const [message, setMessage] = useState(null); // { text, kind: "success" | "error" }

  const showMessage = (text, kind = "success") => {
    setMessage({ text, kind });
    setTimeout(() => setMessage(null), 4000);
  };

  // Load items from the backend (empty filters are sent as undefined = ignored)
  const loadItems = async () => {
    try {
      const response = await getItems(
        search || undefined,
        typeFilter || undefined,
        statusFilter || undefined
      );
      setItems(response.data);
    } catch (error) {
      showMessage(getErrorMessage(error), "error");
    }
  };

  // Re-load whenever the search text or a filter changes
  useEffect(() => {
    loadItems();
  }, [search, typeFilter, statusFilter]);

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData);
        showMessage("Item updated successfully.");
      } else {
        await createItem(formData);
        showMessage("Item reported successfully.");
      }
      setShowForm(false);
      setEditingItem(null);
      loadItems();
    } catch (error) {
      showMessage(getErrorMessage(error), "error");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete the report for "${item.name}"?`)) return;
    try {
      await deleteItem(item.id);
      showMessage("Item deleted.");
      loadItems();
    } catch (error) {
      showMessage(getErrorMessage(error), "error");
    }
  };

  const handleResolve = async (item) => {
    try {
      await resolveItem(item.id);
      showMessage(`"${item.name}" marked as resolved.`);
      loadItems();
    } catch (error) {
      showMessage(getErrorMessage(error), "error");
    }
  };

  // Fetch the latest copy of the item from the server before showing details
  const handleView = async (item) => {
    try {
      const response = await getItem(item.id);
      setViewingItem(response.data);
    } catch (error) {
      showMessage(getErrorMessage(error), "error");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAddForm = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="container">
      <header>
        <h1>College Lost &amp; Found</h1>
        <button className="btn primary" onClick={openAddForm}>
          + Report Item
        </button>
      </header>

      {message && <div className={`message ${message.kind}`}>{message.text}</div>}

      {showForm && (
        <ItemForm item={editingItem} onSave={handleSave} onCancel={closeForm} />
      )}

      <div className="card filters">
        <input
          type="text"
          placeholder="Search by item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <div className="card">
        <ItemTable
          items={items}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResolve={handleResolve}
        />
      </div>

      {viewingItem && (
        <ItemDetails item={viewingItem} onClose={() => setViewingItem(null)} />
      )}
    </div>
  );
}

export default App;
