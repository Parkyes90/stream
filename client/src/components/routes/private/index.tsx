import Main from "components/pages/privates/main";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
const Private: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Main} />
      <Redirect path="*" to="/" />
    </Switch>
  );
};

export default Private;
