import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { updatePreferences } from '../reducers/authReducer'; // Removed unused updateAllergies

const Preferences = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [allergiesList, setAllergiesList] = useState([]);

  const [preferences, setPreferences] = useState({
    spice_level: "",
    calorie_range: 0,
    price_range: 0,
    gluten_free: false,
    vegetarian: false,
    allergies: [],
  });

  useEffect(() => {
    if (user) {
      setPreferences({
        spice_level: user.preferences?.spice_level || '',
        calorie_range: user.preferences?.calories || 0,
        price_range: user.preferences?.price || 0,
        gluten_free: user.preferences?.gluten_free || false,
        vegetarian: user.preferences?.vegetarian || false,
        allergies: user.preferences?.allergies || [] // Ensure array
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const response = await fetch('http://localhost:8000/allergies');
        if (response.ok) {
          const data = await response.json();
          setAllergiesList(data);
        }
      } catch (error) {
        console.error('Error fetching allergies:', error);
      }
    };
    fetchAllergies();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAllergyChange = (e) => {
    const { value, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      allergies: checked 
        ? [...prev.allergies, value] // Keep as string
        : prev.allergies.filter(a => a !== value)
    }));
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };


  const showErrorToast = (message) => {
    toast.error(message);
  };

  const showSuccessToast = (message) => {
    toast.success(message);
  };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!user?.id) {
        showErrorToast('No user logged in');
        return;
      }
    
      try {
        const response = await fetch('http://localhost:8000/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            calories: preferences.calorie_range,
            price: preferences.price_range,
            spice_level: preferences.spice_level,
            gluten_free: preferences.gluten_free,
            vegetarian: preferences.vegetarian,
            allergies: preferences.allergies // Already UUID strings
          })
        });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save preferences');
      }
      
      const result = await response.json();
      
      // Update Redux store and localStorage
      dispatch(updatePreferences({
        ...preferences,
        id: result.preference_id,
        calories: preferences.calorie_range,
        price: preferences.price_range,
        allergies: result.allergies // Convert back to numbers
      }));
  
      showSuccessToast('Preferences saved successfully!');
      setTimeout(() => navigate('/client'), 2000);
      
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="card-title mb-4 text-primary fw-bold">Edit Preferences</h3>
  
          <form onSubmit={handleSubmit} className="row g-4">
            {/* Spice Level */}
            <div className="col-md-6">
              <label className="form-label">Spice Level</label>
              <select
                className="form-select"
                name="spice_level"
                value={preferences.spice_level}
                onChange={handleChange}
              >
                <option value="">Select spice level</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="hot">Hot</option>
              </select>
            </div>
  
            {/* Calorie Range */}
            <div className="col-md-6">
              <label className="form-label">
                Calorie Range: <strong>{preferences.calorie_range}</strong>
              </label>
              <input
                type="range"
                className="form-range"
                name="calorie_range"
                min="0"
                max="2000"
                value={preferences.calorie_range}
                onChange={handleRangeChange}
              />
            </div>
  
            {/* Price Range */}
            <div className="col-md-6">
              <label className="form-label">
                Price Range: <strong>${preferences.price_range}</strong>
              </label>
              <input
                type="range"
                className="form-range"
                name="price_range"
                min="0"
                max="100"
                value={preferences.price_range}
                onChange={handleRangeChange}
              />
            </div>
  
            {/* Allergies */}
            <div className="col-md-6">
              <label className="form-label">Allergies</label>
              <div className="d-flex flex-wrap gap-2">
                {allergiesList.map((allergy) => (
                  <div className="form-check" key={allergy.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`allergy-${allergy.id}`}
                      value={allergy.id}
                      checked={preferences.allergies.includes(allergy.id)}
                      onChange={handleAllergyChange}
                    />
                    <label className="form-check-label" htmlFor={`allergy-${allergy.id}`}>
                      {allergy.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Dietary Options */}
            <div className="col-md-6">
              <label className="form-label">Dietary Options</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="gluten_free"
                  id="glutenFree"
                  checked={preferences.gluten_free}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="glutenFree">
                  Gluten Free
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="vegetarian"
                  id="vegetarian"
                  checked={preferences.vegetarian}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="vegetarian">
                  Vegetarian
                </label>
              </div>
            </div>
  
            {/* Buttons */}
            <div className="col-12 d-flex gap-3 justify-content-end mt-3">
              <button type="submit" className="btn btn-primary px-4">
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => navigate('/client')}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default Preferences;