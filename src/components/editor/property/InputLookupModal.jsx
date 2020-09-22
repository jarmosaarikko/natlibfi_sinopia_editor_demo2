// Copyright 2020 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { selectModalType } from 'selectors/modals'
import { connect, useSelector, useDispatch } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import _ from 'lodash'
import { itemsForProperty } from './renderTypeaheadFunctions'
import { removeValue } from 'actions/resources'
import { hideModal, showModal } from 'actions/modals'
import { bindActionCreators } from 'redux'
import ModalWrapper from 'components/ModalWrapper'
import Lookup from './Lookup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

const InputLookupModal = (props) => {
  const dispatch = useDispatch()
  const displayValidations = useSelector((state) => displayResourceValidations(state))
  const errors = props.property.errors
  const selected = itemsForProperty(props.property)

  const isRepeatable = props.property.propertyTemplate.repeatable

  const isDisabled = selected?.length > 0 && !isRepeatable

  let error
  let controlClasses = 'open-search-modal btn btn-sm btn-secondary btn-literal form-control'

  if (displayValidations && !_.isEmpty(errors)) {
    controlClasses += ' is-invalid'
    error = errors.join(',')
  }

  const modalId = `InputLookupModal-${props.property.key}`

  const handleClick = (event) => {
    event.preventDefault()
    dispatch(showModal(modalId))
  }

  // TODO: New styling to fit description in #2478
  const lookupSelection = props.lookupValues.map((lookupValue) => (
    <div key={lookupValue.key} className="lookup-value">
      <span key={lookupValue.key}>{lookupValue.label || lookupValue.literal}</span>
      <a href={lookupValue.uri}>
        <span aria-hidden="true"><FontAwesomeIcon className="globe-icon" icon={faGlobe} /></span>
      </a>
      <button onClick={() => props.removeValue(lookupValue.key)}>
        <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
      </button>
    </div>
  ))

  const modal = (
    <Lookup modalId={modalId} property={props.property}
            getLookupResults={props.getLookupResults}
            getOptions={props.getOptions}
            show={props.show}
            hideModal={props.hideModal} />
  )

  return (
    <React.Fragment>
      <button
        id="lookup"
        data-testid="lookup"
        onClick={ handleClick }
        aria-label={'Lookups'}
        disabled={isDisabled}
        className={controlClasses}>
        <FontAwesomeIcon className="search-icon" icon={faSearch} />
      </button>
      {error && <span className="invalid-feedback">{error}</span>}
      { lookupSelection }
      <ModalWrapper modal={modal} />
    </React.Fragment>
  )
}

InputLookupModal.propTypes = {
  property: PropTypes.object.isRequired,
  getLookupResults: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
  show: PropTypes.bool,
  hideModal: PropTypes.func,
  textValue: PropTypes.string,
  lookupValues: PropTypes.array,
  removeValue: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const show = selectModalType(state) === `InputLookupModal-${ownProps.property.key}`
  return {
    lookupValues: ownProps.property.values,
    show,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ removeValue, hideModal }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupModal)
