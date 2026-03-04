import { Drawer } from "@mui/material";
import styles from "./custom-drawer.module.scss";

type DrawerProps = {
  isOpened: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const CustomDrawer = ({ isOpened, onClose, children }: DrawerProps) => {
  return (
    <Drawer
      open={isOpened}
      onClose={onClose}
      anchor={"right"}
      classes={{
        paper: styles["custom-drawer"],
      }}
    >
      {children}
    </Drawer>
  );
};

export default CustomDrawer;
