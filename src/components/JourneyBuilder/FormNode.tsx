import React from 'react';
import { Handle, Position } from 'reactflow';

interface FormNodeProps {
  data: {
    label: string;
    type: string;
  };
  selected: boolean;
  id: string;
}

const FormNode: React.FC<FormNodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`form-node ${selected ? 'selected' : ''}`}
      style={{ 
        padding: '10px', 
        borderRadius: '5px', 
        background: '#6c80ff',
        border: selected ? '2px solid #1a1a1a' : '1px solid #d3d3d3',
        width: '180px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#fff', border: '1px solid #1a1a1a' }}
      />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <div style={{ 
          fontSize: '14px', 
          marginBottom: '4px',
          fontWeight: 400
        }}>
          {data.type}
        </div>
        <div style={{ fontWeight: 'bold' }}>
          {data.label}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#fff', border: '1px solid #1a1a1a' }}
      />
    </div>
  );
};

export default FormNode;