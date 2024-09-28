import React, { useState } from "react";
import { getDatabase, ref, push, set, get } from "firebase/database";
import { app } from "../firebase"; // Import Firebase configuration

const db = getDatabase(app); // Initialize Realtime Database

const AddAccessories = () => {
  const [formData, setFormData] = useState({
    accessoryName: "",
    color: "",
  });

  const [uploading, setUploading] = useState(false);
  const [accessories, setAccessories] = useState([]);

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      // Save accessory data to Realtime Database
      const accessoriesRef = ref(db, "accessories");
      const newAccessoryRef = push(accessoriesRef);

      await set(newAccessoryRef, {
        accessoryName: formData.accessoryName,
        color: formData.color,
      });

      alert("Accessory added successfully");
      setFormData({
        accessoryName: "",
        color: "",
      });
    } catch (error) {
      console.error("Error adding to Realtime Database: ", error);
      alert("Error adding accessory");
    } finally {
      setUploading(false);
    }
  };

  // Fetch and display accessories from Firebase
  const fetchAccessories = async () => {
    try {
      const accessoriesRef = ref(db, "accessories");
      const snapshot = await get(accessoriesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const accessoryList = Object.values(data);
        setAccessories(accessoryList);
      } else {
        alert("No accessories found");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Error fetching accessories");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      {/* Form for Adding Accessories */}
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md mb-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4">Add Accessories</h1>

        {/* Accessory Name Dropdown */}
        <label className="block mb-2">Accessory Name</label>
        <select
          name="accessoryName"
          value={formData.accessoryName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        >
          <option value="" disabled>
            Select an accessory
          </option>
          <option value="Hat">Hat</option>
          <option value="Scarf">Scarf</option>
          <option value="Watch">Watch</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Sunglasses">Sunglasses</option>
          <option value="Others">Others</option>
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          disabled={uploading}
        >
          {uploading ? "Adding..." : "Add Accessory"}
        </button>
      </form>

      {/* Button to Fetch and Display Accessories */}
      <button
        onClick={fetchAccessories}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition mb-6"
      >
        Display Accessories
      </button>

      {/* Display Accessories List */}
      {accessories.length > 0 && (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Accessories List</h2>
          <ul className="space-y-4">
            {accessories.map((accessory, index) => (
              <li key={index} className="bg-gray-200 p-4 rounded">
                <p className="font-semibold">Accessory: {accessory.accessoryName}</p>
                <p className="text-gray-700">Color: {accessory.color}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddAccessories;
