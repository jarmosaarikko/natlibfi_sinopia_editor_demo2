// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { postMarc, getMarcJob, getMarc } from 'sinopiaApi'
import { selectCurrentResource } from 'selectors/resources'
import { saveAs } from 'file-saver'

const MarcButton = () => {
  const currentResource = useSelector((state) => selectCurrentResource(state))
  const [marc, setMarc] = useState(false)
  const [marcUrl, setMarcUrl] = useState(false)
  const [error, setError] = useState(false)

  if (!currentResource.uri || currentResource.subjectTemplate.class !== 'http://id.loc.gov/ontologies/bibframe/Instance') return null

  const marcJobTimer = (marcJobUrl) => {
    getMarcJob(marcJobUrl)
      .then(([url, body]) => {
        if (!url) {
          setTimeout(marcJobTimer, 10000, marcJobUrl)
          return
        }
        setMarc(body)
        setMarcUrl(url)
      })
      .catch((err) => setError(err.message || error))
  }

  const handleRequest = (event) => {
    setMarc(false)
    setMarcUrl(false)
    setError(false)
    postMarc(currentResource.uri)
      .then((marcJobUrl) => {
        marcJobTimer(marcJobUrl)
      })
      .catch((err) => setError(err.message || error))
    event.preventDefault()
  }

  const handleDownloadTxt = (event) => {
    const blob = new Blob([marc], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `record-${currentResource.uri}.txt`)
    event.preventDefault()
  }

  const handleDownloadMarc = (event) => {
    getMarc(marcUrl)
      .then((blob) => {
        saveAs(blob, `record-${currentResource.uri}.mar`)
      })
      .catch((err) => setError(err.message || error))
    event.preventDefault()
  }

  const btnClasses = ['btn', 'dropdown-toggle']
  if (marc) {
    btnClasses.push('btn-success')
  } else if (error) {
    btnClasses.push('btn-danger')
  } else {
    btnClasses.push('btn-primary')
  }

  return (
    <div className="dropleft">
      <button type="button"
              id="marcBtn"
              className={btnClasses.join(' ')}
              aria-label="MARC record"
              title="MARC record"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        MARC
      </button>
      <div className="dropdown-menu" aria-labelledby="marcBtn">
        <button className="btn btn-link dropdown-item" onClick={(event) => handleRequest(event)}>Request conversion to MARC</button>
        { marc
          && <React.Fragment>
            <button className="btn btn-link dropdown-item" onClick={(event) => handleDownloadTxt(event)}>Download text</button>
            <button className="btn btn-link dropdown-item" onClick={(event) => handleDownloadMarc(event)}>Download MARC</button>
            <pre style={{
              marginLeft: '10px', marginRight: '10px', paddingLeft: '10px', paddingRight: '10px',
            }}>{marc}</pre>
          </React.Fragment>
        }
        { error
          && <div className="alert alert-danger" role="alert" style={{
            marginLeft: '10px', marginRight: '10px', paddingLeft: '10px', paddingRight: '10px',
          }}>
            { error }
          </div>
        }
      </div>
    </div>
  )
}

export default MarcButton