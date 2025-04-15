const AdminPanel = () => (
  <div className="p-5">
    <h2 className="text-2xl font-semibold mb-4">Admin Panel - Manage Users & Services</h2>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Handle user add logic
      }}
      className="space-y-3 mb-6"
    >
      <input type="text" placeholder="Username" required className="block w-full p-2 border rounded" />
      <input type="password" placeholder="Password" required className="block w-full p-2 border rounded" />
      <select className="block w-full p-2 border rounded">
        <option value="admin">Admin</option>
        <option value="provider">Provider</option>
        <option value="consumer">Consumer</option>
      </select>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add User
      </button>
    </form>

    <div id="user-list" className="dashboard bg-white p-4 rounded shadow mb-6"></div>

    <h3 className="text-xl font-semibold mb-2">Add Service</h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Handle service add logic
      }}
      className="space-y-3"
    >
      <input type="text" placeholder="Service Name" required className="block w-full p-2 border rounded" />
      <input type="number" placeholder="Price" required className="block w-full p-2 border rounded" />
      <input type="text" placeholder="Category" required className="block w-full p-2 border rounded" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add Service
      </button>
    </form>

    <div id="service-list" className="dashboard bg-white p-4 rounded shadow mt-6"></div>
  </div>
);

export default AdminPanel;
