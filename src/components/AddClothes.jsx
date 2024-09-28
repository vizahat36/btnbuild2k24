import React, { useState } from "react";
import { getDatabase, ref, push, set, get } from "firebase/database";
import { app } from "../firebase"; // Make sure Firebase is initialized properly

const db = getDatabase(app); // Initialize Realtime Database

const AddClothes = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    color: "",
    occasion: "",
  });
  const [uploading, setUploading] = useState(false);
  const [clothesData, setClothesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      // Save data to Realtime Database
      const clothesRef = ref(db, "clothes"); // Get a reference to the 'clothes' node
      const newClothRef = push(clothesRef); // Create a new unique reference for the new cloth item

      await set(newClothRef, {
        itemName: formData.itemName,
        color: formData.color,
        occasion: formData.occasion,
      });

      alert("Clothes added successfully");
      setFormData({
        itemName: "",
        color: "",
        occasion: "",
      });
    } catch (error) {
      console.error("Error adding to Realtime Database: ", error);
      alert("Error adding clothes");
    } finally {
      setUploading(false);
    }
  };

  // Function to fetch clothes from Firebase
  const handleDisplayClothes = async () => {
    setLoading(true);
    try {
      const clothesRef = ref(db, "clothes");
      const snapshot = await get(clothesRef);

      if (snapshot.exists()) {
        const clothes = snapshot.val();
        // Convert object to array
        const clothesArray = Object.keys(clothes).map((key) => ({
          id: key,
          ...clothes[key],
        }));
        setClothesData(clothesArray);
      } else {
        setClothesData([]);
        alert("No clothes found in the database.");
      }
    } catch (error) {
      console.error("Error fetching clothes from Firebase: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md mb-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Add Clothes</h1>

        {/* Item Name Dropdown with Placeholder */}
        <label className="block mb-2">Item Name</label>
        <select
          name="itemName"
          value={formData.itemName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        >
          <option value="" disabled>
            Select item name
          </option>
          <option value="shirt">Shirt</option>
          <option value="jeans">Jeans</option>
          <option value="t-shirt">T-Shirt</option>
          <option value="saree">Saree</option>
          <option value="trousers">Trousers</option>
          <option value="night-pants">Night Pants</option>
          <option value="others">Others</option>
        </select>

        {/* Color Input */}
        <label className="block mb-2">Color</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleInputChange}
          placeholder="Enter color"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        {/* Occasion Input */}
        <label className="block mb-2">Occasion</label>
        <input
          type="text"
          name="occasion"
          value={formData.occasion}
          onChange={handleInputChange}
          placeholder="Enter occasion"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Clothes"}
        </button>
      </form>

      {/* Display Clothes Button */}
      <button
        onClick={handleDisplayClothes}
        className="w-full max-w-md bg-green-500 text-white py-2 rounded hover:bg-green-600 transition mb-8"
      >
        {loading ? "Loading..." : "Display Clothes"}
      </button>

      {/* Displaying the clothes data */}
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Clothes Collection</h2>
        {clothesData.length > 0 ? (
          <ul className="space-y-4">
            {clothesData.map((cloth) => (
              <li key={cloth.id} className="p-4 bg-gray-100 rounded-md">
                <h3 className="text-xl font-semibold">{cloth.itemName}</h3>
                <p className="text-sm text-gray-600">Color: {cloth.color}</p>
                <p className="text-sm text-gray-600">Occasion: {cloth.occasion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No clothes added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddClothes;
