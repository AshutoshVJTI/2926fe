import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { DataSource, Field, GraphData, PrefillMapping } from '../../types';
import { defaultDataSourceProvider } from '../../services/dataSourceProviders';

interface DataMappingModalProps {
  open: boolean;
  onClose: () => void;
  targetNode: Node;
  targetField: Field;
  graphData: GraphData;
  onAddMapping: (mapping: PrefillMapping) => void;
}

const DataMappingModal = ({
  open,
  onClose,
  targetNode,
  targetField,
  graphData,
  onAddMapping
}: DataMappingModalProps) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSources = async () => {
      if (!open || !targetNode) return;
      
      setLoading(true);
      try {
        const sources = await defaultDataSourceProvider.getDataSources(
          targetNode.id,
          graphData
        );
        
        if (isMounted) {
          setDataSources(sources);
        }
      } catch (err) {
        console.error("Couldn't load data sources:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSources();
    return () => { isMounted = false; };
  }, [open, targetNode, graphData]);

  const toggleAccordion = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const selectField = (sourceNodeId: string, sourceFieldId: string) => {
    onAddMapping({
      targetFieldId: targetField.id,
      sourceNodeId,
      sourceFieldId
    });
  };

  const filterFields = (fields: Field[]) => {
    if (!searchTerm) return fields;
    
    const term = searchTerm.toLowerCase();
    return fields.filter(field => field.name.toLowerCase().includes(term));
  };

  const directSources = dataSources.filter(ds => 
    graphData.edges.some(edge => edge.source === ds.id && edge.target === targetNode.id)
  );
  
  const transitiveSources = dataSources.filter(ds => 
    ds.type === 'form' && 
    !graphData.edges.some(edge => edge.source === ds.id && edge.target === targetNode.id)
  );
  
  const globalSources = dataSources.filter(ds => ds.type === 'global');

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Select data element to map
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Available data
          </Typography>
          
          <TextField
            placeholder="Search fields"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              {directSources.map((source) => (
                <Accordion
                  key={source.id}
                  expanded={expanded === `direct-${source.id}`}
                  onChange={toggleAccordion(`direct-${source.id}`)}
                >
                  <AccordionSummary>
                    <Typography>{source.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {filterFields(source.fields).map((field) => (
                        <ListItem key={field.id} disablePadding>
                          <ListItemButton onClick={() => selectField(source.id, field.id)}>
                            <ListItemText primary={field.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}

              {transitiveSources.map((source) => (
                <Accordion
                  key={source.id}
                  expanded={expanded === `transitive-${source.id}`}
                  onChange={toggleAccordion(`transitive-${source.id}`)}
                >
                  <AccordionSummary>
                    <Typography>{source.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {filterFields(source.fields).map((field) => (
                        <ListItem key={field.id} disablePadding>
                          <ListItemButton onClick={() => selectField(source.id, field.id)}>
                            <ListItemText primary={field.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}

              {globalSources.map((source) => (
                <Accordion
                  key={source.id}
                  expanded={expanded === `global-${source.id}`}
                  onChange={toggleAccordion(`global-${source.id}`)}
                >
                  <AccordionSummary>
                    <Typography>{source.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {filterFields(source.fields).map((field) => (
                        <ListItem key={field.id} disablePadding>
                          <ListItemButton onClick={() => selectField(source.id, field.id)}>
                            <ListItemText primary={field.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataMappingModal;