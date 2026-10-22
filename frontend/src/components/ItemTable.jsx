// Shows all items in a table with action buttons.
function ItemTable({ items, onView, onEdit, onDelete, onResolve }) {
  if (items.length === 0) {
    return <p className="empty">No items found.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Category</th>
            <th>Location</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <span className={`badge ${item.reportType.toLowerCase()}`}>
                  {item.reportType}
                </span>
              </td>
              <td>{item.category}</td>
              <td>{item.location}</td>
              <td>{item.date}</td>
              <td>
                <span className={`badge ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
              <td className="row-actions">
                <button className="btn small" onClick={() => onView(item)}>
                  View
                </button>
                <button className="btn small" onClick={() => onEdit(item)}>
                  Edit
                </button>
                {item.status === "OPEN" && (
                  <button className="btn small success" onClick={() => onResolve(item)}>
                    Resolve
                  </button>
                )}
                <button className="btn small danger" onClick={() => onDelete(item)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemTable;
