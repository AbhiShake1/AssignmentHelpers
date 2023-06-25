import React from "react";
import { createBoard } from "@wixc3/react-board";
import { Button, Input, Loader, Navbar } from "@mantine/core";

export default createBoard({
  name: "TestChatDialog",
  Board: () => <Button variant="subtle" />,
});
