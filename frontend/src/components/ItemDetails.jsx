// A simple popup showing every detail of one item.
function ItemDetails({ item, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <h2>{item.name}</h2>
        <p>
          <span className={`badge ${item.reportType.toLowerCase()}`}>{item.reportType}</span>{" "}
          <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
        </p>

        <dl>
          <dt>ID</dt>
          <dd>{item.id}</dd>
          <dt>Category</dt>
          <dd>{item.category}</dd>
          <dt>Location</dt>
          <dd>{item.location}</dd>
          <dt>Date</dt>
          <dd>{item.date}</dd>
          <dt>Description</dt>
          <dd>{item.description || "No description given."}</dd>
        </dl>

        <button className="btn primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ItemDetails;
