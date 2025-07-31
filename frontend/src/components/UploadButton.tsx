import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PublishIcon from "@mui/icons-material/Publish";
import nullthrows from "nullthrows";
import React from "react";
import { withAPI, WithAPIProps } from "../api";
import { getSupportedExtensions, setState } from "../utils";

export interface UploadButtonProps extends WithAPIProps {
  onUploadFinished: () => void;
}

interface UploadButtonState {
  isUploading: boolean;
  uploadProgress: number;
}

class UploadButton extends React.Component<
  UploadButtonProps,
  UploadButtonState
> {
  state: UploadButtonState = { isUploading: false, uploadProgress: 0 };
  uploadButtonRef: React.RefObject<HTMLInputElement> =
    React.createRef<HTMLInputElement>();

  async _onUploadStart(): Promise<void> {
    const files = nullthrows(this.uploadButtonRef.current?.files);

    await setState(this, { isUploading: true, uploadProgress: 0 });
    await this.props.api.uploadFile(files[0], (event: ProgressEvent) => {
      this.setState({
        uploadProgress: (event.loaded / event.total) * 100,
      });
    });
    await setState(this, { isUploading: false, uploadProgress: 0 });

    await this.props.onUploadFinished();
  }

  render(): React.ReactElement {
    const { classes } = this.props;
    const { isUploading, uploadProgress } = this.state;

    return (
      <React.Fragment>
        <input
          ref={this.uploadButtonRef}
          accept={getSupportedExtensions()}
          id="upload-button"
          multiple
          type="file"
          onChange={async () => await this._onUploadStart()}
          disabled={isUploading}
          sx={{
            display: "none",
          }}
        />
        <label htmlFor="upload-button">
          <Button
            startIcon={
              isUploading ? (
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={18}
                />
              ) : (
                <PublishIcon />
              )
            }
            variant="outlined"
            color="primary"
            component="span"
            disabled={isUploading}
          >
            Upload
          </Button>
        </label>
      </React.Fragment>
    );
  }
}

export default withAPI(UploadButton);
