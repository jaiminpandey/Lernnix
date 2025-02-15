chrome.storage.local.get("lastAnswer", (data) => {
    const textArea = document.getElementById("textArea");
    textArea.value = data.lastAnswer || "No text available!"
  });

  function saveText() {
    const text = document.getElementById("textArea").value;
    alert("Text saved:\n" + text);
  }
  
  document.getElementById("saveButton").addEventListener("click", saveText);
  
