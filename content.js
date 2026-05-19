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

function fakeScan(text) {

  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("aadhaar") ||
    lowerText.includes("bank") ||
    lowerText.includes("ifsc") ||
    lowerText.includes("password")
  ) {

    return {

      verdict: "BLOCKED",

      topReasons: [
        "Sensitive personal or financial data detected"
      ]
    };
  }

  if (
    lowerText.includes("email") ||
    lowerText.includes("phone")
  ) {

    return {

      verdict: "WARNING",

      topReasons: [
        "Possible personal information detected"
      ]
    };
  }

  return {

    verdict: "SAFE",

    topReasons: []
  };
}

function handleResult(result) {

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
}

function detectInput() {

  const editor =
    document.querySelector('[contenteditable="true"]');

  if (!editor) {

    removeBanner();

    return;
  }

  const text = editor.innerText.trim();

  if (!text || text.length < 5) {

    removeBanner();

    lastValue = "";

    return;
  }

  if (text !== lastValue) {

    lastValue = text;

    clearTimeout(timeout);

    timeout = setTimeout(() => {

      const result = fakeScan(text);

      handleResult(result);

    }, 1000);
  }
}

setInterval(detectInput, 1000);