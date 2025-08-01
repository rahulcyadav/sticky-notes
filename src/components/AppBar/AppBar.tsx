import React from "react";
import classes from "./AppBar.module.css";

interface AppBarProps {
  title?: string;
  toolbar?: React.ReactNode;
}
export const AppBar: React.FC<AppBarProps> = ({ title, toolbar }) => {
  return (
    <header className={classes.AppBar}>
      <h1>{title}</h1>
      {toolbar}
    </header>
  );
};
