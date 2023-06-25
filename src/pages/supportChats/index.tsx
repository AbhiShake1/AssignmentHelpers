import React, { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { Button, Input, Loader, Navbar } from "@mantine/core";
import { IconSend, IconUser } from "@tabler/icons-react";
import type { Message } from "@prisma/client";
import { toast } from "react-hot-toast";
import pusher from "~/stores/pusher";
import { Events } from "~/const/events";
import { useAuth } from "@clerk/nextjs";
import { useChatBarStyles } from "~/hooks/useChatBarStyles";

function Index() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const chats = api.chat.supportChats.useQuery();
  const { classes, cx } = useChatBarStyles();
  const [active, setActive] = useState("");
  const [text, setText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const user = useAuth();

  const chat = chats.data?.find((c) => c.fromUserId == active);

  const sendMutation = api.chat.send.useMutation({
    onSuccess: () => {
      setText("");
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (chat) {
      setMsgs(chat.messages);
    }
  }, [active, chat]);

  useEffect(() => {
    if (!chat) return;

    const id = chat.fromUserId;
    // reset before new subscription
    if (!id) return;

    const idStr = `${id}-`;
    pusher.unsubscribe(idStr);
    pusher.unbind(idStr);
    pusher.subscribe(idStr).bind(Events.SEND_MESSAGE, (message: Message) => {
      setMsgs((msgs) => [message, ...msgs]);
    });

    return () => pusher.unsubscribe(id);
  }, [user.userId, chat]);

  useEffect(() => {
    messagesContainerRef.current?.scroll({ behavior: "smooth", top: 0 });
  }, [msgs]);

  if (!chats.isSuccess)
    return (
      <center>
        <Loader />
      </center>
    );

  const links = chats.data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.fromUserId === active,
      })}
      key={item.fromUserId}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.fromUserId || "");
      }}
    >
      <IconUser className={classes.linkIcon} stroke={1.5} />
      <span>{item.fromUser?.name || "Anonymous"}</span>
    </a>
  ));

  return (
    <div className="flex h-[80vh] flex-row">
      <Navbar className="h-full w-2/12" p="md">
        {links}
      </Navbar>
      {chat && msgs.length > 0 && (
        <div
          className="mx-2 mb-[5vh] mt-4 flex h-[60vh] w-9/12 flex-col-reverse space-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          ref={messagesContainerRef}
        >
          {msgs?.map((message) => (
            <div key={message.id} className="flex flex-col-reverse">
              {message.senderId == "" ? (
                <div className="mb-1 flex flex-row">
                  <div className="max-w-xl rounded-b-3xl rounded-tr-3xl bg-blue-300 px-4 py-2">
                    {message.text}
                  </div>
                  <div className="w-full" />
                </div>
              ) : (
                <div className="mb-1 flex flex-row">
                  <div className="w-full" />
                  <div className="max-w-xl rounded-t-3xl rounded-bl-3xl bg-blue-300 px-4 py-2">
                    {message.text}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something.."
            size="lg"
            className="absolute bottom-4 m-4 w-8/12"
            rightSection={
              <Button
                variant="subtle"
                disabled={!text}
                loading={sendMutation.isLoading}
                onClick={() =>
                  sendMutation.mutate({
                    msg: text,
                    to: chat.fromUserId ?? undefined,
                    senderId: "",
                    fromAdmin: true,
                  })
                }
              >
                <IconSend />
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}

export default Index;
