export const getDevice = () => {
  const selectedNavigator = navigator as any;
  if (navigator.mediaDevices) {
    return navigator.mediaDevices.getUserMedia;
  }
  if (selectedNavigator.webkitGetUserMedia) {
    return selectedNavigator.webkitGetUserMedia;
  }

  if (selectedNavigator.mozGetUserMedia) {
    return selectedNavigator.mozGetUserMedia;
  }

  if (selectedNavigator.mozGetUserMedia) {
    return selectedNavigator.mozGetUserMedia;
  }

  return null;
};
