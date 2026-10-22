import { useEffect, useState } from "react";

const CATEGORIES = [
  "Bags",
  "Electronics",
  "Documents",
  "Books",
  "Clothing",
  "Keys",
  "Personal Items",
  "Other",
];

const today = () => new Date().toISOString().split("T")[0];

const emptyForm = {
  name: "",
  description: "",
  category: "Other",
  location: "",
  date: today(),
  reportType: "LOST",
};

// Used for both adding (item = null) and editing (item = existing item).
function ItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        description: item.description || "",
        category: item.category,
        location: item.location,
        date: item.date,
        reportType: item.reportType,
      });
    } else {
      setForm({ ...emptyForm, date: today() });
    }
  }, [item]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{item ? "Edit Item Report" : "Report an Item"}</h2>

      <div className="form-row">
        <label>
          Report type
          <select name="reportType" value={form.reportType} onChange={handleChange}>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
        </label>

        <label>
          Item name *
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            maxLength={100}
            placeholder="e.g. Black Backpack"
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Category *
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Location *
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            maxLength={100}
            placeholder="e.g. Library, 2nd floor"
            required
          />
        </label>

        <label>
          Date *
          <input
            type="date"
            name="date"
            value={form.date}
            max={today()}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          maxLength={500}
          rows={3}
          placeholder="Colour, brand, marks or anything that helps identify the item"
        />
      </label>

      <div className="actions">
        <button type="submit" className="btn primary">
          {item ? "Update" : "Submit Report"}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ItemForm;
