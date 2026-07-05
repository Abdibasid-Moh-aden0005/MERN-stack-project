export const sendBackgroundMessage = async (customerNumber, message) => {
  const evolutionApiUrl = process.env.EVOLUTION_API_URL;
  const evolutionApiKey = process.env.EVOLUTION_API_KEY;

  if (!evolutionApiUrl || !evolutionApiKey) {
    console.error(
      "Evolution API: Missing URL or API key in environment variables",
    );
    return { success: false, message: "Evolution API not configured" };
  }

  try {
    const res = await fetch(evolutionApiUrl, {
      headers: {
        "Content-Type": "application/json",
        apiKey: evolutionApiKey,
      },
      method: "POST",
      body: JSON.stringify({
        number: customerNumber,
        text: message,
        delay: 1200,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Evolution API error:", res.status, data);
      return {
        success: false,
        message: `WhatsApp API responded with status ${res.status}${data?.message ? ": " + data.message : ""}`,
      };
    }

    return { success: true, message: "Message sent successfully", data };
  } catch (error) {
    console.error("Evolution API network error:", error);
    return {
      success: false,
      message: `Error sending message: ${error.message}`,
    };
  }
};
