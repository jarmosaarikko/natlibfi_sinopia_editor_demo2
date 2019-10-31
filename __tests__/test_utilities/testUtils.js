// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'

import React from 'react'
import { Provider } from 'react-redux'
// Will use for testing generated RDF.
import RDFModal from 'components/editor/RDFModal'
import { render, fireEvent } from '@testing-library/react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import appReducer from 'reducers/index'
import { MemoryRouter } from 'react-router-dom'

export const renderWithRedux = (ui, store) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}

export const renderWithReduxAndRouter = (ui, store, initialEntries) => {
  return {
    ...render(
      <MemoryRouter initialEntries={initialEntries}>
        <Provider store={store}>{ui}</Provider>
      </MemoryRouter>,
    ),
  }
}

export const createReduxStore = (initialState) => {
  return createStore(appReducer, initialState, applyMiddleware(thunk))
}

export const assertRDF = async (store, triples) => {
  // For this to work, show for rdfPreview must be set to true and groupChoice to false
  expect(store.getState().selectorReducer.editor.rdfPreview.show).toBe(true)
  expect(store.getState().selectorReducer.editor.groupChoice.show).toBe(false)
  const { findByText, findByLabelText } = renderWithRedux(
    <RDFModal />, store,
  )

  fireEvent.change(await findByLabelText(/Format/), { target: { value: 'n-triples' } })
  await Promise.all(
    triples.map(async (triple) => {
      expect(await findByText(triple, { exact: false })).toBeInTheDocument()
    }),
  )
}

export const setupModal = () => {
  const portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', 'modal')
  document.body.appendChild(portalRoot)
}
