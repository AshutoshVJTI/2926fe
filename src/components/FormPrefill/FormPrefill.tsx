import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Button, Typography, List, ListItem, IconButton } from '@mui/material';
import { Field, GraphData, PrefillMapping } from '../../types';
import DataMappingModal from '../Modal/DataMappingModal';
import { usePrefillMapping } from '../../hooks/usePrefillMapping';

interface FormPrefillProps {
  selectedNode: Node;
  graphData: GraphData;
  onClose: () => void;
}

const FormPrefill = ({ selectedNode, graphData, onClose }: FormPrefillProps) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  
  const { mappings, addMapping, removeMapping } = usePrefillMapping({
    nodeId: selectedNode.id
  });

  useEffect(() => {
    if (selectedNode?.data?.fields) {
      setFields(selectedNode.data.fields);
    }
  }, [selectedNode]);

  const handleFieldClick = (field: Field) => {
    const hasMapping = mappings.some(m => m.targetFieldId === field.id);
    
    if (!hasMapping) {
      setSelectedField(field);
      setIsModalOpen(true);
    }
  };

  const handleAddMapping = (mapping: PrefillMapping) => {
    addMapping(mapping);
    setIsModalOpen(false);
    setSelectedField(null);
  };

  const getSourceDisplay = (mapping: PrefillMapping): string => {
    const sourceNode = graphData.nodes.find(node => node.id === mapping.sourceNodeId);
    if (!sourceNode) return mapping.sourceFieldId;
    
    const sourceField = sourceNode.data.fields?.find(f => f.id === mapping.sourceFieldId);
    return `${sourceNode.data.label}.${sourceField?.name || mapping.sourceFieldId}`;
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <Typography variant="h5">Prefill</Typography>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </div>
      
      <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
        Prefill fields for {selectedNode.data.label}
      </Typography>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <div style={{ 
          width: '40px', 
          height: '20px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '10px', 
          position: 'relative',
          marginRight: '10px'
        }}>
          <div style={{ 
            position: 'absolute', 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#1976d2',
            borderRadius: '50%',
            right: 0,
          }}></div>
        </div>
      </div>
      
      <List>
        {fields.map((field) => {
          const mapping = mappings.find(m => m.targetFieldId === field.id);
          
          return (
            <ListItem
              key={field.id}
              style={{
                border: '1px dashed #ccc',
                borderRadius: '4px',
                marginBottom: '8px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between'
              }}
              onClick={() => !mapping && handleFieldClick(field)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>
                  <span style={{ 
                    width: '24px', 
                    height: '24px', 
                    display: 'inline-block', 
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    textAlign: 'center',
                    lineHeight: '24px'
                  }}>
                    {field.type.charAt(0).toUpperCase()}
                  </span>
                </span>
                <span>{field.name}</span>
              </div>
              
              {mapping && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>
                    {getSourceDisplay(mapping)}
                  </span>
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMapping(field.id);
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>×</span>
                  </IconButton>
                </div>
              )}
            </ListItem>
          );
        })}
      </List>
      
      {selectedField && (
        <DataMappingModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedField(null);
          }}
          targetNode={selectedNode}
          targetField={selectedField}
          graphData={graphData}
          onAddMapping={handleAddMapping}
        />
      )}
    </div>
  );
};

export default FormPrefill;