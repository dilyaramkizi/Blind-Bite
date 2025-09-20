import React, { useEffect, useState } from "react";

const emptyDish = {
  name: "",
  description: "",
  cuisine: "",
  spice_level: "mild",
  calories: "",
  price: "",
  vegetarian: false,
  gluten_free: false,
  ingredients: "",
  allergies: {
    dairy: false,
    peanuts: false,
    shellfish: false,
    soy: false,
    eggs: false,
    wheat: false,
    nuts: false,
  },
};

const ChefPanel = () => {
  const [menu, setMenu] = useState([]);
  const [newDish, setNewDish] = useState(emptyDish);
  const [editingDishId, setEditingDishId] = useState(null);
  const [editDishData, setEditDishData] = useState(emptyDish);
  const [allergiesList, setAllergiesList] = useState([]);

  useEffect(() => {
    // Fetch menu and allergies
    fetch("http://localhost:8000/menu")
      .then((res) => res.json())
      .then(setMenu);
      
    fetch("http://localhost:8000/allergies")
      .then(res => res.json())
      .then(data => setAllergiesList(data));
  }, []);

  const handleChange = (e, setFunc) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("allergy_")) {
      const allergyKey = name.replace("allergy_", "");
      setFunc((prev) => ({
        ...prev,
        allergies: {
          ...prev.allergies,
          [allergyKey]: checked,
        },
      }));
    } else {
      setFunc((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const getSelectedAllergyIds = (allergiesObject) => {
    return allergiesList
      .filter(allergy => allergiesObject[allergy.name])
      .map(allergy => allergy.id);
  };

  const handleAddDish = async () => {
    try {
      const allergy_ids = getSelectedAllergyIds(newDish.allergies);
      
      const res = await fetch("http://localhost:8000/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newDish,
          calories: parseInt(newDish.calories),
          price: parseFloat(newDish.price),
          ingredients: newDish.ingredients.split(",").map((i) => i.trim()),
          allergy_ids
        }),
      });

      const data = await res.json();
      setMenu((prev) => [...prev, data]);
      setNewDish(emptyDish);
    } catch (error) {
      console.error("Error adding dish:", error);
    }
  };

  const handleEditDish = async () => {
    try {
      const allergy_ids = getSelectedAllergyIds(editDishData.allergies);
      
      const res = await fetch(`http://localhost:8000/menu/${editingDishId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editDishData,
          calories: parseInt(editDishData.calories),
          price: parseFloat(editDishData.price),
          ingredients: editDishData.ingredients.split(",").map((i) => i.trim()),
          allergy_ids
        }),
      });

      const updatedDish = await res.json();
      setMenu((prev) =>
        prev.map((item) => item.id === editingDishId ? updatedDish : item)
      );
      setEditingDishId(null);
      setEditDishData(emptyDish);
    } catch (error) {
      console.error("Error updating dish:", error);
    }
  };

  const handleDeleteDish = async (id) => {
    await fetch(`http://localhost:8000/menu/${id}`, { method: "DELETE" });
    setMenu((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold">👨‍🍳 Chef Panel – Manage Menu</h2>

      {/* 🥣 Add New Dish */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-2">➕ Add New Dish</h3>
        <div className="grid grid-cols-2 gap-4">
          {["name", "description", "cuisine"].map((field) => (
            <input
              key={field}
              name={field}
              value={newDish[field]}
              placeholder={field}
              onChange={(e) => handleChange(e, setNewDish)}
              className="p-2 border rounded"
            />
          ))}
          <select
            name="spice_level"
            value={newDish.spice_level}
            onChange={(e) => handleChange(e, setNewDish)}
            className="p-2 border rounded"
          >
            <option value="mild">Mild 🌿</option>
            <option value="medium">Medium 🌶</option>
            <option value="hot">Hot 🔥</option>
          </select>
          {["calories", "price"].map((field) => (
            <input
              key={field}
              name={field}
              type="number"
              value={newDish[field]}
              placeholder={field}
              onChange={(e) => handleChange(e, setNewDish)}
              className="p-2 border rounded"
            />
          ))}
          <label>
            <input
              type="checkbox"
              name="vegetarian"
              checked={newDish.vegetarian}
              onChange={(e) => handleChange(e, setNewDish)}
              className="mr-2"
            />
            Vegetarian
          </label>
          <label>
            <input
              type="checkbox"
              name="gluten_free"
              checked={newDish.gluten_free}
              onChange={(e) => handleChange(e, setNewDish)}
              className="mr-2"
            />
            Gluten Free
          </label>
        </div>
        <input
          name="ingredients"
          value={newDish.ingredients}
          placeholder="Ingredients (comma-separated)"
          onChange={(e) => handleChange(e, setNewDish)}
          className="p-2 border rounded w-full mt-2"
        />

        <input
          name="image_path"
          value={newDish.image_path}
          placeholder="Image path (e.g., /images/dishes/pasta.jpg)"
          onChange={(e) => handleChange(e, setNewDish)}
          className="p-2 border rounded w-full mt-2"
        />

        <div className="mt-4">
          <label className="font-medium block mb-1">Allergies:</label>
          <div className="grid grid-cols-4 gap-2">
          {allergiesList.map((allergy) => (
            <label key={allergy.id} className="flex items-center">
              <input
                type="checkbox"
                name={`allergy_${allergy.name}`}
                checked={newDish.allergies[allergy.name]}
                onChange={(e) => handleChange(e, setNewDish)}
                className="mr-2"
              />
              {allergy.name.charAt(0).toUpperCase() + allergy.name.slice(1)}
            </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddDish}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Dish
        </button>
      </div>

      {/* 🍽 Existing Menu List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📋 Current Menu</h3>
        <div className="space-y-4">
          {menu.map((item) => (
            <div key={item.id} className="border rounded-xl p-4 bg-white shadow-md">
              {editingDishId === item.id ? (
                <div className="grid grid-cols-2 gap-3">
                  {["name", "description", "cuisine"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      value={editDishData[field]}
                      onChange={(e) => handleChange(e, setEditDishData)}
                      className="p-2 border rounded"
                    />
                  ))}
                  <select
                    name="spice_level"
                    value={editDishData.spice_level}
                    onChange={(e) => handleChange(e, setEditDishData)}
                    className="p-2 border rounded"
                  >
                    <option value="mild">Mild 🌿</option>
                    <option value="medium">Medium 🌶</option>
                    <option value="hot">Hot 🔥</option>
                  </select>
                  {["calories", "price"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      type="number"
                      value={editDishData[field]}
                      onChange={(e) => handleChange(e, setEditDishData)}
                      className="p-2 border rounded"
                    />
                  ))}
                  <label>
                    <input
                      type="checkbox"
                      name="vegetarian"
                      checked={editDishData.vegetarian}
                      onChange={(e) => handleChange(e, setEditDishData)}
                      className="mr-2"
                    />
                    Vegetarian
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="gluten_free"
                      checked={editDishData.gluten_free}
                      onChange={(e) => handleChange(e, setEditDishData)}
                      className="mr-2"
                    />
                    Gluten Free
                  </label>
                  <button
                    onClick={handleEditDish}
                    className="col-span-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium">{item.name}</h4>
                      <p>{item.description}</p>
                      <p className="text-sm text-gray-500">
                        Cuisine: {item.cuisine}, Spice: {item.spice_level}, Price: ${item.price}
                      </p>
                      {item.image_path && (
                        <img 
                          src={item.image_path} 
                          alt={item.name}
                          className="mt-2 w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingDishId(item.id);
                          setEditDishData({
                            ...item,
                            ingredients: item.ingredients.join(", "),
                          });
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDish(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChefPanel;
