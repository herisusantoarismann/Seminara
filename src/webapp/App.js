import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  AddSeminar,
  DoneSeminar,
  Home,
  ListParticipants,
  Login,
  MassMailer,
  MonthSeminar,
  NotFound,
  Registration,
  RegistrationSuccess,
  TodaySeminar,
  UpcomingSeminar,
  UpdateSeminar,
} from "./Page";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/app/" exact component={Login} />
        <Route path="/app/dashboard" exact component={Home} />
        <Route path="/app/seminar/done" exact component={DoneSeminar} />
        <Route path="/app/seminar/today" exact component={TodaySeminar} />
        <Route path="/app/seminar/upcoming" exact component={UpcomingSeminar} />
        <Route path="/app/seminar/month" exact component={MonthSeminar} />
        <Route path="/app/mass-mailer" exact component={MassMailer} />
        <Route path="/app/seminar/add" component={AddSeminar} />
        <Route path="/app/seminar/update/:id" component={UpdateSeminar} />
        <Route path="/app/registration/:id" component={Registration} />
        <Route
          path="/app/successful-registration/:idseminar/:id"
          component={RegistrationSuccess}
        />
        <Route path="/app/seminar/detail/:id" component={ListParticipants} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
