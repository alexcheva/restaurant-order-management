export default function PopularItems({ data }) {
  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-2">Top Menu Items</h2>
      <ul>
        {data.map(item => (
          <li key={item.name}>
            {item.name}: {item.qty_sold} sold (${item.revenue})
          </li>
        ))}
      </ul>
    </div>
  );
}