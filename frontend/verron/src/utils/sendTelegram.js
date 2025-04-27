const sendTelegramNotification = async (message) => {
    const telegramToken = '7637006849:AAEcj8c1ORhrcJuNHflqjeVUvlpr-u7-Rxw'; // Remplacez par votre token
    const chatId = '-4653055721'; // Remplacez par l'ID du chat ou du canal
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      const data = await response.json();
      if (data.ok) {
        console.log('Notification Telegram envoyée avec succès !');
      } else {
        console.error('Erreur lors de l\'envoi de la notification Telegram :', data);
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  };

export default sendTelegramNotification