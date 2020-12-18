import Main from "components/pages/privates/main";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Chat from "../../pages/privates/chat";
import Video from "../../pages/privates/video";
const Private: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/chat" exact component={Chat} />
      <Route path="/video" exact component={Video} />
      <Redirect path="*" to="/" />
    </Switch>
  );
};

export default Private;
