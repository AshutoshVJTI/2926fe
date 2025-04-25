import { GraphData, Field } from '../types';

// Mock form fields
const formAFields: Field[] = [
  { id: 'name', name: 'name', type: 'string' },
  { id: 'email', name: 'email', type: 'string' },
  { id: 'notes', name: 'notes', type: 'text' },
  { id: 'multi_select', name: 'multi_select', type: 'array' }
];

const formBFields: Field[] = [
  { id: 'completed_at', name: 'completed_at', type: 'date' },
  { id: 'button', name: 'button', type: 'boolean' },
  { id: 'dynamic_checkbox_group', name: 'dynamic_checkbox_group', type: 'object' },
  { id: 'dynamic_object', name: 'dynamic_object', type: 'object' },
  { id: 'email', name: 'email', type: 'string' },
  { id: 'id', name: 'id', type: 'string' },
  { id: 'multi_select', name: 'multi_select', type: 'array' },
  { id: 'name', name: 'name', type: 'string' },
  { id: 'notes', name: 'notes', type: 'text' }
];

const formCFields: Field[] = [
  { id: 'name', name: 'name', type: 'string' },
  { id: 'address', name: 'address', type: 'string' },
  { id: 'phone', name: 'phone', type: 'string' }
];

const formDFields: Field[] = [
  { id: 'dynamic_checkbox_group', name: 'dynamic_checkbox_group', type: 'object' },
  { id: 'dynamic_object', name: 'dynamic_object', type: 'object' },
  { id: 'email', name: 'email', type: 'string' },
  { id: 'name', name: 'name', type: 'string' }
];

const formEFields: Field[] = [
  { id: 'completed_at', name: 'completed_at', type: 'date' },
  { id: 'status', name: 'status', type: 'string' },
  { id: 'comments', name: 'comments', type: 'text' }
];

// Mock graph data representing the form DAG
export const mockGraphData: GraphData = {
  nodes: [
    {
      id: 'form-a',
      type: 'form',
      position: { x: 50, y: 200 },
      data: {
        label: 'Form A',
        type: 'Form',
        fields: formAFields
      }
    },
    {
      id: 'form-b',
      type: 'form',
      position: { x: 300, y: 100 },
      data: {
        label: 'Form B',
        type: 'Form',
        fields: formBFields
      }
    },
    {
      id: 'form-c',
      type: 'form',
      position: { x: 300, y: 300 },
      data: {
        label: 'Form C',
        type: 'Form',
        fields: formCFields
      }
    },
    {
      id: 'form-d',
      type: 'form',
      position: { x: 550, y: 100 },
      data: {
        label: 'Form D',
        type: 'Form',
        fields: formDFields
      }
    },
    {
      id: 'form-e',
      type: 'form',
      position: { x: 550, y: 300 },
      data: {
        label: 'Form E',
        type: 'Form',
        fields: formEFields
      }
    }
  ],
  edges: [
    {
      id: 'edge-a-b',
      source: 'form-a',
      target: 'form-b'
    },
    {
      id: 'edge-a-c',
      source: 'form-a',
      target: 'form-c'
    },
    {
      id: 'edge-b-d',
      source: 'form-b',
      target: 'form-d'
    },
    {
      id: 'edge-c-e',
      source: 'form-c',
      target: 'form-e'
    }
  ]
};