import { sendPushNotification } from "@/api/api";
import { NotificationMessageInterface } from "@/api/apiInterface";
import { useNotification } from "@/components/NotificationProvider";
import { useState } from "react";
import { Button, Text, View } from "react-native";

export default function Index() {
  const { expoPushToken, notification } = useNotification();
  const [notificationMessage, setNotificationMessage] = useState<NotificationMessageInterface>({
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
});
  
  return (
    <View>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Button 
        title="Send Notification" 
        onPress={() => sendPushNotification(notificationMessage)}
      />
    </View>
  );
}
