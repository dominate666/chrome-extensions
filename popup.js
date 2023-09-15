let container = document.querySelector("#container");
let paste = document.querySelector("#paste");
let cookieStr = "";
let content = "";
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query(
    {
      active: true,
      windowId: chrome.windows.WINDOW_ID_CURRENT,
      status: "complete",
    },
    function (tabs) {
      chrome.cookies.getAll({ url: tabs[0].url }, function (cookies) {
        console.log(cookies);
        cookieStr = cookies.map((c) => c.name + "=" + c.value).join(";");
        paste.click();
      });
    }
  );
  paste.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "paste" }, (res) => {
        let input = document.createElement("input");
        container.innerHTML = `

          let str='${cookieStr}';
          let arr=str.split(';');
          for(let i=0;i < arr.length;i++){
            let key=arr[i].split('=')[0];
            let value=arr[i].split("=")[1];
            document.cookie=key+'='+value;
          }
        
          sessionStorage.setItem('xxx',${JSON.stringify(res)})
          `;
        sessionStorage.setItem("xxx", JSON.stringify(res));
        content = container.innerHTML;
        content = content.replace(/&lt;/g, "<");
        input.value = content;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);

        let booksTitle = "cookie";
        chrome.bookmarks.search({ title: booksTitle }, (result) => {
          let bookmarkId = result[0].id;
          chrome.bookmarks.update(
            bookmarkId,
            { url: `javascript:${content}` },
            (book) => {}
          );
        });
      });
    });
  });
});
