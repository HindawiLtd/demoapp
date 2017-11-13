import React from "react"
import { Link, Route, Switch } from "react-router-dom"
import { Col, Navbar, Nav } from "react-bootstrap"
import { AddResourceForm } from "./components/addResource"
import { Harvest } from "./components/harvest"
import { Dashboard } from "./components/dashboard"
import "./app.css"

export const App = () => {
  return (
    <div className="App">
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Open Nodes</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/resource/add">Add Resource</Link>
          </li>
          <li>
            <Link to="/resource/harvest">Harvest resources</Link>
          </li>
        </Nav>
      </Navbar>

      <Col smOffset={0} sm={12}>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/resource/add" component={AddResourceForm} />
          <Route path="/resource/edit/*" component={AddResourceForm} />
          <Route exact path="/resource/harvest" component={Harvest} />
        </Switch>
      </Col>
    </div>
  )
}
