import axios from 'axios';
import { GraphData } from '../types';
import { mockGraphData } from './mockData';

// API base URL for the mock server
const API_BASE_URL = 'http://localhost:3000';

export const fetchFormGraph = async (): Promise<GraphData> => {
  try {
    // Use the mock server API endpoint with any tenant ID and blueprint ID
    // The server will return the same graph.json file regardless
    const response = await axios.get(`${API_BASE_URL}/api/v1/tenant1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph`);
    
    // Process the response data to extract fields from forms
    const processedData = processGraphData(response.data);
    return processedData;
  } catch (error) {
    console.error('Error fetching form graph:', error);
    // Fallback to mock data on error for development purposes
    console.log('Falling back to mock data...');
    return Promise.resolve(mockGraphData);
  }
};

function processGraphData(data: any): GraphData {
  const nodesWithFields = data.nodes.map((node: any) => {
    const formDefinition = data.forms.find((form: any) => 
      form.id === node.data.component_id
    );
    
    const fields = formDefinition ? extractFieldsFromSchema(formDefinition.field_schema) : [];
    
    return {
      ...node,
      data: {
        ...node.data,
        label: node.data.name,
        type: 'Form',
        fields
      }
    };
  });
  
  return {
    nodes: nodesWithFields,
    edges: data.edges
  };
}

function extractFieldsFromSchema(schema: any): any[] {
  if (!schema || !schema.properties) return [];
  
  return Object.entries(schema.properties).map(([key, value]: [string, any]) => ({
    id: key,
    name: value.title || key,
    type: value.type || 'string'
  }));
}