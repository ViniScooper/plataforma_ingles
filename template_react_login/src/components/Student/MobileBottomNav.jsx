import React from 'react';
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function MobileBottomNav({
  activeTab,
  onSelectTab
}) {
  const navItems = [
    { id: 0, label: 'Atividades', icon: SchoolIcon, color: '#00b4d8' },
    { id: 1, label: 'Histórico', icon: EventAvailableIcon, color: '#48c78e' },
    { id: 2, label: 'Ranking', icon: EmojiEventsIcon, color: '#ffb74d' },
    { id: 3, label: 'Biblioteca', icon: MenuBookIcon, color: '#b388ff' }
  ];

  return (
    <Box sx={{
      display: { xs: 'flex', md: 'none' },
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1200,
      background: 'rgba(7, 15, 25, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      px: 1,
      py: 0.8,
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
    }}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = item.action ? false : activeTab === item.id;

        return (
          <Box
            key={item.label}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                onSelectTab(item.id);
              }
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1.5,
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: isActive ? item.color : 'rgba(255, 255, 255, 0.5)',
              background: isActive ? `${item.color}15` : 'transparent',
              transform: isActive ? 'translateY(-2px)' : 'none'
            }}
          >
            <IconComponent sx={{ fontSize: 22, mb: 0.3 }} />
            <Typography variant="caption" sx={{
              fontSize: '0.65rem',
              fontWeight: isActive ? 800 : 600,
              lineHeight: 1
            }}>
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
