/**
 * Module-level camera stream store.
 * Allows pre-acquiring camera permission on the landing page
 * so the browser prompt appears when the user clicks "Motion Mode",
 * before navigating to the reading experience.
 */

let stream: MediaStream | null = null;

export function setCameraStream(s: MediaStream) {
  stream = s;
}

export function getCameraStream(): MediaStream | null {
  return stream;
}

export async function requestCameraPermission(): Promise<MediaStream> {
  // Return existing stream if we already have one
  if (stream && stream.active) return stream;

  const s = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
  });

  stream = s;
  return s;
}

export function releaseCameraStream() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
}
