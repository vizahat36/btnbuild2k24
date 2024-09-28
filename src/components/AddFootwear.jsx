import React, { useState } from "react";
import { getDatabase, ref, push, set, get } from "firebase/database";
import { app } from "../firebase"; // Ensure Firebase is initialized properly

const db = getDatabase(app); // Initialize Realtime Database

const AddFootwear = () => {
  const [formData, setFormData] = useState({
    footwearName: "",
    color: "",
  });
  const [uploading, setUploading] = useState(false);
  const [footwearData, setFootwearData] = useState([]);
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
      const footwearRef = ref(db, "footwear"); // Reference to the 'footwear' node
      const newFootwearRef = push(footwearRef); // Create a new unique reference for the new footwear item

      await set(newFootwearRef, {
        footwearName: formData.footwearName,
        color: formData.color,
      });

      alert("Footwear added successfully");
      setFormData({
        footwearName: "",
        color: "",
      });
    } catch (error) {
      console.error("Error adding to Realtime Database: ", error);
      alert("Error adding footwear");
    } finally {
      setUploading(false);
    }
  };

  // Function to fetch footwear data from Firebase
  const handleDisplayFootwear = async () => {
    setLoading(true);
    try {
      const footwearRef = ref(db, "footwear");
      const snapshot = await get(footwearRef);

      if (snapshot.exists()) {
        const footwear = snapshot.val();
        // Convert object to array
        const footwearArray = Object.keys(footwear).map((key) => ({
          id: key,
          ...footwear[key],
        }));
        setFootwearData(footwearArray);
      } else {
        setFootwearData([]);
        alert("No footwear found in the database.");
      }
    } catch (error) {
      console.error("Error fetching footwear from Firebase: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md mb-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Add Footwear</h1>

        {/* Footwear Name Dropdown */}
        <label className="block mb-2">Footwear Name</label>
        <select
          name="footwearName"
          value={formData.footwearName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        >
          <option value="" disabled>
            Select footwear name
          </option>
          <option value="Sneakers">Sneakers</option>
          <option value="Boots">Boots</option>
          <option value="Sandals">Sandals</option>
          <option value="Loafers">Loafers</option>
          <option value="Flip Flops">Flip Flops</option>
          <option value="Heels">Heels</option>
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
          {uploading ? "Adding..." : "Add Footwear"}
        </button>
      </form>

      {/* Display Footwear Button */}
      <button
        onClick={handleDisplayFootwear}
        className="w-full max-w-md bg-green-500 text-white py-2 rounded hover:bg-green-600 transition mb-8"
      >
        {loading ? "Loading..." : "Display Footwear"}
      </button>

      {/* Displaying the footwear data */}
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Footwear Collection</h2>
        {footwearData.length > 0 ? (
          <ul className="space-y-4">
            {footwearData.map((footwear) => (
              <li key={footwear.id} className="p-4 bg-gray-100 rounded-md">
                <h3 className="text-xl font-semibold">{footwear.footwearName}</h3>
                <p className="text-sm text-gray-600">Color: {footwear.color}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No footwear added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddFootwear;
