let id = 0;
const initialState = { items:[] };

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
        return {
            ...state,
            //items:state.items.push({id:action.itemId,item:action.item,completed:action.completed})
        }

    default:
      return state
  }
}


export default reducer;
