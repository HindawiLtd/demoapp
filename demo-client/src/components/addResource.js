import * as fetch from "isomorphic-fetch"
import React, { Component } from "react"
import { Button, Form, Col, Row, FormGroup, ControlLabel, FormControl, HelpBlock, InputGroup } from "react-bootstrap"
import { changeMeta, storeDoi, doiFetchOK, storeUrl, clearMeta } from "../actions/fetch-actions"
import { connect } from "react-redux"
import { PdfViewer } from "./PdfViewer"

const serviceUrl = process.env.REACT_APP_SERVICE_URL

class AddResourceFormInternal extends Component {
  render() {
    const props = this.props
    const hasContent = props.meta.message && props.meta.message.URL
    return (
      <div>
        <Row>
          <Col smOffset={3} sm={8}>
            <InputForm {...props} />
          </Col>
        </Row>

        <Row>
          <Col sm={12} lg={6}>
            {hasContent ? <MetaForm {...props} /> : ""}
          </Col>
          <Col sm={12} lg={6}>
            {hasContent ? <Preview {...props} /> : ""}
          </Col>
        </Row>
      </div>
    )
  }
}

const InputForm = props => {
  return (
    <div>
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>
            PDF
          </Col>
          <Col sm={4}>
            <InputGroup>
              <FormControl type="text" value={props.pdfUrl} readOnly />
              <InputGroup.Addon>
                <label>
                  Upload&hellip;
                  <input type="file" style={{ display: "none" }} onChange={e => uploadFile(e.target.files, props)} />
                </label>
              </InputGroup.Addon>
            </InputGroup>
          </Col>
        </FormGroup>
        <FieldGroup
          type="text"
          label="DOI"
          width={4}
          value={props.doi}
          postButtonHandler={() => fetchDoi(props.doi, props.fetchOk)}
          onChange={event => props.storeDoi(event.target.value)}
        />
      </Form>
      {props.meta.message.title ? (
        <Form horizontal>
          <Row>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2} />
              <Col sm={1}>
                <Button type="button" onClick={() => save(props)}>
                  Save
                </Button>
              </Col>
            </FormGroup>
          </Row>
        </Form>
      ) : (
        ""
      )}
    </div>
  )
}

const save = async props => {
  const url = `${serviceUrl}/doi/${props.doi}`
  await fetch(url, {
    body: JSON.stringify(props.meta),
    headers: {
      "Content-Type": "application/json",
    },
    method: "put",
  })
}

const MetaForm = props => (
  <section>
    <hr />

    <Form horizontal>
      <FieldGroup
        type="text"
        label="Title"
        value={props.meta.message.title}
        onChange={e => props.changeMeta({ title: [e.target.value] })}
      />

      {props.meta.message.author.map(Author)}

      <FieldGroup
        type="text"
        label="Abstract"
        componentClass="textarea"
        rows={4}
        value={props.meta.message.abstract}
        onChange={e => props.changeMeta({ abstract: e.target.value })}
      />

      <FieldGroup
        type="text"
        label="Publisher"
        value={props.meta.message.publisher}
        onChange={e => props.changeMeta({ publisher: e.target.value })}
      />

      {props.meta.message["published-print"]["date-parts"].map(([year]) => (
        <FieldGroup key={year} type="text" label="Date published" value={year} readOnly />
      ))}

      <FieldGroup
        type="text"
        label="Type"
        value={props.meta.message.type}
        onChange={e => props.changeMeta({ type: e.target.value })}
      />

      <FieldGroup
        type="text"
        label="Language"
        value={props.meta.message.language}
        onChange={e => props.changeMeta({ language: e.target.value })}
      />

      {props.meta.message.link
        .filter(l => l["content-type"] === "application/pdf")
        .map((link, i) => <FieldGroup key={`link-${i}`} type="text" label="Original URL" value={link.URL} readOnly />)}
    </Form>
  </section>
)

const Preview = props =>
  props.meta.message.link.filter(l => l["content-type"] === "application/pdf").map((link, i) => (
    <div key={`preview-${i}`}>
      <hr />
      <Col>
        <PdfViewer key={link["intended-application"]} file={props.pdfUrl} />
      </Col>
    </div>
  ))

const Author = author => {
  return (
    <div key={author.family}>
      <FormGroup controlId={author.family}>
        <Col componentClass={ControlLabel} sm={2}>
          Author
        </Col>
        <Col sm={4}>
          <FormControl type="text" value={author.given} readOnly />
          <FormControl type="text" value={author.family} readOnly />
        </Col>
      </FormGroup>
      <FormGroup controlId={`affiliation-${author.family}`}>
        <Col componentClass={ControlLabel} sm={2} smOffset={1}>
          Affiliations
        </Col>
        <Col sm={9}>
          {author.affiliation.map((affiliation, i) => (
            <FormControl key={`affiliation-${i}`} type="text" value={affiliation.name} readOnly />
          ))}
        </Col>
      </FormGroup>
    </div>
  )
}

const uploadFile = async (files, props) => {
  const body = new FormData()
  body.append("file", files[0])
  const response = await fetch(`${serviceUrl}/files`, {
    method: "post",
    body,
  })

  if (response.ok) {
    const result = await response.json()
    if (result.doi) {
      props.storeDoi(result.doi)
      props.storeUrl(`${serviceUrl}${result.file}`)
      fetchDoi(result.doi, props.fetchOk)
    }
  }
}

const fetchDoi = async (doi, fetchOk) => {
  const url = `${serviceUrl}/doi/${doi}`
  const r = await fetch(url, {
    method: "get",
  })
  const result = await r.json()
  fetchOk(result)
}

const FieldGroup = ({ id, label, help, width, postButtonHandler, ...props }) => {
  return (
    <FormGroup controlId={id}>
      <Col componentClass={ControlLabel} sm={2}>
        {label}
      </Col>
      <Col sm={width || 10}>
        {postButtonHandler ? (
          <InputGroup>
            <FormControl {...props} />
            <InputGroup.Addon>
              <a onClick={postButtonHandler}>Get</a>
            </InputGroup.Addon>
          </InputGroup>
        ) : (
          <FormControl {...props} />
        )}
        {help && <HelpBlock>{help}</HelpBlock>}
      </Col>
    </FormGroup>
  )
}

const mapStateToProps = (state, props) => {
  return {
    pdfUrl: state.meta.pdfUrl,
    doi: state.meta.doi,
    meta: state.meta.meta,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const actions = {
    storeDoi: doi => dispatch(storeDoi(doi)), // setState(doi)
    storeUrl: url => dispatch(storeUrl(url)), // setState(url)
    fetchOk: meta => dispatch(doiFetchOK(meta)), // setState(meta)
    changeMeta: meta => dispatch(changeMeta({ message: meta })), // setState(meta)
    clearMeta: () => dispatch(clearMeta()),
  }

  // componentWillMount + setState
  const editDoi = props.match.params[0]
  if (editDoi) {
    actions.storeDoi(editDoi)
    actions.storeUrl(`${serviceUrl}/files/${editDoi}/content.pdf`)
    fetchDoi(editDoi, actions.fetchOk)
  } else {
    actions.clearMeta()
  }
  return actions
}

export const AddResourceForm = connect(mapStateToProps, mapDispatchToProps)(AddResourceFormInternal)
