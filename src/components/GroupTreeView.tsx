import { useState } from "react";
import type { Exam } from "../types/exam";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Folder, Description, ExpandMore, ExpandLess } from "@mui/icons-material";

type Props = {
  assessments: Exam[];
};

export default function GroupTreeView({ assessments }: Props) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const handleToggle = (nodeId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpanded(newExpanded);
  };

  const groupedByArea = assessments.reduce((acc, assessment) => {
    if (!acc[assessment.area]) {
      acc[assessment.area] = [];
    }
    acc[assessment.area].push(assessment);
    return acc;
  }, {} as Record<string, Exam[]>);

  const groupedByProgram = assessments.reduce((acc, assessment) => {
    if (!acc[assessment.program]) {
      acc[assessment.program] = [];
    }
    acc[assessment.program].push(assessment);
    return acc;
  }, {} as Record<string, Exam[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Pending':
        return 'warning';
      case 'Synced':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid #e2e8f0',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 1,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          {t('tabs.group.tree')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('tree.description')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
            {t('group.by.area')}
          </Typography>
          <List>
            {Object.entries(groupedByArea).map(([area, areaAssessments]) => (
              <Box key={area}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleToggle(area)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Folder sx={{ color: '#6366f1' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {area}
                          </Typography>
                          <Chip 
                            label={areaAssessments.length} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                              color: 'white',
                              fontWeight: 500,
                            }} 
                          />
                        </Box>
                      }
                    />
                    {expanded.has(area) ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={expanded.has(area)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {areaAssessments.map((assessment) => (
                      <ListItem key={assessment.id} sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <Description sx={{ color: '#10b981' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {assessment.name}
                              </Typography>
                              <Chip 
                                label={t(`status.${assessment.status.toLowerCase().replace(' ', '.')}`)} 
                                color={getStatusColor(assessment.status)}
                                size="small"
                                sx={{ 
                                  fontWeight: 500,
                                  '&.MuiChip-colorSuccess': {
                                    background: 'linear-gradient(45deg, #10b981, #059669)',
                                    color: 'white',
                                  },
                                  '&.MuiChip-colorPrimary': {
                                    background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                                    color: 'white',
                                  },
                                  '&.MuiChip-colorWarning': {
                                    background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                                    color: 'white',
                                  },
                                }}
                              />
                            </Box>
                          }
                          secondary={`${assessment.program} • ${assessment.course}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
            {t('group.by.program')}
          </Typography>
          <List>
            {Object.entries(groupedByProgram).map(([program, programAssessments]) => (
              <Box key={program}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleToggle(`program-${program}`)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        background: 'rgba(236, 72, 153, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Folder sx={{ color: '#ec4899' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {program}
                          </Typography>
                          <Chip 
                            label={programAssessments.length} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(45deg, #ec4899, #db2777)',
                              color: 'white',
                              fontWeight: 500,
                            }} 
                          />
                        </Box>
                      }
                    />
                    {expanded.has(`program-${program}`) ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={expanded.has(`program-${program}`)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {programAssessments.map((assessment) => (
                      <ListItem key={assessment.id} sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <Description sx={{ color: '#10b981' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {assessment.name}
                              </Typography>
                              <Chip 
                                label={t(`status.${assessment.status.toLowerCase().replace(' ', '.')}`)} 
                                color={getStatusColor(assessment.status)}
                                size="small"
                                sx={{ 
                                  fontWeight: 500,
                                  '&.MuiChip-colorSuccess': {
                                    background: 'linear-gradient(45deg, #10b981, #059669)',
                                    color: 'white',
                                  },
                                  '&.MuiChip-colorPrimary': {
                                    background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                                    color: 'white',
                                  },
                                  '&.MuiChip-colorWarning': {
                                    background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                                    color: 'white',
                                  },
                                }}
                              />
                            </Box>
                          }
                          secondary={`${assessment.area} • ${assessment.course}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>
        </Box>
      </Box>
    </Paper>
  );
} 