export interface Node {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    type: string;
    fields?: Field[];
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface Field {
  id: string;
  name: string;
  type: string;
}

export interface PrefillMapping {
  targetFieldId: string;
  sourceNodeId: string;
  sourceFieldId: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  fields: Field[];
}

export interface DataSourceProvider {
  getDataSources: (targetNodeId: string, graphData: GraphData) => Promise<DataSource[]>;
}