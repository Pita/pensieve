import React, { FunctionComponent, useState, useCallback } from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  Paper,
  Typography,
  TextField,
  Stepper,
  Step,
  StepButton,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select
} from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    logo: {
      fontFamily: "Dancing Script",
      fontSize: "60px",
      textAlign: "center",
      margin: "16px 0 0",
      fontWeight: "bold"
    },
    slogan: {
      fontFamily: "Dancing Script",
      fontSize: "20px",
      textAlign: "center",
      margin: "0 0 32px"
    },
    gridContainer: {
      height: "100%",
      width: "100%"
    },
    gridItem: {
      width: "100%",
      maxWidth: theme.breakpoints.width("sm"),
      [theme.breakpoints.down("xs")]: {
        height: "100%"
      }
    },
    paper: {
      padding: "32px",
      width: "100%",
      [theme.breakpoints.down("xs")]: {
        height: "100%"
      }
    },
    textField: {
      width: "300px"
    },
    nextButton: {
      marginTop: theme.spacing(2)
    }
  });

type Step = "otp" | "password";

const Login: FunctionComponent<WithStyles<typeof styles>> = ({ classes }) => {
  // TODO: validation, network communication, auto focus
  const [step, setStep] = useState<Step>("otp");
  const [labelWidth, setLabelWidth] = React.useState(0);
  const onLabelRender = useCallback(
    node => {
      setLabelWidth(node.offsetWidth);
    },
    [setLabelWidth]
  );

  const onNextClick = useCallback(() => {
    if (step === "otp") {
      setStep("password");
    }
  }, [step, setStep]);

  let fields;
  switch (step) {
    case "otp":
      fields = (
        <Grid item>
          <TextField
            label="One Time Password"
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
        </Grid>
      );
      break;
    case "password":
      fields = (
        <>
          <Grid item>
            <FormControl variant="outlined" className={classes.textField}>
              <InputLabel ref={onLabelRender} htmlFor="accessMode">
                Access Mode
              </InputLabel>
              <Select
                native
                value={"write"}
                onChange={() => {}}
                inputProps={{
                  name: "accessMode",
                  id: "accessMode"
                }}
                labelWidth={labelWidth}
                className={classes.textField}
              >
                <option value="write">Write only access</option>
                <option value="write">Read only access</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </>
      );
      break;
  }

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.gridContainer}
    >
      <Grid item className={classes.gridItem}>
        <Paper className={classes.paper}>
          <Typography className={classes.logo}>Pensieve</Typography>
          <Typography className={classes.slogan}>
            The secure cloud diary
          </Typography>

          <Stepper nonLinear alternativeLabel>
            <Step>
              <StepButton
                completed={step === "password"}
                active={step === "otp"}
              >
                One Time Password
              </StepButton>
            </Step>
            <Step>
              <StepButton completed={false} active={step === "password"}>
                Access Password
              </StepButton>
            </Step>
          </Stepper>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={2}
          >
            {fields}
            <Grid item>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={onNextClick}
                className={classes.nextButton}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Login);
