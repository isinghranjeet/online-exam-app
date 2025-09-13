"use client";

const CameraAuth = ({ 
  cameraStream, 
  cameraStatus, 
  isFacialRecognitionLoading, 
  authenticateWithCamera, 
  stopCamera 
}) => {
  return (
    <div className="text-center my-4">
      <button
        className="btn btn-primary btn-gradient"
        onClick={authenticateWithCamera}
        disabled={cameraStream || isFacialRecognitionLoading}
      >
        {cameraStream ? "Authenticating..." : "Verify ID Card"}
      </button>

      {cameraStream && (
        <div className="mt-3 text-center">
          <div className="camera-preview">
            <video
              autoPlay
              ref={(video) => {
                if (video) video.srcObject = cameraStream;
              }}
              className="camera-video"
            />
            {isFacialRecognitionLoading && (
              <div className="camera-loading">
                <span className="spinner-border text-light"></span>
              </div>
            )}
          </div>
          <p className="mt-2 text-muted">{cameraStatus}</p>
          <button
            className="btn btn-danger mt-2"
            onClick={stopCamera}
            aria-label="Cancel Camera"
          >
            Cancel
          </button>
        </div>
      )}

      {cameraStatus && !cameraStream && (
        <div className="mt-3">
          <p className="text-danger">{cameraStatus}</p>
          <button
            className="btn btn-warning"
            onClick={authenticateWithCamera}
            aria-label="Retry Authentication"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraAuth;