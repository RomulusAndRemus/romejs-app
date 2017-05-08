export const createGraph = (componentData) => {
  // Return action
  return {
    // Unique identifier
    type: 'CREATE_GRAPH',
    // Payload
    componentData: componentData
  }
};