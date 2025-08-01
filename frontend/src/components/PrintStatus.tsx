import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import FolderIcon from "@mui/icons-material/Folder";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import nullthrows from "nullthrows";
import React from "react";
import { Link } from "react-router-dom";
import { withAPI, WithAPIProps } from "../api";
import { getPrinterDisplayName, renderTime, sleep } from "../utils";

type PrinterState =
  | "IDLE"
  | "STARTING_PRINT"
  | "PRINTING"
  | "PAUSED"
  | "CLOSED";

function toPrinterState(state: string): PrinterState {
  if (
    state !== "IDLE" &&
    state !== "STARTING_PRINT" &&
    state !== "PRINTING" &&
    state !== "PAUSED" &&
    state !== "CLOSED"
  ) {
    throw Error("Unknown printer state " + state);
  }
  return state;
}

export interface PrintStatusState {
  isLoading: boolean;
  data?: {
    state: PrinterState;
    selectedFile: string;
    progress: number;
    currentLayer?: number;
    layerCount?: number;
    printTimeSecs?: number;
    timeLeftSecs?: number;
  };
}

const WAIT_BEFORE_REFRESHING_STATUS_MS = 250;

class PrintStatus extends React.Component<
  WithAPIProps,
  PrintStatusState
> {
  intervalID: number | undefined;

  state: PrintStatusState = {
    isLoading: true,
  };

  async _refresh(
    waitMs: number = WAIT_BEFORE_REFRESHING_STATUS_MS
  ): Promise<void> {
    await sleep(waitMs);
    const response = await this.props.api.printStatus();
    if (response) {
      this.setState({
        isLoading: false,
        data: {
          state: toPrinterState(response.state),
          progress: response.progress,
          selectedFile: response.selected_file,
          currentLayer: response.current_layer,
          layerCount: response.layer_count,
          printTimeSecs: response.print_time_secs,
          timeLeftSecs: response.time_left_secs,
        },
      });
    }
  }

  async componentDidMount(): Promise<void> {
    await this._refresh(0);
    this.intervalID = window.setInterval(
      async () => await this._refresh(0),
      60 * 1000
    );
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalID);
  }

  _renderButtons(): React.ReactElement {
    const { state } = nullthrows(this.state.data);
    if (state === "IDLE") {
      return <CircularProgress />;
    }

    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<PlayArrowIcon />}
            onClick={async () => {
              await this.props.api.resumePrint();
              await this._refresh();
            }}
            disabled={state !== "PAUSED"}
          >
            Resume
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<PauseIcon />}
            onClick={async () => {
              await this.props.api.pausePrint();
              await this._refresh();
            }}
            disabled={state === "PAUSED" || state === "STARTING_PRINT"}
          >
            Pause
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<StopIcon />}
            onClick={async () => {
              await this.props.api.cancelPrint();
              await this._refresh();
            }}
          >
            Stop
          </Button>
        </Grid>
      </Grid>
    );
  }

  _renderContent(): React.ReactElement | null {
    const { classes } = this.props;

    if (this.state.isLoading) {
      return (
        <Box
          sx={{
            flexGrow: 1,
            padding: 18,
            textAlign: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    const {
      currentLayer,
      layerCount,
      progress,
      selectedFile,
      state,
      timeLeftSecs,
    } = nullthrows(this.state.data);

    if (state === "IDLE" || state == "CLOSED") {
      return (
        <Box>
          <Typography variant="h5" gutterBottom>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <CheckIcon fontSize="large" />
              </Grid>
              <Grid item>Ready</Grid>
            </Grid>
          </Typography>
          <Grid
            container
            alignItems="flex-start"
            justify="flex-end"
            direction="row"
          >
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<FolderIcon />}
              component={Link}
              to="/files"
            >
              Files
            </Button>
          </Grid>
        </Box>
      );
    }

    return (
      <React.Fragment>
        <Box display="flex">
          <Box width="100%">
            <Typography component="h6" variant="h6" color="textSecondary">
              {selectedFile}
            </Typography>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <div className={classes.gridRoot}
          sx={{
            flexGrow: 1,
            padding: 12,
            paddingTop: 20,
            paddingBottom: 20,
            textAlign: "center",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h5" color="textPrimary" display="inline">
                {renderTime(nullthrows(timeLeftSecs))}&nbsp;
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                display="inline"
              >
                left
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" color="textPrimary" display="inline">
                {currentLayer}
              </Typography>
              <Typography variant="h6" color="textPrimary" display="inline">
                /{layerCount}&nbsp;
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                display="inline"
              >
                layers
              </Typography>
            </Grid>
          </Grid>
        </div>

        {this._renderButtons()}
      </React.Fragment>
    );
  }

  render(): React.ReactElement | null {
    return (
      <Card>
        <CardHeader
          title="Printer Status"
          subheader={getPrinterDisplayName()}
        />
        <CardContent>{this._renderContent()}</CardContent>
      </Card>
    );
  }
}

export default withAPI(PrintStatus);
