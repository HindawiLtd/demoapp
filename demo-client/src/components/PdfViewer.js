import React, { Component } from "react"
import { Document, Page } from "react-pdf/build/entry.webpack"
import "./PdfViewer.css"

export class PdfViewer extends Component {
  state = {
    pageNumber: 1,
    numPages: null,
  }

  onDocumentLoadSuccess = ({ numPages }) =>
    this.setState({
      numPages,
      pageNumber: 1,
    })

  changePage = by =>
    this.setState(prevState => {
      const { pageNumber, numPages } = prevState
      const newPage = pageNumber + by
      if (newPage > 0 && newPage <= numPages) {
        return {
          pageNumber: newPage,
          numPages,
        }
      } else {
        return prevState
      }
    })

  render() {
    const { pageNumber } = this.state

    return (
      <div className="pdf-container">
        <span className="pagination-handle" role="img" aria-label="s" onClick={() => this.changePage(-1)}>
          ⬅️
        </span>
        <span className="pagination-handle" role="img" aria-label="s" onClick={() => this.changePage(1)}>
          ➡️
        </span>
        <Document file={this.props.file} onLoadSuccess={this.onDocumentLoadSuccess}>
          <Page
            key={`page_${pageNumber}`}
            pageNumber={pageNumber}
            onRenderSuccess={this.onPageRenderSuccess}
            width={document.body.clientWidth / 2 - 50}
          />
        </Document>
      </div>
    )
  }
}
