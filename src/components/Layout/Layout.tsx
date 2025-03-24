'use client';

import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import { Box } from '@mui/system';
import SavingsIcon from '@mui/icons-material/Savings';
import SettingsIcon from '@mui/icons-material/Settings';
import DomainIcon from '@mui/icons-material/Domain';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import Link from 'next/link';
import { useState } from 'react';

const DRAWER_WIDTH = 180;
const DRAWER_COLLAPSED_WIDTH = 75;
const ICON_WIDTH = 45;

const LINKS = [
  { text: 'Tomi', href: '/tomi', icon: FaceOutlinedIcon },
  { text: 'Finanzas', href: '/finanzas', icon: SavingsIcon },
  { text: 'Importar', href: '/importar', icon: FileUploadIcon },
];

const PLACEHOLDER_LINKS = [{ text: 'Settings', icon: SettingsIcon }];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Drawer
        sx={{
          width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            height: 'auto',
            bottom: 0,
          },
          '& .MuiListItemIcon-root': {
            minWidth: ICON_WIDTH,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem>
            <ListItemButton onClick={onCollapse} sx={{ padding: '0px' }}>
              <ListItemIcon>
                <DomainIcon />
              </ListItemIcon>
              {collapsed ? null : <ListItemText primary="Mis gestiones" />}
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {LINKS.map(({ text, href, icon: Icon }) => (
            <ListItem key={href} disablePadding>
              <ListItemButton component={Link} href={href}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                {collapsed ? null : <ListItemText primary={text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 'auto' }} />
        <List>
          {PLACEHOLDER_LINKS.map(({ text, icon: Icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                {collapsed ? null : <ListItemText primary={text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          ml: `${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH}px`,
          p: 3,
        }}
      >
        {children}
      </Box>
    </>
  );
};

export { Layout };
