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
import { startSession } from "../App/API";
import { useSessionState } from "../App/SessionContext";
import { sendMessageToWorker } from "../CryptoWorker/cryptoWorkerController";
import { CheckPasswordRequest } from "../CryptoWorker/workerMessages";
import { useHistory } from "react-router-dom";

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
  const [step, setStep] = useState<Step>("otp");
  const [otp, setOTP] = useState("");
  const [otpError, setOTPError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionState, actions] = useSessionState();
  const [password, setPassword] = useState("");
  const [accessMode, setAccessMode] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [labelWidth, setLabelWidth] = useState(0);
  const onLabelRender = useCallback(
    node => {
      node && setLabelWidth(node.offsetWidth);
    },
    [setLabelWidth]
  );
  const history = useHistory();

  const onNext = useCallback(() => {
    if (step === "otp") {
      setLoading(true);
      startSession(otp)
        .then(response => {
          actions.startSession(response.data.data);
          setLoading(false);
          setStep("password");
        })
        .catch(e => {
          setOTPError("Incorrect");
          setLoading(false);
        });
    } else if (step === "password") {
      setLoading(true);
      const { sessionData } = sessionState;
      if (sessionData == null) {
        throw new Error("Session was not established");
      }
      const secrets =
        accessMode === "read"
          ? sessionData.entrySecrets.read
          : sessionData.entrySecrets.write;

      const message: CheckPasswordRequest = {
        type: "CheckPasswordRequest",
        password,
        salt: secrets.secretPasswordSalt,
        encryptedKey: secrets.secretEncrypted
      };
      sendMessageToWorker(message)
        .then(response => {
          setLoading(false);
          if (response.type === "CheckPasswordCorrectResponse") {
            history.replace("/write");
          } else {
            setPasswordError("Incorrect password");
          }
        })
        .catch(e => {
          setLoading(false);
          console.error(e);
        });
    }
  }, [
    otp,
    step,
    setStep,
    actions,
    password,
    accessMode,
    sessionState,
    history
  ]);

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
            value={otp}
            onChange={e => setOTP(e.target.value)}
            autoFocus
            disabled={loading}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                onNext();
              }
            }}
            error={!!otpError}
            helperText={otpError}
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
                value={accessMode}
                inputProps={{
                  name: "accessMode",
                  id: "accessMode"
                }}
                labelWidth={labelWidth}
                className={classes.textField}
                autoFocus
                disabled={loading}
                onChange={e => {
                  setAccessMode(e.target.value as string);
                }}
              >
                <option value="write">Write only access</option>
                <option value="read">Read only access</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              disabled={loading}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onNext();
                }
              }}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
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
                onClick={onNext}
                className={classes.nextButton}
                disabled={loading}
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
