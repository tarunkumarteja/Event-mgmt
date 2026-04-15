import { useState, useEffect } from "react";

function Food() {
  const [dishes, setDishes] = useState(() => {
    const saved = localStorage.getItem("food");
    return saved ? JSON.parse(saved) : [];
  });

  const [dish, setDish] = useState("");

  useEffect(() => {
    localStorage.setItem("food", JSON.stringify(dishes));
  }, [dishes]);

  const addDish = () => {
    if (!dish) return;
    setDishes([...dishes, dish]);
    setDish("");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Food</h1>

      <input
        value={dish}
        onChange={(e) => setDish(e.target.value)}
        placeholder="Dish Name"
        className="border p-2 mr-2"
      />

      <button onClick={addDish} className="bg-green-500 text-white px-4 py-2 rounded">
        Add
      </button>

      {dishes.map((d, i) => (
        <div key={i}>🍽️ {d}</div>
      ))}
    </div>
  );
}

export default Food;