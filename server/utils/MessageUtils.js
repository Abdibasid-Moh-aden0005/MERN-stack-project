export const sendBackgroundMessage = async (customerNumber, message) => {
  const evolutionApiUrl = process.env.EVOLUTION_API_URL;
  const evolutionApiKey = process.env.EVOLUTION_API_KEY;

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
      }),
    });
    if (!res.ok) {
      return { success: false, message: "Failed to send message" };
    }
    const data = await res.json();
    return { success: true, message: "Message sent successfully", data: data };
  } catch (error) {
    return {
      success: false,
      message: `Error sending message: ${error.message}`,
    };
  }
};
