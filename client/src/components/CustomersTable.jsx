export default function OrdersTable({ data }) {
  console.log("ordersTable data", data);
// created_at
// customer_id
// email
// first_name
// last_name
// loyalty_points
// phone

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Current customers</h2>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>First Name</th><th>Last Name</th><th>Phone number</th><th>Email</th><th>Loyalty Points</th></tr>
        </thead>
        <tbody>
          {data.map(c => (
            <tr key={c.customer_id}>
              <td>{c.first_name}</td>
              <td>{c.last_name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.loyalty_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
