// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { hideModal } from 'actions/index'
import { connect, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import GraphBuilder from 'GraphBuilder'
import ModalWrapper, { useDisplayStyle, useModalCss } from '../ModalWrapper'
import SaveAndPublishButton from './SaveAndPublishButton'
import RDFDisplay from './RDFDisplay'

const RDFModal = (props) => {
  const dispatch = useDispatch()

  const handleClose = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const modal = (
    <div className={ useModalCss(props.show) }
         id="rdf-modal"
         data-testid="rdf-modal"
         tabIndex="-1"
         role="dialog"
         style={{ display: useDisplayStyle(props.show) }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header" data-testid="rdf-modal-header">
            <h4 className="modal-title">RDF Preview</h4>
            <button type="button" className="close" onClick={handleClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body rdf-modal-content">
            <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
              <div className="col-sm-6">If this looks good, then click Save and Publish</div>
              <div className="col-sm-6" style={{ textAlign: 'right' }}>
                <SaveAndPublishButton id="modal-save" />
              </div>
            </div>
            <RDFDisplay rdf={props.rdf()} />
          </div>
        </div>
      </div>
    </div>)

  return (<ModalWrapper modal={modal} />)
}

RDFModal.propTypes = {
  show: PropTypes.bool,
  rdf: PropTypes.func,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.modal === 'RDFModal',
  rdf: () => new GraphBuilder(state.selectorReducer).graph.toCanonical(),
})

export default connect(mapStateToProps, null)(RDFModal)
