chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "paste") {
    let str = sessionStorage.getItem("xxx");
    sendResponse("666");
  }
  return true;
});
