import { useState, type SetStateAction } from 'react';
import {
  Box,
  Popover,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

type TreeNode = {
  label: string;
  children?: TreeNode[];
};

type GroupTreeDropdownProps = {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
  treeData: TreeNode[];
};

export default function GroupTreeDropdown({
  value,
  onChange,
  label,
  placeholder,
  treeData,
}: GroupTreeDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

  const handleOpen = (e: {
    currentTarget: SetStateAction<HTMLElement | null>;
  }) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (val: string) => {
    onChange(val);
    handleClose();
  };

  const handleToggle = (label: string) =>
    setOpenNodes(prev => ({ ...prev, [label]: !prev[label] }));

  const getSelectedLabel = () => {
    for (const area of treeData) {
      if (area.label === value) return area.label;
      if (area.children) {
        const found = area.children.find(child => child.label === value);
        if (found) return found.label;
      }
    }
    return '';
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <TextField
        label={label}
        value={getSelectedLabel()}
        size="small"
        fullWidth
        inputProps={{ readOnly: true }}
        placeholder={placeholder}
        onClick={handleOpen}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { minWidth: 220, maxHeight: 320, overflow: 'auto' } }}
      >
        <List>
          <ListItemButton onClick={() => handleSelect('')}>
            <ListItemText primary={placeholder} />
          </ListItemButton>
          {treeData.map(area => (
            <Box key={area.label}>
              <ListItemButton onClick={() => handleToggle(area.label)}>
                <ListItemText
                  primary={
                    <Typography fontWeight={600}>{area.label}</Typography>
                  }
                />
                {openNodes[area.label] ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </ListItemButton>
              <Collapse in={openNodes[area.label]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {area?.children?.map(child => (
                    <ListItemButton
                      key={child.label}
                      sx={{ pl: 4 }}
                      selected={value === child.label}
                      onClick={() => handleSelect(child.label)}
                    >
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Popover>
    </Box>
  );
}
