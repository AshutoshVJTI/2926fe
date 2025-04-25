import { useState, useEffect } from 'react';
import { PrefillMapping } from '../types';

interface UsePrefillMappingOptions {
  nodeId: string;
  initialMappings?: PrefillMapping[];
}

export const usePrefillMapping = ({ nodeId, initialMappings = [] }: UsePrefillMappingOptions) => {
  const [mappings, setMappings] = useState<PrefillMapping[]>(initialMappings);
  
  useEffect(() => {
    const storedMappings = localStorage.getItem(`prefill_mappings_${nodeId}`);
    if (storedMappings) {
      try {
        setMappings(JSON.parse(storedMappings));
      } catch (error) {
        console.error('Error parsing stored mappings:', error);
      }
    }
  }, [nodeId]);
  
  useEffect(() => {
    localStorage.setItem(`prefill_mappings_${nodeId}`, JSON.stringify(mappings));
  }, [nodeId, mappings]);
  
  const addMapping = (mapping: PrefillMapping) => {
    setMappings(prev => {
      const existingIndex = prev.findIndex(m => m.targetFieldId === mapping.targetFieldId);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = mapping;
        return updated;
      } else {
        return [...prev, mapping];
      }
    });
  };
  
  const removeMapping = (targetFieldId: string) => {
    setMappings(prev => prev.filter(m => m.targetFieldId !== targetFieldId));
  };
  
  const getMapping = (targetFieldId: string) => {
    return mappings.find(m => m.targetFieldId === targetFieldId);
  };
  
  const clearMappings = () => {
    setMappings([]);
  };
  
  return {
    mappings,
    addMapping,
    removeMapping,
    getMapping,
    clearMappings
  };
};