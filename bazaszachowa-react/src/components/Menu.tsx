import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Menu as MuiMenu,
  Toolbar,
} from "@mui/material";
import { useCallback, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useI18n } from "../context/useI18n";

import ColorSchemeToggle from "./ColorSchemeToggle";
import LangToggle from "./LangToggle";

interface MenuProperties {
  readonly links: Record<string, { name: string; url: string }>;
}

const Menu: React.FC<MenuProperties> = ({ links }) => {
  const { t } = useI18n();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorElement(null);
  }, []);

  const menuItems = (
    <>
      <MenuItem>
        <ColorSchemeToggle />
      </MenuItem>
      <MenuItem>
        <LangToggle />
      </MenuItem>
      {Object.keys(links).map((key) => (
        <MenuItem
          component={RouterLink}
          key={key}
          onClick={handleMenuClose}
          to={links[key].url}
        >
          {t(links[key].name)}
        </MenuItem>
      ))}
    </>
  );

  return (
    <AppBar color="default" position="static">
      <Toolbar>
        <Box
          sx={
            {
              display: { md: "flex", xs: "none" },
              flexGrow: 1,
              gap: 2,
            } as const
          }
        >
          <ColorSchemeToggle />
          <LangToggle />
          {Object.keys(links).map((key) => (
            <Button
              color="inherit"
              component={RouterLink}
              key={key}
              to={links[key].url}
            >
              {t(links[key].name)}
            </Button>
          ))}
        </Box>

        <Box
          sx={
            { display: { md: "none", xs: "flex" }, marginLeft: "auto" } as const
          }
        >
          <IconButton
            aria-label="menu"
            color="inherit"
            edge="start"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <MuiMenu
            anchorEl={anchorElement}
            onClose={handleMenuClose}
            open={Boolean(anchorElement)}
          >
            {menuItems}
          </MuiMenu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
