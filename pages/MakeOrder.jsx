import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MakeOrder = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const preferences = user?.preferences;

  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Fetch menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:8000/menu');
        const data = await response.json();

        setMenu(data.map(item => ({
          ...item,
          id: String(item.id),
          allergies: item.allergies?.map(a => String(a)) || [],
        })));

      } catch (err) {
        toast.error('Failed to load menu. Please try again later.');
      }
    };
    fetchMenu();
  }, []);

  // Filter menu
  useEffect(() => {
    if (menu.length && preferences) {
      const filtered = menu.filter(item => {
        if (preferences.allergies?.some(allergyId =>
          item.allergies?.includes(allergyId)
        )) return false;

        if (preferences.vegetarian !== undefined &&
            item.vegetarian !== preferences.vegetarian) return false;

        if (preferences.gluten_free !== undefined &&
            item.gluten_free !== preferences.gluten_free) return false;

        if (preferences.price && item.price > preferences.price) return false;

        if (preferences.calories && item.calories > preferences.calories) return false;

        if (preferences.spice_level &&
            item.spice_level !== preferences.spice_level) return false;

        return true;
      });

      setFilteredMenu(filtered);
    }
  }, [menu, preferences]);

  const toggleSelection = (item) => {
    setSelectedItems(prev => {
      const currentId = String(item.id);
      return prev.some(selected => String(selected.id) === currentId)
        ? prev.filter(selected => String(selected.id) !== currentId)
        : [...prev, { ...item, id: currentId }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!preferences) {
      toast.error('Preferences not loaded');
      return;
    }

    if (!preferences.calories || preferences.calories <= 0) {
      toast.error('Invalid calorie preference. Please set a positive calorie limit.');
      return;
    }

    if (!preferences?.price || preferences.price <= 0) {
      toast.error('Invalid budget preference. Please set a positive price limit.');
      return;
    }

    const priceExceeded = preferences?.price && totalPrice > preferences.price;
    const caloriesExceeded = preferences?.calories && totalCalories > preferences.calories;

    if (priceExceeded || caloriesExceeded) {
      let errorMessage = 'Order exceeds limits:';
      if (priceExceeded) errorMessage += ` Price ($${totalPrice.toFixed(2)} > $${preferences.price})`;
      if (caloriesExceeded) errorMessage += ` Calories (${totalCalories} > ${preferences.calories})`;

      toast.error(errorMessage);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          items: selectedItems.map(item => ({
            menu_id: item.id,
            quantity: quantities[item.id] || 1
          })),
          total_price: totalPrice,
          total_calories: totalCalories
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Order failed');
      }

      toast.success('Order placed successfully! Redirecting to history...');
      setTimeout(() => navigate('/history'), 2000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, newQuantity)
    }));
  };

  const totalCalories = selectedItems.reduce(
    (sum, item) => sum + Number(item.calories) * (quantities[item.id] || 1),
    0
  );
  
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + Number(item.price) * (quantities[item.id] || 1),
    0
  );

  return (
    <div className="container my-5">
      {/* Back Button */}
      <div className="d-flex justify-content-start mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>
  
      <h2 className="text-center mb-4 display-5 fw-bold gradient-text">
        🍽️ Make Your Adventure
      </h2>
  
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Menu Grid */}
          <div className="col-lg-8">
            <div className="row g-4">
              {filteredMenu.map(item => {
                const isSelected = selectedItems.some(
                  i => String(i.id) === String(item.id)
                );
  
                return (
                  <div className="col-md-6 col-xl-4" key={item.id}>
                    <div
                      className={`card h-100 transition-all ${
                        isSelected
                          ? 'border-2 border-primary shadow-lg'
                          : 'border-1 shadow-sm'
                      }`}
                      onClick={() => toggleSelection(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-success bg-opacity-10 text-success fs-6">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="badge bg-info bg-opacity-10 text-info fs-6">
                            {item.calories} kcal
                          </span>
                        </div>
  
                        {item.allergies?.length > 0 ? (
                          <div className="alert alert-danger py-1 mb-3">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Contains: {item.allergies.join(', ')}
                          </div>
                        ) : (
                          <p className="text-muted mb-3">Mystery Dish</p>
                        )}
  
                        {isSelected && (
                          <div className="mt-auto">
                            <div className="btn-group w-100" role="group">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleQuantityChange(
                                    item.id,
                                    (quantities[item.id] || 1) - 1
                                  );
                                }}
                              >
                                −
                              </button>
                              <span className="btn btn-light disabled">
                                {quantities[item.id] || 1}
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleQuantityChange(
                                    item.id,
                                    (quantities[item.id] || 1) + 1
                                  );
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
  
          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-primary shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">Order Summary</h4>
                <p>
                  <strong>Total Items:</strong> {selectedItems.length}
                </p>
  
                {/* Budget Progress */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Budget:</span>
                    <span>
                      ${totalPrice.toFixed(2)} of ${preferences?.price}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{
                        width: `${
                          (totalPrice / (preferences?.price || 1)) * 100
                        }%`,
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>
  
                {/* Calories Progress */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Calories:</span>
                    <span>
                      {totalCalories} of {preferences?.calories}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{
                        width: `${
                          (totalCalories / (preferences?.calories || 1)) * 100
                        }%`,
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>
  
                <button
                  className="btn btn-primary w-100 mt-3"
                  type="submit"
                  disabled={selectedItems.length === 0}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );  
};

export default MakeOrder;
