import { DataSource, DataSourceProvider, GraphData } from '../types';

// Find all nodes that feed into the target node (directly or indirectly)
export const findUpstreamNodes = (nodeId: string, graphData: GraphData, visited: Set<string> = new Set()): string[] => {
  if (visited.has(nodeId)) {
    return []; // Avoid infinite loops with cycles
  }
  
  visited.add(nodeId);
  
  // Find direct parents
  const parents = graphData.edges
    .filter(edge => edge.target === nodeId)
    .map(edge => edge.source);

  // Recursively find all ancestors
  const ancestors = parents.flatMap(parentId => 
    findUpstreamNodes(parentId, graphData, visited)
  );

  // Combine and dedupe
  return [...new Set([...parents, ...ancestors])];
};

// Gets fields from forms that directly feed into the target form
export class DirectDependencyProvider implements DataSourceProvider {
  async getDataSources(targetNodeId: string, graphData: GraphData): Promise<DataSource[]> {
    // Find direct parents
    const directParents = graphData.edges
      .filter(edge => edge.target === targetNodeId)
      .map(edge => edge.source);

    // Return their fields
    return Promise.all(directParents.map(nodeId => {
      const node = graphData.nodes.find(n => n.id === nodeId);
      return {
        id: node?.id || '',
        name: node?.data.label || '',
        type: 'form',
        fields: node?.data.fields || []
      };
    }));
  }
}

// Gets fields from forms that indirectly feed into the target form
export class TransitiveDependencyProvider implements DataSourceProvider {
  async getDataSources(targetNodeId: string, graphData: GraphData): Promise<DataSource[]> {
    const allAncestors = findUpstreamNodes(targetNodeId, graphData);
    
    // Get direct parents to exclude them (we only want grandparents and beyond)
    const directParents = graphData.edges
      .filter(edge => edge.target === targetNodeId)
      .map(edge => edge.source);
    
    // Filter to indirect ancestors only
    const indirectAncestors = allAncestors.filter(id => !directParents.includes(id));
    
    return Promise.all(indirectAncestors.map(nodeId => {
      const node = graphData.nodes.find(n => n.id === nodeId);
      return {
        id: node?.id || '',
        name: node?.data.label || '',
        type: 'form',
        fields: node?.data.fields || []
      };
    }));
  }
}

// Provides global data that can be used in any form
export class GlobalDataProvider implements DataSourceProvider {
  async getDataSources(_targetNodeId: string, _graphData: GraphData): Promise<DataSource[]> {
    // Just mock data for now - would come from API in real app
    return Promise.resolve([
      {
        id: 'action_properties',
        name: 'Action Properties',
        type: 'global',
        fields: [
          { id: 'action_id', name: 'action_id', type: 'string' },
          { id: 'action_name', name: 'action_name', type: 'string' },
          { id: 'created_at', name: 'created_at', type: 'date' }
        ]
      },
      {
        id: 'client_org_properties',
        name: 'Client Organization Properties',
        type: 'global',
        fields: [
          { id: 'org_id', name: 'org_id', type: 'string' },
          { id: 'org_name', name: 'org_name', type: 'string' },
          { id: 'org_domain', name: 'org_domain', type: 'string' }
        ]
      }
    ]);
  }
}

// Combines multiple providers into one
export class CompositeDataSourceProvider implements DataSourceProvider {
  private providers: DataSourceProvider[];

  constructor(providers: DataSourceProvider[]) {
    this.providers = providers;
  }

  async getDataSources(targetNodeId: string, graphData: GraphData): Promise<DataSource[]> {
    // Get data from all providers
    const allResults = await Promise.all(
      this.providers.map(provider => provider.getDataSources(targetNodeId, graphData))
    );
    
    // Flatten the results
    return allResults.flat();
  }
}

// Default provider with all sources
export const defaultDataSourceProvider = new CompositeDataSourceProvider([
  new DirectDependencyProvider(),
  new TransitiveDependencyProvider(),
  new GlobalDataProvider()
]);