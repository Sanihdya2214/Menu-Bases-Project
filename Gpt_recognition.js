const startRecordingBtn = document.getElementById("start-recording");
const responseDiv = document.getElementById("response");

// Function to start speech recognition
function startSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const speechResult = event.results[0][0].transcript;
    console.log("Speech received: " + speechResult);
    getChatGPTResponse(speechResult);
  };

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error detected: " + event.error);
  };
}

// Function to get response from ChatGPT API
async function getChatGPTResponse(userInput) {
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await response.json();
    displayResponse(data.reply);
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
  }
}

// Function to display the response in the DOM
function displayResponse(response) {
  responseDiv.textContent = response;
}

// Event listener for the start recording button
startRecordingBtn.addEventListener("click", startSpeechRecognition);
