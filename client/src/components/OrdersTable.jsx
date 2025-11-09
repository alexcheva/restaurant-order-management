export default function OrdersTable({ data }) {
  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Recent Orders</h2>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr><th>ID</th><th>Customer</th><th>Status</th><th>Type</th><th>Total ($)</th></tr>
        </thead>
        <tbody>
          {data.map(o => (
            <tr key={o.order_id}>
              <td>{o.order_id}</td>
              <td>{o.customer}</td>
              <td>{o.order_status}</td>
              <td>{o.order_type}</td>
              <td>{o.total_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
