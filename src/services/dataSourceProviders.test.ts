import { describe, it, expect } from 'vitest';
import { 
  findUpstreamNodes, 
  DirectDependencyProvider, 
  TransitiveDependencyProvider, 
  GlobalDataProvider,
  CompositeDataSourceProvider
} from './dataSourceProviders';
import { GraphData } from '../types';

describe('findUpstreamNodes', () => {
  it('should find direct upstream nodes', () => {
    const graphData: GraphData = {
      nodes: [
        { id: 'A', type: 'form', position: { x: 0, y: 0 }, data: { label: 'A', type: 'Form' } },
        { id: 'B', type: 'form', position: { x: 0, y: 0 }, data: { label: 'B', type: 'Form' } },
        { id: 'C', type: 'form', position: { x: 0, y: 0 }, data: { label: 'C', type: 'Form' } },
      ],
      edges: [
        { id: 'edge1', source: 'A', target: 'B' },
        { id: 'edge2', source: 'B', target: 'C' },
      ]
    };

    const upstreamNodes = findUpstreamNodes('B', graphData);
    expect(upstreamNodes).toEqual(['A']);
  });

  it('should find transitive upstream nodes', () => {
    const graphData: GraphData = {
      nodes: [
        { id: 'A', type: 'form', position: { x: 0, y: 0 }, data: { label: 'A', type: 'Form' } },
        { id: 'B', type: 'form', position: { x: 0, y: 0 }, data: { label: 'B', type: 'Form' } },
        { id: 'C', type: 'form', position: { x: 0, y: 0 }, data: { label: 'C', type: 'Form' } },
        { id: 'D', type: 'form', position: { x: 0, y: 0 }, data: { label: 'D', type: 'Form' } },
      ],
      edges: [
        { id: 'edge1', source: 'A', target: 'B' },
        { id: 'edge2', source: 'B', target: 'C' },
        { id: 'edge3', source: 'C', target: 'D' },
      ]
    };

    const upstreamNodes = findUpstreamNodes('D', graphData);
    expect(upstreamNodes).toEqual(['C', 'B', 'A']);
  });

  it('should handle cyclic dependencies', () => {
    const graphData: GraphData = {
      nodes: [
        { id: 'A', type: 'form', position: { x: 0, y: 0 }, data: { label: 'A', type: 'Form' } },
        { id: 'B', type: 'form', position: { x: 0, y: 0 }, data: { label: 'B', type: 'Form' } },
        { id: 'C', type: 'form', position: { x: 0, y: 0 }, data: { label: 'C', type: 'Form' } },
      ],
      edges: [
        { id: 'edge1', source: 'A', target: 'B' },
        { id: 'edge2', source: 'B', target: 'C' },
        { id: 'edge3', source: 'C', target: 'A' }, // Cycle
      ]
    };

    const upstreamNodes = findUpstreamNodes('C', graphData);
    // Should find B and A as upstream nodes for C
    expect(upstreamNodes).toContain('B');
    expect(upstreamNodes).toContain('A');
  });
});

describe('DirectDependencyProvider', () => {
  it('should fetch direct dependencies', async () => {
    const graphData: GraphData = {
      nodes: [
        { 
          id: 'A', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'A', 
            type: 'Form',
            fields: [{ id: 'field1', name: 'field1', type: 'string' }]
          } 
        },
        { 
          id: 'B', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'B', 
            type: 'Form',
            fields: [{ id: 'field2', name: 'field2', type: 'number' }]
          } 
        },
        { 
          id: 'C', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'C', 
            type: 'Form',
            fields: [{ id: 'field3', name: 'field3', type: 'boolean' }]
          } 
        },
      ],
      edges: [
        { id: 'edge1', source: 'A', target: 'C' },
        { id: 'edge2', source: 'B', target: 'C' },
      ]
    };

    const provider = new DirectDependencyProvider();
    const dataSources = await provider.getDataSources('C', graphData);
    
    expect(dataSources).toHaveLength(2);
    expect(dataSources[0].id).toBe('A');
    expect(dataSources[1].id).toBe('B');
    
    expect(dataSources[0].fields).toEqual([{ id: 'field1', name: 'field1', type: 'string' }]);
    expect(dataSources[1].fields).toEqual([{ id: 'field2', name: 'field2', type: 'number' }]);
  });
});

describe('TransitiveDependencyProvider', () => {
  it('should fetch transitive dependencies', async () => {
    const graphData: GraphData = {
      nodes: [
        { 
          id: 'A', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'A', 
            type: 'Form',
            fields: [{ id: 'field1', name: 'field1', type: 'string' }]
          } 
        },
        { 
          id: 'B', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'B', 
            type: 'Form',
            fields: [{ id: 'field2', name: 'field2', type: 'number' }]
          } 
        },
        { 
          id: 'C', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'C', 
            type: 'Form',
            fields: [{ id: 'field3', name: 'field3', type: 'boolean' }]
          } 
        },
      ],
      edges: [
        { id: 'edge1', source: 'A', target: 'B' },
        { id: 'edge2', source: 'B', target: 'C' },
      ]
    };

    const provider = new TransitiveDependencyProvider();
    const dataSources = await provider.getDataSources('C', graphData);
    
    expect(dataSources).toHaveLength(1);
    expect(dataSources[0].id).toBe('A');
    expect(dataSources[0].fields).toEqual([{ id: 'field1', name: 'field1', type: 'string' }]);
  });
});

describe('GlobalDataProvider', () => {
  it('should return global data sources', async () => {
    const provider = new GlobalDataProvider();
    const dataSources = await provider.getDataSources('any-node', { nodes: [], edges: [] });
    
    expect(dataSources.length).toBeGreaterThan(0);
    expect(dataSources[0].type).toBe('global');
  });
});

describe('CompositeDataSourceProvider', () => {
  it('should combine data from all providers', async () => {
    const graphData: GraphData = {
      nodes: [
        { 
          id: 'A', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'A', 
            type: 'Form',
            fields: [{ id: 'field1', name: 'field1', type: 'string' }]
          } 
        },
        { 
          id: 'B', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'B', 
            type: 'Form',
            fields: [{ id: 'field2', name: 'field2', type: 'number' }]
          } 
        },
        { 
          id: 'C', 
          type: 'form', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: 'C', 
            type: 'Form',
            fields: [{ id: 'field3', name: 'field3', type: 'boolean' }]
          } 
        },
      ],
      edges: [
        { id: 'edge1', source: 'A', target: 'B' },
        { id: 'edge2', source: 'B', target: 'C' },
      ]
    };

    const directProvider = new DirectDependencyProvider();
    const transitiveProvider = new TransitiveDependencyProvider();
    const globalProvider = new GlobalDataProvider();
    
    const compositeProvider = new CompositeDataSourceProvider([
      directProvider, transitiveProvider, globalProvider
    ]);
    
    const dataSources = await compositeProvider.getDataSources('C', graphData);
    
    // Should have B (direct), A (transitive), and global data sources
    expect(dataSources.length).toBeGreaterThan(2);
    
    // Check for form B (direct dependency)
    expect(dataSources.some(ds => ds.id === 'B')).toBe(true);
    
    // Check for form A (transitive dependency)
    expect(dataSources.some(ds => ds.id === 'A')).toBe(true);
    
    // Check for global data
    expect(dataSources.some(ds => ds.type === 'global')).toBe(true);
  });
});