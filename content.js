console.log("SHADOWGUARD STARTED");

const BACKEND_URL = "http://localhost:8080/api/scan";

let lastValue = "";
let timeout = null;

function createBanner(message, type = "warning") {

  removeBanner();

  const banner = document.createElement("div");

  banner.id = "shadowguard-banner";

  banner.innerHTML = `
    <strong>
      ${type === "blocked" ? "🚫" : "⚠️"}
      ShadowGuard Alert
    </strong>
    <br>
    ${message}
  `;

  document.body.appendChild(banner);
}

function removeBanner() {

  const oldBanner =
    document.getElementById("shadowguard-banner");

  if (oldBanner) {

    oldBanner.remove();

  }
}

async function scanText(text) {

  console.log("Scanning:", text);

  try {

    const response = await fetch(BACKEND_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        text: text
      })

    });

    const result = await response.json();

    console.log("Backend result:", result);

    if (result.verdict === "BLOCKED") {

      createBanner(
        result.topReasons.join(", "),
        "blocked"
      );

    } else if (result.verdict === "WARNING") {

      createBanner(
        result.topReasons.join(", "),
        "warning"
      );

    } else {

      removeBanner();

    }

  } catch (error) {

    console.log("Backend not reachable");

    createBanner(
      "Backend server not running",
      "warning"
    );
  }
}

function detectInput() {

  const editor =
    document.querySelector('[contenteditable="true"]');

  if (!editor) {

    return;
  }

  const text = editor.innerText.trim();

  if (
    text &&
    text !== lastValue &&
    text.length > 5
  ) {

    lastValue = text;

    clearTimeout(timeout);

    timeout = setTimeout(() => {

      scanText(text);

    }, 1000);
  }
}

setInterval(detectInput, 1000);