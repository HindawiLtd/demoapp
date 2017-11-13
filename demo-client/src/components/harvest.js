import React, { Component } from "react"
import { Row, Col, Table, DropdownButton, MenuItem } from "react-bootstrap"
import "./harvest.css"

const serviceUrl = process.env.REACT_APP_SERVICE_URL

const mapField = (o, className) => o && <div className={className}>{o.map((v, i) => <p key={`${i}`}>{v}</p>)}</div>

export class Harvest extends Component {
  state = {
    records: [],
    sources: [],
    busy: false,
  }

  componentWillMount(props) {
    this.getSources()
  }

  harvestMetadata = async key => {
    const url = `${serviceUrl}/records/${key}`
    try {
      this.busy()
      const response = await fetch(url, { method: "get" })
      if (response.ok) {
        const records = await response.json()

        this.setState(previous => ({
          ...previous,
          records,
        }))
      }
    } finally {
      this.free()
    }
  }

  busy() {
    this.setState(state => ({
      ...state,
      busy: true,
    }))
  }

  free() {
    this.setState(state => ({
      ...state,
      busy: false,
    }))
  }

  getSources = async () => {
    const url = `${serviceUrl}/sources`
    this.busy()
    try {
      const response = await fetch(url, { method: "get" })
      if (response.ok) {
        const sources = await response.json()

        this.setState(previous => ({
          ...previous,
          sources,
        }))
      }
    } finally {
      this.free()
    }
  }

  render() {
    const { records, sources, busy } = this.state

    return (
      <Row>
        <Col smOffset={2} sm={8}>
          <Row>
            <Col sm={1}>
              <DropdownButton id="sources" title="Get" disabled={busy}>
                {sources.map((s, i) => (
                  <MenuItem key={`source-${i}`} onClick={() => this.harvestMetadata(s.key)}>
                    {s.name}
                  </MenuItem>
                ))}
              </DropdownButton>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm={12}>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>
                      <span role="img" aria-label="">
                        ☑️
                      </span>
                    </th>
                    <th>Title</th>
                    <th>Creator</th>
                    <th>Date</th>
                    <th>Identifier</th>
                    <th>Source</th>
                    <th>Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={`${i}`}>
                      <td />
                      <td>{mapField(r.title)}</td>
                      <td>{mapField(r.creator, "creator")}</td>
                      <td>{mapField(r.date, "date")}</td>
                      <td>{mapField(r.identifier)}</td>
                      <td>
                        {mapField(r.source)}
                        {mapField(r.publisher)}
                      </td>
                      <td>{mapField(r.subject)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
