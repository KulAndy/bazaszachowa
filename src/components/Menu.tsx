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
import { useState } from "react";
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

  const menuItems = [
    <MenuItem key="color-scheme">
      <ColorSchemeToggle />
    </MenuItem>,
    <MenuItem key="lang">
      <LangToggle />
    </MenuItem>,
    ...Object.keys(links).map((key) => (
      <MenuItem
        component={RouterLink}
        key={key}
        onClick={() => setAnchorElement(null)}
        to={links[key].url}
      >
        {t(links[key].name)}
      </MenuItem>
    )),
  ];
  return (
    <nav>
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
              {
                display: { md: "none", xs: "flex" },
                marginLeft: "auto",
              } as const
            }
          >
            <IconButton
              aria-label="menu"
              color="inherit"
              edge="start"
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                setAnchorElement(event.currentTarget);
              }}
            >
              <MenuIcon />
            </IconButton>
            <MuiMenu
              anchorEl={anchorElement}
              onClose={() => {
                setAnchorElement(null);
              }}
              open={Boolean(anchorElement)}
            >
              {menuItems}
            </MuiMenu>
          </Box>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

export default Menu;
