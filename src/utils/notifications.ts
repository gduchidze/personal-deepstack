import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const setupNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  return true;
};

export const scheduleNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const notifications = [
    { hour: 7, minute: 30, title: 'გაიღვიძე', body: 'დროა დაიწყო პროტოკოლი.' },
    { hour: 8, minute: 0, title: 'DEEP WORK', body: 'როუდმაპი დაიწყო. ტელეფონი გადადე!' },
    { hour: 10, minute: 30, title: 'სამსახური 1', body: 'ფოკუს ბლოკი დაიწყო.' },
    { hour: 12, minute: 15, title: 'STANDUP', body: 'მოემზადე შეხვედრისთვის.' },
    { hour: 17, minute: 0, title: 'სამსახური 2', body: 'დაიწყე მუშაობა.' },
    { hour: 20, minute: 0, title: 'GYM', body: 'დროა ფიზიკური დატვირთვისთვის.' },
    { hour: 23, minute: 0, title: 'SLEEP', body: 'დაიძინე. ძილი მუშაობის ნაწილია.' },
  ];

  for (const notif of notifications) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notif.title,
        body: notif.body,
        sound: true,
      },
      trigger: {
        hour: notif.hour,
        minute: notif.minute,
        repeats: true,
      },
    });
  }
};
