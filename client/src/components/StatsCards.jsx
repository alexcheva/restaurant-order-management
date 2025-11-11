export default function StatsCards({ orders, menu, customers }) {
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total_price || 0),
    0
  );
  console.log(totalRevenue);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;

  const cards = [
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}` },
    { title: "Total Orders", value: totalOrders },
    { title: "Total Customers", value: totalCustomers },
    { title: "Menu Items", value: menu.length },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="p-4 bg-white rounded-2xl shadow text-center border"
        >
          <h3 className="font-semibold text-gray-500">{c.title}</h3>
          <p className="text-2xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
