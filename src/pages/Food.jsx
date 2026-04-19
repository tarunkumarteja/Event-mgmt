import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Food() {
  const { servingList, setServingList } = useContext(AppContext);

  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");

  const [dishes, setDishes] = useState([]);
  const [dishName, setDishName] = useState("");

  const [selectedDish, setSelectedDish] = useState("");
  const [search, setSearch] = useState("");

  // ADD INGREDIENT
  const addIngredient = () => {
    if (!ingredientName || !quantity) return;

    setIngredients([
      ...ingredients,
      { name: ingredientName, quantity, unit },
    ]);

    setIngredientName("");
    setQuantity("");
  };

  const deleteIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // ADD DISH
  const addDish = () => {
    if (!dishName) return;

    setDishes([...dishes, { name: dishName }]);
    setDishName("");
  };

  const deleteDish = (index) => {
    setDishes(dishes.filter((_, i) => i !== index));
  };

  // ADD SERVING
  const addServing = () => {
    if (!selectedDish) return;

    setServingList([
      ...servingList,
      { dish: selectedDish, completed: false },
    ]);

    setSelectedDish("");
  };

  // DELETE SERVING
  const deleteServing = (index) => {
    setServingList(servingList.filter((_, i) => i !== index));
  };

  // TOGGLE SERVING STATUS
  const toggleServing = (index) => {
    const updated = [...servingList];
    updated[index].completed = !updated[index].completed;
    setServingList(updated);
  };

  // SORT (incomplete first)
  const sortedServing = [...servingList].sort(
    (a, b) => a.completed - b.completed
  );

  // PROGRESS
  const completedCount = servingList.filter((s) => s.completed).length;
  const totalCount = servingList.length;

  // FILTER
  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl text-gray-200">Food Management</h1>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />
        </div>

        {/* INGREDIENTS */}
        <div className="mb-6">
          <h2 className="text-blue-400 mb-3">Ingredients</h2>

          <div className="flex gap-2 mb-3">
            <input
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              placeholder="Ingredient"
              className="bg-white/10 p-2 rounded"
            />

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="bg-white/10 p-2 rounded"
            />

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option>kg</option>
              <option>g</option>
              <option>L</option>
              <option>nos</option>
            </select>

            <button
              onClick={addIngredient}
              className="bg-blue-600 px-3 rounded text-white"
            >
              Add
            </button>
          </div>

          <div className="max-h-[150px] overflow-y-auto space-y-2">
            {filteredIngredients.map((i, idx) => (
              <div
                key={idx}
                className="flex justify-between bg-white/5 p-2 rounded"
              >
                <span>
                  {i.name} - {i.quantity} {i.unit}
                </span>

                <button
                  onClick={() => deleteIngredient(idx)}
                  className="text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* DISHES */}
        <div className="mb-6">
          <h2 className="text-green-400 mb-3">Dishes</h2>

          <div className="flex gap-2 mb-3">
            <input
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="Dish name"
              className="bg-white/10 p-2 rounded"
            />

            <button
              onClick={addDish}
              className="bg-green-600 px-3 rounded text-white"
            >
              Add
            </button>
          </div>

          <div className="max-h-[150px] overflow-y-auto space-y-2">
            {filteredDishes.map((d, idx) => (
              <div
                key={idx}
                className="flex justify-between bg-white/5 p-2 rounded"
              >
                <span>{d.name}</span>

                <button
                  onClick={() => deleteDish(idx)}
                  className="text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SERVING */}
        <div>
          <h2 className="text-purple-400 mb-3">Serving</h2>

          {/* PROGRESS */}
          <p className="text-gray-400 mb-2">
            Served: {completedCount} / {totalCount}
          </p>

          <div className="flex gap-2 mb-3">
            <select
              value={selectedDish}
              onChange={(e) => setSelectedDish(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="">Select Dish</option>
              {dishes.map((d, idx) => (
                <option key={idx}>{d.name}</option>
              ))}
            </select>

            <button
              onClick={addServing}
              className="bg-purple-600 px-3 rounded text-white"
            >
              Add
            </button>
          </div>

          <div className="max-h-[200px] overflow-y-auto space-y-2">
            {sortedServing.map((s, idx) => {
              const originalIndex = servingList.findIndex(
                (item) => item === s
              );

              return (
                <div
                  key={idx}
                  className={`flex justify-between p-2 rounded ${
                    s.completed
                      ? "bg-green-900/40 border border-green-500"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <span
                    className={
                      s.completed
                        ? "line-through text-green-300"
                        : ""
                    }
                  >
                    🍽️ {s.dish}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleServing(originalIndex)}
                      className="text-blue-400 text-sm"
                    >
                      {s.completed ? "Undo" : "Done"}
                    </button>

                    <button
                      onClick={() => deleteServing(originalIndex)}
                      className="text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Food;