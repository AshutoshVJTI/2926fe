import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePrefillMapping } from './usePrefillMapping';
import { PrefillMapping } from '../types';

describe('usePrefillMapping', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with empty mappings', () => {
    const { result } = renderHook(() => usePrefillMapping({ nodeId: 'form-a' }));
    
    expect(result.current.mappings).toEqual([]);
  });

  it('should initialize with provided initial mappings', () => {
    const initialMappings: PrefillMapping[] = [
      { targetFieldId: 'field1', sourceNodeId: 'form-b', sourceFieldId: 'field2' }
    ];
    
    const { result } = renderHook(() => 
      usePrefillMapping({ nodeId: 'form-a', initialMappings })
    );
    
    expect(result.current.mappings).toEqual(initialMappings);
  });

  it('should add a new mapping', () => {
    const { result } = renderHook(() => usePrefillMapping({ nodeId: 'form-a' }));
    
    const newMapping: PrefillMapping = { 
      targetFieldId: 'field1', 
      sourceNodeId: 'form-b', 
      sourceFieldId: 'field2' 
    };
    
    act(() => {
      result.current.addMapping(newMapping);
    });
    
    expect(result.current.mappings).toContainEqual(newMapping);
  });

  it('should replace an existing mapping for the same target field', () => {
    const initialMappings: PrefillMapping[] = [
      { targetFieldId: 'field1', sourceNodeId: 'form-b', sourceFieldId: 'field2' }
    ];
    
    const { result } = renderHook(() => 
      usePrefillMapping({ nodeId: 'form-a', initialMappings })
    );
    
    const newMapping: PrefillMapping = { 
      targetFieldId: 'field1', 
      sourceNodeId: 'form-c', 
      sourceFieldId: 'field3' 
    };
    
    act(() => {
      result.current.addMapping(newMapping);
    });
    
    expect(result.current.mappings).toHaveLength(1);
    expect(result.current.mappings[0]).toEqual(newMapping);
  });

  it('should remove a mapping', () => {
    const initialMappings: PrefillMapping[] = [
      { targetFieldId: 'field1', sourceNodeId: 'form-b', sourceFieldId: 'field2' }
    ];
    
    const { result } = renderHook(() => 
      usePrefillMapping({ nodeId: 'form-a', initialMappings })
    );
    
    act(() => {
      result.current.removeMapping('field1');
    });
    
    expect(result.current.mappings).toHaveLength(0);
  });

  it('should get a mapping for a specific field', () => {
    const mapping: PrefillMapping = { 
      targetFieldId: 'field1', 
      sourceNodeId: 'form-b', 
      sourceFieldId: 'field2' 
    };
    
    const { result } = renderHook(() => 
      usePrefillMapping({ nodeId: 'form-a', initialMappings: [mapping] })
    );
    
    const retrievedMapping = result.current.getMapping('field1');
    expect(retrievedMapping).toEqual(mapping);
    
    const nonExistentMapping = result.current.getMapping('field99');
    expect(nonExistentMapping).toBeUndefined();
  });

  it('should clear all mappings', () => {
    const initialMappings: PrefillMapping[] = [
      { targetFieldId: 'field1', sourceNodeId: 'form-b', sourceFieldId: 'field2' },
      { targetFieldId: 'field3', sourceNodeId: 'form-c', sourceFieldId: 'field4' }
    ];
    
    const { result } = renderHook(() => 
      usePrefillMapping({ nodeId: 'form-a', initialMappings })
    );
    
    act(() => {
      result.current.clearMappings();
    });
    
    expect(result.current.mappings).toHaveLength(0);
  });

  it('should persist mappings to localStorage', () => {
    const nodeId = 'form-a';
    const { result } = renderHook(() => usePrefillMapping({ nodeId }));
    
    const mapping: PrefillMapping = { 
      targetFieldId: 'field1', 
      sourceNodeId: 'form-b', 
      sourceFieldId: 'field2' 
    };
    
    act(() => {
      result.current.addMapping(mapping);
    });
    
    // Check if mapping was saved to localStorage
    const storedMappings = localStorage.getItem(`prefill_mappings_${nodeId}`);
    expect(storedMappings).not.toBeNull();
    
    const parsedMappings = JSON.parse(storedMappings || '[]');
    expect(parsedMappings).toContainEqual(mapping);
  });

  it('should load mappings from localStorage', () => {
    const nodeId = 'form-a';
    const mapping: PrefillMapping = { 
      targetFieldId: 'field1', 
      sourceNodeId: 'form-b', 
      sourceFieldId: 'field2' 
    };
    
    // Save mapping to localStorage
    localStorage.setItem(
      `prefill_mappings_${nodeId}`, 
      JSON.stringify([mapping])
    );
    
    // Initialize hook which should load from localStorage
    const { result } = renderHook(() => usePrefillMapping({ nodeId }));
    
    expect(result.current.mappings).toContainEqual(mapping);
  });
});