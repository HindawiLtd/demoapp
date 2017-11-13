import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Table, Row, Col } from "react-bootstrap"
import "./dashboard.css"

const serviceUrl = process.env.REACT_APP_SERVICE_URL

const mapField = (o, className) => o && <div className={className}>{o.map((v, i) => <p key={`item-${i}`}>{v}</p>)}</div>
const mapFieldAsAnchor = (o, className) =>
  o && (
    <div className={className}>
      {o.map((v, i) => (
        <p key={`item-anchor-${i}`}>
          <Link to={`/resource/edit/${v}`}>{v}</Link>
        </p>
      ))}
    </div>
  )

export class Dashboard extends Component {
  constructor() {
    super()
    this.listRecords()
  }

  state = {
    records: [],
  }

  listRecords = async () => {
    const url = `${serviceUrl}/doi`
    const response = await fetch(url, { method: "get" })
    const records = await response.json()

    this.setState({
      records,
    })
  }

  render() {
    const { records } = this.state

    return (
      <Row>
        <Col smOffset={2} sm={8}>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Title</th>
                <th>Creator</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={`record-${i}`}>
                  <td>{mapFieldAsAnchor([r.message.DOI])}</td>
                  <td>{mapField(r.message.title)}</td>
                  <td>{mapField(r.message.author.map(a => `${a.family}, ${a.given}`), "creator")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    )
  }
}
