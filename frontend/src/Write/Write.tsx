import React, { FunctionComponent } from "react";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";

const styles = (theme: Theme) => createStyles({});

const Write: FunctionComponent<WithStyles<typeof styles>> = ({ classes }) => {
  return <div>Write</div>;
};

export default withStyles(styles)(Write);
