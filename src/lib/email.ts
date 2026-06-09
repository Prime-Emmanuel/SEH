export const sendAdminNotification = async (subject: string, content: any) => {
  try {
    // We use FormSubmit.co to send emails without requiring server configuration or API keys.
    // The first time this is triggered, it will send an activation email to the target address.
    const response = await fetch("https://formsubmit.co/ajax/felix.njembele@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `Nouvelle notification ImmoPrime: ${subject}`,
        ...content,
      }),
    });

    if (!response.ok) {
      console.error("Erreur lors de l'envoi de l'email via FormSubmit", response.statusText);
    }
  } catch (error) {
    console.error("Erreur réseau lors de l'envoi de l'email", error);
  }
};
