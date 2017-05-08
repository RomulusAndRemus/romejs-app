export default (state = null, action) => {
  switch (action.type){
    case 'CREATE_GRAPH':
        return state = action.componentData;
    default:
          return state;
  }
};