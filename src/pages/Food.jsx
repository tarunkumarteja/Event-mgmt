import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Food() {
  // GLOBAL (connected)
  const { servingList, setServingList } = useContext(AppContext);

  // INGREDIENTS (local)
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");

  // DISHES (local)
  const [dishes, setDishes] = useState([]);
  const [dishName, setDishName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  // SERVING (only selected dish)
  const [selectedDish, setSelectedDish] = useState("");

  // ADD INGREDIENT
  const addIngredient = () => {
    if (!ingredientName || !quantity) return alert("Fill all fields");

    setIngredients([
      ...ingredients,
      { name: ingredientName, quantity, unit },
    ]);

    setIngredientName("");
    setQuantity("");
  };

  // SELECT INGREDIENTS
  const handleSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // ADD DISH
  const addDish = () => {
    if (!dishName || selectedItems.length === 0)
      return alert("Enter dish and select ingredients");

    setDishes([
      ...dishes,
      { name: dishName, items: selectedItems },
    ]);

    setDishName("");
    setSelectedItems([]);
  };

  // ADD SERVING (GLOBAL STATE)
  const addServing = () => {
    if (!selectedDish) return alert("Select dish");

    setServingList([
      ...servingList,
      { dish: selectedDish },
    ]);

    setSelectedDish("");
  };

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Food Management System
      </h1>

      {/* INGREDIENTS */}
      <div className="bg-blue-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-3">Ingredients</h2>

        <input
          type="text"
          placeholder="Ingredient Name"
          className="border p-2 mr-2"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 mr-2"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <select
          className="border p-2 mr-2"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="L">L</option>
          <option value="nos">nos</option>
        </select>

        <button
          onClick={addIngredient}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>

        <div className="mt-3">
          {ingredients.map((i, index) => (
            <div key={index}>
              {i.name} - {i.quantity} {i.unit}
            </div>
          ))}
        </div>
      </div>

      {/* DISHES */}
      <div className="bg-green-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-3">Dishes</h2>

        <input
          type="text"
          placeholder="Dish Name"
          className="border p-2 mr-2"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
        />

        <div className="mt-2 mb-2">
          {ingredients.map((i, index) => (
            <label key={index} className="mr-3">
              <input
                type="checkbox"
                checked={selectedItems.includes(i.name)}
                onChange={() => handleSelect(i.name)}
              />
              {i.name}
            </label>
          ))}
        </div>

        <button
          onClick={addDish}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Dish
        </button>

        <div className="mt-3">
          {dishes.map((d, index) => (
            <div key={index}>
              <strong>{d.name}</strong> → {d.items.join(", ")}
            </div>
          ))}
        </div>
      </div>

      {/* SERVING (CONNECTED) */}
      <div className="bg-purple-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-3">Serving</h2>

        <select
          className="border p-2 mr-2"
          value={selectedDish}
          onChange={(e) => setSelectedDish(e.target.value)}
        >
          <option value="">Select Dish</option>
          {dishes.map((d, index) => (
            <option key={index} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <button
          onClick={addServing}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>

        {/* GLOBAL LIST */}
        <div className="mt-3">
          {servingList.map((s, index) => (
            <div key={index}>🍽️ {s.dish}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Food;