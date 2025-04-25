# Journey Builder React

A React application for visualizing and configuring a directed acyclic graph (DAG) of forms with prefill capabilities. This project lets you manage how data from one form can prefill fields in downstream forms.

## Features

- Visualization of form DAG using React Flow
- Form field prefill configuration UI
- Support for different data sources (direct dependencies, transitive dependencies, global data)
- Extensible architecture

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v7+)

### Installation

1. Clone this repo:

```bash
git clone https://github.com/ashutoshvjti/2926fe.git
cd 2926fe
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Visit `http://localhost:5173` in your browser

### Running Tests

Run tests once:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

```
2926fe/
├── src/
│   ├── components/
│   │   ├── FormPrefill/        # Prefill UI components
│   │   ├── JourneyBuilder/     # Graph visualization components
│   │   └── Modal/              # Data selection modal
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API and data providers
│   ├── types/                  # TypeScript definitions
│   └── test/                   # Test setup
```

## Architecture

### Component Overview

- `JourneyBuilder`: Main component rendering the DAG
- `FormNode`: Custom node component for forms
- `FormPrefill`: Manages prefill mappings for a form
- `DataMappingModal`: Field mapping UI

### Data Flow

1. The graph data is loaded from the API (or mock data)
2. When you click a node, FormPrefill shows its fields
3. Clicking a field opens DataMappingModal
4. The modal shows available data sources from upstream forms and global data
5. Selections are stored as mappings

### Data Source Providers

The app uses a provider pattern that makes adding new data sources easy:

1. `DirectDependencyProvider`: Gets fields from direct dependencies
2. `TransitiveDependencyProvider`: Gets fields from indirect dependencies
3. `GlobalDataProvider`: Provides global data
4. `CompositeDataSourceProvider`: Combines multiple providers

## Extending The App

### Adding a New Data Source

1. Create a class implementing the DataSourceProvider interface:

```typescript
import { DataSource, DataSourceProvider, GraphData } from '../types';

export class MyCustomProvider implements DataSourceProvider {
  async getDataSources(targetNodeId: string, graphData: GraphData): Promise<DataSource[]> {
    // Your implementation here
    return [
      {
        id: 'custom_source',
        name: 'My Custom Source',
        type: 'custom',
        fields: [
          { id: 'field1', name: 'Field 1', type: 'string' },
          // More fields...
        ]
      }
    ];
  }
}
```

2. Add it to the composite provider:

```typescript
export const defaultDataSourceProvider = new CompositeDataSourceProvider([
  new DirectDependencyProvider(),
  new TransitiveDependencyProvider(),
  new GlobalDataProvider(),
  new MyCustomProvider() // Your new provider
]);
```

## License

MIT
