import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat, mainUser }) => {
  const navigation = useNavigation();

  // var user = chat.users.items[0].user;
  // if (mainUser.attributes.sub === user.id) {
  //   user = chat.users.items[1].user;
  // }

  const userItem = chat.users.items.find((item) => item.user.id != mainUser.attributes.sub);
  const user = userItem.user;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Chat", { id: chat.id, name: user?.name })
      }
      style={styles.container}
    >
      {/* User Avatar */}
      <Image source={{ uri: user?.image }} style={styles.image} />

      {/* content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {user?.name}
          </Text>

          <Text style={styles.subTitle}>
            {dayjs(chat.LastMessage?.createdAt).fromNow()}
          </Text>
        </View>

        <Text style={styles.subTitle} numberOfLines={2}>
          {chat.LastMessage?.text}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});

export default ChatListItem;
