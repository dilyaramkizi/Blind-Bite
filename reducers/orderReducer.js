const ORDER_PLACED = 'ORDER_PLACED';                        // pending
const ORDER_CONFIRMED_BY_CHEF = 'ORDER_CONFIRMED_BY_CHEF';  // processing
const ORDER_COOKED = 'ORDER_COOKED';                        // completed
const ORDER_REJECTED_BY_ADMIN = 'ORDER_REJECTED_BY_ADMIN';  // cancelled

const initialState = {
  status: 'pending',
};

export default function orderStatusReducer(state = initialState, action) {
    switch (action.type) {
        case ORDER_PLACED:
        return { ...state, status: 'pending' };

        case ORDER_CONFIRMED_BY_CHEF:
        return { ...state, status: 'processing' };

        case ORDER_COOKED:
        return { ...state, status: 'completed' };

        case ORDER_REJECTED_BY_ADMIN:
        return { ...state, status: 'cancelled' };

        default:
        return state;
    }
}

export const updateOrderStatus = (orderId, newStatus) => {
  return async (dispatch) => {
    try {
        const response = await fetch(`http://localhost:8000/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) throw new Error('Failed to update order status');

        switch (newStatus) {
            case 'pending':
                dispatch({ type: 'ORDER_PLACED' });
                break;
            case 'processing':
                dispatch({ type: 'ORDER_CONFIRMED_BY_CHEF' });
                break;
            case 'completed':
                dispatch({ type: 'ORDER_COOKED' });
                break;
            case 'cancelled':
                dispatch({ type: 'ORDER_REJECTED_BY_ADMIN' });
                break;
            default:
                break;
        }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
};


export const placeOrder = () => ({ type: ORDER_PLACED });
export const confirmOrder = () => ({ type: ORDER_CONFIRMED_BY_CHEF });
export const completeOrder = () => ({ type: ORDER_COOKED });
export const rejectOrder = () => ({ type: ORDER_REJECTED_BY_ADMIN });